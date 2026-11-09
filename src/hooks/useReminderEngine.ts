import { useState, useEffect, useRef } from 'react';
import { StorageManager } from '../utils/storage';
import { calculatePrayerTimes } from '../utils/prayerTimes';
import { speakTextQueue } from '../utils/speech';
import { MoodType } from '../types';

export interface ActiveReminder {
  id: string;
  type: 'prayer' | 'agenda' | 'routine';
  title: string;
  subtitle: string;
  timeStr: string;
  spokenText: string;
  mood: MoodType;
}

// Spoken variations for prayer times to keep reminders lively & natural
const PRAYER_SPOKEN_VARIATIONS: Record<string, string[]> = {
  Subuh: [
    '{name}, waktu salat Subuh sudah tiba. Mari segera dirikan salat dan raih keberkahan pagi hari!',
    'Assalamu\'alaikum {name}, azan Subuh telah berkumandang. Waktunya ambil wudu dan mulai hari dengan doa.',
    '{name}, fajar telah menyingsing. Selamat menunaikan ibadah salat Subuh ya!',
  ],
  Zuhur: [
    '{name}, waktu salat Zuhur sudah masuk. Yuk, sejenak rehat dari aktivitas akademik dan salat dulu ya!',
    '{name}, sudah masuk waktu Zuhur nih. Ambil wudu yuk, segarkan pikiran sebelum lanjut riset!',
    '{name}, panggilan salat Zuhur telah tiba. Mari tunaikan kewajiban dan rehat sejenak.',
  ],
  Asar: [
    '{name}, waktu salat Asar sudah masuk. Yuk, salat dulu biar sore harinya semakin berkah dan lancar!',
    '{name}, azan Asar sudah berkumandang. Mari istirahat sejenak dari penulisan disertasi dan salat Asar.',
    '{name}, jangan sampai terlewat salat Asar ya! Mari bersiap-siap wudu sekarang.',
  ],
  Magrib: [
    '{name}, Alhamdulillah waktu Magrib telah tiba. Waktunya menunaikan salat Magrib dan berkumpul.',
    '{name}, senja telah tiba dan waktu salat Magrib sudah masuk. Mari segera laksanakan salat ya!',
    '{name}, waktu Magrib telah masuk. Rehat sejenak dari laptop dan mari dirikan salat Magrib.',
  ],
  Isya: [
    '{name}, waktu salat Isya sudah masuk. Mari lengkapi ibadah hari ini dengan salat Isya berjamaah.',
    '{name}, azan Isya telah berkumandang. Tunaikan salat Isya sebelum beristirahat atau lanjut belajar.',
    '{name}, waktu salat Isya telah tiba. Yuk, ambil wudu dan salat Isya dulu!',
  ],
};

