import { StorageManager } from './storage';
import { calculatePrayerTimes } from './prayerTimes';
import { AssistantMode, MoodType } from '../types';

/**
 * Intelligent 100% Free Autonomous Assistant & English Tutor Engine.
 * Provides instant, zero-cost, natural conversational AI without requiring
 * any paid API subscriptions or billing setup.
 */

export function handleLocalAssistantQuery(
  userText: string,
  mode: AssistantMode
): { cleanText: string; mood: MoodType; actionExecuted?: string; isLocalFallback: boolean } {
  const query = userText.trim().toLowerCase();
  const settings = StorageManager.getSettings();
  const profile = settings.profile;
  const userName = profile.name || 'Pak Abdul';
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];

  // ===================== 1. TUTOR MODE =====================
  if (mode === 'tutor') {
    // 0. Questions about the Course Modules, Author (Abdul Muhit, M.Pd), or PDFs
    if (
      query.includes('modul') ||
      query.includes('module') ||
      query.includes('buku') ||
      query.includes('silabus') ||
      query.includes('kurikulum') ||
      query.includes('abdul muhit') ||
      query.includes('ptiq') ||
      query.includes('pdf') ||
      query.includes('materi ajar')
    ) {
      if (query.includes('2') || query.includes('dua') || query.includes('semester 2') || query.includes('productive')) {
        return {
          cleanText: `Modul English-02 ("Productive Skills: Developing Speaking and Academic Writing for Meaningful Communication") disusun oleh Bapak Abdul Muhit, M.Pd (Universitas PTIQ Jakarta, 2026, CEFR A2). Modul ini mencakup 8 Unit: PREP Strategy, Descriptive Campus Paragraph, Process Paragraph, Opinion & AI Debate, Academic Presentations, Problem Solving (Shura), Negotiation, dan Final Academic Report. File PDF dapat Anda unduh langsung di menu Silabus!`,
          mood: 'happy',
          isLocalFallback: true,
        };
      }
      if (query.includes('1') || query.includes('satu') || query.includes('semester 1') || query.includes('integrated')) {
        return {
          cleanText: `Modul English-01 ("Integrated Skills: Learning English Through Communication, Islamic Values, and Real-Life Experience") disusun oleh Bapak Abdul Muhit, M.Pd (Universitas PTIQ Jakarta, 2026, CEFR A1-A2). Terdiri dari 8 Unit terintegrasi: Perkenalan, Rutinitas Ma'had, Denah Kampus, Izin di Kelas, Pertemanan, Halal Food, Belanja di Koperasi PTIQ, dan Weekend Activities. File PDF tersedia untuk Anda pelajari!`,
          mood: 'happy',
          isLocalFallback: true,
        };
      }
      return {
        cleanText: `Materi ajar acuan kita bersumber dari dua modul karya Bapak Abdul Muhit, M.Pd dari Lembaga Bahasa & Budaya Universitas PTIQ Jakarta: Modul English-01 (Semester 1: Integrated Skills, CEFR A1-A2) dan Modul English-02 (Semester 2: Productive Skills, CEFR A2). Anda bisa membuka silabus lengkap dan tautan PDF keduanya di tombol 'Silabus Modul' pada bagian atas layar!`,
        mood: 'happy',
        isLocalFallback: true,
      };
    }

    // A. Answering the Opening Questions (Age, Education Level, Goal)
    if (
      query.includes('dosen') ||
      query.includes('s3') ||
      query.includes('doktor') ||
      query.includes('mahasiswa') ||
      query.includes('universitas') ||
      query.includes('kuliah') ||
      query.includes('tujuan') ||
      query.includes('tahun') ||
      query.match(/\b\d{2}\b/) // user answered their age, e.g. 35, 40
    ) {
      return {
        cleanText: `Excellent! Thank you for sharing, ${userName}. As a lecturer and doctoral researcher at PTIQ Jakarta, we will align our lessons with Modul English-01 and English-02 by Abdul Muhit, M.Pd. We can explore either Semester 1 fundamentals or Semester 2 academic presentations and essay writing. Which unit shall we start with today?`,
        mood: 'happy',
        isLocalFallback: true,
      };
    }

    // B. Greetings & Friendly Small Talk
    if (
      query.includes('halo') ||
      query.includes('hello') ||
      query.includes('hi') ||
      query.includes('good morning') ||
      query.includes('good afternoon') ||
      query.includes('good evening') ||
      query.includes('selamat pagi') ||
      query.includes('selamat siang') ||
      query.includes('selamat malam')
    ) {
      return {
        cleanText: `Hello and welcome, ${userName}! It is lovely to speak with you. I am Laura Thompson, your English mentor, referencing the official PTIQ English modules by Abdul Muhit, M.Pd. Would you like to practice speaking from Semester 1 or academic writing from Semester 2?`,
        mood: 'happy',
        isLocalFallback: true,
      };
    }

    // BetterSpeak AI Speaking Lab & Quiz Query
    if (
      query.includes('better speak') ||
      query.includes('betterspeak') ||
      query.includes('speaking lab') ||
      query.includes('tes speaking') ||
      query.includes('quiz speaking') ||
      query.includes('latihan bicara') ||
      query.includes('latihan speaking')
    ) {
      return {
        cleanText: `Yes, ${userName}! The BetterSpeak AI Speaking Lab is now available right inside our app, 100% free! You can open the 'BetterSpeak' tab at the top to take our interactive Diagnostic Placement Quiz, practice realistic speaking scenarios (like opening lectures and doctoral defense), master British pronunciation with Shadowing drills, and use the Speech Analyzer for instant fluency scores and academic vocabulary upgrades. Everything is aligned with your Modul English-01 & 02. Shall we begin?`,
        mood: 'happy',
        isLocalFallback: true,
      };
    }

    // ================= SEMESTER 2 UNITS (PRODUCTIVE SKILLS) =================
    // S2-U1: Professional Introduction & PREP Strategy
    if (
      query.includes('prep') ||
      (query.includes('semester 2') && query.includes('1')) ||
      (query.includes('unit 1') && (query.includes('profesional') || query.includes('academic background') || query.includes('sem 2'))) ||
      query.includes('professional self-introduction')
    ) {
      return {
        cleanText: `In Semester 2 Unit 1 (Introducing Yourself Professionally), we use the PREP Strategy: Point (core statement), Reason (why), Example (concrete evidence), and Purpose (future goal). In British English: "Let me introduce myself. I am a doctoral researcher in Islamic Education because I believe education transforms society. I have conducted fieldwork in Jakarta, and my goal is to foster scholarly dialogue." Try sharing your PREP statement!`,
        mood: 'encourage',
        isLocalFallback: true,
      };
    }

    // S2-U2: Campus Life & Descriptive Paragraph
    if (
      (query.includes('semester 2') && query.includes('2')) ||
      (query.includes('unit 2') && (query.includes('deskriptif') || query.includes('descriptive') || query.includes('sem 2'))) ||
      query.includes('campus life') ||
      query.includes('paragraf deskriptif')
    ) {
      return {
        cleanText: `In Semester 2 Unit 2 (Talking About Campus Life), we write descriptive academic paragraphs (150-180 words). Structure: 1) Topic sentence stating the essence of campus, 2) Supporting sentences with facilities and routines using sequence words (First, Then, After that), and 3) A thoughtful concluding sentence. How would you describe the academic atmosphere at Universitas PTIQ Jakarta?`,
        mood: 'encourage',
        isLocalFallback: true,
      };
    }

    // S2-U3: Explaining Procedures & Process Paragraph
    if (
      (query.includes('semester 2') && query.includes('3')) ||
      (query.includes('unit 3') && (query.includes('prosedur') || query.includes('procedure') || query.includes('process') || query.includes('sem 2'))) ||
      query.includes('borrow book') ||
      query.includes('pinjam buku') ||
      query.includes('process paragraph')
    ) {
      return {
        cleanText: `Semester 2 Unit 3 focuses on explaining procedures clearly, such as borrowing books from the PTIQ library. We use chronological sequence connectors: "First, take a queue number. Next, search the online catalog. Then, bring the book to the circulation counter. Finally, check the due date slip." Notice that imperatives do not take a subject ('you'). Shall we write a 4-step academic process together?`,
        mood: 'calm',
        isLocalFallback: true,
      };
    }

    // S2-U4: Expressing Opinions, Polite Agreement/Disagreement & AI Discussion
    if (
      (query.includes('semester 2') && query.includes('4')) ||
      (query.includes('unit 4') && (query.includes('opini') || query.includes('opinion') || query.includes('ai in learning') || query.includes('sem 2'))) ||
      query.includes('pendapat') ||
      query.includes('setuju') ||
      query.includes('disagree') ||
      query.includes('agree')
    ) {
      return {
        cleanText: `In Semester 2 Unit 4, we practice expressing opinions on "Should students use AI in learning?". For polite disagreement, we say: "I understand your point; however, students must maintain critical thinking." In our Islamic reflection (QS. Ali 'Imran 3:159), constructive academic debate is always delivered with gentleness and mutual respect. What is your perspective on AI in Islamic education?`,
        mood: 'think',
        isLocalFallback: true,
      };
    }

    // S2-U5: Delivering Academic Presentations & Signposting
    if (
      (query.includes('semester 2') && query.includes('5')) ||
      (query.includes('unit 5') && (query.includes('presentasi') || query.includes('presentation') || query.includes('signpost') || query.includes('sem 2'))) ||
      query.includes('presentasi') ||
      query.includes('presentation') ||
      query.includes('signposting')
    ) {
      return {
        cleanText: `In Semester 2 Unit 5 (Delivering Academic Presentations), we structure presentations into Opening, Body Points, Conclusion, and Q&A. Use signposting expressions: "Today I'd like to talk about...", "Moving on to my second point...", and "In summary...". In British English, eye contact and measured pauses convey authority. Would you like to practice opening a conference paper presentation?`,
        mood: 'encourage',
        isLocalFallback: true,
      };
    }

    // S2-U6: Problem Solving, Shura, & Recommendations
    if (
      (query.includes('semester 2') && query.includes('6')) ||
      (query.includes('unit 6') && (query.includes('masalah') || query.includes('problem') || query.includes('rekomendasi') || query.includes('syura') || query.includes('sem 2'))) ||
      query.includes('shura') ||
      query.includes('musyawarah') ||
      query.includes('recommendation paragraph')
    ) {
      return {
        cleanText: `Semester 2 Unit 6 teaches problem solving through Islamic Shura (QS. Ash-Shura 42:38). In writing recommendation paragraphs, we use modal verbs: "We should organize more interactive workshops", "We ought to promote activities early", and "Therefore, I recommend forming a student committee." What campus challenge at PTIQ should we analyze?`,
        mood: 'think',
        isLocalFallback: true,
      };
    }

    // S2-U7: Negotiation & Persuasive Communication
    if (
      (query.includes('semester 2') && query.includes('7')) ||
      (query.includes('unit 7') && (query.includes('negosiasi') || query.includes('negotiat') || query.includes('persuas') || query.includes('sem 2'))) ||
      query.includes('persuasi') ||
      query.includes('kompromi') ||
      query.includes('compromise')
    ) {
      return {
        cleanText: `In Semester 2 Unit 7 (Negotiation and Persuasive Communication), we persuade with logic and evidence, not force (QS. An-Nahl 16:125). Expressions include: "One significant advantage is...", "How about meeting halfway?", and "I strongly believe that...". Would you like to practice negotiating an academic seminar budget or theme?`,
        mood: 'calm',
        isLocalFallback: true,
      };
    }

    // S2-U8: Final Academic Project Report
    if (
      (query.includes('semester 2') && query.includes('8')) ||
      (query.includes('unit 8') && (query.includes('laporan') || query.includes('project report') || query.includes('final project') || query.includes('sem 2'))) ||
      query.includes('project report') ||
      query.includes('laporan proyek')
    ) {
      return {
        cleanText: `In Semester 2 Unit 8 (Final Academic Communication Project), we synthesize all skills into a 7-section Academic Report: 1. Title, 2. Introduction, 3. Objective, 4. Method, 5. Findings, 6. Recommendations, and 7. Conclusion (QS. Al-Ma'idah 5:2). We also review all tenses (Simple Past, Present Perfect, Passive Voice). Would you like to draft an Objective statement for your research?`,
        mood: 'encourage',
        isLocalFallback: true,
      };
    }

    // ================= SEMESTER 1 UNITS (INTEGRATED SKILLS) =================
    // S1-U1: Getting to Know Each Other (Introductions, to be, subject pronouns)
    if (query.includes('unit 1') || query.includes('introduct') || query.includes('perkenal') || query.includes('to be')) {
      return {
        cleanText: `In Semester 1 Unit 1 (Getting to Know Each Other), we practice introductions and the verb 'to be' (am/is/are). Inspired by QS. Al-Hujurat 49:13, we say: "Good morning, I am Abdul Muhit, a lecturer at Universitas PTIQ Jakarta." Story characters in this unit include Ahmad and Aisyah. Try completing this sentence: "Aisyah and Fatimah ___ preparing for their English examination." What is the missing verb?`,
        mood: 'encourage',
        isLocalFallback: true,
      };
    }

    // S1-U2: Daily Activities (Simple Present, times, adverbs of frequency)
    if (
      query.includes('unit 2') ||
      query.includes('simple present') ||
      query.includes('daily') ||
      query.includes('kebiasaan') ||
      query.includes('o\'clock') ||
      query.includes('half past')
    ) {
      return {
        cleanText: `In Semester 1 Unit 2 (Daily Activities), we express routines using the Simple Present tense and British clock times (QS. Al-'Asr 103:1-3). For example: "Yusuf always performs Fajr prayer at the mosque, and then he studies at quarter past five." Notice the '-s' on 'studies'. Could you describe your morning schedule before university lectures in one English sentence?`,
        mood: 'encourage',
        isLocalFallback: true,
      };
    }

    // S1-U3: At Campus (Prepositions of place, directions, asking for help)
    if (query.includes('unit 3') || query.includes('campus') || query.includes('preposition') || query.includes('arah') || query.includes('direction')) {
      return {
        cleanText: `In Semester 1 Unit 3 (At Campus), we use prepositions like 'opposite', 'next to', and 'between' to give campus directions. For example: "Excuse me, where is the PTIQ central library located?" Response: "Go straight from the main gate and turn left past the mosque. It is on your right." Try asking me for directions to the auditorium!`,
        mood: 'calm',
        isLocalFallback: true,
      };
    }

    // S1-U4: In the Classroom (can/could/may for permission, wh-questions)
    if (query.includes('unit 4') || query.includes('classroom') || query.includes('permission') || query.includes('izin') || query.includes('may i')) {
      return {
        cleanText: `In Semester 1 Unit 4 (In the Classroom, QS. Taha 20:114), modal verbs express levels of politeness: 'Can I' is informal, 'Could I' is polite, and 'May I' is formal academic English. For example: "May I consult with you regarding my research methodology, Sir?" How would you politely ask a professor to repeat an explanation?`,
        mood: 'encourage',
        isLocalFallback: true,
      };
    }

    // S1-U5: Making Friends (like/love/enjoy + -ing, hobbies)
    if (query.includes('unit 5') || query.includes('friend') || query.includes('hobb') || query.includes('enjoy')) {
      return {
        cleanText: `In Semester 1 Unit 5 (Making Friends, QS. Al-Hujurat 49:10), we express hobbies using verbs of liking followed by a gerund (-ing). For instance: "Arif from Aceh enjoys playing football, but Farhan from Palembang prefers photography." What academic or recreational activities do you enjoy most in Jakarta?`,
        mood: 'happy',
        isLocalFallback: true,
      };
    }

    // S1-U6: Food & Dining at the Ma'had (Countable/uncountable, some/any, polite ordering)
    if (query.includes('unit 6') || query.includes('food') || query.includes('dining') || query.includes('makan') || query.includes('countable')) {
      return {
        cleanText: `In Semester 1 Unit 6 (Food and Dining at the Ma'had, QS. Al-Baqarah 2:172), we learn countable nouns (dates, eggs, apples) and uncountable nouns (rice, soup, tea). We use 'some' in affirmative sentences and polite offers ("Would you like some tea?"), and 'any' in negatives. How would you order a wholesome meal at the campus cafeteria?`,
        mood: 'calm',
        isLocalFallback: true,
      };
    }

    // S1-U7: Shopping and Services (this/that/these/those, Rupiah & prices)
    if (query.includes('unit 7') || query.includes('shop') || query.includes('price') || query.includes('harga') || query.includes('rupiah') || query.includes('koperasi')) {
      return {
        cleanText: `In Semester 1 Unit 7 (Shopping and Services, QS. Al-Mutaffifin 83:1-3), we practice polite transactions at the PTIQ Cooperative Store. For example: "This reference book costs seventy-five thousand Rupiah." We use 'this/these' for items close by, and 'that/those' for items further away. Would you like to practice asking the price of stationery?`,
        mood: 'calm',
        isLocalFallback: true,
      };
    }

    // S1-U8: Weekend Activities (be going to, invitations, review)
    if (query.includes('unit 8') || query.includes('weekend') || query.includes('going to') || query.includes('akhir pekan') || query.includes('invit')) {
      return {
        cleanText: `In Semester 1 Unit 8 (Weekend Activities, QS. Al-Qasas 28:77), we make future plans using 'be going to'. For example: "This weekend, I am going to visit the National Library with Maryam. Would you like to join us?" How would you politely accept or decline that invitation in English?`,
        mood: 'happy',
        isLocalFallback: true,
      };
    }

    // K. Grammar Corrections & Explanations
    if (query.includes('koreksi') || query.includes('correct') || query.includes('salah') || query.includes('artinya') || query.includes('meaning')) {
      if (query.includes('i is') || query.includes('i are')) {
        return {
          cleanText: `Let us examine that sentence together: with the first-person singular 'I', the correct form of the verb 'to be' is always 'am' in the present tense (e.g. "I am going to campus"). In the past tense, we use 'was' (e.g. "I was on campus yesterday"). Shall we try one more example?`,
          mood: 'encourage',
          isLocalFallback: true,
        };
      }
      return {
        cleanText: `I am very glad to assist with corrections and vocabulary! Please provide the exact sentence or paragraph you wish to polish. I will explain the nuance, suggest natural British English phrasing, and provide a clear example.`,
        mood: 'encourage',
        isLocalFallback: true,
      };
    }

    // General Tutor response
    return {
      cleanText: `Splendid, ${userName}! As your English tutor referencing Modul English-01 & English-02 by Abdul Muhit, M.Pd, I am ready to guide you step-by-step through our CEFR A1-A2 modules. You can ask about any unit from Semester 1 (Integrated Skills) or Semester 2 (Productive Skills), practice dialogues, or click 'Silabus Modul' at the top to explore!`,
      mood: 'happy',
      isLocalFallback: true,
    };
  }

  // ===================== 2. ASSISTANT MODE =====================

  // BetterSpeak AI Speaking Lab & Quiz
  if (
    query.includes('better speak') ||
    query.includes('betterspeak') ||
    query.includes('speaking lab') ||
    query.includes('tes speaking') ||
    query.includes('quiz speaking') ||
    query.includes('latihan bicara') ||
    query.includes('latihan speaking')
  ) {
    return {
      cleanText: `Bisa banget, ${userName}! Aplikasi Laura sudah dilengkapi dengan fitur BetterSpeak AI Speaking Lab yang 100% gratis. Pak Abdul bisa langsung ketuk tab "BetterSpeak" di menu navigasi atas untuk mengikuti Tes Diagnostik Level (Quiz penempatan), latihan simulasi skenario perkuliahan & sidang disertasi, latihan Shadowing aksen British, serta Speech Analyzer instan dengan koreksi tata bahasa dan peningkatan kosa kata akademik sesuai Modul English-01 & 02 karya Bapak!`,
      mood: 'happy',
      isLocalFallback: true,
    };
  }

  // A. Prayer Times (Salat / Sholat)
  if (
    query.includes('salat') ||
    query.includes('sholat') ||
    query.includes('subuh') ||
    query.includes('zuhur') ||
    query.includes('asar') ||
    query.includes('magrib') ||
    query.includes('isya') ||
    query.includes('azan') ||
    query.includes('adzan')
  ) {
    const pt = calculatePrayerTimes(now, profile.latitude, profile.longitude, profile.timezone);
    return {
      cleanText: `Jadwal salat hari ini di ${profile.city}: Subuh ${pt.subuh}, Syuruq ${pt.syuruq}, Zuhur ${pt.zuhur}, Asar ${pt.asar}, Magrib ${pt.magrib}, dan Isya ${pt.isya}. Waktu salat berikutnya adalah ${pt.nextPrayerName} pukul ${pt.nextPrayerTime} WIB (sekitar ${pt.minutesToNext} menit lagi). Yuk, siapkan wudu dan salat tepat waktu ya!`,
      mood: 'calm',
      isLocalFallback: true,
    };
  }

  // B. Today's Agenda (Hari Ini)
  if (
    query.includes('agenda') ||
    query.includes('jadwal hari ini') ||
    query.includes('kegiatan hari ini') ||
    query.includes('jadwalku') ||
    query.includes('apa jadwalku')
  ) {
    const items = StorageManager.getItems().filter((i) => i.date === todayStr);
    if (items.length === 0) {
      return {
        cleanText: `Alhamdulillah, belum ada agenda khusus yang terjadwal untuk hari ini, ${userName}. Waktu yang sangat leluasa untuk fokus menulis draft bab disertasi atau beristirahat sejenak!`,
        mood: 'calm',
        isLocalFallback: true,
      };
    }
    const listStr = items
      .map((i) => `• [${i.time || 'Fleksibel'}] ${i.title}${i.completed ? ' (Selesai)' : ''}`)
      .join('\n');
    return {
      cleanText: `Agenda ${userName} untuk hari ini ada ${items.length} kegiatan:\n${listStr}\nSemoga seluruh aktivitas hari ini berkah, lancar, dan produktif ya!`,
      mood: 'happy',
      isLocalFallback: true,
    };
  }

  // C. Dissertation Progress (Disertasi / Tesis / Promotor)
  if (
    query.includes('disertasi') ||
    query.includes('skripsi') ||
    query.includes('tesis') ||
    query.includes('promotor') ||
    query.includes('bab') ||
    query.includes('progres')
  ) {
    const chapters = StorageManager.getDissertationChapters();
    const avg = Math.round(chapters.reduce((s, c) => s + c.progress, 0) / (chapters.length || 1));
    const chList = chapters.map((c) => `Bab ${c.id}: ${c.progress}%`).join(', ');
    return {
      cleanText: `Rerata progres penulisan disertasi ${userName} saat ini mencapai ${avg}%. Rinciannya: ${chList}. Jangan lupa sempatkan menulis minimal 500 kata hari ini ya, konsistensi harian adalah kunci utama menyelesaikan program doktoral tepat waktu!`,
      mood: 'encourage',
      isLocalFallback: true,
    };
  }

  // D. Teaching Schedule (Mengajar / Kuliah)
  if (
    query.includes('mengajar') ||
    query.includes('kuliah') ||
    query.includes('kelas') ||
    query.includes('dosen') ||
    query.includes('mahasiswa')
  ) {
    const teaching = StorageManager.getItems().filter((i) => i.category === 'mengajar');
    if (teaching.length === 0) {
      return {
        cleanText: `Belum ada jadwal perkuliahan tersimpan, ${userName}. Anda dapat menambahkan jadwal kelas baru lewat tab Mengajar.`,
        mood: 'calm',
        isLocalFallback: true,
      };
    }
    const sample = teaching.slice(0, 4).map((t) => `• ${t.title} (${t.date} ${t.time || ''} WIB)`).join('\n');
    return {
      cleanText: `Ada ${teaching.length} jadwal mengajar dan bimbingan mahasiswa terdaftar:\n${sample}\nSiapkan materi ajar dan silabus perkuliahan dengan baik ya!`,
      mood: 'calm',
      isLocalFallback: true,
    };
  }

  // E. Scholarships & Grants (Beasiswa / BIB Kemenag / LPDP)
  if (
    query.includes('beasiswa') ||
    query.includes('hibah') ||
    query.includes('bib') ||
    query.includes('lpdp') ||
    query.includes('tenggat') ||
    query.includes('deadline')
  ) {
    const scholarships = StorageManager.getItems().filter((i) => i.category === 'beasiswa');
    if (scholarships.length === 0) {
      return {
        cleanText: `Belum ada data beasiswa yang dicatat. Anda bisa menambahkan tenggat beasiswa riset doktoral pada tab Beasiswa.`,
        mood: 'calm',
        isLocalFallback: true,
      };
    }
    const sList = scholarships.map((s) => `• ${s.title} (Deadline: ${s.date || 'TBD'})`).join('\n');
    return {
      cleanText: `Berikut daftar beasiswa dan hibah riset yang tersimpan:\n${sList}\nPastikan berkas proposal, surat rekomendasi, dan LoA sudah siap sebelum tanggal tenggat ya, ${userName}!`,
      mood: 'serious',
      isLocalFallback: true,
    };
  }

  // F. Video Editing Workflow
  if (query.includes('video') || query.includes('edit video') || query.includes('editing')) {
    const checklist = StorageManager.getVideoChecklist();
    const done = checklist.filter((c) => c.checked).length;
    return {
      cleanText: `Progres checklist produksi video edukasi: ${done} dari ${checklist.length} tahapan telah selesai. Pastikan rough cut, subtitle bilingual, dan thumbnail sudah disiapkan sebelum ekspor final ya!`,
      mood: 'encourage',
      isLocalFallback: true,
    };
  }

  // G. Upload Schedule
  if (query.includes('upload') || query.includes('publikasi') || query.includes('youtube') || query.includes('tiktok') || query.includes('reels')) {
    const uploads = StorageManager.getItems().filter((i) => i.category === 'upload');
    if (uploads.length === 0) {
      return {
        cleanText: `Belum ada jadwal upload konten yang tersimpan. Anda bisa membuat jadwal baru di tab Upload.`,
        mood: 'calm',
        isLocalFallback: true,
      };
    }
    const upList = uploads.slice(0, 3).map((u) => `• [${u.extra?.platform || 'Media'}] ${u.title} (${u.date} ${u.time || ''})`).join('\n');
    return {
      cleanText: `Jadwal upload konten Anda:\n${upList}\nTetap konsisten berbagi edukasi dan kajian akademik ya, ${userName}!`,
      mood: 'happy',
      isLocalFallback: true,
    };
  }

  // H. Digital Products
  if (query.includes('produk') || query.includes('digital') || query.includes('e-book') || query.includes('ebook') || query.includes('template')) {
    const products = StorageManager.getItems().filter((i) => i.category === 'produk_digital');
    return {
      cleanText: `Anda memiliki ${products.length} ide dan draf produk digital di tab Produk Digital (seperti template skripsi dan e-book riset). Ini potensi luar biasa untuk berbagi ilmu sekaligus sumber pendapatan intelektual pasif!`,
      mood: 'happy',
      isLocalFallback: true,
    };
  }

  // I. Academic References & Literature
  if (query.includes('referensi') || query.includes('buku') || query.includes('jurnal') || query.includes('kitab') || query.includes('scopus')) {
    const refs = StorageManager.getItems().filter((i) => i.category === 'referensi');
    return {
      cleanText: `Tersimpan ${refs.length} rujukan literatur utama di tab Referensi, termasuk karya Syed Muhammad Naquib Al-Attas dan Fazlur Rahman. Butuh kutipan khusus untuk kerangka berpikir Bab II?`,
      mood: 'calm',
      isLocalFallback: true,
    };
  }

  // J. Routines
  if (query.includes('rutinitas') || query.includes('kebiasaan') || query.includes('zikir') || query.includes('tilawah') || query.includes('olahraga')) {
    const routines = StorageManager.getRoutines();
    const doneCount = routines.filter((r) => r.lastDoneDate === todayStr).length;
    return {
      cleanText: `Rutinitas harian ${userName} hari ini: ${doneCount} dari ${routines.length} kebiasaan telah selesai. Kunjungi tab Rutinitas untuk memeriksa atau mencentang capaian hari ini.`,
      mood: 'encourage',
      isLocalFallback: true,
    };
  }

  // K. Routes & Navigation
  if (query.includes('rute') || query.includes('lokasi') || query.includes('jalan') || query.includes('ptiq') || query.includes('perpusnas')) {
    const routes = StorageManager.getRoutes();
    return {
      cleanText: `Tersimpan ${routes.length} rute navigasi kampus di tab Rute (Rumah ke Pascasarjana PTIQ, Perpusnas RI, dan Kemenag). Anda bisa langsung menekan tombol 'Cek Rute' untuk membuka arah jalan di Google Maps!`,
      mood: 'happy',
      isLocalFallback: true,
    };
  }

  // L. Natural Language Task Creation (e.g. "ingatkan besok jam 8 rapat", "catat kuliah...")
  if (
    query.startsWith('ingatkan') ||
    query.startsWith('catat') ||
    query.startsWith('tambah') ||
    query.includes('ingatkan saya') ||
    query.includes('jadwalkan')
  ) {
    // Extract time
    let extractedTime: string | undefined;
    const timeMatch = query.match(/(?:jam|pukul)\s*(\d{1,2})(?::(\d{2})|\.(\d{2}))?/i);
    if (timeMatch) {
      const h = String(timeMatch[1]).padStart(2, '0');
      const m = timeMatch[2] || timeMatch[3] || '00';
      extractedTime = `${h}:${m}`;
    }

    // Extract date
    let targetDate = todayStr;
    if (query.includes('besok')) {
      const tomorrow = new Date(Date.now() + 86400000);
      targetDate = tomorrow.toISOString().split('T')[0];
    } else if (query.includes('lusa')) {
      const dayAfter = new Date(Date.now() + 86400000 * 2);
      targetDate = dayAfter.toISOString().split('T')[0];
    }

    // Clean title
    let title = userText
      .replace(/^(ingatkan|catat|tambah|jadwalkan|tolong ingatkan|tolong catat)( saya)?/i, '')
      .replace(/(besok|lusa|hari ini)/gi, '')
      .replace(/(?:jam|pukul)\s*\d{1,2}(?::\d{2}|\.\d{2})?/gi, '')
      .trim();

    if (!title) title = 'Agenda Baru';

    // Auto-detect category
    let targetCategory: any = 'hari_ini';
    if (query.includes('kuliah') || query.includes('mengajar') || query.includes('kelas') || query.includes('bimbingan')) {
      targetCategory = 'mengajar';
    } else if (query.includes('beasiswa') || query.includes('hibah')) {
      targetCategory = 'beasiswa';
    } else if (query.includes('disertasi') || query.includes('promotor') || query.includes('bab')) {
      targetCategory = 'disertasi';
    } else if (query.includes('upload') || query.includes('video')) {
      targetCategory = 'upload';
    }

    // Save item
    StorageManager.addItem({
      category: targetCategory,
      title: title.charAt(0).toUpperCase() + title.slice(1),
      date: targetDate,
      time: extractedTime,
      completed: false,
    });

    return {
      cleanText: `Siap, ${userName}! Aku sudah mencatat agenda "${title}" untuk ${targetDate === todayStr ? 'hari ini' : 'besok'}${extractedTime ? ' pukul ' + extractedTime + ' WIB' : ''}. Agenda ini sudah tersimpan rapi ya!`,
      mood: 'happy',
      actionExecuted: `Mencatat: ${title} (${targetDate})`,
      isLocalFallback: true,
    };
  }

  // M. Mark Item Completed
  if (query.includes('selesai') || query.includes('sudah') || query.includes('centang')) {
    const items = StorageManager.getItems();
    const active = items.find((i) => !i.completed);
    if (active) {
      StorageManager.updateItem(active.id, { completed: true });
      return {
        cleanText: `Bagus sekali, ${userName}! Agenda "${active.title}" telah ditandai selesai. Satu langkah lagi menuju target akademik Anda tuntas!`,
        mood: 'happy',
        actionExecuted: `Selesai: ${active.title}`,
        isLocalFallback: true,
      };
    }
  }

  // N. Greetings, Identity, & Gratitude
  if (
    query.includes('halo') ||
    query.includes('hai') ||
    query.includes('siapa') ||
    query.includes('kamu siapa') ||
    query.includes('selamat') ||
    query.includes('pagi') ||
    query.includes('siang') ||
    query.includes('sore') ||
    query.includes('malam') ||
    query.includes('assalamu') ||
    query.includes('terima kasih') ||
    query.includes('makasih') ||
    query.includes('thanks')
  ) {
    if (query.includes('terima kasih') || query.includes('makasih') || query.includes('thanks')) {
      return {
        cleanText: `Sama-sama, ${userName}! Senang sekali bisa mendampingi dan mempermudah tugas akademik Anda. Jika ada hal lain yang perlu dicatat atau dipelajari, panggil aku saja ya!`,
        mood: 'happy',
        isLocalFallback: true,
      };
    }
    return {
      cleanText: `Halo ${userName}! Aku Laura Thompson, asisten pribadi & tutor bahasa Inggris Anda. Aku siap membantu kelola agenda harian, bimbingan mahasiswa, progres disertasi S3, waktu salat Kemenag, dan latihan percakapan. Ada yang bisa kubantu sekarang?`,
      mood: 'happy',
      isLocalFallback: true,
    };
  }

  // Default Assistant Fallback
  return {
    cleanText: `Siap ${userName}! Aku telah mencatat masukan Anda. Anda dapat menanyakan agenda hari ini, mengecek jadwal salat, memeriksa progres bab disertasi, atau memintaku mengingatkan agenda baru kapan saja.`,
    mood: 'calm',
    isLocalFallback: true,
  };
}
