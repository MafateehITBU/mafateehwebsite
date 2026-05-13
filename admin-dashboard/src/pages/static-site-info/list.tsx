import { List, EditButton, useTable } from "@refinedev/antd";
import { Table, Space } from "antd";
import { DataTableWrapper, TableEmptyState } from "../../components/ui";

const isLocalFakePath = (value: unknown): value is string =>
  typeof value === "string" &&
  (value.startsWith("C:\\fakepath\\") || value.startsWith("file:///"));

export const StaticSiteInfoList = () => {
  const { tableProps } = useTable({ resource: "static_site_info" });
  return (
    <List canCreate={false}>
      <DataTableWrapper>
        <Table
          {...tableProps}
          rowKey="id"
          locale={{ emptyText: <TableEmptyState title="No static site info found" /> }}
          scroll={{ x: 1100 }}
        >
          <Table.Column
            dataIndex="logoUrl"
            title="Logo"
            render={(v: string | null) =>
              v && !isLocalFakePath(v) ? (
                <img
                  src={v}
                  alt="Logo"
                  style={{ width: 48, height: 48, objectFit: "contain" }}
                />
              ) : (
                "-"
              )
            }
          />
          <Table.Column dataIndex="email" title="Email" ellipsis />
          <Table.Column dataIndex="phoneNumber" title="Phone" />
          <Table.Column dataIndex="address" title="Address" ellipsis />
          <Table.Column dataIndex="businessHours" title="Business Hours" ellipsis />
          <Table.Column dataIndex="socialInstagram" title="Instagram" ellipsis />
          <Table.Column dataIndex="socialFacebook" title="Facebook" ellipsis />
          <Table.Column dataIndex="socialLinkedin" title="LinkedIn" ellipsis />
          <Table.Column dataIndex="socialYoutube" title="YouTube" ellipsis />
          <Table.Column
            title="Actions"
            render={(_, r: { id: string }) => (
              <Space>
                <EditButton hideText size="small" recordItemId={r.id} />
              </Space>
            )}
          />
        </Table>
      </DataTableWrapper>
    </List>
  );
};
