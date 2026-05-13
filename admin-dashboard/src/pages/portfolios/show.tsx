import { useShow } from "@refinedev/core";
import { Show } from "@refinedev/antd";
import { Tag, Typography } from "antd";

const isLocalFakePath = (value: unknown): value is string =>
  typeof value === "string" &&
  (value.startsWith("C:\\fakepath\\") || value.startsWith("file:///"));

export const PortfolioShow = () => {
  const { query, result: record } = useShow<{
    title?: string;
    category?: { name?: string };
    shortDescription?: string;
    featuredImageUrl?: string;
    link?: string;
    tags?: { tag?: { name?: string } }[];
  }>({ resource: "portfolios" });
  return (
    <Show isLoading={query.isLoading}>
      <Typography.Paragraph>
        <strong>Title:</strong> {record?.title ?? "—"}
      </Typography.Paragraph>
      <Typography.Paragraph>
        <strong>Category:</strong> {record?.category?.name ?? "—"}
      </Typography.Paragraph>
      <Typography.Paragraph>
        <strong>Link:</strong> {record?.link ?? "—"}
      </Typography.Paragraph>
      <Typography.Title level={5}>Featured Image</Typography.Title>
      {record?.featuredImageUrl && !isLocalFakePath(record.featuredImageUrl) ? (
        <img
          src={record.featuredImageUrl}
          alt="Portfolio featured"
          style={{ maxHeight: 180, width: "auto", objectFit: "cover", borderRadius: 8 }}
        />
      ) : (
        <Typography.Paragraph>—</Typography.Paragraph>
      )}
      <Typography.Title level={5}>Tags</Typography.Title>
      <Typography.Paragraph>
        {record?.tags?.length
          ? record.tags.map((t, i) => (
              <Tag key={i}>{t.tag?.name ?? "—"}</Tag>
            ))
          : "—"}
      </Typography.Paragraph>
      <Typography.Title level={5}>Description</Typography.Title>
      <Typography.Paragraph style={{ whiteSpace: "pre-wrap" }}>
        {record?.shortDescription ?? "—"}
      </Typography.Paragraph>
    </Show>
  );
};
