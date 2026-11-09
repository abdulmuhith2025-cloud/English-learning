import React, { useState } from 'react';
import {
  SEMESTER_1_UNITS,
  SEMESTER_2_UNITS,
  CurriculumUnit,
} from '../../data/englishCurriculum';
import {
  BookOpen,
  Download,
  GraduationCap,
  Sparkles,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  FileText,
  Volume2,
} from 'lucide-react';

interface CurriculumTabProps {
  onStartUnitPractice?: (unit: CurriculumUnit) => void;
}

export const CurriculumTab: React.FC<CurriculumTabProps> = ({
  onStartUnitPractice,
}) => {
  const [activeSemester, setActiveSemester] = useState<1 | 2>(1);
  const [expandedUnitId, setExpandedUnitId] = useState<string | null>('s1-u1');

  const units = activeSemester === 1 ? SEMESTER_1_UNITS : SEMESTER_2_UNITS;

  const toggleExpand = (id: string) => {
    setExpandedUnitId(expandedUnitId === id ? null : id);
  };

  return (
    <div className="space-y-4 pb-20 max-w-2xl mx-auto">
      {/* Header & Author Attribution Card */}
      <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-[#0f5c4d] via-[#124d41] to-[#0c3930] text-white shadow-md space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-amber-400 text-stone-900 rounded-2xl font-bold shrink-0 mt-0.5">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-extrabold uppercase tracking-wider bg-white/20 text-amber-200 px-2.5 py-0.5 rounded-full">
                  Buku Ajar Resmi PTIQ Jakarta
                </span>
                <span className="text-[10px] text-emerald-200">Karya Abdul Muhit, M.Pd</span>
              </div>
              <h2 className="font-academic-heading text-lg sm:text-xl font-bold text-white mt-1">
                Modul Communicative English I & II
              </h2>
              <p className="text-xs text-emerald-100/90 mt-0.5 leading-relaxed">
                Silabus acuan resmi untuk mahasiswa PTIQ Jakarta, mencakup 16 unit terintegrasi dengan nilai-nilai tarbiyah Islamiyah.
              </p>
            </div>
          </div>
        </div>

        {/* Direct PDF Download Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-emerald-700/60">
          <a
            href="/assets/aistudio/ENGLISH-01_REVISED_d91bdfc6.pdf"
            target="_blank"
            rel="noopener noreferrer"
            download
            className="flex items-center justify-between p-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 transition group"
          >
            <div className="text-left">
              <span className="font-bold text-xs text-amber-200 block group-hover:text-amber-100">
                📥 Unduh Modul English-01 (Sem 1)
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
                📥 Unduh Modul English-02 (Sem 2)
              </span>
              <span className="text-[10px] text-emerald-200">Productive Skills (Speaking & Writing)</span>
            </div>
            <Download className="w-4 h-4 text-amber-300 shrink-0" />
          </a>
        </div>
      </div>

      {/* Semester Toggle Bar */}
      <div className="flex items-center gap-2 p-1 bg-stone-200/70 dark:bg-stone-800/70 rounded-2xl">
        <button
          onClick={() => {
            setActiveSemester(1);
            setExpandedUnitId('s1-u1');
          }}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
            activeSemester === 1
              ? 'bg-white dark:bg-stone-900 text-[#0f5c4d] dark:text-emerald-400 shadow-sm'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Semester 1: Integrated Skills (A1-A2)</span>
        </button>

        <button
          onClick={() => {
            setActiveSemester(2);
            setExpandedUnitId('s2-u1');
          }}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
            activeSemester === 2
              ? 'bg-white dark:bg-stone-900 text-[#0f5c4d] dark:text-emerald-400 shadow-sm'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Semester 2: Productive Skills (A2)</span>
        </button>
      </div>

      {/* Unit Cards Accordion */}
      <div className="space-y-2.5">
        {units.map((unit) => {
          const isExpanded = expandedUnitId === unit.id;
          return (
            <div
              key={unit.id}
              className="rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs overflow-hidden transition"
            >
              {/* Accordion Header */}
              <button
                onClick={() => toggleExpand(unit.id)}
                className="w-full p-4 text-left flex items-start justify-between gap-3 hover:bg-stone-50 dark:hover:bg-stone-850 transition"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#0f5c4d]/10 text-[#0f5c4d] dark:bg-emerald-950 dark:text-emerald-300">
                      Unit {unit.unitNumber}
                    </span>
                    <span className="text-xs text-stone-500 font-semibold">
                      {unit.cefrLevel}
                    </span>
                  </div>
                  <h3 className="font-academic-heading text-sm sm:text-base font-bold text-stone-900 dark:text-white mt-1">
                    {unit.title}
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5 line-clamp-1">
                    {unit.theme}
                  </p>
                </div>

                <div className="p-1 text-stone-400 hover:text-stone-600 shrink-0 mt-1">
                  {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </button>

              {/* Accordion Body */}
              {isExpanded && (
                <div className="p-4 pt-0 border-t border-stone-100 dark:border-stone-800 space-y-3 text-xs text-stone-700 dark:text-stone-300">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-3">
                    <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-850 border border-stone-200/60 dark:border-stone-750">
                      <strong className="text-stone-900 dark:text-white block mb-1">
                        🎯 Fokus Tata Bahasa (Grammar):
                      </strong>
                      <span>{unit.grammarFocus.topic}</span>
                    </div>

                    <div className="p-3 rounded-xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/40 text-amber-950 dark:text-amber-200">
                      <strong className="block mb-1">
                        📖 Refleksi Nilai Islami ({unit.quranicInsight.surah}):
                      </strong>
                      <span className="line-clamp-3">{unit.quranicInsight.reflection}</span>
                    </div>
                  </div>

                  {/* Academic Vocabulary */}
                  {unit.academicVocabulary && unit.academicVocabulary.length > 0 && (
                    <div>
                      <strong className="text-stone-900 dark:text-white block mb-1.5">
                        Kosa Kata Akademik:
                      </strong>
                      <div className="flex flex-wrap gap-1.5">
                        {unit.academicVocabulary.map((v, i: number) => (
                          <span
                            key={i}
                            className="px-2.5 py-1 rounded-lg bg-[#f6f3ec] dark:bg-stone-800 text-stone-800 dark:text-stone-200 text-[11px] font-medium"
                          >
                            {v.word} ({v.meaning})
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Sample Dialogue */}
                  {unit.modelDialogueOrText && (
                    <div className="p-3 rounded-xl bg-[#f6f3ec] dark:bg-stone-800 text-stone-800 dark:text-stone-200 text-[11px] whitespace-pre-line leading-relaxed font-sans">
                      <strong className="block mb-1 text-stone-900 dark:text-white">
                        {unit.modelDialogueOrText.title}:
                      </strong>
                      {unit.modelDialogueOrText.content}
                    </div>
                  )}

                  {/* Practice Button */}
                  <div className="flex justify-end pt-2">
                    <button
                      onClick={() => onStartUnitPractice && onStartUnitPractice(unit)}
                      className="px-4 py-2 rounded-xl bg-[#0f5c4d] text-white text-xs font-bold hover:bg-[#0d4f42] transition shadow-xs flex items-center gap-1.5"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Latih Unit Ini dengan Laura</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
