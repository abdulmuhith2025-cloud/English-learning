import React, { useState, useEffect } from 'react';
import { AppSettings, UserProfile } from '../types';
import { StorageManager } from '../utils/storage';
import { INDONESIAN_CITIES } from '../utils/prayerTimes';
import { discoverGeminiModels, normalizeModelName } from '../utils/gemini';
import { getAvailableVoices, speakTextQueue } from '../utils/speech';
import {
  X,
  User,
  Key,
  Cpu,
  Volume2,
  Bell,
  Download,
  Upload,
  RefreshCw,
  Sparkles,
  MapPin,
  Check,
  AlertCircle,
  HelpCircle,
  Smartphone,
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSettingsSaved: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  onSettingsSaved,
}) => {
  const [settings, setSettings] = useState<AppSettings>(() => StorageManager.getSettings());
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isDiscovering, setIsDiscovering] = useState(false);
  const [discoveryStatus, setDiscoveryStatus] = useState<string | null>(null);
  const [testSpeechActive, setTestSpeechActive] = useState(false);
  const [backupMessage, setBackupMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setSettings(StorageManager.getSettings());
      setVoices(getAvailableVoices());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleProfileChange = (key: keyof UserProfile, val: any) => {
    setSettings((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        [key]: val,
      },
    }));
  };

  const handleCitySelect = (cityName: string) => {
    const found = INDONESIAN_CITIES.find((c) => c.name === cityName);
    if (found) {
      setSettings((prev) => ({
        ...prev,
        profile: {
          ...prev.profile,
          city: found.name,
          latitude: found.lat,
          longitude: found.lng,
          timezone: found.tz,
        },
      }));
    }
  };

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Fitur Geolocation tidak didukung di perangkat ini.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setSettings((prev) => ({
          ...prev,
          profile: {
            ...prev.profile,
            city: 'Lokasi GPS Saya',
            latitude: Number(pos.coords.latitude.toFixed(4)),
            longitude: Number(pos.coords.longitude.toFixed(4)),
          },
        }));
      },
      (err) => {
        alert('Gagal mendapatkan lokasi GPS: ' + err.message);
      }
    );
  };

  // Run model auto-discovery
  const handleAutoDiscoverModels = async () => {
    setIsDiscovering(true);
    setDiscoveryStatus('Menghubungi API untuk mendeteksi model flash aktif...');
    try {
      const res = await discoverGeminiModels(settings.geminiApiKey);
      setSettings((prev) => ({
        ...prev,
        discoveredModels: res.models,
        selectedModel: res.recommended,
      }));
      setDiscoveryStatus(
        `Berhasil menemukan ${res.models.length} model flash aktif. Model terpilih: ${res.recommended}`
      );
    } catch (err: any) {
      setDiscoveryStatus(`Gagal auto-discovery: ${err?.message || 'Error'}`);
    } finally {
      setIsDiscovering(false);
    }
  };

  // Test Speech Voice
  const handleTestVoice = (lang: 'id-ID' | 'en-GB') => {
    setTestSpeechActive(true);
    const sampleText =
      lang === 'id-ID'
        ? `Halo ${settings.profile.name}! Aku Laura Thompson, asisten pribadi Anda. Suara bahasa Indonesia ini terdengar nyaman, bukan?`
        : `Hello ${settings.profile.name}! I am Laura, your British English tutor. Let's make learning engaging and enjoyable!`;

    speakTextQueue(sampleText, {
      preferredIdVoice: settings.preferredIdVoice,
      preferredEnVoice: settings.preferredEnVoice,
      rate: settings.speechRate,
      pitch: settings.speechPitch,
      onEnd: () => setTestSpeechActive(false),
      onError: () => setTestSpeechActive(false),
    });
  };

  // Export JSON backup
  const handleExportBackup = () => {
    const jsonStr = StorageManager.exportFullBackup();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `laura_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setBackupMessage('File cadangan JSON berhasil diunduh!');
  };

  // Import JSON backup
  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const res = StorageManager.importFullBackup(content);
      setBackupMessage(res.message);
      if (res.success) {
        setSettings(StorageManager.getSettings());
        onSettingsSaved();
      }
    };
    reader.readAsText(file);
  };

  const handleSave = () => {
    const normalized = normalizeModelName(settings.selectedModel);
    const finalSettings = { ...settings, selectedModel: normalized };
    StorageManager.saveSettings(finalSettings);
    onSettingsSaved();
    onClose();
  };

  const idVoices = voices.filter((v) => v.lang.toLowerCase().startsWith('id'));
  const enVoices = voices.filter((v) => v.lang.toLowerCase().startsWith('en'));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-lg max-h-[90vh] bg-white dark:bg-stone-900 rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-[#0f5c4d]/20 text-[#1c2e28] dark:text-stone-100">
        {/* Header */}
        <div className="px-5 py-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between bg-stone-50/80 dark:bg-stone-900/80">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-[#0f5c4d] text-white">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-academic-heading text-base font-bold text-stone-900 dark:text-white leading-none">
                Pengaturan Aplikasi
              </h3>
              <p className="text-[11px] text-stone-500 mt-0.5">
                Profil pengguna, model AI, suara Laura, & cadangan data
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-200/60 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 overflow-y-auto space-y-6 text-xs">
          {/* Section 1: Profil Pengguna */}
          <div className="space-y-3">
            <h4 className="font-bold text-stone-900 dark:text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5 text-[#0f5c4d]">
              <User className="w-3.5 h-3.5" />
              <span>Profil Pengguna & Lokasi Salat</span>
            </h4>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="text-stone-500 font-medium block mb-1">Nama Panggilan</label>
                <input
                  type="text"
                  value={settings.profile.name}
                  onChange={(e) => handleProfileChange('name', e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-[#f6f3ec] dark:bg-stone-800"
                />
              </div>
              <div>
                <label className="text-stone-500 font-medium block mb-1">Institusi / Kampus</label>
                <input
                  type="text"
                  value={settings.profile.institution}
                  onChange={(e) => handleProfileChange('institution', e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-[#f6f3ec] dark:bg-stone-800"
                />
              </div>
            </div>

            <div>
              <label className="text-stone-500 font-medium block mb-1">Peran / Jabatan Akademik</label>
              <input
                type="text"
                value={settings.profile.role}
                onChange={(e) => handleProfileChange('role', e.target.value)}
                className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-[#f6f3ec] dark:bg-stone-800"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-2">
                <label className="text-stone-500 font-medium block mb-1">Kota Waktu Salat</label>
                <select
                  value={settings.profile.city}
                  onChange={(e) => handleCitySelect(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-[#f6f3ec] dark:bg-stone-800"
                >
                  {INDONESIAN_CITIES.map((c) => (
                    <option key={c.name} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                  {settings.profile.city === 'Lokasi GPS Saya' && (
                    <option value="Lokasi GPS Saya">Lokasi GPS Saya</option>
                  )}
                </select>
              </div>

              <div>
                <label className="text-stone-500 font-medium block mb-1">GPS Lokasi</label>
                <button
                  type="button"
                  onClick={handleGetCurrentLocation}
                  className="w-full p-2.5 rounded-xl border border-[#0f5c4d]/30 text-[#0f5c4d] dark:text-emerald-400 hover:bg-[#0f5c4d]/10 flex items-center justify-center gap-1 font-semibold"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Ambil GPS</span>
                </button>
              </div>
            </div>
          </div>

          {/* Section 2: Model Selection & Auto-Discovery */}
          <div className="space-y-3 pt-3 border-t border-stone-200 dark:border-stone-800">
            <h4 className="font-bold text-stone-900 dark:text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5 text-[#a87a08]">
              <Cpu className="w-3.5 h-3.5" />
              <span>Model Gemini AI & Auto-Discovery</span>
            </h4>

            <div className="space-y-2">
              <label className="text-stone-500 font-medium block">
                Nama Model Gemini (Default: gemini-3.8-flash)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={settings.selectedModel}
                  onChange={(e) =>
                    setSettings({ ...settings, selectedModel: e.target.value })
                  }
                  placeholder="gemini-3.8-flash"
                  className="flex-1 p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-[#f6f3ec] dark:bg-stone-800"
                />
                <button
                  type="button"
                  onClick={handleAutoDiscoverModels}
                  disabled={isDiscovering}
                  className="px-3 py-2 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-700 dark:text-stone-300 font-semibold rounded-xl flex items-center gap-1 shrink-0"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isDiscovering ? 'animate-spin' : ''}`} />
                  <span>Auto-Discover</span>
                </button>
              </div>

              {discoveryStatus && (
                <p className="text-[11px] text-[#0f5c4d] dark:text-emerald-400 p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/30">
                  {discoveryStatus}
                </p>
              )}
            </div>

            {/* Standalone Personal API Key */}
            <div className="space-y-1.5 pt-2">
              <div className="flex items-center justify-between">
                <label className="text-stone-500 font-medium flex items-center gap-1">
                  <Key className="w-3.5 h-3.5 text-stone-400" />
                  <span>Kunci Gemini API Pribadi</span>
                </label>
                <a
                  href="https://aistudio.google.com/apikey"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] font-semibold text-[#0f5c4d] hover:underline"
                >
                  Dapatkan API Key Gratis ↗
                </a>
              </div>
              <input
                type="password"
                value={settings.geminiApiKey}
                onChange={(e) => setSettings({ ...settings, geminiApiKey: e.target.value })}
                placeholder="AIzaSy... (Tempel API Key Google AI Studio Anda di sini)"
                className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-[#f6f3ec] dark:bg-stone-800"
              />
              <p className="text-[10px] text-stone-400">
                * Kunci ini disimpan secara privat di browser perangkat Anda untuk pemanggilan cloud Gemini AI. Jika tidak diisi, Laura menggunakan asisten pintar lokal.
              </p>
            </div>
          </div>

          {/* Section 3: Pengaturan Suara Laura */}
          <div className="space-y-3 pt-3 border-t border-stone-200 dark:border-stone-800">
            <h4 className="font-bold text-stone-900 dark:text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5 text-[#0f5c4d]">
              <Volume2 className="w-3.5 h-3.5" />
              <span>Pengaturan Suara Bicara Laura (ID & EN)</span>
            </h4>

            <div className="flex items-center justify-between p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700">
              <div>
                <p className="font-semibold text-stone-800 dark:text-stone-200">
                  Respons Suara Otomatis
                </p>
                <p className="text-[10px] text-stone-400">
                  Laura otomatis membacakan jawabannya dengan suara
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.autoVoiceEnabled}
                onChange={(e) =>
                  setSettings({ ...settings, autoVoiceEnabled: e.target.checked })
                }
                className="w-4 h-4 accent-[#0f5c4d]"
              />
            </div>

            {/* Indonesian Voice */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-stone-500 font-medium">Suara Bahasa Indonesia (id-ID)</label>
                <button
                  type="button"
                  onClick={() => handleTestVoice('id-ID')}
                  className="text-[11px] font-semibold text-[#0f5c4d] hover:underline"
                >
                  Uji Suara ID
                </button>
              </div>
              <select
                value={settings.preferredIdVoice}
                onChange={(e) =>
                  setSettings({ ...settings, preferredIdVoice: e.target.value })
                }
                className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-[#f6f3ec] dark:bg-stone-800"
              >
                <option value="">Otomatis (Peringkat Terbaik Browser)</option>
                {idVoices.map((v) => (
                  <option key={v.name} value={v.name}>
                    {v.name} ({v.lang})
                  </option>
                ))}
              </select>
            </div>

            {/* English Voice */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-stone-500 font-medium">Suara British English (en-GB)</label>
                <button
                  type="button"
                  onClick={() => handleTestVoice('en-GB')}
                  className="text-[11px] font-semibold text-[#a87a08] hover:underline"
                >
                  Uji Suara EN
                </button>
              </div>
              <select
                value={settings.preferredEnVoice}
                onChange={(e) =>
                  setSettings({ ...settings, preferredEnVoice: e.target.value })
                }
                className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-[#f6f3ec] dark:bg-stone-800"
              >
                <option value="">Otomatis (British / Natural English)</option>
                {enVoices.map((v) => (
                  <option key={v.name} value={v.name}>
                    {v.name} ({v.lang})
                  </option>
                ))}
              </select>
            </div>

            {/* Speed & Pitch */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="text-stone-500 font-medium block mb-1">
                  Kecepatan Bicara ({settings.speechRate}x)
                </label>
                <input
                  type="range"
                  min="0.8"
                  max="1.2"
                  step="0.05"
                  value={settings.speechRate}
                  onChange={(e) =>
                    setSettings({ ...settings, speechRate: parseFloat(e.target.value) })
                  }
                  className="w-full accent-[#0f5c4d]"
                />
              </div>
              <div>
                <label className="text-stone-500 font-medium block mb-1">
                  Nada Suara / Pitch ({settings.speechPitch})
                </label>
                <input
                  type="range"
                  min="0.8"
                  max="1.2"
                  step="0.05"
                  value={settings.speechPitch}
                  onChange={(e) =>
                    setSettings({ ...settings, speechPitch: parseFloat(e.target.value) })
                  }
                  className="w-full accent-[#0f5c4d]"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Pengingat Suara & Salat */}
          <div className="space-y-3 pt-3 border-t border-stone-200 dark:border-stone-800">
            <h4 className="font-bold text-stone-900 dark:text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5 text-[#0f5c4d]">
              <Bell className="w-3.5 h-3.5" />
              <span>Pengingat Suara & Notifikasi Salat</span>
            </h4>

            <div className="space-y-2">
              <label className="flex items-center justify-between p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 cursor-pointer">
                <div>
                  <span className="font-semibold text-stone-800 dark:text-stone-200 block">
                    Peringatan Waktu Salat Suara Laura
                  </span>
                  <span className="text-[10px] text-stone-400">
                    Laura berbicara mengingatkan saat waktu azan tiba
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.prayerRemindersEnabled}
                  onChange={(e) =>
                    setSettings({ ...settings, prayerRemindersEnabled: e.target.checked })
                  }
                  className="w-4 h-4 accent-[#0f5c4d]"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 cursor-pointer">
                <div>
                  <span className="font-semibold text-stone-800 dark:text-stone-200 block">
                    Peringatan Agenda & Rutinitas Harian
                  </span>
                  <span className="text-[10px] text-stone-400">
                    Pengingat otomatis 15 menit sebelum agenda dimulai
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.agendaRemindersEnabled}
                  onChange={(e) =>
                    setSettings({ ...settings, agendaRemindersEnabled: e.target.checked })
                  }
                  className="w-4 h-4 accent-[#0f5c4d]"
                />
              </label>
            </div>

            {/* PWA Background Limits Disclaimer & Capacitor Android documentation */}
            <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 space-y-1.5 text-amber-900 dark:text-amber-200">
              <p className="font-bold flex items-center gap-1 text-[11px]">
                <Smartphone className="w-4 h-4 text-[#a87a08]" />
                <span>Catatan Keterbatasan Latar Belakang PWA:</span>
              </p>
              <p className="text-[10px] leading-relaxed text-amber-800 dark:text-amber-300">
                Sesuai standar spesifikasi web, aplikasi PWA di peramban tidak dapat memicu alarm suara ketika aplikasi ditutup total oleh sistem operasi ponsel. Untuk alarm latar belakang sejati, aplikasi Laura dapat dikemas dengan mudah menggunakan <strong>Capacitor Android wrapper</strong> dengan plugin <code>@capacitor/local-notifications</code> yang menjadwalkan exact alarms selama 7 hari ke depan secara berkala setiap kali aplikasi dibuka.
              </p>
            </div>
          </div>

          {/* Section 5: Cadangan & Pemulihan (JSON Export / Import) */}
          <div className="space-y-3 pt-3 border-t border-stone-200 dark:border-stone-800">
            <h4 className="font-bold text-stone-900 dark:text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5 text-[#0f5c4d]">
              <Download className="w-3.5 h-3.5" />
              <span>Cadangan & Pemulihan Data (JSON Backup)</span>
            </h4>

            {backupMessage && (
              <p className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-[#0f5c4d] dark:text-emerald-300 text-xs font-semibold">
                {backupMessage}
              </p>
            )}

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleExportBackup}
                className="p-3 rounded-xl border border-[#0f5c4d]/30 bg-[#0f5c4d]/5 hover:bg-[#0f5c4d]/15 text-[#0f5c4d] dark:text-emerald-400 font-semibold flex items-center justify-center gap-2 transition"
              >
                <Download className="w-4 h-4" />
                <span>Ekspor File JSON</span>
              </button>

              <label className="p-3 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 font-semibold flex items-center justify-center gap-2 transition cursor-pointer">
                <Upload className="w-4 h-4" />
                <span>Impor File JSON</span>
                <input
                  type="file"
                  accept=".json,application/json"
                  onChange={handleImportBackup}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-stone-200 dark:border-stone-800 flex items-center justify-end gap-2 bg-stone-50 dark:bg-stone-900">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-stone-600 dark:text-stone-300 hover:bg-stone-200/60 font-semibold text-xs"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-[#0f5c4d] hover:bg-[#0d4f42] text-white font-semibold text-xs shadow-md flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>Simpan Pengaturan</span>
          </button>
        </div>
      </div>
    </div>
  );
};
