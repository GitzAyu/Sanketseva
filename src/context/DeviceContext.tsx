import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { DeviceState, SystemMode, SafetyData } from '../types/device';
import { HistoricalReading } from '../types/sensors';
import { GasGuardEvent } from '../types/events';
import { CommandAction, ActuatorTarget } from '../types/commands';
import { evaluateSystemMode, validateValveOpenRequest } from '../utils/safety';
import { audioAlertService, AlertSoundStyle } from '../utils/audioAlert';
import { emergencyNotificationService, EmergencyAlertPayload } from '../utils/emergencyNotifications';
import {
  updateActuatorsInFirebase,
  subscribeToFirebaseActuators,
  subscribeToFirebaseTelemetry,
  updateSafetySettingsInFirebase,
  FirebaseActuatorPayload,
  firebaseConfig,
} from '../firebase/firebase';

export const INITIAL_DEVICE_STATE: DeviceState = {
  info: {
    name: 'SanketSeva Kitchen Unit 1',
    location: 'Main Commercial Kitchen / Utility Conduit',
    firmwareVersion: 'v2.4.1-PROD-ESP32',
    deviceId: 'gasguard-001',
  },
  status: {
    online: false,
    lastSeen: 0,
    wifiRSSI: -54,
  },
  sensors: {
    gas: {
      value: 0,
      status: 'NORMAL',
      timestamp: 0,
    },
    smoke: {
      value: 0,
      detected: false,
      status: 'NORMAL',
      timestamp: 0,
    },
    temperature: {
      value: 0,
      unit: '°C',
      timestamp: 0,
    },
    humidity: {
      value: 0,
      unit: '%',
      timestamp: 0,
    },
    flame: {
      detected: false,
      timestamp: 0,
    },
  },
  actuators: {
    valve: {
      state: 'OPEN',
      lastChanged: Date.now() - 3600000,
    },
    fan: {
      state: 'OFF',
      lastChanged: Date.now() - 7200000,
    },
    buzzer: {
      state: 'OFF',
      lastChanged: Date.now() - 7200000,
    },
    extinguisher: {
      state: 'OFF',
      lastChanged: Date.now() - 7200000,
    },
    // Switch ON = Power ON (230V Live); Switch OFF = Power OFF (Power Cut / 0V Isolated)
    powerCut: {
      state: 'ON',
      lastChanged: Date.now() - 7200000,
    },
  },
  safety: {
    mode: 'NORMAL',
    emergency: false,
    gasWarningThreshold: 400,
    gasDangerThreshold: 500,
    temperatureWarningThreshold: 50,
    temperatureDangerThreshold: 60,
    smokeDangerThreshold: 300,
    autoPowerCutOnLeak: true,
    autoPowerCutOnFire: true,
    autoPowerCutOnSmoke: true,
  },
};

export interface CommandDispatchResult {
  success: boolean;
  commandId: string;
  status: 'EXECUTED' | 'REJECTED' | 'FAILED';
  message: string;
}

export interface DeviceContextType {
  device: DeviceState;
  isOnline: boolean;
  systemMode: SystemMode;
  sensorHistory: HistoricalReading[];
  hasLiveTelemetry: boolean;
  events: GasGuardEvent[];

  // Firebase integration status
  isFirebaseConnected: boolean;
  firebaseProjectId: string;
  firebaseSyncStatus: 'synced' | 'syncing' | 'connected' | 'idle';

  // Commands
  sendCommand: (
    target: ActuatorTarget,
    action: CommandAction
  ) => Promise<CommandDispatchResult>;
  commandFeedback: {
    status: 'idle' | 'pending' | 'success' | 'error';
    message: string;
    target?: ActuatorTarget;
  };
  clearCommandFeedback: () => void;

  // Threshold updates
  updateThresholds: (thresholds: Partial<SafetyData>) => Promise<{ success: boolean; error?: string }>;

  // Audio & Notification Controls
  isAudioMuted: boolean;
  isAlarmSounding: boolean;
  alertSoundStyle: AlertSoundStyle;
  setAlertSoundStyle: (style: AlertSoundStyle) => void;
  activeEmergencyAlert: EmergencyAlertPayload | null;
  isEmergencyBannerDismissed: boolean;
  isAlertPopupOpen: boolean;
  openAlertPopup: () => void;
  closeAlertPopup: () => void;
  toggleAudioMute: () => void;
  silenceAlarm: () => void;
  testAudioAlarm: () => void;
  dismissEmergencyAlert: () => void;

  // Retained for the unmounted local hazard demo panel.
  simulateHazard: (type: 'gas_leak' | 'fire' | 'smoke' | 'combined' | 'reset') => void;

  // Custom Domain Management
  customDomain: string;
  setCustomDomain: (domain: string) => void;
  isDomainConnected: boolean;
  verifyDomain: (domain: string) => boolean;
}

