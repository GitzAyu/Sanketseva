import React, { useState } from 'react';
import {
  AlertOctagon,
  Volume2,
  VolumeX,
  ZapOff,
  Flame,
  Wind,
  ShieldAlert,
  X,
  Music,
  Check,
  ExternalLink,
} from 'lucide-react';
import { useDevice } from '../../context/DeviceContext';
import { useLanguage } from '../../context/LanguageContext';
import { AlertSoundStyle } from '../../utils/audioAlert';

export const EmergencyAudioBanner: React.FC = () => {
  const {
    device,
    systemMode,
    isAlarmSounding,
    isAudioMuted,
    toggleAudioMute,
    silenceAlarm,
    activeEmergencyAlert,
    isEmergencyBannerDismissed,
    dismissEmergencyAlert,
    openAlertPopup,
    sendCommand,
    alertSoundStyle,
    setAlertSoundStyle,
  } = useDevice();
  const { t } = useLanguage();
  const [isStyleMenuOpen, setIsStyleMenuOpen] = useState(false);

  const isLpgDanger = device.sensors.gas.value >= device.safety.gasDangerThreshold;
  const isFlame = device.sensors.flame.detected;
  const isSmoke =
    device.sensors.smoke.detected ||
    device.sensors.smoke.value >= device.safety.smokeDangerThreshold;
  const isEmergency = systemMode === 'EMERGENCY' || device.safety.emergency;

  if (isEmergencyBannerDismissed || (!isEmergency && !activeEmergencyAlert && !isAlarmSounding)) {
    return null;
  }

  const getHazardIcon = () => {
    if (isFlame) return <Flame className="w-4.5 h-4.5 text-rose-500 animate-pulse" />;
    if (isSmoke) return <Wind className="w-4.5 h-4.5 text-amber-500 animate-pulse" />;
    if (isLpgDanger) return <AlertOctagon className="w-4.5 h-4.5 text-rose-500 animate-pulse" />;
    return <ShieldAlert className="w-4.5 h-4.5 text-rose-500" />;
  };

  const getHazardHeading = () => {
    if (isFlame) return 'Active Flame Detected';
    if (isSmoke) return `Dense Smoke Detected (${device.sensors.smoke.value} PPM)`;
    if (isLpgDanger) return `LPG Gas Leak Detected (${device.sensors.gas.value} ADC)`;
    return 'Emergency Lockdown Active';
  };

  const getHazardDetails = () => {
    if (isFlame) {
      return 'Infrared sensor tripped. Solenoid valve isolated and mains electricity turned OFF.';
    }
    if (isSmoke) {
      return 'High smoke concentration. Exhaust ventilation active and mains power turned OFF.';
    }
    if (isLpgDanger) {
      return 'Combustible gas exceeds danger threshold. Valve closed and 230V mains power cut OFF.';
    }
    return 'Full kitchen emergency shutdown active. Gas valve closed and ventilation running.';
  };

  // Switch ON means Power ON (230V Live), Switch OFF means Power OFF (Power Cut 0V)
  const isPowerOn = device.actuators.powerCut.state === 'ON';

  const handleTurnPowerOffImmediately = async () => {
    await sendCommand('powerCut', 'OFF');
  };

  const soundStyles: { id: AlertSoundStyle; label: string; desc: string }[] = [
    { id: 'polite', label: 'Polite Chime (Gentle)', desc: 'Soft acoustic double-chime' },
    { id: 'soft_pulse', label: 'Soft Pulse (Calm)', desc: 'Gentle warm sine wave swell' },
    { id: 'classic', label: 'Standard Siren', desc: 'Classic industrial alert' },
  ];

  return (
    <aside
      aria-label="Emergency Hazard Notification"
      className="sticky top-16 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-rose-200 dark:border-rose-900/60 shadow-lg text-slate-900 dark:text-slate-100 transition-all duration-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        {/* Left: Hazard description and icon */}
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5">
            {getHazardIcon()}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-extrabold text-sm tracking-tight text-rose-950 dark:text-rose-200">
                {getHazardHeading()}
              </span>
              {isAlarmSounding && (
                <span className="inline-flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                  <span>
                    {alertSoundStyle === 'polite' ? 'Polite Chime Playing' : 'Alert Sound Active'}
                  </span>
                </span>
              )}
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-0.5 max-w-2xl leading-relaxed">
              {getHazardDetails()}
            </p>
          </div>
        </div>

        {/* Right: Sound style selector, Open Alert Popup, Instant Power Cut, and Prominent Close Alert button */}
        <div className="flex items-center gap-2 flex-wrap self-end md:self-auto text-xs font-semibold">
          {/* Sound Style Picker Button */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsStyleMenuOpen(!isStyleMenuOpen)}
              className="px-2.5 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer border border-slate-200 dark:border-slate-700"
              title="Change alert sound style"
            >
              <Music className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="text-[11px] font-medium">
                Sound: {alertSoundStyle === 'polite' ? 'Polite Chime' : alertSoundStyle === 'soft_pulse' ? 'Soft Pulse' : 'Standard'}
              </span>
            </button>
            {isStyleMenuOpen && (
              <div className="absolute right-0 mt-1 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl py-1 z-50 text-xs">
                <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                  Select Alert Sound
                </div>
                {soundStyles.map((style) => (
                  <button
                    key={style.id}
                    type="button"
                    onClick={() => {
                      setAlertSoundStyle(style.id);
                      setIsStyleMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer ${
                      alertSoundStyle === style.id
                        ? 'text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-50/50 dark:bg-emerald-950/30'
                        : 'text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div>
                      <span className="block text-xs">{style.label}</span>
                      <span className="block text-[10px] text-slate-400 font-normal">{style.desc}</span>
                    </div>
                    {alertSoundStyle === style.id && (
                      <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Sound Mute Toggle */}
          <button
            type="button"
            onClick={toggleAudioMute}
            className={`p-1.5 rounded-xl border transition-colors cursor-pointer ${
              isAudioMuted
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700'
                : 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
            }`}
            title={isAudioMuted ? 'Unmute Sound Alerts' : 'Mute Sound Alerts'}
            aria-label={isAudioMuted ? 'Unmute Sound Alerts' : 'Mute Sound Alerts'}
          >
            {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Quick Open Alert Popup Dialog */}
          <button
            type="button"
            onClick={openAlertPopup}
            className="px-3 py-1.5 bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 rounded-xl transition-all flex items-center gap-1.5 text-xs font-bold cursor-pointer"
            title="Open Alert Popup dialog"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View Popup Alert</span>
          </button>

          {/* Instant Turn Power OFF Button (if power is still ON) */}
          {isPowerOn && (
            <button
              type="button"
              onClick={handleTurnPowerOffImmediately}
              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl transition-all flex items-center gap-1.5 shadow-xs font-bold text-xs cursor-pointer"
            >
              <ZapOff className="w-3.5 h-3.5" />
              <span>Turn Power OFF</span>
            </button>
          )}

          {/* PROMINENT CLOSE / DISMISS ALERT MESSAGE BUTTON */}
          <button
            type="button"
            onClick={() => {
              silenceAlarm();
              dismissEmergencyAlert();
            }}
            className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 rounded-xl transition-all flex items-center gap-1.5 font-bold text-xs shadow-xs cursor-pointer ml-1"
            title="Dismiss alert and silence sound"
          >
            <X className="w-3.5 h-3.5" />
            <span>{t.closeAlert}</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
