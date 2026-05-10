export function slugify(input: string): string {
  return input
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export function uniqueSlug(base: string, isTaken: (s: string) => Promise<boolean>): Promise<string> {
  const run = async (s: string, n: number): Promise<string> => {
    const candidate = n === 0 ? s : `${s}-${n}`;
    if (!(await isTaken(candidate))) return candidate;
    return run(s, n + 1);
  };
  const b = slugify(base) || "item";
  return run(b, 0);
}
