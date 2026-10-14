/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import { DeviceProvider, useDevice } from './context/DeviceContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { MobileNavigation } from './components/layout/MobileNavigation';
import { ConfirmationModal } from './components/common/ConfirmationModal';
import { EmergencyAudioBanner } from './components/common/EmergencyAudioBanner';
import { AlertNotificationPopup } from './components/common/AlertNotificationPopup';
import { useLanguage } from './context/LanguageContext';

// Pages
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Monitoring } from './pages/Monitoring';
import { Controls } from './pages/Controls';
import { Alerts } from './pages/Alerts';
import { History } from './pages/History';
import { Settings } from './pages/Settings';
import { Profile } from './pages/Profile';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { TermsConditions } from './pages/TermsConditions';

function MainLayout() {
  const { user, logout } = useAuth();
  const { sendCommand } = useDevice();
  const { t } = useLanguage();
  const [currentRoute, setCurrentRoute] = useState<string>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showGlobalEmergencyModal, setShowGlobalEmergencyModal] = useState(false);
  const [isEmergencyLoading, setIsEmergencyLoading] = useState(false);

  const handleGlobalEmergency = async () => {
    setIsEmergencyLoading(true);
    await sendCommand('emergency', 'ACTIVATE');
    setIsEmergencyLoading(false);
    setShowGlobalEmergencyModal(false);
  };

  const renderContent = () => {
    switch (currentRoute) {
      case 'dashboard':
        return <Dashboard onNavigate={(r) => setCurrentRoute(r)} />;
      case 'monitoring':
        return <Monitoring />;
      case 'controls':
        return <Controls />;
      case 'alerts':
        return <Alerts />;
      case 'history':
        return <History />;
      case 'settings':
        return <Settings />;
      case 'profile':
        return <Profile onLogout={logout} />;
      case 'privacy':
        return <PrivacyPolicy onBack={() => setCurrentRoute('dashboard')} />;
      case 'terms':
        return <TermsConditions onBack={() => setCurrentRoute('dashboard')} />;
      default:
        return <Dashboard onNavigate={(r) => setCurrentRoute(r)} />;
    }
  };

  return (
    <div className="flex h-screen bg-[#f8fafc] dark:bg-[#090d16] text-[#0f172a] dark:text-[#f8fafc] overflow-hidden font-sans transition-colors duration-200">
      {/* Desktop Sidebar with direct Logout */}
      <Sidebar
        currentRoute={currentRoute}
        onNavigate={(route) => setCurrentRoute(route)}
        onLogout={logout}
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main View Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header
          userEmail={user?.email}
          currentRoute={currentRoute}
          onNavigate={(route) => setCurrentRoute(route)}
          onLogout={logout}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          onOpenEmergencyModal={() => setShowGlobalEmergencyModal(true)}
        />

        {/* Floating High-Priority Emergency Sound & Alert Banner */}
        <EmergencyAudioBanner />

        {/* Modal Alert Notification Popup with prominent Close Button */}
        <AlertNotificationPopup />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-20 md:pb-8 bg-[#f8fafc] dark:bg-[#090d16] transition-colors duration-200">
          {renderContent()}
        </main>

        {/* Mobile Navigation */}
        <MobileNavigation
          currentRoute={currentRoute}
          onNavigate={(route) => setCurrentRoute(route)}
        />
      </div>

      {/* Global Header Emergency Shutdown Modal */}
      <ConfirmationModal
        isOpen={showGlobalEmergencyModal}
        title={t.confirmEmergencyShutdown}
        description={t.emergencyLockdownSubtitle}
        confirmLabel={t.confirmEmergencyShutdown}
        confirmVariant="danger"
        isLoading={isEmergencyLoading}
        onConfirm={handleGlobalEmergency}
        onCancel={() => setShowGlobalEmergencyModal(false)}
      />
    </div>
  );
}

export default function App() {
  const { user, loading } = useAuth();
  const { t } = useLanguage();
  const [unauthLegalView, setUnauthLegalView] = useState<'privacy' | 'terms' | null>(null);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] dark:bg-[#090d16] flex flex-col items-center justify-center p-4">
        <div className="w-8 h-8 border-2 border-emerald-300 border-t-emerald-700 dark:border-emerald-600 dark:border-t-emerald-400 rounded-full animate-spin mb-4" />
        <span className="text-xs font-mono text-emerald-800 dark:text-emerald-400 font-semibold">
          {t.loading}
        </span>
      </div>
    );
  }

  // Not logged in and clicked legal page
  if (!user) {
    if (unauthLegalView === 'privacy') {
      return (
        <div className="min-h-screen bg-[#f8fafc] dark:bg-[#090d16] p-6">
          <PrivacyPolicy onBack={() => setUnauthLegalView(null)} />
        </div>
      );
    }
    if (unauthLegalView === 'terms') {
      return (
        <div className="min-h-screen bg-[#f8fafc] dark:bg-[#090d16] p-6">
          <TermsConditions onBack={() => setUnauthLegalView(null)} />
        </div>
      );
    }
    return (
      <Login
        onLoginSuccess={() => {}}
        onNavigateLegal={(route) => setUnauthLegalView(route)}
      />
    );
  }

  return (
    <DeviceProvider currentUserId={user.email}>
      <MainLayout />
    </DeviceProvider>
  );
}
