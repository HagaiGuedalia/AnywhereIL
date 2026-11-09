import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  FeedbackEntry,
  HostingRequest,
  HostProfile,
  SimulatedWhatsAppMessage,
  SupportTicket,
  UpcomingShabbat,
  User,
  UserRole,
} from '../types';
import {
  INITIAL_FEEDBACKS,
  INITIAL_HOST_PROFILES,
  INITIAL_REQUESTS,
  INITIAL_SUPPORT_TICKETS,
  INITIAL_USERS,
  UPCOMING_SHABBATOT,
} from '../data/initialData';

interface AppContextType {
  currentUser: User | null;
  users: User[];
  hostProfiles: HostProfile[];
  requests: HostingRequest[];
  feedbacks: FeedbackEntry[];
  supportTickets: SupportTicket[];
  upcomingShabbatot: UpcomingShabbat[];
  whatsappQueue: SimulatedWhatsAppMessage[];
  activeWhatsAppMessage: SimulatedWhatsAppMessage | null;
  
  lang: 'en' | 'he';
  setLang: (lang: 'en' | 'he') => void;
  t: (enText: string, heText: string) => string;

  activeScreen: string;
  setActiveScreen: (screen: string) => void;

  // Active Modals
  isSignInOpen: boolean;
  setIsSignInOpen: (open: boolean) => void;
  isGuestRegOpen: boolean;
  setIsGuestRegOpen: (open: boolean) => void;
  isRequestModalOpen: boolean;
  setIsRequestModalOpen: (open: boolean) => void;
  isHostAppModalOpen: boolean;
  setIsHostAppModalOpen: (open: boolean) => void;
  isFeedbackModalOpen: boolean;
  setIsFeedbackModalOpen: (open: boolean) => void;
  isCompleteDetailsOpen: boolean;
  setIsCompleteDetailsOpen: (open: boolean) => void;
  isSupportModalOpen: boolean;
  setIsSupportModalOpen: (open: boolean) => void;
  selectedRequest: HostingRequest | null;
  setSelectedRequest: (req: HostingRequest | null) => void;
  feedbackTargetRequest: HostingRequest | null;
  setFeedbackTargetRequest: (req: HostingRequest | null) => void;

  // Role & Persona Switcher
  switchPersona: (personaKey: 'noa' | 'cohen' | 'levi' | 'yossi' | 'sharon' | 'dana' | 'new_guest') => void;
  loginAs: (user: User) => void;
  logout: () => void;

  // Scenario 1-5 Quick Launchers
  startScenario: (scenarioNumber: 1 | 2 | 3 | 4 | 5) => void;

  // Actions
  createHostingRequest: (data: Partial<HostingRequest> & { cities: string[] }) => void;
  acceptRequestAsHost: (requestId: string, hostProfileId: string) => void;
  cancelRequest: (requestId: string, reason?: string) => void;
  reopenRequest: (requestId: string) => void;
  hideRequest: (requestId: string) => void;
  
  // Host management
  approveHost: (hostId: string) => void;
  rejectHost: (hostId: string, reason: string) => void;
  updateHostWhatsApp: (hostId: string, whatsappNumber: string, optIn: boolean) => void;
  submitHostApplication: (data: any) => void;

  // Guest updates
  registerGuest: (data: Partial<User>) => void;

  // Feedback & Support
  submitFeedback: (data: Omit<FeedbackEntry, 'id' | 'createdAt'>) => void;
  resolveTicket: (ticketId: string, reply: string) => void;
  createSupportTicket: (subject: string, message: string) => void;

  // WhatsApp simulation modal
  openWhatsAppSimulator: (msg: SimulatedWhatsAppMessage) => void;
  closeWhatsAppSimulator: () => void;
  dismissWhatsAppToast: (id: string) => void;

  // Reset
  resetAllData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = 'bayit_cham_state_v1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<'en' | 'he'>('en');
  const [activeScreen, setActiveScreen] = useState<string>('home');

