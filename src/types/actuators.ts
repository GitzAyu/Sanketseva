export type ValveState = 'OPEN' | 'CLOSED' | 'UNKNOWN';
export type SwitchState = 'ON' | 'OFF' | 'UNKNOWN';

export interface ValveData {
  state: ValveState;
  lastChanged: number;
}

export interface SwitchData {
  state: SwitchState;
  lastChanged: number;
}

export interface ActuatorData {
  valve: ValveData;
  fan: SwitchData;
  buzzer: SwitchData;
  extinguisher: SwitchData;
  powerCut: SwitchData; // Mains power control: ON = Power ON (230V Live), OFF = Power OFF (Power Cut / 0V)
}
