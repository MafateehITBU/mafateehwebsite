import { useEffect, useRef, useState, type ClipboardEvent, type KeyboardEvent } from "react";
import {
  BoldOutlined,
  ItalicOutlined,
  LineOutlined,
  LinkOutlined,
  UnderlineOutlined,
  DisconnectOutlined,
} from "@ant-design/icons";
import { Button, Divider, Form, Input, Modal, Space, Tooltip, Typography } from "antd";

export const RICH_COLOR_PRIMARY = "#00502e";
export const RICH_COLOR_SECONDARY = "#dfb026";

type RichHtmlEditorProps = {
  value?: string;
  onChange?: (value: string) => void;
  dir?: "ltr" | "rtl";
  placeholder?: string;
  minHeight?: number;
  /** Brand colors (#00502e, #dfb026) and horizontal divider (#e0e0e0). */
  extended?: boolean;
};

type BlockTag = "p" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
type ColorClass = "text-primary" | "text-secondary";

const HEADING_BUTTONS: { tag: BlockTag; label: string }[] = [
  { tag: "h1", label: "H1" },
  { tag: "h2", label: "H2" },
  { tag: "h3", label: "H3" },
  { tag: "h4", label: "H4" },
  { tag: "h5", label: "H5" },
  { tag: "h6", label: "H6" },
];

function toEditorHtml(value: string | undefined): string {
  if (!value?.trim()) return "";
  if (/<[a-z][\s\S]*>/i.test(value)) return value;
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\n/g, "<br>");
}

function stripTags(html: string): string {
  return html.replace(/<[^>]+>/g, "");
}

const ALLOWED_COLOR_CLASSES = new Set(["text-primary", "text-secondary"]);

