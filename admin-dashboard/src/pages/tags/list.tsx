import {
  List,
  useTable,
  EditButton,
  ShowButton,
  DeleteButton,
} from "@refinedev/antd";
import { Table, Space } from "antd";

export const TagList = () => {
  const { tableProps } = useTable({ resource: "tags" });
  return (
    <List>
      <Table {...tableProps} rowKey="id">
        <Table.Column dataIndex="name" title="Name" />
        <Table.Column dataIndex="slug" title="Slug" />
        <Table.Column
          title="Actions"
          render={(_, r: { id: string }) => (
            <Space>
              <ShowButton hideText size="small" recordItemId={r.id} />
              <EditButton hideText size="small" recordItemId={r.id} />
              <DeleteButton hideText size="small" recordItemId={r.id} />
            </Space>
          )}
        />
      </Table>
    </List>
  );
};
