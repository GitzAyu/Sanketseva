import React from 'react';
import { useDevice } from '../context/DeviceContext';
import { useLanguage } from '../context/LanguageContext';
import {
  AlertTriangle,
  AlertOctagon,
  ShieldCheck,
  Clock,
  ZapOff,
  Volume2,
  ExternalLink,
  X,
} from 'lucide-react';
import { formatDateTime } from '../utils/formatting';

export const Alerts: React.FC = () => {
  const {
    device,
    systemMode,
    events,
    silenceAlarm,
    isAlarmSounding,
    openAlertPopup,
    dismissEmergencyAlert,
  } = useDevice();
  const { t } = useLanguage();

  const emergencyAndWarningEvents = events.filter(
    (e) => e.severity === 'EMERGENCY' || e.severity === 'WARNING'
  );

  // Switch ON means Power ON (230V); Switch OFF means Power OFF (0V Cut)
  const isPowerOn = device.actuators.powerCut?.state === 'ON';
  const eventLabel = (type: string) => type.includes('GAS') ? t.filterGas : type.includes('FLAME') || type.includes('FIRE') ? t.filterFire : type.includes('SMOKE') ? t.filterSmoke : t.emergencyLockdownActive;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 transition-colors duration-200">
      {/* Header */}
      <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <h1 className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
              {t.alertsHeaderTitle}
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {t.alertsHeaderSubtitle}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={openAlertPopup}
            className="px-3.5 py-1.5 bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>{t.viewAlertPopup}</span>
          </button>

          <div className="text-right text-xs">
            <span className="text-slate-400 dark:text-slate-500 block text-[11px] font-semibold">{t.statusLabel}</span>
            <span
              className={`font-bold ${
                systemMode === 'EMERGENCY'
                  ? 'text-red-600 dark:text-red-400'
                  : systemMode === 'WARNING'
                  ? 'text-amber-600 dark:text-amber-400'
                  : 'text-emerald-700 dark:text-emerald-400'
              }`}
            >
              {systemMode === 'NORMAL' ? t.systemNormal : systemMode === 'WARNING' ? t.systemWarning : systemMode === 'EMERGENCY' || systemMode === 'DANGER' ? t.systemCritical : systemMode === 'OFFLINE' ? t.offline : systemMode}
            </span>
          </div>
        </div>
      </div>

      {/* Active Incident Banner if in Emergency or Warning */}
      {systemMode === 'EMERGENCY' && (
        <div className="p-5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-2xl shadow-xs">
          <div className="flex items-start justify-between gap-3.5">
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 rounded-xl shrink-0">
                <AlertOctagon className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-bold text-red-900 dark:text-red-200">
                    {t.emergencyLockdownActive}
                  </h2>
                  {isAlarmSounding && (
                    <span className="px-2 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-extrabold animate-pulse">
                      {t.audioAlarmPlaying}
                    </span>
                  )}
                </div>
                <p className="text-xs text-red-800 dark:text-red-300 mt-1 leading-relaxed">
                  {device.sensors.flame.detected ? t.flameAlertDesc : device.sensors.smoke.detected || device.sensors.smoke.value >= device.safety.smokeDangerThreshold ? t.smokeAlertDesc : t.gasDangerDesc}
                </p>

                {/* Fail-Safe Actuator Status Badges */}
                <div className="mt-3 flex items-center gap-2.5 text-xs font-semibold text-red-900/90 dark:text-red-200 flex-wrap">
                  <span className="bg-white/90 dark:bg-slate-900/90 px-2.5 py-1 rounded-lg border border-red-200 dark:border-red-900 flex items-center gap-1">
                    <span>{t.valveName}:</span>
                    <strong className="text-rose-600">{device.actuators.valve.state === 'CLOSED' ? t.statusClosed : t.statusOpen}</strong>
                  </span>

                  <span className="bg-white/90 dark:bg-slate-900/90 px-2.5 py-1 rounded-lg border border-red-200 dark:border-red-900 flex items-center gap-1">
                    <ZapOff className="w-3.5 h-3.5 text-amber-500" />
                    <span>{t.mainsPower}:</span>
                    <strong className={isPowerOn ? 'text-emerald-600' : 'text-amber-600'}>
                      {isPowerOn ? t.powerOnShort : t.powerOffShort}
                    </strong>
                  </span>

                  <span className="bg-white/90 dark:bg-slate-900/90 px-2.5 py-1 rounded-lg border border-red-200 dark:border-red-900 flex items-center gap-1">
                    <span>{t.fanName}:</span>
                    <strong className="text-emerald-600">{device.actuators.fan.state === 'ON' ? t.statusActive : t.statusInactive}</strong>
                  </span>

                  <span className="bg-white/90 dark:bg-slate-900/90 px-2.5 py-1 rounded-lg border border-red-200 dark:border-red-900 flex items-center gap-1">
                    <span>{t.buzzerName}:</span>
                    <strong className="text-rose-600">{device.actuators.buzzer.state === 'ON' ? t.statusActive : t.statusInactive}</strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons: Silence Sound & Close Alert Message */}
            <div className="flex items-center gap-2 shrink-0 flex-wrap">
              <button
                type="button"
                onClick={openAlertPopup}
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>{t.viewAlertPopup}</span>
              </button>

              {isAlarmSounding && (
                <button
                  type="button"
                  onClick={silenceAlarm}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>{t.silenceAlarmAction}</span>
                </button>
              )}

              <button
                type="button"
                onClick={dismissEmergencyAlert}
                className="px-3 py-1.5 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>{t.closeAlert}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {systemMode === 'NORMAL' && (
        <div className="p-4 bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-2xl flex items-center gap-3 shadow-xs">
          <ShieldCheck className="w-5 h-5 text-emerald-700 dark:text-emerald-400 shrink-0" />
          <div className="text-xs text-emerald-950 dark:text-emerald-200 font-medium">
            {t.noEvents}
          </div>
        </div>
      )}

      {/* Historical Alert Log */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-850">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            {t.recentEvents}
          </h2>
          <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
            {emergencyAndWarningEvents.length}
          </span>
        </div>

        {emergencyAndWarningEvents.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400 dark:text-slate-500">
            {t.noEvents}
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {emergencyAndWarningEvents.map((alert) => (
              <div key={alert.id} className="p-4 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${
                        alert.severity === 'EMERGENCY'
                          ? 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900'
                          : 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-400 border border-amber-200 dark:border-amber-900'
                      }`}
                    >
                      {alert.severity === 'EMERGENCY' ? t.statusDanger : t.statusWarning}
                    </span>
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white">{eventLabel(alert.type)}</h3>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500 text-xs">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{formatDateTime(alert.timestamp)}</span>
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-1">
                    <span className="text-slate-400 dark:text-slate-500">{t.statusLabel}:</span>
                    <span
                      className={`font-semibold ${
                        alert.resolved ? 'text-emerald-700 dark:text-emerald-400' : 'text-amber-700 dark:text-amber-400'
                      }`}
                    >
                      {alert.resolved ? t.resolved : t.statusActive}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
