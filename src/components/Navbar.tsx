import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Flame,
  Globe,
  Bell,
  User as UserIcon,
  LogOut,
  ChevronDown,
  Calendar,
  Home,
  Inbox,
  Shield,
  HelpCircle,
  PlusCircle,
  Heart,
  MessageCircle,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentUser,
    switchPersona,
    logout,
    lang,
    setLang,
    t,
    activeScreen,
    setActiveScreen,
    setIsSignInOpen,
    setIsRequestModalOpen,
    setIsHostAppModalOpen,
    setIsSupportModalOpen,
    whatsappQueue,
    openWhatsAppSimulator,
  } = useApp();

  const [isPersonaMenuOpen, setIsPersonaMenuOpen] = useState(false);
  const [isNotifMenuOpen, setIsNotifMenuOpen] = useState(false);

  const personas = [
    { key: 'noa' as const, name: 'Noa Ben-David', role: 'Guest (Student)', city: 'Jerusalem / Ariel' },
    { key: 'cohen' as const, name: 'The Cohen Family', role: 'Host (Jerusalem)', city: 'Katamon, JLM' },
    { key: 'levi' as const, name: 'The Levi Family', role: 'Host Applicant (Beit Shemesh)', city: 'Beit Shemesh' },
    { key: 'yossi' as const, name: 'Yossi Klein', role: 'Guest (Lone Soldier)', city: 'Multi-City' },
    { key: 'sharon' as const, name: 'The Sharon Family', role: 'Host (Ashdod)', city: 'Ashdod Marina' },
    { key: 'dana' as const, name: 'Dana Alon', role: 'System Admin', city: 'National Ops' },
    { key: 'new_guest' as const, name: '+ Register as New Guest', role: 'Fresh start', city: 'Israel' },
  ];

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-amber-900/10 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveScreen('home')}
              className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-hidden"
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-400 flex items-center justify-center text-white shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
                <Flame className="w-5 h-5 text-amber-50 fill-amber-50" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-lg text-slate-900 tracking-tight">Bayit Cham</span>
                  <span className="text-xs font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded-sm">בית חם</span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium leading-none">
                  {t('Shabbat & Holiday Hosting in Israel', 'אירוח שבתות וחגים בכל הארץ')}
                </p>
              </div>
            </button>

            {/* Navigation links */}
            <nav className="hidden lg:flex items-center gap-1 ml-6 rtl:mr-6 rtl:ml-0">
              <button
                onClick={() => setActiveScreen('home')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  activeScreen === 'home' ? 'bg-amber-100 text-amber-900' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {t('Home', 'ראשי')}
              </button>

              {currentUser && (
                <button
                  onClick={() => setActiveScreen('my-requests')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    activeScreen === 'my-requests' ? 'bg-amber-100 text-amber-900' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {t('My Requests', 'הבקשות שלי')}
                </button>
              )}

              {/* Host Dashboard Link */}
              {currentUser?.role === 'host' && (
                <>
                  <button
                    onClick={() => setActiveScreen('host-dashboard')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      activeScreen === 'host-dashboard' ? 'bg-amber-100 text-amber-900' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    {t('Host Dashboard', 'לוח אירוח')}
                  </button>
                  <button
                    onClick={() => setActiveScreen('host-schedule')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      activeScreen === 'host-schedule' ? 'bg-amber-100 text-amber-900' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    {t('Hosting Schedule', 'לו״ז אירוחים')}
                  </button>
                </>
              )}

              {/* Admin Link */}
              {currentUser?.role === 'admin' && (
                <button
                  onClick={() => setActiveScreen('admin-dashboard')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                    activeScreen === 'admin-dashboard' ? 'bg-purple-100 text-purple-900' : 'text-slate-600 hover:text-purple-900 hover:bg-purple-50'
                  }`}
                >
                  <Shield className="w-3.5 h-3.5 text-purple-600" />
                  <span>{t('Admin Mission Control', 'פאנל מנהלת')}</span>
                </button>
              )}
            </nav>
          </div>

          {/* Right section actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Action Buttons */}
            {currentUser?.role !== 'host' && currentUser?.role !== 'admin' && (
              <button
                onClick={() => setIsRequestModalOpen(true)}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs transition-all shadow-xs active:scale-95 cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>{t('Request Shabbat Hosting', 'בקש אירוח לשבת')}</span>
              </button>
            )}

            {/* Language Switch */}
            <button
              onClick={() => setLang(lang === 'en' ? 'he' : 'en')}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors cursor-pointer"
              title="Toggle English / עברית"
            >
              <Globe className="w-3.5 h-3.5 text-slate-500" />
              <span>{lang === 'en' ? 'עברית' : 'English'}</span>
            </button>

            {/* WhatsApp Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setIsNotifMenuOpen(!isNotifMenuOpen)}
                className="relative p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                title={t('Notifications & WhatsApp messages', 'התראות והודעות')}
              >
                <Bell className="w-4 h-4 text-slate-600" />
                {whatsappQueue.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 text-white text-[10px] font-black flex items-center justify-center ring-2 ring-white animate-pulse">
                    {whatsappQueue.length}
                  </span>
                )}
              </button>

              {/* Notification dropdown */}
              {isNotifMenuOpen && (
                <div className="absolute right-0 rtl:right-auto rtl:left-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 z-50">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                    <span className="text-xs font-bold text-slate-900">{t('Simulated WhatsApp Alerts', 'התראות וואטסאפ')}</span>
                    <span className="text-[10px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                      {whatsappQueue.length} {t('New', 'חדשות')}
                    </span>
                  </div>

                  {whatsappQueue.length === 0 ? (
                    <div className="py-6 text-center text-xs text-slate-400">
                      <MessageCircle className="w-6 h-6 mx-auto mb-1 text-slate-300" />
                      {t('No pending messages. Notifications will appear here during flows.', 'אין התראות חדשות כרגע')}
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {whatsappQueue.map(msg => (
                        <div
                          key={msg.id}
                          onClick={() => {
                            openWhatsAppSimulator(msg);
                            setIsNotifMenuOpen(false);
                          }}
                          className="p-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200/60 hover:border-emerald-300 cursor-pointer transition-colors text-left rtl:text-right"
                        >
                          <div className="flex items-center justify-between text-[11px] font-bold text-slate-800">
                            <span>{msg.recipientName}</span>
                            <span className="text-[10px] text-slate-400 font-normal">{msg.timestamp}</span>
                          </div>
                          <p className="text-xs text-slate-600 line-clamp-2 mt-0.5">{msg.messageText}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Persona Switcher / Profile */}
            <div className="relative">
              {currentUser ? (
                <button
                  onClick={() => setIsPersonaMenuOpen(!isPersonaMenuOpen)}
                  className="flex items-center gap-2 p-1.5 pl-2.5 rounded-full bg-slate-100 hover:bg-slate-200/80 transition-colors cursor-pointer border border-slate-200/60"
                >
                  <div className="text-left rtl:text-right hidden sm:block">
                    <div className="text-xs font-bold text-slate-900 leading-none">{currentUser.name}</div>
                    <div className="text-[10px] text-amber-700 font-semibold capitalize mt-0.5">{currentUser.role}</div>
                  </div>
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-amber-500/30"
                  />
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 mr-1 rtl:mr-0 rtl:ml-1" />
                </button>
              ) : (
                <button
                  onClick={() => setIsSignInOpen(true)}
                  className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs transition-colors cursor-pointer"
                >
                  {t('Sign In', 'התחברות')}
                </button>
              )}

              {/* Persona Switcher Dropdown */}
              {isPersonaMenuOpen && (
                <div className="absolute right-0 rtl:right-auto rtl:left-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in-50 zoom-in-95">
                  <div className="px-3.5 py-2 border-b border-slate-100">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      {t('Switch Testing Persona', 'החלף דמות לבדיקה')}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {t('Instantly test different roles & permissions', 'בדיקה מיידית של הרשאות ותפקידים')}
                    </p>
                  </div>

                  <div className="py-1 max-h-72 overflow-y-auto">
                    {personas.map(p => (
                      <button
                        key={p.key}
                        onClick={() => {
                          switchPersona(p.key);
                          setIsPersonaMenuOpen(false);
                        }}
                        className="w-full px-3.5 py-2 text-left rtl:text-right hover:bg-amber-50/70 flex items-center justify-between text-xs transition-colors cursor-pointer group"
                      >
                        <div>
                          <p className="font-bold text-slate-800 group-hover:text-amber-900">{p.name}</p>
                          <p className="text-[10px] text-slate-500">{p.role} • {p.city}</p>
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="pt-1.5 border-t border-slate-100 px-3 flex items-center justify-between">
                    <button
                      onClick={() => {
                        setIsSupportModalOpen(true);
                        setIsPersonaMenuOpen(false);
                      }}
                      className="text-xs text-slate-600 hover:text-amber-800 font-medium py-1 flex items-center gap-1 cursor-pointer"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>{t('Support / Help', 'עזרה ותמיכה')}</span>
                    </button>
                    <button
                      onClick={() => {
                        logout();
                        setIsPersonaMenuOpen(false);
                      }}
                      className="text-xs text-rose-600 hover:text-rose-700 font-medium py-1 flex items-center gap-1 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>{t('Log out', 'התנתק')}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
