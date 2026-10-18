import { getApps, initializeApp } from 'firebase/app';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';
import {
  doc,
  getDocFromServer,
  getFirestore,
} from 'firebase/firestore';
import {
  get,
  getDatabase,
  onValue,
  ref,
  update,
} from 'firebase/database';
import { ValveState, SwitchState } from '../types/actuators';
import type { SafetyData } from '../types/device';

// These are Firebase's public web-app settings. Access is controlled by Firebase
// Authentication and database security rules, never by keeping this API key secret.
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyC46juSVpwoSaNgf_LOwt_zlUxfT2pmdFk',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'gasgaurd-e6009.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'gasgaurd-e6009',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'gasgaurd-e6009.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '44500050866',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:44500050866:web:43197f2ee402e288347aab',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-QHMV7GKKDH',
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || 'https://gasgaurd-e6009-default-rtdb.firebaseio.com',
};

export const RTDB_BASE_URL = firebaseConfig.databaseURL;
export const RTDB_DEVICE_ID = import.meta.env.VITE_DEVICE_ID || 'gasguard-001';
export const userFirebaseConfig = firebaseConfig;
export const app = getApps().find((candidate) => candidate.name === '[DEFAULT]')
  ?? initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const firestoreDb = getFirestore(app);
export const realtimeDb = getDatabase(app, firebaseConfig.databaseURL);
export const userApp = app;
export const userRtdb = realtimeDb;
export const userFirestore = firestoreDb;

export let analytics: ReturnType<typeof getAnalytics> | null = null;
if (typeof window !== 'undefined') {
  isSupported()
    .then((supported) => {
      if (supported) analytics = getAnalytics(app);
    })
    .catch(() => {
      // Analytics is optional and may not be available in embedded browsers.
    });
}

export interface FirebaseActuatorPayload {
  valve: ValveState;
  powerCut: SwitchState;
  fan: SwitchState;
  buzzer: SwitchState;
  extinguisher: SwitchState;
  updatedAt: number;
  lastChangedBy?: string;
  source?: string;
}

export interface FirebaseTelemetryPayload {
  deviceId: string;
  available: { gas: boolean; smoke: boolean; temperature: boolean; humidity: boolean; flame: boolean };
  gas?: number;
  gasTimestamp?: number;
  smoke?: number;
  smokeTimestamp?: number;
  temperature?: number;
  temperatureTimestamp?: number;
  humidity?: number;
  humidityTimestamp?: number;
  flame?: boolean;
  flameTimestamp?: number;
  updatedAt: number;
}

