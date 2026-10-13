import React, { useMemo } from 'react';
import { useDevice } from '../context/DeviceContext';
import { useLanguage } from '../context/LanguageContext';
import { ActuatorCard } from '../components/dashboard/ActuatorCard';
import { EmergencyButton } from '../components/dashboard/EmergencyButton';
import { validateValveOpenRequest } from '../utils/safety';
import {
  Sliders,
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
  Activity,
  ZapOff,
  Zap,
} from 'lucide-react';
import { formatTimestamp } from '../utils/formatting';

export const Controls: React.FC = () => {
  const {
    device,
    sendCommand,
    commandFeedback,
    clearCommandFeedback,
    events,
    firebaseProjectId,
    firebaseSyncStatus,
  } = useDevice();
  const { t } = useLanguage();

  const valveSafety = useMemo(() => {
    return validateValveOpenRequest(device.sensors, device.safety);
  }, [device.sensors, device.safety]);

  const handleActuatorToggle = async (
    target: 'valve' | 'fan' | 'buzzer' | 'extinguisher' | 'powerCut',
    action: 'OPEN' | 'CLOSE' | 'ON' | 'OFF' | 'CUT' | 'RESTORE'
  ) => {
    await sendCommand(target, action);
  };

  const handleEmergencyTrigger = async () => {
    await sendCommand('emergency', 'ACTIVATE');
  };

  const handleClearEmergency = async () => {
    await sendCommand('emergency', 'DEACTIVATE');
  };

  const handleTurnPowerOn = async () => {
    await sendCommand('powerCut', 'ON');
  };

  const handleTurnPowerOff = async () => {
    await sendCommand('powerCut', 'OFF');
  };

  const actuatorEvents = events.filter((e) =>
    [
      'VALVE_OPENED',
      'VALVE_CLOSED',
      'POWER_CUT_ACTIVATED',
      'POWER_RESTORED',
      'FAN_ON',
      'FAN_OFF',
      'EXTINGUISHER_ON',
      'EXTINGUISHER_OFF',
      'ALARM_ON',
      'ALARM_OFF',
      'COMMAND_EXECUTED',
      'COMMAND_REJECTED',
      'EMERGENCY_ACTIVATED',
    ].includes(e.type)
  );

  // Switch ON means Power ON (230V Live); Switch OFF means Power OFF (0V Cut)
  const isPowerOn = device.actuators.powerCut?.state === 'ON';

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 transition-colors duration-200">
      {/* Header Banner */}
      <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 rounded-xl border border-emerald-200 dark:border-emerald-800">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
                {t.actuatorsTitle}
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {t.actuatorsSubtitle}
              </p>
            </div>
          </div>
        </div>

        {/* Master Quick Power Actions */}
        <div className="flex items-center gap-2.5">
          {isPowerOn ? (
            <button
              type="button"
              onClick={handleTurnPowerOff}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <ZapOff className="w-4 h-4" />
              <span>{t.turnPowerOff}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleTurnPowerOn}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Zap className="w-4 h-4" />
              <span>{t.turnPowerOn}</span>
            </button>
          )}

          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs text-emerald-950 dark:text-emerald-200 max-w-sm shadow-2xs">
            <div className="flex items-center gap-1.5 font-bold mb-0.5 text-emerald-800 dark:text-emerald-300">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>Firebase Cloud Sync Active</span>
            </div>
            <span className="text-[11px] font-medium leading-relaxed">
              Every actuator switch changes live in Firebase (<code className="font-mono text-[10px] text-emerald-700 dark:text-emerald-300 font-bold">{firebaseProjectId}</code>) and syncs bidirectionally with ESP32.
            </span>
          </div>
        </div>
      </div>

      {/* Command Feedback */}
      {commandFeedback.status !== 'idle' && (
        <div
          className={`p-3.5 rounded-2xl border text-xs flex items-center justify-between shadow-xs ${
            commandFeedback.status === 'pending'
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
              : commandFeedback.status === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
              : 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-900 text-red-900 dark:text-red-200'
          }`}
        >
          <div className="flex items-center gap-2 font-medium">
            {commandFeedback.status === 'pending' && (
              <span className="w-4 h-4 border-2 border-emerald-300 border-t-emerald-700 dark:border-emerald-600 dark:border-t-emerald-300 rounded-full animate-spin" />
            )}
            {commandFeedback.status === 'success' && (
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            )}
            {commandFeedback.status === 'error' && (
              <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />
            )}
            <span>{commandFeedback.message}</span>
          </div>
          <button
            onClick={clearCommandFeedback}
            className="text-xs underline opacity-80 hover:opacity-100 font-semibold cursor-pointer"
          >
            {t.dismiss}
          </button>
        </div>
      )}

      {/* 5 Actuator Cards (Valve, Mains Power Control, Fan, Extinguisher, Buzzer) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {/* Actuator 1: Solenoid Fuel Valve */}
        <ActuatorCard
          type="valve"
          title={t.valveName}
          state={device.actuators.valve.state}
          lastChanged={device.actuators.valve.lastChanged}
          onToggle={handleActuatorToggle}
          isLoading={commandFeedback.status === 'pending' && commandFeedback.target === 'valve'}
          canOpenValve={valveSafety}
        />

        {/* Actuator 2: Power Control (Switch ON = Power ON; Switch OFF = Power OFF) */}
        <ActuatorCard
          type="powerCut"
          title={t.powerCutName}
          state={device.actuators.powerCut.state}
          lastChanged={device.actuators.powerCut.lastChanged}
          onToggle={handleActuatorToggle}
          isLoading={commandFeedback.status === 'pending' && commandFeedback.target === 'powerCut'}
        />

        {/* Actuator 3: Exhaust Ventilation Fan */}
        <ActuatorCard
          type="fan"
          title={t.fanName}
          state={device.actuators.fan.state}
          lastChanged={device.actuators.fan.lastChanged}
          onToggle={handleActuatorToggle}
          isLoading={commandFeedback.status === 'pending' && commandFeedback.target === 'fan'}
        />

        {/* Actuator 4: Water Shower Extinguisher */}
        <ActuatorCard
          type="extinguisher"
          title={t.extinguisherName}
          state={device.actuators.extinguisher?.state || 'OFF'}
          lastChanged={device.actuators.extinguisher?.lastChanged || Date.now()}
          onToggle={handleActuatorToggle}
          isLoading={commandFeedback.status === 'pending' && commandFeedback.target === 'extinguisher'}
        />

        {/* Actuator 5: Audible Alarm Siren */}
        <ActuatorCard
          type="buzzer"
          title={t.buzzerName}
          state={device.actuators.buzzer.state}
          lastChanged={device.actuators.buzzer.lastChanged}
          onToggle={handleActuatorToggle}
          isLoading={commandFeedback.status === 'pending' && commandFeedback.target === 'buzzer'}
        />
      </div>

      {/* Emergency Isolation Button */}
      <EmergencyButton
        onTriggerEmergency={handleEmergencyTrigger}
        isLoading={commandFeedback.status === 'pending' && commandFeedback.target === 'emergency'}
      />

      {device.safety.emergency && (
        <div className="p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="text-xs text-red-900 dark:text-red-200">
            <span className="font-bold block text-red-800 dark:text-red-300 text-sm">
              {t.emergencyLockdownActive}
            </span>
            {t.emergencyLockdownDesc}
          </div>
          <button
            onClick={handleClearEmergency}
            className="px-4 py-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-700 flex items-center gap-1.5 transition-colors shadow-2xs self-start sm:self-auto cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            <span>{t.resetEmergency}</span>
          </button>
        </div>
      )}

      {/* Actuator Action Audit Log */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
        <div className="flex items-center gap-2 mb-3">
          <Activity className="w-4 h-4 text-slate-600 dark:text-slate-400" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            {t.allEvents}
          </h2>
        </div>

        {actuatorEvents.length === 0 ? (
          <p className="text-xs text-slate-400 dark:text-slate-500 py-4 text-center">
            {t.noEvents}
          </p>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {actuatorEvents.map((evt) => (
              <div
                key={evt.id}
                className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-slate-400 dark:text-slate-500">
                      {formatTimestamp(evt.timestamp)}
                    </span>
                    <span
                      className={`font-semibold ${
                        evt.severity === 'EMERGENCY'
                          ? 'text-red-600 dark:text-red-400'
                          : evt.severity === 'WARNING'
                          ? 'text-amber-700 dark:text-amber-400'
                          : 'text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      {evt.title}
                    </span>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">
                    {evt.description}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-md border border-emerald-200 dark:border-emerald-800 self-start sm:self-auto">
                  <span>{t.statusSafe}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
