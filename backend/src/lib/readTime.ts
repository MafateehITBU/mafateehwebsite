/** Average adult reading speed for blog-style content (words per minute). */
const WORDS_PER_MINUTE = 200;

/**
 * Estimates read time in whole minutes from HTML or plain text.
 * Strips tags so markup does not inflate the count; minimum 1 minute.
 */
export function estimateReadTimeMinutes(content: string): number {
  const stripped = content.replace(/<[^>]*>/g, " ");
  const words = stripped
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0);
  const minutes = Math.ceil(words.length / WORDS_PER_MINUTE);
  return Math.max(1, minutes);
}

/** Bilingual blog body: estimate from English + Arabic content together. */
export function estimateBlogReadTimeMinutes(content: string, contentAr: string): number {
  return estimateReadTimeMinutes(`${content}\n${contentAr}`);
}
