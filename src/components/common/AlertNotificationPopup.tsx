import React, { useEffect } from 'react';
import {
  AlertOctagon,
  Flame,
  Wind,
  CloudFog,
  ShieldAlert,
  X,
  Volume2,
  VolumeX,
  ZapOff,
  CheckCircle2,
  Lock,
  Fan,
  ShowerHead,
  Bell,
  ArrowRight,
} from 'lucide-react';
import { useDevice } from '../../context/DeviceContext';
import { useLanguage } from '../../context/LanguageContext';
import { formatTimestamp } from '../../utils/formatting';

export const AlertNotificationPopup: React.FC = () => {
  const {
    device,
    systemMode,
    isAlertPopupOpen,
    closeAlertPopup,
    activeEmergencyAlert,
    isAlarmSounding,
    silenceAlarm,
    isAudioMuted,
    toggleAudioMute,
    sendCommand,
    alertSoundStyle,
  } = useDevice();
  const { t } = useLanguage();

  // Close popup with Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isAlertPopupOpen) {
        closeAlertPopup();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAlertPopupOpen, closeAlertPopup]);

  if (!isAlertPopupOpen) {
    return null;
  }

  const isLpgDanger = device.sensors.gas.value >= device.safety.gasDangerThreshold;
  const isFlame = device.sensors.flame.detected;
  const isSmoke =
    device.sensors.smoke.detected ||
    device.sensors.smoke.value >= device.safety.smokeDangerThreshold;

  const isPowerOn = device.actuators.powerCut.state === 'ON'; // Switch ON means Power ON
  const isPowerOff = !isPowerOn; // Switch OFF means Power OFF (0V Cut)

  const getHazardIcon = () => {
    if (isFlame) return <Flame className="w-7 h-7 text-rose-500 animate-pulse" />;
    if (isSmoke) return <CloudFog className="w-7 h-7 text-amber-500 animate-pulse" />;
    if (isLpgDanger) return <Wind className="w-7 h-7 text-rose-500 animate-pulse" />;
    return <AlertOctagon className="w-7 h-7 text-rose-500 animate-pulse" />;
  };

  const getHazardTitle = () => {
    if (activeEmergencyAlert?.title) return activeEmergencyAlert.title;
    if (isFlame) return 'ACTIVE FIRE / FLAME DETECTED!';
    if (isSmoke) return `DENSE SMOKE DETECTED (${device.sensors.smoke.value} PPM)`;
    if (isLpgDanger) return `DANGEROUS LPG GAS LEAK DETECTED (${device.sensors.gas.value} ADC)`;
    return 'CRITICAL EMERGENCY PROTOCOL ACTIVATED!';
  };

  const getHazardMessage = () => {
    if (activeEmergencyAlert?.message) return activeEmergencyAlert.message;
    if (isFlame) {
      return 'Optical infrared sensor detected naked combustion flames in kitchen. Solenoid fuel valve isolated and mains electricity disconnected.';
    }
    if (isSmoke) {
      return `Smoke concentration reached ${device.sensors.smoke.value} PPM. Possible electrical or cookware fire. Exhaust ventilation and safety alarms active.`;
    }
    if (isLpgDanger) {
      return `MQ-6 gas sensor reading is ${device.sensors.gas.value} ADC (Exceeds danger threshold of ${device.safety.gasDangerThreshold} ADC). Mains power cut OFF (0V) to prevent sparks.`;
    }
    return 'High-priority kitchen safety lockdown directive engaged. Gas supply isolated and ventilation running.';
  };

  const handleTurnPowerOffImmediately = async () => {
    // Switch OFF means Power OFF
    await sendCommand('powerCut', 'OFF');
  };

  return (
    <div
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="alert-popup-title"
      aria-describedby="alert-popup-description"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-2xs animate-in fade-in duration-200"
      onClick={(e) => {
        // Close if clicked directly on backdrop
        if (e.target === e.currentTarget) {
          closeAlertPopup();
        }
      }}
    >
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 border-2 border-rose-500/70 dark:border-rose-500/80 rounded-3xl shadow-2xl p-6 sm:p-7 text-slate-900 dark:text-slate-100 max-h-[92vh] overflow-y-auto transition-colors duration-200 animate-emergency-border">
        {/* Top-Right Prominent Close Button */}
        <button
          type="button"
          onClick={closeAlertPopup}
          aria-label={t.closeAlert}
          title={t.closeAlert}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Zone: Icon + Title + Timestamp */}
        <div className="flex items-start gap-4 mb-4 pr-10">
          <div className="p-3 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 rounded-2xl shrink-0 shadow-xs">
            {getHazardIcon()}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-rose-600 text-white animate-pulse">
                EMERGENCY ALERT
              </span>
              <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500">
                {activeEmergencyAlert?.timestamp
                  ? formatTimestamp(activeEmergencyAlert.timestamp)
                  : formatTimestamp(Date.now())}
              </span>
              {isAlarmSounding && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-600 dark:text-rose-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                  <span>{alertSoundStyle === 'polite' ? 'Chime Active' : 'Siren Sounding'}</span>
                </span>
              )}
            </div>

            <h2
              id="alert-popup-title"
              className="text-lg sm:text-xl font-extrabold text-rose-950 dark:text-rose-200 tracking-tight mt-1"
            >
              {getHazardTitle()}
            </h2>
          </div>
        </div>

        {/* Incident Narrative */}
        <div className="p-4 bg-rose-50/80 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-2xl mb-4 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
          <p id="alert-popup-description" className="font-medium text-slate-800 dark:text-slate-200">
            {getHazardMessage()}
          </p>
        </div>

        {/* Real-time Hardware Automated Safety Response Status */}
        <div className="mb-4">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-2">
            Automated Hardware Protection Responses
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
            {/* 1. Gas Valve */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl flex flex-col justify-between">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-slate-400 font-semibold uppercase">Gas Valve</span>
                <Lock className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
              </div>
              <span className="font-extrabold text-xs text-rose-600 dark:text-rose-400">
                {device.actuators.valve.state === 'CLOSED' ? 'CLOSED (SAFE)' : 'OPEN'}
              </span>
            </div>

            {/* 2. Power Cut (Switch OFF means Power OFF) */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl flex flex-col justify-between">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-slate-400 font-semibold uppercase">Mains Power</span>
                <ZapOff className="w-3.5 h-3.5 text-amber-500" />
              </div>
              <span
                className={`font-extrabold text-xs ${
                  isPowerOff ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600'
                }`}
              >
                {isPowerOff ? 'POWER OFF (0V)' : 'POWER ON (230V)'}
              </span>
            </div>

            {/* 3. Exhaust Fan */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl flex flex-col justify-between">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-slate-400 font-semibold uppercase">Exhaust Fan</span>
                <Fan className="w-3.5 h-3.5 text-cyan-500 animate-spin" />
              </div>
              <span className="font-extrabold text-xs text-cyan-600 dark:text-cyan-400">
                {device.actuators.fan.state === 'ON' ? 'RUNNING' : 'OFF'}
              </span>
            </div>

            {/* 4. Siren Horn */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl flex flex-col justify-between">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-slate-400 font-semibold uppercase">Alarm Siren</span>
                <Bell className="w-3.5 h-3.5 text-rose-500 animate-bounce" />
              </div>
              <span className="font-extrabold text-xs text-rose-600 dark:text-rose-400">
                {isAlarmSounding || device.actuators.buzzer.state === 'ON' ? 'SOUNDING' : 'SILENT'}
              </span>
            </div>
          </div>
        </div>

        {/* Suggested Actions Checklist */}
        <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl mb-5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 block mb-2">
            Recommended Immediate Actions
          </span>
          <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>Evacuate all personnel from the kitchen and utility conduits immediately.</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>
                Do not turn on electrical appliances or operate wall switches (avoids electrical sparks).
              </span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>Open external doors and windows to accelerate ventilation with fresh air.</span>
            </li>
          </ul>
        </div>

        {/* Audio Sound & Emergency Power Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            {/* Silence sound button */}
            {isAlarmSounding && (
              <button
                type="button"
                onClick={silenceAlarm}
                className="px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-200 dark:border-slate-700"
              >
                <Volume2 className="w-4 h-4 text-slate-500" />
                <span>Silence Sound</span>
              </button>
            )}

            {/* Mute toggle button */}
            <button
              type="button"
              onClick={toggleAudioMute}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title={isAudioMuted ? 'Unmute' : 'Mute'}
            >
              {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* Immediate Power Cut button if power is still ON */}
            {isPowerOn && (
              <button
                type="button"
                onClick={handleTurnPowerOffImmediately}
                className="px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
              >
                <ZapOff className="w-4 h-4" />
                <span>Turn Power OFF Now</span>
              </button>
            )}
          </div>

          {/* PROMINENT CLOSE BUTTON FOR POPUP ALERT MESSAGE (Explicitly requested by user) */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={closeAlertPopup}
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <X className="w-4 h-4" />
              <span>{t.closeAlert}</span>
            </button>
          </div>
        </div>

        {/* Reopen note */}
        <p className="mt-3 text-[11px] text-center text-slate-400 dark:text-slate-500">
          Tip: You can re-open this popup anytime by clicking the alert banner or notification icon in the header.
        </p>
      </div>
    </div>
  );
};
