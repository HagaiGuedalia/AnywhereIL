import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Star, X, CheckCircle2, MessageSquare, Clock } from 'lucide-react';

export const FeedbackModal: React.FC = () => {
  const {
    isFeedbackModalOpen,
    setIsFeedbackModalOpen,
    feedbackTargetRequest,
    submitFeedback,
    currentUser,
    t,
  } = useApp();

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [contactPromptness, setContactPromptness] = useState<
    'early_week' | 'thursday' | 'friday_morning' | 'late_friday'
  >('early_week');

  if (!isFeedbackModalOpen) return null;

  const targetName =
    currentUser?.role === 'host'
      ? feedbackTargetRequest?.guestName || 'The Guest'
      : feedbackTargetRequest?.matchedHostName || 'The Host Family';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitFeedback({
      requestId: feedbackTargetRequest?.id || `req-past-${Date.now()}`,
      shabbatName: feedbackTargetRequest?.shabbatHebrewName || 'פרשת תולדות',
      reviewerId: currentUser?.id || 'user-noa',
      reviewerName: currentUser?.name || 'Noa Ben-David',
      reviewerRole: currentUser?.role === 'host' ? 'host' : 'guest',
      targetName,
      rating,
      comment: comment || 'Wonderful Shabbat experience, delicious food and warm hospitality!',
      contactPromptness,
      city: feedbackTargetRequest?.city || 'Jerusalem',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-100 my-8">
        <button
          onClick={() => setIsFeedbackModalOpen(false)}
          className="absolute top-5 right-5 rtl:right-auto rtl:left-5 text-slate-400 hover:text-slate-600 p-1 rounded-full cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold mb-2">
            {t('Post-Shabbat Feedback', 'משוב מוצאי שבת')}
          </span>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">
            {t('How was your Shabbat?', 'איך עברה השבת?')}
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            {t(
              `Share your feedback about hosting with ${targetName}`,
              `שתפו אותנו בחוויית האירוח עם ${targetName}`
            )}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Star rating */}
          <div className="text-center py-2">
            <label className="block text-xs font-bold text-slate-700 mb-2">
              {t('Overall Rating', 'דירוג כללי')}
            </label>
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="p-1 hover:scale-125 transition-transform cursor-pointer focus:outline-hidden"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-100'
                    }`}
                  />
                </button>
              ))}
            </div>
            <p className="text-xs font-semibold text-amber-700 mt-1">
              {rating === 5 && t('Outstanding! (5/5)', 'יוצא מן הכלל! (5/5)')}
              {rating === 4 && t('Very Good (4/5)', 'טוב מאוד (4/5)')}
              {rating === 3 && t('Average / Okay (3/5)', 'סביר (3/5)')}
              {rating <= 2 && t('Needs Improvement', 'דרוש שיפור')}
            </p>
          </div>

          {/* Contact promptness (Scenario 5 theme) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span>{t('When did initial contact happen?', 'מתי נוצר הקשר הראשוני לפני שבת?')}</span>
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { key: 'early_week' as const, labelEn: 'Early in week (Sun-Tue)', labelHe: 'תחילת שבוע (א׳-ג׳)' },
                { key: 'thursday' as const, labelEn: 'Thursday', labelHe: 'יום חמישי' },
                { key: 'friday_morning' as const, labelEn: 'Friday Morning', labelHe: 'שישי בבוקר' },
                { key: 'late_friday' as const, labelEn: 'Late Friday Afternoon', labelHe: 'שישי אחה״צ (מאוחר)' },
              ].map(opt => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => setContactPromptness(opt.key)}
                  className={`p-2 rounded-xl border text-left rtl:text-right font-medium transition-colors cursor-pointer ${
                    contactPromptness === opt.key
                      ? 'border-amber-500 bg-amber-50 text-amber-950 font-bold'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {t(opt.labelEn, opt.labelHe)}
                </button>
              ))}
            </div>
          </div>

          {/* Free comment */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {t('A few words of appreciation or suggestions:', 'כמה מילים על החוויה / הערות לצוות:')}
            </label>
            <textarea
              rows={3}
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder={t(
                'Tell us about the atmosphere, the food, and any helpful feedback...',
                'ספרו על האווירה, הארוחות וכל משוב שיעזור לשפר את השירות...'
              )}
              className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-hidden"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsFeedbackModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              {t('Skip', 'דלג')}
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 active:scale-95 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              {t('Submit Feedback', 'שלח משוב')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
