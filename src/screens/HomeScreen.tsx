import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Compass,
  HeartHandshake,
  Calendar,
  Sparkles,
  MapPin,
  CheckCircle2,
  Users,
  ShieldCheck,
  Flame,
  ArrowRight,
  MessageCircle,
} from 'lucide-react';

export const HomeScreen: React.FC = () => {
  const {
    currentUser,
    setIsSignInOpen,
    setIsRequestModalOpen,
    setIsHostAppModalOpen,
    setIsGuestRegOpen,
    setActiveScreen,
    upcomingShabbatot,
    startScenario,
    t,
  } = useApp();

  const nextShabbat = upcomingShabbatot.find(s => s.isComingShabbat) || upcomingShabbatot[0];

  const handleGuestClick = () => {
    if (!currentUser) {
      setIsSignInOpen(true);
    } else if (currentUser.role === 'guest') {
      setIsRequestModalOpen(true);
    } else {
      setActiveScreen('my-requests');
    }
  };

  const handleHostClick = () => {
    if (!currentUser) {
      setIsSignInOpen(true);
    } else if (currentUser.role === 'host') {
      setActiveScreen('host-dashboard');
    } else {
      setIsHostAppModalOpen(true);
    }
  };

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-12 sm:pt-14 sm:pb-18 bg-gradient-to-b from-amber-500/10 via-amber-100/30 to-transparent rounded-3xl border border-amber-900/5 mx-2 sm:mx-4 px-4 sm:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-900 text-xs font-bold tracking-wide shadow-xs">
            <Flame className="w-4 h-4 text-amber-600 fill-amber-500" />
            <span>
              {nextShabbat.hebrewName} • {nextShabbat.hebrewDate} ({nextShabbat.gregorianDate})
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight">
            {t('A Warm Shabbat Table', 'שולחן שבת חם')}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-amber-700 to-indigo-800">
              {t('Anywhere in Israel', 'בכל מקום בארץ')}
            </span>
          </h1>

          <p className="text-sm sm:text-lg text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">
            {t(
              'Connecting Olim, university students, lone soldiers, and visitors with welcoming Israeli host families for Shabbat and Chagim.',
              'מחברים בין סטודנטים, חיילים בודדים, עולים חדשים ומבקרים עם משפחות מארחות חמות בכל רחבי הארץ לשבתות וחגים.'
            )}
          </p>

          {/* Two Main Call-To-Action Buttons (Scenario 1 & 2) */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-3 max-w-md mx-auto">
            <button
              onClick={handleGuestClick}
              className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl bg-amber-600 hover:bg-amber-700 active:scale-98 text-white font-extrabold text-sm sm:text-base shadow-lg shadow-amber-600/25 transition-all cursor-pointer"
            >
              <Compass className="w-5 h-5" />
              <span>{t("I'm looking for hosting", 'אני מחפש/ת אירוח')}</span>
            </button>

            <button
              onClick={handleHostClick}
              className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 active:scale-98 text-white font-extrabold text-sm sm:text-base shadow-lg shadow-slate-900/20 transition-all cursor-pointer border border-slate-800"
            >
              <HeartHandshake className="w-5 h-5 text-amber-400" />
              <span>{t('We want to host', 'אנחנו רוצים לארח')}</span>
            </button>
          </div>

          <div className="pt-3 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              {t('AI-Assisted Observance Matching', 'התאמת כשרות ושמירת שבת עם AI')}
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              {t('Verified Host Families', 'משפחות מאושרות ומאומתות')}
            </span>
            <span className="flex items-center gap-1.5">
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              {t('Direct WhatsApp Coordination', 'תיאום ישיר בוואטסאפ')}
            </span>
          </div>
        </div>
      </section>

      {/* Quick Test Scenarios Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">
              {t('Interactive User Scenarios', 'תרחישי שימוש במערכת')}
            </h2>
            <p className="text-xs text-slate-500">
              {t('Click any scenario to test the full end-to-end workflow described in the specification', 'לחצו על תרחיש לבדיקת התהליך המלא לפי הדרישות')}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {[
            {
              num: 1 as const,
              titleEn: '1. New Guest Requests',
              titleHe: '1. אורחת מבקשת אירוח',
              userEn: 'Noa, 22 (Ariel Univ)',
              userHe: 'נועה, 22 (אונ׳ אריאל)',
              summaryEn: 'Registers, writes bio with AI, posts request in Jerusalem, gets matched.',
              summaryHe: 'נרשמת, כותבת היכרות עם AI, מבקשת בירושלים ומקבלת משפחה.',
              color: 'hover:border-amber-400 hover:bg-amber-50/50',
            },
            {
              num: 2 as const,
              titleEn: '2. Family Joins Host',
              titleHe: '2. משפחה מצטרפת',
              userEn: 'Levi Family (Beit Shemesh)',
              userHe: 'משפחת לוי (בית שמש)',
              summaryEn: 'Submits application, reviewed by admin Dana, completes WhatsApp number.',
              summaryHe: 'מגישים בקשה, ממתינים לאישור דנה ומשלימים וואטסאפ.',
              color: 'hover:border-emerald-400 hover:bg-emerald-50/50',
            },
            {
              num: 3 as const,
              titleEn: '3. Host Accepts Guest',
              titleHe: '3. מארח בוחר אורח',
              userEn: 'Cohen Family (Jerusalem)',
              userHe: 'משפחת כהן (ירושלים)',
              summaryEn: 'Gets WhatsApp alert, reviews AI Match Score, accepts Noa & gets WhatsApp reminder.',
              summaryHe: 'מקבלים הודעת וואטסאפ, בודקים ציון AI ומאשרים את נועה.',
              color: 'hover:border-indigo-400 hover:bg-indigo-50/50',
            },
            {
              num: 4 as const,
              titleEn: '4. Lone Soldier Multi-City',
              titleHe: '4. חייל בודד רב-עירוני',
              userEn: 'Yossi, 20 (Givati Soldier)',
              userHe: 'יוסי, 20 (חייל גבעתי)',
              summaryEn: 'Requests 3 cities; Ashdod host accepts, others auto-close. Cancels if on base.',
              summaryHe: 'מבקש 3 ערים, אשדוד מאשרת והשאר נסגרות. ביטול אם נשאר בבסיס.',
              color: 'hover:border-blue-400 hover:bg-blue-50/50',
            },
            {
              num: 5 as const,
              titleEn: '5. Admin Monitoring',
              titleHe: '5. ניהול מערכת (דנה)',
              userEn: 'Dana (National Admin)',
              userHe: 'דנה (מנהלת ארצית)',
              summaryEn: 'Monitors Haifa shortage, reviews WhatsApp delivery logs & summarizes feedback with AI.',
              summaryHe: 'מזהה מחסור בחיפה, בודקת מסירת התראות ומסכמת משובים עם AI.',
              color: 'hover:border-purple-400 hover:bg-purple-50/50',
            },
          ].map(s => (
            <button
              key={s.num}
              onClick={() => startScenario(s.num)}
              className={`p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs text-left rtl:text-right transition-all cursor-pointer group flex flex-col justify-between ${s.color}`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-black uppercase text-amber-700">
                    {t(`Scenario ${s.num}`, `תרחיש ${s.num}`)}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 group-hover:text-amber-950">
                  {t(s.titleEn, s.titleHe)}
                </h4>
                <p className="text-[11px] font-semibold text-slate-500 mt-0.5">
                  {t(s.userEn, s.userHe)}
                </p>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  {t(s.summaryEn, s.summaryHe)}
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] font-bold text-amber-800">
                {t('Test Flow →', 'הפעל תרחיש ←')}
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* How it Works 3 Steps */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-xl mx-auto mb-8">
          <h2 className="text-2xl font-black text-slate-900">
            {t('How Bayit Cham Works', 'איך השירות עובד?')}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {t('Simple, dignified, and community-driven hosting for every Shabbat in Israel', 'תהליך פשוט, מכבד וקהילתי לכל שבת בישראל')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-black text-lg">
              1
            </div>
            <h3 className="text-base font-bold text-slate-900">
              {t('Post Your Request', 'הגשת בקשת אירוח')}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t(
                'Pick your Shabbat, specify city (or multiple cities for soldiers), meals needed, and lodging preference. Use our AI assistant to write a warm introduction.',
                'בחרו את השבת, העיר הרצויה (או מספר ערים לחיילים), ארוחות נדרשות ולינה. תוכלו להיעזר ב-AI לכתיבת היכרות נעימה.'
              )}
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-lg">
              2
            </div>
            <h3 className="text-base font-bold text-slate-900">
              {t('Host Accepts & Coordinates', 'משפחה מאשרת ומתאמת')}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t(
                'Host families receive instant WhatsApp notifications filtered by capacity and observance match. Once a family accepts, phone numbers and directions unlock.',
                'משפחות מארחות מקבלות התראת וואטסאפ מותאמת. עם אישור האירוח, נחשפים פרטי הקשר, הכתובת והכוונה מלאה.'
              )}
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-800 flex items-center justify-center font-black text-lg">
              3
            </div>
            <h3 className="text-base font-bold text-slate-900">
              {t('Experience Shabbat & Give Feedback', 'שבת משותפת ומשוב מוצ״ש')}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t(
                'Enjoy delicious food, singing, and meaningful connection. On Saturday night, share quick feedback to help our community coordinators continually improve.',
                'נהנים מסעודות חמות, זמירות ושיחות טובות. במוצאי שבת משאירים משוב קצר לשיפור מתמיד של השירות.'
              )}
            </p>
          </div>
        </div>
      </section>

      {/* Community Stats */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-amber-950 to-indigo-950 text-white p-6 sm:p-10 shadow-xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-3xl sm:text-4xl font-black text-amber-400">1,480+</p>
              <p className="text-xs text-slate-300 mt-1">{t('Shabbat Guests Hosted', 'אורחים שהתארחו לשבת')}</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-black text-amber-400">320+</p>
              <p className="text-xs text-slate-300 mt-1">{t('Active Host Families', 'משפחות מארחות פעילות')}</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-black text-amber-400">28</p>
              <p className="text-xs text-slate-300 mt-1">{t('Cities Across Israel', 'ערים ויישובים בארץ')}</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-black text-amber-400">96.8%</p>
              <p className="text-xs text-slate-300 mt-1">{t('Host Match Success Rate', 'אחוז התאמה מוצלח')}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
