import React from 'react';
import { useApp } from '../context/AppContext';
import { MessageSquare, Phone, MoreVertical, Send, CheckCheck, X, Sparkles, ExternalLink } from 'lucide-react';

export const WhatsAppSimulatorModal: React.FC = () => {
  const {
    activeWhatsAppMessage,
    closeWhatsAppSimulator,
    setActiveScreen,
    setSelectedRequest,
    requests,
    t,
  } = useApp();

  if (!activeWhatsAppMessage) return null;

  const handleAction = () => {
    if (activeWhatsAppMessage.actionUrl) {
      setActiveScreen(activeWhatsAppMessage.actionUrl);
    }
    if (activeWhatsAppMessage.relatedRequestId) {
      const req = requests.find(r => r.id === activeWhatsAppMessage.relatedRequestId);
      if (req) setSelectedRequest(req);
    }
    closeWhatsAppSimulator();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#efeae2] rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-800">
        {/* Phone Notch & Header */}
        <div className="bg-[#075e54] text-white px-4 py-3 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-700 border-2 border-emerald-400 flex items-center justify-center text-white font-bold text-sm shadow">
              {activeWhatsAppMessage.senderName[0] || 'B'}
            </div>
            <div>
              <div className="flex items-center gap-1.5 font-bold text-sm leading-tight">
                <span>{activeWhatsAppMessage.senderName}</span>
                <span className="w-3.5 h-3.5 bg-emerald-400 text-emerald-950 rounded-full flex items-center justify-center text-[9px] font-black" title="Verified Community Service">✓</span>
              </div>
              <p className="text-[11px] text-emerald-100 opacity-90">{t('Official Shabbat Notification Service', 'הודעת מערכת שבת מאומתת')}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={closeWhatsAppSimulator}
              className="p-1 rounded-full hover:bg-emerald-800/80 text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Recipient banner */}
        <div className="bg-[#128c7e]/15 px-4 py-1.5 text-center text-xs text-slate-700 font-medium border-b border-emerald-600/10">
          {t('Delivered to:', 'נשלח אל:')} <span className="font-bold text-emerald-900">{activeWhatsAppMessage.recipientName}</span> ({activeWhatsAppMessage.recipientPhone})
        </div>

        {/* WhatsApp Chat Body */}
        <div className="p-4 space-y-4 max-h-[380px] min-h-[260px] overflow-y-auto bg-[radial-gradient(#d6cec4_1px,transparent_1px)] [background-size:16px_16px]">
          <div className="text-center">
            <span className="inline-block px-3 py-1 rounded-md bg-white/70 shadow-xs text-[11px] text-slate-600 font-medium">
              {t('Today, 28 Cheshvan', 'היום, כ״ח בחשון')} • {activeWhatsAppMessage.timestamp}
            </span>
          </div>

          {/* Incoming message bubble */}
          <div className="flex justify-start">
            <div className="max-w-[85%] bg-white rounded-2xl rounded-tl-xs p-3.5 shadow-sm border border-slate-200/60 text-slate-800 text-sm leading-relaxed">
              <p className="whitespace-pre-line">{activeWhatsAppMessage.messageText}</p>
              
              <div className="mt-2.5 flex items-center justify-end gap-1 text-[10px] text-slate-400 font-medium">
                <span>10:32 AM</span>
                <CheckCheck className="w-3.5 h-3.5 text-sky-500" />
              </div>

              {activeWhatsAppMessage.actionLabel && (
                <div className="mt-3 pt-2.5 border-t border-slate-100">
                  <button
                    onClick={handleAction}
                    className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-semibold text-xs transition-all shadow-xs cursor-pointer"
                  >
                    <span>{activeWhatsAppMessage.actionLabel}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Phone Footer Input bar */}
        <div className="bg-[#f0f2f5] px-3 py-2.5 flex items-center gap-2 border-t border-slate-200">
          <div className="flex-1 bg-white rounded-full px-4 py-2 text-xs text-slate-400 border border-slate-200 flex items-center justify-between">
            <span>{t('Type a reply via WhatsApp...', 'הקלד תשובה בוואטסאפ...')}</span>
          </div>
          <button
            onClick={closeWhatsAppSimulator}
            className="w-9 h-9 rounded-full bg-[#128c7e] text-white flex items-center justify-center shadow-xs hover:bg-[#075e54] transition-colors cursor-pointer"
          >
            <Send className="w-4 h-4 ml-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export const WhatsAppToastContainer: React.FC = () => {
  const { whatsappQueue, openWhatsAppSimulator, dismissWhatsAppToast, t } = useApp();

  if (whatsappQueue.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {whatsappQueue.slice(0, 3).map((msg) => (
        <div
          key={msg.id}
          className="pointer-events-auto bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-emerald-500/30 p-3.5 flex items-start gap-3 transform transition-all duration-300 hover:scale-[1.02] animate-in slide-in-from-bottom-5"
        >
          <div className="w-10 h-10 rounded-xl bg-[#25D366] text-white flex items-center justify-center shrink-0 shadow-md">
            <MessageSquare className="w-5 h-5" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-1">
              <span className="text-xs font-bold text-slate-900 truncate">
                WhatsApp • {msg.recipientName}
              </span>
              <button
                onClick={() => dismissWhatsAppToast(msg.id)}
                className="text-slate-400 hover:text-slate-600 p-0.5 rounded cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-xs text-slate-600 line-clamp-2 mt-0.5">{msg.messageText}</p>
            
            <div className="mt-2 flex items-center gap-2">
              <button
                onClick={() => openWhatsAppSimulator(msg)}
                className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-semibold transition-colors shadow-xs cursor-pointer flex items-center gap-1"
              >
                <span>{t('View in WhatsApp', 'פתח הודעה')}</span>
                <ExternalLink className="w-3 h-3" />
              </button>
              <button
                onClick={() => dismissWhatsAppToast(msg.id)}
                className="text-[11px] text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                {t('Dismiss', 'סגור')}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
