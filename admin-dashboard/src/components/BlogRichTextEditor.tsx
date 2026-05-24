import type { ComponentProps } from "react";
import { RichHtmlEditor } from "./RichHtmlEditor";

type BlogRichTextEditorProps = ComponentProps<typeof RichHtmlEditor>;

/** Blog body editor (no brand colors / divider). */
export function BlogRichTextEditor(props: BlogRichTextEditorProps) {
  return <RichHtmlEditor {...props} extended={false} />;
}
