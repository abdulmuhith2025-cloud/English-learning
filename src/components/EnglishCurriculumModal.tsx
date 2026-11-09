import React, { useState } from 'react';
import {
  ALL_ENGLISH_MODULES,
  CurriculumUnit,
  EnglishModule,
} from '../data/englishCurriculum';
import {
  X,
  BookOpen,
  Download,
  GraduationCap,
  Sparkles,
  MessageSquare,
  ChevronRight,
  ChevronDown,
  CheckCircle2,
  Bookmark,
  ExternalLink,
  BookMarked,
  Layers,
} from 'lucide-react';

interface EnglishCurriculumModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectUnitToLearn?: (unit: CurriculumUnit) => void;
}

export const EnglishCurriculumModal: React.FC<EnglishCurriculumModalProps> = ({
  isOpen,
  onClose,
  onSelectUnitToLearn,
}) => {
  const [selectedSemester, setSelectedSemester] = useState<1 | 2>(2);
  const [expandedUnitId, setExpandedUnitId] = useState<string | null>('sem2-u1');

  if (!isOpen) return null;

  const currentModule: EnglishModule =
    ALL_ENGLISH_MODULES.find((m) => m.semester === selectedSemester) ||
    ALL_ENGLISH_MODULES[1];

  const toggleUnit = (id: string) => {
    setExpandedUnitId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#f6f3ec] dark:bg-stone-900 w-full max-w-2xl max-h-[90vh] rounded-3xl shadow-2xl border border-[#0f5c4d]/20 flex flex-col overflow-hidden">
        {/* Top Header */}
        <div className="bg-[#0f5c4d] text-white p-4 sm:p-5 flex items-start justify-between relative shrink-0">
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-white/10 rounded-2xl border border-white/15">
              <BookOpen className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-400 text-stone-900 px-2 py-0.5 rounded-full">
                  Acuan Ajar Resmi
                </span>
                <span className="text-xs text-emerald-200 font-medium">Universitas PTIQ Jakarta</span>
              </div>
              <h2 className="font-academic-heading text-lg sm:text-xl font-bold mt-1 text-white">
                Silabus Modul English 01 & 02
              </h2>
              <p className="text-xs text-emerald-100/90 mt-0.5">
                Karya: <strong className="text-amber-200">Abdul Muhit, M.Pd</strong> • Lembaga Bahasa & Budaya
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-emerald-100 hover:text-white hover:bg-emerald-800/60 transition min-w-[36px] min-h-[36px] flex items-center justify-center"
            title="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Semester Tab Switcher */}
        <div className="bg-emerald-950/20 dark:bg-stone-950/40 p-2.5 border-b border-stone-200 dark:border-stone-800 flex gap-2 shrink-0">
          <button
            onClick={() => {
              setSelectedSemester(1);
              setExpandedUnitId('sem1-u1');
            }}
            className={`flex-1 py-2.5 px-3 rounded-2xl text-xs font-bold transition flex items-center justify-center gap-2 ${
              selectedSemester === 1
                ? 'bg-[#0f5c4d] text-white shadow-sm'
                : 'bg-white/70 dark:bg-stone-800/70 text-stone-700 dark:text-stone-300 hover:bg-white'
            }`}
          >
            <Layers className="w-4 h-4 text-amber-300" />
            <div className="text-left leading-tight">
              <div>Modul English-01</div>
              <div className="text-[10px] font-normal opacity-85">Semester 1 (Integrated Skills)</div>
            </div>
          </button>

          <button
            onClick={() => {
              setSelectedSemester(2);
              setExpandedUnitId('sem2-u1');
            }}
            className={`flex-1 py-2.5 px-3 rounded-2xl text-xs font-bold transition flex items-center justify-center gap-2 ${
              selectedSemester === 2
                ? 'bg-[#0f5c4d] text-white shadow-sm'
                : 'bg-white/70 dark:bg-stone-800/70 text-stone-700 dark:text-stone-300 hover:bg-white'
            }`}
          >
            <GraduationCap className="w-4 h-4 text-amber-300" />
            <div className="text-left leading-tight">
              <div>Modul English-02</div>
              <div className="text-[10px] font-normal opacity-85">Semester 2 (Productive Skills)</div>
            </div>
          </button>
        </div>

        {/* Module Meta Banner & Direct PDF Link */}
        <div className="p-3.5 bg-amber-500/10 dark:bg-amber-500/5 border-b border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          <div className="text-xs">
            <h3 className="font-bold text-[#0f5c4d] dark:text-emerald-400">
              {currentModule.title} ({currentModule.cefrLevel})
            </h3>
            <p className="text-[11px] text-stone-600 dark:text-stone-400 mt-0.5 line-clamp-1">
              {currentModule.description}
            </p>
          </div>

          <a
            href={currentModule.pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            download
            className="inline-flex items-center gap-1.5 bg-[#0f5c4d] hover:bg-[#0d4f42] text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-xs transition shrink-0"
            title="Unduh / Buka Dokumen PDF Modul"
          >
            <Download className="w-3.5 h-3.5 text-amber-300" />
            <span>Unduh PDF Modul</span>
            <ExternalLink className="w-3 h-3 opacity-70" />
          </a>
        </div>

        {/* Scrollable Units List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {currentModule.units.map((unit) => {
            const isExpanded = expandedUnitId === unit.id;
            return (
              <div
                key={unit.id}
                className="bg-white dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700 overflow-hidden shadow-xs transition"
              >
                {/* Unit Header Accordion Bar */}
                <button
                  onClick={() => toggleUnit(unit.id)}
                  className="w-full p-3.5 sm:p-4 text-left flex items-start justify-between gap-3 hover:bg-stone-50 dark:hover:bg-stone-750 transition"
                >
                  <div className="flex items-start gap-3">
                    <span className="w-7 h-7 rounded-xl bg-[#0f5c4d]/10 dark:bg-emerald-400/15 text-[#0f5c4d] dark:text-emerald-300 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {unit.unitNumber}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-academic-heading font-bold text-sm text-stone-900 dark:text-white">
                          Unit {unit.unitNumber}: {unit.title}
                        </h4>
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                          {unit.cefrLevel}
                        </span>
                      </div>
                      <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                        {unit.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 p-1 text-stone-400">
                    {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                  </div>
                </button>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="p-4 pt-1 border-t border-stone-100 dark:border-stone-700/60 bg-stone-50/50 dark:bg-stone-850/50 space-y-4 text-xs">
                    {/* Theme & Outcomes */}
                    <div className="bg-white dark:bg-stone-800 p-3 rounded-xl border border-stone-200 dark:border-stone-700">
                      <p className="font-semibold text-stone-700 dark:text-stone-300 mb-1.5 flex items-center gap-1.5">
                        <Bookmark className="w-3.5 h-3.5 text-[#0f5c4d]" />
                        <span>Tema: {unit.theme}</span>
                      </p>
                      <div className="space-y-1">
                        {unit.learningOutcomes.map((outcome, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-stone-600 dark:text-stone-300 text-[11px]">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{outcome}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Speaking & Writing Focus */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50">
                        <span className="font-bold text-[#0f5c4d] dark:text-emerald-300 block mb-1">
                          🎙️ Speaking Focus:
                        </span>
                        <p className="text-stone-700 dark:text-stone-300 text-[11px]">
                          {unit.speakingFocus}
                        </p>
                      </div>

                      <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50">
                        <span className="font-bold text-[#a87a08] dark:text-amber-300 block mb-1">
                          ✍️ Writing Focus:
                        </span>
                        <p className="text-stone-700 dark:text-stone-300 text-[11px]">
                          {unit.writingFocus}
                        </p>
                      </div>
                    </div>

                    {/* Grammar Focus */}
                    <div className="p-3 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 space-y-2">
                      <span className="font-bold text-stone-900 dark:text-white block">
                        📐 Grammar Focus: {unit.grammarFocus.topic}
                      </span>
                      <ul className="list-disc list-inside space-y-1 text-stone-600 dark:text-stone-300 text-[11px]">
                        {unit.grammarFocus.rules.map((rule, idx) => (
                          <li key={idx}>{rule}</li>
                        ))}
                      </ul>
                      <div className="pt-1.5 border-t border-stone-100 dark:border-stone-700">
                        <p className="text-[10px] uppercase font-bold text-stone-400">Contoh Kalimat:</p>
                        {unit.grammarFocus.examples.map((ex, idx) => (
                          <p key={idx} className="text-stone-700 dark:text-stone-200 text-[11px] italic mt-0.5">
                            • {ex}
                          </p>
                        ))}
                      </div>
                    </div>

                    {/* Academic Vocabulary Table */}
                    <div className="p-3 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
                      <span className="font-bold text-stone-900 dark:text-white block mb-2">
                        📖 Academic Vocabulary ({unit.academicVocabulary.length} Kosakata Kunci)
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                        {unit.academicVocabulary.map((item, idx) => (
                          <div key={idx} className="p-2 rounded-lg bg-stone-50 dark:bg-stone-750 border border-stone-100 dark:border-stone-700">
                            <span className="font-bold text-[#0f5c4d] dark:text-emerald-400">{item.word}</span>
                            <span className="text-stone-500 dark:text-stone-400 ml-1.5">({item.meaning})</span>
                            {item.example && (
                              <p className="text-[10px] text-stone-500 italic mt-0.5">"{item.example}"</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Qur'anic Insight */}
                    <div className="p-3.5 rounded-2xl bg-emerald-900 text-white shadow-sm space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
                          Qur'anic Insight
                        </span>
                        <span className="text-[10px] text-emerald-200 font-semibold">
                          {unit.quranicInsight.surah} ({unit.quranicInsight.verse})
                        </span>
                      </div>
                      <p className="text-base font-arabic text-amber-100 text-right leading-loose">
                        {unit.quranicInsight.arabic}
                      </p>
                      <p className="text-[11px] text-emerald-100 italic leading-relaxed">
                        "{unit.quranicInsight.translation}"
                      </p>
                      <p className="text-[11px] text-emerald-200/90 pt-1 border-t border-emerald-800/80">
                        <strong>Refleksi Karakter:</strong> {unit.quranicInsight.reflection}
                      </p>
                    </div>

                    {/* Model Dialogue / Text */}
                    <div className="p-3 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
                      <span className="font-bold text-stone-900 dark:text-white block mb-1.5">
                        💬 Model Bacaan / Dialog: {unit.modelDialogueOrText.title}
                      </span>
                      <pre className="whitespace-pre-wrap font-sans text-[11px] text-stone-700 dark:text-stone-300 bg-stone-50 dark:bg-stone-750 p-2.5 rounded-lg border border-stone-100 dark:border-stone-700 leading-relaxed">
                        {unit.modelDialogueOrText.content}
                      </pre>
                    </div>

                    {/* Action Button: Learn this unit with Laura */}
                    <div className="pt-2">
                      <button
                        onClick={() => {
                          onSelectUnitToLearn?.(unit);
                          onClose();
                        }}
                        className="w-full py-2.5 px-4 bg-[#0f5c4d] hover:bg-[#0d4f42] text-white rounded-xl font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
                      >
                        <Sparkles className="w-4 h-4 text-amber-300" />
                        <span>Minta Laura Ajarkan Unit Ini Sekarang</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-stone-100 dark:bg-stone-950 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between text-xs shrink-0">
          <span className="text-[11px] text-stone-500">
            Sumber Buku Ajar: Universitas PTIQ Jakarta
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 font-semibold hover:bg-stone-200 transition"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
