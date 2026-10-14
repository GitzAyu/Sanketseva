import React from 'react';
import {
  LayoutDashboard,
  Activity,
  Sliders,
  AlertTriangle,
  History,
  Settings,
  User,
  ShieldCheck,
  FileText,
  Lock,
  X,
  CheckCircle2,
  LogOut,
} from 'lucide-react';
import { useDevice } from '../../context/DeviceContext';
import { useLanguage } from '../../context/LanguageContext';

interface SidebarProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
  onLogout?: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentRoute,
  onNavigate,
  onLogout,
  isMobileOpen = false,
  onCloseMobile,
}) => {
  const { device, isOnline } = useDevice();
  const { t } = useLanguage();

  const navItems = [
    { id: 'dashboard', label: t.navDashboard, icon: LayoutDashboard },
    { id: 'monitoring', label: t.navMonitoring, icon: Activity },
    { id: 'controls', label: t.navControls, icon: Sliders },
    { id: 'alerts', label: t.navAlerts, icon: AlertTriangle },
    { id: 'history', label: t.navHistory, icon: History },
    { id: 'settings', label: t.navSettings, icon: Settings },
    { id: 'profile', label: t.navProfile, icon: User },
  ];

  const legalItems = [
    { id: 'privacy', label: t.privacyPolicy, icon: Lock },
    { id: 'terms', label: t.termsConditions, icon: FileText },
  ];

  const handleNavClick = (route: string) => {
    onNavigate(route);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs md:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between transition-colors duration-200 md:static md:translate-x-0 ${
          isMobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-0 max-md:-translate-x-full'
        }`}
      >
        <div>
          {/* Logo brand lockup */}
          <div className="h-16 px-5 flex items-center justify-between border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center font-extrabold text-base shadow-xs">
                <ShieldCheck className="w-4.5 h-4.5 text-white" />
              </div>
              <div>
                <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white">
                  {t.brandName}
                </span>
                <p className="text-[10px] text-emerald-700 dark:text-emerald-400 uppercase tracking-wider font-bold">
                  IoT Safety System
                </p>
              </div>
            </div>

            {/* Mobile close button */}
            {isMobileOpen && (
              <button
                onClick={onCloseMobile}
                className="md:hidden p-1.5 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                aria-label={t.close}
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Primary Navigation */}
          <nav className="p-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentRoute === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400 dark:text-slate-500'}`} />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section: Device status & sign out */}
        <div className="p-3 space-y-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40">
          <div className="p-3 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl text-xs shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 dark:text-white truncate max-w-[120px]">
                {device.info.name}
              </span>
              {isOnline ? (
                <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{t.online}</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-slate-400 dark:text-slate-500 text-xs font-medium">
                  <span className="w-2 h-2 rounded-full bg-slate-400" />
                  <span>{t.offline}</span>
                </div>
              )}
            </div>

          </div>

          {/* Sign Out Button in Sidebar */}
          {onLogout && (
            <button
              type="button"
              onClick={async () => {
                if (onCloseMobile) onCloseMobile();
                await onLogout();
              }}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/50 border border-rose-200 dark:border-rose-900/50 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
              <span>{t.signOut}</span>
            </button>
          )}

          {/* Legal routes */}
          <div className="flex items-center justify-between px-2 pt-1 text-[11px] text-slate-400 dark:text-slate-500">
            {legalItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors cursor-pointer"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
};
