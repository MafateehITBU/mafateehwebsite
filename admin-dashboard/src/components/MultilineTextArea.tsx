import { Input, Typography } from "antd";
import type { TextAreaProps } from "antd/es/input";

type MultilineTextAreaProps = TextAreaProps & {
  hint?: boolean;
};

/** TextArea that keeps line breaks; they are shown on the public website. */
export function MultilineTextArea({ hint = true, ...props }: MultilineTextAreaProps) {
  return (
    <div className="multiline-textarea">
      <Input.TextArea {...props} />
      {hint ? (
        <Typography.Text type="secondary" style={{ display: "block", marginTop: 6, fontSize: 12 }}>
          Line breaks are preserved and shown on the website.
        </Typography.Text>
      ) : null}
    </div>
  );
}
