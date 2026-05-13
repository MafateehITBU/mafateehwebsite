import {
  List,
  useTable,
  EditButton,
  DeleteButton,
} from "@refinedev/antd";
import { Table, Space } from "antd";

export const PackageList = () => {
  const { tableProps } = useTable({ resource: "packages" });
  return (
    <List>
      <Table {...tableProps} rowKey="id">
        <Table.Column dataIndex="name" title="Name" />
        <Table.Column dataIndex="shortDescription" title="Short Description" />
        <Table.Column dataIndex="price" title="Price" />
        <Table.Column dataIndex="sortOrder" title="Sort" width={80} />
        <Table.Column dataIndex="privileges" title="Privileges" render={(v: string[]) => v ? v.join(", ") : "—"} />
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
