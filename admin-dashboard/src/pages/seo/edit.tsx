import { Edit, useForm } from "@refinedev/antd";
import { Form, Input, Typography } from "antd";
import { ImageUploadField } from "../../components/ImageUploadField";
import { MultilineTextArea } from "../../components/MultilineTextArea";

/** Extracts AW-/G-/GT-/UA- IDs from a pasted gtag snippet, or returns trimmed ID. */
function normalizeGoogleTagId(value: unknown): string | undefined {
  if (value == null) return undefined;
  const raw = String(value).trim();
  if (!raw) return undefined;
  if (/^(AW|G|GT|UA)-[\w-]+$/i.test(raw)) return raw;
  const match = raw.match(/\b((?:AW|G|GT|UA)-[\w-]+)\b/i);
  return match ? match[1] : raw.slice(0, 200);
}

export const SeoEdit = () => {
  const { formProps, saveButtonProps, query, form } = useForm({ resource: "seo" });

  return (
    <Edit saveButtonProps={saveButtonProps} isLoading={query?.isLoading ?? false}>
      <Form
        {...formProps}
        layout="vertical"
        onFinish={(values) => {
          const next = {
            ...values,
            googleTagId: normalizeGoogleTagId(values.googleTagId) ?? null,
          };
          return formProps.onFinish?.(next);
        }}
      >
        <Form.Item
          label="Google Tag ID"
          name="googleTagId"
          extra={
            <Typography.Text type="secondary">
              Paste only the ID (e.g. <code>AW-17883232925</code>) or the full gtag.js
              snippet — the ID will be extracted automatically and injected on the public
              website.
            </Typography.Text>
          }
        >
          <Input placeholder="AW-17883232925" allowClear />
        </Form.Item>
        <Form.Item label="Meta title" name="metaTitle">
          <Input placeholder="Mafateeh — IT & Digital Solutions" />
        </Form.Item>
        <Form.Item label="Meta description" name="metaDescription">
          <MultilineTextArea rows={3} />
        </Form.Item>
        <Form.Item label="Meta keywords" name="metaKeywords">
          <Input placeholder="IT, digital marketing, branding" />
        </Form.Item>
        <ImageUploadField
          form={form}
          fieldName="ogImageUrl"
          label="OG image"
          folder="seo"
        />
      </Form>
    </Edit>
  );
};
