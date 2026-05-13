import {
  List,
  useTable,
  EditButton,
  ShowButton,
  DeleteButton,
} from "@refinedev/antd";
import { Table, Space } from "antd";

const isLocalFakePath = (value: unknown): value is string =>
  typeof value === "string" &&
  (value.startsWith("C:\\fakepath\\") || value.startsWith("file:///"));

export const PortfolioList = () => {
  const { tableProps } = useTable({ resource: "portfolios" });
  return (
    <List>
      <Table {...tableProps} rowKey="id">
        <Table.Column
          dataIndex="featuredImageUrl"
          title="Image"
          render={(v: string | null) =>
            v && !isLocalFakePath(v) ? (
              <img
                src={v}
                alt="Portfolio"
                style={{ width: 48, height: 48, objectFit: "cover", borderRadius: 6 }}
              />
            ) : (
              "-"
            )
          }
        />
        <Table.Column dataIndex="title" title="Title" ellipsis />
        <Table.Column
          dataIndex={["category", "name"]}
          title="Category"
          render={(_, row: { category?: { name?: string } }) => row.category?.name ?? "—"}
        />
        <Table.Column dataIndex="shortDescription" title="Short Description" render={(v: string) => v ? v.substring(0, 50) + "..." : "—"} />
        <Table.Column dataIndex="createdAt" title="Created" width={180} render={(v: string) => v ? new Date(v).toLocaleString([], { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" }) : "—"} />
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
