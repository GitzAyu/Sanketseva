import React from 'react';
import {
  Wind,
  Flame,
  Volume2,
  AlertOctagon,
  X,
  HelpCircle,
  Activity,
  Info,
  ShowerHead,
  ZapOff,
  CloudFog,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface EasyGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EasyGuideModal: React.FC<EasyGuideModalProps> = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-2xs"
    >
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 text-slate-900 dark:text-slate-100 max-h-[90vh] overflow-y-auto transition-colors duration-200">
        <button
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900/50 text-emerald-700 dark:text-emerald-400 rounded-xl shadow-xs">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              {t.easyUnderstandingTitle}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {t.easyUnderstandingSubtitle}
            </p>
          </div>
        </div>

        {/* Overview banner */}
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 rounded-xl mb-5 text-xs text-emerald-950 dark:text-emerald-200 leading-relaxed flex items-start gap-3">
          <Info className="w-5 h-5 text-emerald-700 dark:text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <strong className="font-bold text-emerald-900 dark:text-emerald-300 block mb-0.5">
              {t.howItWorks}
            </strong>
            <span className="font-medium">
              GasGuard actively links environmental sensors (LPG, Flame, Smoke) with automated safety actuators (Gas Valve, Mains Power Cut, Exhaust Fan, Water Shower). When any hazard is detected, the website immediately alerts you with an audible siren and popup notification, while the hardware isolates fuel and switches mains electricity OFF.
            </span>
          </div>
        </div>

        {/* Safety Elements Cards */}
        <div className="space-y-3.5 text-xs">
          {/* 1. LPG */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 rounded-xl flex items-start gap-3.5 hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors">
            <div className="p-2.5 bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300 rounded-lg shrink-0">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">{t.guideLpgTitle}</h3>
              <p className="text-slate-600 dark:text-slate-400 mt-1 leading-relaxed font-medium">
                {t.guideLpgDesc}
              </p>
              <div className="mt-2.5 flex flex-wrap gap-2 text-xs font-semibold">
                <span className="px-2.5 py-1 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 rounded-md">
                  &lt;400: Clean Safe Air
                </span>
                <span className="px-2.5 py-1 bg-amber-100 dark:bg-amber-900/40 text-amber-900 dark:text-amber-300 rounded-md">
                  400 - 500: Fan Starts Automatically
                </span>
                <span className="px-2.5 py-1 bg-red-100 dark:bg-red-900/40 text-red-900 dark:text-red-300 rounded-md">
                  &gt;500: Gas Cut Off & Power OFF (0V)
                </span>
              </div>
            </div>
          </div>

          {/* 2. Fire */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 rounded-xl flex items-start gap-3.5 hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors">
            <div className="p-2.5 bg-orange-100 dark:bg-orange-900/60 text-orange-800 dark:text-orange-300 rounded-lg shrink-0">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">{t.guideFlameTitle}</h3>
              <p className="text-slate-600 dark:text-slate-400 mt-1 leading-relaxed font-medium">
                {t.guideFlameDesc}
              </p>
            </div>
          </div>

          {/* 3. Smoke */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 rounded-xl flex items-start gap-3.5 hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors">
            <div className="p-2.5 bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 rounded-lg shrink-0">
              <CloudFog className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">{t.guideSmokeTitle}</h3>
              <p className="text-slate-600 dark:text-slate-400 mt-1 leading-relaxed font-medium">
                {t.guideSmokeDesc}
              </p>
            </div>
          </div>

          {/* 4. Power Control */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 rounded-xl flex items-start gap-3.5 hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors">
            <div className="p-2.5 bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 rounded-lg shrink-0">
              <ZapOff className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">{t.guidePowerCutTitle}</h3>
              <p className="text-slate-600 dark:text-slate-400 mt-1 leading-relaxed font-medium">
                {t.guidePowerCutDesc}
              </p>
            </div>
          </div>

          {/* 5. Solenoid Valve */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 rounded-xl flex items-start gap-3.5 hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors">
            <div className="p-2.5 bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 rounded-lg shrink-0">
              <AlertOctagon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">{t.guideValveTitle}</h3>
              <p className="text-slate-600 dark:text-slate-400 mt-1 leading-relaxed font-medium">
                {t.guideValveDesc}
              </p>
            </div>
          </div>

          {/* 6. Fan */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 rounded-xl flex items-start gap-3.5 hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors">
            <div className="p-2.5 bg-cyan-100 dark:bg-cyan-900/60 text-cyan-800 dark:text-cyan-300 rounded-lg shrink-0">
              <Wind className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">{t.guideFanTitle}</h3>
              <p className="text-slate-600 dark:text-slate-400 mt-1 leading-relaxed font-medium">
                {t.guideFanDesc}
              </p>
            </div>
          </div>

          {/* 7. Extinguisher */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 rounded-xl flex items-start gap-3.5 hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors">
            <div className="p-2.5 bg-sky-100 dark:bg-sky-900/60 text-sky-800 dark:text-sky-300 rounded-lg shrink-0">
              <ShowerHead className="w-5 h-5 text-sky-700 dark:text-sky-400" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">{t.extinguisherName}</h3>
              <p className="text-slate-600 dark:text-slate-400 mt-1 leading-relaxed font-medium">
                {t.extinguisherDesc}. Automatic overhead water deluge suppressing flames and heat flare-ups.
              </p>
            </div>
          </div>

          {/* 8. Buzzer */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 rounded-xl flex items-start gap-3.5 hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors">
            <div className="p-2.5 bg-rose-100 dark:bg-rose-900/60 text-rose-800 dark:text-rose-300 rounded-lg shrink-0">
              <Volume2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">{t.guideBuzzerTitle}</h3>
              <p className="text-slate-600 dark:text-slate-400 mt-1 leading-relaxed font-medium">
                {t.guideBuzzerDesc}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs transition-colors shadow-xs cursor-pointer"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};
