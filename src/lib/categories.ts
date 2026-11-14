/** URL-friendly keys for filters: "Journal Club & Research" → "journal-club-research". */
export function categorySlug(label: string): string {
  return label
    .toLowerCase()
    .replace(/&/g, ' ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}
