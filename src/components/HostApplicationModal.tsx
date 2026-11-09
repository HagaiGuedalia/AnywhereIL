import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ISRAELI_CITIES } from '../data/initialData';
import { MealType, ReligiousObservance } from '../types';
import { X, Heart, Home, Users, Bed, Utensils, CheckCircle2 } from 'lucide-react';

export const HostApplicationModal: React.FC = () => {
  const {
    isHostAppModalOpen,
    setIsHostAppModalOpen,
    submitHostApplication,
    currentUser,
    t,
  } = useApp();

  const [familyName, setFamilyName] = useState(currentUser?.name ? `${currentUser.name}'s Family` : 'The Levi Family');
  const [city, setCity] = useState('Beit Shemesh');
  const [neighborhood, setNeighborhood] = useState('Mishkafayim / Sheinfeld');
  const [numberOfChildren, setNumberOfChildren] = useState(4);
  const [observance, setObservance] = useState<ReligiousObservance>('Modern Orthodox');
  const [englishLevel, setEnglishLevel] = useState<'Native' | 'Fluent' | 'Conversational' | 'Basic'>('Fluent');
  const [maxGuests, setMaxGuests] = useState(3);
  const [mealsOffered, setMealsOffered] = useState<MealType[]>(['friday_dinner', 'shabbat_lunch']);
  const [canSleep, setCanSleep] = useState(true);
  const [sleepingDetails, setSleepingDetails] = useState('Dedicated guest suite on lower level with 3 beds');
  const [about, setAbout] = useState('We love hosting young Olim and college students for warm home cooked meals.');
  const [familyPhoto, setFamilyPhoto] = useState(currentUser?.avatar || 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=600&auto=format&fit=crop&q=80');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [isWhatsappOptedIn, setIsWhatsappOptedIn] = useState(true);

  // Success message state (Scenario 2, step 4)
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isHostAppModalOpen) return null;

  const toggleMeal = (meal: MealType) => {
    if (mealsOffered.includes(meal)) {
      if (mealsOffered.length > 1) setMealsOffered(mealsOffered.filter(m => m !== meal));
    } else {
      setMealsOffered([...mealsOffered, meal]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitHostApplication({
      familyName,
      city,
      neighborhood,
      numberOfChildren,
      observance,
      englishLevel,
      maxGuests,
      mealsOffered,
      canSleep,
      sleepingDetails,
      about,
      familyPhoto,
      whatsappNumber,
      isWhatsappOptedIn,
      contactAddress: `${neighborhood}, ${city}`,
    });
    setIsSubmitted(true);
  };

  const handleFinish = () => {
    setIsSubmitted(false);
    setIsHostAppModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 my-8">
        <button
          onClick={() => {
            setIsSubmitted(false);
            setIsHostAppModalOpen(false);
          }}
          className="absolute top-5 right-5 rtl:right-auto rtl:left-5 text-slate-400 hover:text-slate-600 p-1 rounded-full cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {isSubmitted ? (
          /* Confirmation Message (Scenario 2, Step 4) */
          <div className="text-center py-6 animate-in zoom-in-95">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-inner">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h3 className="text-2xl font-black text-slate-900">
              {t('Application Received! 🎉', 'בקשתכם התקבלה בהצלחה! 🎉')}
            </h3>
            <p className="text-xs text-slate-600 mt-2 max-w-md mx-auto leading-relaxed">
              {t(
                'Your application was received and will be reviewed by the team. Dana, our national coordinator, will review your details and you will receive an approval email shortly.',
                'בקשתכם התקבלה ותיבדק על ידי צוות המערכת. דנה, מנהלת המערכת, תעבור על הפרטים ותקבלו הודעת אישור בהקדם.'
              )}
            </p>

            <div className="mt-6">
              <button
                onClick={handleFinish}
                className="w-full py-3 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 active:scale-98 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                {t('View Host Profile Status', 'צפה בסטטוס הבקשה בפרופיל')}
              </button>
            </div>
          </div>
        ) : (
          /* Host Application Form (Scenario 2, Step 3) */
          <div>
            <div className="mb-5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold mb-2">
                {t('Scenario 2: Host Application', 'תרחיש 2: הצטרפות כמשפחה מארחת')}
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                {t('Open Your Home for Shabbat', 'הכנסת אורחים לשבת')}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                {t(
                  'Join hundreds of families across Israel hosting students, lone soldiers, and Olim for Shabbat',
                  'הצטרפו למאות משפחות בכל הארץ המארחות סטודנטים, חיילים בודדים ועולים'
                )}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Family Name & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t('Family Name *', 'שם המשפחה *')}
                  </label>
                  <input
                    type="text"
                    value={familyName}
                    onChange={e => setFamilyName(e.target.value)}
                    placeholder="e.g. The Levi Family"
                    required
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t('City *', 'עיר *')}
                  </label>
                  <select
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white outline-hidden cursor-pointer"
                  >
                    {ISRAELI_CITIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Neighborhood & Number of kids */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t('Neighborhood', 'שכונה')}
                  </label>
                  <input
                    type="text"
                    value={neighborhood}
                    onChange={e => setNeighborhood(e.target.value)}
                    placeholder="e.g. Mishkafayim / Katamon"
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t('Number of Children', 'מספר ילדים במשפחה')}
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="15"
                    value={numberOfChildren}
                    onChange={e => setNumberOfChildren(parseInt(e.target.value, 10) || 0)}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white outline-hidden"
                  />
                </div>
              </div>

              {/* Observance & English Level */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t('Observance Level', 'רמת שמירת שבת וכשרות')}
                  </label>
                  <select
                    value={observance}
                    onChange={e => setObservance(e.target.value as any)}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white outline-hidden cursor-pointer"
                  >
                    <option value="Dati Leumi">{t('Dati Leumi (Religious Zionist)', 'דתי לאומי')}</option>
                    <option value="Modern Orthodox">{t('Modern Orthodox', 'מודרן אורתודוקס')}</option>
                    <option value="Traditional">{t('Traditional (Masorti)', 'מסורתי')}</option>
                    <option value="Charedi">{t('Charedi', 'חרדי')}</option>
                    <option value="Chabad">{t('Chabad', 'חב״ד')}</option>
                    <option value="Secular">{t('Secular / Cultural', 'חילוני')}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t('English Level (for Olim/Students)', 'רמת אנגלית (לעולים וסטודנטים)')}
                  </label>
                  <select
                    value={englishLevel}
                    onChange={e => setEnglishLevel(e.target.value as any)}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white outline-hidden cursor-pointer"
                  >
                    <option value="Native">{t('Native English', 'שפת אם')}</option>
                    <option value="Fluent">{t('Fluent', 'שוטפת')}</option>
                    <option value="Conversational">{t('Conversational', 'שיחה בסיסית')}</option>
                    <option value="Basic">{t('Basic / Hebrew preferred', 'בסיסית / עדיפות לעברית')}</option>
                  </select>
                </div>
              </div>

              {/* Hosting Capacity: Max Guests & Sleeping */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-amber-600" />
                    <span>{t('Max Guests Capacity', 'מספר מקסימלי של אורחים')}</span>
                  </label>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map(num => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setMaxGuests(num)}
                        className={`flex-1 py-1 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                          maxGuests === num ? 'bg-amber-600 text-white border-amber-600' : 'bg-white border-slate-200 text-slate-700'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                    <Bed className="w-3.5 h-3.5 text-amber-600" />
                    <span>{t('Can offer sleeping bed?', 'האם מציעים מיטת לינה?')}</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setCanSleep(!canSleep)}
                    className={`w-full py-1.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-between transition-colors cursor-pointer ${
                      canSleep ? 'border-emerald-500 bg-emerald-50 text-emerald-900' : 'border-slate-200 bg-white text-slate-600'
                    }`}
                  >
                    <span>{canSleep ? t('Yes, beds available', 'כן, יש מקום לינה') : t('Meals only', 'ארוחות בלבד')}</span>
                    <span>{canSleep ? '🛏️' : '🍽️'}</span>
                  </button>
                </div>
              </div>

              {/* Meals offered */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Utensils className="w-3.5 h-3.5 text-amber-600" />
                  <span>{t('Meals Offered', 'ארוחות מוצעות')}</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => toggleMeal('friday_dinner')}
                    className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                      mealsOffered.includes('friday_dinner')
                        ? 'border-amber-500 bg-amber-50 text-amber-950 font-bold'
                        : 'border-slate-200 bg-white text-slate-600'
                    }`}
                  >
                    <p className="text-xs">{t('Friday Dinner', 'סעודת ליל שבת')}</p>
                    <span className="text-[10px]">{mealsOffered.includes('friday_dinner') ? '✓' : ''}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleMeal('shabbat_lunch')}
                    className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                      mealsOffered.includes('shabbat_lunch')
                        ? 'border-amber-500 bg-amber-50 text-amber-950 font-bold'
                        : 'border-slate-200 bg-white text-slate-600'
                    }`}
                  >
                    <p className="text-xs">{t('Shabbat Lunch', 'סעודת יום שבת')}</p>
                    <span className="text-[10px]">{mealsOffered.includes('shabbat_lunch') ? '✓' : ''}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleMeal('seuda_shelishit')}
                    className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                      mealsOffered.includes('seuda_shelishit')
                        ? 'border-amber-500 bg-amber-50 text-amber-950 font-bold'
                        : 'border-slate-200 bg-white text-slate-600'
                    }`}
                  >
                    <p className="text-xs">{t('Seuda Shelishit', 'סעודה שלישית')}</p>
                    <span className="text-[10px]">{mealsOffered.includes('seuda_shelishit') ? '✓' : ''}</span>
                  </button>
                </div>
              </div>

              {/* About Us */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t('About Our Family', 'על המשפחה שלנו')}
                </label>
                <textarea
                  rows={2}
                  value={about}
                  onChange={e => setAbout(e.target.value)}
                  placeholder="Tell potential guests about your home atmosphere, hobbies..."
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-white outline-hidden"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsHostAppModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  {t('Cancel', 'ביטול')}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 active:scale-95 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                >
                  {t('Submit Host Application', 'הגש בקשת הצטרפות כמארח')}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export const CompleteDetailsModal: React.FC = () => {
  const { isCompleteDetailsOpen, setIsCompleteDetailsOpen, updateHostWhatsApp, hostProfiles, currentUser, t } = useApp();

  const currentHost = hostProfiles.find(h => h.userId === currentUser?.id) || hostProfiles[1]; // Levi default
  const [phone, setPhone] = useState(currentHost?.whatsappNumber || '+972-50-664-9218');
  const [optIn, setOptIn] = useState(true);

  if (!isCompleteDetailsOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentHost) {
      updateHostWhatsApp(currentHost.id, phone, optIn);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-100">
        <button
          onClick={() => setIsCompleteDetailsOpen(false)}
          className="absolute top-5 right-5 rtl:right-auto rtl:left-5 text-slate-400 hover:text-slate-600 p-1 rounded-full cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-5">
          <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-lg shadow-xs">
            💬
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold mb-2">
            {t('Scenario 2: Complete Your Details', 'תרחיש 2: השלמת פרטי התקשרות')}
          </span>
          <h3 className="text-xl font-extrabold text-slate-900">
            {t('Add Your WhatsApp Number', 'הוספת מספר וואטסאפ')}
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
            {t(
              'The system detected that your profile is missing a WhatsApp number for receiving guest notifications.',
              'המערכת זיהתה שחסר מספר וואטסאפ בפרופיל לקבלת התראות על בקשות אירוח מתאימות.'
            )}
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {t('WhatsApp Phone Number *', 'מספר טלפון לוואטסאפ *')}
            </label>
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="+972-50-664-9218"
              required
              className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 bg-white outline-hidden focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <label className="flex items-start gap-2.5 p-3 rounded-xl bg-emerald-50/60 border border-emerald-200/50 cursor-pointer">
            <input
              type="checkbox"
              checked={optIn}
              onChange={e => setOptIn(e.target.checked)}
              className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
            />
            <span className="text-xs text-emerald-900 leading-tight">
              {t(
                'I agree to receive instant WhatsApp notifications when suitable students or soldiers request hosting in my city.',
                'אני מאשר/ת לקבל התראות וואטסאפ כאשר סטודנטים או חיילים מבקשים אירוח בעיר שלי.'
              )}
            </span>
          </label>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsCompleteDetailsOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              {t('Later', 'אחר כך')}
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              {t('Save & Enable Notifications', 'שמור והפעל התראות')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
