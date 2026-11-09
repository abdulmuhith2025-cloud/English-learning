import React, { useState, useEffect } from 'react';
import { BetterSpeakProfile } from '../../types';
import {
  BETTER_SPEAK_QUIZ_QUESTIONS,
  DIAGNOSTIC_LISTENING_QUESTION,
} from '../../data/betterSpeakData';
import { StorageManager } from '../../utils/storage';
import { unlockSpeechAudio, speakTextQueue, cancelSpeech } from '../../utils/speech';
import {
  Sparkles,
  Volume2,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Trophy,
  Target,
  Clock,
  BookOpen,
  RotateCcw,
  Award,
} from 'lucide-react';

interface PlacementQuizTabProps {
  onStartSpeaking?: () => void;
  onNavigateHome?: () => void;
}

export const PlacementQuizTab: React.FC<PlacementQuizTabProps> = ({
  onStartSpeaking,
  onNavigateHome,
}) => {
  const [step, setStep] = useState(0); // 0..3 standard questions, 4 diagnostic test, 5 analyzing animation, 6 result
  const [selectedGoal, setSelectedGoal] = useState<string>('academic');
  const [selectedLevel, setSelectedLevel] = useState<'beginner' | 'elementary' | 'intermediate' | 'advanced'>('elementary');
  const [selectedObstacle, setSelectedObstacle] = useState<string>('grammar');
  const [selectedTime, setSelectedTime] = useState<number>(10);
  const [diagnosticAnswer, setDiagnosticAnswer] = useState<string | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisPhase, setAnalysisPhase] = useState('Menganalisis kenyamanan berbicara Anda...');
  const [finalProfile, setFinalProfile] = useState<BetterSpeakProfile | null>(() =>
    StorageManager.getBetterSpeakProfile()
  );

  useEffect(() => {
    const existing = StorageManager.getBetterSpeakProfile();
    if (existing) {
      setFinalProfile(existing);
      setSelectedGoal(existing.goal || 'academic');
      setSelectedLevel(existing.currentLevel || 'elementary');
      setSelectedObstacle(existing.biggestChallenge || 'grammar');
      setSelectedTime(existing.dailyCommitment || 10);
      setStep(6); // Show existing result first
    }
  }, []);

  const handlePlayDiagnosticAudio = () => {
    unlockSpeechAudio();
    cancelSpeech();
    setIsPlayingAudio(true);
    const settings = StorageManager.getSettings();
    speakTextQueue(DIAGNOSTIC_LISTENING_QUESTION.audioPrompt, {
      preferredIdVoice: settings.preferredIdVoice,
      preferredEnVoice: settings.preferredEnVoice,
      rate: 0.95,
      pitch: 1.0,
      onEnd: () => setIsPlayingAudio(false),
      onError: () => setIsPlayingAudio(false),
    });
  };

  // Step 5: Analyzing animation runner
  useEffect(() => {
    if (step === 5) {
      let currentProgress = 0;
      const interval = setInterval(() => {
        currentProgress += 12;
        if (currentProgress >= 100) {
          currentProgress = 100;
          clearInterval(interval);

          const isCorrect = diagnosticAnswer === 'a';
          let initialFluency = 65;
          if (selectedLevel === 'beginner') initialFluency = 45;
          if (selectedLevel === 'elementary') initialFluency = 65;
          if (selectedLevel === 'intermediate') initialFluency = 78;
          if (selectedLevel === 'advanced') initialFluency = 88;
          if (isCorrect) initialFluency += 8;

          const targetCefrMap: Record<string, string> = {
            academic: 'B2 Academic & Lecturing Fluency',
            dissertation: 'B2-C1 Scholarly Defense & Publication',
            conference: 'B2 International Seminar Fluency',
            daily: 'B1-B2 Confident Communicator',
            confidence: 'A2-B1 Fearless Speaker',
          };

          const calculatedProfile: BetterSpeakProfile = {
            completedAt: new Date().toISOString(),
            goal: selectedGoal,
            currentLevel: selectedLevel,
            biggestChallenge: selectedObstacle,
            dailyCommitment: selectedTime,
            miniTestScore: isCorrect ? 100 : 50,
            fluencyScore: Math.min(initialFluency, 95),
            targetCefr: targetCefrMap[selectedGoal] || 'B2 Academic Fluency',
            personalizedPlan: `Latihan speaking ${selectedTime} menit/hari dengan fokus Modul English-01 & English-02 karya Abdul Muhit, M.Pd, dipandu oleh AI Tutor Laura Thompson.`,
          };

          StorageManager.saveBetterSpeakProfile(calculatedProfile);
          setFinalProfile(calculatedProfile);

          setTimeout(() => {
            setStep(6);
          }, 400);
        } else {
          setAnalysisProgress(currentProgress);
          if (currentProgress < 35) {
            setAnalysisPhase('Menganalisis pola kalimat & reflek berbicara...');
          } else if (currentProgress < 70) {
            setAnalysisPhase('Memetakan materi Modul English-01 & 02 karya Abdul Muhit, M.Pd...');
          } else {
            setAnalysisPhase('Mengkalibrasi aksen & intonasi AI Laura Thompson...');
          }
        }
      }, 160);

      return () => clearInterval(interval);
    }
  }, [step, selectedGoal, selectedLevel, selectedObstacle, selectedTime, diagnosticAnswer]);

  const totalSteps = 5;

  return (
    <div className="space-y-4 pb-20 max-w-2xl mx-auto">
      {/* Top Banner */}
      <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-[#0f5c4d] to-[#124d41] text-white shadow-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-400 text-stone-900 rounded-2xl font-bold">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-academic-heading text-base sm:text-lg font-bold">
                BetterSpeak™ Placement Quiz
              </h2>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-400/20 text-amber-200 px-2 py-0.5 rounded-full border border-amber-300/30">
                100% Gratis
              </span>
            </div>
            <p className="text-xs text-emerald-200">
              Tes Diagnostik Kemampuan Speaking & Roadmap AI Personal
            </p>
          </div>
        </div>

        {step === 6 && (
          <button
            onClick={() => setStep(0)}
            className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Tes Ulang</span>
          </button>
        )}
      </div>

      {/* Progress Bar */}
      {step < 5 && (
        <div className="w-full bg-stone-200 dark:bg-stone-800 h-2 rounded-full overflow-hidden">
          <div
            className="bg-amber-400 h-2 transition-all duration-300 rounded-full"
            style={{ width: `${((step + 1) / totalSteps) * 100}%` }}
          />
        </div>
      )}

      {/* Card Content */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
        {/* STEP 0: Goal */}
        {step === 0 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div>
              <span className="text-[11px] font-bold text-[#0f5c4d] uppercase tracking-wider">
                Langkah 1 dari 5
              </span>
              <h3 className="text-base sm:text-lg font-bold text-stone-900 dark:text-white mt-0.5">
                {BETTER_SPEAK_QUIZ_QUESTIONS[0].title}
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                {BETTER_SPEAK_QUIZ_QUESTIONS[0].subtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {BETTER_SPEAK_QUIZ_QUESTIONS[0].options.map((opt) => {
                const isSelected = selectedGoal === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setSelectedGoal(opt.id)}
                    className={`w-full text-left p-3.5 rounded-2xl border-2 transition flex items-start gap-3 ${
                      isSelected
                        ? 'border-[#0f5c4d] bg-[#0f5c4d]/5 dark:bg-[#0f5c4d]/20 shadow-xs'
                        : 'border-stone-200 dark:border-stone-800 hover:border-[#0f5c4d]/40 bg-white dark:bg-stone-850'
                    }`}
                  >
                    <span className="text-2xl shrink-0 mt-0.5">{opt.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-stone-900 dark:text-white">
                          {opt.label}
                        </span>
                        {isSelected && (
                          <CheckCircle2 className="w-5 h-5 text-[#0f5c4d] shrink-0 ml-2" />
                        )}
                      </div>
                      <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5 leading-relaxed">
                        {opt.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 1: Current Level */}
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div>
              <span className="text-[11px] font-bold text-[#0f5c4d] uppercase tracking-wider">
                Langkah 2 dari 5
              </span>
              <h3 className="text-base sm:text-lg font-bold text-stone-900 dark:text-white mt-0.5">
                {BETTER_SPEAK_QUIZ_QUESTIONS[1].title}
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                {BETTER_SPEAK_QUIZ_QUESTIONS[1].subtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {BETTER_SPEAK_QUIZ_QUESTIONS[1].options.map((opt) => {
                const isSelected = selectedLevel === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setSelectedLevel(opt.id as any)}
                    className={`w-full text-left p-3.5 rounded-2xl border-2 transition flex items-start gap-3 ${
                      isSelected
                        ? 'border-[#0f5c4d] bg-[#0f5c4d]/5 dark:bg-[#0f5c4d]/20 shadow-xs'
                        : 'border-stone-200 dark:border-stone-800 hover:border-[#0f5c4d]/40 bg-white dark:bg-stone-850'
                    }`}
                  >
                    <span className="text-2xl shrink-0 mt-0.5">{opt.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-stone-900 dark:text-white">
                          {opt.label}
                        </span>
                        {isSelected && (
                          <CheckCircle2 className="w-5 h-5 text-[#0f5c4d] shrink-0 ml-2" />
                        )}
                      </div>
                      <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5 leading-relaxed">
                        {opt.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 2: Obstacle */}
        {step === 2 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div>
              <span className="text-[11px] font-bold text-[#0f5c4d] uppercase tracking-wider">
                Langkah 3 dari 5
              </span>
              <h3 className="text-base sm:text-lg font-bold text-stone-900 dark:text-white mt-0.5">
                {BETTER_SPEAK_QUIZ_QUESTIONS[2].title}
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                {BETTER_SPEAK_QUIZ_QUESTIONS[2].subtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {BETTER_SPEAK_QUIZ_QUESTIONS[2].options.map((opt) => {
                const isSelected = selectedObstacle === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setSelectedObstacle(opt.id)}
                    className={`w-full text-left p-3.5 rounded-2xl border-2 transition flex items-start gap-3 ${
                      isSelected
                        ? 'border-[#0f5c4d] bg-[#0f5c4d]/5 dark:bg-[#0f5c4d]/20 shadow-xs'
                        : 'border-stone-200 dark:border-stone-800 hover:border-[#0f5c4d]/40 bg-white dark:bg-stone-850'
                    }`}
                  >
                    <span className="text-2xl shrink-0 mt-0.5">{opt.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-stone-900 dark:text-white">
                          {opt.label}
                        </span>
                        {isSelected && (
                          <CheckCircle2 className="w-5 h-5 text-[#0f5c4d] shrink-0 ml-2" />
                        )}
                      </div>
                      <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5 leading-relaxed">
                        {opt.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 3: Daily Target */}
        {step === 3 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div>
              <span className="text-[11px] font-bold text-[#0f5c4d] uppercase tracking-wider">
                Langkah 4 dari 5
              </span>
              <h3 className="text-base sm:text-lg font-bold text-stone-900 dark:text-white mt-0.5">
                {BETTER_SPEAK_QUIZ_QUESTIONS[3].title}
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                {BETTER_SPEAK_QUIZ_QUESTIONS[3].subtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {BETTER_SPEAK_QUIZ_QUESTIONS[3].options.map((opt) => {
                const timeNum = parseInt(opt.id, 10);
                const isSelected = selectedTime === timeNum;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setSelectedTime(timeNum)}
                    className={`w-full text-left p-3.5 rounded-2xl border-2 transition flex items-start gap-3 ${
                      isSelected
                        ? 'border-[#0f5c4d] bg-[#0f5c4d]/5 dark:bg-[#0f5c4d]/20 shadow-xs'
                        : 'border-stone-200 dark:border-stone-800 hover:border-[#0f5c4d]/40 bg-white dark:bg-stone-850'
                    }`}
                  >
                    <span className="text-2xl shrink-0 mt-0.5">{opt.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-stone-900 dark:text-white">
                          {opt.label}
                        </span>
                        {isSelected && (
                          <CheckCircle2 className="w-5 h-5 text-[#0f5c4d] shrink-0 ml-2" />
                        )}
                      </div>
                      <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5 leading-relaxed">
                        {opt.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 4: Interactive Diagnostic Listening Test */}
        {step === 4 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div>
              <span className="text-[11px] font-bold text-[#0f5c4d] uppercase tracking-wider">
                Langkah 5 dari 5: Tes Interaktif Cepat
              </span>
              <h3 className="text-base sm:text-lg font-bold text-stone-900 dark:text-white mt-0.5">
                Dengarkan Pertanyaan Laura & Pilih Respons Terbaik
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                {DIAGNOSTIC_LISTENING_QUESTION.context}
              </p>
            </div>

            {/* Audio Player Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-[#0f5c4d] to-[#165a4c] text-white shadow-md flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-amber-300 shadow-sm shrink-0">
                  <img
                    src="/laura_portrait.jpg"
                    alt="Laura"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-200">
                    Laura Thompson (British Voice)
                  </span>
                  <p className="text-xs text-emerald-100 italic line-clamp-2 mt-0.5">
                    "{DIAGNOSTIC_LISTENING_QUESTION.audioPrompt}"
                  </p>
                </div>
              </div>

              <button
                onClick={handlePlayDiagnosticAudio}
                className="px-3.5 py-2 rounded-xl bg-amber-400 text-stone-900 text-xs font-bold hover:bg-amber-300 transition shadow-sm shrink-0 flex items-center gap-1.5"
              >
                <Volume2 className={`w-4 h-4 ${isPlayingAudio ? 'animate-pulse text-stone-900' : ''}`} />
                <span>{isPlayingAudio ? 'Memutar...' : 'Putar Suara'}</span>
              </button>
            </div>

            {/* Options */}
            <div className="space-y-2">
              <p className="text-xs font-bold text-stone-700 dark:text-stone-300">
                {DIAGNOSTIC_LISTENING_QUESTION.instruction}
              </p>

              {DIAGNOSTIC_LISTENING_QUESTION.options.map((opt) => {
                const isSelected = diagnosticAnswer === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setDiagnosticAnswer(opt.id)}
                    className={`w-full text-left p-3.5 rounded-2xl border-2 transition ${
                      isSelected
                        ? 'border-[#0f5c4d] bg-[#0f5c4d]/5 dark:bg-[#0f5c4d]/20 shadow-xs'
                        : 'border-stone-200 dark:border-stone-800 hover:border-[#0f5c4d]/40 bg-white dark:bg-stone-850'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs sm:text-sm font-semibold text-stone-900 dark:text-white leading-relaxed">
                        "{opt.text}"
                      </span>
                      {isSelected && (
                        <CheckCircle2 className="w-5 h-5 text-[#0f5c4d] shrink-0 ml-2" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 5: Analysis Animation */}
        {step === 5 && (
          <div className="py-10 text-center space-y-6 animate-in fade-in duration-300">
            <div className="relative w-24 h-24 mx-auto">
              <div className="w-24 h-24 rounded-full border-4 border-stone-200 dark:border-stone-700 border-t-[#0f5c4d] animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center font-bold text-lg text-[#0f5c4d]">
                {analysisProgress}%
              </div>
            </div>

            <div className="space-y-2 max-w-sm mx-auto">
              <h3 className="text-base font-bold text-stone-900 dark:text-white">
                Menyusun Roadmap Speaking BetterSpeak Anda
              </h3>
              <p className="text-xs text-stone-500 animate-pulse">
                {analysisPhase}
              </p>
            </div>
          </div>
        )}

        {/* STEP 6: Result & Personalized Roadmap */}
        {step === 6 && finalProfile && (
          <div className="space-y-4 animate-in zoom-in-95 duration-200">
            {/* Score Showcase */}
            <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-[#0f5c4d] via-[#135346] to-[#0c3f35] text-white shadow-xl relative overflow-hidden">
              <div className="relative z-10 flex items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 bg-white/10 px-2.5 py-0.5 rounded-full">
                    Hasil Evaluasi Speaking
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold font-academic-heading text-white mt-1.5">
                    {finalProfile.targetCefr}
                  </h3>
                  <p className="text-xs text-emerald-100/90 mt-1">
                    Silabus: Modul English-01 & 02 karya Abdul Muhit, M.Pd (PTIQ)
                  </p>
                </div>

                <div className="text-center bg-white/10 p-3 rounded-2xl backdrop-blur-xs border border-white/20 shrink-0">
                  <span className="text-[10px] uppercase font-bold text-amber-200 block">
                    Fluency Index
                  </span>
                  <span className="text-3xl font-extrabold text-amber-300">
                    {finalProfile.fluencyScore}%
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-white/20 text-xs">
                <div className="flex items-center gap-1.5 text-emerald-100">
                  <Clock className="w-4 h-4 text-amber-300 shrink-0" />
                  <span>Target: {finalProfile.dailyCommitment} mnt/hari</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-100">
                  <Target className="w-4 h-4 text-amber-300 shrink-0" />
                  <span>Level: {finalProfile.currentLevel.toUpperCase()}</span>
                </div>
              </div>
            </div>

            {/* Action Plan Details */}
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 space-y-2">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-600" />
                <span className="text-xs font-bold text-amber-900 dark:text-amber-200 uppercase tracking-wider">
                  Roadmap Belajar Terpersonalisasi
                </span>
              </div>
              <p className="text-xs text-amber-950 dark:text-amber-100 leading-relaxed">
                {finalProfile.personalizedPlan}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => setStep(0)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800 transition flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Ulangi Tes</span>
              </button>

              <button
                onClick={onStartSpeaking}
                className="px-5 py-2.5 rounded-xl bg-[#0f5c4d] text-white text-xs font-bold hover:bg-[#0d4f42] transition shadow-md flex items-center gap-2"
              >
                <span>Mulai Speaking dengan Laura</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step Navigation Bar */}
        {step < 5 && (
          <div className="flex items-center justify-between pt-3 border-t border-stone-100 dark:border-stone-800">
            {step > 0 ? (
              <button
                onClick={() => setStep(step - 1)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Kembali</span>
              </button>
            ) : (
              <div />
            )}

            {step < 4 ? (
              <button
                onClick={() => setStep(step + 1)}
                className="px-5 py-2.5 rounded-xl bg-[#0f5c4d] text-white text-xs font-bold hover:bg-[#0d4f42] transition shadow-sm flex items-center gap-2"
              >
                <span>Lanjut</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : step === 4 ? (
              <button
                disabled={!diagnosticAnswer}
                onClick={() => setStep(5)}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition shadow-sm flex items-center gap-2 ${
                  diagnosticAnswer
                    ? 'bg-amber-400 text-stone-900 hover:bg-amber-300'
                    : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                }`}
              >
                <span>Lihat Hasil & Rencana Saya</span>
                <Sparkles className="w-4 h-4" />
              </button>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
};
