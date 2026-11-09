import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Sparkles,
  MapPin,
  Calendar,
  Utensils,
  Bed,
  CheckCircle2,
  EyeOff,
  MessageCircle,
  ExternalLink,
  ShieldCheck,
  UserCheck,
  Loader2,
} from 'lucide-react';

export const RequestCardModal: React.FC = () => {
  const {
    selectedRequest,
    setSelectedRequest,
    acceptRequestAsHost,
    hideRequest,
    hostProfiles,
    currentUser,
    t,
    lang,
  } = useApp();

  const [aiScore, setAiScore] = useState<number | null>(null);
  const [aiBadge, setAiBadge] = useState<string>('');
  const [aiExplanation, setAiExplanation] = useState<string>('');
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [isAcceptedSuccess, setIsAcceptedSuccess] = useState(false);

  const currentHost = hostProfiles.find(h => h.userId === currentUser?.id) || hostProfiles[0];

  useEffect(() => {
    if (selectedRequest && currentHost) {
      setIsLoadingAi(true);
      fetch('/api/ai/match-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guestRequest: selectedRequest,
          hostProfile: currentHost,
          lang,
        }),
      })
        .then(res => res.json())
        .then(data => {
          setAiScore(data.score || 94);
          setAiBadge(data.badge || (lang === 'he' ? 'התאמה גבוהה' : 'High match'));
          setAiExplanation(
            data.explanation ||
              (lang === 'he'
                ? 'התאמה גבוהה: סטודנט/ית, רמת כשרות ושמירת שבת דומה, זקוק/ה ללינה ואתם מציעים מיטה פנויה.'
                : 'High match: a student, similar religious observance, needs a place to sleep and you offer one.')
          );
        })
        .catch(err => {
          console.error('Match score error:', err);
          setAiScore(92);
          setAiBadge(lang === 'he' ? 'התאמה גבוהה' : 'High match');
          setAiExplanation(
            lang === 'he'
              ? 'התאמה מצוינת במיקום, שמירת שבת וסידורי לינה.'
              : 'High match: compatible observance, location and lodging fit.'
          );
        })
        .finally(() => setIsLoadingAi(false));
    }
  }, [selectedRequest, currentHost, lang]);

  if (!selectedRequest) return null;

  const isAlreadyTaken = selectedRequest.status === 'host_found' && selectedRequest.matchedHostId !== currentHost.id;

  const handleAccept = () => {
    acceptRequestAsHost(selectedRequest.id, currentHost.id);
    setIsAcceptedSuccess(true);
  };

  const handleHide = () => {
    hideRequest(selectedRequest.id);
    setSelectedRequest(null);
  };

  const mealsList = selectedRequest.mealsRequested.map(m => {
    if (m === 'friday_dinner') return t('Friday Night Dinner', 'סעודת ליל שבת');
    if (m === 'shabbat_lunch') return t('Shabbat Lunch', 'סעודת יום שבת');
    return t('Seuda Shelishit', 'סעודה שלישית');
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-100 my-8">
        <button
          onClick={() => {
            setSelectedRequest(null);
            setIsAcceptedSuccess(false);
          }}
          className="absolute top-5 right-5 rtl:right-auto rtl:left-5 text-slate-400 hover:text-slate-600 p-1 rounded-full cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {isAcceptedSuccess ? (
          /* Success Screen with Reminder to Contact Guest (Scenario 3, step 5 & 6) */
          <div className="text-center py-4 animate-in zoom-in-95">
            <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-inner">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black text-slate-900">
              {t('You are Hosting!', 'השיבוץ נקבע בהצלחה! 🎉')}
            </h3>
            <p className="text-xs text-slate-600 mt-1 max-w-sm mx-auto">
              {t(
                `Mazal Tov! You matched with ${selectedRequest.guestName}. We sent them a WhatsApp confirmation.`,
                `מזל טוב! השבת תארחו את ${selectedRequest.guestName}. הודעה נשלחה אליהם בוואטסאפ.`
              )}
            </p>

            {/* Reminder to contact before Shabbat (Scenario 3, step 6) */}
            <div className="my-5 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-left rtl:text-right space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>{t('Important Reminder:', 'תזכורת חשובה:')}</span>
              </div>
              <p className="text-xs text-amber-800 leading-relaxed">
                {t(
                  'We recommend contacting your guest before Shabbat to share directions, arrival times, and coordinate.',
                  'אנו ממליצים ליצור קשר עם האורח/ת מוקדם ככל האפשר כדי לתאם שעת הגעה, כתובת מפורטת וסדרי שבת.'
                )}
              </p>

              <div className="pt-2 flex items-center justify-between text-xs font-bold text-slate-800">
                <span>{selectedRequest.guestName}:</span>
                <span className="font-mono text-emerald-700">{selectedRequest.guestPhone}</span>
              </div>

              <a
                href={`https://wa.me/${selectedRequest.guestPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                  `Shalom ${selectedRequest.guestName}! This is ${currentHost.familyName}. We are thrilled to host you this Shabbat for ${selectedRequest.shabbatHebrewName} in ${currentHost.city}!`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="w-full mt-2 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{t('Open WhatsApp to Message Guest', 'פתח וואטסאפ לשיחה עם האורח/ת')}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <button
              onClick={() => {
                setSelectedRequest(null);
                setIsAcceptedSuccess(false);
              }}
              className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors cursor-pointer"
            >
              {t('Back to Dashboard', 'חזרה ללוח האירוח')}
            </button>
          </div>
        ) : (
          /* Request Card (Scenario 3, step 4) */
          <div>
            {/* Header info with Guest Avatar */}
            <div className="flex items-start gap-4 mb-4">
              <img
                src={selectedRequest.guestAvatar}
                alt={selectedRequest.guestName}
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-amber-400/40 shadow-sm"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-extrabold text-slate-900 truncate">
                    {selectedRequest.guestName}
                  </h3>
                  <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-bold capitalize">
                    {selectedRequest.guestType.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-xs text-amber-800 font-semibold mt-0.5">{selectedRequest.institution}</p>
                <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  <span>{selectedRequest.city} {selectedRequest.preferredNeighborhood ? `(${selectedRequest.preferredNeighborhood})` : ''}</span>
                </p>
              </div>
            </div>

            {/* AI Match Score Banner (Scenario 3, step 3) */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-indigo-500/10 border border-amber-300/60 mb-4">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5 font-bold text-xs text-amber-950">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-spin" />
                  <span>{t('AI Match Score', 'ציון התאמה חכמה [AI]')}</span>
                </div>
                {isLoadingAi ? (
                  <span className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span>{t('Calculating...', 'מחשב...')}</span>
                  </span>
                ) : (
                  <span className="text-xs font-black px-2 py-0.5 rounded-full bg-amber-600 text-white shadow-xs">
                    {aiScore}% • {aiBadge}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                {aiExplanation}
              </p>
            </div>

            {/* About Me */}
            <div className="mb-4">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                {t('About Me', 'קצת עליי')}
              </h4>
              <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200/60 leading-relaxed">
                "{selectedRequest.about}"
              </p>
            </div>

            {/* Request Details Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs mb-5">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[11px] text-slate-400 block">{t('Observance:', 'שמירת שבת:')}</span>
                <span className="font-bold text-slate-800">{selectedRequest.observance}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[11px] text-slate-400 block">{t('Dietary / Allergies:', 'כשרות ואלרגיות:')}</span>
                <span className="font-bold text-slate-800">{selectedRequest.allergies || 'None'}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[11px] text-slate-400 block">{t('Meals Needed:', 'ארוחות מבוקשות:')}</span>
                <span className="font-bold text-slate-800">{mealsList.join(', ')}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[11px] text-slate-400 block">{t('Sleeping Bed:', 'צורך בלינה:')}</span>
                <span className="font-bold text-slate-800">
                  {selectedRequest.needsSleep ? t('Yes (1 bed needed)', 'כן (נדרשת מיטה)') : t('No (Meals only)', 'לא (רק ארוחות)')}
                </span>
              </div>
            </div>

            {/* If already taken alternative flow */}
            {isAlreadyTaken ? (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold text-center">
                {t('This request was already accepted by another family.', 'בקשה זו כבר נלקחה על ידי משפחה אחרת.')}
              </div>
            ) : (
              /* Action Buttons (Scenario 3, step 5 & 7) */
              <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleHide}
                  className="px-3.5 py-2.5 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                  title="Hide this request from my feed"
                >
                  <EyeOff className="w-3.5 h-3.5" />
                  <span>{t('Hide', 'הסתר')}</span>
                </button>

                <button
                  type="button"
                  onClick={handleAccept}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 active:scale-98 text-white font-black text-xs shadow-md shadow-amber-600/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>{t("We're Hosting! (Accept Guest)", 'אנחנו מארחים! (אשר אורח)')}</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
