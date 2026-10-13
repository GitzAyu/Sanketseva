import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User, LogOut } from 'lucide-react';

interface ProfileProps {
  onLogout: () => void;
}

export const Profile: React.FC<ProfileProps> = ({ onLogout }) => {
  const { user } = useAuth();
  const userEmail = user?.email || '';

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-12 transition-colors duration-200">
      <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs">
        <div className="flex items-center gap-2">
          <User className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
          <h1 className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
            Operator Profile & Account Authorization
          </h1>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Authorized personnel account credentials and safety command privileges
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-6 shadow-xs">
        <div className="flex items-center gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center text-xl font-bold shadow-xs">
            {userEmail.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">{userEmail}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-600 dark:bg-emerald-400" />
              <span className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold">
                Authorized Safety Operator
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 rounded-2xl">
            <span className="text-slate-400 dark:text-slate-400 block text-[11px] font-semibold">ROLE & ACCESS</span>
            <span className="text-slate-900 dark:text-white font-bold text-sm mt-0.5 block">Safety Controller (Tier 1)</span>
          </div>
          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 rounded-2xl">
            <span className="text-slate-400 dark:text-slate-400 block text-[11px] font-semibold">COMMAND CLEARANCE</span>
            <span className="text-emerald-800 dark:text-emerald-400 font-bold text-sm mt-0.5 block">
              Gas Solenoid & Mains Power Control
            </span>
          </div>
          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 rounded-2xl">
            <span className="text-slate-400 dark:text-slate-400 block text-[11px] font-semibold">SAFETY AUDIT TOKEN</span>
            <span className="text-emerald-800 dark:text-emerald-400 font-bold text-sm mt-0.5 block font-mono text-xs">
              TOKEN-OP-ACTIVE
            </span>
          </div>
          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 rounded-2xl">
            <span className="text-slate-400 dark:text-slate-400 block text-[11px] font-semibold">EMERGENCY SHUTOFF OVERRIDE</span>
            <span className="text-emerald-800 dark:text-emerald-400 font-bold text-sm mt-0.5 block">Granted</span>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={async () => {
              await onLogout();
            }}
            className="px-5 py-2.5 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 shadow-2xs cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-rose-600 dark:text-rose-400" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};
