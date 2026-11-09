import React, { useEffect, useState } from 'react';
import { AvatarState, MoodType } from '../types';

interface AvatarProps {
  state: AvatarState;
  mood: MoodType;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showStatusText?: boolean;
  onClick?: () => void;
  className?: string;
  isFloating?: boolean;
}

const MOOD_EMOJIS: Record<MoodType, string> = {
  happy: '✨',
  calm: '🌿',
  serious: '🎯',
  encourage: '💪',
  think: '💡',
};

const MOOD_BORDER_COLORS: Record<MoodType, string> = {
  happy: 'border-[#a87a08] ring-4 ring-[#a87a08]/30',
  calm: 'border-[#0f5c4d] ring-3 ring-[#0f5c4d]/25',
  serious: 'border-rose-700 ring-4 ring-rose-600/30',
  encourage: 'border-[#a87a08] ring-4 ring-[#0f5c4d]/30',
  think: 'border-amber-600 ring-3 ring-amber-500/25',
};

const STATE_LABELS: Record<AvatarState, string> = {
  idle: 'Siap ngobrol',
  listening: 'Mendengarkan...',
  thinking: 'Sedang mikir...',
  speaking: 'Berbicara...',
};

export const Avatar: React.FC<AvatarProps> = ({
  state,
  mood,
  size = 'md',
  showStatusText = false,
  onClick,
  className = '',
  isFloating = false,
}) => {
  // Mouth animation state during speech (randomized phonetic flap approximation)
  const [mouthOpen, setMouthOpen] = useState(false);

  useEffect(() => {
    if (state !== 'speaking') {
      setMouthOpen(false);
      return;
    }

    // Flap mouth randomly between 120ms and 240ms during speech
    let timeoutId: any;
    const flap = () => {
      setMouthOpen((prev) => !prev);
      const nextDelay = 120 + Math.random() * 140;
      timeoutId = setTimeout(flap, nextDelay);
    };

    timeoutId = setTimeout(flap, 120);
    return () => clearTimeout(timeoutId);
  }, [state]);

  // Size dimensions
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-28 h-28',
    xl: 'w-36 h-36',
  }[size];

  // Animation classes based on state & mood
  let animationClass = 'animate-laura-idle';
  if (state === 'listening') {
    animationClass = 'animate-laura-listening';
  } else if (state === 'thinking') {
    animationClass = 'animate-laura-thinking';
  } else if (state === 'speaking') {
    animationClass = mood === 'happy' ? 'animate-laura-speaking-fast' : 'animate-laura-speaking';
  }

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div
        onClick={onClick}
        className={`relative cursor-pointer select-none transition-all duration-300 ${isFloating ? 'hover:scale-105 active:scale-95' : ''}`}
        title={`Laura Thompson (${STATE_LABELS[state]})`}
      >
        {/* Pulsing halo ring for listening & speaking */}
        {state === 'listening' && (
          <span className="absolute -inset-2 rounded-full bg-emerald-500/30 animate-ping duration-1000" />
        )}
        {state === 'speaking' && (
          <span className="absolute -inset-1.5 rounded-full bg-[#a87a08]/25 animate-pulse duration-700" />
        )}

        {/* Outer Avatar Frame */}
        <div
          className={`relative overflow-hidden rounded-full border-2 ${MOOD_BORDER_COLORS[mood]} ${sizeClasses} shadow-lg transition-all duration-300 bg-[#e8e2d4]`}
        >
          {/* Animated Laura Portrait Photo */}
          <div className={`w-full h-full ${animationClass} transform-gpu origin-bottom`}>
            <img
              src="/laura_portrait.jpg"
              alt="Laura Thompson"
              className="w-full h-full object-cover object-top select-none pointer-events-none"
              onError={(e) => {
                // Fallback if public image hasn't loaded
                (e.target as HTMLImageElement).src = '/src/assets/images/laura_portrait_1792939409370.jpg';
              }}
            />

            {/* Mouth overlay approximation (subtle darkening / mouth opening in center-lower face) */}
            {state === 'speaking' && (
              <div
                className="absolute top-[59%] left-[48%] -translate-x-1/2 w-3.5 h-1.5 bg-[#4a1c1c]/70 rounded-full transition-transform duration-100 pointer-events-none shadow-inner"
                style={{
                  transform: mouthOpen ? 'scaleY(2.2) scaleX(1.1)' : 'scaleY(0.7) scaleX(0.9)',
                }}
              />
            )}
          </div>
        </div>

        {/* Emotion Emoji Badge */}
        <div
          className="absolute -bottom-1 -right-1 bg-white/95 dark:bg-zinc-800 border border-amber-300/60 rounded-full w-6 h-6 flex items-center justify-center text-xs shadow-md"
          title={`Mood: ${mood}`}
        >
          <span>{MOOD_EMOJIS[mood]}</span>
        </div>

        {/* Active state indicator dot */}
        <span
          className={`absolute top-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white shadow-sm ${
            state === 'speaking'
              ? 'bg-[#a87a08] animate-pulse'
              : state === 'listening'
              ? 'bg-emerald-500 animate-ping'
              : state === 'thinking'
              ? 'bg-amber-500 animate-bounce'
              : 'bg-emerald-600'
          }`}
        />
      </div>

      {/* Status Text under name */}
      {showStatusText && (
        <div className="mt-2 text-center">
          <p className="text-sm font-semibold tracking-wide text-[#0f5c4d] dark:text-emerald-400 font-serif">
            Laura Thompson
          </p>
          <p className="text-xs text-stone-600 dark:text-stone-300 flex items-center justify-center gap-1.5">
            {state === 'speaking' && (
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#a87a08] animate-pulse" />
            )}
            {state === 'listening' && (
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            )}
            {state === 'thinking' && (
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            )}
            <span>{STATE_LABELS[state]}</span>
          </p>
        </div>
      )}
    </div>
  );
};
