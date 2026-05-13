import { List, EditButton, useTable } from "@refinedev/antd";
import { Table, Space } from "antd";

const isLocalFakePath = (value: unknown): value is string =>
  typeof value === "string" &&
  (value.startsWith("C:\\fakepath\\") || value.startsWith("file:///"));

export const SeoList = () => {
  const { tableProps } = useTable({ resource: "seo" });
  return (
    <List canCreate={false}>
      <Table {...tableProps} rowKey="id">
        <Table.Column
          dataIndex="ogImageUrl"
          title="OG Image"
          render={(v: string | null) =>
            v && !isLocalFakePath(v) ? (
              <img
                src={v}
                alt="OG"
                style={{ width: 48, height: 48, objectFit: "cover", borderRadius: 6 }}
              />
            ) : (
              "-"
            )
          }
        />
        <Table.Column dataIndex="metaTitle" title="Meta title" ellipsis />
        <Table.Column dataIndex="googleTagId" title="Google Tag ID" />
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