/** Safe href for editor links (http(s), mailto, tel, relative, hash). */
export function isSafeHref(href: string): boolean {
  const value = String(href ?? "").trim();
  if (!value) return false;
  if (/^\s*javascript:/i.test(value) || /^\s*data:/i.test(value)) return false;
  return /^(https?:\/\/|mailto:|tel:|\/|#)/i.test(value);
}

function normalizeHref(raw: string): string {
  const value = String(raw ?? "").trim();
  if (!value) return "";
  if (/^(https?:\/\/|mailto:|tel:|\/|#)/i.test(value)) return value;
  // Bare domains → https
  if (/^[\w.-]+\.[a-z]{2,}([/:?#].*)?$/i.test(value)) {
    return `https://${value}`;
  }
  return value;
}

function isExternalHref(href: string): boolean {
  return /^(https?:\/\/|\/|#)/i.test(href);
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Strip bidi / zero-width format chars that RTL editors and Windows
 * often inject around Latin URLs when pasting into Arabic text.
 */
function stripFormatChars(text: string): string {
  return String(text ?? "").replace(
    /[\u200B-\u200F\u202A-\u202E\u2060-\u2064\u2066-\u2069\uFEFF]/g,
    "",
  );
}

/**
 * Match http(s), www., or bare domains.
 * Avoid `\b` alone — it fails next to some Unicode / bidi edges in RTL paste.
 */
const URL_IN_TEXT_RE =
  /(?:^|[^A-Za-z0-9_/@.-])((?:https?:\/\/|www\.)[^\s<>"'()[\]]+|(?:[\w-]+\.)+[a-z]{2,}(?:\/[^\s<>"'()[\]]*)?)/gi;

function trimTrailingPunctuation(raw: string): { url: string; trail: string } {
  // Include Arabic punctuation (، ؛ ؟ ۔) and common closers
  const match = raw.match(/^(.*?)([.,;:!?)}\]،؛؟۔»"']*)$/u);
  if (!match) return { url: raw, trail: "" };
  return { url: match[1], trail: match[2] };
}

function buildAnchorHtml(rawUrl: string): string | null {
  const cleaned = stripFormatChars(rawUrl);
  const { url: trimmed, trail } = trimTrailingPunctuation(cleaned.trim());
  if (!trimmed) return null;
  const href = normalizeHref(trimmed);
  if (!isSafeHref(href)) return null;
  const label = escapeHtml(trimmed);
  const safeHref = escapeHtml(href);
  const anchor = isExternalHref(href)
    ? `<a href="${safeHref}" target="_blank" rel="noopener noreferrer" dir="ltr">${label}</a>`
    : `<a href="${safeHref}" dir="ltr">${label}</a>`;
  return trail ? `${anchor}${escapeHtml(trail)}` : anchor;
}

/** True if cleaned plain text contains something that looks like a URL. */
function plainTextHasUrl(text: string): boolean {
  const cleaned = stripFormatChars(text);
  return /(?:https?:\/\/|www\.|(?:[\w-]+\.)+[a-z]{2,})/i.test(cleaned);
}

/** Turn plain text into HTML, auto-wrapping detected URLs as anchors. */
function linkifyPlainText(text: string): string {
  const cleaned = stripFormatChars(text);
  const parts: string[] = [];
  let last = 0;
  const re = new RegExp(URL_IN_TEXT_RE.source, "gi");
  let match: RegExpExecArray | null;
  while ((match = re.exec(cleaned)) !== null) {
    const full = match[0];
    const urlPart = match[1];
    const urlStart = match.index + (full.length - urlPart.length);
    if (urlStart > last) {
      parts.push(escapeHtml(cleaned.slice(last, urlStart)).replace(/\n/g, "<br>"));
    }
    const linked = buildAnchorHtml(urlPart);
    parts.push(linked ?? escapeHtml(urlPart));
    last = match.index + full.length;
  }
  if (last < cleaned.length) {
    parts.push(escapeHtml(cleaned.slice(last)).replace(/\n/g, "<br>"));
  }
  return parts.join("") || escapeHtml(cleaned).replace(/\n/g, "<br>");
}

function looksLikeUrlToken(token: string): boolean {
  const { url } = trimTrailingPunctuation(stripFormatChars(token).trim());
  if (!url) return false;
  return isSafeHref(normalizeHref(url));
}

/** Insert HTML at the current caret (more reliable than execCommand in RTL). */
function insertHtmlAtCaret(html: string) {
  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0) {
    document.execCommand("insertHTML", false, html);
    return;
  }
  const range = sel.getRangeAt(0);
  range.deleteContents();
  const temp = document.createElement("template");
  temp.innerHTML = html;
  const frag = document.createDocumentFragment();
  let lastNode: ChildNode | null = null;
  const nodes = temp.content.childNodes;
  while (nodes.length > 0) {
    lastNode = frag.appendChild(nodes[0]!);
  }
  range.insertNode(frag);
  if (lastNode) {
    const after = document.createRange();
    after.setStartAfter(lastNode);
    after.collapse(true);
    sel.removeAllRanges();
    sel.addRange(after);
  }
}

/** Unwrap browser-generated spans (styles) that are not brand color spans; keep safe anchors. */
function normalizeEditorHtml(html: string): string {
  if (!html?.trim()) return html;
  const doc = new DOMParser().parseFromString(html, "text/html");
  const body = doc.body;

  body.querySelectorAll("span").forEach((span) => {
    const hasColorClass = [...span.classList].some((c) => ALLOWED_COLOR_CLASSES.has(c));
    if (hasColorClass) return;
    const parent = span.parentNode;
    if (!parent) return;
    while (span.firstChild) {
      parent.insertBefore(span.firstChild, span);
    }
    span.remove();
  });

  body.querySelectorAll("font").forEach((font) => {
    const parent = font.parentNode;
    if (!parent) return;
    while (font.firstChild) {
      parent.insertBefore(font.firstChild, font);
    }
    font.remove();
  });

  body.querySelectorAll("a").forEach((anchor) => {
    const href = normalizeHref(anchor.getAttribute("href") ?? "");
    if (!isSafeHref(href)) {
      const parent = anchor.parentNode;
      if (!parent) return;
      while (anchor.firstChild) {
        parent.insertBefore(anchor.firstChild, anchor);
      }
      anchor.remove();
      return;
    }
    anchor.setAttribute("href", href);
    anchor.setAttribute("dir", "ltr");
    if (isExternalHref(href)) {
      anchor.setAttribute("target", "_blank");
      anchor.setAttribute("rel", "noopener noreferrer");
    } else {
      anchor.removeAttribute("target");
      anchor.removeAttribute("rel");
    }
  });

  return body.innerHTML;
}

function findAnchorInSelection(): HTMLAnchorElement | null {
  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0) return null;
  let node: Node | null = sel.anchorNode;
  while (node) {
    if (node instanceof HTMLAnchorElement) return node;
    node = node.parentNode;
  }
  return null;
}

export function RichHtmlEditor({
  value,
  onChange,
  dir = "ltr",
  placeholder = "Write content…",
  minHeight = 280,
  extended = false,
}: RichHtmlEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const lastEmitted = useRef<string | undefined>(undefined);
  const savedRange = useRef<Range | null>(null);
  const [linkOpen, setLinkOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkForm] = Form.useForm<{ url: string }>();

  useEffect(() => {
    const el = editorRef.current;
    if (!el) return;
    const next = toEditorHtml(value);
    if (lastEmitted.current === value && el.innerHTML === next) return;
    if (el.innerHTML !== next) {
      el.innerHTML = next;
    }
  }, [value]);

  const emitChange = () => {
    const raw = editorRef.current?.innerHTML ?? "";
    const html = normalizeEditorHtml(raw);
    if (html !== raw && editorRef.current) {
      editorRef.current.innerHTML = html;
    }
    lastEmitted.current = html;
    onChange?.(html);
  };

  const applyFormat = (command: "bold" | "italic" | "underline") => {
    editorRef.current?.focus();
    document.execCommand(command);
    emitChange();
  };

  const applyBlock = (tag: BlockTag) => {
    editorRef.current?.focus();
    document.execCommand("formatBlock", false, tag);
    emitChange();
  };

  const applyColorClass = (className: ColorClass) => {
    const el = editorRef.current;
    if (!el) return;
    el.focus();
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0 || sel.isCollapsed) return;

    const range = sel.getRangeAt(0);
    const span = document.createElement("span");
    span.className = className;
    try {
      range.surroundContents(span);
      sel.removeAllRanges();
      const after = document.createRange();
      after.selectNodeContents(span);
      after.collapse(false);
      sel.addRange(after);
    } catch {
      const text = range.toString();
      if (!text) return;
      document.execCommand(
        "insertHTML",
        false,
        `<span class="${className}">${text}</span>`,
      );
    }
    emitChange();
  };

  const insertDivider = () => {
    editorRef.current?.focus();
    document.execCommand("insertHorizontalRule");
    const el = editorRef.current;
    if (el) {
      const hrs = el.querySelectorAll("hr");
      const last = hrs[hrs.length - 1];
      if (last && !last.classList.contains("rich-divider")) {
        last.classList.add("rich-divider");
      }
    }
    emitChange();
  };

  const saveSelection = () => {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) {
      savedRange.current = null;
      return;
    }
    const range = sel.getRangeAt(0);
    if (!editorRef.current?.contains(range.commonAncestorContainer)) {
      savedRange.current = null;
      return;
    }
    savedRange.current = range.cloneRange();
  };

  const restoreSelection = () => {
    const range = savedRange.current;
    const el = editorRef.current;
    if (!range || !el) return false;
    el.focus();
    const sel = window.getSelection();
    if (!sel) return false;
    sel.removeAllRanges();
    sel.addRange(range);
    return true;
  };

  const openLinkModal = () => {
    saveSelection();
    const existing = findAnchorInSelection();
    const initial = existing?.getAttribute("href") ?? "https://";
    setLinkUrl(initial);
    linkForm.setFieldsValue({ url: initial });
    setLinkOpen(true);
  };

  const applyLink = async () => {
    try {
      const values = await linkForm.validateFields();
      const href = normalizeHref(values.url);
      if (!isSafeHref(href)) {
        linkForm.setFields([
          {
            name: "url",
            errors: ["Enter a valid URL (https://…, /path, #anchor, mailto:, or tel:)"],
          },
        ]);
        return;
      }

      restoreSelection();
      const sel = window.getSelection();
      const existing = findAnchorInSelection();

      if (existing) {
        existing.setAttribute("href", href);
        if (isExternalHref(href)) {
          existing.setAttribute("target", "_blank");
          existing.setAttribute("rel", "noopener noreferrer");
        } else {
          existing.removeAttribute("target");
          existing.removeAttribute("rel");
        }
      } else if (sel && !sel.isCollapsed) {
        document.execCommand("createLink", false, href);
        // Harden attributes on newly created anchors in the selection
        const anchors = editorRef.current?.querySelectorAll("a[href]") ?? [];
        anchors.forEach((anchor) => {
          const aHref = normalizeHref(anchor.getAttribute("href") ?? "");
          if (!isSafeHref(aHref)) return;
          anchor.setAttribute("href", aHref);
          if (isExternalHref(aHref)) {
            anchor.setAttribute("target", "_blank");
            anchor.setAttribute("rel", "noopener noreferrer");
          }
        });
      } else {
        // No selection: insert linked text equal to the URL
        const label = href.replace(/^https?:\/\//i, "");
        document.execCommand(
          "insertHTML",
          false,
          isExternalHref(href)
            ? `<a href="${href}" target="_blank" rel="noopener noreferrer">${label}</a>`
            : `<a href="${href}">${label}</a>`,
        );
      }

      setLinkOpen(false);
      emitChange();
    } catch {
      /* validation failed */
    }
  };

  const removeLink = () => {
    editorRef.current?.focus();
    const existing = findAnchorInSelection();
    if (existing) {
      const parent = existing.parentNode;
      if (parent) {
        while (existing.firstChild) {
          parent.insertBefore(existing.firstChild, existing);
        }
        existing.remove();
      }
    } else {
      document.execCommand("unlink");
    }
    emitChange();
  };

  /** Paste: auto-convert URLs in plain text into clickable links (LTR + RTL). */
  const handlePaste = (event: ClipboardEvent<HTMLDivElement>) => {
    const clipboard = event.clipboardData;
    if (!clipboard) return;

    const html = clipboard.getData("text/html");
    const plain = clipboard.getData("text/plain");
    const plainClean = stripFormatChars(plain || "");

    // Prefer plain text when it contains URLs so we control link markup.
    // Cleaning bidi marks first is required for Arabic/RTL paste.
    if (plainClean && plainTextHasUrl(plainClean)) {
      event.preventDefault();
      insertHtmlAtCaret(linkifyPlainText(plainClean));
      emitChange();
      return;
    }

    // HTML paste that already includes anchors — insert cleaned HTML.
    if (html && /<a\b/i.test(html)) {
      event.preventDefault();
      const cleaned = normalizeEditorHtml(html);
      insertHtmlAtCaret(cleaned || linkifyPlainText(plainClean || ""));
      emitChange();
      return;
    }

    // HTML paste without <a> but whose text content has a URL (common from Word/RTL).
    if (html && plainClean && plainTextHasUrl(plainClean)) {
      event.preventDefault();
      insertHtmlAtCaret(linkifyPlainText(plainClean));
      emitChange();
    }
  };

  /**
   * After Space / Enter, if the word before the caret looks like a URL
   * and is not already inside an <a>, wrap it as a link.
   */
  const autoLinkPreviousWord = () => {
    const el = editorRef.current;
    if (!el) return;
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0 || !sel.isCollapsed) return;
    if (findAnchorInSelection()) return;

    const range = sel.getRangeAt(0);
    const node = range.startContainer;
    if (node.nodeType !== Node.TEXT_NODE) return;
    const text = node.textContent ?? "";
    const caret = range.startOffset;
    if (caret < 1) return;

    // Skip the just-typed delimiter (space / newline / Arabic separators).
    let end = caret;
    const justTyped = text[caret - 1];
    if (
      justTyped === " " ||
      justTyped === "\n" ||
      justTyped === "\u00a0" ||
      justTyped === "\u2003" ||
      justTyped === "،" ||
      justTyped === "؛"
    ) {
      end = caret - 1;
    }
    if (end <= 0) return;

    let start = end;
    while (start > 0 && !/[\s\u00a0]/.test(text[start - 1]!)) {
      start -= 1;
    }
    const token = stripFormatChars(text.slice(start, end));
    if (!looksLikeUrlToken(token)) return;

    const { url, trail } = trimTrailingPunctuation(token);
    const href = normalizeHref(url);
    if (!isSafeHref(href)) return;

    // Find the URL span inside the original text (may include invisible bidi marks).
    const originalSlice = text.slice(start, end);
    let consume = originalSlice.length;
    if (trail) {
      const trailIdx = originalSlice.lastIndexOf(trail);
      if (trailIdx >= 0) consume = trailIdx;
    }
    // Prefer ending at the last ASCII URL character
    const asciiUrlMatch = originalSlice.match(
      /(?:https?:\/\/|www\.|(?:[\w-]+\.)+[a-z]{2,})[^\s]*/i,
    );
    if (asciiUrlMatch && asciiUrlMatch.index != null) {
      consume = asciiUrlMatch.index + asciiUrlMatch[0].length;
      // drop trailing punctuation from consume
      while (consume > asciiUrlMatch.index && /[.,;:!?)}\]،؛؟۔»"']/.test(originalSlice[consume - 1]!)) {
        consume -= 1;
      }
    }

    const wordRange = document.createRange();
    wordRange.setStart(node, start);
    wordRange.setEnd(node, start + consume);

    const anchor = document.createElement("a");
    anchor.href = href;
    if (isExternalHref(href)) {
      anchor.target = "_blank";
      anchor.rel = "noopener noreferrer";
    }
    anchor.textContent = url;
    // Keep Latin URL direction readable inside RTL paragraphs
    anchor.setAttribute("dir", "ltr");

    wordRange.deleteContents();
    wordRange.insertNode(anchor);

    const after = document.createRange();
    if (anchor.nextSibling && anchor.nextSibling.nodeType === Node.TEXT_NODE) {
      after.setStart(anchor.nextSibling, 0);
    } else {
      after.setStartAfter(anchor);
    }
    after.collapse(true);
    sel.removeAllRanges();
    sel.addRange(after);
    emitChange();
  };

  const handleKeyUp = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === " " || event.key === "Enter") {
      autoLinkPreviousWord();
    }
  };

  const isEmpty = !value || value === "<br>" || !stripTags(value).trim();
  const surfaceMaxHeight = Math.max(minHeight, 320);

  return (
    <div className="rich-html-editor">
      <div className="rich-html-editor__toolbar">
        <Space wrap split={<Divider type="vertical" />}>
          <Space size={4} wrap>
            {HEADING_BUTTONS.map(({ tag, label }) => (
              <Button
                key={tag}
                size="small"
                type="text"
                aria-label={`Heading ${label}`}
                className="rich-html-editor__heading-btn"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => applyBlock(tag)}
              >
                {label}
              </Button>
            ))}
            <Button
              size="small"
              type="text"
              aria-label="Paragraph"
              className="rich-html-editor__heading-btn"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => applyBlock("p")}
            >
              P
            </Button>
          </Space>

          <Space size={4}>
            <Button
              type="text"
              aria-label="Bold"
              icon={<BoldOutlined />}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => applyFormat("bold")}
            />
            <Button
              type="text"
              aria-label="Italic"
              icon={<ItalicOutlined />}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => applyFormat("italic")}
            />
            <Button
              type="text"
              aria-label="Underline"
              icon={<UnderlineOutlined />}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => applyFormat("underline")}
            />
          </Space>

          <Space size={4}>
            <Tooltip title="Insert or edit link">
              <Button
                type="text"
                aria-label="Insert link"
                icon={<LinkOutlined />}
                onMouseDown={(e) => e.preventDefault()}
                onClick={openLinkModal}
              />
            </Tooltip>
            <Tooltip title="Remove link">
              <Button
                type="text"
                aria-label="Remove link"
                icon={<DisconnectOutlined />}
                onMouseDown={(e) => e.preventDefault()}
                onClick={removeLink}
              />
            </Tooltip>
          </Space>

          {extended ? (
            <Space size={4}>
              <Tooltip title={`Primary (${RICH_COLOR_PRIMARY})`}>
                <Button
                  size="small"
                  type="text"
                  aria-label="Primary color"
                  className="rich-html-editor__color-btn"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => applyColorClass("text-primary")}
                >
                  <span
                    className="rich-html-editor__swatch"
                    style={{ backgroundColor: RICH_COLOR_PRIMARY }}
                  />
                </Button>
              </Tooltip>
              <Tooltip title={`Secondary (${RICH_COLOR_SECONDARY})`}>
                <Button
                  size="small"
                  type="text"
                  aria-label="Secondary color"
                  className="rich-html-editor__color-btn"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => applyColorClass("text-secondary")}
                >
                  <span
                    className="rich-html-editor__swatch"
                    style={{ backgroundColor: RICH_COLOR_SECONDARY }}
                  />
                </Button>
              </Tooltip>
              <Tooltip title="Horizontal line">
                <Button
                  size="small"
                  type="text"
                  aria-label="Insert horizontal line"
                  icon={<LineOutlined />}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={insertDivider}
                />
              </Tooltip>
            </Space>
          ) : null}
        </Space>
      </div>

      <div
        ref={editorRef}
        className={[
          "rich-html-editor__surface",
          extended ? "rich-html-editor__surface--extended" : "",
        ]
          .filter(Boolean)
          .join(" ")}
        contentEditable
        dir={dir}
        role="textbox"
        aria-multiline
        data-placeholder={placeholder}
        style={{ minHeight, maxHeight: surfaceMaxHeight }}
        suppressContentEditableWarning
        onInput={emitChange}
        onBlur={emitChange}
        onPaste={handlePaste}
        onKeyUp={handleKeyUp}
      />

      {isEmpty ? (
        <Typography.Text type="secondary" style={{ display: "block", marginTop: 6, fontSize: 12 }}>
          {extended
            ? "Headings, bold/italic/underline, links (paste or type a URL), brand colors, and horizontal lines are supported."
            : "Paste or type a URL to auto-link. Use the toolbar for headings, bold, italic, underline, and manual links."}
        </Typography.Text>
      ) : null}

      <Modal
        title="Insert link"
        open={linkOpen}
        onOk={applyLink}
        onCancel={() => setLinkOpen(false)}
        okText="Apply"
        destroyOnClose
      >
        <Form form={linkForm} layout="vertical" initialValues={{ url: linkUrl }}>
          <Form.Item
            name="url"
            label="URL"
            rules={[{ required: true, message: "URL is required" }]}
            extra="Examples: https://example.com, /en/contact, #section, mailto:hello@example.com"
          >
            <Input
              autoFocus
              placeholder="https://example.com"
              onPressEnter={(e) => {
                e.preventDefault();
                void applyLink();
              }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
