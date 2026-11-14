/**
 * "Add to calendar" files: /events/<event>.ics for every event.
 * Times are written in UTC so every calendar app places them correctly.
 */
import type { APIRoute, GetStaticPaths } from 'astro';
import type { CollectionEntry } from 'astro:content';
import { getEvents, hasDetailPage } from '../../lib/content';
import { eventEnd, icsStamp, wallToDate, parseWall } from '../../lib/dates';
import { href } from '../../lib/url';

export const getStaticPaths = (async () => {
  const events = await getEvents();
  return events.map((event) => ({ params: { slug: event.id }, props: { event } }));
}) satisfies GetStaticPaths;

/** Escape text and fold long lines as RFC 5545 requires. */
const esc = (s: string) => s.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/([,;])/g, '\\$1');
const fold = (line: string) => {
  const out: string[] = [];
  let rest = line;
  while (rest.length > 74) {
    out.push(rest.slice(0, 74));
    rest = ' ' + rest.slice(74);
  }
  out.push(rest);
  return out.join('\r\n');
};

export const GET: APIRoute = ({ props, site }) => {
  const { event } = props as { event: CollectionEntry<'events'> };
  const { data } = event;
  const start = wallToDate(data.start);
  // No end time given: assume one hour (or all day if no start time either).
  const allDay = !parseWall(data.start).hasTime;
  const end = data.end ? wallToDate(data.end) : allDay ? eventEnd(data.start) : new Date(start.getTime() + 60 * 60 * 1000);
  const url = new URL(href(hasDetailPage(event) ? `/events/${event.id}` : '/events'), site).href;

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Synapse at Georgia Tech//Website//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${event.id}@synapse-at-gt`,
    `DTSTAMP:${icsStamp(new Date())}`,
    `DTSTART:${icsStamp(start)}`,
    `DTEND:${icsStamp(end)}`,
    `SUMMARY:${esc(data.title)}`,
    `DESCRIPTION:${esc(`${data.summary}\n\nHosted by Synapse at Georgia Tech.\n${url}`)}`,
    `LOCATION:${esc(data.location)}`,
    `URL:${url}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ];

  return new Response(lines.map(fold).join('\r\n') + '\r\n', {
    headers: { 'Content-Type': 'text/calendar; charset=utf-8' },
  });
};
