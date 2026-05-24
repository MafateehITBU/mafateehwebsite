import {
  List,
  useTable,
  EditButton,
  DeleteButton,
} from "@refinedev/antd";
import { Icon } from "@iconify/react";
import { Table, Space, Typography } from "antd";
import { DataTableWrapper, TableEmptyState } from "../../components/ui";

const isIconifyId = (value: unknown): value is string =>
  typeof value === "string" && /^[a-z0-9][a-z0-9-]*:[a-z0-9][a-z0-9._-]*$/i.test(value);

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
            dataIndex="icon"
            title="Icon"
            width={100}
            render={(v: string | null) =>
              isIconifyId(v) ? (
                <Space direction="vertical" size={0} align="center">
                  <Icon icon={v} width={32} height={32} />
                  <Typography.Text code style={{ fontSize: 10 }}>
                    {v}
                  </Typography.Text>
                </Space>
              ) : (
                "—"
              )
            }
          />
          <Table.Column dataIndex="title" title="Title" />
          <Table.Column
            dataIndex={["category", "name"]}
            title="Category"
            render={(_, row: { category?: { name?: string } }) => row.category?.name ?? "—"}
          />
          <Table.Column dataIndex="description" title="Description" />
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
