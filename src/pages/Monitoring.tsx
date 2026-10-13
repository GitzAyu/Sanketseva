import React from 'react';
import { useDevice } from '../context/DeviceContext';
import { useLanguage } from '../context/LanguageContext';
import { GasChart } from '../components/charts/GasChart';
import { TemperatureChart } from '../components/charts/TemperatureChart';
import { HumidityChart } from '../components/charts/HumidityChart';
import { Activity, ShieldCheck, ZapOff, Zap } from 'lucide-react';

export const Monitoring: React.FC = () => {
  const { device, sensorHistory, isOnline } = useDevice();
  const { t } = useLanguage();

  // Switch ON means Power ON (230V Live); Switch OFF means Power OFF (0V Cut)
  const isPowerOn = device.actuators.powerCut?.state === 'ON';

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 transition-colors duration-200">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
            <h1 className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
              {t.monitoringHeaderTitle}
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {t.monitoringHeaderSubtitle}
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs flex-wrap">
          <div className="p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl">
            <span className="text-slate-400 dark:text-slate-400 block text-[10px] font-semibold uppercase">
              {t.controller}
            </span>
            <span className="text-slate-800 dark:text-slate-200 font-bold">ESP32-WROOM-32</span>
          </div>

          <div className="p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl">
            <span className="text-slate-400 dark:text-slate-400 block text-[10px] font-semibold uppercase">
              Mains Electrical Bus
            </span>
            <span
              className={`font-bold flex items-center gap-1 ${
                isPowerOn ? 'text-emerald-700 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'
              }`}
            >
              {isPowerOn ? <Zap className="w-3.5 h-3.5" /> : <ZapOff className="w-3.5 h-3.5" />}
              <span>{isPowerOn ? '230V AC Live (Power ON)' : '0V Cut (Power OFF)'}</span>
            </span>
          </div>

          <div className="p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl">
            <span className="text-slate-400 dark:text-slate-400 block text-[10px] font-semibold uppercase">
              {t.dataPipe}
            </span>
            <span className={isOnline ? 'text-emerald-700 dark:text-emerald-400 font-bold' : 'text-slate-400 dark:text-slate-500 font-bold'}>
              {isOnline ? t.online : t.offline}
            </span>
          </div>
        </div>
      </div>

      {/* Hardware Channel Table with clear explanatory labels */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-850">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            {t.telemetryStream}
          </h2>
          <span className="text-xs text-slate-400 dark:text-slate-400 font-medium">
            {t.sensorsProtected}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold uppercase text-[11px] tracking-wider border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="py-3 px-4 font-bold">{t.sensorDevice}</th>
                <th className="py-3 px-4 font-bold">{t.whatItProtects}</th>
                <th className="py-3 px-4 font-bold">{t.esp32Pin}</th>
                <th className="py-3 px-4 font-bold">{t.currentReading}</th>
                <th className="py-3 px-4 font-bold">{t.safeLimit}</th>
                <th className="py-3 px-4 font-bold">{t.condition}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {/* MQ-6 LPG Sensor */}
              <tr className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                  MQ-6 LPG Gas Sensor
                </td>
                <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                  LPG cylinder leakage (Propane / Butane)
                </td>
                <td className="py-3 px-4 font-mono text-slate-500 dark:text-slate-400">GPIO 34 (ADC)</td>
                <td className="py-3 px-4 font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">
                  {device.sensors.gas.value} ADC
                </td>
                <td className="py-3 px-4 text-slate-500 dark:text-slate-400">
                  Warn: {device.safety.gasWarningThreshold} | Danger: {device.safety.gasDangerThreshold}
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${
                      device.sensors.gas.status === 'DANGER'
                        ? 'text-red-800 dark:text-red-300 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900'
                        : device.sensors.gas.status === 'WARNING'
                        ? 'text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900'
                        : 'text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900'
                    }`}
                  >
                    {device.sensors.gas.status === 'NORMAL' ? 'CLEAN AIR' : device.sensors.gas.status}
                  </span>
                </td>
              </tr>

              {/* MQ-2 Smoke Detector */}
              <tr className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                  MQ-2 Optical Smoke Detector
                </td>
                <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                  Combustion smoke & electrical smoldering
                </td>
                <td className="py-3 px-4 font-mono text-slate-500 dark:text-slate-400">GPIO 35 (ADC)</td>
                <td className="py-3 px-4 font-bold text-amber-600 dark:text-amber-400 tabular-nums">
                  {device.sensors.smoke.value} PPM
                </td>
                <td className="py-3 px-4 text-slate-500 dark:text-slate-400">
                  Safe: &lt;200 | Danger: &gt;{device.safety.smokeDangerThreshold} PPM
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${
                      device.sensors.smoke.detected || device.sensors.smoke.value >= device.safety.smokeDangerThreshold
                        ? 'text-red-800 dark:text-red-300 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900'
                        : device.sensors.smoke.value >= 200
                        ? 'text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900'
                        : 'text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900'
                    }`}
                  >
                    {device.sensors.smoke.detected || device.sensors.smoke.value >= device.safety.smokeDangerThreshold
                      ? 'DENSE SMOKE'
                      : device.sensors.smoke.value >= 200
                      ? 'ELEVATED'
                      : 'CLEAR AIR'}
                  </span>
                </td>
              </tr>

              {/* Flame Sensor */}
              <tr className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                  Infrared Flame Photodiode
                </td>
                <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                  Open fire, flames, and burner flare-ups
                </td>
                <td className="py-3 px-4 font-mono text-slate-500 dark:text-slate-400">GPIO 25 (Digital)</td>
                <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                  {device.sensors.flame.detected ? 'FLAME SENSE' : 'NO FIRE'}
                </td>
                <td className="py-3 px-4 text-slate-500 dark:text-slate-400">Immediate Fuel & Power Cut</td>
                <td className="py-3 px-4">
                  <span
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${
                      device.sensors.flame.detected
                        ? 'text-red-800 dark:text-red-300 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900'
                        : 'text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900'
                    }`}
                  >
                    {device.sensors.flame.detected ? 'TRIPPED' : 'CLEAR'}
                  </span>
                </td>
              </tr>

              {/* Mains Power Breaker / Contactor */}
              <tr className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                  Mains Electricity Power Breaker
                </td>
                <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                  230V kitchen mains electricity spark isolation
                </td>
                <td className="py-3 px-4 font-mono text-slate-500 dark:text-slate-400">GPIO 26 (Relay 4)</td>
                <td className="py-3 px-4 font-bold tabular-nums">
                  {isPowerOn ? '230V AC (Power ON)' : '0V AC (Power OFF / Cut)'}
                </td>
                <td className="py-3 px-4 text-slate-500 dark:text-slate-400">
                  Auto-switch OFF on gas &gt;500 or fire/smoke
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${
                      isPowerOn
                        ? 'text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900'
                        : 'text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900'
                    }`}
                  >
                    {isPowerOn ? 'POWER ON (GRID 230V)' : 'POWER OFF (0V CUT)'}
                  </span>
                </td>
              </tr>

              {/* Temperature */}
              <tr className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                  DHT22 Temperature Probe
                </td>
                <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                  Kitchen ambient room heat
                </td>
                <td className="py-3 px-4 font-mono text-slate-500 dark:text-slate-400">GPIO 4 (1-Wire)</td>
                <td className="py-3 px-4 font-bold text-slate-900 dark:text-white tabular-nums">
                  {device.sensors.temperature.value} °C
                </td>
                <td className="py-3 px-4 text-slate-500 dark:text-slate-400">
                  Warn: {device.safety.temperatureWarningThreshold}°C | Danger: {device.safety.temperatureDangerThreshold}°C
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${
                      device.sensors.temperature.value >= device.safety.temperatureDangerThreshold
                        ? 'text-red-800 dark:text-red-300 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900'
                        : device.sensors.temperature.value >= device.safety.temperatureWarningThreshold
                        ? 'text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900'
                        : 'text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900'
                    }`}
                  >
                    {device.sensors.temperature.value >= device.safety.temperatureWarningThreshold
                      ? 'ELEVATED'
                      : 'NORMAL'}
                  </span>
                </td>
              </tr>

              {/* Humidity */}
              <tr className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                  DHT22 Humidity Probe
                </td>
                <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                  Atmospheric moisture & steam
                </td>
                <td className="py-3 px-4 font-mono text-slate-500 dark:text-slate-400">GPIO 4 (1-Wire)</td>
                <td className="py-3 px-4 font-bold text-slate-900 dark:text-white tabular-nums">
                  {device.sensors.humidity.value}% RH
                </td>
                <td className="py-3 px-4 text-slate-500 dark:text-slate-400">20% - 90% RH</td>
                <td className="py-3 px-4">
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900">
                    COMFORTABLE
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed Sensor Curves */}
      <div className="space-y-6">
        <GasChart
          data={sensorHistory}
          warningThreshold={device.safety.gasWarningThreshold}
          dangerThreshold={device.safety.gasDangerThreshold}
        />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <TemperatureChart
            data={sensorHistory}
            warningThreshold={device.safety.temperatureWarningThreshold}
          />
          <HumidityChart data={sensorHistory} />
        </div>
      </div>
    </div>
  );
};
