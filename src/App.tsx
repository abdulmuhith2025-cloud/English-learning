/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { TabType, AvatarState, MoodType, SpeakingScenario } from './types';
import { CurriculumUnit } from './data/englishCurriculum';
import { Header } from './components/Header';
import { Avatar } from './components/Avatar';
import { ChatOverlay } from './components/ChatOverlay';
import { SettingsModal } from './components/SettingsModal';
import { useOnlineStatus } from './hooks/usePWAInstall';

// Dedicated English Learning Tabs
import { HomeTab } from './components/tabs/HomeTab';
import { TutorAiTab } from './components/tabs/TutorAiTab';
import { ScenariosTab } from './components/tabs/ScenariosTab';
import { ShadowingTab } from './components/tabs/ShadowingTab';
import { CurriculumTab } from './components/tabs/CurriculumTab';
import { PlacementQuizTab } from './components/tabs/PlacementQuizTab';
import { WifiOff, MessageCircle } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabType>('beranda');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [avatarState, setAvatarState] = useState<AvatarState>('idle');
  const [avatarMood, setAvatarMood] = useState<MoodType>('calm');

  const [tutorPrompt, setTutorPrompt] = useState<string | null>(null);
  const [lauraGreeting, setLauraGreeting] = useState<string | null>(null);

  const isOnline = useOnlineStatus();

  // Handle starting a scenario
  const handleStartScenario = (scenario: SpeakingScenario) => {
    const prompt = `Halo Laura, mari kita mulai simulasi speaking BetterSpeak untuk skenario: "${scenario.title}". Laura berperan sebagai: ${scenario.lauraRole}, dan aku berperan sebagai: ${scenario.userRole}. Buka percakapannya dengan ramah dalam bahasa Inggris ya!`;
    setTutorPrompt(prompt);
    setLauraGreeting(scenario.promptStarter);
    setCurrentTab('tutor_ai');
  };

  // Handle practicing a specific unit from Modul English-01 or 02
  const handleStartUnit = (unit: CurriculumUnit) => {
    const prompt = `Halo Laura! Aku ingin melatih materi Modul English-${unit.semester === 1 ? '01' : '02'} Unit ${unit.unitNumber}: "${unit.title}". Fokus tata bahasa: ${unit.grammarFocus}. Boleh beri aku contoh dialog dan ajak aku berlatih speaking interaktif ya?`;
    setTutorPrompt(prompt);
    setLauraGreeting(`Excellent choice! Let's explore Unit ${unit.unitNumber}: ${unit.title}. I am ready to guide you step by step. Shall we practice the core dialogue?`);
    setCurrentTab('tutor_ai');
  };

  const handleOpenLauraWithPrompt = (prompt: string, greeting?: string) => {
    setTutorPrompt(prompt);
    setLauraGreeting(greeting || null);
    setCurrentTab('tutor_ai');
  };

  return (
    <div className="min-h-screen bg-[#f6f3ec] text-[#1c2e28] flex flex-col font-sans selection:bg-[#0f5c4d]/20 selection:text-[#0f5c4d] relative">
      {/* Main Header with Logo & BetterSpeak Tabs */}
      <Header
        currentTab={currentTab}
        onTabChange={(tab) => setCurrentTab(tab)}
        onOpenLaura={() => setCurrentTab('tutor_ai')}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Offline Status Warning Bar */}
      {!isOnline && (
        <div className="bg-amber-500 text-stone-900 text-xs font-semibold px-4 py-1.5 flex items-center justify-center gap-1.5 shadow-xs">
          <WifiOff className="w-3.5 h-3.5" />
          <span>Anda sedang dalam mode Offline. Tutor AI tetap berjalan menggunakan mesin lokal gratis.</span>
        </div>
      )}

      {/* Main Tab Content */}
      <main className="flex-1 max-w-2xl w-full mx-auto p-4 sm:p-5">
        {currentTab === 'beranda' && (
          <HomeTab
            onNavigateTab={(tab) => setCurrentTab(tab)}
            onOpenLauraWithPrompt={handleOpenLauraWithPrompt}
          />
        )}
        {currentTab === 'tutor_ai' && (
          <TutorAiTab
            initialPrompt={tutorPrompt}
            initialLauraGreeting={lauraGreeting}
            onClearPrompt={() => {
              setTutorPrompt(null);
              setLauraGreeting(null);
            }}
          />
        )}
        {currentTab === 'skenario' && (
          <ScenariosTab
            onStartScenario={handleStartScenario}
            onOpenCurriculum={() => setCurrentTab('modul')}
          />
        )}
        {currentTab === 'shadowing' && <ShadowingTab />}
        {currentTab === 'modul' && (
          <CurriculumTab onStartUnitPractice={handleStartUnit} />
        )}
        {currentTab === 'tes_level' && (
          <PlacementQuizTab
            onStartSpeaking={() => setCurrentTab('tutor_ai')}
            onNavigateHome={() => setCurrentTab('beranda')}
          />
        )}
      </main>

      {/* Floating Round Laura Avatar (Quick shortcut to Tutor AI on mobile/desktop) */}
      {currentTab !== 'tutor_ai' && !isChatOpen && (
        <div className="fixed bottom-5 right-5 z-40 flex flex-col items-center group pointer-events-auto">
          {/* Quick Talk Tooltip Badge */}
          <div className="mb-1.5 bg-[#0f5c4d] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md flex items-center gap-1 animate-bounce">
            <MessageCircle className="w-3 h-3" />
            <span>Laura</span>
          </div>

          <Avatar
            size="md"
            state={avatarState}
            mood={avatarMood}
            showStatusText={false}
            isFloating={true}
            onClick={() => setCurrentTab('tutor_ai')}
          />
        </div>
      )}

      {/* Full-Screen Laura Conversation Overlay (Quick popup from header or avatar) */}
      <ChatOverlay
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        avatarState={avatarState}
        setAvatarState={setAvatarState}
        avatarMood={avatarMood}
        setAvatarMood={setAvatarMood}
        onOpenSettings={() => setIsSettingsOpen(true)}
        initialTutorPrompt={tutorPrompt}
        initialLauraGreeting={lauraGreeting}
        onClearInitialPrompt={() => {
          setTutorPrompt(null);
          setLauraGreeting(null);
        }}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSettingsSaved={() => {}}
      />
    </div>
  );
}