  // Modals
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isGuestRegOpen, setIsGuestRegOpen] = useState(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isHostAppModalOpen, setIsHostAppModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [isCompleteDetailsOpen, setIsCompleteDetailsOpen] = useState(false);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<HostingRequest | null>(null);
  const [feedbackTargetRequest, setFeedbackTargetRequest] = useState<HostingRequest | null>(null);

  // Core collections
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_users`);
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_currentUser`);
    return saved ? JSON.parse(saved) : INITIAL_USERS[0]; // Default Noa
  });

  const [hostProfiles, setHostProfiles] = useState<HostProfile[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_hosts`);
    return saved ? JSON.parse(saved) : INITIAL_HOST_PROFILES;
  });

  const [requests, setRequests] = useState<HostingRequest[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_requests`);
    return saved ? JSON.parse(saved) : INITIAL_REQUESTS;
  });

  const [feedbacks, setFeedbacks] = useState<FeedbackEntry[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_feedbacks`);
    return saved ? JSON.parse(saved) : INITIAL_FEEDBACKS;
  });

  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_tickets`);
    return saved ? JSON.parse(saved) : INITIAL_SUPPORT_TICKETS;
  });

  const [upcomingShabbatot] = useState<UpcomingShabbat[]>(UPCOMING_SHABBATOT);

  // WhatsApp simulation
  const [whatsappQueue, setWhatsappQueue] = useState<SimulatedWhatsAppMessage[]>([]);
  const [activeWhatsAppMessage, setActiveWhatsAppMessage] = useState<SimulatedWhatsAppMessage | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_users`, JSON.stringify(users));
  }, [users]);
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_currentUser`, JSON.stringify(currentUser));
  }, [currentUser]);
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_hosts`, JSON.stringify(hostProfiles));
  }, [hostProfiles]);
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_requests`, JSON.stringify(requests));
  }, [requests]);
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_feedbacks`, JSON.stringify(feedbacks));
  }, [feedbacks]);
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_tickets`, JSON.stringify(supportTickets));
  }, [supportTickets]);

  // Sync dir attribute on body for RTL
  useEffect(() => {
    document.documentElement.dir = lang === 'he' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  const t = (enText: string, heText: string) => (lang === 'he' ? heText : enText);

  // Switch persona
  const switchPersona = (personaKey: 'noa' | 'cohen' | 'levi' | 'yossi' | 'sharon' | 'dana' | 'new_guest') => {
    if (personaKey === 'new_guest') {
      const newUser: User = {
        id: `user-guest-${Date.now()}`,
        name: 'New Guest',
        email: 'guest.new@gmail.com',
        phone: '',
        role: 'guest',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
        createdAt: new Date().toISOString(),
      };
      setCurrentUser(newUser);
      setActiveScreen('home');
      setIsGuestRegOpen(true);
      return;
    }

    const keyMap: Record<string, string> = {
      noa: 'user-noa',
      cohen: 'user-cohen',
      levi: 'user-levi',
      yossi: 'user-yossi',
      sharon: 'user-sharon',
      dana: 'user-dana',
    };

    const targetUser = users.find(u => u.id === keyMap[personaKey]);
    if (targetUser) {
      setCurrentUser(targetUser);
      if (targetUser.role === 'admin') {
        setActiveScreen('admin-dashboard');
      } else if (targetUser.role === 'host') {
        setActiveScreen('host-dashboard');
      } else {
        setActiveScreen('my-requests');
      }
    }
  };

  const loginAs = (user: User) => {
    setCurrentUser(user);
    setIsSignInOpen(false);
    if (user.role === 'admin') setActiveScreen('admin-dashboard');
    else if (user.role === 'host') setActiveScreen('host-dashboard');
    else setActiveScreen('my-requests');
  };

  const logout = () => {
    setCurrentUser(null);
    setActiveScreen('home');
  };

  // Scenario Launcher
  const startScenario = (scenarioNum: 1 | 2 | 3 | 4 | 5) => {
    switch (scenarioNum) {
      case 1: {
        // Scenario 1: Noa requests hosting & finds a family
        const noa = users.find(u => u.id === 'user-noa') || INITIAL_USERS[0];
        setCurrentUser(noa);
        setActiveScreen('home');
        setIsRequestModalOpen(true);
        break;
      }
      case 2: {
        // Scenario 2: Levi family joins as hosts
        const levi = users.find(u => u.id === 'user-levi') || INITIAL_USERS[2];
        setCurrentUser(levi);
        const hostProfile = hostProfiles.find(h => h.userId === levi.id);
        if (!hostProfile || !hostProfile.isApproved) {
          setActiveScreen('host-profile');
        } else {
          setActiveScreen('host-dashboard');
        }
        break;
      }
      case 3: {
        // Scenario 3: Cohen family gets notification & chooses a guest
        const cohen = users.find(u => u.id === 'user-cohen') || INITIAL_USERS[1];
        setCurrentUser(cohen);
        setActiveScreen('host-dashboard');
        // Trigger a WhatsApp notification simulation toast
        const newMsg: SimulatedWhatsAppMessage = {
          id: `wa-notif-${Date.now()}`,
          recipientPhone: cohen.phone,
          recipientName: 'The Cohen Family',
          senderName: 'Bayit Cham Shabbat Network',
          messageText: '✨ Shalom Cohen Family! There are 2 new hosting requests in Jerusalem for Parashat Toldot. Click below to review match scores and accept.',
          timestamp: 'Just now',
          actionUrl: 'host-dashboard',
          actionLabel: 'Open Host Dashboard',
          relatedRequestId: 'req-noa-jerusalem',
        };
        setWhatsappQueue(prev => [newMsg, ...prev]);
        break;
      }
      case 4: {
        // Scenario 4: Lone soldier Yossi requests hosting in several cities & cancels
        const yossi = users.find(u => u.id === 'user-yossi') || INITIAL_USERS[3];
        setCurrentUser(yossi);
        setActiveScreen('my-requests');
        break;
      }
      case 5: {
        // Scenario 5: Dana admin monitors the system, Haifa shortage, feedback review
        const dana = users.find(u => u.id === 'user-dana') || INITIAL_USERS[5];
        setCurrentUser(dana);
        setActiveScreen('admin-dashboard');
        break;
      }
    }
  };

  // Create Hosting Request (supports single or multiple cities)
  const createHostingRequest = (data: Partial<HostingRequest> & { cities: string[] }) => {
    if (!currentUser) return;

    const cities = data.cities && data.cities.length > 0 ? data.cities : [data.city || 'Jerusalem'];
    const groupId = cities.length > 1 ? `group-${Date.now()}` : undefined;
    const shabbat = upcomingShabbatot.find(s => s.id === data.shabbatId) || upcomingShabbatot[0];

    const newReqs: HostingRequest[] = cities.map((city, idx) => ({
      id: `req-${Date.now()}-${idx}`,
      groupId,
      guestId: currentUser.id,
      guestName: currentUser.name,
      guestPhone: currentUser.phone,
      guestAvatar: currentUser.avatar,
      guestType: currentUser.guestType || 'student',
      gender: currentUser.gender || 'other',
      institution: currentUser.institution || 'Ariel University',
      observance: currentUser.observance || 'Dati Leumi',
      allergies: currentUser.allergies || 'None',
      about: currentUser.bio || data.about || 'Shabbat guest looking for warm hosting.',
      languages: currentUser.languages || ['Hebrew', 'English'],
      shabbatId: shabbat.id,
      shabbatHebrewName: shabbat.hebrewName,
      shabbatGregorian: shabbat.gregorianDate,
      city,
      preferredNeighborhood: data.preferredNeighborhood || 'Central',
      linkedCities: cities.length > 1 ? cities : undefined,
      guestCount: data.guestCount || 1,
      mealsRequested: data.mealsRequested || ['friday_dinner', 'shabbat_lunch'],
      needsSleep: data.needsSleep ?? true,
      status: 'open',
      createdAt: new Date().toISOString(),
      expiresAt: '2026-11-06T12:00:00Z',
      notificationLogs: [
        {
          hostId: 'host-cohen',
          hostName: 'The Cohen Family',
          channel: 'whatsapp',
          delivered: true,
          read: true,
          sentAt: new Date().toISOString(),
        },
      ],
    }));

    setRequests(prev => [...newReqs, ...prev]);
    setIsRequestModalOpen(false);
    setActiveScreen('my-requests');

    // Send simulation notification to matching hosts
    const matchingHosts = hostProfiles.filter(h => cities.includes(h.city));
    if (matchingHosts.length > 0) {
      const host = matchingHosts[0];
      const newMsg: SimulatedWhatsAppMessage = {
        id: `wa-${Date.now()}`,
        recipientPhone: host.whatsappNumber || host.userId,
        recipientName: host.familyName,
        senderName: 'Bayit Cham Network',
        messageText: `Shalom ${host.familyName}! A new hosting request was just posted for ${shabbat.hebrewName} in ${host.city} by ${currentUser.name}.`,
        timestamp: 'Just now',
        actionLabel: 'Review in Dashboard',
        actionUrl: 'host-dashboard',
      };
      setWhatsappQueue(prev => [newMsg, ...prev]);
    }
  };

  // Host accepts guest
  const acceptRequestAsHost = (requestId: string, hostProfileId: string) => {
    const host = hostProfiles.find(h => h.id === hostProfileId);
    if (!host) return;

    setRequests(prev => {
      const target = prev.find(r => r.id === requestId);
      if (!target) return prev;

      return prev.map(req => {
        // Target request becomes host_found
        if (req.id === requestId) {
          return {
            ...req,
            status: 'host_found',
            matchedHostId: host.id,
            matchedHostName: host.familyName,
            matchedHostPhone: host.whatsappNumber || '+972-54-319-8765',
            matchedHostAddress: host.contactAddress || `${host.neighborhood}, ${host.city}`,
            matchedAt: new Date().toISOString(),
          };
        }
        // Scenario 4: If this request had linked cities in the same group, automatically close them!
        if (target.groupId && req.groupId === target.groupId && req.id !== requestId) {
          return {
            ...req,
            status: 'closed_linked',
            matchedHostName: `${host.familyName} (${host.city})`,
          };
        }
        return req;
      });
    });

    // Notify guest on WhatsApp
    const target = requests.find(r => r.id === requestId);
    if (target) {
      const waMsg: SimulatedWhatsAppMessage = {
        id: `wa-guest-${Date.now()}`,
        recipientPhone: target.guestPhone,
        recipientName: target.guestName,
        senderName: 'Bayit Cham Shabbat Network',
        messageText: `Mazal Tov ${target.guestName}! ${host.familyName} in ${host.city} has accepted your hosting request for ${target.shabbatHebrewName}. Their address is ${host.contactAddress || host.city}. Have a wonderful Shabbat!`,
        timestamp: 'Just now',
        actionLabel: 'View Host Details',
        actionUrl: 'my-requests',
      };
      setWhatsappQueue(prev => [waMsg, ...prev]);
    }
  };

  // Guest or Host cancels
  const cancelRequest = (requestId: string, reason?: string) => {
    const target = requests.find(r => r.id === requestId);
    if (!target) return;

    setRequests(prev =>
      prev.map(r => {
        if (r.id === requestId) {
          return {
            ...r,
            status: 'cancelled',
            cancelledBy: currentUser?.role === 'host' ? 'host' : 'guest',
            cancellationReason: reason || 'Plans changed',
          };
        }
        return r;
      })
    );

    // Scenario 4: Notify host that guest had to cancel!
    if (target.matchedHostId) {
      const host = hostProfiles.find(h => h.id === target.matchedHostId);
      if (host) {
        const waMsg: SimulatedWhatsAppMessage = {
          id: `wa-cancel-${Date.now()}`,
          recipientPhone: host.whatsappNumber || '+972-54-482-1980',
          recipientName: host.familyName,
          senderName: 'Bayit Cham Network',
          messageText: `Notice: ${target.guestName} had to cancel their hosting request for ${target.shabbatHebrewName} (Reason: ${reason || 'Must remain on army base'}). Your hosting slot has been freed.`,
          timestamp: 'Just now',
          actionLabel: 'Open Host Schedule',
          actionUrl: 'host-schedule',
        };
        setWhatsappQueue(prev => [waMsg, ...prev]);
      }
    }
  };

  // Reopen cancelled request
  const reopenRequest = (requestId: string) => {
    setRequests(prev =>
      prev.map(r => {
        if (r.id === requestId) {
          return {
            ...r,
            status: 'open',
            matchedHostId: undefined,
            matchedHostName: undefined,
            matchedHostPhone: undefined,
            matchedHostAddress: undefined,
            cancelledBy: undefined,
            cancellationReason: undefined,
          };
        }
        return r;
      })
    );
  };

  // Hide request for this host
  const hideRequest = (requestId: string) => {
    if (!currentUser) return;
    const host = hostProfiles.find(h => h.userId === currentUser.id);
    if (!host) return;

    setRequests(prev =>
      prev.map(r => {
        if (r.id === requestId) {
          const hidden = r.hiddenByHostIds || [];
          return {
            ...r,
            hiddenByHostIds: [...hidden, host.id],
          };
        }
        return r;
      })
    );
  };

  // Admin approves host application (Scenario 2 & 5)
  const approveHost = (hostId: string) => {
    setHostProfiles(prev =>
      prev.map(h => {
        if (h.id === hostId) {
          return {
            ...h,
            isApproved: true,
            approvalStatus: 'approved',
          };
        }
        return h;
      })
    );

    // Switch applicant's user role to 'host'
    const host = hostProfiles.find(h => h.id === hostId);
    if (host) {
      setUsers(prev =>
        prev.map(u => (u.id === host.userId ? { ...u, role: 'host' as UserRole } : u))
      );
      if (currentUser?.id === host.userId) {
        setCurrentUser(prev => (prev ? { ...prev, role: 'host' } : null));
      }

      // Notify host via simulated email / WhatsApp
      const waMsg: SimulatedWhatsAppMessage = {
        id: `wa-approved-${Date.now()}`,
        recipientPhone: host.whatsappNumber || '+972-50-664-9218',
        recipientName: host.familyName,
        senderName: 'Bayit Cham Team',
        messageText: `🎉 Shalom ${host.familyName}! Your application to become a host family has been approved by Dana, our national coordinator. You can now receive and accept Shabbat hosting requests!`,
        timestamp: 'Just now',
        actionLabel: 'Go to Host Dashboard',
        actionUrl: 'host-dashboard',
      };
      setWhatsappQueue(prev => [waMsg, ...prev]);
    }
  };

  // Admin rejects host
  const rejectHost = (hostId: string, reason: string) => {
    setHostProfiles(prev =>
      prev.map(h => {
        if (h.id === hostId) {
          return {
            ...h,
            isApproved: false,
            approvalStatus: 'rejected',
            rejectionReason: reason,
          };
        }
        return h;
      })
    );
  };

  // Complete WhatsApp details (Scenario 2 Dialog)
  const updateHostWhatsApp = (hostId: string, whatsappNumber: string, optIn: boolean) => {
    setHostProfiles(prev =>
      prev.map(h => {
        if (h.id === hostId) {
          return {
            ...h,
            whatsappNumber,
            isWhatsappOptedIn: optIn,
          };
        }
        return h;
      })
    );
    if (currentUser) {
      setCurrentUser(prev => (prev ? { ...prev, whatsappNumber, isWhatsappOptedIn: optIn } : null));
    }
    setIsCompleteDetailsOpen(false);
  };

  // Submit Host Application (Scenario 2)
  const submitHostApplication = (data: any) => {
    if (!currentUser) return;

    const newHost: HostProfile = {
      id: `host-${Date.now()}`,
      userId: currentUser.id,
      familyName: data.familyName || `${currentUser.name}'s Family`,
      city: data.city || 'Beit Shemesh',
      neighborhood: data.neighborhood || 'Central',
      numberOfChildren: Number(data.numberOfChildren) || 0,
      observance: data.observance || 'Dati Leumi',
      englishLevel: data.englishLevel || 'Fluent',
      languages: data.languages || ['Hebrew', 'English'],
      maxGuests: Number(data.maxGuests) || 2,
      mealsOffered: data.mealsOffered || ['friday_dinner', 'shabbat_lunch'],
      canSleep: Boolean(data.canSleep),
      sleepingDetails: data.sleepingDetails || 'Guest bed available',
      about: data.about || 'We love hosting Shabbat guests!',
      familyPhoto: data.familyPhoto || currentUser.avatar,
      whatsappNumber: data.whatsappNumber || '',
      isWhatsappOptedIn: Boolean(data.isWhatsappOptedIn),
      isApproved: false, // Pending admin approval (Scenario 2)
      approvalStatus: 'pending',
      rating: 5.0,
      hostingsCount: 0,
      contactAddress: data.contactAddress || `${data.neighborhood || ''}, ${data.city || ''}`,
    };

    setHostProfiles(prev => [newHost, ...prev]);
    setIsHostAppModalOpen(false);
    setActiveScreen('host-profile');
  };

  // Register Guest
  const registerGuest = (data: Partial<User>) => {
    if (!currentUser) return;
    const updatedUser: User = {
      ...currentUser,
      ...data,
      role: 'guest',
    };
    setCurrentUser(updatedUser);
    setUsers(prev => prev.map(u => (u.id === updatedUser.id ? updatedUser : u)));
    setIsGuestRegOpen(false);
    // Continue straight to hosting request form as per Scenario 1!
    setIsRequestModalOpen(true);
  };

  // Submit Feedback
  const submitFeedback = (data: Omit<FeedbackEntry, 'id' | 'createdAt'>) => {
    const newEntry: FeedbackEntry = {
      ...data,
      id: `feed-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setFeedbacks(prev => [newEntry, ...prev]);

    // Mark request as feedback completed
    setRequests(prev =>
      prev.map(r => (r.id === data.requestId ? { ...r, feedbackCompleted: true } : r))
    );
    setIsFeedbackModalOpen(false);
  };

  // Resolve Ticket
  const resolveTicket = (ticketId: string, reply: string) => {
    setSupportTickets(prev =>
      prev.map(t => (t.id === ticketId ? { ...t, status: 'resolved', reply } : t))
    );
  };

  const createSupportTicket = (subject: string, message: string) => {
    if (!currentUser) return;
    const ticket: SupportTicket = {
      id: `ticket-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userEmail: currentUser.email,
      userRole: currentUser.role,
      subject,
      message,
      status: 'open',
      createdAt: new Date().toISOString(),
    };
    setSupportTickets(prev => [ticket, ...prev]);
    setIsSupportModalOpen(false);
  };

  // WhatsApp simulation modal
  const openWhatsAppSimulator = (msg: SimulatedWhatsAppMessage) => {
    setActiveWhatsAppMessage(msg);
  };

  const closeWhatsAppSimulator = () => {
    setActiveWhatsAppMessage(null);
  };

  const dismissWhatsAppToast = (id: string) => {
    setWhatsappQueue(prev => prev.filter(m => m.id !== id));
  };

  // Reset to initial
  const resetAllData = () => {
    localStorage.removeItem(`${STORAGE_KEY}_users`);
    localStorage.removeItem(`${STORAGE_KEY}_currentUser`);
    localStorage.removeItem(`${STORAGE_KEY}_hosts`);
    localStorage.removeItem(`${STORAGE_KEY}_requests`);
    localStorage.removeItem(`${STORAGE_KEY}_feedbacks`);
    localStorage.removeItem(`${STORAGE_KEY}_tickets`);
    setUsers(INITIAL_USERS);
    setCurrentUser(INITIAL_USERS[0]);
    setHostProfiles(INITIAL_HOST_PROFILES);
    setRequests(INITIAL_REQUESTS);
    setFeedbacks(INITIAL_FEEDBACKS);
    setSupportTickets(INITIAL_SUPPORT_TICKETS);
    setWhatsappQueue([]);
    setActiveWhatsAppMessage(null);
    setActiveScreen('home');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        hostProfiles,
        requests,
        feedbacks,
        supportTickets,
        upcomingShabbatot,
        whatsappQueue,
        activeWhatsAppMessage,
        lang,
        setLang,
        t,
        activeScreen,
        setActiveScreen,
        isSignInOpen,
        setIsSignInOpen,
        isGuestRegOpen,
        setIsGuestRegOpen,
        isRequestModalOpen,
        setIsRequestModalOpen,
        isHostAppModalOpen,
        setIsHostAppModalOpen,
        isFeedbackModalOpen,
        setIsFeedbackModalOpen,
        isCompleteDetailsOpen,
        setIsCompleteDetailsOpen,
        isSupportModalOpen,
        setIsSupportModalOpen,
        selectedRequest,
        setSelectedRequest,
        feedbackTargetRequest,
        setFeedbackTargetRequest,
        switchPersona,
        loginAs,
        logout,
        startScenario,
        createHostingRequest,
        acceptRequestAsHost,
        cancelRequest,
        reopenRequest,
        hideRequest,
        approveHost,
        rejectHost,
        updateHostWhatsApp,
        submitHostApplication,
        registerGuest,
        submitFeedback,
        resolveTicket,
        createSupportTicket,
        openWhatsAppSimulator,
        closeWhatsAppSimulator,
        dismissWhatsAppToast,
        resetAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
