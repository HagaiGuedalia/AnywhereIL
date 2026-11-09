import React from 'react';
import { useApp } from '../context/AppContext';
import { Calendar, Users, MapPin, MessageCircle, Phone, Star, CheckCircle2, Utensils, Bed } from 'lucide-react';

export const HostScheduleScreen: React.FC = () => {
  const { requests, hostProfiles, currentUser, t } = useApp();

  const currentHost = hostProfiles.find(h => h.userId === currentUser?.id) || hostProfiles[0];

  // Requests this host accepted
  const hostings = requests.filter(r => r.matchedHostId === currentHost.id || r.matchedHostName?.includes(currentHost.familyName));

  const upcoming = hostings.filter(r => r.status === 'host_found');
  const past = hostings.filter(r => r.shabbatId === 'shabbat-passed' || r.feedbackCompleted);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
          {t('Host Calendar & History', 'לוח אירוחים והיסטוריה')}
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          {t('Hosting Schedule', 'לו״ז אירוחי שבת')}
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          {t('Manage your upcoming Shabbat guests, past hospitality memories, and contacts', 'מעקב אחר שבתות קרובות בהן אתם מארחים, וארכיון אורחי העבר')}
        </p>
      </div>

      {/* Upcoming Hostings */}
      <div className="space-y-4">
        <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-amber-600" />
          <span>{t('Upcoming Shabbatot (You are hosting)', 'שבתות קרובות שאתם מארחים')}</span>
          <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
            {upcoming.length}
          </span>
        </h2>

        {upcoming.length === 0 ? (
          <div className="p-8 rounded-3xl bg-white border border-slate-200/80 text-center text-xs text-slate-500">
            {t('You have no upcoming guests confirmed. Visit the Host Dashboard to accept open requests!', 'אין לכם אורחים משובצים לשבתות הקרובות. היכנסו ללוח האירוח לקבלת אורחים!')}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upcoming.map(req => (
              <div
                key={req.id}
                className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="font-extrabold text-sm text-slate-900">
                    {req.shabbatHebrewName} • {req.shabbatGregorian}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    {t('Confirmed Guest', 'אורח/ת מאושר/ת')}
                  </span>
                </div>

                <div className="flex items-start gap-3">
                  <img
                    src={req.guestAvatar}
                    alt={req.guestName}
                    className="w-12 h-12 rounded-2xl object-cover ring-2 ring-emerald-400/40"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-slate-900">{req.guestName}</p>
                    <p className="text-xs text-amber-800 font-semibold">{req.institution}</p>
                    <p className="text-[11px] text-slate-500 font-mono mt-0.5">{req.guestPhone}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] p-2.5 rounded-xl bg-slate-50">
                  <div>
                    <span className="text-slate-400 block">{t('Meals:', 'ארוחות:')}</span>
                    <span className="font-bold text-slate-700">{req.mealsRequested.length} {t('meals', 'סעודות')}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">{t('Lodging:', 'לינה:')}</span>
                    <span className="font-bold text-slate-700">{req.needsSleep ? t('Bed needed', 'נדרשת מיטה') : t('Meals only', 'רק ארוחות')}</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between gap-2">
                  <a
                    href={`https://wa.me/${req.guestPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                      `Shalom ${req.guestName}! This is ${currentHost.familyName}. Looking forward to hosting you for ${req.shabbatHebrewName}!`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs cursor-pointer"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>{t('WhatsApp Guest', 'וואטסאפ')}</span>
                  </a>
                  <a
                    href={`tel:${req.guestPhone}`}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                    title="Call"
                  >
                    <Phone className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Past Hostings Archive */}
      <div className="space-y-4 pt-4 border-t border-slate-200">
        <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
          <Users className="w-4 h-4 text-slate-600" />
          <span>{t('Past Hostings History', 'היסטוריית אירוחים קודמים')}</span>
        </h2>

        <div className="bg-white rounded-3xl border border-slate-200/80 p-4 divide-y divide-slate-100">
          <div className="py-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                alt="Noa"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="font-bold text-xs text-slate-900">Noa Ben-David (Ariel University)</p>
                <p className="text-[11px] text-slate-500">פרשת בראשית • Oct 17-18, 2026</p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
              <Star className="w-3.5 h-3.5 fill-amber-500" />
              <span>5.0 (Great guest!)</span>
            </div>
          </div>

          <div className="py-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80"
                alt="Eliot"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="font-bold text-xs text-slate-900">Eliot Vance (Oleh from Toronto)</p>
                <p className="text-[11px] text-slate-500">פרשת לך לך • Nov 2, 2026</p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
              <Star className="w-3.5 h-3.5 fill-amber-500" />
              <span>5.0</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
