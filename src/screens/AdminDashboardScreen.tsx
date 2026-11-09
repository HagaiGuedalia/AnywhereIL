import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FeedbackEntry, HostingRequest, HostProfile } from '../types';
import {
  ShieldCheck,
  AlertTriangle,
  Users,
  CheckCircle2,
  Clock,
  Sparkles,
  Download,
  Filter,
  Phone,
  MessageSquare,
  Search,
  Check,
  X,
  FileSpreadsheet,
  Send,
  Loader2,
  ExternalLink,
  Info,
  MapPin,
  Map as MapIcon,
  LayoutGrid,
} from 'lucide-react';
import { IsraelMap } from '../components/IsraelMap';

export const AdminDashboardScreen: React.FC = () => {
  const {
    requests,
    hostProfiles,
    supportTickets,
    feedbacks,
    approveHost,
    rejectHost,
    resolveTicket,
    openWhatsAppSimulator,
    t,
    lang,
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    'requests' | 'applications' | 'hosts' | 'support' | 'stats' | 'feedback'
  >('requests');

  // Filters for Requests Dashboard (Scenario 5, step 1)
  const [requestStatusFilter, setRequestStatusFilter] = useState<'all' | 'open' | 'host_found' | 'expired'>('open');
  const [requestCityFilter, setRequestCityFilter] = useState<string>('all');
  const [selectedRequestDetails, setSelectedRequestDetails] = useState<HostingRequest | null>(null);
  const [adminViewMode, setAdminViewMode] = useState<'table' | 'map'>('table');

  // Manage hosts filter (Scenario 5, step 3)
  const [hostCityFilter, setHostCityFilter] = useState<string>('Haifa');

  // Support ticket reply state (Scenario 5, step 4)
  const [ticketReplyText, setTicketReplyText] = useState('');
  const [replyingTicketId, setReplyingTicketId] = useState<string | null>(null);

  // AI Feedback Summary state (Scenario 5, step 6)
  const [isSummarizingAi, setIsSummarizingAi] = useState(false);
  const [aiSummaryData, setAiSummaryData] = useState<{
    sentimentScore: number;
    summary: string;
    keyHighlights: string[];
    actionItems: string[];
  } | null>(null);

  // Haifa shortage check (Scenario 5, step 1)
  const haifaOpenCount = requests.filter(r => r.city === 'Haifa' && r.status === 'open').length;

  // Filtered requests
  const filteredRequests = requests.filter(r => {
    if (requestStatusFilter !== 'all' && r.status !== requestStatusFilter) return false;
    if (requestCityFilter !== 'all' && r.city !== requestCityFilter) return false;
    return true;
  });

  // Filtered hosts
  const filteredHosts = hostProfiles.filter(h => {
    if (hostCityFilter !== 'all' && h.city !== hostCityFilter) return false;
    return true;
  });

  // Pending applications
  const pendingApplications = hostProfiles.filter(h => h.approvalStatus === 'pending');

  // Trigger AI Feedback Summarizer
  const handleRunAiFeedbackSummary = async () => {
    setIsSummarizingAi(true);
    try {
      const res = await fetch('/api/ai/feedback-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviews: feedbacks, lang }),
      });
      const data = await res.json();
      setAiSummaryData(data);
    } catch (err) {
      console.error('Feedback summary error:', err);
    } finally {
      setIsSummarizingAi(false);
    }
  };

  // Export to Excel / CSV (Scenario 5, step 7)
  const handleExportCSV = () => {
    const headers = ['Request ID', 'Guest Name', 'Institution', 'City', 'Status', 'Matched Host', 'Meals', 'Lodging', 'Created At'];
    const rows = requests.map(r => [
      r.id,
      `"${r.guestName}"`,
      `"${r.institution}"`,
      `"${r.city}"`,
      r.status,
      `"${r.matchedHostName || 'None'}"`,
      r.mealsRequested.length,
      r.needsSleep ? 'Yes' : 'No',
      r.createdAt,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Bayit_Cham_Monthly_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-700">
              {t('National Administration • Dana Alon', 'הנהלת המערכת הארצית • דנה אלון')}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-900 text-[10px] font-black">
              {t('HQ Control', 'מטה')}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {t('System Operations & Monitoring', 'לוח ניהול ובקרה ארצי')}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {t('Ensure every guest finds a Shabbat family, resolve support inquiries, and analyze service performance', 'מעקב שוטף לקראת שבת, אישור משפחות מארחות, טיפול בפניות וניתוח משוב')}
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
          <span>{t('Export to Excel / CSV', 'ייצוא נתונים לאקסל')}</span>
        </button>
      </div>

      {/* Haifa Shortage Alert (Scenario 5, step 1) */}
      {haifaOpenCount > 0 && (
        <div className="p-4 sm:p-5 rounded-3xl bg-amber-500/15 border-2 border-amber-400 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in duration-300">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded-full">
                {t('Scenario 5 Alert: Shortage Detected', 'תרחיש 5: התראת מחסור מארחים')}
              </span>
              <h3 className="text-sm sm:text-base font-extrabold text-amber-950 mt-1">
                {t(`Haifa Shortage: ${haifaOpenCount} requests waiting with only 2 active hosts!`, `מחסור בחיפה: ${haifaOpenCount} בקשות פתוחות לשבת הקרובה מול 2 משפחות פעילות בלבד!`)}
              </h3>
              <p className="text-xs text-amber-900 mt-0.5">
                {t('Thursday before Shabbat: Recommend calling local families in Neve Sha\'anan and Central Carmel.', 'יום חמישי לפני שבת: מומלץ ליצור קשר ישיר עם המשפחות בחיפה לגיוס עזרה.')}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setActiveTab('hosts');
              setHostCityFilter('Haifa');
            }}
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm cursor-pointer shrink-0"
          >
            {t('Manage Haifa Hosts →', 'צפה במארחים בחיפה ←')}
          </button>
        </div>
      )}

      {/* Admin Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-2xl bg-slate-100 border border-slate-200/80">
        {[
          { key: 'requests' as const, labelEn: '1. Requests Dashboard', labelHe: '1. לוח בקשות' },
          { key: 'applications' as const, labelEn: `2. Host Applications (${pendingApplications.length})`, labelHe: `2. בקשות הצטרפות (${pendingApplications.length})` },
          { key: 'hosts' as const, labelEn: '3. Manage Hosts', labelHe: '3. ניהול מארחים' },
          { key: 'support' as const, labelEn: `4. Support Inbox (${supportTickets.filter(t => t.status === 'open').length})`, labelHe: `4. פניות תמיכה (${supportTickets.filter(t => t.status === 'open').length})` },
          { key: 'stats' as const, labelEn: '5. Statistics', labelHe: '5. סטטיסטיקה' },
          { key: 'feedback' as const, labelEn: '6. AI Feedback Review', labelHe: '6. משוב וסיכום AI' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === tab.key
                ? 'bg-white text-purple-950 shadow-xs border border-slate-200/60'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            {t(tab.labelEn, tab.labelHe)}
          </button>
        ))}
      </div>

      {/* TAB 1: Requests Dashboard & Shortage Alert (Scenario 5, step 1 & 2) */}
      {activeTab === 'requests' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-700">{t('Status:', 'סטטוס:')}</span>
                <select
                  value={requestStatusFilter}
                  onChange={e => setRequestStatusFilter(e.target.value as any)}
                  className="text-xs px-2.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50 font-medium outline-hidden cursor-pointer"
                >
                  <option value="all">{t('All Statuses', 'כל הסטטוסים')}</option>
                  <option value="open">{t('Open Only', 'פתוחות בלבד')}</option>
                  <option value="host_found">{t('Host Found', 'שובצו למשפחה')}</option>
                  <option value="expired">{t('Expired', 'פג תוקף')}</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-700">{t('City:', 'עיר:')}</span>
                <select
                  value={requestCityFilter}
                  onChange={e => setRequestCityFilter(e.target.value)}
                  className="text-xs px-2.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50 font-medium outline-hidden cursor-pointer"
                >
                  <option value="all">{t('All Cities', 'כל הערים')}</option>
                  <option value="Haifa">Haifa ({haifaOpenCount} open)</option>
                  <option value="Jerusalem">Jerusalem</option>
                  <option value="Ashdod">Ashdod</option>
                  <option value="Be'er Sheva">Be'er Sheva</option>
                  <option value="Beit Shemesh">Beit Shemesh</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-500">
                {filteredRequests.length} {t('requests', 'בקשות')}
              </span>

              {/* View Switcher */}
              <div className="flex items-center p-0.5 rounded-xl bg-slate-100 border border-slate-200">
                <button
                  onClick={() => setAdminViewMode('table')}
                  className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                    adminViewMode === 'table' ? 'bg-white text-purple-950 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                  title="Table View"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{t('Table', 'טבלה')}</span>
                </button>
                <button
                  onClick={() => setAdminViewMode('map')}
                  className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                    adminViewMode === 'map' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                  title="Map View"
                >
                  <MapIcon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{t('Map View', 'מפת ישראל')}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Interactive Israel Map for Admin */}
          {adminViewMode === 'map' && (
            <div className="p-4 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-3 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapIcon className="w-4 h-4 text-purple-600" />
                  <h3 className="font-extrabold text-sm text-slate-900">
                    {t('National Hosting Requests Map', 'מפת בקשות אירוח ארצית')}
                  </h3>
                </div>
                <span className="text-xs font-bold text-purple-900 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
                  {filteredRequests.length} {t('Active Markers', 'מוקדי אירוח')}
                </span>
              </div>
              <IsraelMap
                mode="feed"
                requests={filteredRequests}
                onSelectRequest={r => setSelectedRequestDetails(r)}
                height="420px"
              />
              <p className="text-[11px] text-slate-500 text-center">
                {t('Click city markers to inspect requests or identify local shortages', 'לחצו על מוקדי הערים לבדיקת עומסים ומחסור במארחים')}
              </p>
            </div>
          )}

          {/* Table */}
          {adminViewMode === 'table' && (
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left rtl:text-right">
                <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-100">
                  <tr>
                    <th className="py-3 px-4">{t('Guest', 'אורח/ת')}</th>
                    <th className="py-3 px-4">{t('Institution', 'מוסד')}</th>
                    <th className="py-3 px-4">{t('Shabbat & City', 'שבת ויעד')}</th>
                    <th className="py-3 px-4">{t('Observance / Food', 'כשרות')}</th>
                    <th className="py-3 px-4">{t('Status', 'סטטוס')}</th>
                    <th className="py-3 px-4">{t('Actions', 'פעולות')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredRequests.map(req => (
                    <tr key={req.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={req.guestAvatar}
                            alt=""
                            className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200"
                          />
                          <div>
                            <p>{req.guestName}</p>
                            <span className="text-[10px] text-slate-400 capitalize">{req.guestType.replace('_', ' ')}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 font-medium">{req.institution}</td>
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-slate-800 block">{req.shabbatHebrewName}</span>
                        <span className="text-slate-500 text-[11px]">{req.city}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-slate-700 block">{req.observance}</span>
                        <span className="text-slate-400 text-[10px]">{req.allergies || 'Kosher'}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        {req.status === 'open' && (
                          <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold text-[10px]">
                            {t('Open', 'פתוח')}
                          </span>
                        )}
                        {req.status === 'host_found' && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-bold text-[10px]">
                            {req.matchedHostName || 'Host Found'}
                          </span>
                        )}
                        {req.status === 'expired' && (
                          <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-900 font-bold text-[10px]">
                            {t('Expired', 'פג תוקף')}
                          </span>
                        )}
                        {req.status === 'closed_linked' && (
                          <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium text-[10px]">
                            {t('Closed (Group)', 'נסגר')}
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => setSelectedRequestDetails(req)}
                          className="px-2.5 py-1 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-900 font-bold text-[11px] transition-colors cursor-pointer"
                        >
                          {t('Request Details (Logs) →', 'פרטים ולוג מסירה ←')}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          )}
        </div>
      )}

      {/* Request Details Modal with WhatsApp Delivery Logs (Scenario 5, step 2 & alternative flow) */}
      {selectedRequestDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-base text-slate-900">
                {t('Request Notification & Delivery Details', 'פרטי בקשה ולוג הודעות למארחים')}
              </h3>
              <button
                onClick={() => setSelectedRequestDetails(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <p className="font-bold text-slate-900">{selectedRequestDetails.guestName} ({selectedRequestDetails.guestType})</p>
                <p className="text-slate-600">{selectedRequestDetails.institution} • {selectedRequestDetails.city}</p>
                <p className="text-slate-500 mt-1">"{selectedRequestDetails.about}"</p>
              </div>

              {/* Notification Delivery Logs (Scenario 5, step 2 & alt flow) */}
              <div>
                <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-1.5">
                  {t('Hosts Notified for this Request:', 'משפחות מארחות שקיבלו התראה:')}
                </h4>
                {selectedRequestDetails.notificationLogs && selectedRequestDetails.notificationLogs.length > 0 ? (
                  <div className="space-y-2">
                    {selectedRequestDetails.notificationLogs.map((log, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-xl border border-slate-200 bg-white flex items-center justify-between"
                      >
                        <div>
                          <p className="font-bold text-slate-800">{log.hostName}</p>
                          <p className="text-[10px] text-slate-400 font-mono">
                            Channel: {log.channel.toUpperCase()} • {new Date(log.sentAt).toLocaleTimeString()}
                          </p>
                        </div>
                        <div className="text-right rtl:text-left">
                          {log.delivered ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                              <Check className="w-3.5 h-3.5" />
                              <span>{log.read ? t('Delivered & Read', 'נמסר ונקרא') : t('Delivered', 'נמסר')}</span>
                            </span>
                          ) : (
                            <div>
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-600">
                                <AlertTriangle className="w-3.5 h-3.5" />
                                <span>{t('Delivery Failed!', 'נכשל במסירה')}</span>
                              </span>
                              <p className="text-[10px] text-slate-400">{t('Alternative: Email sent', 'נשלח במייל במקום')}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400 italic">{t('No notification delivery records.', 'אין רשומות מסירה.')}</p>
                )}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedRequestDetails(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
              >
                {t('Close', 'סגור')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Host Applications (Scenario 2 step 5 & 6, Levi family) */}
      {activeTab === 'applications' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs">
            <h2 className="text-base font-extrabold text-slate-900 mb-1">
              {t('Pending Host Family Applications', 'בקשות הצטרפות ממתינות לאישור')}
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              {t(
                'Review new host family submissions. Approving will create their official host profile and notify the family.',
                'בדיקת בקשות משפחות חדשות. אישור הבקשה יוצר פרופיל מארח פעיל ושולח הודעת אישור למשפחה.'
              )}
            </p>

            {pendingApplications.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                <p>{t('All host applications are up to date! None pending.', 'כל בקשות ההצטרפות נבדקו ואושרו.')}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingApplications.map(app => (
                  <div
                    key={app.id}
                    className="p-5 rounded-2xl border-2 border-amber-300 bg-amber-50/30 space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={app.familyPhoto}
                          alt={app.familyName}
                          className="w-14 h-14 rounded-2xl object-cover ring-2 ring-amber-400"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-black text-base text-slate-900">{app.familyName}</h3>
                            <span className="px-2 py-0.5 rounded-full bg-amber-200 text-amber-950 font-bold text-[10px]">
                              {t('Pending Review', 'ממתין לבדיקה')}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3.5 h-3.5 text-amber-600" />
                            <span>{app.neighborhood}, {app.city}</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => rejectHost(app.id, 'Capacity full')}
                          className="px-3.5 py-2 rounded-xl bg-white border border-rose-200 text-rose-700 hover:bg-rose-50 font-bold text-xs transition-colors cursor-pointer"
                        >
                          {t('Reject with Note', 'דחה')}
                        </button>
                        <button
                          onClick={() => approveHost(app.id)}
                          className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-black text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                        >
                          <Check className="w-4 h-4" />
                          <span>{t('Approve Host Family (Scenario 2)', 'אשר משפחה מארחת (תרחיש 2)')}</span>
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs p-3 rounded-xl bg-white border border-slate-200/60">
                      <div>
                        <span className="text-slate-400 block text-[11px]">{t('Children:', 'ילדים:')}</span>
                        <span className="font-bold text-slate-800">{app.numberOfChildren}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">{t('Observance:', 'כשרות ושמירה:')}</span>
                        <span className="font-bold text-slate-800">{app.observance}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">{t('Capacity & Beds:', 'תכולה ולינה:')}</span>
                        <span className="font-bold text-slate-800">{app.maxGuests} guests • {app.canSleep ? 'Beds' : 'Meals only'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">{t('English Level:', 'רמת אנגלית:')}</span>
                        <span className="font-bold text-slate-800">{app.englishLevel}</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 bg-white p-3 rounded-xl border border-slate-200/60">
                      <strong>{t('About Family:', 'על המשפחה:')}</strong> "{app.about}"
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: Manage Hosts (Scenario 5, step 3) */}
      {activeTab === 'hosts' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700">{t('Filter Hosts by City:', 'סנן מארחים לפי עיר:')}</span>
              <select
                value={hostCityFilter}
                onChange={e => setHostCityFilter(e.target.value)}
                className="text-xs px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 font-bold outline-hidden cursor-pointer"
              >
                <option value="all">{t('All Cities', 'כל הערים')}</option>
                <option value="Haifa">Haifa (חיפה)</option>
                <option value="Jerusalem">Jerusalem (ירושלים)</option>
                <option value="Ashdod">Ashdod (אשדוד)</option>
                <option value="Beit Shemesh">Beit Shemesh (בית שמש)</option>
              </select>
            </div>

            <span className="text-xs font-bold text-slate-500">
              {filteredHosts.length} {t('hosts found', 'משפחות נמצאו')}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredHosts.map(host => (
              <div
                key={host.id}
                className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={host.familyPhoto}
                      alt={host.familyName}
                      className="w-13 h-13 rounded-2xl object-cover ring-2 ring-purple-300"
                    />
                    <div>
                      <h3 className="font-extrabold text-sm text-slate-900">{host.familyName}</h3>
                      <p className="text-xs text-slate-500">{host.neighborhood}, {host.city}</p>
                      <p className="text-[11px] font-mono text-purple-800 font-bold mt-0.5">{host.whatsappNumber || 'Phone pending'}</p>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    {host.approvalStatus}
                  </span>
                </div>

                <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl">
                  {host.maxGuests} {t('guests capacity', 'אורחים')} • {host.observance} • {host.englishLevel} English
                </div>

                {/* Scenario 5, step 3: Dana calls or messages hosts */}
                <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                  <a
                    href={`tel:${host.whatsappNumber || '+972-52-334-1188'}`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 font-bold text-xs transition-colors cursor-pointer"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>{t('Call Family', 'התקשר למשפחה')}</span>
                  </a>

                  <a
                    href={`https://wa.me/${(host.whatsappNumber || '+972-52-334-1188').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                      `Shalom ${host.familyName}! This is Dana from Bayit Cham. We have several students still looking for hosting in ${host.city} for this Shabbat. Could you possibly take 1-2 guests?`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all shadow-xs cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>{t('WhatsApp Msg', 'שלח וואטסאפ')}</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: Support Inbox (Scenario 5, step 4) */}
      {activeTab === 'support' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs space-y-4">
          <h2 className="text-base font-extrabold text-slate-900 mb-1">
            {t('Support Requests & Help Tickets', 'פניות תמיכה וסיוע למשתמשים')}
          </h2>
          <p className="text-xs text-slate-500 mb-4">
            {t(
              'Respond to technical and coordination requests from guests and host families',
              'מענה לפניות טכניות, שינויי פרטים ותיאומים מיוחדים'
            )}
          </p>

          <div className="space-y-3">
            {supportTickets.map(ticket => (
              <div
                key={ticket.id}
                className={`p-4 rounded-2xl border transition-all ${
                  ticket.status === 'open' ? 'border-amber-300 bg-amber-50/20' : 'border-slate-200 bg-slate-50/50'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-xs text-slate-900">{ticket.subject}</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          ticket.status === 'open' ? 'bg-amber-100 text-amber-900' : 'bg-emerald-100 text-emerald-900'
                        }`}
                      >
                        {ticket.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      From: <strong>{ticket.userName}</strong> ({ticket.userEmail}) • {new Date(ticket.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-slate-700 mt-2 bg-white p-3 rounded-xl border border-slate-200/60 leading-relaxed">
                  "{ticket.message}"
                </p>

                {ticket.reply && (
                  <div className="mt-2 text-xs bg-emerald-50 p-2.5 rounded-xl border border-emerald-200 text-emerald-900">
                    <strong>{t('Dana\'s Reply:', 'מענה דנה:')}</strong> {ticket.reply}
                  </div>
                )}

                {ticket.status === 'open' && (
                  <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center gap-2">
                    <input
                      type="text"
                      placeholder={t('Type reply and mark resolved...', 'הקלד תשובה וסמן כנפתר...')}
                      value={replyingTicketId === ticket.id ? ticketReplyText : ''}
                      onChange={e => {
                        setReplyingTicketId(ticket.id);
                        setTicketReplyText(e.target.value);
                      }}
                      className="flex-1 text-xs px-3 py-1.5 rounded-xl border border-slate-300 bg-white outline-hidden"
                    />
                    <button
                      onClick={() => {
                        resolveTicket(ticket.id, ticketReplyText || 'Hi, your phone number has been updated successfully.');
                        setTicketReplyText('');
                        setReplyingTicketId(null);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs cursor-pointer flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{t('Resolve Ticket (Scenario 5)', 'סמן כנפתר')}</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: Statistics (Scenario 5, step 5) */}
      {activeTab === 'stats' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs text-center">
              <span className="text-3xl font-black text-purple-900">{requests.length}</span>
              <p className="text-xs text-slate-500 mt-1">{t('Total Requests (Month)', 'סך בקשות החודש')}</p>
            </div>
            <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs text-center">
              <span className="text-3xl font-black text-emerald-600">
                {Math.round((requests.filter(r => r.status === 'host_found').length / (requests.length || 1)) * 100)}%
              </span>
              <p className="text-xs text-slate-500 mt-1">{t('Match Placement Rate', 'אחוז שיבוץ מוצלח')}</p>
            </div>
            <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs text-center">
              <span className="text-3xl font-black text-amber-600">{hostProfiles.filter(h => h.isApproved).length}</span>
              <p className="text-xs text-slate-500 mt-1">{t('Active Host Families', 'משפחות פעילות')}</p>
            </div>
            <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs text-center">
              <span className="text-3xl font-black text-indigo-600">4.9 / 5</span>
              <p className="text-xs text-slate-500 mt-1">{t('Average Guest Rating', 'ציון משוב ממוצע')}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Breakdown by City */}
            <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-3">
              <h3 className="font-extrabold text-sm text-slate-900">{t('Breakdown by City', 'פילוח בקשות לפי ערים')}</h3>
              <div className="space-y-2 text-xs">
                {[
                  { city: 'Jerusalem', count: requests.filter(r => r.city === 'Jerusalem').length, pct: 45 },
                  { city: 'Haifa', count: requests.filter(r => r.city === 'Haifa').length, pct: 35 },
                  { city: 'Ashdod', count: requests.filter(r => r.city === 'Ashdod').length, pct: 15 },
                  { city: 'Be\'er Sheva', count: requests.filter(r => r.city === 'Be\'er Sheva').length, pct: 10 },
                ].map(item => (
                  <div key={item.city}>
                    <div className="flex justify-between mb-1">
                      <span className="font-bold text-slate-700">{item.city}</span>
                      <span className="text-slate-500">{item.count} requests</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full bg-purple-600 rounded-full" style={{ width: `${item.pct}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Breakdown by Institution */}
            <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-3">
              <h3 className="font-extrabold text-sm text-slate-900">{t('Breakdown by Institution', 'פילוח לפי מוסד / מסגרת')}</h3>
              <div className="space-y-2 text-xs">
                {[
                  { name: 'Technion & Haifa Univ', pct: 40 },
                  { name: 'Ariel University', pct: 25 },
                  { name: 'IDF Lone Soldiers', pct: 20 },
                  { name: 'Hebrew University / Masa', pct: 15 },
                ].map(inst => (
                  <div key={inst.name}>
                    <div className="flex justify-between mb-1">
                      <span className="font-bold text-slate-700">{inst.name}</span>
                      <span className="text-slate-500">{inst.pct}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full" style={{ width: `${inst.pct}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: Feedback Review & AI Summarize (Scenario 5, step 6 & 7) */}
      {activeTab === 'feedback' && (
        <div className="space-y-5">
          <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-extrabold text-slate-900">
                  {t('Community Feedback Review', 'סקירת משובי מוצאי שבת')}
                </h2>
                <p className="text-xs text-slate-500">
                  {t(
                    'Analyze real host and guest experiences across Israel to pinpoint operational improvements',
                    'ניתוח חוויות אירוח לשמירה על רמת שירות גבוהה ודיוק תזמון יצירת הקשר'
                  )}
                </p>
              </div>

              {/* AI Summarize Button (Scenario 5, step 6) */}
              <button
                onClick={handleRunAiFeedbackSummary}
                disabled={isSummarizingAi}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-amber-600 hover:from-purple-700 hover:to-amber-700 text-white font-extrabold text-xs shadow-md transition-all active:scale-95 cursor-pointer disabled:opacity-50"
              >
                {isSummarizingAi ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{t('Analyzing Reviews with AI...', 'מנתח משובים עם AI...')}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-yellow-200" />
                    <span>{t('Summarize Feedback [AI] (Scenario 5)', 'סכם משובים עם AI ✨ (תרחיש 5)')}</span>
                  </>
                )}
              </button>
            </div>

            {/* AI Summary Card Output */}
            {aiSummaryData && (
              <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-500/10 via-amber-500/10 to-emerald-500/10 border-2 border-purple-400/50 space-y-4 animate-in fade-in duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-600" />
                    <h3 className="font-black text-sm text-purple-950">
                      {t('AI Executive Synthesis for Dana', 'תקציר מנהלים מבוסס AI עבור דנה')}
                    </h3>
                  </div>
                  <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-purple-600 text-white">
                    {aiSummaryData.sentimentScore}% {t('Satisfaction', 'שביעות רצון')}
                  </span>
                </div>

                <p className="text-xs text-slate-800 leading-relaxed font-medium">
                  {aiSummaryData.summary}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2">
                  <div className="p-3 rounded-xl bg-white/80 border border-purple-200 space-y-1">
                    <span className="font-bold text-emerald-800 block text-[11px] uppercase tracking-wider">
                      {t('Key Hospitality Highlights:', 'נקודות חוזק מרכזיות:')}
                    </span>
                    <ul className="list-disc list-inside space-y-0.5 text-slate-700">
                      {aiSummaryData.keyHighlights?.map((h, i) => (
                        <li key={i}>{h}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3 rounded-xl bg-white/80 border border-amber-200 space-y-1">
                    <span className="font-bold text-amber-900 block text-[11px] uppercase tracking-wider">
                      {t('Recommended Operational Action:', 'המלצות לפעולה:')}
                    </span>
                    <ul className="list-disc list-inside space-y-0.5 text-slate-700 font-medium">
                      {aiSummaryData.actionItems?.map((a, i) => (
                        <li key={i}>{a}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Individual Reviews List */}
            <div className="space-y-3 pt-2">
              <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider">
                {t('Recent Raw Reviews:', 'משובים אחרונים מהשטח:')}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {feedbacks.map(f => (
                  <div
                    key={f.id}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{f.reviewerName}</span>
                      <span className="font-bold text-amber-600">★ {f.rating}/5</span>
                    </div>
                    <p className="text-slate-600 leading-relaxed">"{f.comment}"</p>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-200/60">
                      <span>{f.shabbatName} • {f.city}</span>
                      <span className={f.contactPromptness === 'late_friday' ? 'text-rose-600 font-bold' : ''}>
                        {t('Contact: ', 'יצירת קשר: ')}{f.contactPromptness.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
