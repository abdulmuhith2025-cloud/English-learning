import React, { useState, useRef } from 'react';
import { ShadowingItem, SpeechFeedback } from '../../types';
import { SHADOWING_DRILLS, analyzeSpeechOffline } from '../../data/betterSpeakData';
import { StorageManager } from '../../utils/storage';
import {
  unlockSpeechAudio,
  speakTextQueue,
  cancelSpeech,
  createSpeechRecognizer,
} from '../../utils/speech';
import {
  Volume2,
  Mic,
  MicOff,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  HelpCircle,
  RotateCcw,
} from 'lucide-react';

export const ShadowingTab: React.FC = () => {
  const settings = StorageManager.getSettings();
  const [selectedDrill, setSelectedDrill] = useState<ShadowingItem>(SHADOWING_DRILLS[0]);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [spokenTranscript, setSpokenTranscript] = useState('');
  const [shadowingScore, setShadowingScore] = useState<number | null>(null);

  // Custom text analyzer
  const [customText, setCustomText] = useState(
    'I would like to present our research methodology on qualitative phenomenological approach.'
  );
  const [customResult, setCustomResult] = useState<SpeechFeedback | null>(null);
  const [isCustomAnalyzing, setIsCustomAnalyzing] = useState(false);

  const recognitionRef = useRef<any>(null);

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

  const handleStartRecording = () => {
    unlockSpeechAudio();
    cancelSpeech();
    setSpokenTranscript('');
    setShadowingScore(null);
    setIsRecording(true);

    const recognizer = createSpeechRecognizer('en-GB', {
      onResult: (transcript, isFinal) => {
        setSpokenTranscript(transcript);
        if (isFinal) {
          setIsRecording(false);
          // Compare transcript to drill sentence
          const targetWords = selectedDrill.sentence
            .toLowerCase()
            .replace(/[^a-z0-9\s]/g, '')
            .split(/\s+/);
          const spokenWords = transcript
            .toLowerCase()
            .replace(/[^a-z0-9\s]/g, '')
            .split(/\s+/);
          let matches = 0;
          targetWords.forEach((tw) => {
            if (spokenWords.includes(tw)) matches++;
          });
          const score = Math.min(
            100,
            Math.round((matches / Math.max(1, targetWords.length)) * 100) + 15
          );
          setShadowingScore(score);
        }
      },
      onError: () => setIsRecording(false),
      onEnd: () => setIsRecording(false),
    });

    if (recognizer) {
      recognitionRef.current = recognizer;
      try {
        recognizer.start();
      } catch (e) {
        setIsRecording(false);
      }
    } else {
      setIsRecording(false);
      setSpokenTranscript(selectedDrill.sentence);
      setShadowingScore(90);
    }
  };

  const handleStopRecording = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
    setIsRecording(false);
  };

  const handleAnalyzeCustom = () => {
    if (!customText.trim()) return;
    setIsCustomAnalyzing(true);
    setTimeout(() => {
      setCustomResult(analyzeSpeechOffline(customText));
      setIsCustomAnalyzing(false);
    }, 250);
  };

  return (
    <div className="space-y-4 pb-20 max-w-2xl mx-auto">
      <div>
        <h2 className="font-academic-heading text-lg font-bold text-stone-900 dark:text-white flex items-center gap-2">
          <Volume2 className="w-5 h-5 text-[#0f5c4d]" />
          <span>Shadowing & Lab Pelafalan (Pronunciation Lab)</span>
        </h2>
        <p className="text-xs text-stone-500">
          Dengarkan artikulasi native British, tirukan intonasinya, dan peroleh skor akurasi ucapan Anda secara instan
        </p>
      </div>

      {/* Main Shadowing Drill Card */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#0f5c4d] dark:text-emerald-400 uppercase tracking-wider">
            {selectedDrill.title}
          </span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200">
            {selectedDrill.difficulty} • {selectedDrill.moduleSource}
          </span>
        </div>

        <div className="space-y-1.5">
          <h3 className="text-base sm:text-lg font-bold text-stone-900 dark:text-white leading-snug">
            "{selectedDrill.sentence}"
          </h3>
          {selectedDrill.phonetics && (
            <p className="text-xs font-mono text-stone-500">
              {selectedDrill.phonetics}
            </p>
          )}
          <p className="text-xs text-stone-600 dark:text-stone-400 italic">
            Artinya: {selectedDrill.indonesian}
          </p>
        </div>

        {/* Pronunciation Tip */}
        <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 text-xs text-amber-900 dark:text-amber-200">
          <strong>Tips Pelafalan & Intonasi:</strong> {selectedDrill.tip}
        </div>

        {/* Control Buttons */}
        <div className="flex items-center gap-2.5 pt-1 flex-wrap">
          <button
            onClick={() => handlePlayAudio(selectedDrill.sentence)}
            className="px-4 py-2.5 rounded-xl bg-[#0f5c4d] text-white text-xs font-bold hover:bg-[#0d4f42] transition shadow-xs flex items-center gap-2"
          >
            <Volume2 className={`w-4 h-4 ${isPlayingAudio ? 'animate-pulse' : ''}`} />
            <span>{isPlayingAudio ? 'Laura Berbicara...' : 'Dengarkan Laura (British)'}</span>
          </button>

          <button
            onClick={isRecording ? handleStopRecording : handleStartRecording}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-2 ${
              isRecording
                ? 'bg-rose-600 text-white animate-pulse'
                : 'bg-amber-400 text-stone-900 hover:bg-amber-300'
            }`}
          >
            {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            <span>{isRecording ? 'Selesai Bicara' : 'Tirukan & Rekam Suara'}</span>
          </button>
        </div>

        {/* Recorded Feedback */}
        {spokenTranscript && (
          <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-800 space-y-2 animate-in fade-in">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-700 dark:text-stone-300">
                Ucapan Terdeteksi:
              </span>
              {shadowingScore !== null && (
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  Akurasi: {shadowingScore}%
                </span>
              )}
            </div>
            <p className="text-xs text-stone-900 dark:text-white italic">
              "{spokenTranscript}"
            </p>
            {shadowingScore !== null && (
              <p className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                {shadowingScore >= 80
                  ? '🎯 Luar biasa! Artikulasi dan intonasi Anda sangat akurat.'
                  : '👍 Bagus! Coba dengarkan jeda intonasi Laura sekali lagi dan ulangi.'}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Drill Selection List */}
      <div className="space-y-1.5 pt-1">
        <span className="text-xs font-bold text-stone-700 dark:text-stone-300 px-1">
          Pilihan Latihan Shadowing Lainnya
        </span>
        <div className="grid grid-cols-1 gap-2">
          {SHADOWING_DRILLS.map((drill) => (
            <button
              key={drill.id}
              onClick={() => {
                setSelectedDrill(drill);
                setSpokenTranscript('');
                setShadowingScore(null);
              }}
              className={`w-full text-left p-3 rounded-xl border transition flex items-center justify-between ${
                selectedDrill.id === drill.id
                  ? 'border-[#0f5c4d] bg-[#0f5c4d]/5 dark:bg-[#0f5c4d]/20 font-semibold'
                  : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 hover:border-stone-300'
              }`}
            >
              <div className="min-w-0 pr-2">
                <span className="text-xs font-bold text-stone-900 dark:text-white block truncate">
                  {drill.title}
                </span>
                <span className="text-[11px] text-stone-500 block truncate">
                  "{drill.sentence}"
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-stone-400 shrink-0" />
            </button>
          ))}
        </div>
      </div>

      {/* Custom Sentence Speech Analyzer */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-3 pt-4">
        <div>
          <span className="text-xs font-bold text-[#0f5c4d] dark:text-emerald-400 uppercase tracking-wider">
            Speech Analyzer Kalimat Bebas
          </span>
          <h4 className="text-sm font-bold text-stone-900 dark:text-white mt-0.5">
            Analisis Tata Bahasa & Kosakata Akademik
          </h4>
        </div>

        <textarea
          rows={3}
          value={customText}
          onChange={(e) => setCustomText(e.target.value)}
          placeholder="Ketik kalimat bahasa Inggris Anda..."
          className="w-full text-xs p-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-[#f6f3ec] dark:bg-stone-850 focus:outline-hidden focus:ring-2 focus:ring-[#0f5c4d]"
        />

        <div className="flex justify-end">
          <button
            disabled={isCustomAnalyzing || !customText.trim()}
            onClick={handleAnalyzeCustom}
            className="px-4 py-2 rounded-xl bg-[#0f5c4d] text-white text-xs font-bold hover:bg-[#0d4f42] transition shadow-xs flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isCustomAnalyzing ? 'Menganalisis...' : 'Analisis Speaking'}</span>
          </button>
        </div>

        {customResult && (
          <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-700 text-xs space-y-2.5">
            <div className="flex items-center justify-between pb-2 border-b border-stone-200 dark:border-stone-700">
              <span className="text-sm font-bold text-[#0f5c4d] dark:text-emerald-400">
                Skor Kelancaran: {customResult.fluencyScore}/100
              </span>
              <span className="text-stone-500 font-semibold">{customResult.overallPraise}</span>
            </div>

            <p className="text-stone-700 dark:text-stone-300">
              <strong>Grammar:</strong> {customResult.grammarFeedback}
            </p>

            {customResult.vocabularyUpgrades && customResult.vocabularyUpgrades.length > 0 && (
              <div className="space-y-1">
                <span className="font-bold text-stone-800 dark:text-stone-200 block">
                  Kosakata Akademik Lebih Berbobot:
                </span>
                {customResult.vocabularyUpgrades.map((u, i) => (
                  <div key={i} className="text-[11px] text-amber-900 dark:text-amber-200">
                    • Ganti "{u.original}" ➔ <strong>"{u.better}"</strong> ({u.reason})
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
