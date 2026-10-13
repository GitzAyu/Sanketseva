import { SensorData } from '../types/sensors';
import { SafetyData, SystemMode } from '../types/device';

export interface ValveSafetyCheckResult {
  allowed: boolean;
  reason?: string;
}

export function evaluateSystemMode(
  sensors: SensorData,
  safety: SafetyData,
  isOnline: boolean
): SystemMode {
  if (!isOnline) {
    return 'OFFLINE';
  }

  // Critical hazard triggers: Fire flame detected, smoke danger detected, gas danger threshold, or high temp
  if (
    safety.emergency ||
    sensors.flame.detected ||
    sensors.smoke.detected ||
    sensors.smoke.value >= (safety.smokeDangerThreshold || 350) ||
    sensors.gas.value >= safety.gasDangerThreshold ||
    sensors.temperature.value >= safety.temperatureDangerThreshold
  ) {
    return 'EMERGENCY';
  }

  // Warning thresholds
  if (
    sensors.gas.value >= safety.gasWarningThreshold ||
    sensors.smoke.value >= 200 ||
    sensors.temperature.value >= safety.temperatureWarningThreshold
  ) {
    return 'WARNING';
  }

  return 'NORMAL';
}

export function validateValveOpenRequest(
  sensors: SensorData,
  safety: SafetyData
): ValveSafetyCheckResult {
  if (sensors.flame.detected) {
    return {
      allowed: false,
      reason: 'Active flame / fire hazard detected on local sensor array',
    };
  }

  if (sensors.smoke.detected || sensors.smoke.value >= (safety.smokeDangerThreshold || 350)) {
    return {
      allowed: false,
      reason: `Dense smoke detected (${sensors.smoke.value} PPM). Valve opening blocked for explosion safety.`,
    };
  }

  if (sensors.gas.value >= safety.gasDangerThreshold) {
    return {
      allowed: false,
      reason: `Gas level (${sensors.gas.value}) exceeds safety danger threshold (${safety.gasDangerThreshold})`,
    };
  }

  if (sensors.gas.value >= safety.gasWarningThreshold) {
    return {
      allowed: false,
      reason: `Gas level (${sensors.gas.value}) exceeds warning threshold (${safety.gasWarningThreshold})`,
    };
  }

  if (sensors.temperature.value >= safety.temperatureDangerThreshold) {
    return {
      allowed: false,
      reason: `Temperature (${sensors.temperature.value} °C) exceeds critical safety limit (${safety.temperatureDangerThreshold} °C)`,
    };
  }

  if (safety.emergency) {
    return {
      allowed: false,
      reason: 'Emergency safety lockdown mode is currently active',
    };
  }

  return { allowed: true };
}
