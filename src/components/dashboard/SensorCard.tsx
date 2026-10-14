import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import {
  Flame,
  Wind,
  Thermometer,
  Droplets,
  CloudFog,
} from 'lucide-react';

interface SensorCardProps {
  type: 'gas' | 'smoke' | 'temperature' | 'humidity' | 'flame';
  title: string;
  value: string | number;
  unit?: string;
  statusText: string;
  statusVariant: 'SAFE' | 'NORMAL' | 'WARNING' | 'DANGER' | 'EMERGENCY';
  subtitle?: string;
  simpleExplanation?: string;
  progressPercent?: number; // 0 to 100 for gauge
  isLive?: boolean;
}

export const SensorCard: React.FC<SensorCardProps> = ({
  type,
  title,
  value,
  unit,
  statusText,
  statusVariant,
  subtitle,
  simpleExplanation,
  progressPercent,
  isLive = true,
}) => {
  const { t } = useLanguage();
  const getIcon = () => {
    switch (type) {
      case 'gas':
        return <Wind className="w-4 h-4 text-rose-500" />;
      case 'smoke':
        return <CloudFog className="w-4 h-4 text-amber-500" />;
      case 'temperature':
        return <Thermometer className="w-4 h-4 text-amber-500" />;
      case 'humidity':
        return <Droplets className="w-4 h-4 text-sky-500" />;
      case 'flame':
        return <Flame className="w-4 h-4 text-orange-500" />;
    }
  };

  const getStatusDot = () => {
    if (!isLive) return 'bg-slate-400';
    switch (statusVariant) {
      case 'SAFE':
      case 'NORMAL':
        return 'bg-emerald-500';
      case 'WARNING':
        return 'bg-amber-500';
      case 'DANGER':
      case 'EMERGENCY':
        return 'bg-rose-500 animate-pulse';
    }
  };

  const getVariantStyles = () => {
    switch (statusVariant) {
      case 'SAFE':
      case 'NORMAL':
        return {
          cardBg: 'bg-white dark:bg-slate-900',
          border: 'border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700',
          textColor: 'text-emerald-700 dark:text-emerald-400 font-semibold',
          barColor: 'bg-emerald-500',
          iconBg: 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700',
        };
      case 'WARNING':
        return {
          cardBg: 'bg-white dark:bg-slate-900',
          border: 'border-amber-300/80 dark:border-amber-900/60 hover:border-amber-400',
          textColor: 'text-amber-700 dark:text-amber-400 font-semibold',
          barColor: 'bg-amber-500',
          iconBg: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800',
        };
      case 'DANGER':
      case 'EMERGENCY':
        return {
          cardBg: 'bg-white dark:bg-slate-900',
          border: 'border-rose-300/80 dark:border-rose-900/60 hover:border-rose-400',
          textColor: 'text-rose-700 dark:text-rose-400 font-bold',
          barColor: 'bg-rose-500',
          iconBg: 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800',
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div
      className={`rounded-2xl border p-4 sm:p-5 flex flex-col justify-between shadow-xs transition-all duration-150 ${styles.cardBg} ${styles.border}`}
    >
      <div>
        {/* Top Header: Title & Icon */}
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-[11px] font-semibold tracking-wider uppercase text-slate-500 dark:text-slate-400">
            {title}
          </span>
          <div className={`p-1.5 rounded-lg border ${styles.iconBg} shadow-2xs`}>
            {getIcon()}
          </div>
        </div>

        {/* Metric Display */}
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white tabular-nums">
            {isLive ? value : '—'}
          </span>
          {isLive && unit && (
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{unit}</span>
          )}
        </div>

        {/* Level Gauge */}
        {isLive && progressPercent !== undefined && (
          <div className="mt-2.5">
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden flex">
              <div
                className={`h-full transition-all duration-300 rounded-full ${styles.barColor}`}
                style={{ width: `${Math.min(100, Math.max(5, progressPercent))}%` }}
              />
            </div>
          </div>
        )}

        {/* Explanation */}
        {isLive && simpleExplanation && (
          <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
            {simpleExplanation}
          </p>
        )}
        {!isLive && <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{t.waitingForSensors}</p>}
        {isLive && subtitle && !simpleExplanation && (
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {subtitle}
          </p>
        )}
      </div>

      {/* Bottom Status Row */}
      <div className="mt-3.5 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
        <span className="text-[11px] text-slate-400 dark:text-slate-500">{t.statusLabel}</span>
        <div className="flex items-center gap-1.5">
          <span className={`w-1.5 h-1.5 rounded-full ${getStatusDot()}`} />
          <span className={isLive ? styles.textColor : 'text-slate-500 dark:text-slate-400'}>{isLive ? statusText : t.waitingForSensors}</span>
        </div>
      </div>
    </div>
  );
};
