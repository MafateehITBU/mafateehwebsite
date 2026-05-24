import { useCallback, useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { Form, Input, Spin, Typography } from "antd";
import type { FormInstance } from "antd";

const SEARCH_URL = "https://api.iconify.design/search";
const DEFAULT_LIMIT = 48;

type SearchResponse = {
  icons?: string[];
};

type IconifyIconPickerProps = {
  form: FormInstance;
  fieldName?: string;
  label?: string;
};

export function IconifyIconPicker({
  form,
  fieldName = "icon",
  label = "Icon",
}: IconifyIconPickerProps) {
  const selected = Form.useWatch(fieldName, form) as string | undefined;
  const [query, setQuery] = useState("");
  const [icons, setIcons] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchIcons = useCallback(async (q: string) => {
    const trimmed = q.trim();
    if (!trimmed) {
      setIcons([]);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        query: trimmed,
        limit: String(DEFAULT_LIMIT),
      });
      const res = await fetch(`${SEARCH_URL}?${params}`);
      if (!res.ok) throw new Error("Icon search failed");
      const data = (await res.json()) as SearchResponse;
      setIcons(Array.isArray(data.icons) ? data.icons : []);
    } catch {
      setIcons([]);
      setError("Could not load icons. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const t = window.setTimeout(() => {
      void searchIcons(query);
    }, 350);
    return () => window.clearTimeout(t);
  }, [query, searchIcons]);

  useEffect(() => {
    if (selected && !query) setQuery(selected.split(":")[1] ?? selected);
  }, [selected, query]);

  const pick = (iconId: string) => {
    form.setFieldValue(fieldName, iconId);
  };

  return (
    <Form.Item
      label={label}
      required
      style={{ marginBottom: 0 }}
    >
      <Form.Item
        name={fieldName}
        noStyle
        rules={[
          { required: true, message: "Select an icon" },
          {
            pattern: /^[a-z0-9][a-z0-9-]*:[a-z0-9][a-z0-9._-]*$/i,
            message: 'Use an Iconify id (e.g. "mdi:web")',
          },
        ]}
      >
        <Input type="hidden" />
      </Form.Item>
      <div className="iconify-picker">
        {selected ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 12,
              padding: "10px 12px",
              borderRadius: 8,
              border: "1px solid var(--ant-color-border)",
              background: "var(--ant-color-fill-quaternary)",
            }}
          >
            <Icon icon={selected} width={36} height={36} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <Typography.Text strong>Selected</Typography.Text>
              <br />
              <Typography.Text code copyable>
                {selected}
              </Typography.Text>
            </div>
            <Typography.Link type="secondary" onClick={() => form.setFieldValue(fieldName, undefined)}>
              Clear
            </Typography.Link>
          </div>
        ) : null}

        <Input.Search
          placeholder="Search Iconify icons (e.g. web, design, chart)"
          allowClear
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          loading={loading}
        />

        {error ? (
          <Typography.Text type="danger" style={{ display: "block", marginTop: 8 }}>
            {error}
          </Typography.Text>
        ) : null}

        <div
          style={{
            marginTop: 12,
            minHeight: 120,
            maxHeight: 280,
            overflowY: "auto",
            border: "1px solid var(--ant-color-border)",
            borderRadius: 8,
            padding: 8,
          }}
        >
          {loading && icons.length === 0 ? (
            <div style={{ textAlign: "center", padding: 24 }}>
              <Spin />
            </div>
          ) : icons.length === 0 ? (
            <Typography.Text type="secondary" style={{ display: "block", padding: 16, textAlign: "center" }}>
              {query.trim() ? "No icons found. Try another keyword." : "Type to search icons."}
            </Typography.Text>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(72px, 1fr))",
                gap: 8,
              }}
            >
              {icons.map((iconId) => {
                const active = selected === iconId;
                return (
                  <button
                    key={iconId}
                    type="button"
                    title={iconId}
                    onClick={() => pick(iconId)}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 4,
                      padding: "8px 4px",
                      borderRadius: 8,
                      border: active
                        ? "2px solid var(--ant-color-primary)"
                        : "1px solid var(--ant-color-border)",
                      background: active
                        ? "var(--ant-color-primary-bg)"
                        : "transparent",
                      cursor: "pointer",
                    }}
                  >
                    <Icon icon={iconId} width={28} height={28} />
                    <span
                      style={{
                        fontSize: 10,
                        lineHeight: 1.2,
                        maxWidth: "100%",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {iconId.split(":")[1]}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <Typography.Text type="secondary" style={{ display: "block", marginTop: 8, fontSize: 12 }}>
          Saved value is the Iconify id (e.g. <code>mdi:web</code>) used as{" "}
          <code>icon=</code> on the website.
        </Typography.Text>
      </div>
    </Form.Item>
  );
}
