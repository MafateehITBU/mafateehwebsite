const BASIC_TAGS = new Set([
  "b",
  "strong",
  "i",
  "em",
  "u",
  "br",
  "p",
  "div",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
]);

const EXTENDED_TAGS = new Set([...BASIC_TAGS, "span", "hr", "font"]);

const ALLOWED_SPAN_CLASSES = new Set(["text-primary", "text-secondary"]);

/** Legacy class names from earlier rich-text builds. */
const LEGACY_SPAN_CLASS_MAP: Record<string, string> = {
  "rich-color-primary": "text-primary",
  "rich-color-secondary": "text-secondary",
};

const ALLOWED_FONT_COLORS = new Map<string, string>([
  ["#00502e", "text-primary"],
  ["00502e", "text-primary"],
  ["#dfb026", "text-secondary"],
  ["dfb026", "text-secondary"],
  ["rgb(0,80,46)", "text-primary"],
  ["rgb(0, 80, 46)", "text-primary"],
  ["rgb(223,176,38)", "text-secondary"],
  ["rgb(223, 176, 38)", "text-secondary"],
]);

export type SanitizeRichHtmlOptions = {
  /** Allow brand text colors and horizontal dividers (privacy policy). */
  extended?: boolean;
};

function normalizeFontColor(raw: string): string | null {
  const key = raw.trim().toLowerCase().replace(/\s/g, "");
  return ALLOWED_FONT_COLORS.get(key) ?? null;
}

function sanitizeSpanOpen(attrs: string): string {
  const classMatch = attrs.match(/\bclass=["']([^"']*)["']/i);
  if (!classMatch) return "";
  const classes = [
    ...new Set(
      classMatch[1]
        .split(/\s+/)
        .map((c) => LEGACY_SPAN_CLASS_MAP[c] ?? c)
        .filter((c) => ALLOWED_SPAN_CLASSES.has(c))
    ),
  ];
  if (classes.length === 0) return "";
  return `<span class="${classes.join(" ")}">`;
}

function sanitizeFontOpen(attrs: string): string {
  const colorMatch =
    attrs.match(/\bcolor=["']([^"']+)["']/i) ?? attrs.match(/\bcolor=([#\w(),.\s]+)/i);
  if (!colorMatch) return "";
  const colorClass = normalizeFontColor(colorMatch[1]);
  if (!colorClass) return "";
  return `<span class="${colorClass}">`;
}

/** Drop </span> tags that do not match a kept color span open tag. */
function balanceSpanTags(html: string): string {
  let depth = 0;
  return html.replace(/<span class="(?:text-primary|text-secondary)">|<\/span>/gi, (match) => {
    if (match.startsWith("</")) {
      if (depth > 0) {
        depth -= 1;
        return "</span>";
      }
      return "";
    }
    depth += 1;
    return match;
  });
}

export function sanitizeRichHtml(input: string, options: SanitizeRichHtmlOptions = {}): string {
  const extended = options.extended === true;
  const allowed = extended ? EXTENDED_TAGS : BASIC_TAGS;
  const trimmed = input.trim();
  if (!trimmed) return trimmed;

  let out = trimmed
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "");

  out = out.replace(/<\/?([a-z][a-z0-9]*)\b([^>]*)>/gi, (match, tagName: string, attrs: string) => {
    const tag = tagName.toLowerCase();
    const isClose = match.startsWith("</");

    if (!allowed.has(tag)) return "";

    if (tag === "span") {
      if (!extended) return "";
      if (isClose) return "</span>";
      return sanitizeSpanOpen(attrs);
    }

    if (tag === "font") {
      if (!extended) return "";
      if (isClose) return "</span>";
      return sanitizeFontOpen(attrs);
    }

    if (isClose) return `</${tag}>`;
    if (tag === "br") return "<br>";
    if (tag === "hr" && extended) return '<hr class="rich-divider">';
    return `<${tag}>`;
  });

  if (extended) {
    out = balanceSpanTags(out);
  }

  return out;
}

/** Blog posts: headings and inline styles only. */
export function sanitizeBlogHtml(input: string): string {
  return sanitizeRichHtml(input, { extended: false });
}

export function stripHtmlToPlainText(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<hr\b[^>]*>/gi, "\n\n")
    .replace(/<\/h[1-6]>/gi, "\n\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<\/div>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
