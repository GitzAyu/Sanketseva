import { SensorData } from './sensors';
import { ActuatorData } from './actuators';

export type SystemMode = 'NORMAL' | 'WARNING' | 'DANGER' | 'EMERGENCY' | 'OFFLINE';

export interface DeviceInfo {
  name: string;
  location: string;
  firmwareVersion: string;
  deviceId: string;
}

export interface DeviceStatus {
  online: boolean;
  lastSeen: number;
  wifiRSSI: number;
}

export interface SafetyData {
  mode: SystemMode;
  emergency: boolean;
  gasWarningThreshold: number;
  gasDangerThreshold: number;
  temperatureWarningThreshold: number;
  temperatureDangerThreshold: number;
  smokeDangerThreshold: number;
  autoPowerCutOnLeak: boolean;
  autoPowerCutOnFire: boolean;
  autoPowerCutOnSmoke: boolean;
}

export interface DeviceState {
  info: DeviceInfo;
  status: DeviceStatus;
  sensors: SensorData;
  actuators: ActuatorData;
  safety: SafetyData;
}
