import { useShow } from "@refinedev/core";
import { Show } from "@refinedev/antd";
import { Descriptions, Typography } from "antd";
import type { IContact } from "../../interfaces";

export const ContactShow = () => {
  const { query, result: record } = useShow<IContact>();

  return (
    <Show isLoading={query.isLoading}>
      <Descriptions bordered column={1} size="small">
        <Descriptions.Item label="Name">{record?.name}</Descriptions.Item>
        <Descriptions.Item label="Email">{record?.email}</Descriptions.Item>
        <Descriptions.Item label="Phone">{record?.phoneNumber ?? "—"}</Descriptions.Item>
        <Descriptions.Item label="Service">{record?.service ?? "—"}</Descriptions.Item>
        <Descriptions.Item label="Status">{record?.status}</Descriptions.Item>
        <Descriptions.Item label="Received">
          {record?.createdAt
            ? new Date(record.createdAt).toLocaleString()
            : "—"}
        </Descriptions.Item>
      </Descriptions>
      <Typography.Title level={5} style={{ marginTop: 24 }}>
        Message
      </Typography.Title>
      <Typography.Paragraph style={{ whiteSpace: "pre-wrap" }}>
        {record?.inquiry}
      </Typography.Paragraph>
    </Show>
  );
};
