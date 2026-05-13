import {
  List,
  TextField,
  EditButton,
  ShowButton,
  FilterDropdown,
  useTable,
} from "@refinedev/antd";
import { Table, Space, Radio } from "antd";
import type { IContact, ContactStatus } from "../../interfaces";
import { DataTableWrapper, TableEmptyState } from "../../components/ui";

export const ContactList = () => {
  const { tableProps } = useTable<IContact>({
    syncWithLocation: true,
  });

  return (
    <List canCreate={false}>
      <DataTableWrapper>
        <Table
          {...tableProps}
          rowKey="id"
          locale={{ emptyText: <TableEmptyState title="No contact messages yet" /> }}
          scroll={{ x: 960 }}
        >
          <Table.Column
            dataIndex="createdAt"
            title="Received"
            width={200}
            render={(v: string) => (v ? new Date(v).toLocaleString() : "—")}
          />
          <Table.Column dataIndex="name" title="Name" />
          <Table.Column dataIndex="email" title="Email" />
          <Table.Column dataIndex="phoneNumber" title="Phone" />
          <Table.Column dataIndex="service" title="Service" />
          <Table.Column
            dataIndex="status"
            title="Status"
            render={(value: ContactStatus) => <TextField value={value} />}
            filterDropdown={(props) => (
              <FilterDropdown {...props}>
                <Radio.Group>
                  <Radio value="NEW">New</Radio>
                  <Radio value="READ">Read</Radio>
                  <Radio value="ARCHIVED">Archived</Radio>
                </Radio.Group>
              </FilterDropdown>
            )}
          />
          <Table.Column<IContact>
            title="Actions"
            fixed="right"
            render={(_, record) => (
              <Space>
                <ShowButton hideText size="small" recordItemId={record.id} />
                <EditButton hideText size="small" recordItemId={record.id} />
              </Space>
            )}
          />
        </Table>
      </DataTableWrapper>
    </List>
  );
};
