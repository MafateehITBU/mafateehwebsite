import {
  List,
  useTable,
  EditButton,
  DeleteButton,
} from "@refinedev/antd";
import { Table, Space, Tag } from "antd";

export const RoleList = () => {
  const { tableProps } = useTable({ resource: "roles" });
  return (
    <List>
      <Table {...tableProps} rowKey="id">
        <Table.Column dataIndex="name" title="Name" />
        <Table.Column dataIndex="description" title="Description" />
        <Table.Column
          dataIndex="permissions"
          title="Permissions"
          ellipsis
          render={(perms: unknown) => {
            const arr = Array.isArray(perms) ? perms : [];
            return arr.slice(0, 6).map((p: string) => (
              <Tag key={p}>{p}</Tag>
            ));
          }}
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
