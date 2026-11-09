import React, { useState, useRef, useEffect } from 'react';
import { Avatar } from '../Avatar';
import {
  ChatMessage,
  AvatarState,
  MoodType,
  SpeechFeedback,
} from '../../types';
import { StorageManager } from '../../utils/storage';
import {
  sendChatMessage,
  executeLauraFunction,
} from '../../utils/gemini';
import {
  speakTextQueue,
  cancelSpeech,
  createSpeechRecognizer,
  unlockSpeechAudio,
} from '../../utils/speech';
import { handleLocalAssistantQuery } from '../../utils/localAssistant';
import { analyzeSpeechOffline } from '../../data/betterSpeakData';
import {
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Trash2,
  Sparkles,
  RotateCcw,
  BookOpen,
  MessageSquare,
  Award,
} from 'lucide-react';

interface TutorAiTabProps {
  initialPrompt?: string | null;
  initialLauraGreeting?: string | null;
  onClearPrompt?: () => void;
}

export const TutorAiTab: React.FC<TutorAiTabProps> = ({
  initialPrompt,
  initialLauraGreeting,
  onClearPrompt,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() =>
    StorageManager.getChatHistory()
  );
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [avatarState, setAvatarState] = useState<AvatarState>('idle');
  const [avatarMood, setAvatarMood] = useState<MoodType>('calm');
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [latestFeedback, setLatestFeedback] = useState<SpeechFeedback | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Initial greeting if empty
  useEffect(() => {
    if (messages.length === 0) {
      const settings = StorageManager.getSettings();
      const userName = settings.profile.name || 'Pak Abdul';
      const welcome: ChatMessage = {
        id: 'msg-tutor-welcome',
        sender: 'laura',
        text: `Hello ${userName}! I am Laura Thompson, your AI English speaking tutor. We can practice speaking for your university lectures, doctoral thesis discussions, or everyday conversations referencing your official Modul English-01 & 02 (PTIQ). How are you feeling today?`,
        mood: 'happy',
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages([welcome]);
      StorageManager.saveChatHistory([welcome]);
    }
  }, []);

  // Handle incoming scenario prompt
  useEffect(() => {
    if (initialPrompt) {
      if (initialLauraGreeting) {
        const scenarioMsg: ChatMessage = {
          id: 'sc-msg-' + Date.now(),
          sender: 'laura',
          text: initialLauraGreeting,
          mood: 'happy',
          timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        };
        const updated = [...messages, scenarioMsg];
        setMessages(updated);
        StorageManager.saveChatHistory(updated);
        handleSpeak(initialLauraGreeting);
      } else {
        setInputText(initialPrompt);
      }
      onClearPrompt?.();
    }
  }, [initialPrompt, initialLauraGreeting]);

  // Audio speech
  const handleSpeak = (text: string) => {
    if (!voiceEnabled) return;
    unlockSpeechAudio();
    cancelSpeech();
    setAvatarState('speaking');
    const settings = StorageManager.getSettings();
    speakTextQueue(text, {
      preferredIdVoice: settings.preferredIdVoice,
      preferredEnVoice: settings.preferredEnVoice,
      rate: settings.speechRate || 0.95,
      pitch: settings.speechPitch || 1.0,
      onEnd: () => setAvatarState('idle'),
      onError: () => setAvatarState('idle'),
    });
  };

  // Send message
  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    unlockSpeechAudio();
    cancelSpeech();

    // Generate instant BetterSpeak feedback for user's English input
    const feedback = analyzeSpeechOffline(text);
    setLatestFeedback(feedback);

    const userMsg: ChatMessage = {
      id: 'usr-' + Date.now(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    StorageManager.saveChatHistory(newHistory);
    setInputText('');
    setIsLoading(true);
    setAvatarState('thinking');
    setAvatarMood('think');

    const geminiContents = newHistory.slice(-10).map((m) => ({
      role: m.sender === 'user' ? ('user' as const) : ('model' as const),
      parts: [{ text: m.text }],
    }));

    const settings = StorageManager.getSettings();

    try {
      let cleanText = '';
      let replyMood: MoodType = 'happy';

      if (settings.geminiApiKey && settings.geminiApiKey.trim()) {
        const response = await sendChatMessage({
          messages: geminiContents,
          mode: 'tutor',
          model: settings.selectedModel || 'gemini-3.8-flash',
          customApiKey: settings.geminiApiKey,
        });
        cleanText = response.cleanText;
        replyMood = response.mood;
      } else {
        const localResp = handleLocalAssistantQuery(text, 'tutor');
        cleanText = localResp.cleanText;
        replyMood = localResp.mood;
      }

      const lauraMsg: ChatMessage = {
        id: 'laura-' + Date.now(),
        sender: 'laura',
        text: cleanText,
        mood: replyMood,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      };

      const finalHistory = [...newHistory, lauraMsg];
      setMessages(finalHistory);
      StorageManager.saveChatHistory(finalHistory);
      setAvatarMood(replyMood);

      if (voiceEnabled) {
        handleSpeak(cleanText);
      } else {
        setAvatarState('idle');
      }
    } catch (err) {
      // Local Fallback Tutor engine
      const localResp = handleLocalAssistantQuery(text, 'tutor');
      const fallbackMsg: ChatMessage = {
        id: 'laura-fallback-' + Date.now(),
        sender: 'laura',
        text: localResp.cleanText,
        mood: localResp.mood,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      };

      const finalHistory = [...newHistory, fallbackMsg];
      setMessages(finalHistory);
      StorageManager.saveChatHistory(finalHistory);
      setAvatarMood(localResp.mood);

      if (voiceEnabled) {
        handleSpeak(localResp.cleanText);
      } else {
        setAvatarState('idle');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Speech to text
  const handleToggleMic = () => {
    if (isRecording) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
      setIsRecording(false);
      setAvatarState('idle');
    } else {
      unlockSpeechAudio();
      cancelSpeech();
      setIsRecording(true);
      setAvatarState('listening');

      const recognizer = createSpeechRecognizer('en-GB', {
        onResult: (transcript, isFinal) => {
          setInputText(transcript);
          if (isFinal) {
            setIsRecording(false);
            setAvatarState('idle');
            handleSend(transcript);
          }
        },
        onError: () => {
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
        try {
          recognizer.start();
        } catch (e) {
          setIsRecording(false);
          setAvatarState('idle');
        }
      } else {
        setIsRecording(false);
        setAvatarState('idle');
      }
    }
  };

  const handleClearHistory = () => {
    cancelSpeech();
    StorageManager.clearChatHistory();
    const settings = StorageManager.getSettings();
    const userName = settings.profile.name || 'Pak Abdul';
    const welcome: ChatMessage = {
      id: 'msg-tutor-welcome-' + Date.now(),
      sender: 'laura',
      text: `Chat restarted. Ready for English speaking practice, ${userName}! What topic shall we explore?`,
      mood: 'happy',
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages([welcome]);
    StorageManager.saveChatHistory([welcome]);
  };

  return (
    <div className="space-y-4 pb-20 max-w-2xl mx-auto flex flex-col h-[calc(100vh-130px)]">
      {/* Top Interactive Laura Avatar Card */}
      <div className="p-3.5 sm:p-4 rounded-3xl bg-gradient-to-r from-[#0f5c4d] to-[#144f42] text-white shadow-md flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <Avatar
            size="md"
            state={avatarState}
            mood={avatarMood}
            showStatusText={false}
          />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-academic-heading text-base font-bold text-white">
                Laura Thompson
              </h3>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-400 text-stone-900 shadow-xs">
                British English
              </span>
            </div>
            <p className="text-xs text-emerald-200">
              {avatarState === 'speaking'
                ? 'Sedang Berbicara...'
                : avatarState === 'thinking'
                ? 'Sedang Memproses...'
                : avatarState === 'listening'
                ? 'Mendengarkan Anda...'
                : 'Siap Latihan Speaking'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setVoiceEnabled(!voiceEnabled)}
            className={`p-2 rounded-xl transition ${
              voiceEnabled ? 'bg-amber-400 text-stone-900' : 'bg-white/10 text-white'
            }`}
            title={voiceEnabled ? 'Suara Aktif' : 'Suara Dimatikan'}
          >
            {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            onClick={handleClearHistory}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-emerald-100 hover:text-white transition"
            title="Mulai Ulang Percakapan"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Real-time BetterSpeak Feedback Banner (if available from last utterance) */}
      {latestFeedback && (
        <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 text-xs text-amber-900 dark:text-amber-200 shrink-0 flex items-start justify-between gap-3 animate-in fade-in">
          <div className="space-y-1">
            <div className="flex items-center gap-2 font-bold">
              <span>BetterSpeak™ Real-Time Feedback</span>
              <span className="px-1.5 py-0.2 rounded bg-amber-200 dark:bg-amber-800 text-[10px]">
                Fluency: {latestFeedback.fluencyScore}%
              </span>
            </div>
            <p className="text-[11px] text-stone-600 dark:text-stone-300">
              {latestFeedback.grammarFeedback}
            </p>
          </div>
          <button
            onClick={() => setLatestFeedback(null)}
            className="text-[10px] text-stone-400 hover:text-stone-600 font-bold"
          >
            Tutup
          </button>
        </div>
      )}

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto space-y-3 p-3 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-inner">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-3 text-xs sm:text-sm leading-relaxed ${
                  isUser
                    ? 'bg-[#0f5c4d] text-white rounded-br-xs'
                    : 'bg-[#f6f3ec] dark:bg-stone-800 text-stone-900 dark:text-white rounded-bl-xs border border-stone-200/60 dark:border-stone-700'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.text}</p>
                <div
                  className={`mt-1 flex items-center justify-between gap-2 text-[10px] ${
                    isUser ? 'text-emerald-200' : 'text-stone-400'
                  }`}
                >
                  <span>{msg.timestamp}</span>
                  {!isUser && (
                    <button
                      onClick={() => handleSpeak(msg.text)}
                      className="p-1 hover:text-amber-600 transition"
                      title="Dengarkan Ulang"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-2 p-3 max-w-[60%] rounded-2xl bg-[#f6f3ec] dark:bg-stone-800 text-xs text-stone-500 animate-pulse">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin" />
            <span>Laura sedang memikirkan respons terbaik...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input & Voice Controls Bar */}
      <div className="shrink-0 space-y-2">
        {/* Quick Topic Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar text-[11px] pb-1">
          <button
            onClick={() => setInputText("Hello Laura, could you give me feedback on my teaching self-introduction?")}
            className="shrink-0 px-3 py-1 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-[#0f5c4d] hover:text-white transition"
          >
            🎓 Feedback Self-Intro
          </button>
          <button
            onClick={() => setInputText("How can I structure my academic presentation opening?")}
            className="shrink-0 px-3 py-1 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-[#0f5c4d] hover:text-white transition"
          >
            🎤 Pembuka Presentasi
          </button>
          <button
            onClick={() => setInputText("Let's practice discussing my doctoral research on Islamic education.")}
            className="shrink-0 px-3 py-1 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-[#0f5c4d] hover:text-white transition"
          >
            📚 Diskusi Disertasi
          </button>
          <button
            onClick={() => setInputText("Tell me about Unit 1 of Modul English-01.")}
            className="shrink-0 px-3 py-1 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-[#0f5c4d] hover:text-white transition"
          >
            📖 Modul 01 Unit 1
          </button>
        </div>

        {/* Text & Mic Input */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend();
            }}
            placeholder={isRecording ? "Mendengarkan suara Anda..." : "Ketik kalimat bahasa Inggris atau klik ikon mic..."}
            className="flex-1 text-xs sm:text-sm p-3 rounded-2xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 focus:outline-hidden focus:ring-2 focus:ring-[#0f5c4d]"
          />

          <button
            onClick={handleToggleMic}
            className={`p-3 rounded-2xl transition shadow-sm ${
              isRecording
                ? 'bg-rose-600 text-white animate-pulse'
                : 'bg-amber-400 text-stone-900 hover:bg-amber-300'
            }`}
            title={isRecording ? "Selesai Bicara" : "Mulai Bicara (Mikrofon)"}
          >
            {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          <button
            disabled={!inputText.trim() || isLoading}
            onClick={() => handleSend()}
            className={`p-3 rounded-2xl transition shadow-sm ${
              inputText.trim() && !isLoading
                ? 'bg-[#0f5c4d] text-white hover:bg-[#0d4f42]'
                : 'bg-stone-200 text-stone-400 cursor-not-allowed'
            }`}
            title="Kirim"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
