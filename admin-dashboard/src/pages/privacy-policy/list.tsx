import { List, EditButton, useTable } from "@refinedev/antd";
import { Table, Space, Typography } from "antd";
import { stripHtmlToPlainText } from "../../lib/htmlContent";

export const PrivacyPolicyList = () => {
  const { tableProps } = useTable({ resource: "privacy_policy" });
  return (
    <List canCreate={false}>
      <Table {...tableProps} rowKey="id">
        <Table.Column
          dataIndex="content"
          title="Content preview"
          ellipsis
          render={(v: string) => {
            const plain = stripHtmlToPlainText(v ?? "");
            return (
              <Typography.Text ellipsis style={{ maxWidth: 480 }}>
                {plain.slice(0, 200)}
                {plain.length > 200 ? "…" : ""}
              </Typography.Text>
            );
          }}
        />
        <Table.Column
          title="Actions"
          render={(_, r: { id: string }) => (
            <Space>
              <EditButton hideText size="small" recordItemId={r.id} />
            </Space>
          )}
        />
      </Table>
    </List>
  );
};
