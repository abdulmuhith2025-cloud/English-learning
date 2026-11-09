import { SpeakingScenario, ShadowingItem, SpeechFeedback } from '../types';

export interface QuizQuestion {
  id: string;
  category: 'goal' | 'level' | 'obstacle' | 'time' | 'listening' | 'speaking';
  title: string;
  subtitle: string;
  options: Array<{
    id: string;
    label: string;
    desc: string;
    icon?: string;
    scoreBonus?: number;
    recommendedCefr?: string;
  }>;
}

export const BETTER_SPEAK_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q-goal',
    category: 'goal',
    title: 'Apa tujuan utama Anda belajar berbicara bahasa Inggris?',
    subtitle: 'Kami akan menyesuaikan silabus AI Laura berdasarkan sasaran prioritas Anda.',
    options: [
      {
        id: 'academic',
        label: 'Mengajar & Perkuliahan Kampus',
        desc: 'Membawakan materi kuliah, instruksi kelas, dan bimbingan mahasiswa dalam bahasa Inggris.',
        icon: '🎓',
        recommendedCefr: 'B2 Academic',
      },
      {
        id: 'dissertation',
        label: 'Disertasi & Riset Internasional',
        desc: 'Membahas metodologi, wawancara akademik, serta persiapan sidang promosi doktor.',
        icon: '📚',
        recommendedCefr: 'B2 Academic',
      },
      {
        id: 'conference',
        label: 'Konferensi & Seminar Global',
        desc: 'Presentasi makalah ilmiah dan menjawab sesi tanya jawab audiens secara percaya diri.',
        icon: '🎤',
        recommendedCefr: 'B2-C1 Fluency',
      },
      {
        id: 'daily',
        label: 'Percakapan Sehari-hari & Networking',
        desc: 'Komunikasi lancar, santai, dan luwes dengan rekan dari berbagai negara.',
        icon: '☕',
        recommendedCefr: 'B1 Conversational',
      },
      {
        id: 'confidence',
        label: 'Membangun Kepercayaan Diri Bicara',
        desc: 'Menghilangkan rasa takut salah bicara dan melatih kelancaran lidah secara bertahap.',
        icon: '⚡',
        recommendedCefr: 'A2-B1 Starter',
      },
    ],
  },
  {
    id: 'q-level',
    category: 'level',
    title: 'Bagaimana Anda menilai kemampuan speaking Anda saat ini?',
    subtitle: 'Pilih yang paling menggambarkan kenyamanan Anda ketika berbicara bahasa Inggris.',
    options: [
      {
        id: 'beginner',
        label: 'Beginner (Pemula / A1)',
        desc: 'Mengerti beberapa kata dasar, namun masih sangat ragu dan sulit menyusun kalimat utuh.',
        icon: '🌱',
      },
      {
        id: 'elementary',
        label: 'Elementary (Dasar / A2)',
        desc: 'Bisa membuat kalimat sederhana sehari-hari, tapi sering terhenti untuk memikirkan kosa kata.',
        icon: '🌿',
      },
      {
        id: 'intermediate',
        label: 'Intermediate (Menengah / B1)',
        desc: 'Cukup lancar untuk percakapan umum, namun ingin meningkatkan kosakata formal & akademik.',
        icon: '🌳',
      },
      {
        id: 'advanced',
        label: 'Upper Intermediate / Advanced (B2+)',
        desc: 'Mampu berbicara spontan, ingin mempertajam aksen, intonasi, dan signposting akademik.',
        icon: '⭐',
      },
    ],
  },
  {
    id: 'q-obstacle',
    category: 'obstacle',
    title: 'Apa kendala terbesar yang paling sering Anda rasakan?',
    subtitle: 'Laura akan memfokuskan latihan untuk mengatasi hambatan ini.',
    options: [
      {
        id: 'vocabulary',
        label: 'Kosa Kata Terbatas (Vocabulary)',
        desc: 'Sering bingung mencari kata yang tepat saat ingin menyampaikan gagasan akademis.',
        icon: '📖',
      },
      {
        id: 'grammar',
        label: 'Ragu Tata Bahasa (Grammar Anxiety)',
        desc: 'Terlalu banyak berpikir rumus kalimat di kepala sebelum berani berbicara.',
        icon: '🧩',
      },
      {
        id: 'pronunciation',
        label: 'Pelafalan & Aksen (Pronunciation)',
        desc: 'Kurang percaya diri dengan kejelasan ucapan dan intonasi gaya British/American.',
        icon: '🗣️',
      },
      {
        id: 'no_partner',
        label: 'Tidak Ada Lawan Bicara (No Practice Partner)',
        desc: 'Jarang memiliki kesempatan berlatih percakapan langsung setiap hari.',
        icon: '🤝',
      },
    ],
  },
  {
    id: 'q-time',
    category: 'time',
    title: 'Berapa menit waktu latihan yang Anda targetkan setiap hari?',
    subtitle: 'Konsistensi 5-15 menit per hari terbukti melipatgandakan reflek berbicara.',
    options: [
      {
        id: '5',
        label: '5 Menit / Hari (Mikro-Habit)',
        desc: '1 skenario singkat atau 3 latihan pelafalan sebelum beraktivitas.',
        icon: '⏱️',
      },
      {
        id: '10',
        label: '10 Menit / Hari (Sangat Disarankan)',
        desc: 'Waktu ideal: 1 simulasi percakapan dan analisis feedback instan dari Laura.',
        icon: '🎯',
      },
      {
        id: '15',
        label: '15 Menit / Hari (Progres Cepat)',
        desc: 'Kombinasi latihan dialog terarah, shadowing, dan kuis kosa kata.',
        icon: '🚀',
      },
      {
        id: '25',
        label: '25 Menit / Hari (Intensif)',
        desc: 'Pendalaman materi Modul English-01 & 02 secara komprehensif.',
        icon: '🔥',
      },
    ],
  },
];

