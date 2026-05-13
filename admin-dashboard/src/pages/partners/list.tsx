import {
  List,
  useTable,
  EditButton,
  DeleteButton,
} from "@refinedev/antd";
import { Table, Space } from "antd";

const isLocalFakePath = (value: unknown): value is string =>
  typeof value === "string" &&
  (value.startsWith("C:\\fakepath\\") || value.startsWith("file:///"));

export const PartnerList = () => {
  const { tableProps } = useTable({ resource: "partners" });
  return (
    <List>
      <Table {...tableProps} rowKey="id">
        <Table.Column
          dataIndex="logoUrl"
          title="Logo"
          render={(v: string | null) =>
            v && !isLocalFakePath(v) ? (
              <img
                src={v}
                alt="Partner logo"
                style={{ width: 48, height: 48, objectFit: "contain" }}
              />
            ) : (
              "-"
            )
          }
        />
        <Table.Column dataIndex="name" title="Name" />
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
