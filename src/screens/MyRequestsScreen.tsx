import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { HostingRequest } from '../types';
import {
  Calendar,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  RefreshCw,
  PlusCircle,
  MessageCircle,
  ExternalLink,
  Phone,
  Bed,
  Utensils,
  Star,
  Home,
  Map as MapIcon,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { IsraelMap } from '../components/IsraelMap';

export const MyRequestsScreen: React.FC = () => {
  const {
    requests,
    currentUser,
    cancelRequest,
    reopenRequest,
    setIsRequestModalOpen,
    setIsFeedbackModalOpen,
    setFeedbackTargetRequest,
    t,
  } = useApp();

  const [cancelModalRequestId, setCancelModalRequestId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState('Must stay on army base (חייב להישאר בבסיס)');
  const [expandedMapRequestId, setExpandedMapRequestId] = useState<string | null>(null);

  // Filter requests for current user (or show all guest requests if testing as admin)
  const myRequests = requests.filter(r => r.guestId === currentUser?.id || currentUser?.role === 'admin');

  const handleOpenCancelModal = (id: string) => {
    setCancelModalRequestId(id);
  };

  const handleConfirmCancel = () => {
    if (cancelModalRequestId) {
      cancelRequest(cancelModalRequestId, cancelReason);
      setCancelModalRequestId(null);
    }
  };

  const handleGiveFeedback = (req: HostingRequest) => {
    setFeedbackTargetRequest(req);
    setIsFeedbackModalOpen(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
            {t('Guest Dashboard', 'לוח בקשות אורח')}
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {t('My Shabbat Requests', 'הבקשות שלי לשבת')}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {t('Track match statuses, host family contact information, and coordinates', 'מעקב אחר סטטוס התאמות, פרטי המשפחות המארחות והנחיות הגעה')}
          </p>
        </div>

        <button
          onClick={() => setIsRequestModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{t('New Hosting Request', 'בקשת אירוח חדשה')}</span>
        </button>
      </div>

      {/* Requests List */}
      {myRequests.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200/80 p-8 space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
            <Home className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">{t('No active hosting requests', 'אין לך בקשות אירוח פעילות כרגע')}</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {t(
              'Looking for a warm home for an upcoming Shabbat or holiday? Submit a request to connect with host families across Israel.',
              'מחפשים שולחן שבת חם? הגישו בקשה עכשיו ומערכת בית חם תחבר בינכם לבין משפחה מארחת.'
            )}
          </p>
          <button
            onClick={() => setIsRequestModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs cursor-pointer"
          >
            {t('Submit a Request', 'הגשת בקשה')}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {myRequests.map(req => {
            const isGroup = Boolean(req.groupId);
            return (
              <div
                key={req.id}
                className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-xs hover:shadow-md transition-all space-y-4"
              >
                {/* Request Top Bar */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                    <h3 className="font-extrabold text-base text-slate-900">
                      {req.shabbatHebrewName} • {req.shabbatGregorian}
                    </h3>
                    {isGroup && (
                      <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-900 text-[10px] font-black">
                        {t('Linked Multi-City Request', 'בקשה רב-עירונית מקושרת (תרחיש 4)')}
                      </span>
                    )}
                  </div>

                  {/* Status Badges */}
                  <div>
                    {req.status === 'open' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-bold text-xs animate-pulse">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{t('Open / Awaiting Host', 'פתוח • ממתין למשפחה')}</span>
                      </span>
                    )}
                    {req.status === 'host_found' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 font-bold text-xs">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{t('Host Found! 🎉', 'נמצאה משפחה מארחת! 🎉')}</span>
                      </span>
                    )}
                    {req.status === 'closed_linked' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-600 font-medium text-xs">
                        <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />
                        <span>{t('Closed (Matched in another city)', 'נסגר כי נמצאה משפחה בעיר אחרת')}</span>
                      </span>
                    )}
                    {req.status === 'expired' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-900 font-bold text-xs">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>{t('Expired (Past Friday Cutoff)', 'פג תוקף')}</span>
                      </span>
                    )}
                    {req.status === 'cancelled' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-200 text-slate-700 font-bold text-xs">
                        <XCircle className="w-3.5 h-3.5" />
                        <span>{t('Cancelled', 'בוטל על ידי האורח')}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Body Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 font-medium block">{t('Location Requested:', 'יעד מבוקש:')}</span>
                    <span className="font-bold text-slate-800 text-sm flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-amber-600" />
                      <span>{req.city} {req.preferredNeighborhood ? `(${req.preferredNeighborhood})` : ''}</span>
                    </span>
                    {req.linkedCities && (
                      <p className="text-[11px] text-slate-500 mt-1">
                        {t('Linked Cities:', 'ערים מקושרות:')} {req.linkedCities.join(', ')}
                      </p>
                    )}
                  </div>

                  <div>
                    <span className="text-slate-400 font-medium block">{t('Meals & Accommodation:', 'ארוחות ולינה:')}</span>
                    <span className="font-bold text-slate-800 text-sm block mt-0.5">
                      {req.mealsRequested.length} {t('Meals', 'סעודות')} • {req.needsSleep ? t('Needs a bed', 'כולל לינה') : t('Meals only', 'ללא לינה')}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {req.guestCount} {t('Guest(s)', 'אורח/ת')}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 font-medium block">{t('Dietary / Observance:', 'כשרות ושמירת שבת:')}</span>
                    <span className="font-bold text-slate-800 text-sm block mt-0.5">
                      {req.observance}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {req.allergies || 'Kosher'}
                    </span>
                  </div>
                </div>

                {/* Host Details Box (Revealed when host_found as per Scenario 1, step 8) */}
                {req.status === 'host_found' && (
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-emerald-50 to-teal-50 border border-emerald-300 space-y-3">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                          {req.matchedHostName?.[4] || 'H'}
                        </div>
                        <div>
                          <p className="font-black text-sm text-emerald-950">
                            {req.matchedHostName}
                          </p>
                          <p className="text-xs text-emerald-800 flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" />
                            <span>{req.matchedHostAddress || `${req.city}, Israel`}</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <a
                          href={`https://wa.me/${(req.matchedHostPhone || '+972-54-319-8765').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                            `Shalom ${req.matchedHostName}! This is ${req.guestName}. I am looking forward to being hosted by you for ${req.shabbatHebrewName}!`
                          )}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>{t('Chat on WhatsApp', 'פתח וואטסאפ עם המשפחה')}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>

                        <a
                          href={`tel:${req.matchedHostPhone || '+972-54-319-8765'}`}
                          className="p-2 rounded-xl bg-white border border-emerald-200 text-emerald-800 hover:bg-emerald-100 transition-colors cursor-pointer"
                          title="Call host"
                        >
                          <Phone className="w-4 h-4" />
                        </a>

                        <button
                          type="button"
                          onClick={() => setExpandedMapRequestId(expandedMapRequestId === req.id ? null : req.id)}
                          className="p-2 rounded-xl bg-white border border-emerald-200 text-emerald-800 hover:bg-emerald-100 transition-colors cursor-pointer flex items-center gap-1 text-xs font-bold"
                          title="View on Israel Map"
                        >
                          <MapIcon className="w-4 h-4 text-emerald-700" />
                          <span className="hidden sm:inline">{expandedMapRequestId === req.id ? t('Hide Map', 'סגור מפה') : t('Map', 'מפה')}</span>
                          {expandedMapRequestId === req.id ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    {/* Interactive Host Location Map Preview */}
                    {expandedMapRequestId === req.id && (
                      <div className="pt-2 animate-in fade-in duration-200 space-y-2">
                        <div className="flex items-center justify-between text-[11px] text-emerald-900 font-semibold">
                          <span>{t('Host Family Neighborhood Map:', 'מפת שכונת המשפחה המארחת:')}</span>
                          <span>{req.matchedHostAddress || `${req.city}, Israel`}</span>
                        </div>
                        <IsraelMap
                          mode="preview"
                          previewCity={req.city}
                          previewAddress={req.matchedHostAddress || `${req.city}, Israel`}
                          previewTitle={req.matchedHostName}
                          height="200px"
                        />
                      </div>
                    )}

                    {/* Post-Shabbat Feedback Call (Scenario 1, step 9) */}
                    <div className="pt-2 border-t border-emerald-200/60 flex items-center justify-between">
                      <p className="text-[11px] text-emerald-800 font-medium">
                        {t('Shabbat has passed? Share your experience with the community team.', 'השבת הסתיימה? שתפו אותנו בחוויה.')}
                      </p>
                      <button
                        onClick={() => handleGiveFeedback(req)}
                        className="px-3 py-1 rounded-lg bg-white border border-emerald-300 hover:bg-emerald-100 text-emerald-900 text-xs font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        <span>{req.feedbackCompleted ? t('Feedback Given ✓', 'משוב נמסר ✓') : t('Leave Feedback', 'השאר משוב')}</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Actions: Cancel (Scenario 4) or Reopen */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 text-xs">
                  <span className="text-[11px] text-slate-400">
                    {t('Posted:', 'נוצר בתאריך:')} {new Date(req.createdAt).toLocaleDateString()}
                  </span>

                  <div className="flex items-center gap-2">
                    {req.status === 'open' && (
                      <button
                        onClick={() => handleOpenCancelModal(req.id)}
                        className="text-rose-600 hover:text-rose-700 font-bold px-3 py-1 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                      >
                        {t('Cancel Request', 'בטל בקשה')}
                      </button>
                    )}

                    {req.status === 'host_found' && (
                      <button
                        onClick={() => handleOpenCancelModal(req.id)}
                        className="text-rose-600 hover:text-rose-700 font-bold px-3 py-1 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                      >
                        {t('Cancel Hosting (Scenario 4)', 'בטל אירוח (תרחיש 4)')}
                      </button>
                    )}

                    {req.status === 'cancelled' && (
                      <button
                        onClick={() => reopenRequest(req.id)}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold transition-colors cursor-pointer"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>{t('Reopen Request (Alternative flow)', 'פתח בקשה מחדש')}</span>
                      </button>
                    )}

                    {req.status === 'expired' && (
                      <button
                        onClick={() => setIsRequestModalOpen(true)}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold transition-colors cursor-pointer"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>{t('Request for Next Shabbat', 'בקש לשבת הבאה')}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Cancel Confirmation Dialog (Scenario 4, step 6) */}
      {cancelModalRequestId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h3 className="text-xl font-bold text-slate-900">
                {t('Confirm Cancellation?', 'האם לבטל את הבקשה?')}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {t(
                  'The host family will be immediately notified via WhatsApp so they are free to host someone else.',
                  'המשפחה המארחת תקבל הודעת וואטסאפ מיידית כדי שתוכל לפנות את המקום לאורח אחר.'
                )}
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('Reason for Cancellation', 'סיבת הביטול')}
              </label>
              <select
                value={cancelReason}
                onChange={e => setCancelReason(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white outline-hidden cursor-pointer"
              >
                <option value="Must stay on army base (חייב להישאר בבסיס)">
                  {t('Must stay on army base / military duty', 'חייב להישאר בבסיס (חייל/ת בודד/ת)')}
                </option>
                <option value="Traveling with family / friends">{t('Traveling with family / friends', 'נוסע/ת למשפחה / חברים')}</option>
                <option value="Feeling unwell">{t('Feeling unwell', 'איני מרגיש/ה בטוב')}</option>
                <option value="Other personal plans">{t('Other personal plans', 'אחר')}</option>
              </select>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setCancelModalRequestId(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                {t('Keep Request', 'השאר בקשה')}
              </button>
              <button
                onClick={handleConfirmCancel}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md cursor-pointer"
              >
                {t('Confirm & Notify Host', 'אשר ביטול ועדכן משפחה')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
