import React from 'react';
import { LayoutDashboard, Activity, Sliders, AlertTriangle, History } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface MobileNavigationProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({ currentRoute, onNavigate }) => {
  const { t } = useLanguage();

  const tabs = [
    { id: 'dashboard', label: t.navDashboard.split(' ')[0], icon: LayoutDashboard },
    { id: 'monitoring', label: t.navMonitoring.split(' ')[0], icon: Activity },
    { id: 'controls', label: t.navControls.split(' ')[0], icon: Sliders },
    { id: 'alerts', label: t.navAlerts.split(' ')[0], icon: AlertTriangle },
    { id: 'history', label: t.navHistory.split(' ')[0], icon: History },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-2 py-1.5 flex items-center justify-around text-[10px] shadow-sm transition-colors duration-200">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = currentRoute === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onNavigate(tab.id)}
            className={`flex flex-col items-center py-1 px-2.5 rounded-lg transition-colors cursor-pointer ${
              isActive
                ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Icon className={`w-4 h-4 mb-0.5 ${isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'}`} />
            <span className="truncate max-w-[64px] font-medium">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