// Diagnostic test question for the interactive test step
export interface DiagnosticQuestion {
  id: string;
  audioPrompt: string; // Text Laura speaks
  instruction: string;
  context: string;
  options: Array<{
    id: string;
    text: string;
    isCorrect: boolean;
    explanation: string;
  }>;
}

export const DIAGNOSTIC_LISTENING_QUESTION: DiagnosticQuestion = {
  id: 'diag-1',
  audioPrompt: "Good morning, Professor! In our seminar today, could you please elaborate on your research methodology regarding Islamic education?",
  instruction: 'Dengarkan suara Laura, lalu pilih respons bahasa Inggris yang paling tepat dan sopan untuk konteks akademik:',
  context: 'Konsep Modul English-02 Unit 5: Signposting & Academic Communication',
  options: [
    {
      id: 'a',
      text: "Certainly. First of all, I applied a qualitative phenomenological approach to explore students' learning transformation.",
      isCorrect: true,
      explanation: 'Sangat tepat! Menggunakan signpost formal ("Certainly. First of all...") dan istilah riset yang akurat.',
    },
    {
      id: 'b',
      text: "No problem, I just write whatever the students say in the classroom.",
      isCorrect: false,
      explanation: 'Terlalu informal dan kurang mencerminkan bobot akademik dosen/peneliti.',
    },
    {
      id: 'c',
      text: "I do not know because my research is very hard.",
      isCorrect: false,
      explanation: 'Kurang profesional untuk konteks seminar akademik.',
    },
  ],
};

