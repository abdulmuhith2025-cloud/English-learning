/**
 * Speech Recognition and Synthesis utility with dual-language support (ID/EN)
 * Implements sentence-by-sentence language detection, voice ranking heuristics,
 * GC bug mitigation, and mapped Indonesian error feedback.
 */

// Global reference array to prevent SpeechSynthesisUtterance from being garbage-collected mid-speech
let activeUtterances: SpeechSynthesisUtterance[] = [];

// Voice list cache
let cachedVoices: SpeechSynthesisVoice[] = [];

function loadVoices(): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return resolve([]);
    }
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      cachedVoices = voices;
      return resolve(voices);
    }
    const handler = () => {
      cachedVoices = window.speechSynthesis.getVoices();
      window.speechSynthesis.removeEventListener('voiceschanged', handler);
      resolve(cachedVoices);
    };
    window.speechSynthesis.addEventListener('voiceschanged', handler);
    // Timeout fallback after 1 second
    setTimeout(() => {
      cachedVoices = window.speechSynthesis.getVoices();
      resolve(cachedVoices);
    }, 1000);
  });
}

// Unlock Web Audio and SpeechSynthesis on direct user interaction (gesture)
export function unlockSpeechAudio(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
      const silent = new SpeechSynthesisUtterance(' ');
      silent.volume = 0.01;
      silent.rate = 10;
      window.speechSynthesis.speak(silent);
    } catch (_) {}
  }
}

// Initial trigger
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  loadVoices();
}

export function getAvailableVoices(): SpeechSynthesisVoice[] {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return [];
  const voices = window.speechSynthesis.getVoices();
  return voices.length > 0 ? voices : cachedVoices;
}

// Heuristic to detect whether a sentence is primarily English or Indonesian
const ID_WORDS = new Set([
  'dan', 'yang', 'di', 'ke', 'dari', 'ini', 'itu', 'untuk', 'pada', 'adalah',
  'saya', 'aku', 'kamu', 'anda', 'kami', 'kita', 'mereka', 'bisa', 'akan',
  'sudah', 'telah', 'ada', 'tidak', 'bukan', 'halo', 'bagaimana', 'apa',
  'siapa', 'kapan', 'di mana', 'kenapa', 'mengapa', 'salat', 'subuh', 'zuhur',
  'asar', 'magrib', 'isya', 'tenggat', 'tugas', 'disertasi', 'kuliah', 'besok',
  'hari', 'jam', 'menit', 'silakan', 'terima', 'kasih', 'sama', 'yuk', 'ya',
  'ngobrol', 'mikir', 'ngajar', 'bimbingan', 'promotor', 'kampus', 'jangan',
]);

const EN_WORDS = new Set([
  'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i', 'it', 'for',
  'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at', 'this', 'but', 'his',
  'by', 'from', 'they', 'we', 'say', 'her', 'she', 'or', 'an', 'will', 'my',
  'one', 'all', 'would', 'there', 'their', 'what', 'so', 'up', 'out', 'if',
  'about', 'who', 'get', 'which', 'go', 'me', 'when', 'make', 'can', 'like',
  'time', 'no', 'just', 'him', 'know', 'take', 'people', 'into', 'year', 'your',
  'good', 'some', 'could', 'them', 'see', 'other', 'than', 'then', 'now', 'look',
  'only', 'come', 'its', 'over', 'think', 'also', 'back', 'after', 'use', 'two',
  'how', 'our', 'work', 'first', 'well', 'way', 'even', 'new', 'want', 'because',
  'any', 'these', 'give', 'day', 'most', 'us', 'english', 'unit', 'lesson', 'tutor',
]);

export function detectSentenceLanguage(sentence: string): 'id-ID' | 'en-GB' {
  const words = sentence
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);

  let idScore = 0;
  let enScore = 0;

  for (const w of words) {
    if (ID_WORDS.has(w)) idScore += 2;
    if (EN_WORDS.has(w)) enScore += 2;
    // Common endings
    if (w.endsWith('kan') || w.endsWith('nya') || w.startsWith('ber') || w.startsWith('men') || w.startsWith('per')) {
      idScore += 1;
    }
    if (w.endsWith('ing') || w.endsWith('tion') || w.endsWith('ed') || w.endsWith('ly')) {
      enScore += 1;
    }
  }

  return enScore > idScore ? 'en-GB' : 'id-ID';
}