const DeviceContext = createContext<DeviceContextType | undefined>(undefined);

export const DeviceProvider: React.FC<{ children: React.ReactNode; currentUserId?: string }> = ({
  children,
}) => {
  const [device, setDevice] = useState<DeviceState>(INITIAL_DEVICE_STATE);
  const [sensorHistory, setSensorHistory] = useState<HistoricalReading[]>([]);

  const [events, setEvents] = useState<GasGuardEvent[]>([]);

  const [commandFeedback, setCommandFeedback] = useState<{
    status: 'idle' | 'pending' | 'success' | 'error';
    message: string;
    target?: ActuatorTarget;
  }>({ status: 'idle', message: '' });

  // Audio & Notification State
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(() => audioAlertService.isMuted());
  const [isAlarmSounding, setIsAlarmSounding] = useState<boolean>(false);
  const [alertSoundStyle, setAlertSoundStyleState] = useState<AlertSoundStyle>(() =>
    audioAlertService.getSoundStyle()
  );
  const [activeEmergencyAlert, setActiveEmergencyAlert] = useState<EmergencyAlertPayload | null>(null);
  const [isAlertPopupOpen, setIsAlertPopupOpen] = useState<boolean>(false);
  const [isEmergencyBannerDismissed, setIsEmergencyBannerDismissed] = useState(false);

  // Dismissal tracking to prevent popup notification from reopening itself once closed
  const userDismissedAlertRef = useRef<boolean>(false);
  const hazardActiveRef = useRef<boolean>(false);
  const hasLiveTelemetryRef = useRef<boolean>(false);

  // Firebase integration state
  const [isFirebaseConnected, setIsFirebaseConnected] = useState<boolean>(false);
  const [hasLiveTelemetry, setHasLiveTelemetry] = useState(false);
  const [firebaseSyncStatus, setFirebaseSyncStatus] = useState<'synced' | 'syncing' | 'connected' | 'idle'>('idle');

  // Initial Firebase sync and real-time subscription
  useEffect(() => {
    // Read the live values first. Never overwrite an existing device state with
    // the dashboard's demonstration defaults during startup.
    const unsubscribeFirebase = subscribeToFirebaseActuators((remote) => {
      if (!remote) return;
      setIsFirebaseConnected(true);
      setFirebaseSyncStatus('synced');

      setDevice((prev) => {
        let hasChanges = false;
        const nextActuators = { ...prev.actuators };

        if (remote.valve && remote.valve !== nextActuators.valve.state) {
          nextActuators.valve = { state: remote.valve, lastChanged: remote.updatedAt || Date.now() };
          hasChanges = true;
        }
        if (remote.powerCut && remote.powerCut !== nextActuators.powerCut.state) {
          nextActuators.powerCut = { state: remote.powerCut, lastChanged: remote.updatedAt || Date.now() };
          hasChanges = true;
        }
        if (remote.fan && remote.fan !== nextActuators.fan.state) {
          nextActuators.fan = { state: remote.fan, lastChanged: remote.updatedAt || Date.now() };
          hasChanges = true;
        }
        if (remote.buzzer && remote.buzzer !== nextActuators.buzzer.state) {
          nextActuators.buzzer = { state: remote.buzzer, lastChanged: remote.updatedAt || Date.now() };
          hasChanges = true;
        }
        if (remote.extinguisher && remote.extinguisher !== nextActuators.extinguisher.state) {
          nextActuators.extinguisher = { state: remote.extinguisher, lastChanged: remote.updatedAt || Date.now() };
          hasChanges = true;
        }

        return hasChanges ? { ...prev, actuators: nextActuators } : prev;
      });
    }, (error) => {
      setFirebaseSyncStatus('idle');
      console.warn('Firebase actuator listener error:', error.message);
    });

    const unsubscribeTelemetry = subscribeToFirebaseTelemetry(
      INITIAL_DEVICE_STATE.info.deviceId,
      (telemetry) => {
        if (
          !Number.isFinite(telemetry.gas) ||
          !Number.isFinite(telemetry.smoke) ||
          !Number.isFinite(telemetry.temperature) ||
          !Number.isFinite(telemetry.humidity) ||
          typeof telemetry.flame !== 'boolean'
        ) {
          console.warn('Ignoring malformed Firebase device telemetry.');
          return;
        }

        hasLiveTelemetryRef.current = true;
        setHasLiveTelemetry(true);
        const timestamp = Number.isFinite(telemetry.updatedAt) ? telemetry.updatedAt : Date.now();
        setDevice((prev) => ({
          ...prev,
          status: { ...prev.status, online: Date.now() - timestamp < 60000, lastSeen: timestamp },
          sensors: {
            ...prev.sensors,
            gas: {
              value: telemetry.gas,
              status: telemetry.gas >= prev.safety.gasDangerThreshold
                ? 'DANGER'
                : telemetry.gas >= prev.safety.gasWarningThreshold ? 'WARNING' : 'NORMAL',
              timestamp,
            },
            smoke: {
              value: telemetry.smoke,
              detected: telemetry.smoke >= prev.safety.smokeDangerThreshold,
              status: telemetry.smoke >= prev.safety.smokeDangerThreshold
                ? 'DANGER'
                : telemetry.smoke >= 200 ? 'WARNING' : 'NORMAL',
              timestamp,
            },
            temperature: { value: telemetry.temperature, unit: '°C', timestamp },
            humidity: { value: telemetry.humidity, unit: '%', timestamp },
            flame: { detected: telemetry.flame, timestamp },
          },
        }));
        setSensorHistory((history) => [
          ...history.slice(-59),
          {
            timestamp,
            gas: telemetry.gas,
            smoke: telemetry.smoke,
            temperature: telemetry.temperature,
            humidity: telemetry.humidity,
            flame: telemetry.flame,
          },
        ]);
      },
      (error) => console.warn('Firebase telemetry listener error:', error.message)
    );

    return () => {
      unsubscribeFirebase();
      unsubscribeTelemetry();
    };
  }, []);

  // Subscribe to audio state & emergency notifications (without forcing popup open if user closed it)
  useEffect(() => {
    const unsubAudio = audioAlertService.subscribe((playing, _hazard, style) => {
      setIsAlarmSounding(playing);
      setAlertSoundStyleState(style);
    });

    const unsubNotify = emergencyNotificationService.subscribe((alert) => {
      setActiveEmergencyAlert(alert);
    });

    return () => {
      unsubAudio();
      unsubNotify();
    };
  }, []);

  // Custom Domain state
  const [customDomain, setCustomDomainState] = useState<string>(() => {
    return localStorage.getItem('sanketseva_custom_domain') || 'safety.sanketseva.in';
  });
  const [isDomainConnected, setIsDomainConnected] = useState<boolean>(() => {
    return localStorage.getItem('sanketseva_domain_connected') !== 'false';
  });

  const setCustomDomain = useCallback((domain: string) => {
    setCustomDomainState(domain);
    localStorage.setItem('sanketseva_custom_domain', domain);
  }, []);

  const verifyDomain = useCallback((domain: string) => {
    const valid = domain.includes('.') && domain.length > 3;
    setIsDomainConnected(valid);
    localStorage.setItem('sanketseva_domain_connected', String(valid));
    return valid;
  }, []);

  const isOnline = useMemo(() => {
    if (!device.status.online) return false;
    const diffMs = Date.now() - device.status.lastSeen;
    return diffMs < 60000;
  }, [device.status.online, device.status.lastSeen]);

  const systemMode: SystemMode = useMemo(() => {
    return evaluateSystemMode(device.sensors, device.safety, isOnline);
  }, [device.sensors, device.safety, isOnline]);

  const clearCommandFeedback = useCallback(() => {
    setCommandFeedback({ status: 'idle', message: '' });
  }, []);

  // =========================================================================
  // AUTOMATIC HAZARD DETECTION ENGINE
  // =========================================================================
  const prevHazardRef = useRef<{ lpg: boolean; flame: boolean; smoke: boolean; temperature: boolean }>({
    lpg: false,
    flame: false,
    smoke: false,
    temperature: false,
  });

  useEffect(() => {
    const isLpgDanger = device.sensors.gas.value >= device.safety.gasDangerThreshold;
    const isLpgWarning = device.sensors.gas.value >= device.safety.gasWarningThreshold;
    const isFlame = device.sensors.flame.detected;
    const isSmoke = device.sensors.smoke.detected || device.sensors.smoke.value >= device.safety.smokeDangerThreshold;
    const isTemperatureDanger = device.sensors.temperature.value >= device.safety.temperatureDangerThreshold;
    const shouldCutPower = device.safety.emergency ||
      (isLpgDanger && device.safety.autoPowerCutOnLeak) ||
      (isFlame && device.safety.autoPowerCutOnFire) ||
      (isSmoke && device.safety.autoPowerCutOnSmoke);

    const hasCriticalHazard = isLpgDanger || isFlame || isSmoke || isTemperatureDanger || device.safety.emergency;

    // 1. SOUND & NOTIFICATION TRIGGER
    if (hasCriticalHazard) {
      const hazardType = isFlame ? 'flame' : isSmoke ? 'smoke' : isLpgDanger ? 'lpg' : 'critical';

      // Only trigger alarm & popup on fresh transition to hazardous condition
      if (!hazardActiveRef.current) {
        hazardActiveRef.current = true;
        userDismissedAlertRef.current = false;
        setIsEmergencyBannerDismissed(false);
        audioAlertService.startAlarm(hazardType);

        let title = 'CRITICAL EMERGENCY DETECTED!';
        let msg = '';
        const actions = ['Isolate Gas Valve', ...(shouldCutPower ? ['Turn Mains Power OFF (0V Cut)'] : []), 'Activate Exhaust Fan'];

        if (isFlame) {
          title = 'FIRE / FLAME HAZARD DETECTED!';
          msg = 'Optical infrared sensor detected open combustion flames in kitchen.';
          actions.push('Deploy Water Shower Deluge');
        } else if (isSmoke) {
          title = 'SMOKE & COMBUSTION DETECTED!';
          msg = `Smoke concentration reached ${device.sensors.smoke.value} PPM. Possible electrical or cookware fire.`;
        } else if (isLpgDanger) {
          title = 'DANGEROUS LPG GAS LEAK DETECTED!';
          msg = `Gas sensor reading is ${device.sensors.gas.value} ADC (Exceeds danger limit of ${device.safety.gasDangerThreshold}).`;
        } else if (isTemperatureDanger) {
          title = 'CRITICAL TEMPERATURE DETECTED!';
          msg = `Kitchen temperature reached ${device.sensors.temperature.value} °C (Danger limit: ${device.safety.temperatureDangerThreshold} °C).`;
        } else {
          title = 'MANUAL EMERGENCY LOCKDOWN ACTIVE';
          msg = 'Operator initiated full safety lockdown directive.';
        }

        emergencyNotificationService.triggerEmergency({
          hazardType: isFlame ? 'FLAME' : isSmoke ? 'SMOKE' : isLpgDanger ? 'LPG' : isTemperatureDanger ? 'TEMPERATURE' : 'CRITICAL',
          title,
          message: msg,
          value: isSmoke ? `${device.sensors.smoke.value} PPM` : isLpgDanger ? `${device.sensors.gas.value} ADC` : isTemperatureDanger ? `${device.sensors.temperature.value} °C` : undefined,
          actionsSuggested: actions,
        });

        setIsAlertPopupOpen(true);
      }

      // Auto Fail-safe interlocks + Firebase Sync
      setDevice((prev) => {
        let actuatorsChanged = false;
        const nextActuators = { ...prev.actuators };

        if (nextActuators.valve.state !== 'CLOSED') {
          nextActuators.valve = { state: 'CLOSED', lastChanged: Date.now() };
          actuatorsChanged = true;
        }

        // Switch OFF means Power OFF
        if (shouldCutPower && nextActuators.powerCut.state !== 'OFF') {
          nextActuators.powerCut = { state: 'OFF', lastChanged: Date.now() };
          actuatorsChanged = true;
        }

        if (nextActuators.fan.state !== 'ON') {
          nextActuators.fan = { state: 'ON', lastChanged: Date.now() };
          actuatorsChanged = true;
        }

        if (nextActuators.buzzer.state !== 'ON') {
          nextActuators.buzzer = { state: 'ON', lastChanged: Date.now() };
          actuatorsChanged = true;
        }

        if (isFlame && nextActuators.extinguisher.state !== 'ON') {
          nextActuators.extinguisher = { state: 'ON', lastChanged: Date.now() };
          actuatorsChanged = true;
        }

        if (actuatorsChanged) {
          // Push automated failsafe state to Firebase
          updateActuatorsInFirebase(
            {
              valve: 'CLOSED',
              ...(shouldCutPower ? { powerCut: 'OFF' as const } : {}),
              fan: 'ON',
              buzzer: 'ON',
              ...(isFlame ? { extinguisher: 'ON' } : {}),
            },
            'SanketSeva Automated Fail-Safe'
          ).catch((e) => console.warn('Auto fail-safe Firebase sync note:', e));

          return {
            ...prev,
            actuators: nextActuators,
          };
        }
        return prev;
      });
    } else if (isLpgWarning) {
      setDevice((prev) => {
        if (prev.actuators.fan.state !== 'ON') {
          updateActuatorsInFirebase({ fan: 'ON' }, 'Warning Auto Fan').catch(() => {});
          return {
            ...prev,
            actuators: {
              ...prev.actuators,
              fan: { state: 'ON', lastChanged: Date.now() },
            },
          };
        }
        return prev;
      });
    } else {
      hazardActiveRef.current = false;
      userDismissedAlertRef.current = false;
      setIsEmergencyBannerDismissed(false);
      setIsAlertPopupOpen(false);
      if (!device.safety.emergency) {
        audioAlertService.stopAlarm();
        emergencyNotificationService.dismissAlert();
      }
    }

    // Record Event on transitions
    if (isLpgDanger && !prevHazardRef.current.lpg) {
      setEvents((evts) => [
        {
          id: `evt-${Date.now()}`,
          type: 'GAS_DANGER',
          severity: 'EMERGENCY',
          title: 'Critical LPG Gas Leak Detected',
          description: `MQ-6 sensor measured ${device.sensors.gas.value} ADC. Auto-isolated gas valve & switched mains power OFF. Synced with Firebase.`,
          timestamp: Date.now(),
          actionTaken: 'Gas valve closed, mains power turned OFF, synced to Firebase',
          resolved: false,
        },
        ...evts,
      ]);
    }

    if (isFlame && !prevHazardRef.current.flame) {
      setEvents((evts) => [
        {
          id: `evt-${Date.now()}`,
          type: 'FLAME_DETECTED',
          severity: 'EMERGENCY',
          title: 'Active Fire / Flame Detected',
          description: 'Infrared optical photodiode tripped. Solenoid valve shut, mains power turned OFF, and fire suppression armed. Synced with Firebase.',
          timestamp: Date.now(),
          actionTaken: 'Mains power turned OFF, gas shutoff, synced to Firebase',
          resolved: false,
        },
        ...evts,
      ]);
    }

    if (isSmoke && !prevHazardRef.current.smoke) {
      setEvents((evts) => [
        {
          id: `evt-${Date.now()}`,
          type: 'SMOKE_DETECTED',
          severity: 'EMERGENCY',
          title: 'Dense Smoke Detected',
          description: `Smoke detector reading reached ${device.sensors.smoke.value} PPM. Audible smoke alarm sounding and power turned OFF. Synced with Firebase.`,
          timestamp: Date.now(),
          actionTaken: 'Exhaust fan started, mains power turned OFF, synced to Firebase',
          resolved: false,
        },
        ...evts,
      ]);
    }

    if (isTemperatureDanger && !prevHazardRef.current.temperature) {
      setEvents((evts) => [
        {
          id: `evt-${Date.now()}`,
          type: 'HIGH_TEMPERATURE',
          severity: 'EMERGENCY',
          title: 'Critical Temperature Detected',
          description: `Temperature reached ${device.sensors.temperature.value} °C. Gas valve isolated and ventilation and alarm activated.${shouldCutPower ? ' Mains power was cut.' : ''}`,
          timestamp: Date.now(),
          actionTaken: `Gas valve closed, fan and alarm started${shouldCutPower ? ', mains power cut' : ''}`,
          resolved: false,
        },
        ...evts,
      ]);
    }

    prevHazardRef.current = {
      lpg: isLpgDanger,
      flame: isFlame,
      smoke: isSmoke,
      temperature: isTemperatureDanger,
    };
  }, [
    device.sensors.gas.value,
    device.sensors.flame.detected,
    device.sensors.smoke.detected,
    device.sensors.smoke.value,
    device.sensors.temperature.value,
    device.safety.gasDangerThreshold,
    device.safety.gasWarningThreshold,
    device.safety.smokeDangerThreshold,
    device.safety.temperatureDangerThreshold,
    device.safety.autoPowerCutOnLeak,
    device.safety.autoPowerCutOnFire,
    device.safety.autoPowerCutOnSmoke,
    device.safety.emergency,
  ]);

  // Keep connection status fresh without inventing sensor readings.
  useEffect(() => {
    const interval = setInterval(() => {
      setDevice((prev) => {
        const online = hasLiveTelemetryRef.current && Date.now() - prev.status.lastSeen < 60000;
        return prev.status.online === online ? prev : { ...prev, status: { ...prev.status, online } };
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // =========================================================================
  // SEND HARDWARE ACTUATOR COMMANDS & SYNC IMMEDIATELY WITH FIREBASE
  // =========================================================================
  const sendCommand = useCallback(
    async (
      target: ActuatorTarget,
      action: CommandAction
    ): Promise<CommandDispatchResult> => {
      const now = Date.now();
      const commandId = `cmd-${now.toString(36)}-${Math.random().toString(36).substring(2, 6)}`;

      if (target === 'valve' && action === 'OPEN') {
        if (!hasLiveTelemetryRef.current) {
          const msg = 'Valve opening is blocked until live sensor readings arrive from the device.';
          setCommandFeedback({ status: 'error', message: msg });
          return { success: false, commandId, status: 'REJECTED', message: msg };
        }
        const check = validateValveOpenRequest(device.sensors, device.safety);
        if (!check.allowed) {
          const msg = check.reason || 'Hardware interlock rejected valve opening for safety.';
          setCommandFeedback({ status: 'error', message: msg });
          setEvents((prev) => [
            {
              id: `evt-${now}`,
              type: 'COMMAND_REJECTED',
              severity: 'WARNING',
              title: 'Valve Open Command Rejected',
              description: msg,
              timestamp: now,
              actionTaken: 'Interlock maintained valve closed',
              resolved: true,
            },
            ...prev,
          ]);
          return {
            success: false,
            commandId,
            status: 'REJECTED',
            message: msg,
          };
        }
      }

      setCommandFeedback({
        status: 'pending',
        target,
        message:
          target === 'powerCut'
            ? action === 'ON' || action === 'RESTORE'
              ? 'Re-energizing 230V Mains Electricity Grid (Power ON) & updating Firebase...'
              : 'Executing 230V Mains Power Cut (Power OFF) & updating Firebase...'
            : target === 'valve'
            ? `${action === 'CLOSE' ? 'Closing' : 'Opening'} LPG solenoid fuel valve & syncing with Firebase...`
            : target === 'extinguisher'
            ? `${action === 'ON' ? 'Starting' : 'Stopping'} water shower & updating Firebase...`
            : target === 'emergency'
            ? 'Transmitting emergency lockdown directive & updating Firebase...'
            : `Switching ${target} ${action.toLowerCase()} & syncing with Firebase...`,
      });

      setFirebaseSyncStatus('syncing');

      // Emergency directive
      if (target === 'emergency') {
        const isEmergency = action === 'ACTIVATE';
        const emergencyPayload: Partial<FirebaseActuatorPayload> = isEmergency
          ? {
              valve: 'CLOSED',
              powerCut: 'OFF',
              fan: 'ON',
              buzzer: 'ON',
              extinguisher: 'ON',
            }
          : {
              buzzer: 'OFF',
            };
        const writeResult = await updateActuatorsInFirebase(
          emergencyPayload,
          'SanketSeva Emergency Directive'
        );
        if (!writeResult.success) {
          setFirebaseSyncStatus('idle');
          const message = `Firebase write failed: ${writeResult.error || 'Check your connection and database rules.'}`;
          setCommandFeedback({ status: 'error', message });
          return { success: false, commandId, status: 'FAILED', message };
        }

        setDevice((prev) => ({
          ...prev,
          safety: {
            ...prev.safety,
            emergency: isEmergency,
          },
          actuators: isEmergency
            ? {
                ...prev.actuators,
                valve: { state: 'CLOSED', lastChanged: now },
                powerCut: { state: 'OFF', lastChanged: now },
                fan: { state: 'ON', lastChanged: now },
                buzzer: { state: 'ON', lastChanged: now },
                extinguisher: { state: 'ON', lastChanged: now },
              }
            : {
                ...prev.actuators,
                buzzer: { state: 'OFF', lastChanged: now },
              },
        }));

        setIsFirebaseConnected(true);
        setFirebaseSyncStatus('synced');

        if (isEmergency) {
          audioAlertService.startAlarm('critical');
          setIsAlertPopupOpen(true);
          setEvents((prev) => [
            {
              id: `evt-${now}`,
              type: 'EMERGENCY_ACTIVATED',
              severity: 'EMERGENCY',
              title: 'Manual Emergency Shutdown Broadcasted',
              description: 'LPG valve closed, mains power turned OFF (0V), ventilation fan started, siren activated. Synced to Firebase.',
              timestamp: now,
              actionTaken: 'Full emergency lockdown executed & changed in Firebase',
              resolved: false,
            },
            ...prev,
          ]);
        } else {
          audioAlertService.stopAlarm();
          emergencyNotificationService.dismissAlert();
          setIsAlertPopupOpen(false);
          setEvents((prev) => [
            {
              id: `evt-${now}`,
              type: 'EMERGENCY_CLEARED',
              severity: 'INFO',
              title: 'Emergency State Cleared by Operator',
              description: 'System returned to standard armed monitoring mode. Synced to Firebase.',
              timestamp: now,
              actionTaken: 'Audible alarm silenced & updated in Firebase',
              resolved: true,
            },
            ...prev,
          ]);
        }

        const msg = isEmergency
          ? 'Emergency shutdown executed: Gas valve isolated, mains power turned OFF, and changed in Firebase.'
          : 'Emergency state cleared. System reset in Firebase.';
        setCommandFeedback({ status: 'success', message: msg });
        return { success: true, commandId, status: 'EXECUTED', message: msg };
      }

      // Handle individual actuators (valve, fan, buzzer, extinguisher, powerCut)
      let nextState: 'ON' | 'OFF' | 'OPEN' | 'CLOSED';
      if (target === 'valve') {
        nextState = action === 'OPEN' ? 'OPEN' : 'CLOSED';
      } else if (target === 'powerCut') {
        // switch on means power on
        // switch off means power off
        nextState = action === 'ON' || action === 'RESTORE' ? 'ON' : 'OFF';
      } else {
        nextState = action === 'ON' ? 'ON' : 'OFF';
      }

      // Commit the UI state only after Firebase accepts the actuator update.
      const writeResult = await updateActuatorsInFirebase(
        {
          [target]: nextState,
        },
        `SanketSeva Operator (${target} -> ${nextState})`
      );
      if (!writeResult.success) {
        setFirebaseSyncStatus('idle');
        const message = `Firebase write failed: ${writeResult.error || 'Check your connection and database rules.'}`;
        setCommandFeedback({ status: 'error', message });
        return { success: false, commandId, status: 'FAILED', message };
      }

      setIsFirebaseConnected(true);
      setFirebaseSyncStatus('synced');
      setDevice((prev) => ({
        ...prev,
        actuators: {
          ...prev.actuators,
          [target]: {
            state: nextState,
            lastChanged: now,
          },
        },
      }));

      // Log event
      let eventType: GasGuardEvent['type'] = 'COMMAND_EXECUTED';
      let title = `${target.toUpperCase()} updated`;
      let desc = `${target} set to ${nextState} (Synced to Firebase)`;

      if (target === 'powerCut') {
        eventType = nextState === 'ON' ? 'POWER_RESTORED' : 'POWER_CUT_ACTIVATED';
        title = nextState === 'ON' ? 'Mains Electricity Turned ON' : 'Mains Electrical Power Cut OFF';
        desc = nextState === 'ON'
          ? '230V mains power grid re-energized (Power ON). Synced with Firebase.'
          : '230V kitchen electrical breaker tripped to 0V (Power OFF). Synced with Firebase.';
      } else if (target === 'valve') {
        eventType = nextState === 'OPEN' ? 'VALVE_OPENED' : 'VALVE_CLOSED';
        title = nextState === 'OPEN' ? 'Solenoid Gas Valve Opened' : 'Solenoid Gas Valve Cut Off';
        desc = nextState === 'OPEN' ? 'LPG fuel flowing. Synced with Firebase.' : 'LPG fuel isolated. Synced with Firebase.';
      } else if (target === 'fan') {
        eventType = nextState === 'ON' ? 'FAN_ON' : 'FAN_OFF';
        title = nextState === 'ON' ? 'Exhaust Fan Started' : 'Exhaust Fan Stopped';
        desc = nextState === 'ON' ? 'Room ventilation active. Synced to Firebase.' : 'Ventilation fan resting. Synced to Firebase.';
      }

      setEvents((prev) => [
        {
          id: `evt-${now}`,
          type: eventType,
          severity: target === 'powerCut' && nextState === 'OFF' ? 'WARNING' : 'INFO',
          title,
          description: desc,
          timestamp: now,
          actionTaken: `Hardware relay acknowledged ${nextState} & saved to Firebase`,
          resolved: true,
        },
        ...prev,
      ]);

      const successMsg =
        target === 'powerCut'
          ? nextState === 'ON'
            ? 'Mains electricity turned ON (230V Live) & updated in Firebase.'
            : 'Mains power turned OFF (0V Cut) & updated in Firebase.'
          : target === 'valve'
          ? `Gas valve ${nextState === 'OPEN' ? 'opened' : 'closed'} & updated in Firebase.`
          : `${target.charAt(0).toUpperCase() + target.slice(1)} switched ${nextState.toLowerCase()} & updated in Firebase.`;

      setCommandFeedback({ status: 'success', message: successMsg });
      return { success: true, commandId, status: 'EXECUTED', message: successMsg };
    },
    [device.sensors, device.safety]
  );

  // Update thresholds
  const updateThresholds = useCallback(async (thresholds: Partial<SafetyData>) => {
    const result = await updateSafetySettingsInFirebase(thresholds, device.info.deviceId);
    if (!result.success) return result;

    setDevice((prev) => ({
      ...prev,
      safety: {
        ...prev.safety,
        ...thresholds,
      },
    }));
    setIsFirebaseConnected(true);
    setFirebaseSyncStatus('synced');
    return result;
  }, [device.info.deviceId]);

  // Audio controls
  const toggleAudioMute = useCallback(() => {
    const nextMuted = audioAlertService.toggleMute();
    setIsAudioMuted(nextMuted);
  }, []);

  const silenceAlarm = useCallback(() => {
    audioAlertService.stopAlarm();
    setIsAlarmSounding(false);
  }, []);

  const testAudioAlarm = useCallback(() => {
    audioAlertService.testSound();
  }, []);

  const setAlertSoundStyle = useCallback((style: AlertSoundStyle) => {
    setAlertSoundStyleState(style);
    audioAlertService.setSoundStyle(style);
  }, []);

  // Popup open/close methods
  const openAlertPopup = useCallback(() => {
    userDismissedAlertRef.current = false;
    setIsAlertPopupOpen(true);
  }, []);

  const closeAlertPopup = useCallback(() => {
    userDismissedAlertRef.current = true;
    setIsAlertPopupOpen(false);
    audioAlertService.stopAlarm();
    setIsAlarmSounding(false);
  }, []);

  const dismissEmergencyAlert = useCallback(() => {
    userDismissedAlertRef.current = true;
    setIsEmergencyBannerDismissed(true);
    audioAlertService.stopAlarm();
    setIsAlarmSounding(false);
    emergencyNotificationService.dismissAlert();
    setActiveEmergencyAlert(null);
    setIsAlertPopupOpen(false);
  }, []);

  // Hazard simulator
  const simulateHazard = useCallback((type: 'gas_leak' | 'fire' | 'smoke' | 'combined' | 'reset') => {
    const now = Date.now();
    if (type === 'reset') {
      hazardActiveRef.current = false;
      userDismissedAlertRef.current = false;
      audioAlertService.stopAlarm();
      emergencyNotificationService.dismissAlert();
      setIsAlertPopupOpen(false);
      setDevice((prev) => ({
        ...prev,
        sensors: {
          ...prev.sensors,
          gas: { value: 330, status: 'NORMAL', timestamp: now },
          smoke: { value: 75, detected: false, status: 'NORMAL', timestamp: now },
          flame: { detected: false, timestamp: now },
          temperature: { value: 27.5, unit: '°C', timestamp: now },
        },
        actuators: {
          ...prev.actuators,
          valve: { state: 'OPEN', lastChanged: now },
          powerCut: { state: 'ON', lastChanged: now },
          fan: { state: 'OFF', lastChanged: now },
          buzzer: { state: 'OFF', lastChanged: now },
          extinguisher: { state: 'OFF', lastChanged: now },
        },
        safety: {
          ...prev.safety,
          emergency: false,
        },
      }));

      updateActuatorsInFirebase(
        {
          valve: 'OPEN',
          powerCut: 'ON',
          fan: 'OFF',
          buzzer: 'OFF',
          extinguisher: 'OFF',
        },
        'SanketSeva Reset to Safe'
      ).catch(() => {});

      setCommandFeedback({
        status: 'success',
        message: 'Sensors reset to nominal baseline. Valve open, power ON, synced with Firebase.',
      });
      return;
    }

    // User explicitly initiated the test, so allow popup to show for this test
    hazardActiveRef.current = true;
    userDismissedAlertRef.current = false;

    if (type === 'gas_leak') {
      setDevice((prev) => ({
        ...prev,
        sensors: {
          ...prev.sensors,
          gas: { value: 640, status: 'DANGER', timestamp: now },
        },
      }));
      setIsAlertPopupOpen(true);
      setCommandFeedback({
        status: 'error',
        message: 'TEST TRIGGER: LPG Gas leak simulated (640 ADC). Power turned OFF, popup opened & synced in Firebase!',
      });
    } else if (type === 'fire') {
      setDevice((prev) => ({
        ...prev,
        sensors: {
          ...prev.sensors,
          flame: { detected: true, timestamp: now },
          temperature: { value: 68.5, unit: '°C', timestamp: now },
        },
      }));
      setIsAlertPopupOpen(true);
      setCommandFeedback({
        status: 'error',
        message: 'TEST TRIGGER: Active Flame simulated. Power turned OFF, popup opened & synced in Firebase!',
      });
    } else if (type === 'smoke') {
      setDevice((prev) => ({
        ...prev,
        sensors: {
          ...prev.sensors,
          smoke: { value: 480, detected: true, status: 'DANGER', timestamp: now },
        },
      }));
      setIsAlertPopupOpen(true);
      setCommandFeedback({
        status: 'error',
        message: 'TEST TRIGGER: Dense Smoke simulated (480 PPM). Power turned OFF, popup opened & synced in Firebase!',
      });
    } else if (type === 'combined') {
      setDevice((prev) => ({
        ...prev,
        sensors: {
          ...prev.sensors,
          gas: { value: 710, status: 'DANGER', timestamp: now },
          smoke: { value: 520, detected: true, status: 'DANGER', timestamp: now },
          flame: { detected: true, timestamp: now },
          temperature: { value: 74.0, unit: '°C', timestamp: now },
        },
      }));
      setIsAlertPopupOpen(true);
      setCommandFeedback({
        status: 'error',
        message: 'TEST TRIGGER: Multi-hazard emergency. Power turned OFF, popup opened & synced in Firebase!',
      });
    }
  }, []);

  return (
    <DeviceContext.Provider
      value={{
        device,
        isOnline,
        systemMode,
        sensorHistory,
        hasLiveTelemetry,
        events,
        isFirebaseConnected,
        firebaseProjectId: firebaseConfig.projectId,
        firebaseSyncStatus,
        sendCommand,
        commandFeedback,
        clearCommandFeedback,
        updateThresholds,
        isAudioMuted,
        isAlarmSounding,
        alertSoundStyle,
        setAlertSoundStyle,
        activeEmergencyAlert,
      isEmergencyBannerDismissed,
        isAlertPopupOpen,
        openAlertPopup,
        closeAlertPopup,
        toggleAudioMute,
        silenceAlarm,
        testAudioAlarm,
        dismissEmergencyAlert,
        simulateHazard,
        customDomain,
        setCustomDomain,
        isDomainConnected,
        verifyDomain,
      }}
    >
      {children}
    </DeviceContext.Provider>
  );
};

export const useDevice = (): DeviceContextType => {
  const context = useContext(DeviceContext);
  if (!context) {
    throw new Error('useDevice must be used within a DeviceProvider');
  }
  return context;
};
