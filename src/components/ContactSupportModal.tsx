import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, HelpCircle, Send, CheckCircle2 } from 'lucide-react';

export const ContactSupportModal: React.FC = () => {
  const { isSupportModalOpen, setIsSupportModalOpen, createSupportTicket, currentUser, t } = useApp();

  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSent, setIsSent] = useState(false);

  if (!isSupportModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;
    createSupportTicket(subject, message);
    setIsSent(true);
    setTimeout(() => {
      setIsSent(false);
      setIsSupportModalOpen(false);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-100">
        <button
          onClick={() => setIsSupportModalOpen(false)}
          className="absolute top-5 right-5 rtl:right-auto rtl:left-5 text-slate-400 hover:text-slate-600 p-1 rounded-full cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-5">
          <div className="w-12 h-12 mx-auto mb-2 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shadow-xs">
            <HelpCircle className="w-6 h-6 text-amber-700" />
          </div>
          <h3 className="text-xl font-extrabold text-slate-900">
            {t('Contact Community Support', 'יצירת קשר עם התמיכה')}
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            {t(
              'Need help updating details, coordinating hosts, or have questions? Dana and our team are here for you.',
              'צריכים עזרה בעדכון פרטים, תיאום עם משפחות או שאלות? דנה וצוות המערכת כאן לשירותכם.'
            )}
          </p>
        </div>

        {isSent ? (
          <div className="text-center py-6 animate-in zoom-in-95">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
            <h4 className="text-base font-bold text-slate-900">{t('Message Sent!', 'הפנייה נשלחה בהצלחה!')}</h4>
            <p className="text-xs text-slate-500 mt-1">{t('Dana will review your request in the admin inbox.', 'דנה תטפל בפנייתך בתיבת הניהול.')}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('Subject *', 'נושא הפנייה *')}
              </label>
              <input
                type="text"
                value={subject}
                onChange={e => setSubject(e.target.value)}
                placeholder={t('e.g. Cannot update phone number', 'לדוגמה: עזרה בעדכון מספר טלפון')}
                required
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white outline-hidden focus:ring-2 focus:ring-amber-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('How can we help? *', 'תוכן הפנייה *')}
              </label>
              <textarea
                rows={3}
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder={t('Describe your question or technical issue...', 'פרטו את הבקשה או התקלה...')}
                required
                className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-white outline-hidden focus:ring-2 focus:ring-amber-500/20"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsSupportModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                {t('Cancel', 'ביטול')}
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{t('Send to Admin', 'שלח למנהלת')}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
