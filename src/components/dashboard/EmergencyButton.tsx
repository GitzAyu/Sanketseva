import React, { useState } from 'react';
import { AlertOctagon, ShieldAlert } from 'lucide-react';
import { ConfirmationModal } from '../common/ConfirmationModal';
import { useLanguage } from '../../context/LanguageContext';

interface EmergencyButtonProps {
  onTriggerEmergency: () => void;
  isLoading?: boolean;
}

export const EmergencyButton: React.FC<EmergencyButtonProps> = ({
  onTriggerEmergency,
  isLoading = false,
}) => {
  const { t } = useLanguage();
  const [showModal, setShowModal] = useState(false);

  const handleConfirm = () => {
    setShowModal(false);
    onTriggerEmergency();
  };

  return (
    <>
      <div className="bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs transition-colors duration-200">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/60 rounded-xl shrink-0 mt-0.5 shadow-2xs">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-rose-950 dark:text-rose-200 tracking-tight flex items-center gap-2">
              <span>{t.emergencyLockdownTitle}</span>
              <span className="w-2 h-2 rounded-full bg-rose-600 dark:bg-rose-400 animate-ping" />
            </h3>
            <p className="text-xs text-rose-900/80 dark:text-rose-300/80 mt-1 max-w-xl font-normal leading-relaxed">
              {t.emergencyLockdownSubtitle}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowModal(true)}
          disabled={isLoading}
          className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 active:scale-95 text-white font-extrabold text-xs tracking-wider uppercase rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 shrink-0 disabled:opacity-50 cursor-pointer"
        >
          <AlertOctagon className="w-4 h-4" />
          <span>{t.emergencyShutdown}</span>
        </button>
      </div>

      <ConfirmationModal
        isOpen={showModal}
        title={t.confirmEmergencyShutdown}
        description={t.emergencyLockdownSubtitle}
        confirmLabel={t.emergencyShutdown}
        confirmVariant="danger"
        isLoading={isLoading}
        onConfirm={handleConfirm}
        onCancel={() => setShowModal(false)}
        details={
          <ul className="space-y-1.5 text-slate-700 dark:text-slate-300 text-xs">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-600 dark:bg-rose-400" />
              <span>
                <strong>{t.valveName}:</strong> {t.closeValve}
              </span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              <span>
                <strong>{t.powerCutName}:</strong> Turn Power OFF (0V Cut - trip breaker to prevent sparks)
              </span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-600 dark:bg-rose-400" />
              <span>
                <strong>{t.fanName}:</strong> {t.startFan}
              </span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-600 dark:bg-rose-400" />
              <span>
                <strong>{t.extinguisherName}:</strong> {t.startExtinguisher}
              </span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-600 dark:bg-rose-400" />
              <span>
                <strong>{t.buzzerName}:</strong> {t.soundAlarm} & Emergency Alert Popup Broadcast
              </span>
            </li>
          </ul>
        }
      />
    </>
  );
};
