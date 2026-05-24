/** Normalize Windows/Mac line endings without removing intentional blank lines. */
export function normalizeMultiline(value: string): string {
  return value.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
}
