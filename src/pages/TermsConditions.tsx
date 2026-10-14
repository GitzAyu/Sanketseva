import React from 'react';
import { ArrowLeft, FileText, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface TermsConditionsProps { onBack: () => void }

export const TermsConditions: React.FC<TermsConditionsProps> = ({ onBack }) => {
  const { t } = useLanguage();
  return (
    <main className="max-w-3xl mx-auto space-y-5 pb-12 text-slate-800 dark:text-slate-100">
      <button type="button" onClick={onBack} className="flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-400 font-semibold">
        <ArrowLeft className="w-4 h-4" />{t.backToConsole}
      </button>
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4">
        <header className="flex items-center gap-3">
          <FileText className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
          <div><h1 className="text-xl font-bold">{t.termsTitle}</h1><p className="text-xs text-slate-500 mt-1">{t.legalIntro}</p></div>
        </header>
        <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">{t.termsSafety}</p>
        <aside className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 rounded-xl flex items-start gap-3 text-sm leading-relaxed text-amber-900 dark:text-amber-200">
          <AlertTriangle className="w-5 h-5 shrink-0" />{t.termsResponsibility}
        </aside>
      </section>
    </main>
  );
};
