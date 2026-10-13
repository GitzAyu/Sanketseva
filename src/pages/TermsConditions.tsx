import React from 'react';
import { FileText, ArrowLeft, AlertTriangle } from 'lucide-react';

interface TermsConditionsProps {
  onBack: () => void;
}

export const TermsConditions: React.FC<TermsConditionsProps> = ({ onBack }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16 text-slate-800 dark:text-slate-100 transition-colors duration-200">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 text-xs text-emerald-800 dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-emerald-300 font-bold transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Console</span>
        </button>
        <div className="text-xs text-slate-400 dark:text-slate-500 font-medium">
          Last Updated: October 2026
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 rounded-xl shadow-xs">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              GasGuard Terms and Conditions
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Operational Terms, Safety Controller Boundaries, and System Responsibility
            </p>
          </div>
        </div>

        <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 rounded-xl flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-950 dark:text-amber-200 leading-relaxed font-medium">
            <strong className="block font-bold mb-1 text-amber-900 dark:text-amber-300">
              ARCHITECTURAL SAFETY PRINCIPLE
            </strong>
            The GasGuard web interface is an auxiliary monitoring, visualization, and remote command dispatch utility. The physical ESP32 edge microcontroller executes local failsafe cutoffs autonomously. Automatic emergency fuel shutoff and mains power disconnection are executed locally at hardware level.
          </div>
        </div>

        <section className="space-y-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-1.5">
            1. Operational Architecture & Fail-Safe Invariants
          </h2>
          <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-600 dark:text-slate-300">
            <li>
              Opening the LPG fuel supply valve is governed by independent hardware safety interlocks. If dangerous gas concentrations, thermal limits, smoke, or optical flame triggers are present, the hardware rejects the command regardless of operator input.
            </li>
            <li>
              Mains power control isolates 230V AC kitchen circuits (Power OFF) to eliminate potential electrical spark ignition sources during gas leakages.
            </li>
            <li>
              Network connectivity loss, database latency, or browser termination will not impede local edge protection mechanisms.
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
};
