import React from 'react';
import { ArrowLeft, Lock } from 'lucide-react';

interface PrivacyPolicyProps {
  onBack: () => void;
}

export const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onBack }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16 text-slate-800 dark:text-slate-100 transition-colors duration-200">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 text-xs text-emerald-800 dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-emerald-300 font-bold transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Console</span>
        </button>
        <div className="text-xs text-slate-400 dark:text-slate-500 font-medium">
          Last Updated: October 2026
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 rounded-xl shadow-xs">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              GasGuard Privacy Policy
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              IoT Sensor Telemetry, Device Identity, and Data Processing Standards
            </p>
          </div>
        </div>

        <section className="space-y-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-1.5">
            1. Purpose and Scope
          </h2>
          <p>
            GasGuard is an industrial IoT safety and telemetry monitoring system engineered to detect liquefied petroleum gas (LPG) leakages, combustion hazards, smoke, and thermal anomalies.
          </p>
        </section>

        <section className="space-y-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-1.5">
            2. Collected Telemetry and Data Points
          </h2>
          <p>
            The GasGuard platform collects the following operational datasets from linked ESP32 units:
          </p>
          <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-600 dark:text-slate-300">
            <li>
              <strong>Atmospheric Sensor Readings:</strong> Raw ADC values from the MQ-6 gas sensor, optical smoke PPM readings, digital temperature (°C) and relative humidity (%) from the DHT22 probe, and binary optical flame photodiode status.
            </li>
            <li>
              <strong>Hardware Diagnostics:</strong> ESP32 Wi-Fi signal strength (RSSI), firmware version, hardware uptime, and heartbeat timestamps.
            </li>
            <li>
              <strong>Actuator State Logs:</strong> Actuator solenoid position (OPEN or CLOSED), mains power status (ON or OFF), ventilation fan relay state, and buzzer alarm condition.
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
};
