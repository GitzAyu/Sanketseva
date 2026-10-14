import React from 'react';
import { ShieldCheck, AlertTriangle, AlertOctagon, WifiOff, ExternalLink } from 'lucide-react';
import { SystemMode } from '../../types/device';
import { useLanguage } from '../../context/LanguageContext';
import { useDevice } from '../../context/DeviceContext';

interface SystemStatusProps {
  mode: SystemMode;
  gasValue: number;
  flameDetected: boolean;
  smokeDetected: boolean;
  smokeValue: number;
  tempValue: number;
  valveState: string;
  powerCutState?: string;
  extinguisherState?: string;
}

export const SystemStatus: React.FC<SystemStatusProps> = ({
  mode,
  gasValue,
  flameDetected,
  smokeDetected,
  smokeValue,
  tempValue,
  valveState,
  powerCutState,
}) => {
  const { t } = useLanguage();
  const { openAlertPopup } = useDevice();

  const getBannerContent = () => {
    switch (mode) {
      case 'NORMAL':
        return {
          title: t.systemNormal,
          description: t.systemNormalDesc,
          bg: 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200/80 dark:border-emerald-900/60 text-slate-800 dark:text-slate-100',
          dot: 'bg-emerald-500',
          titleColor: 'text-emerald-950 dark:text-emerald-300',
          descColor: 'text-slate-600 dark:text-slate-400',
          icon: ShieldCheck,
          iconColor: 'text-emerald-600 dark:text-emerald-400 bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800 shadow-2xs',
        };
      case 'WARNING':
        return {
          title: t.systemWarning,
          description: `${t.systemWarningDesc} (${t.sensorGas}: ${gasValue} ADC • ${t.sensorSmoke}: ${smokeValue} PPM • ${t.sensorTemp}: ${tempValue} °C)`,
          bg: 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-300/80 dark:border-amber-900/60 text-slate-800 dark:text-slate-100',
          dot: 'bg-amber-500',
          titleColor: 'text-amber-950 dark:text-amber-300',
          descColor: 'text-slate-600 dark:text-slate-400',
          icon: AlertTriangle,
          iconColor: 'text-amber-600 dark:text-amber-400 bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-800 shadow-2xs',
        };
      case 'DANGER':
      case 'EMERGENCY':
        return {
          title: t.systemCritical,
          description: flameDetected
            ? `${t.flameDetected} ${t.systemCriticalDesc}`
            : smokeDetected
            ? `${t.smokeDetected} (${smokeValue} PPM). ${t.systemCriticalDesc}`
            : `${t.sensorGas}: ${gasValue}. ${t.systemCriticalDesc}`,
          bg: 'bg-rose-50/60 dark:bg-rose-950/30 border-rose-300/80 dark:border-rose-900/60 text-slate-800 dark:text-slate-100',
          dot: 'bg-rose-600',
          titleColor: 'text-rose-950 dark:text-rose-300',
          descColor: 'text-slate-600 dark:text-slate-400',
          icon: AlertOctagon,
          iconColor: 'text-rose-600 dark:text-rose-400 bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-800 shadow-2xs',
        };
      case 'OFFLINE':
      default:
        return {
          title: t.systemOffline,
          description: t.systemOfflineDesc,
          bg: 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300',
          dot: 'bg-slate-400 dark:bg-slate-500',
          titleColor: 'text-slate-900 dark:text-white',
          descColor: 'text-slate-500 dark:text-slate-400',
          icon: WifiOff,
          iconColor: 'text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs',
        };
    }
  };

  const current = getBannerContent();
  const Icon = current.icon;

  // Switch ON means Power ON (230V Live)
  // Switch OFF means Power OFF (Power Cut 0V)
  const isPowerOn = powerCutState === 'ON';

  return (
    <div className={`p-5 rounded-2xl border transition-all ${current.bg} shadow-xs`}>
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Main Banner Message */}
        <div className="flex items-start sm:items-center gap-3.5">
          <div className={`p-2.5 rounded-xl shrink-0 ${current.iconColor}`}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${current.dot} animate-pulse`} />
              <h2 className={`text-sm font-bold tracking-tight ${current.titleColor}`}>
                {current.title}
              </h2>
              {(mode === 'EMERGENCY' || mode === 'DANGER') && (
                <button
                  type="button"
                  onClick={openAlertPopup}
                  className="ml-2 px-2 py-0.5 rounded-md text-[11px] font-bold bg-rose-600 text-white hover:bg-rose-700 transition-colors inline-flex items-center gap-1 cursor-pointer"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>{t.viewAlertPopup}</span>
                </button>
              )}
            </div>
            <p className={`text-xs mt-0.5 max-w-2xl leading-relaxed ${current.descColor}`}>
              {current.description}
            </p>
          </div>
        </div>

        {/* Telemetry metrics row */}
        <div className="flex items-center gap-3 flex-wrap text-xs bg-white/80 dark:bg-slate-900/80 p-2 rounded-xl border border-slate-200/60 dark:border-slate-800/60">
          {/* Gas */}
          <div className="flex items-center gap-1.5 px-2 py-0.5">
            <span className="text-slate-400 text-[11px] font-medium">{t.statusGas}:</span>
            <span
              className={`font-semibold ${
                gasValue > 500
                  ? 'text-rose-600 dark:text-rose-400 font-bold'
                  : gasValue > 400
                  ? 'text-amber-600 dark:text-amber-400 font-bold'
                  : 'text-emerald-700 dark:text-emerald-400'
              }`}
            >
              {gasValue > 500 ? t.statusDanger : gasValue > 400 ? t.statusElevated : t.statusClean}
            </span>
          </div>

          <span className="text-slate-300 dark:text-slate-700" aria-hidden="true">•</span>

          {/* Fire */}
          <div className="flex items-center gap-1.5 px-2 py-0.5">
            <span className="text-slate-400 text-[11px] font-medium">{t.statusFire}:</span>
            <span
              className={`font-semibold ${
                flameDetected ? 'text-rose-600 dark:text-rose-400 font-bold' : 'text-emerald-700 dark:text-emerald-400'
              }`}
            >
              {flameDetected ? t.statusAlert : t.statusNone}
            </span>
          </div>

          <span className="text-slate-300 dark:text-slate-700" aria-hidden="true">•</span>

          {/* Smoke */}
          <div className="flex items-center gap-1.5 px-2 py-0.5">
            <span className="text-slate-400 text-[11px] font-medium">{t.statusSmoke}:</span>
            <span
              className={`font-semibold ${
                smokeDetected || smokeValue > 300
                  ? 'text-amber-600 dark:text-amber-400 font-bold'
                  : 'text-emerald-700 dark:text-emerald-400'
              }`}
            >
              {smokeDetected || smokeValue > 300 ? `${smokeValue} PPM` : t.statusClean}
            </span>
          </div>

          <span className="text-slate-300 dark:text-slate-700" aria-hidden="true">•</span>

          {/* Power: switch on = Power ON (230V); switch off = Power OFF (0V Cut) */}
          <div className="flex items-center gap-1.5 px-2 py-0.5">
            <span className="text-slate-400 text-[11px] font-medium">{t.statusPower}:</span>
            <span
              className={`font-semibold ${
                isPowerOn ? 'text-emerald-700 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400 font-bold'
              }`}
            >
              {isPowerOn ? t.powerOnShort : t.powerOffShort}
            </span>
          </div>

          <span className="text-slate-300 dark:text-slate-700" aria-hidden="true">•</span>

          {/* Valve */}
          <div className="flex items-center gap-1.5 px-2 py-0.5">
            <span className="text-slate-400 text-[11px] font-medium">{t.statusValve}:</span>
            <span
              className={`font-semibold ${
                valveState === 'OPEN' ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              {valveState === 'OPEN' ? t.statusOpen : t.statusShut}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
