import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ISRAELI_CITIES } from '../data/initialData';
import { MealType } from '../types';
import { X, Calendar, MapPin, Moon, Utensils, CheckCircle2, Bed, Users, Map as MapIcon, Compass } from 'lucide-react';
import { IsraelMap } from './IsraelMap';
import { ISRAEL_CITIES_GEO } from '../data/israelGeo';

export const HostingRequestModal: React.FC = () => {
  const {
    isRequestModalOpen,
    setIsRequestModalOpen,
    upcomingShabbatot,
    createHostingRequest,
    currentUser,
    t,
  } = useApp();

  const [shabbatId, setShabbatId] = useState(upcomingShabbatot[0]?.id || 'shabbat-1');
  const [isMultiCity, setIsMultiCity] = useState(false);
  const [selectedCity, setSelectedCity] = useState('Jerusalem');
  const [multiCities, setMultiCities] = useState<string[]>(["Be'er Sheva", 'Ashdod', 'Jerusalem']);
  const [preferredNeighborhood, setPreferredNeighborhood] = useState('Katamon / Baka / Rechavia');
  const [showMap, setShowMap] = useState(true);
  const [guestCount, setGuestCount] = useState(1);
  const [meals, setMeals] = useState<MealType[]>(['friday_dinner', 'shabbat_lunch']);
  const [needsSleep, setNeedsSleep] = useState(true);

  // Confirmation view state (Scenario 1, step 7)
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isRequestModalOpen) return null;

  const toggleMeal = (meal: MealType) => {
    if (meals.includes(meal)) {
      if (meals.length > 1) setMeals(meals.filter(m => m !== meal));
    } else {
      setMeals([...meals, meal]);
    }
  };

  const toggleMultiCity = (city: string) => {
    if (multiCities.includes(city)) {
      if (multiCities.length > 1) setMultiCities(multiCities.filter(c => c !== city));
    } else {
      setMultiCities([...multiCities, city]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const citiesToPost = isMultiCity ? multiCities : [selectedCity];
    createHostingRequest({
      shabbatId,
      cities: citiesToPost,
      preferredNeighborhood,
      guestCount,
      mealsRequested: meals,
      needsSleep,
    });
    setIsSubmitted(true);
  };

  const handleFinish = () => {
    setIsSubmitted(false);
    setIsRequestModalOpen(false);
  };

  const selectedShabbat = upcomingShabbatot.find(s => s.id === shabbatId) || upcomingShabbatot[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 my-8">
        <button
          onClick={() => {
            setIsSubmitted(false);
            setIsRequestModalOpen(false);
          }}
          className="absolute top-5 right-5 rtl:right-auto rtl:left-5 text-slate-400 hover:text-slate-600 p-1 rounded-full cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {isSubmitted ? (
          /* Confirmation Screen (Scenario 1, Step 7) */
          <div className="text-center py-6 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-inner">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h3 className="text-2xl font-black text-slate-900">
              {t('Request Sent Successfully! 🎉', 'הבקשה נשלחה בהצלחה! 🎉')}
            </h3>
            <p className="text-xs text-slate-600 mt-2 max-w-sm mx-auto leading-relaxed">
              {t(
                `Your request for ${selectedShabbat.hebrewName} (${isMultiCity ? multiCities.join(', ') : selectedCity}) was broadcast to host families. You will receive a WhatsApp message as soon as a family accepts!`,
                `בקשתך לשבת ${selectedShabbat.hebrewName} נשלחה למשפחות מארחות. תקבל/י הודעת וואטסאפ ברגע שמשפחה תאשר את האירוח!`
              )}
            </p>

            <div className="my-6 p-4 rounded-2xl bg-amber-50/70 border border-amber-200/60 text-left rtl:text-right text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">{t('Shabbat / Date:', 'שבת / תאריך:')}</span>
                <span className="font-bold text-slate-800">{selectedShabbat.hebrewName} • {selectedShabbat.gregorianDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{t('Location:', 'מיקום:')}</span>
                <span className="font-bold text-slate-800">{isMultiCity ? multiCities.join(', ') : selectedCity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{t('Meals & Sleeping:', 'ארוחות ולינה:')}</span>
                <span className="font-bold text-slate-800">
                  {meals.length} {t('meals', 'ארוחות')}, {needsSleep ? t('Includes sleeping bed', 'כולל לינה') : t('Meals only', 'ארוחות בלבד')}
                </span>
              </div>
            </div>

            <button
              onClick={handleFinish}
              className="w-full py-3 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 active:scale-98 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              {t('Go to My Requests Dashboard', 'מעבר לבקשות שלי')}
            </button>
          </div>
        ) : (
          /* Hosting Request Form (Scenario 1, Step 5 & 6) */
          <div>
            <div className="mb-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold mb-2">
                {t('Hosting Request Form', 'טופס בקשת אירוח לשבת')}
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                {t('Find a Host Family', 'מציאת משפחה מארחת')}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                {t(
                  'Choose your upcoming Shabbat or holiday and preferred location in Israel',
                  'בחרו שבת או חג, עיר מועדפת ופרטי האירוח המבוקשים'
                )}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Select Shabbat / Holiday */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-amber-600" />
                  <span>{t('Upcoming Shabbat / Holiday *', 'שבת או חג קרובים *')}</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {upcomingShabbatot.map(sh => (
                    <button
                      key={sh.id}
                      type="button"
                      onClick={() => setShabbatId(sh.id)}
                      className={`p-3 rounded-2xl border text-left rtl:text-right transition-all cursor-pointer ${
                        shabbatId === sh.id
                          ? 'border-amber-500 bg-amber-50/80 ring-2 ring-amber-500/20'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-slate-900">{sh.hebrewName}</span>
                        {sh.isComingShabbat && (
                          <span className="text-[10px] bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded-full font-bold">
                            {t('This Shabbat', 'השבת הקרובה')}
                          </span>
                        )}
                        {sh.isHoliday && (
                          <span className="text-[10px] bg-indigo-100 text-indigo-900 px-1.5 py-0.5 rounded-full font-bold">
                            {t('Holiday / Chag', 'חג')}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-600 mt-0.5">{sh.hebrewDate} • {sh.gregorianDate}</p>
                      <p className="text-[10px] text-slate-400 mt-1">
                        {t('Candles:', 'כניסת שבת:')} {sh.candleLighting} | {t('Havdalah:', 'צאת שבת:')} {sh.havdalah}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* City Selection with Interactive Map (Scenario 1 & 4) */}
              <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-amber-600" />
                      <span>{t('Shabbat Destination & Map *', 'יעד שבת ומפת ישראל *')}</span>
                    </label>

                    <button
                      type="button"
                      onClick={() => setShowMap(!showMap)}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 hover:text-amber-900 bg-amber-100/80 px-2 py-0.5 rounded-md cursor-pointer"
                    >
                      <MapIcon className="w-3 h-3" />
                      <span>{showMap ? t('Hide Map', 'הסתר מפה') : t('Show Map', 'הצג מפה')}</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsMultiCity(!isMultiCity)}
                    className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                  >
                    <span>{isMultiCity ? t('Single City', 'עיר אחת') : t('+ Request Multiple Cities (Scenario 4)', '+ בקש במספר ערים במקביל')}</span>
                  </button>
                </div>

                {/* Interactive Leaflet Map Component */}
                {showMap && (
                  <div className="space-y-1.5">
                    <IsraelMap
                      mode="picker"
                      selectedCity={selectedCity}
                      selectedCities={multiCities}
                      isMultiCity={isMultiCity}
                      onSelectCity={c => setSelectedCity(c)}
                      onToggleMultiCity={toggleMultiCity}
                      height="220px"
                    />
                    <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
                      <span>{t('Click any pin above to select/deselect your destination', 'לחצו על כל עיר במפה כדי לבחור את מיקום השבת')}</span>
                      {ISRAEL_CITIES_GEO[selectedCity] && !isMultiCity && (
                        <span className="font-semibold text-amber-800">
                          {selectedCity} ({ISRAEL_CITIES_GEO[selectedCity].hebrewName}) • {ISRAEL_CITIES_GEO[selectedCity].region}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {isMultiCity ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-[11px] text-slate-500">
                        {t(
                          'Selected destinations (linked request):',
                          'ערים שנבחרו (בקשה מקושרת):'
                        )}
                      </p>
                      <span className="text-[10px] font-bold bg-indigo-100 text-indigo-900 px-2 py-0.5 rounded-full">
                        {multiCities.length} {t('cities selected', 'ערים נבחרו')}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {['Jerusalem', 'Ashdod', 'Be\'er Sheva', 'Tel Aviv', 'Haifa', 'Beit Shemesh', 'Ra\'anana', 'Ariel', 'Safed'].map(city => (
                        <button
                          key={city}
                          type="button"
                          onClick={() => toggleMultiCity(city)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            multiCities.includes(city)
                              ? 'bg-indigo-600 text-white shadow-xs'
                              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          {city} {multiCities.includes(city) ? '✓' : '+'}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <select
                        value={selectedCity}
                        onChange={e => setSelectedCity(e.target.value)}
                        className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white outline-hidden cursor-pointer"
                      >
                        {ISRAELI_CITIES.map(city => (
                          <option key={city} value={city}>
                            {city} ({ISRAEL_CITIES_GEO[city]?.hebrewName || city})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <input
                        type="text"
                        value={preferredNeighborhood}
                        onChange={e => setPreferredNeighborhood(e.target.value)}
                        placeholder={t('Preferred neighborhood (optional)', 'שכונה מועדפת (אופציונלי)')}
                        className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white outline-hidden"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Number of Guests */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-amber-600" />
                    <span>{t('Number of Guests', 'מספר אורחים')}</span>
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4].map(num => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setGuestCount(num)}
                        className={`flex-1 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                          guestCount === num
                            ? 'bg-amber-600 text-white border-amber-600'
                            : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Need a place to sleep checkbox */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                    <Bed className="w-3.5 h-3.5 text-amber-600" />
                    <span>{t('Lodging Needed?', 'האם נדרשת לינה?')}</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setNeedsSleep(!needsSleep)}
                    className={`w-full py-1.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-between transition-colors cursor-pointer ${
                      needsSleep
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-900'
                        : 'border-slate-200 bg-white text-slate-600'
                    }`}
                  >
                    <span>{needsSleep ? t('Yes, I need a place to sleep', 'כן, זקוק/ה למיטת לינה') : t('No, meals only', 'לא, רק לארוחות')}</span>
                    <span className="text-sm">{needsSleep ? '🛏️' : '🍽️'}</span>
                  </button>
                </div>
              </div>

              {/* Meals requested */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Utensils className="w-3.5 h-3.5 text-amber-600" />
                  <span>{t('Meals Requested *', 'ארוחות מבוקשות *')}</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => toggleMeal('friday_dinner')}
                    className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                      meals.includes('friday_dinner')
                        ? 'border-amber-500 bg-amber-50/80 text-amber-950 font-bold'
                        : 'border-slate-200 bg-white text-slate-600'
                    }`}
                  >
                    <p className="text-xs">{t('Friday Dinner', 'סעודת ליל שבת')}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{meals.includes('friday_dinner') ? '✓' : ''}</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleMeal('shabbat_lunch')}
                    className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                      meals.includes('shabbat_lunch')
                        ? 'border-amber-500 bg-amber-50/80 text-amber-950 font-bold'
                        : 'border-slate-200 bg-white text-slate-600'
                    }`}
                  >
                    <p className="text-xs">{t('Shabbat Lunch', 'סעודת יום שבת')}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{meals.includes('shabbat_lunch') ? '✓' : ''}</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleMeal('seuda_shelishit')}
                    className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                      meals.includes('seuda_shelishit')
                        ? 'border-amber-500 bg-amber-50/80 text-amber-950 font-bold'
                        : 'border-slate-200 bg-white text-slate-600'
                    }`}
                  >
                    <p className="text-xs">{t('Seuda Shelishit', 'סעודה שלישית')}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{meals.includes('seuda_shelishit') ? '✓' : ''}</p>
                  </button>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsRequestModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  {t('Cancel', 'ביטול')}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 active:scale-95 text-white font-bold text-xs transition-all shadow-md shadow-amber-600/20 cursor-pointer"
                >
                  {t('Send Request to Host Families', 'שלח בקשה למשפחות מארחות')}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
