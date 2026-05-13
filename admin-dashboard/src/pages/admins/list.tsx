import {
  List,
  useTable,
  EditButton,
  DeleteButton,
} from "@refinedev/antd";
import { Table, Space, Tag } from "antd";

export const AdminList = () => {
  const { tableProps } = useTable({ resource: "admins" });
  return (
    <List>
      <Table {...tableProps} rowKey="id">
        <Table.Column dataIndex="email" title="Email" />
        <Table.Column dataIndex="name" title="Name" />
        <Table.Column
          dataIndex="isActive"
          title="Active"
          render={(v: boolean) => (v ? <Tag color="green">Yes</Tag> : <Tag>No</Tag>)}
        />
        <Table.Column
          dataIndex={["role", "name"]}
          title="Role"
          render={(_, row: { role?: { name?: string } }) => row.role?.name ?? "—"}
        />
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
    </List>
  );
};
