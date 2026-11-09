export type TabType =
  | 'beranda'
  | 'tutor_ai'
  | 'skenario'
  | 'shadowing'
  | 'modul'
  | 'tes_level';

export interface BetterSpeakProfile {
  completedAt?: string;
  goal: string;
  currentLevel: 'beginner' | 'elementary' | 'intermediate' | 'advanced';
  biggestChallenge: string;
  dailyCommitment: number; // minutes per day (5, 10, 15, 20)
  miniTestScore: number; // 0-100
  fluencyScore: number; // predicted e.g. 68%
  targetCefr: string; // e.g. 'B2 Academic Speaking'
  personalizedPlan: string;
}

export interface SpeakingScenario {
  id: string;
  title: string;
  category: 'academic' | 'campus' | 'presentation' | 'daily';
  level: 'Beginner' | 'Elementary' | 'Intermediate' | 'Advanced';
  description: string;
  lauraRole: string;
  userRole: string;
  promptStarter: string;
  keyPhrases: string[];
  referenceModule?: string;
}

export interface ShadowingItem {
  id: string;
  title: string;
  sentence: string;
  phonetics?: string;
  indonesian: string;
  difficulty: 'Easy' | 'Medium' | 'Academic';
  tip: string;
  moduleSource?: string;
}

export interface SpeechFeedback {
  fluencyScore: number;
  originalText: string;
  correctedText: string;
  grammarFeedback: string;
  vocabularyUpgrades: Array<{ original: string; better: string; reason: string }>;
  pronunciationTip: string;
  overallPraise: string;
}

export type MoodType = 'happy' | 'calm' | 'serious' | 'encourage' | 'think';

export type AvatarState = 'idle' | 'listening' | 'thinking' | 'speaking';

export type AssistantMode = 'assistant' | 'tutor';

export interface ScheduleItem {
  id: string;
  category: string;
  title: string;
  date?: string; // YYYY-MM-DD
  time?: string; // HH:MM
  note?: string;
  completed?: boolean;
  createdAt: string;
  extra?: Record<string, any>;
}

export interface DissertationChapter {
  id: number;
  name: string;
  subtitle: string;
  progress: number; // 0-100
  notes?: string;
}

export interface DissertationTask {
  id: string;
  title: string;
  targetDate: string;
  completed: boolean;
  supervisorFeedback?: string;
}

export interface VideoChecklistItem {
  id: string;
  label: string;
  checked: boolean;
}

export interface RoutineItem {
  id: string;
  title: string;
  time: string; // HH:MM
  daysOfWeek: number[]; // 0-6 (0 is Sunday, or 1-7)
  lastDoneDate?: string; // YYYY-MM-DD to reset daily
  note?: string;
}

export interface RouteItem {
  id: string;
  label: string;
  origin: string; // empty means current location
  destination: string;
  via?: string;
  note?: string;
}

export interface UserProfile {
  name: string;
  role: string;
  institution: string;
  city: string;
  latitude: number;
  longitude: number;
  timezone: number; // e.g. 7 for WIB
}

export interface AppSettings {
  profile: UserProfile;
  geminiApiKey: string; // for standalone / exported usage
  selectedModel: string;
  discoveredModels: string[];
  autoVoiceEnabled: boolean;
  preferredIdVoice: string;
  preferredEnVoice: string;
  speechRate: number;
  speechPitch: number;
  useGeminiTTS: boolean;
  prayerRemindersEnabled: boolean;
  agendaRemindersEnabled: boolean;
  darkMode: boolean;
}

export interface AttachmentData {
  name: string;
  type: 'image' | 'text';
  mimeType: string;
  dataUrl?: string; // for display & base64
  base64?: string; // pure base64 for Gemini
  textContent?: string;
  sizeBytes: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'laura';
  text: string;
  timestamp: string;
  mood?: MoodType;
  attachment?: AttachmentData;
  functionCallsExecuted?: Array<{ name: string; args: any; resultText: string }>;
  isError?: boolean;
}

export interface PrayerTimesResult {
  dateStr: string;
  subuh: string;
  syuruq: string;
  zuhur: string;
  asar: string;
  magrib: string;
  isya: string;
  nextPrayerName?: string;
  nextPrayerTime?: string;
  minutesToNext?: number;
}
