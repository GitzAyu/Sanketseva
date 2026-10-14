import React, { useState } from 'react';
import {
  Power,
  Fan,
  Bell,
  BellOff,
  Lock,
  Unlock,
  ShowerHead,
  CheckCircle2,
  AlertTriangle,
  Clock3,
  Zap,
  ZapOff,
} from 'lucide-react';
import { ValveState, SwitchState } from '../../types/actuators';
import { formatRelativeTime } from '../../utils/formatting';
import { ConfirmationModal } from '../common/ConfirmationModal';
import { useLanguage } from '../../context/LanguageContext';

interface ActuatorCardProps {
  type: 'valve' | 'fan' | 'buzzer' | 'extinguisher' | 'powerCut';
  title: string;
  state: ValveState | SwitchState;
  lastChanged: number;
  onToggle: (
    target: 'valve' | 'fan' | 'buzzer' | 'extinguisher' | 'powerCut',
    nextAction: 'OPEN' | 'CLOSE' | 'ON' | 'OFF' | 'CUT' | 'RESTORE'
  ) => void;
  isLoading?: boolean;
  canOpenValve?: { allowed: boolean; reason?: string };
}

export const ActuatorCard: React.FC<ActuatorCardProps> = ({
  type,
  title,
  state,
  lastChanged,
  onToggle,
  isLoading = false,
  canOpenValve,
}) => {
  const { t, language } = useLanguage();
  const [showValveConfirm, setShowValveConfirm] = useState(false);
  const [showPowerConfirm, setShowPowerConfirm] = useState(false);
  const [pendingPowerTargetState, setPendingPowerTargetState] = useState<'ON' | 'OFF' | null>(null);

  const isValve = type === 'valve';
  const isPowerCut = type === 'powerCut';
  const isValveOpen = state === 'OPEN';
  const isSwitchOn = state === 'ON';

  // EXACT REVERSED USER SPECIFICATION:
  // Switch ON means Power ON (230V Live)
  // Switch OFF means Power OFF (Power Cut / 0V Isolated)
  const isPowerOn = isPowerCut ? isSwitchOn : false;
  const isPowerOff = isPowerCut ? !isSwitchOn : false;

  const isActive = isValve ? isValveOpen : isPowerCut ? isPowerOn : isSwitchOn;
  const cardStateClass = isPowerCut
    ? isPowerOn
      ? 'border-emerald-200 dark:border-emerald-900/70'
      : 'border-amber-200 dark:border-amber-900/70'
    : isActive
      ? 'border-emerald-200 dark:border-emerald-900/70'
      : 'border-slate-200 dark:border-slate-800';
  const accentClass = isPowerCut
    ? isPowerOn ? 'bg-emerald-500' : 'bg-amber-500'
    : isActive
      ? type === 'fan' ? 'bg-cyan-500' : type === 'extinguisher' ? 'bg-sky-500' : type === 'buzzer' ? 'bg-rose-500' : 'bg-emerald-500'
      : 'bg-slate-200 dark:bg-slate-700';

  const getIcon = () => {
    switch (type) {
      case 'valve':
        return isValveOpen ? (
          <Unlock className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
        ) : (
          <Lock className="w-5 h-5 text-rose-600 dark:text-rose-400" />
        );
      case 'powerCut':
        return isPowerOn ? (
          <Zap className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
        ) : (
          <ZapOff className="w-5 h-5 text-amber-500 dark:text-amber-400" />
        );
      case 'fan':
        return (
          <Fan
            className={`w-5 h-5 ${
              isSwitchOn ? 'text-cyan-500 dark:text-cyan-400' : 'text-slate-400'
            }`}
          />
        );
      case 'extinguisher':
        return (
          <ShowerHead
            className={`w-5 h-5 ${
              isSwitchOn ? 'text-sky-500 dark:text-sky-400' : 'text-slate-400'
            }`}
          />
        );
      case 'buzzer':
        return isSwitchOn ? (
          <Bell className="w-5 h-5 text-rose-500 dark:text-rose-400" />
        ) : (
          <BellOff className="w-5 h-5 text-slate-400" />
        );
    }
  };

  const getHelpText = () => {
    if (isValve) {
      return isValveOpen ? t.valveHelpOpen : t.valveHelpClosed;
    }
    if (isPowerCut) {
      return isPowerOn ? t.powerHelpOn : t.powerHelpOff;
    }
    if (type === 'fan') {
      return isSwitchOn ? t.fanHelpOn : t.fanHelpOff;
    }
    if (type === 'extinguisher') {
      return isSwitchOn ? t.extinguisherHelpOn : t.extinguisherHelpOff;
    }
    return isSwitchOn ? t.buzzerHelpOn : t.buzzerHelpOff;
  };

  // Turn ON / Open handler
  const handleTurnOnOrOpen = () => {
    if (isLoading) return;
    if (isValve) {
      setShowValveConfirm(true);
    } else if (isPowerCut) {
      // Turn Power ON
      setPendingPowerTargetState('ON');
      setShowPowerConfirm(true);
    } else {
      onToggle(type, 'ON');
    }
  };

  // Turn OFF / Close handler
  const handleTurnOffOrClose = () => {
    if (isLoading) return;
    if (isValve) {
      onToggle('valve', 'CLOSE');
    } else if (isPowerCut) {
      // Turn Power OFF
      setPendingPowerTargetState('OFF');
      setShowPowerConfirm(true);
    } else {
      onToggle(type, 'OFF');
    }
  };

  // Toggle switch handler
  const handleToggleSwitch = () => {
    if (isLoading) return;
    if (isPowerCut) {
      // If currently Power ON (switch ON), turn it OFF.
      // If currently Power OFF (switch OFF), turn it ON.
      if (isPowerOn) {
        handleTurnOffOrClose(); // Switches power OFF
      } else {
        handleTurnOnOrOpen(); // Switches power ON
      }
      return;
    }
    if (isActive) {
      handleTurnOffOrClose();
    } else {
      handleTurnOnOrOpen();
    }
  };

  const handleConfirmPowerAction = () => {
    if (pendingPowerTargetState === 'ON') {
      onToggle('powerCut', 'ON'); // Power ON
    } else if (pendingPowerTargetState === 'OFF') {
      onToggle('powerCut', 'OFF'); // Power OFF (0V Cut)
    }
    setShowPowerConfirm(false);
    setPendingPowerTargetState(null);
  };

  return (
    <>
      <div className={`relative overflow-hidden bg-white dark:bg-slate-900 border ${cardStateClass} rounded-2xl p-4 sm:p-5 flex flex-col justify-between shadow-sm`}>
        <div className={`absolute inset-x-0 top-0 h-1 ${accentClass}`} />
        <div>
          {/* Header row with actuator name and toggle switch */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className={`p-2 rounded-xl border shadow-2xs shrink-0 transition-colors ${
                  isPowerCut
                    ? isPowerOn
                      ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800'
                      : 'bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800'
                    : isActive
                    ? isValve
                      ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800'
                      : type === 'extinguisher'
                      ? 'bg-sky-50 dark:bg-sky-950/50 border-sky-200 dark:border-sky-800'
                      : type === 'buzzer'
                      ? 'bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-800'
                      : 'bg-cyan-50 dark:bg-cyan-950/50 border-cyan-200 dark:border-cyan-800'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                }`}
              >
                {getIcon()}
              </div>
              <div className="min-w-0">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200 truncate block">
                  {title}
                </span>
              </div>
            </div>

            {/* Tactile Toggle Switch:
                For Power Cut control:
                - switch on (translate-x-6, green) = POWER ON
                - switch off (translate-x-0, slate) = POWER OFF
            */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleToggleSwitch}
                disabled={isLoading}
                title={`${title}: ${isActive ? t.statusActive : t.statusInactive}`}
                className={`relative inline-flex h-7 w-[52px] shrink-0 cursor-pointer rounded-full border-0 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 disabled:opacity-50 ${
                  isActive
                    ? isPowerCut
                      ? 'bg-emerald-600'
                      : isValve
                      ? 'bg-emerald-600'
                      : type === 'extinguisher'
                      ? 'bg-sky-600'
                      : type === 'buzzer'
                      ? 'bg-rose-600'
                      : 'bg-cyan-600'
                    : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <span className="sr-only">Toggle {title}</span>
                <span
                  className={`pointer-events-none absolute left-0.5 top-0.5 flex h-6 w-6 transform items-center justify-center rounded-full bg-white shadow-sm ${
                    isActive ? 'translate-x-6' : 'translate-x-0'
                  }`}
                >
                  {isLoading ? (
                    <Clock3 className="w-3 h-3 text-slate-500" />
                  ) : (
                    <Power
                      className={`w-3 h-3 ${
                        isActive
                          ? isPowerCut
                            ? 'text-emerald-600'
                            : isValve
                            ? 'text-emerald-600'
                            : type === 'extinguisher'
                            ? 'text-sky-600'
                            : type === 'buzzer'
                            ? 'text-rose-600'
                            : 'text-cyan-600'
                          : 'text-slate-400'
                      }`}
                    />
                  )}
                </span>
              </button>
            </div>
          </div>

          {/* State Text & Last Update */}
            <div className="flex items-center justify-between gap-2 px-1">
            <div className="flex items-center gap-2">
              <span
                className={`text-sm font-extrabold tracking-tight ${
                  isValve
                    ? isValveOpen
                      ? 'text-emerald-700 dark:text-emerald-400'
                      : 'text-slate-700 dark:text-slate-300'
                    : isPowerCut
                    ? isPowerOn
                      ? 'text-emerald-700 dark:text-emerald-400'
                      : 'text-amber-700 dark:text-amber-400'
                    : isSwitchOn
                    ? type === 'extinguisher'
                      ? 'text-sky-700 dark:text-sky-400'
                      : type === 'buzzer'
                      ? 'text-rose-700 dark:text-rose-400'
                      : 'text-cyan-700 dark:text-cyan-400'
                    : 'text-slate-700 dark:text-slate-300'
                }`}
              >
                {isValve
                  ? isValveOpen
                    ? t.statusOpen
                    : t.statusClosed
                  : isPowerCut
                  ? isPowerOn
                    ? t.powerLiveSimple
                    : t.powerCutSimple
                  : isSwitchOn
                  ? t.statusActive
                  : t.statusInactive}
              </span>
              <span
                className={`w-2.5 h-2.5 rounded-full ring-2 ring-white dark:ring-slate-900 ${
                  isPowerCut
                    ? isPowerOn
                      ? 'bg-emerald-500'
                      : 'bg-amber-500 shadow-[0_0_8px_#f59e0b]'
                    : isActive
                    ? 'bg-emerald-500'
                    : 'bg-slate-400 dark:bg-slate-600'
                }`}
              />
            </div>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
              {t.lastUpdate}: {formatRelativeTime(lastChanged, language, t.never)}
            </span>
          </div>

          {/* Simple plain-language explanation for everyday users */}
          <p className="mt-2 text-[11px] text-slate-600 dark:text-slate-300 font-medium leading-relaxed bg-slate-50/80 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-700/80 min-h-[46px] flex items-center">
            {getHelpText()}
          </p>
        </div>

        {/* HERO CONTROLS BUTTONS: High-visibility segmented control buttons */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
          <div className="grid grid-cols-2 gap-2">
            {isPowerCut ? (
              <>
                {/* POWER CONTROL: Button 1 (POWER ON - 230V LIVE) */}
                <button
                  type="button"
                  onClick={handleTurnOnOrOpen}
                  disabled={isLoading || isPowerOn}
                  aria-label={t.powerOnShort}
                  aria-pressed={isPowerOn}
                  className={`min-h-11 py-2 px-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 disabled:cursor-not-allowed ${
                    isPowerOn
                      ? 'bg-emerald-700 text-white border-emerald-700 dark:bg-emerald-600 dark:border-emerald-600'
                      : 'bg-white dark:bg-slate-800 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 disabled:opacity-55'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{t.powerOnShort}</span>
                </button>

                {/* POWER CONTROL: Button 2 (POWER OFF - CUT TO 0V) */}
                <button
                  type="button"
                  onClick={handleTurnOffOrClose}
                  disabled={isLoading || isPowerOff}
                  aria-label={t.powerOffShort}
                  aria-pressed={isPowerOff}
                  className={`min-h-11 py-2 px-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 disabled:cursor-not-allowed ${
                    isPowerOff
                      ? 'bg-amber-600 text-white border-amber-600 dark:bg-amber-500 dark:border-amber-500'
                      : 'bg-white dark:bg-slate-800 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-900 hover:bg-amber-50 dark:hover:bg-amber-950/50 disabled:opacity-55'
                  }`}
                >
                  <ZapOff className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{t.powerOffShort}</span>
                </button>
              </>
            ) : (
              <>
                {/* STANDARD ACTUATOR: Button 1 (OPEN / ON) */}
                <button
                  type="button"
                  onClick={handleTurnOnOrOpen}
                  disabled={isLoading || isActive}
                  aria-label={isValve ? t.openValve : type === 'fan' ? t.startFan : type === 'extinguisher' ? t.startExtinguisher : t.soundAlarm}
                  aria-pressed={isActive}
                  className={`min-h-11 py-2 px-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 disabled:cursor-not-allowed ${
                    isActive
                      ? isValve
                        ? 'bg-emerald-700 text-white border-emerald-700 dark:bg-emerald-600 dark:border-emerald-600'
                        : type === 'extinguisher'
                        ? 'bg-sky-700 text-white border-sky-700 dark:bg-sky-600 dark:border-sky-600'
                        : type === 'buzzer'
                        ? 'bg-rose-700 text-white border-rose-700 dark:bg-rose-600 dark:border-rose-600'
                        : 'bg-cyan-700 text-white border-cyan-700 dark:bg-cyan-600 dark:border-cyan-600'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-400 disabled:opacity-55'
                  }`}
                >
                  {isLoading && !isActive ? (
                    <Clock3 className="w-3.5 h-3.5" />
                  ) : isValve ? (
                    <Unlock className="w-3.5 h-3.5" />
                  ) : type === 'buzzer' ? (
                    <Bell className="w-3.5 h-3.5" />
                  ) : type === 'extinguisher' ? (
                    <ShowerHead className="w-3.5 h-3.5" />
                  ) : (
                    <Fan className="w-3.5 h-3.5" />
                  )}
                  <span className="truncate">
                    {isValve
                      ? t.openValve
                      : type === 'extinguisher'
                      ? t.startExtinguisher
                      : type === 'fan'
                      ? t.startFan
                      : t.soundAlarm}
                  </span>
                </button>

                {/* STANDARD ACTUATOR: Button 2 (CLOSE / OFF) */}
                <button
                  type="button"
                  onClick={handleTurnOffOrClose}
                  disabled={isLoading || !isActive}
                  aria-label={isValve ? t.closeValve : type === 'fan' ? t.stopFan : type === 'extinguisher' ? t.stopExtinguisher : t.silenceAlarm}
                  aria-pressed={!isActive}
                  className={`min-h-11 py-2 px-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 disabled:cursor-not-allowed ${
                    !isActive
                      ? 'bg-slate-800 dark:bg-slate-700 text-white border-slate-800 dark:border-slate-600'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-400 disabled:opacity-55'
                  }`}
                >
                  {isLoading && isActive ? (
                    <Clock3 className="w-3.5 h-3.5" />
                  ) : isValve ? (
                    <Lock className="w-3.5 h-3.5" />
                  ) : (
                    <Power className="w-3.5 h-3.5" />
                  )}
                  <span className="truncate">
                    {isValve
                      ? t.closeValve
                      : type === 'extinguisher'
                      ? t.stopExtinguisher
                      : type === 'fan'
                      ? t.stopFan
                      : t.silenceAlarm}
                  </span>
                </button>
              </>
            )}
          </div>

        </div>
      </div>

      {/* Safety Confirmation Modal for Valve Opening */}
      <ConfirmationModal
        isOpen={showValveConfirm}
        title={t.openValve}
        description={t.openValveConfirmDesc}
        confirmLabel={t.openValve}
        confirmVariant="warning"
        isLoading={isLoading}
        confirmDisabled={canOpenValve?.allowed === false}
        onConfirm={() => {
          if (canOpenValve?.allowed === false) return;
          setShowValveConfirm(false);
          onToggle('valve', 'OPEN');
        }}
        onCancel={() => setShowValveConfirm(false)}
        details={
          <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="font-medium text-slate-500 dark:text-slate-400">{t.safetyGuide}:</span>
              <span
                className={
                  canOpenValve?.allowed
                    ? 'text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1'
                    : 'text-rose-600 dark:text-rose-400 font-bold flex items-center gap-1'
                }
              >
                {canOpenValve?.allowed ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>{t.statusSafe}</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                    <span>{t.statusDanger}</span>
                  </>
                )}
              </span>
            </div>
            {!canOpenValve?.allowed && canOpenValve?.reason && (
              <p className="text-red-700 dark:text-red-400 text-xs font-medium">
                {canOpenValve.reason}
              </p>
            )}
            <p className="text-slate-400 dark:text-slate-500 text-[11px]">
              {t.hardwareOverrideWarning}
            </p>
          </div>
        }
      />

      {/* Safety Confirmation Modal for Power Action (Power ON or Power OFF) */}
      <ConfirmationModal
        isOpen={showPowerConfirm}
        title={pendingPowerTargetState === 'ON' ? t.turnPowerOn : t.turnPowerOff}
        description={
          pendingPowerTargetState === 'ON'
            ? t.powerOnConfirmDesc
            : t.powerOffConfirmDesc
        }
        confirmLabel={pendingPowerTargetState === 'ON' ? t.turnPowerOn : t.turnPowerOff}
        confirmVariant={pendingPowerTargetState === 'ON' ? 'primary' : 'warning'}
        isLoading={isLoading}
        onConfirm={handleConfirmPowerAction}
        onCancel={() => {
          setShowPowerConfirm(false);
          setPendingPowerTargetState(null);
        }}
        details={
          <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
            <p>
              {pendingPowerTargetState === 'ON'
                ? t.powerOnConfirmDesc
                : t.powerOffConfirmDesc}
            </p>
          </div>
        }
      />
    </>
  );
};
