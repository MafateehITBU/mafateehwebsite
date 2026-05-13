import { useShow } from "@refinedev/core";
import { Show } from "@refinedev/antd";
import { Typography } from "antd";

const isLocalFakePath = (value: unknown): value is string =>
  typeof value === "string" &&
  (value.startsWith("C:\\fakepath\\") || value.startsWith("file:///"));

export const TestimonialShow = () => {
  const { query, result: record } = useShow<{
    name?: string;
    position?: string;
    rate?: number;
    content?: string;
    imageUrl?: string;
  }>({ resource: "testimonials" });
  return (
    <Show isLoading={query.isLoading}>
      <Typography.Paragraph>
        <strong>Name:</strong> {record?.name ?? "—"}
      </Typography.Paragraph>
      <Typography.Paragraph>
        <strong>Position:</strong> {record?.position ?? "—"}
      </Typography.Paragraph>
      <Typography.Paragraph>
        <strong>Rating:</strong> {record?.rate ?? "—"}
      </Typography.Paragraph>
      <Typography.Title level={5}>Image</Typography.Title>
      {record?.imageUrl && !isLocalFakePath(record.imageUrl) ? (
        <img
          src={record.imageUrl}
          alt="Testimonial"
          style={{ maxHeight: 140, width: "auto", objectFit: "cover", borderRadius: "50%" }}
        />
      ) : (
        <Typography.Paragraph>—</Typography.Paragraph>
      )}
      <Typography.Title level={5}>Content</Typography.Title>
      <Typography.Paragraph style={{ whiteSpace: "pre-wrap" }}>
        {record?.content ?? "—"}
      </Typography.Paragraph>
    </Show>
  );
};
