import { StorageManager } from './storage';
import { calculatePrayerTimes } from './prayerTimes';
import { MoodType, AssistantMode, AttachmentData, ScheduleItem } from '../types';

// Default model constant - configurable and dynamically updated via auto-discovery
export const DEFAULT_CONFIGURED_MODEL = 'gemini-3.8-flash';

// Normalize model name helper: lowercase, spaces to hyphens, strip "models/"
export function normalizeModelName(rawName: string): string {
  if (!rawName) return DEFAULT_CONFIGURED_MODEL;
  return rawName
    .trim()
    .toLowerCase()
    .replace(/^models\//, '')
    .replace(/\s+/g, '-');
}

// Mood extraction helper: parses [m:mood] tag, strips it from output
export function parseMoodAndText(rawText: string): { mood: MoodType; cleanText: string } {
  const match = rawText.match(/^\s*\[m:(happy|calm|serious|encourage|think)\]\s*/i);
  if (match) {
    const mood = match[1].toLowerCase() as MoodType;
    const cleanText = rawText.replace(match[0], '').trim();
    return { mood, cleanText };
  }
  return { mood: 'calm', cleanText: rawText.trim() };
}

// Format Indonesian prayer times, agenda, dissertation progress into context
export function buildAssistantContext(): string {
  const settings = StorageManager.getSettings();
  const profile = settings.profile;
  const now = new Date();
  const prayerTimes = calculatePrayerTimes(now, profile.latitude, profile.longitude, profile.timezone);
  const items = StorageManager.getItems();
  const chapters = StorageManager.getDissertationChapters();
  const routines = StorageManager.getRoutines();

  const todayStr = now.toISOString().split('T')[0];
  const todayItems = items.filter((i) => i.date === todayStr);
  const overdueItems = items.filter((i) => i.date && i.date < todayStr && !i.completed);
  const upcomingScholarships = items.filter((i) => i.category === 'beasiswa' && !i.completed);

  const avgThesisProgress = Math.round(
    chapters.reduce((sum, c) => sum + c.progress, 0) / (chapters.length || 1)
  );

  return `
[DATA APLIKASI SAAT INI]
Waktu lokal saat ini: ${now.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}, Pukul ${now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
Pengguna: ${profile.name} (${profile.role} di ${profile.institution}, Kota: ${profile.city})
Jadwal Salat Hari Ini:
- Subuh: ${prayerTimes.subuh}
- Syuruq: ${prayerTimes.syuruq}
- Zuhur: ${prayerTimes.zuhur}
- Asar: ${prayerTimes.asar}
- Magrib: ${prayerTimes.magrib}
- Isya: ${prayerTimes.isya}
Salat berikutnya: ${prayerTimes.nextPrayerName} (sekitar ${prayerTimes.minutesToNext} menit lagi, pukul ${prayerTimes.nextPrayerTime})

Progres Disertasi Keseluruhan: ${avgThesisProgress}%
Bab I: ${chapters[0]?.progress || 0}%, Bab II: ${chapters[1]?.progress || 0}%, Bab III: ${chapters[2]?.progress || 0}%, Bab IV: ${chapters[3]?.progress || 0}%, Bab V: ${chapters[4]?.progress || 0}%

Agenda Hari Ini (${todayItems.length} kegiatan):
${todayItems.length > 0 ? todayItems.map((i) => `- [${i.time || 'Waktu fleksibel'}] ${i.title} (${i.category}): ${i.note || '-'}`).join('\n') : '- Belum ada agenda khusus hari ini.'}

Tugas/Tenggat Terlewat (Overdue - Perlu diingatkan tegas):
${overdueItems.length > 0 ? overdueItems.map((i) => `- ${i.title} (Jatuh tempo: ${i.date}): ${i.note || '-'}`).join('\n') : '- Tidak ada agenda tertunda.'}

Beasiswa/Hibah Terdaftar:
${upcomingScholarships.length > 0 ? upcomingScholarships.map((s) => `- ${s.title} (Deadline: ${s.date || 'TBD'}): ${s.note || '-'}`).join('\n') : '- Belum ada beasiswa terdaftar.'}

Rutinitas Harian:
${routines.map((r) => `- [${r.time}] ${r.title} (${r.lastDoneDate === todayStr ? 'Sudah selesai' : 'Belum selesai'})`).join('\n')}
`.trim();
}

// System instructions for ASSISTANT mode
export function getAssistantSystemInstruction(): string {
  const settings = StorageManager.getSettings();
  const name = settings.profile.name || 'Pak Abdul';
  const context = buildAssistantContext();

  return `
You are Laura Thompson, a personal assistant with 10 years of experience at a world-class company: cheerful, energetic, enthusiastic, relaxed but disciplined. Speak informal Indonesian mixed with a little English. Address the user by their name ("${name}"). Keep answers short (max 4 sentences), voice-friendly, no markdown, max one emoji. Be firm when a deadline or schedule is late or near. You only know the app data you are given (agenda, deadlines, dissertation progress, prayer times, current date and time); never invent data.

CRITICAL FORMAT REQUIREMENT:
Always start your reply with exactly one mood tag at the very beginning of the response:
[m:happy] - for celebratory, positive, cheerful news or greetings
[m:calm] - for neutral, peaceful, normal conversational replies
[m:serious] - for reminders of late deadlines, urgent tasks, or strict discipline
[m:encourage] - for motivating on dissertation progress, teaching prep, or hard work
[m:think] - when processing questions, calculating schedules, or analyzing information

Examples:
- "[m:happy] Siap, Pak Abdul! Jadwal kuliah Metodologi Studi Islam sudah aku catat untuk besok jam 9 pagi ya! Jangan lupa materi hermeneutikanya."
- "[m:serious] Pak Abdul, ada agenda yang sudah lewat tenggat nih! Konsultasi Bab IV belum dituntaskan, yuk segera hubungi promotor hari ini juga."
- "[m:encourage] Alhamdulillah, progres Bab II sudah 70% lho, Pak Abdul. Sedikit lagi tuntas kajian teoretisnya!"

${context}
`.trim();
}

// System instructions for TUTOR mode
export function getTutorSystemInstruction(): string {
  const settings = StorageManager.getSettings();
  const name = settings.profile.name || 'Pak Abdul';

  return `
You are Laura Thompson, a virtual English tutor, mentor and teacher in her 30s: friendly, professional, patient, supportive, 10 years of teaching experience (virtual persona; never claim to be a real human; if asked, say you are a virtual assistant playing Laura). Use consistent British English in English and fluent natural Indonesian in Indonesian. Address the student warmly (e.g. "${name}").

Rules:
1) At the start, politely ask age, education level (SD, SMP, SMA/SMK, university student, general) and learning goal (skippable), then do a short, relaxed level check. Age and level are only hints.
2) The primary teaching sources are the two official textbooks written by Abdul Muhit, M.Pd from Lembaga Bahasa & Budaya Universitas PTIQ Jakarta:
   - Module English-01: "Communicative English for Muslim University Students - Semester 1 (Integrated Skills)" [CEFR A1-A2, Units 1-8]
   - Module English-02: "Communicative English for Muslim University Students - Semester 2 (Productive Skills: Developing Speaking and Academic Writing for Meaningful Communication)" [CEFR A2, Units 1-8]
Never invent module content, page numbers, exercises or answer keys. If something is unclear or missing, say so honestly and ask the student to send that part. Mark extra explanations as "additional". You have no audio tracks and no official listening answer key; never invent audio content.
3) Pattern: explain one small concept, give correct examples, give a short exercise, review the answer (what is right, what to fix), end with a brief summary and one next step. For simple questions (word meaning, translation, quick correction) answer directly.
4) Do not give all exercise answers before the student tries, unless asked; give hints step by step; for homework, guide instead of solving.
5) Corrections: show the student's form, the better form, the reason, one more example. Never call something wrong if it is acceptable in some context; explain nuance. For speaking, fluency first.
6) Beginners: explain in Indonesian, then give English examples; increase English gradually. New vocabulary: meaning, usage, short example. Adapt by level: SD short sentences and games; SMP structured; SMA/SMK deeper with reasons; university/general by goal and formality.
7) Never promise exam scores or fluency timelines; never ask for sensitive personal data; keep content age-appropriate. Max about 5 sentences per reply, speakable, no markdown or tables.

CRITICAL FORMAT REQUIREMENT:
Always start your reply with exactly one mood tag at the very beginning:
[m:happy], [m:calm], [m:serious], [m:encourage], or [m:think].

MODULE MAP:
=== SEMESTER 1 (ENGLISH-01: INTEGRATED SKILLS - CEFR A1-A2) ===
Author: Abdul Muhit, M.Pd | Universitas PTIQ Jakarta
Unit 1 Getting to Know Each Other: Greetings, introductions, spelling names; subject pronouns; verb be (am/is/are); QS. Al-Hujurat 49:13; Ahmad & Aisyah.
Unit 2 Daily Activities: Simple Present for routines; clock times (o'clock, half past, quarter past/to); frequency adverbs; QS. Al-'Asr 103:1-3; Fajr & Ma'had schedule.
Unit 3 At Campus: Prepositions of place (next to, opposite, across from, between); imperatives for directions; QS. Al-Baqarah 2:158; campus map (library, mosque, cafeteria).
Unit 4 In the Classroom: Modal verbs can/could/may for permission; polite clarification; wh-questions; QS. Taha 20:114; Mr. Hasan, Room 302.
Unit 5 Making Friends: Verbs of preference (like/love/enjoy + verb-ing); hobbies; QS. Al-Hujurat 49:13; friends across Indonesia (Arif, Siti, Farhan, Nabila, Zaid, Rani).
Unit 6 Food and Dining at the Ma'had: Countable/uncountable nouns; some and any; polite ordering; table manners & gratitude; QS. Al-Baqarah 2:172.
Unit 7 Shopping and Services: Demonstratives (this/that/these/those); Indonesian Rupiah prices in English; PTIQ cooperative store; QS. Al-Mutaffifin 83:1-3.
Unit 8 Weekend Activities: Future with be going to; inviting, accepting and declining invitations; QS. Al-Qasas 28:77; visiting libraries and charities.

=== SEMESTER 2 (ENGLISH-02: PRODUCTIVE SKILLS - CEFR A2) ===
Author: Abdul Muhit, M.Pd | Universitas PTIQ Jakarta
Unit 1 Introducing Yourself Professionally: PREP Strategy (Point, Reason, Example, Purpose); academic background & research goals; professional profile writing (120-150 words); QS. Al-Hujurat 49:13; Ahmad Fauzi.
Unit 2 Talking About Campus Life: Descriptive academic paragraph (150-180 words); campus facilities & academic involvement; there is/there are; sequence expressions; QS. Al-Mujadilah 58:11; Fauzan & Rina.
Unit 3 Giving Directions and Explaining Procedures: Process paragraph writing; sequence connectors (first, next, then, finally); library book borrowing procedure; modal verbs of obligation; QS. An-Nahl 16:125; Alex & Rizal.
Unit 4 Expressing Opinions and Agreements: Academic discussions; opinion paragraph with thesis, reasons, evidence, conclusion; polite agreement/disagreement; QS. Ali 'Imran 3:159; "Should students use AI in learning?"; Fahmi & Rafi.
Unit 5 Delivering Academic Presentations: Opening & signposting transition phrases; closing expressions; handling audience Q&A; presentation outline; QS. An-Nahl 16:125; "The Importance of Reading Books".
Unit 6 Problem Solving and Decision Making: Recommendation paragraph writing; modal verbs should/ought to/had better; Shura (consultation) in Islam; QS. Ash-Shura 42:38; Improving English Day at PTIQ; Rizky, Alya, Fahmi, Siti.
Unit 7 Negotiation and Persuasive Communication: Persuasive paragraph writing (170-200 words); making suggestions & compromising; win-win solutions; QS. An-Nahl 16:125 & QS. Ali 'Imran 3:159; English Festival planning; Rizky, Amin, Nadia, Hafiz.
Unit 8 Final Academic Communication Project: Academic project report (Title, Introduction, Objective, Method, Findings, Recommendations, Conclusion); project presentation & defense; Semester 2 grammar review; QS. Al-Ma'idah 5:2 & QS. Al-Baqarah 2:148 & QS. Al-'Asr 103:3.

Opening line: "Halo! Senang bertemu denganmu. Aku Laura Thompson, tutor Bahasa Inggrismu. Kita akan belajar mengacu pada Modul English-01 dan Modul English-02 karya Bapak Abdul Muhit, M.Pd dari Universitas PTIQ Jakarta. Boleh aku tahu, kamu ingin mempelajari materi Semester 1 (Integrated Skills) atau Semester 2 (Productive Skills) hari ini?"
`.trim();
}

// Execute local function calls requested by Gemini
export function executeLauraFunction(call: { name: string; args: any }): { resultText: string; success: boolean } {
  try {
    const { name, args } = call;
    if (name === 'add_item') {
      const category = (args.category || 'hari_ini').toLowerCase();
      const validCategories = [
        'hari_ini',
        'mengajar',
        'disertasi',
        'referensi',
        'edit_video',
        'upload',
        'beasiswa',
        'produk_digital',
        'rutinitas',
        'rute',
      ];
      const targetCategory = validCategories.includes(category) ? category : 'hari_ini';

      // Parse relative date if needed
      let itemDate = args.date;
      if (!itemDate) {
        itemDate = new Date().toISOString().split('T')[0];
      }

      const created = StorageManager.addItem({
        category: targetCategory as any,
        title: args.title,
        date: itemDate,
        time: args.time || undefined,
        note: args.note || undefined,
        completed: false,
      });

      return {
        success: true,
        resultText: `Berhasil mencatat "${created.title}" pada tab ${created.category}${created.date ? ' (' + created.date + ')' : ''}.`,
      };
    }

    if (name === 'complete_item') {
      const items = StorageManager.getItems();
      const target = items.find(
        (i) => i.title.toLowerCase().includes((args.title || '').toLowerCase()) && !i.completed
      );
      if (target) {
        StorageManager.updateItem(target.id, { completed: true });
        return {
          success: true,
          resultText: `Item "${target.title}" telah ditandai selesai!`,
        };
      }
      return {
        success: false,
        resultText: `Tidak menemukan item yang belum selesai dengan kata kunci "${args.title}".`,
      };
    }

    if (name === 'delete_item') {
      const items = StorageManager.getItems();
      const target = items.find((i) =>
        i.title.toLowerCase().includes((args.title || '').toLowerCase())
      );
      if (target) {
        StorageManager.deleteItem(target.id);
        return {
          success: true,
          resultText: `Item "${target.title}" telah dihapus dari daftar.`,
        };
      }
      return {
        success: false,
        resultText: `Item dengan kata kunci "${args.title}" tidak ditemukan.`,
      };
    }

    if (name === 'list_items') {
      const items = StorageManager.getItems();
      const category = args.category;
      const filtered = category && category !== 'all' ? items.filter((i) => i.category === category) : items;
      const listSummary = filtered
        .slice(0, 8)
        .map((i) => `• [${i.date || '-'}] ${i.title} (${i.category})`)
        .join(', ');
      return {
        success: true,
        resultText: `Ditemukan ${filtered.length} item: ${listSummary}`,
      };
    }

    return {
      success: false,
      resultText: `Fungsi ${name} belum didukung.`,
    };
  } catch (err: any) {
    return {
      success: false,
      resultText: `Gagal menjalankan aksi: ${err?.message || 'Error internal'}`,
    };
  }
}

// Resize image to max 1280px JPEG before multimodal upload
export async function processImageAttachment(file: File): Promise<AttachmentData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const MAX_DIM = 1280;
        let width = img.width;
        let height = img.height;

        if (width > MAX_DIM || height > MAX_DIM) {
          if (width > height) {
            height = Math.round((height * MAX_DIM) / width);
            width = MAX_DIM;
          } else {
            width = Math.round((width * MAX_DIM) / height);
            height = MAX_DIM;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return reject(new Error('Gagal menginisialisasi canvas untuk gambar.'));
        }

        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        const base64 = dataUrl.split(',')[1];

        resolve({
          name: file.name,
          type: 'image',
          mimeType: 'image/jpeg',
          dataUrl,
          base64,
          sizeBytes: Math.round((base64.length * 3) / 4),
        });
      };
      img.onerror = () => reject(new Error('Gagal memuat file gambar.'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Gagal membaca file dari perangkat.'));
    reader.readAsDataURL(file);
  });
}

