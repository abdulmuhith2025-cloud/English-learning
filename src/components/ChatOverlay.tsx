import React, { useState, useRef, useEffect } from 'react';
import { Avatar } from './Avatar';
import {
  ChatMessage,
  AvatarState,
  MoodType,
  AssistantMode,
  AttachmentData,
} from '../types';
import {
  sendChatMessage,
  processImageAttachment,
  processTextAttachment,
  executeLauraFunction,
} from '../utils/gemini';
import {
  speakTextQueue,
  cancelSpeech,
  createSpeechRecognizer,
  unlockSpeechAudio,
} from '../utils/speech';
import { handleLocalAssistantQuery } from '../utils/localAssistant';
import { StorageManager } from '../utils/storage';
import { EnglishCurriculumModal } from './EnglishCurriculumModal';
import { CurriculumUnit } from '../data/englishCurriculum';
import {
  X,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Paperclip,
  Camera,
  Trash2,
  Sparkles,
  GraduationCap,
  Briefcase,
  AlertCircle,
  FileText,
  Image as ImageIcon,
  Key,
  Play,
  RotateCcw,
  BookOpen,
} from 'lucide-react';

interface ChatOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  avatarState: AvatarState;
  setAvatarState: (state: AvatarState) => void;
  avatarMood: MoodType;
  setAvatarMood: (mood: MoodType) => void;
  onDataChanged?: () => void;
  onOpenSettings?: () => void;
  initialTutorPrompt?: string | null;
  initialLauraGreeting?: string | null;
  onClearInitialPrompt?: () => void;
}

