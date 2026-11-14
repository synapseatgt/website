/**
 * Content schemas — the safety net.
 *
 * Every file officers edit in Pages CMS is checked against these rules when the
 * site builds. If a required field is missing or a value isn't allowed, the
 * build fails, nothing is published, and the live site stays as it was.
 *
 * If you add or rename a field here, make the same change in .pages.yml.
 */
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/* ---------- shared pieces ---------- */

/** A calendar date. YAML turns 2026-11-20 into a Date; we keep it as "2026-11-20". */
const dateOnly = z
  .union([z.string().regex(/^\d{4}-\d{2}-\d{2}/), z.date()], { error: 'Needs a date, e.g. 2026-11-20' })
  .transform((v) => (v instanceof Date ? v.toISOString().slice(0, 10) : v.slice(0, 10)));

/** Atlanta wall-clock date and time, "2026-11-20T18:30". */
const dateTime = z
  .union([z.string().regex(/^\d{4}-\d{2}-\d{2}([T ]\d{2}:\d{2})?/), z.date()], { error: 'Needs a date and time, e.g. 2026-11-20T18:30' })
  .transform((v) => (v instanceof Date ? v.toISOString().slice(0, 16) : v.trim().replace(' ', 'T').slice(0, 16)));

/** Optional text: blank strings from the CMS count as "not filled in". */
const optionalText = z
  .string()
  .nullish()
  .transform((v) => (v && v.trim() ? v.trim() : undefined));

const optionalUrl = z
  .string()
  .nullish()
  .transform((v) => (v && v.trim() ? v.trim() : undefined))
  .refine((v) => !v || /^(https?:\/\/|mailto:|\/)/.test(v), 'Links must start with https://, mailto: or /');

const textList = z
  .array(z.string().nullish())
  .nullish()
  .transform((v) => (v ?? []).filter((s): s is string => Boolean(s && s.trim())));

const linkList = z
  .array(z.object({ title: z.string(), url: z.string() }))
  .nullish()
  .transform((v) => v ?? []);

const draft = z.boolean().nullish().transform((v) => v ?? false);

/* ---------- allowed values (keep in sync with .pages.yml) ---------- */

export const PROJECT_CATEGORIES = ['Engineering Projects', 'Journal Club & Research', 'Workshops & Education'] as const;
export const PROJECT_STATUSES = ['Planned', 'Recruiting', 'Active', 'Completed'] as const;
export const EVENT_CATEGORIES = ['General Meeting', 'Workshop', 'Journal Club', 'Speaker', 'Showcase', 'Social'] as const;
export const PUBLICATION_TYPES = ['Newsletter', 'Article'] as const;

/* ---------- collections ---------- */

const officers = defineCollection({
  loader: glob({ pattern: '**/*.{yml,yaml}', base: './src/content/officers' }),
  schema: ({ image }) =>
    z
      .object({
        name: z.string().min(1),
        position: z.string().min(1),
        photo: image().nullish(),
        photo_alt: optionalText,
        order: z.number().int().nullish().transform((v) => v ?? 99),
        term: z.string().min(1),
        major: optionalText,
        year: optionalText,
        link: optionalUrl,
        active: z.boolean().default(true),
      })
      .refine((o) => !o.photo || o.photo_alt, { message: 'Add alt text for the photo', path: ['photo_alt'] }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: ({ image }) =>
    z
      .object({
        title: z.string().min(1),
        summary: z.string().min(1).max(160, 'Keep the summary to 160 characters'),
        category: z.enum(PROJECT_CATEGORIES),
        status: z.enum(PROJECT_STATUSES),
        cover: image().nullish(),
        cover_alt: optionalText,
        lead: optionalText,
        members: textList,
        skills: textList,
        goals: optionalText,
        start_date: dateOnly.nullish(),
        end_date: dateOnly.nullish(),
        github: optionalUrl,
        outputs: linkList,
        recruitment_url: optionalUrl,
        featured: z.boolean().nullish().transform((v) => v ?? false),
        updates: z
          .array(z.object({ date: dateOnly, text: z.string() }))
          .nullish()
          .transform((v) => v ?? []),
        draft,
      })
      .refine((p) => !p.cover || p.cover_alt, { message: 'Add alt text for the cover image', path: ['cover_alt'] })
      .refine((p) => p.status !== 'Completed' || (p.end_date && p.outputs.length > 0), {
        message: 'A Completed project needs an end date and at least one output',
        path: ['status'],
      }),
});

const events = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/events' }),
  schema: ({ image }) =>
    z
      .object({
        title: z.string().min(1),
        start: dateTime,
        end: dateTime.nullish(),
        location: z.string().min(1),
        category: z.enum(EVENT_CATEGORIES),
        summary: z.string().min(1).max(220, 'Keep the short description to 220 characters'),
        image: image().nullish(),
        image_alt: optionalText,
        registration_url: optionalUrl,
        draft,
      })
      .refine((e) => !e.image || e.image_alt, { message: 'Add alt text for the image', path: ['image_alt'] }),
});

const publications = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/publications' }),
  schema: ({ image }) =>
    z
      .object({
        title: z.string().min(1),
        date: dateOnly,
        type: z.enum(PUBLICATION_TYPES),
        summary: z.string().min(1).max(240),
        cover: image().nullish(),
        cover_alt: optionalText,
        authors: textList,
        tags: textList,
        pdf: optionalText,
        draft,
      })
      .refine((p) => !p.cover || p.cover_alt, { message: 'Add alt text for the cover image', path: ['cover_alt'] }),
});

const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pages' }),
  schema: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
  }),
});

const settings = defineCollection({
  loader: glob({ pattern: '**/*.{yml,yaml}', base: './src/content/settings' }),
  schema: z.object({
    site_title: z.string().default('Synapse at Georgia Tech'),
    site_description: z.string().min(1),
    hero_headline: z.string().min(1),
    hero_text: z.string().min(1),
    hero_primary_label: z.string().default('Join Synapse'),
    hero_secondary_label: z.string().default('See our projects'),
    recruiting: z.boolean().default(false),
    recruiting_banner: optionalText,
    join_url: z.string().min(1),
    meeting_day: optionalText,
    meeting_time: optionalText,
    meeting_place: optionalText,
    instagram_url: optionalUrl,
    email: z.email(),
    contact_forms: z
      .array(z.object({ label: z.string(), url: z.string(), description: z.string().nullish() }))
      .nullish()
      .transform((v) => v ?? []),
    show_advisor: z.boolean().default(false),
    advisor_name: optionalText,
    advisor_title: optionalText,
    advisor_url: optionalUrl,
  }),
});

export const collections = { officers, projects, events, publications, pages, settings };