// Speaking Scenarios for BetterSpeak Lab
export const BETTER_SPEAK_SCENARIOS: SpeakingScenario[] = [
  {
    id: 'sc-academic-lecture',
    title: 'Membuka Kuliah di Depan Mahasiswa',
    category: 'academic',
    level: 'Intermediate',
    description: 'Latih kemampuan membuka sesi kuliah, mengulas silabus, dan memotivasi mahasiswa di awal semester.',
    lauraRole: 'Mahasiswa perwakilan kelas yang antusias mengajukan pertanyaan silabus',
    userRole: 'Dosen pengampu mata kuliah',
    promptStarter: "Good morning, everyone! Welcome to our Communicative English class. Today, we will discuss our syllabus and course expectations.",
    keyPhrases: [
      'Welcome to today’s session...',
      'By the end of this semester, you are expected to...',
      'Feel free to raise your hand if you have any questions.',
    ],
    referenceModule: 'Modul English-01 & English-02 (PTIQ)',
  },
  {
    id: 'sc-thesis-defense',
    title: 'Simulasi Sidang Disertasi & Tanya Jawab',
    category: 'academic',
    level: 'Advanced',
    description: 'Latih argumen penelitian, kerangka teori, dan cara menjawab pertanyaan penguji secara percaya diri.',
    lauraRole: 'Penguji sidang akademik (Examiner) dari universitas mitra internasional',
    userRole: 'Kandidat Doktor Pendidikan Islam',
    promptStarter: "Distinguished committee members, thank you for the opportunity to defend my doctoral dissertation on transformative Islamic pedagogy.",
    keyPhrases: [
      'My primary research objective is to examine...',
      'Based on the empirical findings in Chapter Four...',
      'This brings me to the theoretical implications of the study.',
    ],
    referenceModule: 'Disertasi Doktoral & Modul English-02 Unit 4-5',
  },
  {
    id: 'sc-conference-qa',
    title: 'Tanya Jawab di Konferensi Internasional',
    category: 'presentation',
    level: 'Intermediate',
    description: 'Simulasikan interaksi profesional ketika audiens asing menanyakan data riset Anda.',
    lauraRole: 'Peneliti internasional yang duduk di barisan depan konferensi',
    userRole: 'Presenter makalah ilmiah',
    promptStarter: "Thank you for that insightful presentation! Could you clarify how you triangulated your qualitative interview data?",
    keyPhrases: [
      'That is an excellent question. Allow me to elaborate on...',
      'To address your point regarding data triangulation...',
      'We cross-verified the interview transcripts with curriculum documents.',
    ],
    referenceModule: 'Modul English-02 Unit 5: Academic Presentation',
  },
  {
    id: 'sc-prep-intro',
    title: 'Perkenalan Profesional (PREP Strategy)',
    category: 'campus',
    level: 'Beginner',
    description: 'Perkenalkan diri secara terstruktur menggunakan formula PREP: Point, Reason, Example, Purpose.',
    lauraRole: 'Kolega dosen baru dari luar negeri yang sedang berkunjung ke PTIQ',
    userRole: 'Dosen Institut PTIQ Jakarta',
    promptStarter: "Hello! It is a great pleasure to meet you. Could you tell me a little bit about your academic background and teaching focus?",
    keyPhrases: [
      'My name is Abdul Muhit, and I teach Islamic education and communicative English.',
      'The reason I focus on this field is because...',
      'For example, our students at PTIQ integrate Al-Qur’an memorization with global languages.',
      'My primary purpose is to empower them for international outreach.',
    ],
    referenceModule: 'Modul English-02 Unit 1 (PREP Strategy)',
  },
  {
    id: 'sc-campus-coffee',
    title: 'Ngobrol Santai Dosen Saat Coffee Break',
    category: 'daily',
    level: 'Elementary',
    description: 'Latih percakapan kasual, membicarakan rutinitas harian, cuaca di Jakarta, dan jadwal riset.',
    lauraRole: 'Laura Thompson, asisten akademik yang sedang menikmati kopi',
    userRole: 'Pak Abdul',
    promptStarter: "Hi there! How was your morning lecture? The traffic in Jakarta looked quite hectic today!",
    keyPhrases: [
      'It went quite well, thank you!',
      'I usually start my day with Subuh prayer and reading journals.',
      'Are you free to discuss our next project this afternoon?',
    ],
    referenceModule: 'Modul English-01 Unit 2: Daily Activities',
  },
];

// Shadowing & Pronunciation Exercises
export const SHADOWING_DRILLS: ShadowingItem[] = [
  {
    id: 'sh-1',
    title: 'Academic Signposting (Pembuka Presentasi)',
    sentence: "Good morning, ladies and gentlemen. Today, I would like to shed light on our latest empirical findings.",
    phonetics: "/ɡʊd ˈmɔːnɪŋ ˈleɪdiz ənd ˈdʒɛntlmən/",
    indonesian: "Selamat pagi bapak dan ibu. Hari ini, saya ingin memaparkan temuan empiris terbaru kami.",
    difficulty: 'Medium',
    tip: 'Beri jeda lembut setelah kata "ladies and gentlemen", dan tekankan kata "empirical findings".',
    moduleSource: 'Modul English-02 Unit 5',
  },
  {
    id: 'sh-2',
    title: 'PREP Strategy Formula (Point & Reason)',
    sentence: "In my perspective, integrating moral values into modern pedagogy is essential for character building.",
    phonetics: "/ɪn maɪ pəˈspɛktɪv ˈɪntɪɡreɪtɪŋ ˈmɒrəl ˈvæljuːz/",
    indonesian: "Dalam pandangan saya, mengintegrasikan nilai-nilai moral ke dalam pedagogi modern sangatlah penting bagi pembentukan karakter.",
    difficulty: 'Academic',
    tip: 'Ucapkan kata "perspective" dengan penekanan pada suku kata kedua (/pə-SPEK-tiv/).',
    moduleSource: 'Modul English-02 Unit 1 & 4',
  },
  {
    id: 'sh-3',
    title: 'Giving Polite Clarification (Di Dalam Kelas)',
    sentence: "Could you please clarify what you mean by phenomenological triangulation?",
    phonetics: "/kʊd juː pliːz ˈklærɪfaɪ wɒt juː miːn/",
    indonesian: "Bisakah Anda memperjelas apa yang Anda maksud dengan triangulasi fenomenologis?",
    difficulty: 'Medium',
    tip: 'Gunakan nada intonasi naik (rising intonation) di akhir kalimat pertanyaan sopan.',
    moduleSource: 'Modul English-01 Unit 4',
  },
  {
    id: 'sh-4',
    title: 'Daily Campus Routine (Kegiatan Kampus)',
    sentence: "I regularly hold thesis consultations with my doctoral supervisor on Wednesday afternoons.",
    phonetics: "/aɪ ˈrɛɡjʊləli həʊld ˈθiːsɪs ˌkɒnsəlˈteɪʃənz/",
    indonesian: "Saya rutin mengadakan konsultasi disertasi dengan promotor saya pada Rabu sore.",
    difficulty: 'Easy',
    tip: 'Perhatikan pelafalan kata "thesis" dengan lidah sedikit di antara gigi depan (/θiːsɪs/).',
    moduleSource: 'Modul English-01 Unit 2',
  },
  {
    id: 'sh-5',
    title: 'Polite Agreement & Negotiation (Diskusi Ilmiah)',
    sentence: "I completely agree with your proposal, provided that we maintain high academic standards.",
    phonetics: "/aɪ kəmˈpliːtli əˈɡriː wɪð jɔː prəˈpəʊzəl/",
    indonesian: "Saya sepenuhnya setuju dengan usulan Anda, dengan syarat kita tetap mempertahankan standar akademik yang tinggi.",
    difficulty: 'Academic',
    tip: 'Gunakan frasa penghubung "provided that" untuk menyatakan syarat secara elegan.',
    moduleSource: 'Modul English-02 Unit 7',
  },
];