export interface FirebaseDiagnosticResult {
  userRtdbReachable: boolean;
  userRtdbWritable: boolean;
  userRtdbError?: string;
  userProjectId: string;
  userRtdbUrl: string;
  userFirestoreReachable: boolean;
  userFirestoreWritable: boolean;
  userFirestoreError?: string;
  provisionedConnected: boolean;
  provisionedDatabaseId: string;
  provisionedProjectId: string;
  provisionedError?: string;
  authAuthenticated: boolean;
  authEmail?: string;
  testedAt: number;
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

/** Check whether the current signed-in session can reach each configured database. */
export async function testFirebaseDiagnostics(): Promise<FirebaseDiagnosticResult> {
  const result: FirebaseDiagnosticResult = {
    userRtdbReachable: false,
    userRtdbWritable: false,
    userProjectId: firebaseConfig.projectId,
    userRtdbUrl: RTDB_BASE_URL,
    userFirestoreReachable: false,
    userFirestoreWritable: false,
    provisionedConnected: false,
    provisionedDatabaseId: '(default)',
    provisionedProjectId: firebaseConfig.projectId,
    authAuthenticated: !!auth.currentUser,
    authEmail: auth.currentUser?.email || undefined,
    testedAt: Date.now(),
  };

  try {
    await get(ref(realtimeDb, `devices/${RTDB_DEVICE_ID}/actuators`));
    result.userRtdbReachable = true;
  } catch (error) {
    result.userRtdbError = getErrorMessage(error);
  }

  try {
    await getDocFromServer(doc(firestoreDb, 'actuators', 'current'));
    result.userFirestoreReachable = true;
    result.provisionedConnected = true;
  } catch (error) {
    result.userFirestoreError = getErrorMessage(error);
    result.provisionedError = result.userFirestoreError;
  }

  return result;
}

/** Persist a partial actuator update to the project's live actuator records. */
export async function updateActuatorsInFirebase(
  actuators: Partial<FirebaseActuatorPayload>,
  changedBy = auth.currentUser?.email || 'SanketSeva Web Console'
): Promise<{ success: boolean; error?: string; provisionedOk?: boolean; userOk?: boolean }> {
  const timestamp = Date.now();
  const commandId = `cmd-${timestamp.toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  const writes: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(actuators)) {
    if (!['valve', 'fan', 'buzzer', 'extinguisher', 'powerCut'].includes(key)) continue;
    // Preserve the original device schema: actuator values are stored as
    // strings at devices/{id}/actuators/{name}. The controller reads these
    // values directly, so wrapping them in a { state, lastChanged } object
    // can make it ignore a command and restore its previous output.
    writes[`devices/${RTDB_DEVICE_ID}/actuators/${key}`] = value;
    writes[`devices/${RTDB_DEVICE_ID}/commands/${key}`] = {
      command: value,
      commandId,
      issuedBy: changedBy,
      timestamp,
    };
  }
  writes[`devices/${RTDB_DEVICE_ID}/actuators/updatedAt`] = timestamp;
  writes[`devices/${RTDB_DEVICE_ID}/actuators/lastChangedBy`] = changedBy;

  try {
    // Use the existing ESP32 schema and one RTDB multi-location write. This
    // avoids waiting on a separate Firestore request before releasing controls.
    await update(ref(realtimeDb), writes);
    return { success: true, userOk: true };
  } catch (error) {
    return { success: false, userOk: false, error: getErrorMessage(error) };
  }
}

/** Save operator safety thresholds and auto-cutoff switches for the edge device. */
export async function updateSafetySettingsInFirebase(
  settings: Partial<SafetyData>,
  deviceId: string
): Promise<{ success: boolean; error?: string }> {
  const timestamp = Date.now();
  try {
    await update(ref(realtimeDb, `devices/${deviceId}/safety`), {
      ...settings,
      updatedAt: timestamp,
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: getErrorMessage(error) };
  }
}

/** Subscribe to actuator records in the existing ESP32 Realtime Database schema. */
export function subscribeToFirebaseActuators(
  onUpdate: (data: FirebaseActuatorPayload) => void,
  onError?: (error: Error) => void
): () => void {
  return onValue(
    ref(realtimeDb, `devices/${RTDB_DEVICE_ID}/actuators`),
    (snapshot) => {
      const value = snapshot.val();
      if (!value || typeof value !== 'object') return;
      const normalized: Partial<FirebaseActuatorPayload> = {};
      for (const key of ['valve', 'powerCut', 'fan', 'buzzer', 'extinguisher'] as const) {
        const item = value[key];
        const state = item && typeof item === 'object' ? item.state : item;
        if (typeof state === 'string') normalized[key] = state as never;
      }
      onUpdate(normalized as FirebaseActuatorPayload);
    },
    (error) => onError?.(error)
  );
}

/** Subscribe to live sensor values stored alongside the ESP32 device record. */
export function subscribeToFirebaseTelemetry(
  deviceId: string,
  onUpdate: (data: FirebaseTelemetryPayload) => void,
  onError?: (error: Error) => void
): () => void {
  return onValue(
    ref(realtimeDb, `devices/${deviceId}`),
    (snapshot) => {
      const device = snapshot.val();
      const sensors = device?.sensors;
      if (!sensors) return;
      const gas = Number(sensors.gas?.value);
      const gasTimestamp = Number(sensors.gas?.timestamp);
      const smoke = Number(sensors.smoke?.value);
      const smokeTimestamp = Number(sensors.smoke?.timestamp);
      const temperature = Number(sensors.temperature?.value);
      const temperatureTimestamp = Number(sensors.temperature?.timestamp);
      const humidity = Number(sensors.humidity?.value);
      const humidityTimestamp = Number(sensors.humidity?.timestamp);
      const flame = sensors.flame?.detected;
      const flameTimestamp = Number(sensors.flame?.timestamp);

      const payload: FirebaseTelemetryPayload = {
        deviceId,
        updatedAt: 0,
        available: { gas: false, smoke: false, temperature: false, humidity: false, flame: false },
      };
      if (Number.isFinite(gas) && Number.isFinite(gasTimestamp) && gasTimestamp > 0) {
        payload.gas = gas;
        payload.gasTimestamp = gasTimestamp;
        payload.available.gas = true;
      }
      if (Number.isFinite(smoke) && Number.isFinite(smokeTimestamp) && smokeTimestamp > 0) {
        payload.smoke = smoke;
        payload.smokeTimestamp = smokeTimestamp;
        payload.available.smoke = true;
      }
      if (Number.isFinite(temperature) && Number.isFinite(temperatureTimestamp) && temperatureTimestamp > 0) {
        payload.temperature = temperature;
        payload.temperatureTimestamp = temperatureTimestamp;
        payload.available.temperature = true;
      }
      if (Number.isFinite(humidity) && Number.isFinite(humidityTimestamp) && humidityTimestamp > 0) {
        payload.humidity = humidity;
        payload.humidityTimestamp = humidityTimestamp;
        payload.available.humidity = true;
      }
      if (typeof flame === 'boolean' && Number.isFinite(flameTimestamp) && flameTimestamp > 0) {
        payload.flame = flame;
        payload.flameTimestamp = flameTimestamp;
        payload.available.flame = true;
      }

      const timestamps = [
        payload.available.gas ? gasTimestamp : 0,
        payload.available.smoke ? smokeTimestamp : 0,
        payload.available.temperature ? temperatureTimestamp : 0,
        payload.available.humidity ? humidityTimestamp : 0,
        payload.available.flame ? flameTimestamp : 0,
      ].filter((timestamp) => Number.isFinite(timestamp) && timestamp > 0);
      if (timestamps.length === 0) return;
      payload.updatedAt = Math.max(...timestamps);
      onUpdate(payload);
    },
    (error) => onError?.(error)
  );
}
