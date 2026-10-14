import React, { useState, useRef, useEffect } from 'react';
import {
  ShieldCheck,
  LogOut,
  AlertOctagon,
  Menu,
  HelpCircle,
  Sliders,
  User,
  Volume2,
  VolumeX,
  Bell,
  ZapOff,
  AlertTriangle,
} from 'lucide-react';
import { useDevice } from '../../context/DeviceContext';
import { useLanguage } from '../../context/LanguageContext';
import { LanguageSelector } from '../common/LanguageSelector';
import { ThemeToggleButton } from '../common/ThemeToggleButton';
import { EasyGuideModal } from '../dashboard/EasyGuideModal';

interface HeaderProps {
  userEmail?: string | null;
  currentRoute?: string;
  onNavigate?: (route: string) => void;
  onLogout: () => void;
  onOpenMobileMenu?: () => void;
  onOpenEmergencyModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  userEmail,
  currentRoute = 'dashboard',
  onNavigate,
  onLogout,
  onOpenMobileMenu,
  onOpenEmergencyModal,
}) => {
  const {
    isOnline,
    isAudioMuted,
    isAlarmSounding,
    toggleAudioMute,
    silenceAlarm,
    testAudioAlarm,
    device,
    activeEmergencyAlert,
    openAlertPopup,
  } = useDevice();
  const { t } = useLanguage();
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const userDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setShowUserDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOutClick = async () => {
    setShowUserDropdown(false);
    await onLogout();
  };

  const getRouteTitle = () => {
    switch (currentRoute) {
      case 'dashboard':
        return t.navDashboard;
      case 'monitoring':
        return t.navMonitoring;
      case 'controls':
        return t.navControls;
      case 'alerts':
        return t.navAlerts;
      case 'history':
        return t.navHistory;
      case 'settings':
        return t.navSettings;
      case 'profile':
        return t.navProfile;
      case 'privacy':
        return t.privacyPolicy;
      case 'terms':
        return t.termsConditions;
      default:
        return t.navDashboard;
    }
  };

  // Switch ON means Power ON; Switch OFF means Power OFF (0V Cut)
  const isPowerOff = device.actuators.powerCut?.state === 'OFF';

  return (
    <>
      <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 sm:px-6 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 transition-colors duration-200">
        {/* Left Zone: Breadcrumb / Mobile menu toggle */}
        <div className="flex items-center gap-3">
          {onOpenMobileMenu && (
            <button
              type="button"
              onClick={onOpenMobileMenu}
              className="md:hidden p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              aria-label={t.menuLabel}
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          {/* On mobile: compact brand */}
          <div className="flex md:hidden items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-sm tracking-tight text-slate-900 dark:text-white">
              {t.brandName}
            </span>
          </div>

          {/* On desktop: Breadcrumb title */}
          <div className="hidden md:flex items-center gap-2 text-xs">
            <span className="text-slate-400 dark:text-slate-500 font-medium">{t.console}</span>
            <span className="text-slate-300 dark:text-slate-600">/</span>
            <span className="font-bold text-slate-900 dark:text-white text-sm">
              {getRouteTitle()}
            </span>
          </div>
        </div>

        {/* Right Zone: Controls, Sound Alerts, Emergency Cutoff, Theme */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Active Emergency Alert Button to reopen Popup */}
          {activeEmergencyAlert && (
            <button
              type="button"
              onClick={openAlertPopup}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-lg bg-rose-600 text-white animate-pulse hover:bg-rose-700 transition-colors cursor-pointer shadow-xs"
              title={t.viewAlertPopup}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{t.viewAlertPopup}</span>
            </button>
          )}

          {/* Hardware Connection Status */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-slate-600 dark:text-slate-300">
            <span
              className={`w-2 h-2 rounded-full ${
                isOnline ? 'bg-emerald-500' : 'bg-slate-400 dark:bg-slate-500'
              }`}
            />
            <span className="text-[11px] uppercase tracking-wider font-bold">
              {isOnline ? t.online : t.offline}
            </span>
          </div>

          {/* Power Status Badge: Shows POWER OFF when switch is OFF */}
          {isPowerOff && (
            <div className="hidden lg:flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-amber-700 dark:text-amber-300 animate-pulse">
              <ZapOff className="w-3.5 h-3.5" />
              <span>{t.powerOffBadge}</span>
            </div>
          )}

          {/* SOUND ALERT CONTROLS: Polite Chime indicator & Mute/Unmute */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-0.5 rounded-xl border border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={toggleAudioMute}
              className={`px-2 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-semibold ${
                isAudioMuted
                  ? 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                  : isAlarmSounding
                  ? 'bg-rose-600 text-white animate-pulse shadow-xs font-bold'
                  : 'text-emerald-700 dark:text-emerald-400 hover:bg-white dark:hover:bg-slate-700'
              }`}
              title={
                isAudioMuted
                  ? t.mutedByYou
                  : isAlarmSounding
                  ? t.audioAlarmPlaying
                  : t.politeChime
              }
            >
              {isAudioMuted ? (
                <VolumeX className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
              <span className="hidden xl:inline text-[11px] font-medium">
                {isAudioMuted
                  ? t.mutedByYou
                  : isAlarmSounding
                  ? t.audioAlarmPlaying
                  : t.politeChime}
              </span>
            </button>

            {/* Test sound button */}
            <button
              type="button"
              onClick={testAudioAlarm}
              className="p-1.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-white dark:hover:bg-slate-700 transition-colors cursor-pointer"
              title={t.testSound}
              aria-label={t.testSound}
            >
              <Bell className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Emergency Cutoff Button */}
          <button
            type="button"
            onClick={onOpenEmergencyModal}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white rounded-xl text-xs font-bold tracking-wide transition-all shadow-xs cursor-pointer"
            title={t.emergencyShutdown}
          >
            <AlertOctagon className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden sm:inline">{t.cutoff}</span>
          </button>

          {/* Quick Guide Icon Button */}
          <button
            type="button"
            onClick={() => setShowGuideModal(true)}
            className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
            title={t.howItWorks}
            aria-label={t.howItWorks}
          >
            <HelpCircle className="w-4.5 h-4.5 text-emerald-600 dark:text-emerald-400" />
          </button>

          {/* Language Selector */}
          <LanguageSelector variant="icon" />

          {/* Dark / Light Mode Toggle */}
          <ThemeToggleButton />

          {/* User Account Avatar & Dropdown */}
          <div className="relative" ref={userDropdownRef}>
            <button
              type="button"
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className="flex items-center justify-center w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
              aria-label={t.navProfile}
            >
              <span className="font-bold text-xs uppercase">
                {userEmail ? userEmail.charAt(0) : 'O'}
              </span>
            </button>

            {showUserDropdown && (
              <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl py-2 z-50 text-xs">
                <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 block uppercase font-bold tracking-wider">
                    {t.signedInAs}
                  </span>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 truncate mt-0.5">
                    {userEmail || 'operator@gasguard.local'}
                  </p>
                </div>
                <div className="py-1">
                  <button
                    type="button"
                    onClick={() => {
                      if (onNavigate) onNavigate('profile');
                      setShowUserDropdown(false);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 text-slate-700 dark:text-slate-300 cursor-pointer"
                  >
                    <User className="w-4 h-4 text-slate-400" />
                    <span>{t.navProfile}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (onNavigate) onNavigate('settings');
                      setShowUserDropdown(false);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 text-slate-700 dark:text-slate-300 cursor-pointer"
                  >
                    <Sliders className="w-4 h-4 text-slate-400" />
                    <span>{t.navSettings}</span>
                  </button>
                </div>
                <div className="border-t border-slate-100 dark:border-slate-800 pt-1 mt-1">
                  <button
                    type="button"
                    onClick={handleSignOutClick}
                    className="w-full px-4 py-2 text-left hover:bg-red-50 dark:hover:bg-red-950/40 text-red-600 dark:text-red-400 font-bold flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <LogOut className="w-4 h-4 text-red-600 dark:text-red-400" />
                    <span>{t.signOut}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Quick Guide Modal */}
      <EasyGuideModal isOpen={showGuideModal} onClose={() => setShowGuideModal(false)} />

    </>
  );
};
