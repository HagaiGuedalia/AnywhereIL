export interface CityGeo {
  name: string;
  hebrewName: string;
  lat: number;
  lng: number;
  region: 'Jerusalem' | 'Central' | 'North' | 'South';
  descriptionEn: string;
  descriptionHe: string;
}

export const ISRAEL_CITIES_GEO: Record<string, CityGeo> = {
  Jerusalem: {
    name: 'Jerusalem',
    hebrewName: 'ירושלים',
    lat: 31.7683,
    lng: 35.2137,
    region: 'Jerusalem',
    descriptionEn: 'Holy city, vibrant Shabbat atmosphere, Katamon, Rechavia & Baka communities.',
    descriptionHe: 'עיר הקודש, אווירת שבת ייחודית, קהילות קטמון, רחביה ובקעה.',
  },
  'Tel Aviv': {
    name: 'Tel Aviv',
    hebrewName: 'תל אביב',
    lat: 32.0853,
    lng: 34.7818,
    region: 'Central',
    descriptionEn: 'Coastal metropolis, vibrant international community, Neve Tzedek & Old North.',
    descriptionHe: 'מרכז הארץ, קהילה בינלאומית, נווה צדק והצפון הישן.',
  },
  Haifa: {
    name: 'Haifa',
    hebrewName: 'חיפה',
    lat: 32.7940,
    lng: 34.9896,
    region: 'North',
    descriptionEn: 'Northern academic hub, Technion & University of Haifa, Carmel & Neve Sha\'anan.',
    descriptionHe: 'מוקד אקדמי צפוני, הטכניון ואונ׳ חיפה, מרכז הכרמל ונווה שאנן.',
  },
  'Beit Shemesh': {
    name: 'Beit Shemesh',
    hebrewName: 'בית שמש',
    lat: 31.7470,
    lng: 34.9881,
    region: 'Jerusalem',
    descriptionEn: 'Large Anglo-Israeli community in Ramat Beit Shemesh, welcoming host families.',
    descriptionHe: 'קהילה חמה של עולים וישראלים ברמת בית שמש ומשקפיים.',
  },
  'Be\'er Sheva': {
    name: 'Be\'er Sheva',
    hebrewName: 'באר שבע',
    lat: 31.2529,
    lng: 34.7915,
    region: 'South',
    descriptionEn: 'Capital of the Negev, Ben-Gurion University, IDF soldiers & student life.',
    descriptionHe: 'בירת הנגב, אונ׳ בן-גוריון, חיילים וסטודנטים.',
  },
  Ashdod: {
    name: 'Ashdod',
    hebrewName: 'אשדוד',
    lat: 31.8044,
    lng: 34.6553,
    region: 'South',
    descriptionEn: 'Mediterranean seaside city, Sephardic warmth, delicious traditional Shabbat tables.',
    descriptionHe: 'עיר חוף ים-תיכונית, הכנסת אורחים חמה וארוחות שבת עשירות.',
  },
  'Ra\'anana': {
    name: 'Ra\'anana',
    hebrewName: 'רעננה',
    lat: 32.1848,
    lng: 34.8713,
    region: 'Central',
    descriptionEn: 'Premier Sharon city with large English/French speaking community.',
    descriptionHe: 'עיר מובילה בשרון, קהילה דוברת אנגלית וצרפתית.',
  },
  'Modi\'in': {
    name: 'Modi\'in',
    hebrewName: 'מודיעין',
    lat: 31.8903,
    lng: 35.0104,
    region: 'Central',
    descriptionEn: 'Modern family-friendly city halfway between Jerusalem and Tel Aviv.',
    descriptionHe: 'עיר משפחתית מודרנית על ציר ירושלים-תל אביב.',
  },
  'Givat Shmuel': {
    name: 'Givat Shmuel',
    hebrewName: 'גבעת שמואל',
    lat: 32.0772,
    lng: 34.8465,
    region: 'Central',
    descriptionEn: 'Next to Bar-Ilan University, energetic young religious-academic scene.',
    descriptionHe: 'צמוד לאוניברסיטת בר-אילן, קהילת סטודנטים וצעירים.',
  },
  'Petah Tikva': {
    name: 'Petah Tikva',
    hebrewName: 'פתח תקווה',
    lat: 32.0840,
    lng: 34.8878,
    region: 'Central',
    descriptionEn: 'Central city with strong Dati Leumi & traditional neighborhoods (Kfar Ganim).',
    descriptionHe: 'מרכז הארץ, קהילת כפר גנים והדר גנים.',
  },
  Ariel: {
    name: 'Ariel',
    hebrewName: 'אריאל',
    lat: 32.1044,
    lng: 35.1744,
    region: 'Jerusalem',
    descriptionEn: 'Samaria university town, home to Ariel University and hundreds of Olim.',
    descriptionHe: 'עיר אוניברסיטאית בשומרון, ביתם של אלפי סטודנטים ועולים.',
  },
  Herzliya: {
    name: 'Herzliya',
    hebrewName: 'הרצליה',
    lat: 32.1663,
    lng: 34.8432,
    region: 'Central',
    descriptionEn: 'Reichman University (IDC), seaside Marina and young professionals.',
    descriptionHe: 'אוניברסיטת רייכמן (בינתחומי), מרינה וקהילה בינלאומית.',
  },
  Netanya: {
    name: 'Netanya',
    hebrewName: 'נתניה',
    lat: 32.3215,
    lng: 34.8532,
    region: 'Central',
    descriptionEn: 'Coastal city, large Francophone and Anglo community, Mediterranean vibe.',
    descriptionHe: 'עיר חוף, קהילה צרפתית ואנגלו-סקסית גדולה.',
  },
  Efrat: {
    name: 'Efrat',
    hebrewName: 'אפרת',
    lat: 31.6542,
    lng: 35.1524,
    region: 'Jerusalem',
    descriptionEn: 'Gush Etzion town with tight-knit communities, yeshivot, and beautiful views.',
    descriptionHe: 'גוש עציון, קהילה חמה, ישיבות ומדרשות.',
  },
  Safed: {
    name: 'Safed',
    hebrewName: 'צפת',
    lat: 32.9646,
    lng: 35.4960,
    region: 'North',
    descriptionEn: 'City of Kabbalah and mysticism in the Upper Galilee, spiritual Shabbat experience.',
    descriptionHe: 'עיר המקובלים בגליל העליון, אווירת שבת רוחנית וסמטאות עתיקות.',
  },
  'Kiryat Shmona': {
    name: 'Kiryat Shmona',
    hebrewName: 'קריית שמונה',
    lat: 33.2073,
    lng: 35.5701,
    region: 'North',
    descriptionEn: 'Northern Galilee hub near military bases and Tel Hai College.',
    descriptionHe: 'אצבע הגליל, מכללת תל-חי ובסיסי צה״ל.',
  },
  'Rishon LeZion': {
    name: 'Rishon LeZion',
    hebrewName: 'ראשון לציון',
    lat: 31.9730,
    lng: 34.7925,
    region: 'Central',
    descriptionEn: 'Large central city with rich heritage and warm traditional communities.',
    descriptionHe: 'עיר מרכזית גדולה עם קהילות מסורתיות ודתיות חמות.',
  },
  Rehovot: {
    name: 'Rehovot',
    hebrewName: 'רחובות',
    lat: 31.8928,
    lng: 34.8113,
    region: 'Central',
    descriptionEn: 'Weizmann Institute & Faculty of Agriculture, Anglo-Israeli science community.',
    descriptionHe: 'מכון ויצמן והפקולטה לחקלאות, קהילה מדעית ודתית.',
  },
};

export const DEFAULT_ISRAEL_CENTER: [number, number] = [31.88, 35.0];
export const DEFAULT_ISRAEL_ZOOM = 8;

export function getCityCoordinates(cityName?: string): [number, number] {
  if (!cityName) return [31.7683, 35.2137]; // default Jerusalem
  const found = ISRAEL_CITIES_GEO[cityName];
  if (found) return [found.lat, found.lng];

  // Partial search
  const key = Object.keys(ISRAEL_CITIES_GEO).find(k =>
    cityName.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(cityName.toLowerCase())
  );
  if (key) {
    const item = ISRAEL_CITIES_GEO[key];
    return [item.lat, item.lng];
  }

  return [31.7683, 35.2137];
}

// Haversine distance in kilometers
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}
