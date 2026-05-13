import { Button, Form, Input, Space, Upload } from "antd";
import type { FormInstance } from "antd";
import { getToken } from "../providers/authProvider";
import { notify } from "../lib/notify";

type Props = {
  form: FormInstance;
  fieldName: string;
  label: string;
  folder: string;
  buttonText?: string;
};

const isLocalFakePath = (value: unknown): value is string =>
  typeof value === "string" &&
  (value.startsWith("C:\\fakepath\\") || value.startsWith("file:///"));

export const ImageUploadField = ({
  form,
  fieldName,
  label,
  folder,
  buttonText = "Upload Image",
}: Props) => {
  const value = Form.useWatch(fieldName, form);

  const upload = async (file: File) => {
    const token = getToken();
    if (!token) {
      notify.error("Missing auth token");
      return;
    }
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch(`/api/admin/upload?folder=${encodeURIComponent(folder)}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      const text = await res.text();
      if (!res.ok) throw new Error(text || "Image upload failed");
      const body = JSON.parse(text) as { url: string };
      form.setFieldValue(fieldName, body.url);
      notify.success("Image uploaded");
    } catch (e) {
      const err = e instanceof Error ? e.message : "Image upload failed";
      notify.error(err);
    }
  };

  const imageUrl = isLocalFakePath(value) ? null : (value as string | null);

  return (
    <>
      <Form.Item label={label}>
        <Space direction="vertical" style={{ width: "100%" }}>
          <Upload
            accept="image/*"
            maxCount={1}
            showUploadList={false}
            beforeUpload={(file) => {
              void upload(file);
              return Upload.LIST_IGNORE;
            }}
          >
            <Button>{buttonText}</Button>
          </Upload>
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={fieldName}
              style={{ maxHeight: 120, width: "auto", objectFit: "contain" }}
            />
          ) : null}
        </Space>
      </Form.Item>
      <Form.Item name={fieldName} hidden>
        <Input />
      </Form.Item>
    </>
  );
};
