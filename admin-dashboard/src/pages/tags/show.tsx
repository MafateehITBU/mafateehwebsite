import { useShow } from "@refinedev/core";
import { Show } from "@refinedev/antd";
import { Typography } from "antd";

export const TagShow = () => {
  const { query, result: record } = useShow<{ name?: string; slug?: string }>({
    resource: "tags",
  });
  return (
    <Show isLoading={query.isLoading}>
      <Typography.Paragraph>
        <strong>Name:</strong> {record?.name ?? "—"}
      </Typography.Paragraph>
      <Typography.Paragraph>
        <strong>Slug:</strong> {record?.slug ?? "—"}
      </Typography.Paragraph>
    </Show>
  );
};
