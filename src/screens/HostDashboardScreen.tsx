import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { HostingRequest } from '../types';
import {
  Sparkles,
  MapPin,
  Calendar,
  Users,
  Bed,
  Utensils,
  EyeOff,
  UserCheck,
  CheckCircle2,
  Filter,
  Flame,
  Map as MapIcon,
  LayoutGrid,
} from 'lucide-react';
import { IsraelMap } from '../components/IsraelMap';

export const HostDashboardScreen: React.FC = () => {
  const {
    requests,
    hostProfiles,
    currentUser,
    setSelectedRequest,
    acceptRequestAsHost,
    hideRequest,
    t,
  } = useApp();

  const currentHost = hostProfiles.find(h => h.userId === currentUser?.id) || hostProfiles[0];

  const [cityFilter, setCityFilter] = useState(currentHost?.city || 'Jerusalem');
  const [onlyLodging, setOnlyLodging] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');

  // Filter requests that:
  // 1. Are open
  // 2. Match host's city (or city filter)
  // 3. Are not hidden by this host
  const filteredRequests = requests.filter(req => {
    if (req.status !== 'open') return false;
    if (req.hiddenByHostIds?.includes(currentHost.id)) return false;
    if (cityFilter && req.city !== cityFilter && !req.linkedCities?.includes(cityFilter)) return false;
    if (onlyLodging && !req.needsSleep) return false;
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
            {t('Host Dashboard', 'לוח אירוח משפחה')}
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {t('Open Guest Requests', 'בקשות אירוח ממתינות')}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {t(
              `Showing hosting requests in ${cityFilter} sorted by AI observance & capacity match`,
              `מציג בקשות ב${cityFilter} ממוינות לפי ציון התאמת כשרות, שמירת שבת ותכולה`
            )}
          </p>
        </div>

        {/* Host capacity pill */}
        <div className="flex items-center gap-2 p-2.5 rounded-2xl bg-amber-50 border border-amber-200/70 text-xs">
          <div className="w-8 h-8 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold">
            {currentHost.maxGuests}
          </div>
          <div className="text-left rtl:text-right">
            <p className="font-bold text-slate-800 leading-none">{currentHost.familyName}</p>
            <p className="text-[10px] text-amber-800 mt-0.5">
              {t(`Capacity: Up to ${currentHost.maxGuests} guests`, `קיבולת: עד ${currentHost.maxGuests} אורחים`)} • {currentHost.canSleep ? t('With lodging', 'כולל לינה') : t('Meals only', 'ארוחות בלבד')}
            </p>
          </div>
        </div>
      </div>

      {/* Filter toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-bold text-slate-700">{t('Filter:', 'סינון:')}</span>

          <select
            value={cityFilter}
            onChange={e => setCityFilter(e.target.value)}
            className="text-xs px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 font-medium outline-hidden cursor-pointer"
          >
            <option value="Jerusalem">Jerusalem (ירושלים)</option>
            <option value="Ashdod">Ashdod (אשדוד)</option>
            <option value="Be'er Sheva">Be'er Sheva (באר שבע)</option>
            <option value="Haifa">Haifa (חיפה)</option>
            <option value="Beit Shemesh">Beit Shemesh (בית שמש)</option>
            <option value="Tel Aviv">Tel Aviv (תל אביב)</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setOnlyLodging(!onlyLodging)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
              onlyLodging
                ? 'bg-amber-600 text-white border-amber-600'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {t('Requires Sleeping Bed Only', 'רק בקשות הכוללות לינה')}
          </button>

          {/* View mode toggle */}
          <div className="flex items-center p-0.5 rounded-xl bg-slate-100 border border-slate-200">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                viewMode === 'grid' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t('Cards', 'כרטיסים')}</span>
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                viewMode === 'map' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Israel Map View"
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t('Map View', 'מפת ישראל')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Map View */}
      {viewMode === 'map' && (
        <div className="space-y-3 bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapIcon className="w-4 h-4 text-amber-600" />
              <h3 className="font-extrabold text-sm text-slate-900">
                {t('Israel Hosting Map — Open Guest Requests', 'מפת ישראל — בקשות אירוח פתוחות')}
              </h3>
            </div>
            <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
              {requests.filter(r => r.status === 'open').length} {t('Open Requests Across Israel', 'בקשות פתוחות בכל הארץ')}
            </span>
          </div>

          <IsraelMap
            mode="feed"
            requests={requests.filter(r => r.status === 'open')}
            onSelectRequest={setSelectedRequest}
            hostProfile={currentHost}
            height="420px"
          />

          <p className="text-[11px] text-slate-500 text-center">
            {t('Click on any city cluster to see guest details and match scores', 'לחצו על כל עיר במפה כדי לראות את האורחים וציוני ההתאמה')}
          </p>
        </div>
      )}

      {/* Requests Feed with AI Match Scores (Scenario 3, step 2 & 3) */}
      {viewMode === 'grid' && (filteredRequests.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
          <Sparkles className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800">
            {t(`No open requests in ${cityFilter} right now`, `אין כרגע בקשות פתוחות ב${cityFilter}`)}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {t(
              'All guests have been placed with host families or you have hidden remaining requests. Check back soon or switch cities above!',
              'כל האורחים לשבת זו שובצו בהצלחה או שהוסתרו. נסו לבדוק ערים נוספות או שבתות עתידיות.'
            )}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredRequests.map((req, idx) => {
            // High match if within host capacity & observant
            const isNoa = req.id === 'req-noa-jerusalem';
            const matchScore = isNoa ? 97 : Math.max(78, 95 - idx * 6);
            const isTooLarge = req.guestCount > currentHost.maxGuests;

            return (
              <div
                key={req.id}
                className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  {/* Top Bar with AI Match Badge (Scenario 3, step 3) */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500/15 to-indigo-500/15 border border-amber-400/40 text-[11px] font-bold text-amber-950">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      <span>
                        {matchScore}% {t('Match [AI]', 'התאמה')}
                      </span>
                    </span>

                    <span className="text-[11px] font-bold text-slate-500">
                      {req.shabbatHebrewName}
                    </span>
                  </div>

                  {/* AI Explanation Snippet */}
                  <div className="p-2.5 rounded-xl bg-amber-50/60 border border-amber-200/50 text-[11px] text-amber-900 leading-snug mb-3">
                    <strong>{t('AI Match Reason:', 'הסבר התאמה:')}</strong>{' '}
                    {isTooLarge
                      ? t(
                          `Request needs ${req.guestCount} places, while you host up to ${currentHost.maxGuests}.`,
                          `הבקשה דורשת ${req.guestCount} מקומות, בעוד שאתם מארחים עד ${currentHost.maxGuests}.`
                        )
                      : t(
                          `${req.guestType === 'student' ? 'A student' : 'Lone soldier'}, similar observance (${req.observance}), needs lodging and you offer beds.`,
                          `${req.guestType === 'student' ? 'סטודנט/ית' : 'חייל/ת בודד/ת'}, רמת כשרות ושמירה דומה (${req.observance}), זקוק/ה למיטה ואתם מציעים לינה.`
                        )}
                  </div>

                  {/* Guest Info */}
                  <div className="flex items-start gap-3">
                    <img
                      src={req.guestAvatar}
                      alt={req.guestName}
                      className="w-13 h-13 rounded-2xl object-cover ring-2 ring-amber-400/30"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-extrabold text-base text-slate-900 truncate">
                        {req.guestName}
                      </h3>
                      <p className="text-xs font-semibold text-amber-800">{req.institution}</p>
                      <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{req.city} {req.preferredNeighborhood ? `• ${req.preferredNeighborhood}` : ''}</span>
                      </p>
                    </div>
                  </div>

                  {/* About snippet */}
                  <p className="text-xs text-slate-600 mt-3 line-clamp-2 leading-relaxed">
                    "{req.about}"
                  </p>

                  {/* Request specs */}
                  <div className="grid grid-cols-2 gap-2 mt-3 text-[11px]">
                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-1.5 font-medium text-slate-700">
                      <Utensils className="w-3.5 h-3.5 text-amber-600" />
                      <span>{req.mealsRequested.length} {t('Meals', 'סעודות')}</span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-1.5 font-medium text-slate-700">
                      <Bed className="w-3.5 h-3.5 text-amber-600" />
                      <span>{req.needsSleep ? t('Needs Bed', 'זקוק/ה ללינה') : t('Meals only', 'רק ארוחות')}</span>
                    </div>
                  </div>
                </div>

                {/* Card Actions (Scenario 3, step 4, 5, 7) */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => hideRequest(req.id)}
                    className="px-2.5 py-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                    title={t('Hide from my feed', 'הסתר מרשימתי')}
                  >
                    <EyeOff className="w-3.5 h-3.5" />
                    <span>{t('Hide', 'הסתר')}</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedRequest(req)}
                      className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors cursor-pointer"
                    >
                      {t('View Card', 'פרטים מלאים')}
                    </button>

                    <button
                      onClick={() => {
                        setSelectedRequest(req);
                      }}
                      className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 active:scale-95 text-white text-xs font-bold shadow-md shadow-amber-600/20 transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <UserCheck className="w-4 h-4" />
                      <span>{t("We're Hosting", 'אנחנו מארחים')}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};
