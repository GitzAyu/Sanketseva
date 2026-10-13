export type EventType =
  | 'SYSTEM_STARTED'
  | 'DEVICE_CONNECTED'
  | 'DEVICE_DISCONNECTED'
  | 'GAS_WARNING'
  | 'GAS_DANGER'
  | 'FLAME_DETECTED'
  | 'SMOKE_DETECTED'
  | 'HIGH_TEMPERATURE'
  | 'POWER_CUT_ACTIVATED'
  | 'POWER_RESTORED'
  | 'VALVE_OPENED'
  | 'VALVE_CLOSED'
  | 'FAN_ON'
  | 'FAN_OFF'
  | 'ALARM_ON'
  | 'ALARM_OFF'
  | 'EXTINGUISHER_ON'
  | 'EXTINGUISHER_OFF'
  | 'EMERGENCY_ACTIVATED'
  | 'EMERGENCY_CLEARED'
  | 'COMMAND_EXECUTED'
  | 'COMMAND_REJECTED';

export type EventSeverity = 'INFO' | 'WARNING' | 'DANGER' | 'EMERGENCY';

export interface GasGuardEvent {
  id: string;
  type: EventType;
  severity: EventSeverity;
  title: string;
  description: string;
  timestamp: number;
  actionTaken?: string;
  resolved?: boolean;
}
