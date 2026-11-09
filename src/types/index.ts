export type UserRole = 'guest' | 'host' | 'admin';

export type ReligiousObservance =
  | 'Dati Leumi'
  | 'Masorti'
  | 'Charedi'
  | 'Modern Orthodox'
  | 'Traditional'
  | 'Secular'
  | 'Chabad';

export type GuestType = 'student' | 'lone_soldier' | 'oleh' | 'visitor';

export type MealType = 'friday_dinner' | 'shabbat_lunch' | 'seuda_shelishit';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  whatsappNumber?: string;
  isWhatsappOptedIn?: boolean;
  role: UserRole;
  avatar: string;
  bio?: string;
  city?: string;
  observance?: ReligiousObservance;
  institution?: string;
  guestType?: GuestType;
  allergies?: string;
  languages?: string[];
  gender?: 'female' | 'male' | 'other';
  createdAt: string;
}

export interface UpcomingShabbat {
  id: string;
  hebrewName: string; // e.g. "פרשת תולדות"
  hebrewDate: string; // e.g. "כ״ח בחשון תשפ״ז"
  gregorianDate: string; // e.g. "Nov 7-8, 2026"
  candleLighting: string; // e.g. "16:24"
  havdalah: string; // e.g. "17:38"
  isHoliday?: boolean;
  holidayName?: string; // e.g. "פסח - ליל הסדר"
  isPassed?: boolean;
  isComingShabbat?: boolean;
}

export interface HostProfile {
  id: string;
  userId: string;
  familyName: string;
  city: string;
  neighborhood: string;
  numberOfChildren: number;
  observance: ReligiousObservance;
  englishLevel: 'Native' | 'Fluent' | 'Conversational' | 'Basic';
  languages: string[];
  maxGuests: number;
  mealsOffered: MealType[];
  canSleep: boolean;
  sleepingDetails?: string;
  about: string;
  familyPhoto: string;
  whatsappNumber: string;
  isWhatsappOptedIn: boolean;
  isApproved: boolean; // Dana admin approval status
  approvalStatus: 'approved' | 'pending' | 'rejected';
  rejectionReason?: string;
  rating: number;
  hostingsCount: number;
  contactAddress?: string;
}

export interface NotificationLog {
  hostId: string;
  hostName: string;
  channel: 'whatsapp' | 'email';
  delivered: boolean;
  read: boolean;
  sentAt: string;
}

export interface HostingRequest {
  id: string;
  groupId?: string; // For linked multi-city requests (Scenario 4)
  guestId: string;
  guestName: string;
  guestPhone: string;
  guestAvatar: string;
  guestType: GuestType;
  gender: 'female' | 'male' | 'other';
  institution: string;
  observance: ReligiousObservance;
  allergies: string;
  about: string;
  languages: string[];
  
  shabbatId: string;
  shabbatHebrewName: string;
  shabbatGregorian: string;
  
  city: string;
  preferredNeighborhood?: string;
  linkedCities?: string[]; // Multiple cities requested
  
  guestCount: number;
  mealsRequested: MealType[];
  needsSleep: boolean;
  
  status: 'open' | 'host_found' | 'expired' | 'cancelled' | 'closed_linked';
  matchedHostId?: string;
  matchedHostName?: string;
  matchedHostPhone?: string;
  matchedHostAddress?: string;
  matchedAt?: string;
  
  cancelledBy?: 'guest' | 'host';
  cancellationReason?: string;
  
  createdAt: string;
  expiresAt: string;
  
  hiddenByHostIds?: string[]; // Hosts who hid this request
  notificationLogs?: NotificationLog[];
  feedbackCompleted?: boolean;
}

export interface FeedbackEntry {
  id: string;
  requestId: string;
  shabbatName: string;
  reviewerId: string;
  reviewerName: string;
  reviewerRole: 'guest' | 'host';
  targetName: string;
  rating: number; // 1 to 5
  comment: string;
  contactPromptness: 'early_week' | 'thursday' | 'friday_morning' | 'late_friday';
  city: string;
  createdAt: string;
}

export interface SupportTicket {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userRole: UserRole;
  subject: string;
  message: string;
  status: 'open' | 'resolved';
  reply?: string;
  createdAt: string;
}

export interface SimulatedWhatsAppMessage {
  id: string;
  recipientPhone: string;
  recipientName: string;
  senderName: string;
  messageText: string;
  timestamp: string;
  actionUrl?: string;
  actionLabel?: string;
  relatedRequestId?: string;
}
