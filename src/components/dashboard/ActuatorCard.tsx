import React, { useState } from 'react';
import {
  Power,
  Fan,
  Bell,
  BellOff,
  Lock,
  Unlock,
  ShowerHead,
  Shield,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Cpu,
  Zap,
  ZapOff,
} from 'lucide-react';
import { ValveState, SwitchState } from '../../types/actuators';
import { formatRelativeTime } from '../../utils/formatting';
import { ConfirmationModal } from '../common/ConfirmationModal';
import { ActuatorVisualSimulation } from './ActuatorVisualSimulation';
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
  const { t } = useLanguage();
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

  const getHardwarePin = () => {
    switch (type) {
      case 'valve':
        return 'GPIO 18 • Relay 1 (Gas Solenoid)';
      case 'powerCut':
        return 'GPIO 26 • Relay 4 (230V Mains Breaker)';
      case 'fan':
        return 'GPIO 19 • Relay 2 (Exhaust Blower)';
      case 'extinguisher':
        return 'GPIO 25 • Relay 3 (Water Deluge Pump)';
      case 'buzzer':
        return 'GPIO 21 • PWM Alarm Siren';
    }
  };

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
          <Zap className="w-5 h-5 text-emerald-600 dark:text-emerald-400 animate-pulse" />
        ) : (
          <ZapOff className="w-5 h-5 text-amber-500 dark:text-amber-400" />
        );
      case 'fan':
        return (
          <Fan
            className={`w-5 h-5 ${
              isSwitchOn ? 'text-cyan-500 dark:text-cyan-400 animate-spin' : 'text-slate-400'
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
          <Bell className="w-5 h-5 text-rose-500 dark:text-rose-400 animate-bounce" />
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
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 rounded-2xl p-4 sm:p-5 flex flex-col justify-between shadow-xs transition-all duration-200">
        <div>
          {/* Header Row: Title, Icon, Hardware Pin & Toggle Switch */}
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
                <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono block">
                  {getHardwarePin()}
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
                title={`Toggle ${title} (Currently ${isActive ? 'ON' : 'OFF'})`}
                className={`relative inline-flex h-7 w-13 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-500/50 disabled:opacity-50 ${
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
                  className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out flex items-center justify-center ${
                    isActive ? 'translate-x-6' : 'translate-x-0'
                  }`}
                >
                  {isLoading ? (
                    <Loader2 className="w-3 h-3 text-slate-500 animate-spin" />
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

          {/* Interactive Live Hardware Simulation Canvas */}
          <div className="mb-3">
            <ActuatorVisualSimulation type={type} state={state} compact={true} />
          </div>

          {/* State Text & Last Update */}
          <div className="flex items-baseline justify-between gap-2 px-1">
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
                className={`w-2 h-2 rounded-full ${
                  isPowerCut
                    ? isPowerOn
                      ? 'bg-emerald-500 shadow-[0_0_8px_#10b981] animate-pulse'
                      : 'bg-amber-500 shadow-[0_0_8px_#f59e0b]'
                    : isActive
                    ? 'bg-emerald-500 shadow-[0_0_8px_#10b981] animate-pulse'
                    : 'bg-slate-400 dark:bg-slate-600'
                }`}
              />
            </div>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
              {t.lastUpdate}: {formatRelativeTime(lastChanged)}
            </span>
          </div>

          {/* Simple plain-language explanation for everyday users */}
          <p className="mt-2 text-[11px] text-slate-600 dark:text-slate-300 font-medium leading-relaxed bg-slate-50/80 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-700/80 min-h-[46px] flex items-center">
            {getHelpText()}
          </p>
        </div>

        {/* HERO CONTROLS BUTTONS: High-visibility segmented control buttons */}
        <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800">
          <div className="grid grid-cols-2 gap-2 bg-slate-100/80 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
            {isPowerCut ? (
              <>
                {/* POWER CONTROL: Button 1 (POWER ON - 230V LIVE) */}
                <button
                  type="button"
                  onClick={handleTurnOnOrOpen}
                  disabled={isLoading || isPowerOn}
                  className={`py-2 px-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    isPowerOn
                      ? 'bg-emerald-600 text-white shadow-sm ring-1 ring-emerald-500'
                      : 'text-emerald-700 dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-emerald-200 hover:bg-white/80 dark:hover:bg-slate-700/80 disabled:opacity-40'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{t.turnPowerOn}</span>
                </button>

                {/* POWER CONTROL: Button 2 (POWER OFF - CUT TO 0V) */}
                <button
                  type="button"
                  onClick={handleTurnOffOrClose}
                  disabled={isLoading || isPowerOff}
                  className={`py-2 px-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    isPowerOff
                      ? 'bg-amber-600 text-white shadow-sm ring-1 ring-amber-500'
                      : 'text-amber-700 dark:text-amber-400 hover:text-amber-900 dark:hover:text-amber-200 hover:bg-white/80 dark:hover:bg-slate-700/80 disabled:opacity-40'
                  }`}
                >
                  <ZapOff className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{t.turnPowerOff}</span>
                </button>
              </>
            ) : (
              <>
                {/* STANDARD ACTUATOR: Button 1 (OPEN / ON) */}
                <button
                  type="button"
                  onClick={handleTurnOnOrOpen}
                  disabled={isLoading || isActive}
                  className={`py-2 px-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    isActive
                      ? isValve
                        ? 'bg-emerald-600 text-white shadow-sm ring-1 ring-emerald-500'
                        : type === 'extinguisher'
                        ? 'bg-sky-600 text-white shadow-sm ring-1 ring-sky-500'
                        : type === 'buzzer'
                        ? 'bg-rose-600 text-white shadow-sm ring-1 ring-rose-500'
                        : 'bg-cyan-600 text-white shadow-sm ring-1 ring-cyan-500'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/80 dark:hover:bg-slate-700/80 disabled:opacity-40'
                  }`}
                >
                  {isLoading && !isActive ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
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
                  className={`py-2 px-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    !isActive
                      ? 'bg-slate-800 dark:bg-slate-700 text-white shadow-sm ring-1 ring-slate-600'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/80 dark:hover:bg-slate-700/80 disabled:opacity-40'
                  }`}
                >
                  {isLoading && isActive ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
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

          <div className="flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500 font-medium mt-2 px-0.5">
            <span className="flex items-center gap-1">
              <Cpu className="w-3 h-3" />
              <span>{t.hardwareRelayBus}</span>
            </span>
            <span className="flex items-center gap-1">
              <Shield className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
              <span>Fail-Safe Active</span>
            </span>
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
        onConfirm={() => {
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
                ? 'Relay 4 will re-energize the 230V AC mains bus. Ensure that room air is clear of combustible gas before switching ON.'
                : 'Relay 4 will de-energize the 230V AC contactor to 0V (Power OFF) to eliminate all potential electrical spark hazards.'}
            </p>
          </div>
        }
      />
    </>
  );
};
