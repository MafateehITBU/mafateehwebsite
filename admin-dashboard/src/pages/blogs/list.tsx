import {
  List,
  useTable,
  EditButton,
  ShowButton,
  DeleteButton,
} from "@refinedev/antd";
import { Table, Space, Tag } from "antd";
import { DataTableWrapper, TableEmptyState } from "../../components/ui";

const isLocalFakePath = (value: unknown): value is string =>
  typeof value === "string" &&
  (value.startsWith("C:\\fakepath\\") || value.startsWith("file:///"));

export const BlogList = () => {
  const { tableProps } = useTable({ resource: "blogs" });
  return (
    <List>
      <DataTableWrapper>
        <Table
          {...tableProps}
          rowKey="id"
          pagination={{
            ...tableProps.pagination,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50"],
          }}
          locale={{ emptyText: <TableEmptyState title="No blog posts found" /> }}
          scroll={{ x: 900 }}
        >
          <Table.Column
            dataIndex="featuredImageUrl"
            title="Image"
            render={(v: string | null) =>
              v && !isLocalFakePath(v) ? (
                <img
                  src={v}
                  alt="Featured"
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
          <Table.Column
            dataIndex="published"
            title="Published"
            render={(v: boolean) => (v ? <Tag color="green">Yes</Tag> : <Tag>No</Tag>)}
          />
          <Table.Column
            dataIndex="createdAt"
            title="Created"
            width={200}
            render={(v: string) =>
              v
                ? new Date(v).toLocaleString([], {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })
                : "—"
            }
          />
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
      </DataTableWrapper>
    </List>
  );
};
