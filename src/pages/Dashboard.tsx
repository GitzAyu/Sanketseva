import React, { useState, useMemo } from 'react';
import { useDevice } from '../context/DeviceContext';
import { useLanguage } from '../context/LanguageContext';
import { SystemStatus } from '../components/dashboard/SystemStatus';
import { SensorCard } from '../components/dashboard/SensorCard';
import { HouseActuatorLayout } from '../components/dashboard/HouseActuatorLayout';
import { ActuatorCard } from '../components/dashboard/ActuatorCard';
import { EmergencyButton } from '../components/dashboard/EmergencyButton';
import { GasChart } from '../components/charts/GasChart';
import { validateValveOpenRequest } from '../utils/safety';
import { formatTimestamp } from '../utils/formatting';
import { eventLabel, severityLabel } from '../utils/eventLabels';
import {
  AlertCircle,
  CheckCircle2,
  History as HistoryIcon,
  ArrowRight,
  HelpCircle,
  ZapOff,
} from 'lucide-react';
import { EasyGuideModal } from '../components/dashboard/EasyGuideModal';

interface DashboardProps {
  onNavigate: (route: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const {
    device,
    hasRequiredSafetyTelemetry,
    systemMode,
    sensorHistory,
    events,
    sendCommand,
    commandFeedback,
    clearCommandFeedback,
  } = useDevice();
  const { t } = useLanguage();
  const [showGuideModal, setShowGuideModal] = useState(false);

  const valveSafety = useMemo(() => {
    if (!hasRequiredSafetyTelemetry) return { allowed: false, reason: t.valveNeedsLiveReadings };
    return validateValveOpenRequest(device.sensors, device.safety);
  }, [device.sensors, device.safety, hasRequiredSafetyTelemetry, t.valveNeedsLiveReadings]);

  const handleActuatorToggle = async (
    target: 'valve' | 'fan' | 'buzzer' | 'extinguisher' | 'powerCut',
    action: 'OPEN' | 'CLOSE' | 'ON' | 'OFF' | 'CUT' | 'RESTORE'
  ) => {
    await sendCommand(target, action);
  };

  const handleEmergencyTrigger = async () => {
    await sendCommand('emergency', 'ACTIVATE');
  };

  // Gas progress percentage (0 - 100)
  const gasPercent = useMemo(() => {
    const val = device.sensors.gas.value;
    if (val <= 300) return 10;
    if (val >= 700) return 100;
    return Math.round(((val - 250) / 450) * 100);
  }, [device.sensors.gas.value]);

  // Smoke progress percentage (0 - 100)
  const smokePercent = useMemo(() => {
    const val = device.sensors.smoke.value;
    if (val <= 100) return 12;
    if (val >= 600) return 100;
    return Math.round(((val - 50) / 550) * 100);
  }, [device.sensors.smoke.value]);

  // Temp progress percentage
  const tempPercent = useMemo(() => {
    const val = device.sensors.temperature.value;
    return Math.min(100, Math.max(10, Math.round(((val - 15) / 55) * 100)));
  }, [device.sensors.temperature.value]);

  // Everyday human explanations
  const gasExplanation = useMemo(() => {
    if (device.sensors.gas.value >= device.safety.gasDangerThreshold) {
      return t.gasDangerDesc;
    }
    if (device.sensors.gas.value >= device.safety.gasWarningThreshold) {
      return t.gasWarnDesc;
    }
    return t.gasSafeDesc;
  }, [device.sensors.gas.value, device.safety, t]);

  const smokeExplanation = useMemo(() => {
    if (device.sensors.smoke.detected || device.sensors.smoke.value >= device.safety.smokeDangerThreshold) {
      return t.smokeAlertDesc;
    }
    return t.smokeSafeDesc;
  }, [device.sensors.smoke.detected, device.sensors.smoke.value, device.safety, t]);

  const flameExplanation = useMemo(() => {
    return device.sensors.flame.detected ? t.flameAlertDesc : t.flameSafeDesc;
  }, [device.sensors.flame.detected, t]);

  const tempExplanation = useMemo(() => {
    if (device.sensors.temperature.value >= device.safety.temperatureWarningThreshold) {
      return t.tempHotDesc;
    }
    return t.tempNormalDesc;
  }, [device.sensors.temperature.value, device.safety, t]);

  const recentEvents = events.slice(0, 5);
  // Switch ON means Power ON (230V); Switch OFF means Power OFF (0V Cut)
  const isPowerOff = device.actuators.powerCut?.state === 'OFF';

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 transition-colors duration-200">
      {/* Clean Dashboard Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs">
        <div>
          <h1 className="text-base font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <span>{t.dashboardTitle}</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 font-semibold">
              {t.protectionActive}
            </span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {t.dashboardSubtitle}
          </p>
        </div>
        <div className="flex items-center gap-2.5 flex-wrap">
          {isPowerOff && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800 text-xs font-bold">
              <ZapOff className="w-3.5 h-3.5" />
              <span>{t.powerOffBadge}</span>
            </div>
          )}
          <button
            type="button"
            onClick={() => setShowGuideModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
            <span>{t.howItWorks}</span>
          </button>
        </div>
      </div>

      {/* 1. Overall System Safety Status Banner */}
      <SystemStatus
        mode={systemMode}
        gasValue={device.sensors.gas.value}
        flameDetected={device.sensors.flame.detected}
        smokeDetected={device.sensors.smoke.detected}
        smokeValue={device.sensors.smoke.value}
        tempValue={device.sensors.temperature.value}
        valveState={device.actuators.valve.state}
        powerCutState={device.actuators.powerCut.state}
        extinguisherState={device.actuators.extinguisher?.state || 'OFF'}
      />

      <HouseActuatorLayout />

      {/* 2. Command Feedback Notification */}
      {commandFeedback.status !== 'idle' && (
        <div
          className={`p-3.5 rounded-2xl border text-xs flex items-center justify-between transition-all ${
            commandFeedback.status === 'pending'
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
              : commandFeedback.status === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
              : 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-900 text-red-900 dark:text-red-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {commandFeedback.status === 'pending' && (
              <span className="w-4 h-4 border-2 border-emerald-300 border-t-emerald-700 dark:border-emerald-600 dark:border-t-emerald-300 rounded-full animate-spin" />
            )}
            {commandFeedback.status === 'success' && (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            )}
            {commandFeedback.status === 'error' && (
              <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
            )}
            <span className="font-medium">{commandFeedback.status === 'pending' ? t.working : commandFeedback.status === 'success' ? t.commandSaved : t.commandFailed}</span>
          </div>
          <button
            onClick={clearCommandFeedback}
            className="text-xs underline opacity-80 hover:opacity-100 ml-4 font-semibold text-slate-700 dark:text-slate-300 cursor-pointer"
          >
            {t.dismiss}
          </button>
        </div>
      )}

      {/* 4. Live Sensor Telemetry Cards (LPG, Smoke, Flame, Temperature, Humidity) */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold tracking-wider uppercase text-slate-500 dark:text-slate-400">
            {t.liveReadingsTitle}
          </h2>
          <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
            {t.monitoringHeaderSubtitle}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* LPG Sensor */}
          <SensorCard
            type="gas"
            isLive={device.sensors.gas.timestamp > 0}
            title={t.sensorGas}
            value={device.sensors.gas.value}
            unit="ADC"
            statusText={
              device.sensors.gas.status === 'DANGER'
                ? t.statusDanger
                : device.sensors.gas.status === 'WARNING'
                ? t.statusWarning
                : t.statusSafe
            }
            statusVariant={
              device.sensors.gas.status === 'DANGER'
                ? 'DANGER'
                : device.sensors.gas.status === 'WARNING'
                ? 'WARNING'
                : 'SAFE'
            }
            simpleExplanation={gasExplanation}
            progressPercent={gasPercent}
          />

          {/* Smoke Sensor */}
          <SensorCard
            type="smoke"
            isLive={device.sensors.smoke.timestamp > 0}
            title={t.sensorSmoke}
            value={device.sensors.smoke.value}
            unit="PPM"
            statusText={
              device.sensors.smoke.detected || device.sensors.smoke.value >= device.safety.smokeDangerThreshold
                ? t.statusDanger
                : device.sensors.smoke.value >= 200
                ? t.statusWarning
                : t.statusSafe
            }
            statusVariant={
              device.sensors.smoke.detected || device.sensors.smoke.value >= device.safety.smokeDangerThreshold
                ? 'DANGER'
                : device.sensors.smoke.value >= 200
                ? 'WARNING'
                : 'SAFE'
            }
            simpleExplanation={smokeExplanation}
            progressPercent={smokePercent}
          />

          {/* Fire Sensor */}
          <SensorCard
            type="flame"
            isLive={device.sensors.flame.timestamp > 0}
            title={t.sensorFlame}
            value={device.sensors.flame.detected ? t.flameDetected : t.flameClear}
            statusText={device.sensors.flame.detected ? t.flameDetected : t.flameClear}
            statusVariant={device.sensors.flame.detected ? 'DANGER' : 'SAFE'}
            simpleExplanation={flameExplanation}
          />

          {/* Room Temperature */}
          <SensorCard
            type="temperature"
            isLive={device.sensors.temperature.timestamp > 0}
            title={t.sensorTemp}
            value={device.sensors.temperature.value}
            unit="°C"
            statusText={
              device.sensors.temperature.value >= device.safety.temperatureDangerThreshold
                ? t.statusDanger
                : device.sensors.temperature.value >= device.safety.temperatureWarningThreshold
                ? t.statusWarning
                : t.statusNormal
            }
            statusVariant={
              device.sensors.temperature.value >= device.safety.temperatureDangerThreshold
                ? 'DANGER'
                : device.sensors.temperature.value >= device.safety.temperatureWarningThreshold
                ? 'WARNING'
                : 'SAFE'
            }
            simpleExplanation={tempExplanation}
            progressPercent={tempPercent}
          />

          {/* Air Humidity */}
          <SensorCard
            type="humidity"
            isLive={device.sensors.humidity.timestamp > 0}
            title={t.sensorHumidity}
            value={device.sensors.humidity.value}
            unit="%"
            statusText={t.statusComfortable}
            statusVariant="SAFE"
            simpleExplanation={t.sensorHumidityDesc}
            progressPercent={device.sensors.humidity.value}
          />
        </div>
      </section>

      {/* 5. Live Gas & Smoke Trend Graph */}
      <section>
        {sensorHistory.length > 0 ? (
          <GasChart
            data={sensorHistory}
            warningThreshold={device.safety.gasWarningThreshold}
            dangerThreshold={device.safety.gasDangerThreshold}
          />
        ) : (
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 text-sm text-slate-500 dark:text-slate-400">{t.waitingForSensors}</div>
        )}
      </section>

      {/* 6. Physical Safety Actuators (Switch ON = Power ON, Switch OFF = Power OFF) */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-xs font-bold tracking-wider uppercase text-slate-500 dark:text-slate-400">
              {t.actuatorsTitle}
            </h2>
            <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
              {t.equipmentSubtitle}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {/* Actuator 1: Solenoid Fuel Valve */}
          <ActuatorCard
            type="valve"
            title={t.valveName}
            state={device.actuators.valve.state}
            lastChanged={device.actuators.valve.lastChanged}
            onToggle={handleActuatorToggle}
            isLoading={commandFeedback.status === 'pending'}
            canOpenValve={valveSafety}
          />

          {/* Actuator 2: MAINS POWER CONTROL (Switch ON = Power ON; Switch OFF = Power OFF) */}
          <ActuatorCard
            type="powerCut"
            title={t.powerCutName}
            state={device.actuators.powerCut.state}
            lastChanged={device.actuators.powerCut.lastChanged}
            onToggle={handleActuatorToggle}
            isLoading={commandFeedback.status === 'pending'}
          />

          {/* Actuator 3: Exhaust Ventilation Fan */}
          <ActuatorCard
            type="fan"
            title={t.fanName}
            state={device.actuators.fan.state}
            lastChanged={device.actuators.fan.lastChanged}
            onToggle={handleActuatorToggle}
            isLoading={commandFeedback.status === 'pending'}
          />

          {/* Actuator 4: Water Shower Extinguisher */}
          <ActuatorCard
            type="extinguisher"
            title={t.extinguisherName}
            state={device.actuators.extinguisher?.state || 'OFF'}
            lastChanged={device.actuators.extinguisher?.lastChanged || Date.now()}
            onToggle={handleActuatorToggle}
            isLoading={commandFeedback.status === 'pending'}
          />

          {/* Actuator 5: Audible Alarm Siren */}
          <ActuatorCard
            type="buzzer"
            title={t.buzzerName}
            state={device.actuators.buzzer.state}
            lastChanged={device.actuators.buzzer.lastChanged}
            onToggle={handleActuatorToggle}
            isLoading={commandFeedback.status === 'pending'}
          />
        </div>
      </section>

      {/* 7. Emergency Cutoff Lockdown Button */}
      <section>
        <EmergencyButton
          onTriggerEmergency={handleEmergencyTrigger}
          isLoading={commandFeedback.status === 'pending'}
        />
      </section>

      {/* 8. Recent Safety Events Log */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <HistoryIcon className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            <h3 className="text-sm font-bold tracking-tight text-slate-900 dark:text-white">
              {t.recentEvents}
            </h3>
          </div>
          <button
            onClick={() => onNavigate('history')}
            className="text-xs text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 font-bold flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>{t.viewAll}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {recentEvents.length === 0 ? (
          <p className="text-xs text-slate-400 dark:text-slate-500 py-4 text-center">
            {t.noEvents}
          </p>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {recentEvents.map((evt) => (
              <div key={evt.id} className="py-3 flex items-start justify-between gap-4 text-xs">
                <div className="flex items-start gap-3">
                  <span className="font-mono text-xs text-slate-400 dark:text-slate-500 pt-0.5 shrink-0">
                    {formatTimestamp(evt.timestamp)}
                  </span>
                  <div>
                    <p
                      className={`font-semibold ${
                        evt.severity === 'EMERGENCY'
                          ? 'text-red-600 dark:text-red-400'
                          : evt.severity === 'WARNING'
                          ? 'text-amber-700 dark:text-amber-400'
                          : 'text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      {eventLabel(evt.type, t)}
                    </p>
                  </div>
                </div>

                <span
                  className={`px-2 py-0.5 rounded-full text-[11px] font-semibold shrink-0 ${
                    evt.severity === 'EMERGENCY'
                      ? 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800'
                      : evt.severity === 'WARNING'
                      ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                      : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                  }`}
                >
                  {severityLabel(evt.severity, t)}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Easy Guide Modal */}
      <EasyGuideModal
        isOpen={showGuideModal}
        onClose={() => setShowGuideModal(false)}
      />
    </div>
  );
};
