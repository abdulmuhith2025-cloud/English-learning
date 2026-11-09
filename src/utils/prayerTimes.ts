import { PrayerTimesResult } from '../types';

/**
 * Astronomical Prayer Times Calculator based on Kemenag RI parameters:
 * - Subuh: Sun depression angle = 20 degrees
 * - Isya: Sun depression angle = 18 degrees
 * - Asar: Shadow factor = 1 (standard Shafi'i / Kemenag)
 * - Terbit / Magrib: Sun depression angle = 0.833 degrees (accounting for refraction & semi-diameter)
 * - Ihtiyat (safety buffer): +2 minutes
 * Default Location: Jakarta (-6.2088, 106.8456, UTC+7)
 */

function degToRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

function radToDeg(rad: number): number {
  return (rad * 180) / Math.PI;
}

function fixAngle(a: number): number {
  let res = a - 360 * Math.floor(a / 360);
  if (res < 0) res += 360;
  return res;
}

function fixHour(h: number): number {
  let res = h - 24 * Math.floor(h / 24);
  if (res < 0) res += 24;
  return res;
}

// Julian Day
function getJulianDay(year: number, month: number, day: number): number {
  if (month <= 2) {
    year -= 1;
    month += 12;
  }
  const A = Math.floor(year / 100);
  const B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + B - 1524.5;
}

// Solar coordinates
function sunCoordinates(d: number): { declination: number; eqTime: number } {
  const D = d - 2451545.0;
  const g = fixAngle(357.529 + 0.98560028 * D);
  const q = fixAngle(280.459 + 0.98564736 * D);
  const L = fixAngle(q + 1.915 * Math.sin(degToRad(g)) + 0.02 * Math.sin(degToRad(2 * g)));
  const e = 23.439 - 0.00000036 * D;

  const sinDec = Math.sin(degToRad(e)) * Math.sin(degToRad(L));
  const declination = radToDeg(Math.asin(sinDec));

  const RA = radToDeg(Math.atan2(Math.cos(degToRad(e)) * Math.sin(degToRad(L)), Math.cos(degToRad(L)))) / 15;
  const eqTime = (q / 15 - fixHour(RA)) * 60;

  return { declination, eqTime };
}

// Convert decimal hours to HH:MM string
function hoursToTimeString(h: number): string {
  const totalMinutes = Math.round(fixHour(h) * 60);
  const hours = Math.floor(totalMinutes / 60) % 24;
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

export function calculatePrayerTimes(
  date: Date = new Date(),
  lat: number = -6.2088,
  lng: number = 106.8456,
  timezone: number = 7
): PrayerTimesResult {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const jd = getJulianDay(year, month, day);
  const { declination, eqTime } = sunCoordinates(jd);

  // Solar noon (Zuhur base)
  const dLat = degToRad(lat);
  const dDec = degToRad(declination);
  const noon = 12 + timezone - lng / 15 - eqTime / 60;

  // Zuhur with +2 mins ihtiyat
  const zuhur = noon + 2 / 60;

  // Hour angle helper
  const hourAngle = (angle: number): number => {
    const val = (Math.sin(degToRad(-angle)) - Math.sin(dLat) * Math.sin(dDec)) / (Math.cos(dLat) * Math.cos(dDec));
    if (val > 1) return 0;
    if (val < -1) return Math.PI;
    return radToDeg(Math.acos(val)) / 15;
  };

  // Subuh: 20 degrees depression
  const fajrHA = hourAngle(20);
  const subuh = noon - fajrHA + 2 / 60;

  // Syuruq (Sunrise): 0.833 degrees depression
  const sunriseHA = hourAngle(0.833);
  const syuruq = noon - sunriseHA - 2 / 60;

  // Asr: shadow factor = 1 (Shafi'i)
  const asrAlt = radToDeg(Math.atan(1 / (1 + Math.tan(Math.abs(dLat - dDec)))));
  const asrHA = hourAngle(-asrAlt);
  const asar = noon + asrHA + 2 / 60;

  // Maghrib: 0.833 degrees
  const sunsetHA = hourAngle(0.833);
  const magrib = noon + sunsetHA + 2 / 60;

  // Isya: 18 degrees depression
  const ishaHA = hourAngle(18);
  const isya = noon + ishaHA + 2 / 60;

  const result: PrayerTimesResult = {
    dateStr: date.toISOString().split('T')[0],
    subuh: hoursToTimeString(subuh),
    syuruq: hoursToTimeString(syuruq),
    zuhur: hoursToTimeString(zuhur),
    asar: hoursToTimeString(asar),
    magrib: hoursToTimeString(magrib),
    isya: hoursToTimeString(isya),
  };

  // Determine next prayer and time remaining
  const now = date.getHours() * 60 + date.getMinutes();
  const prayerMinutesList = [
    { name: 'Subuh', time: result.subuh },
    { name: 'Syuruq', time: result.syuruq },
    { name: 'Zuhur', time: result.zuhur },
    { name: 'Asar', time: result.asar },
    { name: 'Magrib', time: result.magrib },
    { name: 'Isya', time: result.isya },
  ].map((p) => {
    const [h, m] = p.time.split(':').map(Number);
    return { name: p.name, timeStr: p.time, totalMinutes: h * 60 + m };
  });

  let nextP = prayerMinutesList.find((p) => p.totalMinutes > now);
  if (!nextP) {
    // Next is tomorrow's Subuh
    nextP = prayerMinutesList[0];
    const minsUntilMidnight = 24 * 60 - now;
    result.minutesToNext = minsUntilMidnight + nextP.totalMinutes;
  } else {
    result.minutesToNext = nextP.totalMinutes - now;
  }
  result.nextPrayerName = nextP.name;
  result.nextPrayerTime = nextP.timeStr;

  return result;
}

export const INDONESIAN_CITIES = [
  { name: 'Jakarta (WIB)', lat: -6.2088, lng: 106.8456, tz: 7 },
  { name: 'Bandung (WIB)', lat: -6.9175, lng: 107.6191, tz: 7 },
  { name: 'Surabaya (WIB)', lat: -7.2575, lng: 112.7521, tz: 7 },
  { name: 'Yogyakarta (WIB)', lat: -7.7956, lng: 110.3695, tz: 7 },
  { name: 'Semarang (WIB)', lat: -6.9667, lng: 110.4167, tz: 7 },
  { name: 'Medan (WIB)', lat: 3.5952, lng: 98.6722, tz: 7 },
  { name: 'Makassar (WITA)', lat: -5.1477, lng: 119.4327, tz: 8 },
  { name: 'Denpasar (WITA)', lat: -8.6705, lng: 115.2126, tz: 8 },
  { name: 'Banjarmasin (WITA)', lat: -3.3194, lng: 114.5908, tz: 8 },
  { name: 'Jayapura (WIT)', lat: -2.5916, lng: 140.669, tz: 9 },
  { name: 'Banda Aceh (WIB)', lat: 5.5483, lng: 95.3238, tz: 7 },
];
