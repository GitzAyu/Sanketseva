export type CommandAction =
  | 'OPEN'
  | 'CLOSE'
  | 'ON'
  | 'OFF'
  | 'ACTIVATE'
  | 'DEACTIVATE'
  | 'CUT'
  | 'RESTORE';

export type ActuatorTarget =
  | 'valve'
  | 'fan'
  | 'buzzer'
  | 'extinguisher'
  | 'powerCut'
  | 'emergency';

export type CommandAckStatus =
  | 'PENDING'
  | 'EXECUTED'
  | 'REJECTED'
  | 'FAILED'
  | 'EXPIRED';

export interface CommandAck {
  commandId: string;
  status: CommandAckStatus;
  timestamp: number;
  message: string;
}

export interface DeviceCommand {
  command: CommandAction;
  commandId: string;
  timestamp: number;
  issuedBy: string;
  ack?: CommandAck;
}
