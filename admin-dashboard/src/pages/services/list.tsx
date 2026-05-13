import {
  List,
  useTable,
  EditButton,
  DeleteButton,
} from "@refinedev/antd";
import { Table, Space } from "antd";
import { DataTableWrapper, TableEmptyState } from "../../components/ui";

const isLocalFakePath = (value: unknown): value is string =>
  typeof value === "string" &&
  (value.startsWith("C:\\fakepath\\") || value.startsWith("file:///"));

export const ServiceList = () => {
  const { tableProps } = useTable({ resource: "services" });
  return (
    <List>
      <DataTableWrapper>
        <Table
          {...tableProps}
          rowKey="id"
          locale={{ emptyText: <TableEmptyState title="No services available" /> }}
          scroll={{ x: 860 }}
        >
          <Table.Column
            dataIndex="iconUrl"
            title="Icon"
            render={(v: string | null) =>
              v && !isLocalFakePath(v) ? (
                <img
                  src={v}
                  alt="Icon"
                  style={{ width: 40, height: 40, objectFit: "contain" }}
                />
              ) : (
                "-"
              )
            }
          />
          <Table.Column dataIndex="title" title="Title" />
          <Table.Column
            dataIndex={["category", "name"]}
            title="Category"
            render={(_, row: { category?: { name?: string } }) => row.category?.name ?? "—"}
          />
          <Table.Column dataIndex="description" title="Description"/>
          <Table.Column
            title="Actions"
            render={(_, r: { id: string }) => (
              <Space>
                <EditButton hideText size="small" recordItemId={r.id} />
                <DeleteButton hideText size="small" recordItemId={r.id} />
              </Space>
            )}
          />
        </Table>
      </DataTableWrapper>
    </List>
  );
};
