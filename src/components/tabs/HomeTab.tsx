import React, { useState } from 'react';
import { TabType, BetterSpeakProfile, SpeechFeedback } from '../../types';
import { StorageManager } from '../../utils/storage';
import {
  BETTER_SPEAK_SCENARIOS,
  SHADOWING_DRILLS,
  analyzeSpeechOffline,
} from '../../data/betterSpeakData';
import { unlockSpeechAudio, speakTextQueue, cancelSpeech } from '../../utils/speech';
import {
  Sparkles,
  Volume2,
  Mic,
  ArrowRight,
  BookOpen,
  Award,
  Zap,
  CheckCircle2,
  Play,
  RotateCcw,
  MessageSquare,
  Download,
  GraduationCap,
  Target,
  Clock,
  Compass,
} from 'lucide-react';

interface HomeTabProps {
  onNavigateTab: (tab: TabType) => void;
  onOpenLauraWithPrompt?: (prompt: string, initialGreeting?: string) => void;
}

export const HomeTab: React.FC<HomeTabProps> = ({
  onNavigateTab,
  onOpenLauraWithPrompt,
}) => {
  const settings = StorageManager.getSettings();
  const userName = settings.profile.name || 'Pak Abdul';
  const profile = StorageManager.getBetterSpeakProfile();

  // Shadowing daily phrase
  const dailyShadowing = SHADOWING_DRILLS[0];
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Quick Speech Analyzer Box
  const [quickSentence, setQuickSentence] = useState(
    'In my opinion, good education is very important for all university students.'
  );
  const [quickFeedback, setQuickFeedback] = useState<SpeechFeedback | null>(() =>
    analyzeSpeechOffline('In my opinion, good education is very important for all university students.')
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handlePlayAudio = (text: string) => {
    unlockSpeechAudio();
    cancelSpeech();
    setIsPlayingAudio(true);
    speakTextQueue(text, {
      preferredIdVoice: settings.preferredIdVoice,
      preferredEnVoice: settings.preferredEnVoice,
      rate: 0.94,
      pitch: 1.0,
      onEnd: () => setIsPlayingAudio(false),
      onError: () => setIsPlayingAudio(false),
    });
  };

  const handleAnalyze = () => {
    if (!quickSentence.trim()) return;
    setIsAnalyzing(true);
    setTimeout(() => {
      setQuickFeedback(analyzeSpeechOffline(quickSentence));
      setIsAnalyzing(false);
    }, 250);
  };

  return (
    <div className="space-y-4 pb-20 max-w-2xl mx-auto">
      {/* Hero Welcome & Fluency Profile Card */}
      <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-[#0f5c4d] via-[#124f42] to-[#0c3930] text-white shadow-lg border border-emerald-600/30 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-extrabold uppercase tracking-wider bg-amber-400 text-stone-900 px-2.5 py-0.5 rounded-full shadow-xs">
                BetterSpeak™ AI Lab
              </span>
              <span className="text-[10px] text-emerald-200">
                100% Gratis • Berbasis Web
              </span>
            </div>

            <h2 className="font-academic-heading text-lg sm:text-xl font-bold text-white mt-1">
              Welcome back, {userName}!
            </h2>
            <p className="text-xs text-emerald-100/90 leading-relaxed max-w-md">
              Latih reflek berbicara bahasa Inggris bersama AI Laura Thompson, diselaraskan dengan Modul English-01 & 02 karya Abdul Muhit, M.Pd.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            {profile ? (
              <div className="text-center bg-white/10 px-3.5 py-2 rounded-2xl border border-white/20 backdrop-blur-xs">
                <span className="text-[9px] uppercase font-bold text-amber-200 block">
                  Fluency Index
                </span>
                <span className="text-2xl font-black text-amber-300">
                  {profile.fluencyScore}%
                </span>
              </div>
            ) : null}

            <button
              onClick={() => onNavigateTab('tes_level')}
              className="px-3.5 py-2.5 rounded-2xl bg-amber-400 text-stone-900 text-xs font-bold hover:bg-amber-300 transition shadow-md flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 text-stone-900" />
              <span>{profile ? 'Ulangi Quiz Level' : 'Ikuti Tes Penempatan'}</span>
            </button>
          </div>
        </div>

        {/* Profile Statistics or CTA */}
        {profile ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4 pt-3 border-t border-white/15 text-xs">
            <div className="flex items-center gap-1.5 text-emerald-100">
              <Award className="w-4 h-4 text-amber-300 shrink-0" />
              <span className="truncate">Target: {profile.targetCefr}</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-100">
              <Clock className="w-4 h-4 text-amber-300 shrink-0" />
              <span>Target: {profile.dailyCommitment} mnt/hari</span>
            </div>
            <div className="col-span-2 sm:col-span-1 flex items-center gap-1.5 text-emerald-100">
              <Target className="w-4 h-4 text-amber-300 shrink-0" />
              <span>Level: {profile.currentLevel.toUpperCase()}</span>
            </div>
          </div>
        ) : (
          <div className="mt-4 pt-3 border-t border-white/15 flex items-center justify-between text-xs text-emerald-100">
            <span>Belum mengikuti tes level? Ikuti kuis diagnostik 2 menit gaya BetterSpeak!</span>
            <button
              onClick={() => onNavigateTab('tes_level')}
              className="underline text-amber-300 font-bold hover:text-white"
            >
              Mulai Tes ➔
            </button>
          </div>
        )}
      </div>

      {/* Main Feature Quick Links (BetterSpeak Core Features) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <button
          onClick={() => onNavigateTab('tutor_ai')}
          className="p-3.5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs hover:border-[#0f5c4d] transition text-left group"
        >
          <div className="w-9 h-9 rounded-xl bg-[#0f5c4d]/10 text-[#0f5c4d] flex items-center justify-center font-bold mb-2 group-hover:scale-105 transition">
            <Mic className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-stone-900 dark:text-white block">
            Percakapan AI
          </span>
          <span className="text-[11px] text-stone-500">
            Ngobrol suara dengan Laura
          </span>
        </button>

        <button
          onClick={() => onNavigateTab('skenario')}
          className="p-3.5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs hover:border-[#0f5c4d] transition text-left group"
        >
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center font-bold mb-2 group-hover:scale-105 transition">
            <MessageSquare className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-stone-900 dark:text-white block">
            Skenario Bicara
          </span>
          <span className="text-[11px] text-stone-500">
            Kuliah & sidang disertasi
          </span>
        </button>

        <button
          onClick={() => onNavigateTab('shadowing')}
          className="p-3.5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs hover:border-[#0f5c4d] transition text-left group"
        >
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-700 flex items-center justify-center font-bold mb-2 group-hover:scale-105 transition">
            <Volume2 className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-stone-900 dark:text-white block">
            Shadowing Lab
          </span>
          <span className="text-[11px] text-stone-500">
            Latih aksen & pelafalan
          </span>
        </button>

        <button
          onClick={() => onNavigateTab('modul')}
          className="p-3.5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs hover:border-[#0f5c4d] transition text-left group"
        >
          <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-700 flex items-center justify-center font-bold mb-2 group-hover:scale-105 transition">
            <BookOpen className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-stone-900 dark:text-white block">
            Modul PTIQ
          </span>
          <span className="text-[11px] text-stone-500">
            Karya Abdul Muhit, M.Pd
          </span>
        </button>
      </div>

      {/* Recommended Roleplay Scenario Card */}
      <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#0f5c4d]/10 text-[#0f5c4d] dark:text-emerald-300">
              Skenario Rekomendasi Hari Ini
            </span>
            <span className="text-xs text-stone-400">•</span>
            <span className="text-xs text-stone-500">Academic Lecturing</span>
          </div>
          <button
            onClick={() => onNavigateTab('skenario')}
            className="text-xs font-bold text-[#0f5c4d] hover:underline flex items-center gap-1"
          >
            <span>Semua Skenario</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-1">
          <h3 className="font-academic-heading text-base font-bold text-stone-900 dark:text-white">
            {BETTER_SPEAK_SCENARIOS[0].title}
          </h3>
          <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
            {BETTER_SPEAK_SCENARIOS[0].description}
          </p>
        </div>

        <div className="p-2.5 rounded-xl bg-[#f6f3ec] dark:bg-stone-800 text-xs italic text-stone-700 dark:text-stone-300">
          "{BETTER_SPEAK_SCENARIOS[0].promptStarter}"
        </div>

        <div className="flex justify-end">
          <button
            onClick={() => {
              if (onOpenLauraWithPrompt) {
                const s = BETTER_SPEAK_SCENARIOS[0];
                onOpenLauraWithPrompt(
                  `Halo Laura, mari kita mulai simulasi speaking BetterSpeak untuk skenario: "${s.title}". Laura berperan sebagai: ${s.lauraRole}, dan aku berperan sebagai: ${s.userRole}. Buka percakapannya dengan ramah dalam bahasa Inggris ya!`,
                  s.promptStarter
                );
              }
            }}
            className="px-4 py-2 rounded-xl bg-[#0f5c4d] text-white text-xs font-bold hover:bg-[#0d4f42] transition shadow-xs flex items-center gap-1.5"
          >
            <Mic className="w-4 h-4" />
            <span>Mulai Simulasi dengan Laura</span>
          </button>
        </div>
      </div>

      {/* Pronunciation & Shadowing Phrase of the Day */}
      <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200">
            Latihan Pelafalan Harian (Shadowing)
          </span>
          <button
            onClick={() => onNavigateTab('shadowing')}
            className="text-xs font-bold text-[#0f5c4d] hover:underline flex items-center gap-1"
          >
            <span>Lab Pelafalan</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-1">
          <h4 className="text-sm sm:text-base font-bold text-stone-900 dark:text-white">
            "{dailyShadowing.sentence}"
          </h4>
          {dailyShadowing.phonetics && (
            <p className="text-xs font-mono text-stone-500">{dailyShadowing.phonetics}</p>
          )}
          <p className="text-xs text-stone-600 dark:text-stone-400 italic">
            Artinya: {dailyShadowing.indonesian}
          </p>
        </div>

        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={() => handlePlayAudio(dailyShadowing.sentence)}
            className="px-3.5 py-2 rounded-xl bg-[#0f5c4d] text-white text-xs font-bold hover:bg-[#0d4f42] transition shadow-xs flex items-center gap-1.5"
          >
            <Volume2 className={`w-4 h-4 ${isPlayingAudio ? 'animate-pulse' : ''}`} />
            <span>{isPlayingAudio ? 'Laura Berbicara...' : 'Dengarkan Suara Laura'}</span>
          </button>

          <button
            onClick={() => onNavigateTab('shadowing')}
            className="px-3.5 py-2 rounded-xl bg-amber-400 text-stone-900 text-xs font-bold hover:bg-amber-300 transition shadow-xs flex items-center gap-1.5"
          >
            <Mic className="w-4 h-4" />
            <span>Tirukan & Rekam Suara</span>
          </button>
        </div>
      </div>

      {/* Official Teaching Modules: English 01 & 02 by Abdul Muhit, M.Pd */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-[#0f5c4d] to-[#124d41] text-white shadow-md border border-emerald-600/30 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <div className="p-2 bg-amber-400 text-stone-900 rounded-xl font-bold shrink-0 mt-0.5">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 text-amber-200 px-2 py-0.5 rounded-full">
                  Buku Ajar Acuan PTIQ
                </span>
                <span className="text-[10px] text-emerald-200">Karya Abdul Muhit, M.Pd</span>
              </div>
              <h3 className="font-academic-heading text-base font-bold text-white mt-1">
                Modul Communicative English I & II
              </h3>
              <p className="text-xs text-emerald-100/90 mt-0.5">
                Materi ajar acuan utama perkuliahan Bahasa Inggris & latihan terintegrasi dengan Laura Thompson.
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('modul')}
            className="shrink-0 px-3 py-1.5 rounded-xl bg-amber-400 text-stone-900 text-xs font-bold hover:bg-amber-300 transition shadow-xs flex items-center gap-1"
          >
            <Sparkles className="w-3.5 h-3.5 text-stone-900" />
            <span>Lihat Silabus</span>
          </button>
        </div>

        {/* Quick Download Links Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-emerald-700/60">
          <a
            href="/assets/aistudio/ENGLISH-01_REVISED_d91bdfc6.pdf"
            target="_blank"
            rel="noopener noreferrer"
            download
            className="flex items-center justify-between p-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 transition group"
          >
            <div className="text-left">
              <span className="font-bold text-xs text-amber-200 block group-hover:text-amber-100">
                📥 Modul English-01 (Semester 1)
              </span>
              <span className="text-[10px] text-emerald-200">Integrated Skills (CEFR A1-A2)</span>
            </div>
            <Download className="w-4 h-4 text-amber-300 shrink-0" />
          </a>

          <a
            href="/assets/aistudio/ENGLISH-02_REVISED_38467a48.pdf"
            target="_blank"
            rel="noopener noreferrer"
            download
            className="flex items-center justify-between p-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 transition group"
          >
            <div className="text-left">
              <span className="font-bold text-xs text-amber-200 block group-hover:text-amber-100">
                📥 Modul English-02 (Semester 2)
              </span>
              <span className="text-[10px] text-emerald-200">Productive Skills (Speaking & Writing)</span>
            </div>
            <Download className="w-4 h-4 text-amber-300 shrink-0" />
          </a>
        </div>
      </div>

      {/* Real-Time Speech Feedback Analyzer Widget */}
      <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#0f5c4d] dark:text-emerald-400 uppercase tracking-wider">
            BetterSpeak™ Quick Speech Analyzer
          </span>
          <span className="text-[10px] font-bold text-stone-500">
            Uji Kalimat Instan
          </span>
        </div>

        <textarea
          rows={2}
          value={quickSentence}
          onChange={(e) => setQuickSentence(e.target.value)}
          placeholder="Ketik kalimat bahasa Inggris Anda untuk dianalisis..."
          className="w-full text-xs p-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-[#f6f3ec] dark:bg-stone-850 focus:outline-hidden focus:ring-2 focus:ring-[#0f5c4d]"
        />

        <div className="flex justify-end">
          <button
            disabled={isAnalyzing || !quickSentence.trim()}
            onClick={handleAnalyze}
            className="px-4 py-1.5 rounded-xl bg-[#0f5c4d] text-white text-xs font-bold hover:bg-[#0d4f42] transition flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isAnalyzing ? 'Menganalisis...' : 'Analisis Kalimat'}</span>
          </button>
        </div>

        {quickFeedback && (
          <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-700 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#0f5c4d] dark:text-emerald-400">
                Skor Kelancaran: {quickFeedback.fluencyScore}%
              </span>
              <span className="text-stone-500">{quickFeedback.overallPraise}</span>
            </div>

            <p className="text-stone-700 dark:text-stone-300">
              <strong>Grammar:</strong> {quickFeedback.grammarFeedback}
            </p>

            {quickFeedback.vocabularyUpgrades && quickFeedback.vocabularyUpgrades.length > 0 && (
              <div className="text-[11px] text-amber-800 dark:text-amber-300">
                <strong>Kosakata Lebih Baik:</strong> Ganti "{quickFeedback.vocabularyUpgrades[0].original}" ➔ "{quickFeedback.vocabularyUpgrades[0].better}" ({quickFeedback.vocabularyUpgrades[0].reason})
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
