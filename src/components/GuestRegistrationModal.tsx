import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { INSTITUTIONS } from '../data/initialData';
import { ReligiousObservance } from '../types';
import { X, Sparkles, Loader2, User, Phone, BookOpen, AlertCircle, Check } from 'lucide-react';

export const GuestRegistrationModal: React.FC = () => {
  const { isGuestRegOpen, setIsGuestRegOpen, registerGuest, currentUser, t, lang } = useApp();

  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [gender, setGender] = useState<'female' | 'male' | 'other'>(currentUser?.gender || 'female');
  const [observance, setObservance] = useState<ReligiousObservance>(currentUser?.observance || 'Dati Leumi');
  const [allergies, setAllergies] = useState(currentUser?.allergies || 'Vegetarian');
  const [institution, setInstitution] = useState(currentUser?.institution || 'Ariel University');
  const [guestType, setGuestType] = useState(currentUser?.guestType || 'student');
  const [about, setAbout] = useState(currentUser?.bio || '');
  const [avatar, setAvatar] = useState(currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80');

  // Validation
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiSuccessMessage, setAiSuccessMessage] = useState('');

  if (!isGuestRegOpen) return null;

  // AI Bio Assistant
  const handleGenerateAiBio = async () => {
    setIsAiLoading(true);
    setAiSuccessMessage('');
    try {
      const res = await fetch('/api/ai/bio-helper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name || 'Ariel student',
          institution,
          background: guestType === 'lone_soldier' ? 'IDF Lone Soldier' : 'University student / Oleh',
          observance,
          allergies,
          currentDraft: about,
          lang,
        }),
      });
      const data = await res.json();
      if (data.text) {
        setAbout(data.text);
        setAiSuccessMessage(t('AI created a warm bio for you!', 'ה-AI כתב עבורך היכרות חמה ומכבדת!'));
        setTimeout(() => setAiSuccessMessage(''), 4000);
      }
    } catch (err) {
      console.error('Error generating bio:', err);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!name.trim()) newErrors.name = t('Name is required', 'יש להזין שם מלא');
    if (!phone.trim()) newErrors.phone = t('Valid Israeli phone number is required', 'יש להזין מספר טלפון תקין');
    if (!institution) newErrors.institution = t('Please select your institution', 'יש לבחור מוסד לימודים/שירות');

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    registerGuest({
      name,
      phone,
      whatsappNumber: phone,
      gender,
      observance,
      allergies,
      institution,
      guestType: guestType as any,
      bio: about,
      avatar,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 my-8">
        <button
          onClick={() => setIsGuestRegOpen(false)}
          className="absolute top-5 right-5 rtl:right-auto rtl:left-5 text-slate-400 hover:text-slate-600 p-1 rounded-full cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold mb-2">
            {t('Scenario 1: Guest Registration', 'תרחיש 1: הרשמת אורח/ת חדש/ה')}
          </span>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {t('Complete Your Guest Profile', 'השלמת פרופיל אורח')}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {t(
              'Tell prospective host families a little about yourself so they can welcome you comfortably',
              'ספרו מעט על עצמכם כדי שמשפחות מארחות יוכלו להכיר אתכם ולקבל אתכם בשמחה'
            )}
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          {/* Avatar & Basic Info */}
          <div className="flex flex-col sm:flex-row items-center gap-4 p-3 rounded-2xl bg-amber-50/50 border border-amber-200/40">
            <img
              src={avatar}
              alt="Avatar"
              className="w-16 h-16 rounded-full object-cover ring-4 ring-amber-400/30"
            />
            <div className="flex-1 text-center sm:text-left rtl:sm:text-right">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('Profile Photo URL', 'כתובת תמונת פרופיל')}
              </label>
              <input
                type="text"
                value={avatar}
                onChange={e => setAvatar(e.target.value)}
                className="w-full text-xs px-3 py-1.5 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-hidden"
              />
            </div>
          </div>

          {/* Name & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('Full Name *', 'שם מלא *')}
              </label>
              <input
                type="text"
                value={name}
                onChange={e => {
                  setName(e.target.value);
                  if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
                }}
                placeholder={t('e.g. Noa Ben-David', 'לדוגמה: נועה בן דוד')}
                className={`w-full text-xs px-3 py-2 rounded-xl border ${
                  errors.name ? 'border-rose-500 bg-rose-50/50' : 'border-slate-200 bg-white'
                } focus:ring-2 focus:ring-amber-500/20 outline-hidden`}
              />
              {errors.name && <p className="text-[10px] text-rose-600 mt-1 font-medium">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('Phone / WhatsApp *', 'טלפון / וואטסאפ *')}
              </label>
              <input
                type="tel"
                value={phone}
                onChange={e => {
                  setPhone(e.target.value);
                  if (errors.phone) setErrors(prev => ({ ...prev, phone: '' }));
                }}
                placeholder="+972-52-849-2104"
                className={`w-full text-xs px-3 py-2 rounded-xl border ${
                  errors.phone ? 'border-rose-500 bg-rose-50/50' : 'border-slate-200 bg-white'
                } focus:ring-2 focus:ring-amber-500/20 outline-hidden`}
              />
              {errors.phone && <p className="text-[10px] text-rose-600 mt-1 font-medium">{errors.phone}</p>}
            </div>
          </div>

          {/* Gender & User Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('Gender', 'מגדר')}
              </label>
              <select
                value={gender}
                onChange={e => setGender(e.target.value as any)}
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white outline-hidden cursor-pointer"
              >
                <option value="female">{t('Female (נקבה)', 'נקבה')}</option>
                <option value="male">{t('Male (זכר)', 'זכר')}</option>
                <option value="other">{t('Other / Prefer not to say', 'אחר')}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('Category', 'סטטוס')}
              </label>
              <select
                value={guestType}
                onChange={e => setGuestType(e.target.value as any)}
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white outline-hidden cursor-pointer"
              >
                <option value="student">{t('Student (סטודנט/ית)', 'סטודנט/ית')}</option>
                <option value="lone_soldier">{t('Lone Soldier (חייל/ת בודד/ת)', 'חייל/ת בודד/ת')}</option>
                <option value="oleh">{t('Oleh Chadash / Masa (עולה חדש/ה)', 'עולה חדש/ה')}</option>
                <option value="visitor">{t('Visitor / Tourist (מבקר/ת בארץ)', 'מבקר/ת')}</option>
              </select>
            </div>
          </div>

          {/* Institution selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {t('Academic Institution / Organization *', 'מוסד אקדמי / מסגרת *')}
            </label>
            <select
              value={institution}
              onChange={e => {
                setInstitution(e.target.value);
                if (errors.institution) setErrors(prev => ({ ...prev, institution: '' }));
              }}
              className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white outline-hidden cursor-pointer"
            >
              {INSTITUTIONS.map(inst => (
                <option key={inst} value={inst}>
                  {inst}
                </option>
              ))}
            </select>
          </div>

          {/* Religious Observance & Allergies */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('Level of Religious Observance', 'רמת שמירת מצוות / שבת')}
              </label>
              <select
                value={observance}
                onChange={e => setObservance(e.target.value as any)}
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white outline-hidden cursor-pointer"
              >
                <option value="Dati Leumi">{t('Dati Leumi / Religious Zionist', 'דתי לאומי')}</option>
                <option value="Modern Orthodox">{t('Modern Orthodox', 'מודרן אורתודוקס')}</option>
                <option value="Traditional">{t('Traditional (Masorti)', 'מסורתי')}</option>
                <option value="Charedi">{t('Charedi', 'חרדי')}</option>
                <option value="Chabad">{t('Chabad', 'חב״ד')}</option>
                <option value="Secular">{t('Secular / Cultural', 'חילוני / תרבותי')}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('Allergies & Dietary Needs', 'אלרגיות וכשרות')}
              </label>
              <input
                type="text"
                value={allergies}
                onChange={e => setAllergies(e.target.value)}
                placeholder={t('e.g. Vegetarian, Gluten-free, Kosher', 'למשל: צמחוני, ללא גלוטן, כשר')}
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white outline-hidden"
              />
            </div>
          </div>

          {/* About Me with AI Writing Help */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-700">
                {t('About Me', 'קצת עליי')}
              </label>
              <button
                type="button"
                onClick={handleGenerateAiBio}
                disabled={isAiLoading}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-600 hover:to-indigo-700 text-white text-[11px] font-bold shadow-xs transition-all active:scale-95 cursor-pointer disabled:opacity-50"
              >
                {isAiLoading ? (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span>{t('Writing with AI...', 'כותב עבורך...')}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3 h-3 text-yellow-200" />
                    <span>{t('Help me write with AI', 'עזור לי לכתוב עם AI ✨')}</span>
                  </>
                )}
              </button>
            </div>

            <textarea
              rows={3}
              value={about}
              onChange={e => setAbout(e.target.value)}
              placeholder={t(
                'Tell the host family about your hobbies, studies, and what you enjoy at the Shabbat table...',
                'ספרו למשפחה המארחת על הלימודים, התחביבים ומה אתם אוהבים בשולחן השבת...'
              )}
              className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-hidden leading-relaxed"
            />
            {aiSuccessMessage && (
              <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
                <Check className="w-3.5 h-3.5" />
                <span>{aiSuccessMessage}</span>
              </p>
            )}
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsGuestRegOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              {t('Cancel', 'ביטול')}
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 active:scale-95 text-white font-bold text-xs transition-all shadow-md shadow-amber-600/20 cursor-pointer"
            >
              {t('Save Profile & Request Shabbat', 'שמור פרופיל והמשך לבקשת שבת')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