// Offline Speech Feedback Analyzer
export function analyzeSpeechOffline(userText: string): SpeechFeedback {
  const text = userText.trim();
  const wordCount = text.split(/\s+/).filter(Boolean).length;

  // Simple heuristic checks
  const hasAcademicWords = /(pedagogy|methodology|perspective|curriculum|empirical|findings|hypothesis|dissertation|significance|framework)/i.test(text);
  const hasPolitePhrases = /(could you|would you|allow me|in my opinion|first of all|furthermore|consequently)/i.test(text);
  
  let fluencyScore = 75;
  if (wordCount >= 10) fluencyScore += 10;
  if (hasAcademicWords) fluencyScore += 8;
  if (hasPolitePhrases) fluencyScore += 5;
  if (fluencyScore > 98) fluencyScore = 98;

  const upgrades: Array<{ original: string; better: string; reason: string }> = [];

  if (/\bgood\b/i.test(text)) {
    upgrades.push({ original: 'good', better: 'beneficial / substantial', reason: 'Lebih formal dan berbobot dalam konteks akademik' });
  }
  if (/\bthink\b/i.test(text)) {
    upgrades.push({ original: 'I think', better: 'In my perspective / I consider', reason: 'Mencerminkan gaya akademis seorang peneliti/dosen' });
  }
  if (/\bbecause\b/i.test(text)) {
    upgrades.push({ original: 'because', better: 'since / given that / as a result of', reason: 'Memperkaya variasi konjungsi dalam presentasi ilmiah' });
  }
  if (/\bbig\b/i.test(text)) {
    upgrades.push({ original: 'big', better: 'significant / paramount', reason: 'Kosakata akademik yang lebih presisi' });
  }

  let grammarFeedback = 'Susunan kalimat Anda sudah dapat dipahami dengan baik dan terdengar alami.';
  let correctedText = text;

  // Specific common patterns
  if (/\bI am agree\b/i.test(text)) {
    correctedText = text.replace(/I am agree/gi, 'I agree');
    grammarFeedback = 'Gunakan "I agree" (bukan "I am agree") karena kata "agree" adalah kata kerja (verb).';
  } else if (/\bexplain me\b/i.test(text)) {
    correctedText = text.replace(/explain me/gi, 'explain to me');
    grammarFeedback = 'Dalam bahasa Inggris gunakan "explain to me" dengan preposisi "to".';
  }

  return {
    fluencyScore,
    originalText: text,
    correctedText,
    grammarFeedback,
    vocabularyUpgrades: upgrades.length > 0 ? upgrades : [
      { original: 'important', better: 'paramount / pivotal', reason: 'Sangat cocok untuk presentasi riset' },
    ],
    pronunciationTip: 'Perhatikan penekanan kata (word stress) pada suku kata utama agar intonasi terdengar percaya diri layaknya penutur asli.',
    overallPraise: fluencyScore >= 85 ? 'Luar biasa! Struktur kalimat Anda sangat rapi dan berbobot akademis.' : 'Bagus sekali! Terus latih konsistensi berbicara agar reflek kosa kata semakin lancar.',
  };
}