export function useReminderEngine(onMoodChange?: (mood: MoodType) => void) {
  const [currentReminder, setCurrentReminder] = useState<ActiveReminder | null>(null);
  const notifiedKeysRef = useRef<Set<string>>(new Set());

  // Request browser notification permission if not yet decided
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'default') {
        Notification.requestPermission().catch(() => {});
      }
    }
  }, []);

  useEffect(() => {
    // 20-second interval checker
    const checkReminders = () => {
      const settings = StorageManager.getSettings();
      const profile = settings.profile;
      const userName = profile.name || 'Pak Abdul';
      const now = new Date();
      const todayStr = now.toISOString().split('T')[0];
      const currentHours = now.getHours();
      const currentMinutes = now.getMinutes();
      const nowTotalMins = currentHours * 60 + currentMinutes;

      // 1. Check Prayer Times (if enabled)
      if (settings.prayerRemindersEnabled) {
        const prayerTimes = calculatePrayerTimes(
          now,
          profile.latitude,
          profile.longitude,
          profile.timezone
        );

        const prayersToCheck = [
          { name: 'Subuh', time: prayerTimes.subuh },
          { name: 'Zuhur', time: prayerTimes.zuhur },
          { name: 'Asar', time: prayerTimes.asar },
          { name: 'Magrib', time: prayerTimes.magrib },
          { name: 'Isya', time: prayerTimes.isya },
        ];

        for (const prayer of prayersToCheck) {
          const [pH, pM] = prayer.time.split(':').map(Number);
          const pTotalMins = pH * 60 + pM;
          const diffMins = nowTotalMins - pTotalMins;

          // Check if due within the last 20 minutes (skip older/stale reminders)
          if (diffMins >= 0 && diffMins <= 20) {
            const key = `prayer_${todayStr}_${prayer.name}`;
            if (!notifiedKeysRef.current.has(key)) {
              notifiedKeysRef.current.add(key);

              const variations = PRAYER_SPOKEN_VARIATIONS[prayer.name] || [
                `Pak Abdul, waktu salat ${prayer.name} telah masuk. Mari tunaikan salat ya!`,
              ];
              const randomVar = variations[Math.floor(Math.random() * variations.length)];
              const spoken = randomVar.replace('{name}', userName);

              triggerReminder({
                id: key,
                type: 'prayer',
                title: `Waktu Salat ${prayer.name} Telah Tiba`,
                subtitle: `Pukul ${prayer.time} WIB - Mari ambil wudu dan dirikan salat`,
                timeStr: prayer.time,
                spokenText: spoken,
                mood: 'calm',
              });
              return; // Fire one at a time
            }
          }
        }
      }

      // 2. Check Agenda / Schedule Items (if enabled)
      if (settings.agendaRemindersEnabled) {
        const items = StorageManager.getItems();
        for (const item of items) {
          if (item.completed || !item.time || item.date !== todayStr) continue;

          const [iH, iM] = item.time.split(':').map(Number);
          const iTotalMins = iH * 60 + iM;
          const diffMins = nowTotalMins - iTotalMins;

          // Due within 15 minutes window
          if (diffMins >= 0 && diffMins <= 15) {
            const key = `item_${todayStr}_${item.id}`;
            if (!notifiedKeysRef.current.has(key)) {
              notifiedKeysRef.current.add(key);

              const spoken = `${userName}, waktu untuk agenda "${item.title}" sudah tiba. Jangan lupa ${item.note || 'persiapkan dengan baik'} ya!`;
              triggerReminder({
                id: key,
                type: 'agenda',
                title: `Agenda Sekarang: ${item.title}`,
                subtitle: `${item.time} WIB - ${item.note || 'Persiapkan agenda Anda'}`,
                timeStr: item.time,
                spokenText: spoken,
                mood: 'serious',
              });
              return;
            }
          }
        }
      }

      // 3. Check Routines
      const routines = StorageManager.getRoutines();
      for (const rou of routines) {
        if (rou.lastDoneDate === todayStr) continue;
        const [rH, rM] = rou.time.split(':').map(Number);
        const rTotalMins = rH * 60 + rM;
        const diffMins = nowTotalMins - rTotalMins;

        if (diffMins >= 0 && diffMins <= 15) {
          const key = `routine_${todayStr}_${rou.id}`;
          if (!notifiedKeysRef.current.has(key)) {
            notifiedKeysRef.current.add(key);

            const spoken = `${userName}, waktunya rutinitas harian: "${rou.title}". Mari tuntaskan agar target hari ini tercapai!`;
            triggerReminder({
              id: key,
              type: 'routine',
              title: `Rutinitas: ${rou.title}`,
              subtitle: `${rou.time} WIB - ${rou.note || 'Rutinitas harian'}`,
              timeStr: rou.time,
              spokenText: spoken,
              mood: 'encourage',
            });
            return;
          }
        }
      }
    };

    function triggerReminder(reminder: ActiveReminder) {
      setCurrentReminder(reminder);
      onMoodChange?.(reminder.mood);

      const settings = StorageManager.getSettings();

      // Speak reminder with voice if enabled
      if (settings.autoVoiceEnabled) {
        speakTextQueue(reminder.spokenText, {
          preferredIdVoice: settings.preferredIdVoice,
          preferredEnVoice: settings.preferredEnVoice,
          rate: settings.speechRate,
          pitch: settings.speechPitch,
        }).catch((err) => console.warn('Reminder speech error:', err));
      }

      // Send System Notification through Service Worker (compatible with Android PWA)
      if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
        if ('serviceWorker' in navigator && navigator.serviceWorker.ready) {
          navigator.serviceWorker.ready
            .then((reg) => {
              (reg as any).showNotification(reminder.title, {
                body: reminder.subtitle,
                icon: '/laura_portrait.jpg',
                badge: '/pwa-192x192.png',
                tag: reminder.id,
                renotify: true,
              });
            })
            .catch(() => {
              try {
                new Notification(reminder.title, {
                  body: reminder.subtitle,
                  icon: '/laura_portrait.jpg',
                });
              } catch (e) {}
            });
        }
      }
    }

    // Run immediately then every 20 seconds
    checkReminders();
    const interval = setInterval(checkReminders, 20000);
    return () => clearInterval(interval);
  }, [onMoodChange]);

  const dismissReminder = () => {
    setCurrentReminder(null);
  };

  return {
    currentReminder,
    dismissReminder,
  };
}
