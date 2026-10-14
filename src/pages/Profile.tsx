import React from 'react';
import { User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

interface ProfileProps {
  onLogout: () => void;
}

export const Profile: React.FC<ProfileProps> = ({ onLogout }) => {
  const { user } = useAuth();
  const { t } = useLanguage();

  return (
    <section className="max-w-2xl mx-auto space-y-5 pb-12">
      <header className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
        <div className="flex items-center gap-2">
          <User className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
          <h1 className="text-base font-bold text-slate-900 dark:text-white">{t.navProfile}</h1>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{t.signedInAs}</p>
      </header>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0">
          <div className="w-12 h-12 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold shrink-0">
            {(user?.email || '?').charAt(0).toUpperCase()}
          </div>
          <p className="text-sm font-semibold text-slate-900 dark:text-white break-all">{user?.email || '—'}</p>
        </div>
        <button type="button" onClick={onLogout} className="px-4 py-2.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 rounded-xl text-xs font-bold flex items-center justify-center gap-2">
          <LogOut className="w-4 h-4" />{t.signOut}
        </button>
      </div>
    </section>
  );
};
