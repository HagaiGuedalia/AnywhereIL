import React from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  Clock,
  MessageSquare,
  MapPin,
  Users,
  Bed,
  Utensils,
  AlertTriangle,
} from 'lucide-react';

export const HostProfileScreen: React.FC = () => {
  const {
    hostProfiles,
    currentUser,
    setIsCompleteDetailsOpen,
    setActiveScreen,
    t,
  } = useApp();

  const host = hostProfiles.find(h => h.userId === currentUser?.id) || hostProfiles[1]; // Levi default

  const isPending = host.approvalStatus === 'pending';
  const isApproved = host.approvalStatus === 'approved';
  const isMissingWhatsApp = !host.whatsappNumber;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
          {t('Host Account & Settings', 'הגדרות חשבון מארח')}
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          {host.familyName}
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          {t('Manage your hosting capacity, verification status, and communication preferences', 'ניהול פרטי המשפחה, סטטוס אישור המערכת והגדרות קבלת התראות')}
        </p>
      </div>

      {/* Scenario 2 Step 4: Pending Approval Banner */}
      {isPending && (
        <div className="p-5 rounded-3xl bg-amber-500/10 border-2 border-amber-400 p-5 space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5 animate-spin" />
            </div>
            <div>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-200 text-amber-950 text-[10px] font-black uppercase">
                {t('Scenario 2: Under Review', 'תרחיש 2: ממתין לאישור')}
              </span>
              <h3 className="text-base font-extrabold text-amber-950 mt-1">
                {t('Your Application is Under Review', 'בקשתכם התקבלה וממתינה לאישור הצוות')}
              </h3>
              <p className="text-xs text-amber-900 leading-relaxed mt-1">
                {t(
                  'Dana, our national coordinator, will review your details shortly. Once approved, you will receive an email and full access to the Host Dashboard.',
                  'דנה, מנהלת המערכת, תבדוק את פרטי הבקשה. עם האישור תקבלו הודעת דוא״ל וגישה מלאה ללוח האירוח.'
                )}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Scenario 2 Step 8: Missing WhatsApp Alert */}
      {isApproved && isMissingWhatsApp && (
        <div className="p-5 rounded-3xl bg-emerald-500/10 border-2 border-emerald-500 p-5 space-y-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-950 text-[10px] font-black uppercase">
                  {t('Scenario 2, Step 8: Complete Details', 'תרחיש 2 שלב 8: השלמת פרטים')}
                </span>
                <h3 className="text-base font-extrabold text-emerald-950 mt-1">
                  {t('Add Your WhatsApp Number for Instant Alerts', 'הוסף מספר וואטסאפ לקבלת התראות שבת')}
                </h3>
                <p className="text-xs text-emerald-900 mt-0.5 leading-relaxed">
                  {t(
                    'To get notifications when students or soldiers request hosting in your neighborhood, please add your WhatsApp number.',
                    'על מנת שנוכל להודיע לכם ברגע שאורח/ת מגיש/ה בקשה בעירכם, אנא השלימו את מספר הוואטסאפ.'
                  )}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsCompleteDetailsOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md cursor-pointer shrink-0"
            >
              {t('Complete Details Dialog', 'פתח חלון השלמת פרטים')}
            </button>
          </div>
        </div>
      )}

      {/* Profile Details Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row items-center gap-5 pb-6 border-b border-slate-100">
          <img
            src={host.familyPhoto}
            alt={host.familyName}
            className="w-20 h-20 rounded-3xl object-cover ring-4 ring-amber-400/30"
          />
          <div className="flex-1 text-center sm:text-left rtl:sm:text-right">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2 className="text-xl font-black text-slate-900">{host.familyName}</h2>
              {isApproved ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{t('Approved Host Family', 'משפחה מאושרת')}</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{t('Application Pending Review', 'ממתין לבדיקה')}</span>
                </span>
              )}
            </div>

            <p className="text-xs text-slate-500 flex items-center justify-center sm:justify-start gap-1 mt-1">
              <MapPin className="w-3.5 h-3.5 text-amber-600" />
              <span>{host.neighborhood}, {host.city}</span>
            </p>

            <p className="text-xs text-slate-600 mt-2 max-w-lg">
              "{host.about}"
            </p>
          </div>
        </div>

        {/* Capacity & Meals Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-slate-400 font-medium block">{t('Capacity & Sleeping:', 'קיבולת ולינה:')}</span>
            <p className="font-bold text-slate-800">
              {host.maxGuests} {t('Guests max', 'אורחים')} • {host.canSleep ? t('Offers sleeping beds', 'כולל לינה') : t('Meals only', 'ארוחות בלבד')}
            </p>
            <p className="text-[11px] text-slate-500">{host.sleepingDetails}</p>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-slate-400 font-medium block">{t('Observance & Languages:', 'כשרות ושפות:')}</span>
            <p className="font-bold text-slate-800">{host.observance}</p>
            <p className="text-[11px] text-slate-500">{t('Languages:', 'שפות:')} {host.languages.join(', ')} ({host.englishLevel})</p>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-slate-400 font-medium block">{t('WhatsApp Alerts:', 'התראות וואטסאפ:')}</span>
            <p className="font-bold text-slate-800">
              {host.whatsappNumber || t('Not yet configured', 'טרם הוגדר')}
            </p>
            <button
              onClick={() => setIsCompleteDetailsOpen(true)}
              className="text-[11px] font-bold text-emerald-700 hover:underline cursor-pointer"
            >
              {host.whatsappNumber ? t('Update phone number', 'עדכן מספר') : t('+ Add number now', '+ הוסף מספר')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
