import React from 'react';
import { ActiveReminder } from '../hooks/useReminderEngine';
import { Bell, Volume2, X, Check } from 'lucide-react';

interface ReminderBannerProps {
  reminder: ActiveReminder | null;
  onDismiss: () => void;
}

export const ReminderBanner: React.FC<ReminderBannerProps> = ({ reminder, onDismiss }) => {
  if (!reminder) return null;

  const isPrayer = reminder.type === 'prayer';

  return (
    <div className="fixed top-3 inset-x-3 z-[100] max-w-lg mx-auto animate-in slide-in-from-top-4 duration-300 pointer-events-auto">
      <div
        className={`rounded-2xl p-4 shadow-2xl border flex items-start gap-3 backdrop-blur-md ${
          isPrayer
            ? 'bg-[#0f5c4d]/95 text-white border-emerald-400/40'
            : 'bg-[#a87a08]/95 text-white border-amber-300/40'
        }`}
      >
        <div className="p-2.5 rounded-xl bg-white/20 backdrop-blur-sm shrink-0 flex items-center justify-center">
          {isPrayer ? <Bell className="w-5 h-5 text-amber-200 animate-bounce" /> : <Volume2 className="w-5 h-5 text-white animate-pulse" />}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/25">
              {isPrayer ? 'Waktu Salat' : reminder.type === 'agenda' ? 'Agenda Hari Ini' : 'Rutinitas'}
            </span>
            <span className="text-xs text-white/80">{reminder.timeStr} WIB</span>
          </div>

          <h4 className="font-academic-heading text-base font-bold text-white mt-1 leading-snug">
            {reminder.title}
          </h4>

          <p className="text-xs text-white/90 mt-0.5 line-clamp-2">
            {reminder.subtitle}
          </p>

          <div className="mt-2.5 flex items-center gap-2">
            <button
              onClick={onDismiss}
              className="text-xs bg-white text-[#0f5c4d] font-semibold px-3 py-1 rounded-lg hover:bg-stone-100 transition shadow-sm flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              Siap, Mengerti
            </button>
          </div>
        </div>

        <button
          onClick={onDismiss}
          className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition shrink-0"
          aria-label="Tutup pemberitahuan"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
