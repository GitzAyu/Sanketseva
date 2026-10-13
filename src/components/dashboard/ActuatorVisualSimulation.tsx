import React from 'react';
import { Lock, CheckCircle2, Zap, ZapOff } from 'lucide-react';
import { ValveState, SwitchState } from '../../types/actuators';
import { useLanguage } from '../../context/LanguageContext';

interface ActuatorVisualSimulationProps {
  type: 'valve' | 'fan' | 'buzzer' | 'extinguisher' | 'powerCut';
  state: ValveState | SwitchState;
  compact?: boolean;
}

export const ActuatorVisualSimulation: React.FC<ActuatorVisualSimulationProps> = ({
  type,
  state,
  compact = false,
}) => {
  const { t } = useLanguage();
  const isValve = type === 'valve';
  const isValveOpen = state === 'OPEN';
  const isSwitchOn = state === 'ON';

  // EXACT REVERSED USER SPECIFICATION:
  // Switch ON means Power ON (230V Live)
  // Switch OFF means Power OFF (0V Power Cut / Isolated)
  const isPowerCutType = type === 'powerCut';
  const isPowerOn = isPowerCutType && isSwitchOn;
  const isPowerOff = isPowerCutType && !isSwitchOn;

  const isActive = isValve ? isValveOpen : isPowerCutType ? isPowerOn : isSwitchOn;

  return (
    <div
      className={`relative w-full rounded-xl overflow-hidden border transition-all ${
        compact ? 'h-32' : 'h-40'
      } ${
        isPowerCutType
          ? isPowerOn
            ? 'bg-slate-950 border-emerald-500/40 shadow-inner'
            : 'bg-slate-950 border-amber-500/40 shadow-inner'
          : isActive
          ? type === 'extinguisher'
            ? 'bg-slate-950 border-sky-500/40 shadow-inner'
            : type === 'buzzer'
            ? 'bg-slate-950 border-rose-500/40 shadow-inner'
            : type === 'fan'
            ? 'bg-slate-950 border-cyan-400/40 shadow-inner'
            : 'bg-slate-950 border-emerald-500/40 shadow-inner'
          : 'bg-slate-900 border-slate-800'
      } flex flex-col items-center justify-between p-3 select-none`}
    >
      {/* Top telemetry status bar */}
      <div className="w-full flex items-center justify-between text-[11px] font-mono z-10">
        <div className="flex items-center gap-1.5">
          <span
            className={`w-2 h-2 rounded-full ${
              isPowerCutType
                ? isPowerOn
                  ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]'
                  : 'bg-amber-400 shadow-[0_0_8px_#f59e0b]'
                : isActive
                ? type === 'extinguisher'
                  ? 'bg-sky-400 shadow-[0_0_8px_#38bdf8] animate-pulse'
                  : type === 'buzzer'
                  ? 'bg-rose-500 shadow-[0_0_8px_#f43f5e] animate-pulse'
                  : type === 'fan'
                  ? 'bg-cyan-400 shadow-[0_0_8px_#22d3ee] animate-pulse'
                  : 'bg-emerald-400 shadow-[0_0_8px_#34d399]'
                : 'bg-slate-600'
            }`}
          />
          <span className="text-slate-400 font-semibold tracking-wide">
            {type === 'fan' && t.fanTitleVisual}
            {type === 'extinguisher' && t.extinguisherTitleVisual}
            {type === 'buzzer' && t.buzzerTitleVisual}
            {type === 'valve' && t.valveTitleVisual}
            {type === 'powerCut' && t.powerTitleVisual}
          </span>
        </div>

        <span
          className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider ${
            isPowerCutType
              ? isPowerOn
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              : isActive
              ? type === 'extinguisher'
                ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                : type === 'buzzer'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                : type === 'fan'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              : 'bg-slate-800 text-slate-400 border border-slate-700/60'
          }`}
        >
          {type === 'fan' && (isSwitchOn ? `1,450 RPM • ${t.rotating}` : `0 RPM • ${t.stopped}`)}
          {type === 'extinguisher' && (isSwitchOn ? `35 L/MIN • ${t.showering}` : t.standbyDry)}
          {type === 'buzzer' && (isSwitchOn ? `105 dB • ${t.sounding}` : t.silentArmed)}
          {type === 'valve' && (isValveOpen ? t.flowingOpen : t.isolatedClosed)}
          {type === 'powerCut' && (isPowerOn ? t.powerGridLive : t.powerCutIsolated)}
        </span>
      </div>

      {/* Main Visual Animation Canvas */}
      <div className="relative flex-1 w-full flex items-center justify-center overflow-hidden">
        {/* ======================= POWER SWITCH CONTACTOR / BREAKER VISUAL ======================= */}
        {type === 'powerCut' && (
          <div className="relative w-full h-full flex flex-col items-center justify-center">
            {/* Contactor Housing */}
            <div className="relative flex items-center justify-center gap-6">
              {/* Left Terminal Contact (Power Grid Input) */}
              <div className="flex flex-col items-center">
                <div className="w-7 h-4 bg-gradient-to-b from-amber-600 via-amber-400 to-amber-700 rounded-t-xs border border-amber-700 flex items-center justify-center text-[8px] font-mono font-bold text-slate-900">
                  L1
                </div>
                <div className="w-4 h-6 bg-slate-700 border border-slate-600" />
                <div
                  className={`w-3.5 h-3.5 rounded-full border-2 transition-all ${
                    isPowerOn
                      ? 'bg-emerald-400 border-emerald-300 shadow-[0_0_10px_#10b981]'
                      : 'bg-slate-800 border-slate-600'
                  }`}
                />
              </div>

              {/* Center Breaker Moving Arm / Contactor Contact Points */}
              <div className="relative flex flex-col items-center">
                <div
                  className={`relative w-16 h-12 rounded-xl border-2 flex flex-col items-center justify-center transition-all ${
                    isPowerOn
                      ? 'bg-slate-900 border-emerald-500/60 shadow-[0_0_12px_rgba(16,185,129,0.2)]'
                      : 'bg-slate-900 border-amber-500/60 shadow-[0_0_12px_rgba(245,158,11,0.2)]'
                  }`}
                >
                  {/* Moving Knife Switch Contact Arm:
                      When Power is ON (switch ON): closed (0 deg)
                      When Power is OFF (switch OFF): open (45 deg)
                  */}
                  <div
                    className={`w-1.5 h-7 rounded-full transition-all duration-300 origin-bottom ${
                      isPowerOn
                        ? 'bg-gradient-to-t from-emerald-500 to-emerald-300 rotate-0'
                        : 'bg-gradient-to-t from-slate-500 to-amber-400 rotate-45 -translate-y-0.5'
                    }`}
                  />
                  <div className="mt-1 flex items-center gap-1">
                    {isPowerOn ? (
                      <Zap className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                    ) : (
                      <ZapOff className="w-3.5 h-3.5 text-amber-400" />
                    )}
                    <span
                      className={`text-[9px] font-mono font-extrabold ${
                        isPowerOn ? 'text-emerald-400' : 'text-amber-400'
                      }`}
                    >
                      {isPowerOn ? '230V LIVE' : '0V CUT'}
                    </span>
                  </div>
                </div>

                {/* Arc Extinction Chute when power is OFF */}
                {isPowerOff && (
                  <div className="absolute -top-1 flex items-center justify-center">
                    <span className="text-[8px] font-bold text-amber-300 bg-amber-950/80 px-1.5 rounded border border-amber-600/60 animate-pulse">
                      SPARK PREVENTED
                    </span>
                  </div>
                )}
              </div>

              {/* Right Terminal Contact (Kitchen Appliance Output) */}
              <div className="flex flex-col items-center">
                <div className="w-7 h-4 bg-gradient-to-b from-amber-600 via-amber-400 to-amber-700 rounded-t-xs border border-amber-700 flex items-center justify-center text-[8px] font-mono font-bold text-slate-900">
                  LOAD
                </div>
                <div className="w-4 h-6 bg-slate-700 border border-slate-600" />
                <div
                  className={`w-3.5 h-3.5 rounded-full border-2 transition-all ${
                    isPowerOn
                      ? 'bg-emerald-400 border-emerald-300 shadow-[0_0_10px_#10b981]'
                      : 'bg-slate-800 border-slate-600'
                  }`}
                />
              </div>
            </div>

            {/* Subtext info */}
            <div className="mt-2 text-[10px] font-mono text-center">
              {isPowerOn ? (
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  {t.mains230VActive}
                </span>
              ) : (
                <span className="text-amber-400 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  {t.mains0VDeenergized}
                </span>
              )}
            </div>
          </div>
        )}

        {/* ======================= FAN VISUAL ======================= */}
        {type === 'fan' && (
          <div className="relative flex items-center justify-center">
            {isSwitchOn && (
              <>
                <div className="absolute w-28 h-28 rounded-full border border-cyan-400/20 animate-ping opacity-30 pointer-events-none" />
                <div className="absolute w-24 h-24 rounded-full border border-emerald-400/30 animate-pulse pointer-events-none" />
              </>
            )}
            <div
              className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-all ${
                isSwitchOn
                  ? 'border-4 border-cyan-500 bg-slate-900 shadow-[0_0_20px_rgba(6,182,212,0.35)]'
                  : 'border-4 border-slate-700 bg-slate-900/90'
              }`}
            >
              <div
                className={`relative w-16 h-16 flex items-center justify-center ${
                  isSwitchOn ? 'animate-fan-spin' : ''
                }`}
              >
                <div
                  className={`absolute w-3 h-7 rounded-t-full origin-bottom bottom-1/2 left-1/2 -translate-x-1/2 ${
                    isSwitchOn
                      ? 'bg-gradient-to-t from-cyan-400 to-sky-200 shadow-[0_0_6px_#38bdf8]'
                      : 'bg-slate-600'
                  }`}
                />
                <div
                  className={`absolute w-3 h-7 rounded-b-full origin-top top-1/2 left-1/2 -translate-x-1/2 ${
                    isSwitchOn
                      ? 'bg-gradient-to-b from-cyan-400 to-sky-200 shadow-[0_0_6px_#38bdf8]'
                      : 'bg-slate-600'
                  }`}
                />
                <div
                  className={`absolute h-3 w-7 rounded-r-full origin-left left-1/2 top-1/2 -translate-y-1/2 ${
                    isSwitchOn
                      ? 'bg-gradient-to-r from-cyan-400 to-sky-200 shadow-[0_0_6px_#38bdf8]'
                      : 'bg-slate-600'
                  }`}
                />
                <div
                  className={`absolute h-3 w-7 rounded-l-full origin-right right-1/2 top-1/2 -translate-y-1/2 ${
                    isSwitchOn
                      ? 'bg-gradient-to-l from-cyan-400 to-sky-200 shadow-[0_0_6px_#38bdf8]'
                      : 'bg-slate-600'
                  }`}
                />
                <div
                  className={`relative z-10 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    isSwitchOn ? 'bg-slate-900 border-cyan-300' : 'bg-slate-800 border-slate-600'
                  }`}
                >
                  <div
                    className={`w-2 h-2 rounded-full ${
                      isSwitchOn ? 'bg-cyan-300 animate-ping' : 'bg-slate-500'
                    }`}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================= EXTINGUISHER WATER SHOWER VISUAL ======================= */}
        {type === 'extinguisher' && (
          <div className="relative w-full h-full flex flex-col items-center justify-center">
            <div className="relative flex flex-col items-center z-10">
              <div className="w-2.5 h-4 bg-gradient-to-r from-slate-500 via-slate-300 to-slate-600 border border-slate-600" />
              <div className="w-4 h-1.5 bg-gradient-to-r from-amber-600 to-amber-500 rounded-xs" />
              <div
                className={`relative w-7 h-3.5 rounded-b-xl border flex items-center justify-center ${
                  isSwitchOn
                    ? 'bg-sky-500 border-sky-300 shadow-[0_0_10px_#38bdf8]'
                    : 'bg-slate-700 border-slate-600'
                }`}
              >
                <div
                  className={`w-1 h-2 rounded-full ${
                    isSwitchOn ? 'bg-cyan-200 animate-pulse' : 'bg-red-500'
                  }`}
                />
              </div>
              <div
                className={`w-9 h-1 rounded-full border ${
                  isSwitchOn ? 'bg-sky-300 border-sky-200' : 'bg-slate-500 border-slate-600'
                }`}
              />
            </div>

            {isSwitchOn ? (
              <div className="relative w-full h-16 flex items-center justify-center overflow-hidden">
                <div className="absolute top-0 w-24 h-14 bg-gradient-to-b from-sky-400/30 to-transparent blur-xs animate-water-mist rounded-b-full pointer-events-none" />
                <div className="absolute top-1 flex justify-center gap-2 w-20">
                  <div className="animate-water-drop-1">
                    <span className="w-1.5 h-3 bg-sky-300 rounded-full block shadow-[0_0_4px_#38bdf8]" />
                  </div>
                  <div className="animate-water-drop-2">
                    <span className="w-1 h-3.5 bg-cyan-200 rounded-full block shadow-[0_0_4px_#38bdf8]" />
                  </div>
                  <div className="animate-water-drop-3">
                    <span className="w-1.5 h-4 bg-sky-100 rounded-full block shadow-[0_0_6px_#06b6d4]" />
                  </div>
                  <div className="animate-water-drop-4">
                    <span className="w-1 h-3.5 bg-cyan-200 rounded-full block shadow-[0_0_4px_#38bdf8]" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-12 flex flex-col items-center justify-center">
                <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-slate-600" />
                  {t.nozzleDry}
                </span>
              </div>
            )}
          </div>
        )}

        {/* ======================= BUZZER / ALARM SIREN VISUAL ======================= */}
        {type === 'buzzer' && (
          <div className="relative w-full h-full flex items-center justify-center">
            {isSwitchOn && (
              <>
                <div className="absolute w-24 h-24 rounded-full border-2 border-rose-500/50 animate-siren-ring-1 pointer-events-none" />
                <div className="absolute w-24 h-24 rounded-full border-2 border-amber-400/40 animate-siren-ring-2 pointer-events-none" />
              </>
            )}
            <div className="relative flex flex-col items-center z-10">
              <div
                className={`relative w-10 h-7 rounded-t-full border flex items-center justify-center transition-all ${
                  isSwitchOn
                    ? 'bg-gradient-to-t from-rose-600 via-rose-500 to-amber-300 border-amber-200 shadow-[0_0_20px_#f43f5e] animate-pulse'
                    : 'bg-slate-700 border-slate-600'
                }`}
              >
                <div
                  className={`w-3 h-3 rounded-full ${
                    isSwitchOn ? 'bg-white shadow-[0_0_10px_#ffffff] animate-ping' : 'bg-slate-500'
                  }`}
                />
              </div>
              <div
                className={`w-14 h-7 rounded-b-lg border-x-2 border-b-2 flex items-center justify-center px-1.5 ${
                  isSwitchOn ? 'bg-slate-900 border-rose-500' : 'bg-slate-800 border-slate-700'
                }`}
              >
                <div className="flex items-center gap-1">
                  <div className={`w-1 rounded-full ${isSwitchOn ? 'h-4 bg-rose-400 animate-pulse' : 'h-2.5 bg-slate-600'}`} />
                  <div className={`w-1 rounded-full ${isSwitchOn ? 'h-5 bg-amber-300 animate-pulse delay-75' : 'h-3 bg-slate-600'}`} />
                  <div className={`w-1 rounded-full ${isSwitchOn ? 'h-4 bg-rose-400 animate-pulse delay-150' : 'h-2.5 bg-slate-600'}`} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================= VALVE GAS PIPELINE VISUAL ======================= */}
        {type === 'valve' && (
          <div className="relative w-full h-full flex flex-col items-center justify-center">
            <div className="relative w-full flex items-center justify-center px-2">
              <div
                className={`h-4.5 flex-1 rounded-l border-y border-l ${
                  isValveOpen ? 'bg-slate-800 border-emerald-500/40' : 'bg-slate-800 border-slate-700'
                }`}
              />
              <div className="w-2 h-7 bg-slate-600 border border-slate-500" />
              <div
                className={`relative w-11 h-9 mx-1 rounded-lg border-2 flex flex-col items-center justify-center z-10 ${
                  isValveOpen
                    ? 'bg-slate-900 border-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.35)]'
                    : 'bg-slate-900 border-slate-600'
                }`}
              >
                <div
                  className={`absolute -top-5 w-2.5 h-7 rounded-full border transition-transform duration-500 origin-bottom ${
                    isValveOpen
                      ? 'bg-emerald-500 border-emerald-300 rotate-90 translate-x-2.5 -translate-y-1'
                      : 'bg-red-500 border-red-300 rotate-0 translate-x-0'
                  }`}
                />
                <div
                  className={`w-4.5 h-4.5 rounded-full flex items-center justify-center border ${
                    isValveOpen
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                      : 'bg-red-500/20 border-red-400 text-red-300'
                  }`}
                >
                  {isValveOpen ? <CheckCircle2 className="w-3 h-3" /> : <Lock className="w-2.5 h-2.5" />}
                </div>
              </div>
              <div className="w-2 h-7 bg-slate-600 border border-slate-500" />
              <div
                className={`h-4.5 flex-1 rounded-r border-y border-r ${
                  isValveOpen ? 'bg-slate-800 border-emerald-500/40' : 'bg-slate-800 border-slate-700'
                }`}
              />
            </div>
            <div className="mt-2 text-[10px] font-mono text-center">
              {isValveOpen ? (
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  {t.gasFlowingUnrestricted}
                </span>
              ) : (
                <span className="text-rose-400 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                  {t.gasIsolatedCylinder}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Live Action Caption */}
      <div className="w-full flex items-center justify-between pt-1 border-t border-slate-800/80 text-[10px] text-slate-400">
        <span>{t.hardwareRelayBus}</span>
        <span className="font-semibold text-slate-300">
          {isPowerCutType
            ? isPowerOn
              ? `⚡ 230V Live (Power ON)`
              : `🔒 0V Cut Safe (Power OFF)`
            : isActive
            ? `⚡ ${t.liveRunning}`
            : `⚪ ${t.standbyIdle}`}
        </span>
      </div>
    </div>
  );
};
