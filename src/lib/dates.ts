/**
 * Date helpers.
 *
 * Event times are entered in the CMS as Atlanta wall-clock time
 * ("2026-11-20T18:30", no time zone). We keep them as strings and only turn
 * them into absolute instants when we need to compare with "now" or write a
 * calendar file. That way the build server's time zone never shifts an event.
 */
export const TIME_ZONE = 'America/New_York';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTHS_LONG = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export interface WallTime {
  year: number;
  month: number; // 1-12
  day: number;
  hour: number;
  minute: number;
  hasTime: boolean;
}

export function parseWall(value: string): WallTime {
  const m = /^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2}))?/.exec(value);
  if (!m) throw new Error(`Unrecognised date: "${value}"`);
  return {
    year: +m[1],
    month: +m[2],
    day: +m[3],
    hour: m[4] ? +m[4] : 0,
    minute: m[5] ? +m[5] : 0,
    hasTime: Boolean(m[4]),
  };
}

/** Offset of Atlanta from UTC, in minutes, at a given instant (e.g. -300 or -240). */
function nyOffsetMinutes(at: Date): number {
  const name = new Intl.DateTimeFormat('en-US', { timeZone: TIME_ZONE, timeZoneName: 'shortOffset' })
    .formatToParts(at)
    .find((p) => p.type === 'timeZoneName')?.value ?? 'GMT-5';
  const m = /GMT([+-])(\d{1,2})(?::(\d{2}))?/.exec(name);
  if (!m) return -300;
  const sign = m[1] === '-' ? -1 : 1;
  return sign * (+m[2] * 60 + (m[3] ? +m[3] : 0));
}

/** Convert Atlanta wall-clock time to an absolute Date. */
export function wallToDate(value: string): Date {
  const w = parseWall(value);
  const guess = Date.UTC(w.year, w.month - 1, w.day, w.hour, w.minute);
  const offset = nyOffsetMinutes(new Date(guess));
  return new Date(guess - offset * 60_000);
}

/** When an event is considered over: its end time, else 11:59 pm on its start day. */
export function eventEnd(start: string, end?: string): Date {
  if (end) return wallToDate(end);
  const w = parseWall(start);
  const pad = (n: number) => String(n).padStart(2, '0');
  return wallToDate(`${w.year}-${pad(w.month)}-${pad(w.day)}T23:59`);
}

export function monthShort(value: string): string {
  return MONTHS[parseWall(value).month - 1].toUpperCase();
}

export function dayOfMonth(value: string): string {
  return String(parseWall(value).day);
}

function weekday(w: WallTime): string {
  return WEEKDAYS[new Date(Date.UTC(w.year, w.month - 1, w.day)).getUTCDay()];
}

export function formatTime(value: string): string {
  const w = parseWall(value);
  if (!w.hasTime) return '';
  const h = w.hour % 12 || 12;
  const ampm = w.hour < 12 ? 'am' : 'pm';
  return w.minute ? `${h}:${String(w.minute).padStart(2, '0')} ${ampm}` : `${h} ${ampm}`;
}

/** "Thursday, November 20, 2026" */
export function formatLongDate(value: string): string {
  const w = parseWall(value);
  return `${weekday(w)}, ${MONTHS_LONG[w.month - 1]} ${w.day}, ${w.year}`;
}

/** "Nov 20, 2026" */
export function formatDate(value: string): string {
  const w = parseWall(value);
  return `${MONTHS[w.month - 1]} ${w.day}, ${w.year}`;
}

/** "6:30 pm – 8 pm" or "6:30 pm" */
export function formatTimeRange(start: string, end?: string): string {
  const a = formatTime(start);
  const b = end ? formatTime(end) : '';
  return b ? `${a} – ${b}` : a;
}

/** ISO date (YYYY-MM-DD) or wall time string, for <time datetime>. */
export function machine(value: string): string {
  return value.slice(0, 16);
}

/** 20261120T233000Z — for .ics files */
export function icsStamp(d: Date): string {
  return d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}