// Split text into natural speakable sentence segments
export function splitIntoSentences(text: string): string[] {
  // Clean markdown or tags if any slipped through
  const clean = text
    .replace(/\[m:[a-z]+\]/gi, '')
    .replace(/[*_#`~[\]]/g, '')
    .trim();

  if (!clean) return [];

  // Split on punctuation (. ? ! \n ;)
  const parts = clean.split(/(?<=[.?!;\n])\s+/);
  return parts.filter((p) => p.trim().length > 0);
}

// Rank best voice for a language
export function findBestVoice(lang: 'id-ID' | 'en-GB', preferredVoiceName?: string): SpeechSynthesisVoice | null {
  const voices = getAvailableVoices();
  if (voices.length === 0) return null;

  if (preferredVoiceName) {
    const matched = voices.find((v) => v.name === preferredVoiceName);
    if (matched) return matched;
  }

  // Filter voices that match the target language prefix
  const langPrefix = lang.startsWith('id') ? 'id' : 'en';
  const matchingVoices = voices.filter((v) => v.lang.toLowerCase().startsWith(langPrefix));

  if (matchingVoices.length === 0) {
    // Fallback: any voice
    return voices[0] || null;
  }

  // Priority scoring:
  // 1. Natural / Neural / Google / Microsoft / Premium
  // 2. Specific dialect match (en-GB for English, id-ID for Indonesian)
  // 3. Female name indicators (since Laura is a female persona)
  const scoreVoice = (v: SpeechSynthesisVoice): number => {
    let score = 0;
    const name = v.name.toLowerCase();
    const vLang = v.lang.toLowerCase();

    if (name.includes('natural') || name.includes('neural') || name.includes('online')) score += 50;
    if (name.includes('google')) score += 40;
    if (name.includes('microsoft')) score += 30;

    if (lang === 'en-GB' && (vLang.includes('gb') || vLang.includes('uk') || name.includes('british') || name.includes('uk'))) {
      score += 25;
    }
    if (lang === 'id-ID' && (vLang.includes('id') || name.includes('indonesia') || name.includes('gadis'))) {
      score += 25;
    }

    if (name.includes('female') || name.includes('woman') || name.includes('gadis') || name.includes('sonia') || name.includes('jenny') || name.includes('libby') || name.includes('hazel')) {
      score += 15;
    }

    return score;
  };

  matchingVoices.sort((a, b) => scoreVoice(b) - scoreVoice(a));
  return matchingVoices[0];
}

// Speak full text using sentence-by-sentence queue with language switching
export async function speakTextQueue(
  text: string,
  options: {
    rate?: number;
    pitch?: number;
    preferredIdVoice?: string;
    preferredEnVoice?: string;
    onStart?: () => void;
    onEnd?: () => void;
    onBoundary?: (charIndex: number) => void;
    onError?: (err: any) => void;
  } = {}
): Promise<void> {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    options.onEnd?.();
    return;
  }

  // Ensure voices are loaded
  await loadVoices();

  // Cancel any existing speech
  cancelSpeech();

  // Small delay after cancel to prevent audio cutting off
  await new Promise((r) => setTimeout(r, 60));

  const sentences = splitIntoSentences(text);
  if (sentences.length === 0) {
    options.onEnd?.();
    return;
  }

  options.onStart?.();

  let currentIndex = 0;

  function speakNext() {
    if (currentIndex >= sentences.length) {
      activeUtterances = [];
      options.onEnd?.();
      return;
    }

    const currentSentence = sentences[currentIndex];
    const sentenceLang = detectSentenceLanguage(currentSentence);
    const chosenVoice =
      sentenceLang === 'en-GB'
        ? findBestVoice('en-GB', options.preferredEnVoice)
        : findBestVoice('id-ID', options.preferredIdVoice);

    const utterance = new SpeechSynthesisUtterance(currentSentence);
    utterance.lang = sentenceLang;
    if (chosenVoice) utterance.voice = chosenVoice;
    utterance.rate = options.rate ?? 0.98;
    utterance.pitch = options.pitch ?? 1.0;

    utterance.onboundary = (e) => {
      options.onBoundary?.(e.charIndex);
    };

    utterance.onend = () => {
      currentIndex++;
      speakNext();
    };

    utterance.onerror = (e) => {
      console.warn('SpeechSynthesis error:', e);
      currentIndex++;
      if (currentIndex >= sentences.length) {
        activeUtterances = [];
        options.onEnd?.();
      } else {
        speakNext();
      }
    };

    // Keep reference in active array to avoid GC
    activeUtterances.push(utterance);
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }
    window.speechSynthesis.speak(utterance);
  }

  speakNext();
}

