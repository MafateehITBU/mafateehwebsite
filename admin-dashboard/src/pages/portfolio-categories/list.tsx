import {
  List,
  useTable,
  EditButton,
  DeleteButton,
} from "@refinedev/antd";
import { Table, Space } from "antd";

export const PortfolioCategoryList = () => {
  const { tableProps } = useTable({ resource: "portfolio_categories" });
  return (
    <List>
      <Table {...tableProps} rowKey="id">
        <Table.Column dataIndex="name" title="Name" />
        <Table.Column dataIndex="slug" title="Slug" />
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
