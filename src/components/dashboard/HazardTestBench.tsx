import React from 'react';
import {
  Wind,
  Flame,
  Volume2,
  RotateCcw,
  ShieldCheck,
  ZapOff,
  Activity,
  AlertTriangle,
  Bell,
  ExternalLink,
} from 'lucide-react';
import { useDevice } from '../../context/DeviceContext';
import { useLanguage } from '../../context/LanguageContext';

export const HazardTestBench: React.FC = () => {
  const {
    simulateHazard,
    testAudioAlarm,
    isAlarmSounding,
    device,
    openAlertPopup,
    activeEmergencyAlert,
  } = useDevice();
  const { t } = useLanguage();

  const isLpgDanger = device.sensors.gas.value >= device.safety.gasDangerThreshold;
  const isFlame = device.sensors.flame.detected;
  const isSmoke = device.sensors.smoke.detected || device.sensors.smoke.value >= device.safety.smokeDangerThreshold;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs transition-colors duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3.5">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
              Sensor Hazard Simulation & Sound Testing Bench
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Test LPG leak, fire flame, and smoke triggers to verify alert popup notification, audible chimes, and automatic power cut.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeEmergencyAlert && (
            <button
              type="button"
              onClick={openAlertPopup}
              className="px-3 py-1.5 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open Alert Popup</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => simulateHazard('reset')}
            className="self-start sm:self-auto px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Reset All to Safe</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {/* Test 1: Trigger LPG Leak */}
        <button
          type="button"
          onClick={() => simulateHazard('gas_leak')}
          className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
            isLpgDanger
              ? 'bg-rose-50/80 dark:bg-rose-950/40 border-rose-400 text-rose-900 dark:text-rose-200'
              : 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-800 hover:border-rose-300 dark:hover:border-rose-900/60 text-slate-800 dark:text-slate-200'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="p-1.5 rounded-lg bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400">
              <Wind className="w-3.5 h-3.5" />
            </span>
            <span className="text-[10px] font-mono text-slate-400">MQ-6</span>
          </div>
          <span className="font-bold text-xs block">LPG Leak Test</span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">&gt;500 ADC Leak</span>
        </button>

        {/* Test 2: Trigger Fire / Flame */}
        <button
          type="button"
          onClick={() => simulateHazard('fire')}
          className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
            isFlame
              ? 'bg-orange-50/80 dark:bg-orange-950/40 border-orange-400 text-orange-900 dark:text-orange-200'
              : 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-800 hover:border-orange-300 dark:hover:border-orange-900/60 text-slate-800 dark:text-slate-200'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="p-1.5 rounded-lg bg-orange-100 dark:bg-orange-950 text-orange-600 dark:text-orange-400">
              <Flame className="w-3.5 h-3.5" />
            </span>
            <span className="text-[10px] font-mono text-slate-400">IR Flame</span>
          </div>
          <span className="font-bold text-xs block">Fire Flame Test</span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Active Flame</span>
        </button>

        {/* Test 3: Trigger Smoke Sensor */}
        <button
          type="button"
          onClick={() => simulateHazard('smoke')}
          className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
            isSmoke
              ? 'bg-amber-50/80 dark:bg-amber-950/40 border-amber-400 text-amber-900 dark:text-amber-200'
              : 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-800 hover:border-amber-300 dark:hover:border-amber-900/60 text-slate-800 dark:text-slate-200'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
              <Wind className="w-3.5 h-3.5" />
            </span>
            <span className="text-[10px] font-mono text-slate-400">MQ-2</span>
          </div>
          <span className="font-bold text-xs block">Smoke Test</span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Dense Smoke</span>
        </button>

        {/* Test 4: Combined Disaster */}
        <button
          type="button"
          onClick={() => simulateHazard('combined')}
          className="p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between bg-slate-50/70 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-800 hover:border-rose-400 dark:hover:border-rose-700 text-slate-800 dark:text-slate-200"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="p-1.5 rounded-lg bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400">
              <AlertTriangle className="w-3.5 h-3.5" />
            </span>
            <span className="text-[10px] font-mono text-slate-400">Combined</span>
          </div>
          <span className="font-bold text-xs block text-rose-700 dark:text-rose-400">All Hazards</span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Gas + Fire + Smoke</span>
        </button>

        {/* Test 5: Sound Chime Test */}
        <button
          type="button"
          onClick={testAudioAlarm}
          className="p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between bg-slate-50/70 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700 text-slate-800 dark:text-slate-200"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
              <Bell className="w-3.5 h-3.5" />
            </span>
            <span className="text-[10px] font-mono text-emerald-600">Polite</span>
          </div>
          <span className="font-bold text-xs block">Sound Chime Test</span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
            {isAlarmSounding ? 'Playing Now' : 'Gentle Bell Sound'}
          </span>
        </button>

        {/* Status Card: Auto Power Cut */}
        <div className="p-3 rounded-xl border bg-slate-50/50 dark:bg-slate-800/30 border-slate-200/60 dark:border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-semibold text-slate-400 uppercase">Power Cut Link</span>
            <ZapOff className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
              Auto Spark Shield
            </span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 mt-0.5">
              <ShieldCheck className="w-3 h-3" />
              <span>Armed & Ready</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