export function cancelSpeech(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
  activeUtterances = [];
}

export function isSpeaking(): boolean {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return false;
  return window.speechSynthesis.speaking;
}

// Speech Recognition helper with Indonesian error mapping
export interface SpeechRecognitionResultPayload {
  transcript: string;
  isFinal: boolean;
}

export function createSpeechRecognizer(
  lang: 'id-ID' | 'en-GB',
  callbacks: {
    onResult: (transcript: string, isFinal: boolean) => void;
    onError: (errorMessageId: string) => void;
    onEnd: () => void;
  }
) {
  if (typeof window === 'undefined') {
    callbacks.onError('Fitur speech recognition tidak tersedia di browser ini.');
    return null;
  }

  const SpeechRecognitionClass =
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

  if (!SpeechRecognitionClass) {
    callbacks.onError(
      'Browser Anda belum mendukung pengenalan suara (Web Speech API). Silakan gunakan Google Chrome atau Edge.'
    );
    return null;
  }

  // Cancel any active speech synthesis before listening
  cancelSpeech();

  const recognition = new SpeechRecognitionClass();
  recognition.lang = lang;
  recognition.continuous = false;
  recognition.interimResults = true;
  recognition.maxAlternatives = 1;

  recognition.onresult = (event: any) => {
    let interim = '';
    let final = '';

    for (let i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        final += event.results[i][0].transcript;
      } else {
        interim += event.results[i][0].transcript;
      }
    }

    if (final.trim()) {
      callbacks.onResult(final.trim(), true);
    } else if (interim.trim()) {
      callbacks.onResult(interim.trim(), false);
    }
  };

  recognition.onerror = (event: any) => {
    const errorType = event.error;
    let indonesianMsg = 'Terjadi kesalahan pengenalan suara.';

    switch (errorType) {
      case 'not-allowed':
        indonesianMsg =
          'Izin mikrofon ditolak. Mohon aktifkan izin mikrofon di pengaturan browser Anda.';
        break;
      case 'service-not-allowed':
        indonesianMsg = 'Layanan pengenalan suara tidak diizinkan pada perangkat ini.';
        break;
      case 'network':
        indonesianMsg = 'Koneksi internet bermasalah saat memproses pengenalan suara.';
        break;
      case 'no-speech':
        indonesianMsg = 'Suara tidak terdengar. Silakan coba tekan lagi dan bicara lebih dekat ke mikrofon.';
        break;
      case 'audio-capture':
        indonesianMsg = 'Mikrofon tidak ditemukan atau sedang dipakai oleh aplikasi lain.';
        break;
      case 'language-not-supported':
        indonesianMsg = `Bahasa ${lang === 'id-ID' ? 'Indonesia' : 'Inggris'} belum didukung oleh browser Anda.`;
        break;
      default:
        indonesianMsg = `Gagal mengenali suara: ${errorType || 'unknown error'}`;
    }

    callbacks.onError(indonesianMsg);
  };

  recognition.onend = () => {
    callbacks.onEnd();
  };

  return recognition;
}
