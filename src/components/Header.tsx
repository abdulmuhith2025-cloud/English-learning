import React from 'react';
import { TabType } from '../types';
import { useOnlineStatus } from '../hooks/usePWAInstall';
import { Settings, WifiOff, Sparkles } from 'lucide-react';

interface HeaderProps {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
  onOpenLaura: () => void;
  onOpenSettings: () => void;
}

const TABS: Array<{ id: TabType; label: string }> = [
  { id: 'beranda', label: '🏠 Beranda' },
  { id: 'tutor_ai', label: '🎙️ Percakapan AI' },
  { id: 'skenario', label: '🎭 Skenario Bicara' },
  { id: 'shadowing', label: '🗣️ Shadowing & Aksen' },
  { id: 'modul', label: '📚 Modul PTIQ' },
  { id: 'tes_level', label: '🎯 Tes Level (Quiz)' },
];

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onTabChange,
  onOpenLaura,
  onOpenSettings,
}) => {
  const isOnline = useOnlineStatus();

  return (
    <header className="sticky top-0 z-30 bg-[#0f5c4d] text-white shadow-md">
      {/* Top Brand Bar */}
      <div className="max-w-4xl mx-auto px-4 py-2.5 flex items-center justify-between">
        <div
          onClick={onOpenLaura}
          className="flex items-center gap-2.5 cursor-pointer select-none group"
        >
          {/* Round avatar logo */}
          <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-amber-300 shadow-sm group-hover:scale-105 transition">
            <img
              src="/laura_portrait.jpg"
              alt="Laura Thompson"
              className="w-full h-full object-cover object-top"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/src/assets/images/laura_portrait_1792939409370.jpg';
              }}
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-white" />
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-academic-heading text-lg font-bold tracking-tight text-white leading-none">
                Laura
              </h1>
              <span className="text-[9px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-400 text-stone-900 shadow-xs">
                BetterSpeak
              </span>
            </div>
            <p className="text-[10px] uppercase tracking-widest text-emerald-200 font-semibold mt-0.5">
              AI ENGLISH SPEAKING TUTOR
            </p>
          </div>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-2">
          {/* Offline alert chip if offline */}
          {!isOnline && (
            <div className="flex items-center gap-1 bg-amber-500 text-stone-900 text-[11px] font-bold px-2 py-1 rounded-lg">
              <WifiOff className="w-3.5 h-3.5" />
              <span>Offline (Mode Lokal Aktif)</span>
            </div>
          )}

          {/* Quick Speak Button */}
          <button
            onClick={() => onTabChange('tutor_ai')}
            className="hidden sm:flex items-center gap-1.5 bg-amber-400 hover:bg-amber-300 text-stone-900 text-xs font-bold px-3 py-1.5 rounded-xl shadow-xs transition"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Mulai Bicara</span>
          </button>

          {/* Settings Button */}
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-xl text-emerald-100 hover:text-white hover:bg-emerald-800/60 transition min-w-[40px] min-h-[40px] flex items-center justify-center"
            title="Pengaturan Tutor & Suara"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Horizontally Scrollable Tabs */}
      <nav className="max-w-4xl mx-auto flex items-center gap-1.5 overflow-x-auto px-3 pb-2 pt-1 no-scrollbar border-t border-emerald-800/40 text-xs font-medium">
        {TABS.map((tab) => {
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`shrink-0 px-3.5 py-1.5 rounded-xl transition min-h-[36px] flex items-center justify-center font-semibold ${
                isActive
                  ? 'bg-amber-400 text-stone-900 shadow-sm'
                  : 'text-emerald-100 hover:text-white hover:bg-emerald-800/50'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </nav>
    </header>
  );
};
