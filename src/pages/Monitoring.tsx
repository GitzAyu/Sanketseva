import React from 'react';
import { Activity, ShieldCheck, ZapOff, Zap } from 'lucide-react';
import { useDevice } from '../context/DeviceContext';
import { useLanguage } from '../context/LanguageContext';
import { GasChart } from '../components/charts/GasChart';
import { TemperatureChart } from '../components/charts/TemperatureChart';
import { HumidityChart } from '../components/charts/HumidityChart';

export const Monitoring: React.FC = () => {
  const { device, sensorHistory, isOnline, sensorReadingSources } = useDevice();
  const { t } = useLanguage();
  const isPowerOn = device.actuators.powerCut.state === 'ON';

  const rows = [
    {
      name: t.sensorGas,
      purpose: t.gasSafeDesc,
      isLive: sensorReadingSources.gas === 'live',
      value: `${device.sensors.gas.value} ADC`,
      limit: `${t.statusWarning}: ${device.safety.gasWarningThreshold} · ${t.statusDanger}: ${device.safety.gasDangerThreshold}`,
      status: sensorReadingSources.gas === 'demo' ? t.demoReading : sensorReadingSources.gas === 'last-known' ? t.lastKnownReading : device.sensors.gas.value >= device.safety.gasDangerThreshold
        ? t.statusDanger
        : device.sensors.gas.value >= device.safety.gasWarningThreshold ? t.statusWarning : t.statusSafe,
      danger: device.sensors.gas.value >= device.safety.gasDangerThreshold,
      warning: device.sensors.gas.value >= device.safety.gasWarningThreshold && device.sensors.gas.value < device.safety.gasDangerThreshold,
    },
    {
      name: t.sensorSmoke,
      purpose: t.smokeSafeDesc,
      isLive: sensorReadingSources.smoke === 'live',
      value: `${device.sensors.smoke.value} PPM`,
      limit: `${t.statusDanger}: ${device.safety.smokeDangerThreshold} PPM`,
      status: sensorReadingSources.smoke === 'demo' ? t.demoReading : sensorReadingSources.smoke === 'last-known' ? t.lastKnownReading : device.sensors.smoke.detected || device.sensors.smoke.value >= device.safety.smokeDangerThreshold
        ? t.statusDanger
        : device.sensors.smoke.value >= 200 ? t.statusWarning : t.statusSafe,
      danger: device.sensors.smoke.detected || device.sensors.smoke.value >= device.safety.smokeDangerThreshold,
      warning: !device.sensors.smoke.detected && device.sensors.smoke.value >= 200 && device.sensors.smoke.value < device.safety.smokeDangerThreshold,
    },
    {
      name: t.sensorFlame,
      purpose: t.flameSafeDesc,
      isLive: sensorReadingSources.flame === 'live',
      value: device.sensors.flame.detected ? t.statusDetected : t.statusClear,
      limit: t.statusClear,
      status: sensorReadingSources.flame === 'demo' ? t.demoReading : sensorReadingSources.flame === 'last-known' ? t.lastKnownReading : device.sensors.flame.detected ? t.statusDanger : t.statusSafe,
      danger: device.sensors.flame.detected,
      warning: false,
    },
    {
      name: t.sensorTemp,
      purpose: t.tempNormalDesc,
      isLive: sensorReadingSources.temperature === 'live',
      value: device.sensors.temperature.value + ' °C',
      limit: `${t.statusWarning}: ${device.safety.temperatureWarningThreshold} °C · ${t.statusDanger}: ${device.safety.temperatureDangerThreshold} °C`,
      status: sensorReadingSources.temperature === 'demo' ? t.demoReading : sensorReadingSources.temperature === 'last-known' ? t.lastKnownReading : device.sensors.temperature.value >= device.safety.temperatureDangerThreshold
        ? t.statusDanger
        : device.sensors.temperature.value >= device.safety.temperatureWarningThreshold ? t.statusWarning : t.statusSafe,
      danger: device.sensors.temperature.value >= device.safety.temperatureDangerThreshold,
      warning: device.sensors.temperature.value >= device.safety.temperatureWarningThreshold && device.sensors.temperature.value < device.safety.temperatureDangerThreshold,
    },
    {
      name: t.sensorHumidity,
      purpose: t.sensorHumidityDesc,
      isLive: sensorReadingSources.humidity === 'live',
      value: device.sensors.humidity.value + '%',
      limit: '20–90%',
      status: sensorReadingSources.humidity === 'demo' ? t.demoReading : sensorReadingSources.humidity === 'last-known' ? t.lastKnownReading : t.statusComfortable,
      danger: false,
      warning: false,
    },
  ];
  const visibleRows = rows;

  return (
    <div className="space-y-5 max-w-7xl mx-auto pb-12">
      <section className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
              <h1 className="text-base font-bold text-slate-900 dark:text-white">{t.monitoringHeaderTitle}</h1>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{t.monitoringHeaderSubtitle}</p>
          </div>
          <div className="flex items-center gap-3 text-xs flex-wrap">
            <div className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl">
              <span className="text-slate-400 block text-[10px] font-semibold uppercase">{t.sensorDevice}</span>
              <span className="text-slate-800 dark:text-slate-200 font-bold">{isOnline ? t.online : t.offline}</span>
            </div>
            <div className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl">
              <span className="text-slate-400 block text-[10px] font-semibold uppercase">{t.mainsPower}</span>
              <span className={`font-bold flex items-center gap-1 ${isPowerOn ? 'text-emerald-700 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                {isPowerOn ? <Zap className="w-3.5 h-3.5" /> : <ZapOff className="w-3.5 h-3.5" />}
                {isPowerOn ? t.powerOnShort : t.powerOffShort}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-850">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">{t.telemetryStream}</h2>
          <span className="flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-400 font-medium">
            <ShieldCheck className="w-4 h-4" />{t.sensorsProtected}
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold uppercase text-[11px] border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="py-3 px-4">{t.sensorDevice}</th>
                <th className="py-3 px-4">{t.whatItProtects}</th>
                <th className="py-3 px-4">{t.currentReading}</th>
                <th className="py-3 px-4">{t.safeLimit}</th>
                <th className="py-3 px-4">{t.condition}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {visibleRows.map((row) => (
                <tr key={row.name} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50">
                  <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">{row.name}</td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{row.purpose}</td>
                  <td className="py-3 px-4 font-semibold tabular-nums">{row.value}</td>
                  <td className="py-3 px-4 text-slate-500 dark:text-slate-400">{row.limit}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold ${!row.isLive ? 'text-slate-600 bg-slate-100 dark:text-slate-300 dark:bg-slate-800' : row.danger ? 'text-red-700 bg-red-50 dark:text-red-300 dark:bg-red-950/40' : row.warning ? 'text-amber-700 bg-amber-50 dark:text-amber-300 dark:bg-amber-950/40' : 'text-emerald-700 bg-emerald-50 dark:text-emerald-300 dark:bg-emerald-950/40'}`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-5">
        {sensorHistory.length > 0 ? <>
          <GasChart data={sensorHistory} warningThreshold={device.safety.gasWarningThreshold} dangerThreshold={device.safety.gasDangerThreshold} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <TemperatureChart data={sensorHistory} warningThreshold={device.safety.temperatureWarningThreshold} />
            <HumidityChart data={sensorHistory} />
          </div>
        </> : <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 text-sm text-slate-500 dark:text-slate-400">{t.waitingForSensors}</div>}
      </section>
    </div>
  );
};
