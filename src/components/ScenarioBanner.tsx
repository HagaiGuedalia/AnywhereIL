import React from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, Users, UserCheck, ShieldCheck, HeartHandshake, Compass } from 'lucide-react';

export const ScenarioBanner: React.FC = () => {
  const { startScenario, currentUser, t, lang } = useApp();

  const scenarios = [
    {
      num: 1 as const,
      titleEn: '1. Guest Finds Host',
      titleHe: '1. אורחת מוצאת שבת',
      personaEn: 'Noa (Student)',
      personaHe: 'נועה (סטודנטית)',
      icon: Compass,
      descEn: 'Noa requests hosting in Jerusalem for Parashat Toldot',
      descHe: 'נועה מגישה בקשת אירוח בירושלים לשבת הקרובה',
      color: 'bg-amber-500/10 text-amber-800 border-amber-300 hover:bg-amber-500/20',
    },
    {
      num: 2 as const,
      titleEn: '2. Family Joins Host',
      titleHe: '2. משפחה מצטרפת לאירוח',
      personaEn: 'Levi Family',
      personaHe: 'משפחת לוי (מארחים)',
      icon: HeartHandshake,
      descEn: 'Avi Levi applies to host in Beit Shemesh & awaits admin approval',
      descHe: 'אבי לוי מגיש בקשת הצטרפות מבית שמש וממתין לאישור',
      color: 'bg-emerald-500/10 text-emerald-800 border-emerald-300 hover:bg-emerald-500/20',
    },
    {
      num: 3 as const,
      titleEn: '3. Host Chooses Guest',
      titleHe: '3. מארח בוחר אורח (AI)',
      personaEn: 'Cohen Family',
      personaHe: 'משפחת כהן (ירושלים)',
      icon: Sparkles,
      descEn: 'Receives WhatsApp notification, checks AI match score & accepts Noa',
      descHe: 'מקבלים התראת וואטסאפ, בודקים ציון התאמה ומאשרים אירוח',
      color: 'bg-indigo-500/10 text-indigo-800 border-indigo-300 hover:bg-indigo-500/20',
    },
    {
      num: 4 as const,
      titleEn: '4. Lone Soldier Multi-City',
      titleHe: '4. חייל בודד רב-עירוני',
      personaEn: 'Yossi (Soldier)',
      personaHe: 'יוסי (חייל בודד)',
      icon: Users,
      descEn: 'Requests 3 cities (Ashdod/Be\'er Sheva/JLM) then cancels when base plans change',
      descHe: 'מבקש 3 ערים במקביל ומבטל כשנשאר בבסיס',
      color: 'bg-blue-500/10 text-blue-800 border-blue-300 hover:bg-blue-500/20',
    },
    {
      num: 5 as const,
      titleEn: '5. Admin Dashboard',
      titleHe: '5. ניהול ובקרה (דנה)',
      personaEn: 'Dana (Admin)',
      personaHe: 'דנה (מנהלת מערכת)',
      icon: ShieldCheck,
      descEn: 'Monitors Haifa shortage, approves hosts & analyzes AI feedback insights',
      descHe: 'מזהה מחסור בחיפה, מאשרת משפחות ומסכמת משובים עם AI',
      color: 'bg-purple-500/10 text-purple-800 border-purple-300 hover:bg-purple-500/20',
    },
  ];

  return (
    <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-indigo-950 text-white text-xs border-b border-amber-500/20 py-2.5 px-4 shadow-sm">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 shrink-0">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-400/20 text-amber-200 border border-amber-400/30 font-semibold tracking-wide text-[11px]">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            {t('System Scenarios (1-Click Test)', 'תרחישי המערכת לבדיקה')}
          </span>
          <span className="hidden sm:inline text-slate-300 text-[11px]">
            {t('Active User:', 'משתמש נוכחי:')}{' '}
            <strong className="text-white font-medium">{currentUser?.name || 'Guest'}</strong> ({currentUser?.role})
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
          {scenarios.map((sc) => {
            const Icon = sc.icon;
            return (
              <button
                key={sc.num}
                onClick={() => startScenario(sc.num)}
                title={t(sc.descEn, sc.descHe)}
                className="group relative flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-100 hover:text-white border border-white/10 hover:border-amber-400/40 transition-all cursor-pointer font-medium text-[11px]"
              >
                <Icon className="w-3.5 h-3.5 text-amber-300 group-hover:scale-110 transition-transform" />
                <span>{t(sc.titleEn, sc.titleHe)}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
