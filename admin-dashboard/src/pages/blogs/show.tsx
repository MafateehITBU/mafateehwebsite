import { useShow } from "@refinedev/core";
import { Show } from "@refinedev/antd";
import { Descriptions, Tag, Typography } from "antd";
import { FormSection } from "../../components/ui";

const isLocalFakePath = (value: unknown): value is string =>
  typeof value === "string" &&
  (value.startsWith("C:\\fakepath\\") || value.startsWith("file:///"));

export const BlogShow = () => {
  const { query, result: record } = useShow<{
    title?: string;
    category?: { name?: string };
    published?: boolean;
    content?: string;
    featuredImageUrl?: string;
    tags?: { tag?: { name?: string } }[];
  }>({ resource: "blogs" });
  return (
    <Show isLoading={query.isLoading}>
      <FormSection title="Blog Details">
        <Descriptions bordered size="middle" column={1}>
          <Descriptions.Item label="Title">{record?.title ?? "—"}</Descriptions.Item>
          <Descriptions.Item label="Category">{record?.category?.name ?? "—"}</Descriptions.Item>
          <Descriptions.Item label="Published">
            {record?.published ? "Yes" : "No"}
          </Descriptions.Item>
          <Descriptions.Item label="Featured Image">
            {record?.featuredImageUrl && !isLocalFakePath(record.featuredImageUrl) ? (
              <img
                src={record.featuredImageUrl}
                alt="Featured"
                style={{ maxHeight: 180, width: "auto", objectFit: "cover", borderRadius: 8 }}
              />
            ) : (
              "—"
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Tags">
            {record?.tags?.length
              ? record.tags.map((t, i) => <Tag key={i}>{t.tag?.name ?? "—"}</Tag>)
              : "—"}
          </Descriptions.Item>
          <Descriptions.Item label="Content">
            <Typography.Paragraph style={{ whiteSpace: "pre-wrap", marginBottom: 0 }}>
              {record?.content ?? "—"}
            </Typography.Paragraph>
          </Descriptions.Item>
        </Descriptions>
      </FormSection>
    </Show>
  );
};
