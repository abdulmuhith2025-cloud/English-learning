import React, { useState } from 'react';
import { SpeakingScenario } from '../../types';
import { BETTER_SPEAK_SCENARIOS } from '../../data/betterSpeakData';
import {
  MessageSquare,
  ArrowRight,
  Sparkles,
  BookOpen,
  GraduationCap,
  Users,
  Compass,
} from 'lucide-react';

interface ScenariosTabProps {
  onStartScenario: (scenario: SpeakingScenario) => void;
  onOpenCurriculum: () => void;
}

export const ScenariosTab: React.FC<ScenariosTabProps> = ({
  onStartScenario,
  onOpenCurriculum,
}) => {
  const [filter, setFilter] = useState<'all' | 'academic' | 'campus' | 'presentation' | 'daily'>('all');

  const filtered = filter === 'all'
    ? BETTER_SPEAK_SCENARIOS
    : BETTER_SPEAK_SCENARIOS.filter((s) => s.category === filter);

  return (
    <div className="space-y-4 pb-20 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-academic-heading text-lg font-bold text-stone-900 dark:text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-[#0f5c4d]" />
            <span>Skenario Percakapan Nyata (Speaking Roleplays)</span>
          </h2>
          <p className="text-xs text-stone-500">
            Simulasi situasi akademik, perkuliahan, dan percakapan kampus bersama AI Laura
          </p>
        </div>

        <button
          onClick={onOpenCurriculum}
          className="text-xs font-bold text-[#0f5c4d] hover:underline flex items-center gap-1"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Silabus PTIQ</span>
        </button>
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-xl font-bold transition shrink-0 ${
            filter === 'all'
              ? 'bg-[#0f5c4d] text-white shadow-xs'
              : 'bg-white dark:bg-stone-850 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700'
          }`}
        >
          Semua Skenario
        </button>
        <button
          onClick={() => setFilter('academic')}
          className={`px-3 py-1.5 rounded-xl font-bold transition shrink-0 ${
            filter === 'academic'
              ? 'bg-[#0f5c4d] text-white shadow-xs'
              : 'bg-white dark:bg-stone-850 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700'
          }`}
        >
          🎓 Akademik & Perkuliahan
        </button>
        <button
          onClick={() => setFilter('presentation')}
          className={`px-3 py-1.5 rounded-xl font-bold transition shrink-0 ${
            filter === 'presentation'
              ? 'bg-[#0f5c4d] text-white shadow-xs'
              : 'bg-white dark:bg-stone-850 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700'
          }`}
        >
          🎤 Konferensi & Presentasi
        </button>
        <button
          onClick={() => setFilter('campus')}
          className={`px-3 py-1.5 rounded-xl font-bold transition shrink-0 ${
            filter === 'campus'
              ? 'bg-[#0f5c4d] text-white shadow-xs'
              : 'bg-white dark:bg-stone-850 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700'
          }`}
        >
          🏛️ Kampus & Networking
        </button>
        <button
          onClick={() => setFilter('daily')}
          className={`px-3 py-1.5 rounded-xl font-bold transition shrink-0 ${
            filter === 'daily'
              ? 'bg-[#0f5c4d] text-white shadow-xs'
              : 'bg-white dark:bg-stone-850 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700'
          }`}
        >
          ☕ Harian & Kasual
        </button>
      </div>

      {/* Scenario Cards */}
      <div className="grid grid-cols-1 gap-3.5">
        {filtered.map((scenario) => (
          <div
            key={scenario.id}
            className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs hover:border-[#0f5c4d]/50 transition space-y-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#0f5c4d]/10 text-[#0f5c4d] dark:bg-emerald-950 dark:text-emerald-300">
                    {scenario.level}
                  </span>
                  <span className="text-[10px] text-stone-500 font-semibold">
                    {scenario.referenceModule}
                  </span>
                </div>
                <h3 className="font-academic-heading text-base font-bold text-stone-900 dark:text-white mt-1">
                  {scenario.title}
                </h3>
                <p className="text-xs text-stone-600 dark:text-stone-400 mt-0.5 leading-relaxed">
                  {scenario.description}
                </p>
              </div>

              <button
                onClick={() => onStartScenario(scenario)}
                className="shrink-0 px-3.5 py-2 rounded-xl bg-[#0f5c4d] text-white text-xs font-bold hover:bg-[#0d4f42] transition shadow-xs flex items-center gap-1.5"
              >
                <span>Mulai Simulasi</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Role details */}
            <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-850 border border-stone-200/60 dark:border-stone-750 text-xs space-y-1.5">
              <div className="text-stone-700 dark:text-stone-300">
                <strong>Peran Anda:</strong> {scenario.userRole} • <strong>Laura:</strong> {scenario.lauraRole}
              </div>
              <div className="text-stone-600 dark:text-stone-400 italic">
                "{scenario.promptStarter}"
              </div>
            </div>

            {/* Key phrases */}
            {scenario.keyPhrases && scenario.keyPhrases.length > 0 && (
              <div className="space-y-1 pt-1">
                <span className="text-[10px] font-bold uppercase text-stone-400">
                  Frasa Rekomendasi:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {scenario.keyPhrases.map((phrase, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/20 text-amber-900 dark:text-amber-200 border border-amber-200/60 dark:border-amber-800/40"
                    >
                      "{phrase}"
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
