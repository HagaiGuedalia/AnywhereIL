import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { ScenarioBanner } from './components/ScenarioBanner';
import { Navbar } from './components/Navbar';
import { WhatsAppSimulatorModal, WhatsAppToastContainer } from './components/WhatsAppSimulatorModal';
import { SignInModal } from './components/SignInModal';
import { GuestRegistrationModal } from './components/GuestRegistrationModal';
import { HostingRequestModal } from './components/HostingRequestModal';
import { RequestCardModal } from './components/RequestCardModal';
import { FeedbackModal } from './components/FeedbackModal';
import { HostApplicationModal, CompleteDetailsModal } from './components/HostApplicationModal';
import { ContactSupportModal } from './components/ContactSupportModal';

import { HomeScreen } from './screens/HomeScreen';
import { MyRequestsScreen } from './screens/MyRequestsScreen';
import { HostDashboardScreen } from './screens/HostDashboardScreen';
import { HostScheduleScreen } from './screens/HostScheduleScreen';
import { HostProfileScreen } from './screens/HostProfileScreen';
import { AdminDashboardScreen } from './screens/AdminDashboardScreen';
import { Flame, Heart, Shield, MessageSquare, RotateCcw } from 'lucide-react';

function AppContent() {
  const { activeScreen, resetAllData, t } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-[#fcfbf7] text-slate-800 selection:bg-amber-500 selection:text-white">
      {/* 1-Click Interactive Scenario Bar */}
      <ScenarioBanner />

      {/* Navigation */}
      <Navbar />

      {/* Main Screen Content */}
      <main className="flex-1">
        {activeScreen === 'home' && <HomeScreen />}
        {activeScreen === 'my-requests' && <MyRequestsScreen />}
        {activeScreen === 'host-dashboard' && <HostDashboardScreen />}
        {activeScreen === 'host-schedule' && <HostScheduleScreen />}
        {activeScreen === 'host-profile' && <HostProfileScreen />}
        {activeScreen === 'admin-dashboard' && <AdminDashboardScreen />}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200/80 bg-white/60 backdrop-blur-xs py-8 px-4 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold text-xs">
              <Flame className="w-3.5 h-3.5 fill-white" />
            </div>
            <span className="font-extrabold text-slate-800">Bayit Cham • בית חם</span>
            <span>—</span>
            <span>{t('Shabbat & Holiday Hosting Network in Israel', 'רשת אירוח שבתות וחגים בישראל')}</span>
          </div>

          <div className="flex items-center gap-4 text-slate-500">
            <span>{t('Strict Kashrut & Observance Respect', 'הקפדה על כשרות וכבוד הדדי')}</span>
            <span>•</span>
            <button
              onClick={resetAllData}
              className="inline-flex items-center gap-1 text-slate-400 hover:text-slate-700 font-medium transition-colors cursor-pointer"
              title="Reset mock data to initial scenario state"
            >
              <RotateCcw className="w-3 h-3" />
              <span>{t('Reset Demo Data', 'איפוס נתוני הדגמה')}</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Global Modals */}
      <SignInModal />
      <GuestRegistrationModal />
      <HostingRequestModal />
      <RequestCardModal />
      <FeedbackModal />
      <HostApplicationModal />
      <CompleteDetailsModal />
      <ContactSupportModal />

      {/* Simulated WhatsApp Alerts & Phone Modal */}
      <WhatsAppSimulatorModal />
      <WhatsAppToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
