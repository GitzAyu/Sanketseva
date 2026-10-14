import React, { useState } from 'react';
import { useDevice } from '../context/DeviceContext';
import {
  Settings as SettingsIcon,
  Save,
  AlertCircle,
  CheckCircle2,
  Volume2,
  ZapOff,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const Settings: React.FC = () => {
  const {
    device,
    updateThresholds,
    testAudioAlarm,
    isAudioMuted,
    toggleAudioMute,
    alertSoundStyle,
    setAlertSoundStyle,
  } = useDevice();
  const { t } = useLanguage();

  const [gasWarn, setGasWarn] = useState(device.safety.gasWarningThreshold.toString());
  const [gasDanger, setGasDanger] = useState(device.safety.gasDangerThreshold.toString());
  const [smokeDanger, setSmokeDanger] = useState((device.safety.smokeDangerThreshold || 300).toString());
  const [tempWarn, setTempWarn] = useState(device.safety.temperatureWarningThreshold.toString());
  const [tempDanger, setTempDanger] = useState(device.safety.temperatureDangerThreshold.toString());

  const [autoPowerLeak, setAutoPowerLeak] = useState(device.safety.autoPowerCutOnLeak ?? true);
  const [autoPowerFire, setAutoPowerFire] = useState(device.safety.autoPowerCutOnFire ?? true);
  const [autoPowerSmoke, setAutoPowerSmoke] = useState(device.safety.autoPowerCutOnSmoke ?? true);

  const [validationError, setValidationError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveThresholds = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    setSaveSuccess(false);

    const gw = parseInt(gasWarn, 10);
    const gd = parseInt(gasDanger, 10);
    const sd = parseInt(smokeDanger, 10);
    const tw = parseFloat(tempWarn);
    const td = parseFloat(tempDanger);

    if (isNaN(gw) || isNaN(gd) || isNaN(sd) || isNaN(tw) || isNaN(td)) {
      setValidationError(t.validNumberError);
      return;
    }
    if (gw <= 0 || gd <= 0 || sd <= 0) {
      setValidationError(t.positiveValueError);
      return;
    }
    if (gd <= gw) {
      setValidationError(t.gasLimitOrderError);
      return;
    }
    if (td <= tw) {
      setValidationError(t.tempLimitOrderError);
      return;
    }

    const result = await updateThresholds({
      gasWarningThreshold: gw,
      gasDangerThreshold: gd,
      smokeDangerThreshold: sd,
      temperatureWarningThreshold: tw,
      temperatureDangerThreshold: td,
      autoPowerCutOnLeak: autoPowerLeak,
      autoPowerCutOnFire: autoPowerFire,
      autoPowerCutOnSmoke: autoPowerSmoke,
    });

    if (!result.success) {
      setValidationError(`${t.saveSettingsError}${result.error ? ` (${result.error})` : ''}`);
      return;
    }

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 4000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12 transition-colors duration-200">
      {/* Header */}
      <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs">
        <div className="flex items-center gap-2">
          <SettingsIcon className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
          <h1 className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
            {t.systemConfigTitle}
          </h1>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {t.systemConfigDesc}
        </p>
      </div>

      {/* Safety Trip Thresholds Configuration Form */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
        <div className="flex items-center gap-2 mb-1">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            {t.thresholdSettings}
          </h2>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-5 leading-relaxed">
          {t.autoCutoffHelp}
        </p>

        {validationError && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-xl text-red-800 dark:text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        {saveSuccess && (
          <div className="mb-4 p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>{t.safetySettingsSaved}</span>
          </div>
        )}

        <form onSubmit={handleSaveThresholds} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Gas Warning */}
            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700 rounded-2xl">
              <label htmlFor="gas-warn" className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                {t.gasWarningLabel}
              </label>
              <input
                id="gas-warn"
                type="number"
                min="100"
                max="4000"
                value={gasWarn}
                onChange={(e) => setGasWarn(e.target.value)}
                className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-600"
              />
              <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 block">
                {t.gasWarningHelp}
              </span>
            </div>

            {/* Gas Danger */}
            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700 rounded-2xl">
              <label htmlFor="gas-danger" className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                {t.gasDangerLabel}
              </label>
              <input
                id="gas-danger"
                type="number"
                min="100"
                max="4000"
                value={gasDanger}
                onChange={(e) => setGasDanger(e.target.value)}
                className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-600"
              />
              <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 block">
                {t.gasDangerHelp}
              </span>
            </div>

            {/* Smoke Danger */}
            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700 rounded-2xl">
              <label htmlFor="smoke-danger" className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                {t.smokeDangerLabel}
              </label>
              <input
                id="smoke-danger"
                type="number"
                min="50"
                max="2000"
                value={smokeDanger}
                onChange={(e) => setSmokeDanger(e.target.value)}
                className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-600"
              />
              <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 block">
                {t.smokeDangerHelp}
              </span>
            </div>

            {/* Temperature Danger */}
            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700 rounded-2xl">
              <label htmlFor="temp-danger" className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                {t.tempDangerLabel}
              </label>
              <input
                id="temp-danger"
                type="number"
                step="0.5"
                min="20"
                max="120"
                value={tempDanger}
                onChange={(e) => setTempDanger(e.target.value)}
                className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-600"
              />
              <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 block">
                {t.tempDangerHelp}
              </span>
            </div>
          </div>

          {/* Automatic Power Cut Policies */}
          <div className="p-4 bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/60 rounded-2xl mt-4">
            <div className="flex items-center gap-2 mb-2">
              <ZapOff className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                {t.safetyAutoCutoffTitle}
              </h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">
              {t.autoCutoffHelp}
            </p>
            <div className="space-y-2 text-xs font-semibold">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoPowerLeak}
                  onChange={(e) => setAutoPowerLeak(e.target.checked)}
                  className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-slate-800 dark:text-slate-200">
                  {t.autoPowerLeak}
                </span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoPowerFire}
                  onChange={(e) => setAutoPowerFire(e.target.checked)}
                  className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-slate-800 dark:text-slate-200">
                  {t.autoPowerFire}
                </span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoPowerSmoke}
                  onChange={(e) => setAutoPowerSmoke(e.target.checked)}
                  className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-slate-800 dark:text-slate-200">
                  {t.autoPowerSmoke}
                </span>
              </label>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{t.saveConfiguration}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Audio Siren Testing & Sound Options */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                {t.soundSettingsTitle}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {t.audioAlertTitle}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={testAudioAlarm}
            className="px-3.5 py-1.5 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs font-bold transition-colors cursor-pointer self-start sm:self-auto"
          >
            {t.playSoundPreview}
          </button>
        </div>

        {/* Sound style radio cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          {[
            {
              id: 'polite' as const,
              name: `${t.politeChime} (${t.recommended})`,
              desc: t.politeChimeDesc,
              badge: t.defaultBadge,
            },
            {
              id: 'soft_pulse' as const,
              name: t.softPulse,
              desc: t.softPulseDesc,
              badge: t.calmBadge,
            },
            {
              id: 'classic' as const,
              name: t.standardSiren,
              desc: t.standardSirenDesc,
              badge: t.loudBadge,
            },
          ].map((style) => (
            <div
              key={style.id}
              onClick={() => {
                setAlertSoundStyle(style.id);
                testAudioAlarm();
              }}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                alertSoundStyle === style.id
                  ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-500 text-emerald-950 dark:text-emerald-200 shadow-2xs ring-1 ring-emerald-500/30'
                  : 'bg-slate-50/60 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold">{style.name}</span>
                <span
                  className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded ${
                    alertSoundStyle === style.id
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {style.badge}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
                {style.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
          <div>
            <span className="font-bold text-slate-800 dark:text-slate-200 block">{t.soundMuteState}</span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              {isAudioMuted ? t.mutedByYou : t.soundArmed}
            </span>
          </div>
          <button
            type="button"
            onClick={toggleAudioMute}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              isAudioMuted
                ? 'bg-amber-600 text-white'
                : 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200'
            }`}
          >
            {isAudioMuted ? t.unmuteSound : t.muteSound}
          </button>
        </div>
      </div>

    </div>
  );
};