export const ChatOverlay: React.FC<ChatOverlayProps> = ({
  isOpen,
  onClose,
  avatarState,
  setAvatarState,
  avatarMood,
  setAvatarMood,
  onDataChanged,
  onOpenSettings,
  initialTutorPrompt,
  initialLauraGreeting,
  onClearInitialPrompt,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() =>
    StorageManager.getChatHistory()
  );
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<AssistantMode>(() =>
    StorageManager.getAssistantMode()
  );
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [speechLang, setSpeechLang] = useState<'id-ID' | 'en-GB'>('id-ID');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTranscript, setRecordingTranscript] = useState('');
  const [attachment, setAttachment] = useState<AttachmentData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isCurriculumOpen, setIsCurriculumOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Auto-scroll on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading, recordingTranscript]);

  // Initial welcome message if history is empty
  useEffect(() => {
    if (messages.length === 0) {
      const settings = StorageManager.getSettings();
      const userName = settings.profile.name || 'Pak Abdul';
      const welcomeMsg: ChatMessage = {
        id: 'msg-welcome',
        sender: 'laura',
        text: `Halo ${userName}! Aku Laura Thompson, asisten pribadi & tutormu. Kamu bisa berbicara atau mengetik untuk mengatur agenda, jadwal mengajar, progres disertasi, atau belajar bahasa Inggris bersamaku mengacu pada Modul English-01 & English-02 (PTIQ). Mau mulai dari mana hari ini?`,
        mood: 'happy',
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages([welcomeMsg]);
      StorageManager.saveChatHistory([welcomeMsg]);
    }
  }, []);

  // Handle incoming scenario or prompt from BetterSpeak
  useEffect(() => {
    if (isOpen && initialTutorPrompt) {
      setMode('tutor');
      StorageManager.saveAssistantMode('tutor');
      if (initialLauraGreeting) {
        const scenarioMsg: ChatMessage = {
          id: 'sc-msg-' + Date.now(),
          sender: 'laura',
          text: initialLauraGreeting,
          mood: 'happy',
          timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        };
        const updated = [...messages, scenarioMsg];
        updateMessages(updated);
        handleSpeakMessage(initialLauraGreeting);
      } else {
        setInputText(initialTutorPrompt);
      }
      onClearInitialPrompt?.();
    }
  }, [isOpen, initialTutorPrompt, initialLauraGreeting]);

  // Save history to localStorage
  const updateMessages = (newMsgs: ChatMessage[]) => {
    setMessages(newMsgs);
    StorageManager.saveChatHistory(newMsgs);
  };

  // Speak a specific message aloud
  const handleSpeakMessage = (text: string) => {
    unlockSpeechAudio();
    cancelSpeech();
    setAvatarState('speaking');
    const settings = StorageManager.getSettings();
    speakTextQueue(text, {
      preferredIdVoice: settings.preferredIdVoice,
      preferredEnVoice: settings.preferredEnVoice,
      rate: settings.speechRate,
      pitch: settings.speechPitch,
      onEnd: () => setAvatarState('idle'),
      onError: () => setAvatarState('idle'),
    });
  };

  // Switch between Assistant and English Tutor modes
  const handleToggleMode = (newMode: AssistantMode) => {
    if (newMode === mode) return;
    setMode(newMode);
    StorageManager.saveAssistantMode(newMode);

    unlockSpeechAudio();

    if (newMode === 'tutor') {
      const tutorIntro: ChatMessage = {
        id: 'tutor-intro-' + Date.now(),
        sender: 'laura',
        text: 'Halo! Senang bertemu denganmu. Aku Laura Thompson, tutor Bahasa Inggrismu. Kita akan belajar mengacu pada Modul English-01 (Integrated Skills) dan Modul English-02 (Productive Skills) karya Bapak Abdul Muhit, M.Pd dari Universitas PTIQ Jakarta. Kamu bisa memilih materi Semester 1 atau Semester 2, atau ketuk tombol Silabus Modul di atas!',
        mood: 'happy',
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      };
      const updated = [...messages, tutorIntro];
      updateMessages(updated);

      if (voiceEnabled) {
        setAvatarState('speaking');
        setAvatarMood('happy');
        const settings = StorageManager.getSettings();
        speakTextQueue(tutorIntro.text, {
          preferredIdVoice: settings.preferredIdVoice,
          preferredEnVoice: settings.preferredEnVoice,
          rate: settings.speechRate,
          pitch: settings.speechPitch,
          onEnd: () => setAvatarState('idle'),
          onError: () => setAvatarState('idle'),
        });
      }
    } else {
      const settings = StorageManager.getSettings();
      const userName = settings.profile.name || 'Pak Abdul';
      const assistantIntro: ChatMessage = {
        id: 'asst-intro-' + Date.now(),
        sender: 'laura',
        text: `Mode Asisten aktif, ${userName}. Aku siap membantu kelola agenda harian, bimbingan, riset disertasi, dan tenggat beasiswa Anda.`,
        mood: 'calm',
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      };
      updateMessages([...messages, assistantIntro]);
    }
  };

  // Handle Voice Input Toggle
  const toggleSpeechRecognition = () => {
    unlockSpeechAudio();

    if (isRecording) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsRecording(false);
      setAvatarState('idle');
      return;
    }

    // Cancel any speech output first
    cancelSpeech();
    setErrorMessage(null);

    const recognizer = createSpeechRecognizer(speechLang, {
      onResult: (transcript, isFinal) => {
        setRecordingTranscript(transcript);
        if (isFinal) {
          setInputText((prev) => (prev ? `${prev} ${transcript}` : transcript));
          setRecordingTranscript('');
        }
      },
      onError: (errMsg) => {
        setErrorMessage(errMsg);
        setIsRecording(false);
        setAvatarState('idle');
      },
      onEnd: () => {
        setIsRecording(false);
        setAvatarState('idle');
      },
    });

    if (recognizer) {
      recognitionRef.current = recognizer;
      setIsRecording(true);
      setAvatarState('listening');
      try {
        recognizer.start();
      } catch (err: any) {
        setErrorMessage('Gagal memulai pengenalan suara: ' + (err?.message || 'Error'));
        setIsRecording(false);
        setAvatarState('idle');
      }
    }
  };

  // Handle File Input
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileName = file.name.toLowerCase();
    const fileSizeMB = file.size / (1024 * 1024);

    if (fileSizeMB > 2) {
      setErrorMessage(`Ukuran file ${file.name} melebihi batas 2 MB.`);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // Unsupported format detection: PDF, Word, Excel, PowerPoint
    if (
      fileName.endsWith('.pdf') ||
      fileName.endsWith('.doc') ||
      fileName.endsWith('.docx') ||
      fileName.endsWith('.xls') ||
      fileName.endsWith('.xlsx') ||
      fileName.endsWith('.ppt') ||
      fileName.endsWith('.pptx')
    ) {
      setErrorMessage(
        `Format file "${file.name}" tidak didukung langsung. Silakan ambil foto/tangkapan layar (screenshot) dokumen tersebut, atau salin-tempel (copy-paste) teksnya ke kolom chat ini ya!`
      );
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    try {
      if (file.type.startsWith('image/')) {
        const att = await processImageAttachment(file);
        setAttachment(att);
        setErrorMessage(null);
      } else if (
        fileName.endsWith('.txt') ||
        fileName.endsWith('.md') ||
        fileName.endsWith('.csv') ||
        fileName.endsWith('.json') ||
        fileName.endsWith('.html') ||
        fileName.endsWith('.xml') ||
        fileName.endsWith('.srt') ||
        fileName.endsWith('.vtt')
      ) {
        const att = await processTextAttachment(file);
        setAttachment(att);
        setErrorMessage(null);
      } else {
        setErrorMessage(
          `Format file tidak didukung. Harap gunakan gambar (JPG/PNG) atau file teks (.txt, .md, .csv, .json, .html, .xml, .srt, .vtt).`
        );
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Gagal memproses lampiran.');
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Handle Send Message
  const handleSendMessage = async (textToSend?: string) => {
    // Prime speech audio on user gesture
    unlockSpeechAudio();

    const query = (textToSend || inputText).trim();
    if (!query && !attachment) return;

    const userMessage: ChatMessage = {
      id: 'usr-' + Date.now(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      attachment: attachment || undefined,
    };

    const updatedHistory = [...messages, userMessage];
    updateMessages(updatedHistory);
    setInputText('');
    const currentAttachment = attachment;
    setAttachment(null);
    setErrorMessage(null);
    setIsLoading(true);
    setAvatarState('thinking');

    // Build Gemini contents array (last 12 messages for conversational context)
    const contextSlice = updatedHistory.slice(-12);
    const geminiContents = contextSlice.map((m) => {
      const parts: any[] = [];
      if (m.attachment) {
        if (m.attachment.type === 'image' && m.attachment.base64) {
          parts.push({
            inlineData: {
              mimeType: m.attachment.mimeType,
              data: m.attachment.base64,
            },
          });
        } else if (m.attachment.type === 'text' && m.attachment.textContent) {
          parts.push({
            text: `[Lampiran Dokumen ${m.attachment.name}]:\n${m.attachment.textContent}`,
          });
        }
      }
      if (m.text) {
        parts.push({ text: m.text });
      }
      return {
        role: m.sender === 'user' ? ('user' as const) : ('model' as const),
        parts,
      };
    });

    const settings = StorageManager.getSettings();

    // If user has provided a personal Gemini API key, use it; otherwise use 100% free instant local AI
    if (settings.geminiApiKey && settings.geminiApiKey.trim()) {
      try {
        const res = await sendChatMessage({
          messages: geminiContents,
          mode,
          model: settings.selectedModel,
          customApiKey: settings.geminiApiKey,
        });

        setAvatarMood(res.mood);

        let executedInfo: Array<{ name: string; args: any; resultText: string }> = [];
        if (res.functionCalls && res.functionCalls.length > 0) {
          for (const call of res.functionCalls) {
            const execRes = executeLauraFunction(call);
            executedInfo.push({
              name: call.name,
              args: call.args,
              resultText: execRes.resultText,
            });
          }
          onDataChanged?.();
        }

        const lauraMessage: ChatMessage = {
          id: 'lau-' + Date.now(),
          sender: 'laura',
          text: res.cleanText,
          mood: res.mood,
          timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
          functionCallsExecuted: executedInfo.length > 0 ? executedInfo : undefined,
        };

        const finalHistory = [...updatedHistory, lauraMessage];
        updateMessages(finalHistory);
        setIsLoading(false);

        if (voiceEnabled && res.cleanText) {
          setAvatarState('speaking');
          speakTextQueue(res.cleanText, {
            preferredIdVoice: settings.preferredIdVoice,
            preferredEnVoice: settings.preferredEnVoice,
            rate: settings.speechRate,
            pitch: settings.speechPitch,
            onEnd: () => setAvatarState('idle'),
            onError: () => setAvatarState('idle'),
          });
        } else {
          setAvatarState('idle');
        }
        return;
      } catch (err) {
        console.warn('Personal key call failed, falling back to free local AI:', err);
      }
    }

    // 100% FREE Instant Laura AI Engine (Zero Cost, No Billing Required)
    setTimeout(() => {
      const localRes = handleLocalAssistantQuery(query, mode);
      setAvatarMood(localRes.mood);

      if (localRes.actionExecuted) {
        onDataChanged?.();
      }

      const lauraMessage: ChatMessage = {
        id: 'lau-free-' + Date.now(),
        sender: 'laura',
        text: localRes.cleanText,
        mood: localRes.mood,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        functionCallsExecuted: localRes.actionExecuted
          ? [{ name: 'local_action', args: {}, resultText: localRes.actionExecuted }]
          : undefined,
      };

      const finalHistory = [...updatedHistory, lauraMessage];
      updateMessages(finalHistory);
      setIsLoading(false);

      if (voiceEnabled && localRes.cleanText) {
        setAvatarState('speaking');
        speakTextQueue(localRes.cleanText, {
          preferredIdVoice: settings.preferredIdVoice,
          preferredEnVoice: settings.preferredEnVoice,
          rate: settings.speechRate,
          pitch: settings.speechPitch,
          onEnd: () => setAvatarState('idle'),
          onError: () => setAvatarState('idle'),
        });
      } else {
        setAvatarState('idle');
      }
    }, 250);
  };

  const handleClearHistory = () => {
    if (confirm('Bersihkan seluruh riwayat percakapan dengan Laura?')) {
      cancelSpeech();
      StorageManager.clearChatHistory();
      setMessages([]);
      setAvatarState('idle');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#f6f3ec] dark:bg-stone-950 text-[#1c2e28] dark:text-stone-100 animate-in fade-in zoom-in-95 duration-200">
      {/* Top Header */}
      <div className="safe-top flex items-center justify-between px-4 py-3 bg-white/80 dark:bg-stone-900/80 backdrop-blur-md border-b border-[#0f5c4d]/10 dark:border-stone-800 shadow-sm">
        {/* Mode Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-stone-100 dark:bg-stone-800 rounded-xl">
          <button
            onClick={() => handleToggleMode('assistant')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              mode === 'assistant'
                ? 'bg-[#0f5c4d] text-white shadow-sm'
                : 'text-stone-600 dark:text-stone-300 hover:text-stone-900'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Mode: Asisten</span>
          </button>
          <button
            onClick={() => handleToggleMode('tutor')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              mode === 'tutor'
                ? 'bg-[#a87a08] text-white shadow-sm'
                : 'text-stone-600 dark:text-stone-300 hover:text-stone-900'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Mode: Tutor English</span>
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Silabus Modul Button */}
          <button
            onClick={() => setIsCurriculumOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-amber-400/20 text-[#a87a08] dark:text-amber-300 hover:bg-amber-400/30 font-bold text-xs border border-amber-400/30 transition shadow-2xs"
            title="Buka Silabus Lengkap & Unduh PDF Modul English-01 & 02"
          >
            <BookOpen className="w-4 h-4 text-[#a87a08] dark:text-amber-400" />
            <span className="hidden sm:inline">Silabus Modul</span>
          </button>

          {/* Settings API Key Shortcut */}
          {onOpenSettings && (
            <button
              onClick={onOpenSettings}
              className="p-2 rounded-xl text-stone-500 hover:text-[#0f5c4d] hover:bg-stone-100 dark:hover:bg-stone-800 transition"
              title="Pengaturan & API Key"
            >
              <Key className="w-4 h-4" />
            </button>
          )}

          {/* Voice Output Toggle */}
          <button
            onClick={() => {
              if (voiceEnabled) cancelSpeech();
              setVoiceEnabled(!voiceEnabled);
            }}
            className={`p-2 rounded-xl transition ${
              voiceEnabled
                ? 'bg-[#0f5c4d]/10 text-[#0f5c4d] dark:bg-emerald-950/40 dark:text-emerald-400'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-400'
            }`}
            title={voiceEnabled ? 'Suara Laura Aktif (Klik untuk Matikan)' : 'Suara Laura Dimatikan (Klik untuk Aktifkan)'}
          >
            {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Clear history */}
          <button
            onClick={handleClearHistory}
            className="p-2 rounded-xl text-stone-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition"
            title="Bersihkan riwayat chat"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          {/* Close overlay */}
          <button
            onClick={() => {
              cancelSpeech();
              onClose();
            }}
            className="p-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 transition"
            aria-label="Tutup panel obrolan"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Tutor Mode Official Curriculum Ribbon */}
      {mode === 'tutor' && (
        <div className="bg-amber-500/15 dark:bg-amber-500/10 border-b border-amber-500/20 px-4 py-1.5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 truncate">
            <BookOpen className="w-3.5 h-3.5 text-[#a87a08] shrink-0" />
            <span className="font-semibold text-stone-800 dark:text-amber-200 truncate">
              Materi Ajar: Modul English-01 & 02 (Abdul Muhit, M.Pd - PTIQ Jakarta)
            </span>
          </div>
          <button
            onClick={() => setIsCurriculumOpen(true)}
            className="text-[11px] font-bold text-[#a87a08] dark:text-amber-300 hover:underline shrink-0 ml-2"
          >
            Buka Silabus & PDF →
          </button>
        </div>
      )}

      {/* Centered Large Animated Laura Avatar Banner */}
      <div className="py-3 px-4 bg-gradient-to-b from-white/90 to-transparent dark:from-stone-900/90 flex flex-col items-center justify-center border-b border-[#0f5c4d]/5">
        <Avatar
          size="lg"
          state={avatarState}
          mood={avatarMood}
          showStatusText={true}
          onClick={() => {
            if (avatarState === 'speaking') {
              cancelSpeech();
              setAvatarState('idle');
            } else {
              handleSpeakMessage(messages[messages.length - 1]?.text || 'Halo! Aku siap mengobrol.');
            }
          }}
        />
        <div className="mt-1 flex items-center gap-2">
          <span className="text-[11px] text-stone-500 italic">
            Animasi gerak bibir merupakan simulasi visual fonetik
          </span>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-full`}
            >
              <div
                className={`rounded-2xl px-4 py-3 max-w-[88%] md:max-w-[75%] shadow-sm relative group ${
                  isUser
                    ? 'bg-[#0f5c4d] text-white rounded-br-xs'
                    : msg.isError
                    ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-200 border border-rose-300 rounded-bl-xs'
                    : 'bg-white dark:bg-stone-800 text-[#1c2e28] dark:text-stone-100 border border-[#0f5c4d]/10 dark:border-stone-700 rounded-bl-xs'
                }`}
              >
                {/* Multimodal Attachment Preview if present */}
                {msg.attachment && (
                  <div className="mb-2">
                    {msg.attachment.type === 'image' && msg.attachment.dataUrl ? (
                      <div className="rounded-lg overflow-hidden border border-black/10 max-w-xs">
                        <img
                          src={msg.attachment.dataUrl}
                          alt="Lampiran"
                          className="max-h-48 object-cover w-full"
                        />
                        <div className="p-1 bg-black/40 text-[10px] text-white px-2 truncate">
                          📷 {msg.attachment.name}
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 p-2 bg-stone-100 dark:bg-stone-700/50 rounded-lg text-xs text-stone-700 dark:text-stone-200">
                        <FileText className="w-4 h-4 shrink-0 text-[#0f5c4d]" />
                        <span className="truncate">{msg.attachment.name}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Message Text */}
                <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{msg.text}</p>

                {/* Function Call Execution Badge */}
                {msg.functionCallsExecuted && msg.functionCallsExecuted.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-[#0f5c4d]/15 text-xs text-emerald-800 dark:text-emerald-300 space-y-1">
                    {msg.functionCallsExecuted.map((fc, i) => (
                      <div key={i} className="flex items-start gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 mt-0.5 shrink-0 text-[#a87a08]" />
                        <span>{fc.resultText}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Time, Mood info, and Replay Audio button */}
                <div
                  className={`mt-1.5 flex items-center justify-end gap-2 text-[10px] ${
                    isUser ? 'text-emerald-200' : 'text-stone-400'
                  }`}
                >
                  {!isUser && (
                    <button
                      onClick={() => handleSpeakMessage(msg.text)}
                      className="text-stone-400 hover:text-[#0f5c4d] p-0.5 transition flex items-center gap-0.5"
                      title="Dengarkan suara pesan ini"
                    >
                      <Volume2 className="w-3 h-3" />
                      <span className="text-[9px]">Ucapkan</span>
                    </button>
                  )}
                  {msg.mood && !isUser && <span>[{msg.mood}]</span>}
                  <span>{msg.timestamp}</span>
                </div>
              </div>
            </div>
          );
        })}

        {/* Live speech transcription preview */}
        {isRecording && recordingTranscript && (
          <div className="flex items-center gap-2 p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-300 rounded-xl text-xs text-amber-900 dark:text-amber-200 animate-pulse">
            <Mic className="w-4 h-4 text-amber-600 animate-bounce" />
            <span className="italic">"{recordingTranscript}..."</span>
          </div>
        )}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex items-center gap-2 text-stone-500 text-xs py-2 px-3 bg-white/60 dark:bg-stone-800/60 rounded-xl w-fit">
            <span className="w-2 h-2 rounded-full bg-[#0f5c4d] animate-ping" />
            <span>Laura sedang memproses jawaban & suara...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Error / API Notice Bar */}
      {errorMessage && (
        <div className="mx-4 mb-2 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-300 text-amber-900 dark:text-amber-200 text-xs flex items-start gap-2.5 shadow-sm">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
          <div className="flex-1">
            <p className="font-semibold">Info Koneksi AI:</p>
            <p className="mt-0.5 text-[11px] leading-relaxed">{errorMessage}</p>
            {onOpenSettings && (
              <button
                onClick={onOpenSettings}
                className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-[#0f5c4d] text-white rounded-lg font-semibold text-xs shadow-xs hover:bg-[#0d4f42] transition"
              >
                <Key className="w-3.5 h-3.5" />
                <span>Masukkan API Key Pribadi</span>
              </button>
            )}
          </div>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-amber-600 hover:text-amber-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Attachment Preview Chip */}
      {attachment && (
        <div className="mx-4 mb-2 p-2 bg-white dark:bg-stone-800 rounded-xl border border-[#0f5c4d]/20 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2 text-xs truncate">
            {attachment.type === 'image' ? (
              <ImageIcon className="w-4 h-4 text-[#0f5c4d]" />
            ) : (
              <FileText className="w-4 h-4 text-[#a87a08]" />
            )}
            <span className="font-medium truncate">{attachment.name}</span>
            <span className="text-[10px] text-stone-400">
              ({Math.round(attachment.sizeBytes / 1024)} KB)
            </span>
          </div>
          <button
            onClick={() => setAttachment(null)}
            className="p-1 rounded-lg text-stone-400 hover:text-rose-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Quick Suggestions */}
      <div className="px-4 py-1.5 flex gap-2 overflow-x-auto no-scrollbar text-xs">
        {mode === 'assistant' ? (
          <>
            <button
              onClick={() => handleSendMessage('Apa saja agenda dan jadwalku hari ini?')}
              className="shrink-0 px-3 py-1 bg-white dark:bg-stone-800 hover:bg-[#0f5c4d]/10 border border-[#0f5c4d]/20 rounded-full text-stone-700 dark:text-stone-300 transition"
            >
              📅 Agenda Hari Ini
            </button>
            <button
              onClick={() => handleSendMessage('Bagaimana progres bab disertasi dan bimbingan promotor?')}
              className="shrink-0 px-3 py-1 bg-white dark:bg-stone-800 hover:bg-[#0f5c4d]/10 border border-[#0f5c4d]/20 rounded-full text-stone-700 dark:text-stone-300 transition"
            >
              🎓 Progres Disertasi
            </button>
            <button
              onClick={() => handleSendMessage('Berapa menit lagi waktu salat berikutnya?')}
              className="shrink-0 px-3 py-1 bg-white dark:bg-stone-800 hover:bg-[#0f5c4d]/10 border border-[#0f5c4d]/20 rounded-full text-stone-700 dark:text-stone-300 transition"
            >
              🕌 Waktu Salat
            </button>
            <button
              onClick={() => handleSendMessage('Apa jadwal mengajarku minggu ini?')}
              className="shrink-0 px-3 py-1 bg-white dark:bg-stone-800 hover:bg-[#0f5c4d]/10 border border-[#0f5c4d]/20 rounded-full text-stone-700 dark:text-stone-300 transition"
            >
              📚 Jadwal Mengajar
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setIsCurriculumOpen(true)}
              className="shrink-0 px-3 py-1 bg-amber-400 text-stone-900 font-bold hover:bg-amber-300 rounded-full transition flex items-center gap-1 shadow-2xs"
            >
              <BookOpen className="w-3.5 h-3.5 text-stone-900" />
              <span>📚 Silabus & PDF Modul</span>
            </button>
            <button
              onClick={() =>
                handleSendMessage('Mari kita pelajari Modul English-02 Unit 1: Professional Self-Introduction dan strategi PREP (Point, Reason, Example, Purpose)!')
              }
              className="shrink-0 px-3 py-1 bg-white dark:bg-stone-800 hover:bg-[#a87a08]/10 border border-[#a87a08]/30 rounded-full text-stone-700 dark:text-stone-300 transition"
            >
              🎯 S2 U1: PREP Strategy
            </button>
            <button
              onClick={() =>
                handleSendMessage('Bagaimana cara menulis paragraf deskriptif tentang kampus di Modul English-02 Unit 2?')
              }
              className="shrink-0 px-3 py-1 bg-white dark:bg-stone-800 hover:bg-[#a87a08]/10 border border-[#a87a08]/30 rounded-full text-stone-700 dark:text-stone-300 transition"
            >
              🏫 S2 U2: Campus Life
            </button>
            <button
              onClick={() =>
                handleSendMessage('Tolong ajarkan cara menjelaskan prosedur meminjam buku di perpustakaan (Process Paragraph) dari Modul English-02 Unit 3!')
              }
              className="shrink-0 px-3 py-1 bg-white dark:bg-stone-800 hover:bg-[#a87a08]/10 border border-[#a87a08]/30 rounded-full text-stone-700 dark:text-stone-300 transition"
            >
              📖 S2 U3: Library Procedure
            </button>
            <button
              onClick={() =>
                handleSendMessage('Mari berdiskusi akademik tentang Modul English-02 Unit 4: "Should students use AI in learning?". Apa argumen dan etikanya?')
              }
              className="shrink-0 px-3 py-1 bg-white dark:bg-stone-800 hover:bg-[#a87a08]/10 border border-[#a87a08]/30 rounded-full text-stone-700 dark:text-stone-300 transition"
            >
              🤖 S2 U4: AI in Learning Debate
            </button>
            <button
              onClick={() =>
                handleSendMessage('Bagaimana teknik membuka dan memberi signposting presentasi akademik di Modul English-02 Unit 5?')
              }
              className="shrink-0 px-3 py-1 bg-white dark:bg-stone-800 hover:bg-[#a87a08]/10 border border-[#a87a08]/30 rounded-full text-stone-700 dark:text-stone-300 transition"
            >
              🎤 S2 U5: Academic Presentation
            </button>
            <button
              onClick={() =>
                handleSendMessage('Tolong jelaskan konsep Problem Solving dengan Musyawarah (Shura) di Modul English-02 Unit 6.')
              }
              className="shrink-0 px-3 py-1 bg-white dark:bg-stone-800 hover:bg-[#a87a08]/10 border border-[#a87a08]/30 rounded-full text-stone-700 dark:text-stone-300 transition"
            >
              🤝 S2 U6: Shura Problem Solving
            </button>
            <button
              onClick={() =>
                handleSendMessage('Bagaimana struktur 7 bagian dalam penulisan laporan proyek akademik di Modul English-02 Unit 8?')
              }
              className="shrink-0 px-3 py-1 bg-white dark:bg-stone-800 hover:bg-[#a87a08]/10 border border-[#a87a08]/30 rounded-full text-stone-700 dark:text-stone-300 transition"
            >
              📊 S2 U8: Final Academic Report
            </button>
            <button
              onClick={() =>
                handleSendMessage('Let\'s practice introductions and greetings from Semester 1 Unit 1 (Getting to Know Each Other).')
              }
              className="shrink-0 px-3 py-1 bg-white dark:bg-stone-800 hover:bg-[#a87a08]/10 border border-[#a87a08]/30 rounded-full text-stone-700 dark:text-stone-300 transition"
            >
              👋 S1 U1: Introductions
            </button>
            <button
              onClick={() =>
                handleSendMessage('Tolong koreksi kalimat ini: "I is going to campus yesterday".')
              }
              className="shrink-0 px-3 py-1 bg-white dark:bg-stone-800 hover:bg-[#a87a08]/10 border border-[#a87a08]/30 rounded-full text-stone-700 dark:text-stone-300 transition"
            >
              ✍️ Koreksi Kalimat
            </button>
          </>
        )}
      </div>

      {/* Input Bar */}
      <div className="safe-bottom p-3 bg-white dark:bg-stone-900 border-t border-[#0f5c4d]/10 dark:border-stone-800">
        <div className="flex items-center gap-2">
          {/* File input (hidden) */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*,.txt,.md,.csv,.json,.html,.xml,.srt,.vtt,.pdf,.doc,.docx,.xls,.xlsx"
            className="hidden"
          />

          {/* Camera input (hidden) */}
          <input
            type="file"
            ref={cameraInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            capture="environment"
            className="hidden"
          />

          {/* File Button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2.5 rounded-xl text-stone-500 hover:text-[#0f5c4d] hover:bg-stone-100 dark:hover:bg-stone-800 transition min-w-[44px] min-h-[44px] flex items-center justify-center"
            title="Kirim File atau Gambar"
          >
            <Paperclip className="w-5 h-5" />
          </button>

          {/* Camera Button */}
          <button
            onClick={() => cameraInputRef.current?.click()}
            className="p-2.5 rounded-xl text-stone-500 hover:text-[#0f5c4d] hover:bg-stone-100 dark:hover:bg-stone-800 transition min-w-[44px] min-h-[44px] flex items-center justify-center"
            title="Buka Kamera"
          >
            <Camera className="w-5 h-5" />
          </button>

          {/* Speech Language Switcher (ID/EN) */}
          <button
            onClick={() => setSpeechLang(speechLang === 'id-ID' ? 'en-GB' : 'id-ID')}
            className="text-[11px] font-bold px-2 py-1.5 bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 rounded-lg hover:bg-stone-200 transition"
            title="Ganti bahasa pengenalan suara"
          >
            {speechLang === 'id-ID' ? '🇮🇩 ID' : '🇬🇧 EN'}
          </button>

          {/* Text Input */}
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder={
                mode === 'assistant'
                  ? 'Ketik atau tanya agenda ke Laura...'
                  : 'Belajar Bahasa Inggris atau pilih materi unit...'
              }
              className="w-full bg-[#f6f3ec] dark:bg-stone-800 text-sm px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-[#0f5c4d] min-h-[44px]"
            />
          </div>

          {/* Microphone Voice Input Button */}
          <button
            onClick={toggleSpeechRecognition}
            className={`p-2.5 rounded-xl transition min-w-[44px] min-h-[44px] flex items-center justify-center ${
              isRecording
                ? 'bg-rose-600 text-white animate-pulse'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200'
            }`}
            title={isRecording ? 'Berhenti mendengarkan' : 'Bicara dengan mikrofon'}
          >
            {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* Send Button */}
          <button
            onClick={() => handleSendMessage()}
            disabled={isLoading || (!inputText.trim() && !attachment)}
            className="p-2.5 rounded-xl bg-[#0f5c4d] text-white hover:bg-[#0d4f42] disabled:opacity-40 disabled:cursor-not-allowed transition min-w-[44px] min-h-[44px] flex items-center justify-center shadow-md"
            title="Kirim pesan"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* English Curriculum Silabus & PDF Modal */}
      <EnglishCurriculumModal
        isOpen={isCurriculumOpen}
        onClose={() => setIsCurriculumOpen(false)}
        onSelectUnitToLearn={(unit) => {
          handleSendMessage(
            `Mari kita pelajari materi dari Modul English-0${unit.semester} Unit ${unit.unitNumber}: ${unit.title} (${unit.subtitle}). Mohon jelaskan materi kuncinya, berikan contoh, dan satu latihan singkat untuk saya!`
          );
        }}
      />
    </div>
  );
};
