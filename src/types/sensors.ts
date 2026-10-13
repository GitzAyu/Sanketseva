export type GasStatus = 'NORMAL' | 'WARNING' | 'DANGER';
export type SmokeStatus = 'NORMAL' | 'WARNING' | 'DANGER';

export interface GasReading {
  value: number; // Raw ADC sensor value from MQ-6 (e.g. 200 - 1024)
  status: GasStatus;
  timestamp: number;
}

export interface SmokeReading {
  value: number; // Raw ADC or PPM reading from MQ-2 / Optical Smoke detector (e.g. 50 - 800)
  detected: boolean;
  status: SmokeStatus;
  timestamp: number;
}

export interface TemperatureReading {
  value: number; // Celsius from DHT22 or DS18B20
  unit: string;
  timestamp: number;
}

export interface HumidityReading {
  value: number; // Relative percentage
  unit: string;
  timestamp: number;
}

export interface FlameReading {
  detected: boolean;
  timestamp: number;
}

export interface SensorData {
  gas: GasReading;
  smoke: SmokeReading;
  temperature: TemperatureReading;
  humidity: HumidityReading;
  flame: FlameReading;
}

export interface HistoricalReading {
  timestamp: number;
  gas: number;
  smoke: number;
  temperature: number;
  humidity: number;
  flame: boolean;
}