// Process text document attachments (.txt, .md, .csv, .json, .html, .xml, .srt, .vtt)
export async function processTextAttachment(file: File): Promise<AttachmentData> {
  const MAX_CHARS = 12000;
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      let content = (e.target?.result as string) || '';
      if (content.length > MAX_CHARS) {
        content = content.substring(0, MAX_CHARS) + '\n\n[Konten dipotong karena melebihi 12.000 karakter]';
      }
      resolve({
        name: file.name,
        type: 'text',
        mimeType: file.type || 'text/plain',
        textContent: content,
        sizeBytes: file.size,
      });
    };
    reader.onerror = () => reject(new Error('Gagal membaca file teks.'));
    reader.readAsText(file);
  });
}

// Auto-discovery of Gemini models
export async function discoverGeminiModels(customApiKey?: string): Promise<{
  models: string[];
  recommended: string;
}> {
  const headers: Record<string, string> = {};
  if (customApiKey) {
    headers['x-gemini-api-key'] = customApiKey;
  }

  const response = await fetch('/api/gemini/models', {
    method: 'GET',
    headers,
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(
      `Gagal memeriksa daftar model (${response.status}): ${errData.error || response.statusText}`
    );
  }

  const data = await response.json();
  return {
    models: data.models || [DEFAULT_CONFIGURED_MODEL],
    recommended: data.recommended || DEFAULT_CONFIGURED_MODEL,
  };
}

// Send chat message with full error handling and retry mechanism
export async function sendChatMessage(params: {
  messages: Array<{ role: 'user' | 'model'; parts: any[] }>;
  mode: AssistantMode;
  model: string;
  customApiKey?: string;
  onChunk?: (textDelta: string) => void;
}): Promise<{
  fullText: string;
  mood: MoodType;
  cleanText: string;
  functionCalls?: any[];
}> {
  const settings = StorageManager.getSettings();
  const apiKey = params.customApiKey || settings.geminiApiKey;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (apiKey) {
    headers['x-gemini-api-key'] = apiKey;
  }

  const systemInstruction =
    params.mode === 'assistant' ? getAssistantSystemInstruction() : getTutorSystemInstruction();

  const body = {
    contents: params.messages,
    systemInstruction,
    model: normalizeModelName(params.model),
    enableTools: params.mode === 'assistant', // function calling active in assistant mode
    stream: false, // Unary call gives structured function calls reliably
  };

  const response = await fetch('/api/gemini/chat', {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorJson = await response.json().catch(() => ({}));
    const status = response.status;
    const msg = errorJson.error || response.statusText || 'Terjadi gangguan jaringan';
    throw new Error(`API Error [Status ${status}]: ${msg}`);
  }

  const data = await response.json();
  const rawText = data.text || '';
  const { mood, cleanText } = parseMoodAndText(rawText);

  return {
    fullText: rawText,
    mood,
    cleanText,
    functionCalls: data.functionCalls || undefined,
  };
}
