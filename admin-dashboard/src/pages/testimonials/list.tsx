import {
  List,
  useTable,
  EditButton,
  ShowButton,
  DeleteButton,
} from "@refinedev/antd";
import { Table, Space } from "antd";
import { StarFilled } from "@ant-design/icons";

const isLocalFakePath = (value: unknown): value is string =>
  typeof value === "string" &&
  (value.startsWith("C:\\fakepath\\") || value.startsWith("file:///"));

export const TestimonialList = () => {
  const { tableProps } = useTable({ resource: "testimonials" });
  return (
    <List>
      <Table {...tableProps} rowKey="id">
        <Table.Column
          dataIndex="imageUrl"
          title="Image"
          render={(v: string | null) =>
            v && !isLocalFakePath(v) ? (
              <img
                src={v}
                alt="Testimonial"
                style={{ width: 48, height: 48, objectFit: "cover", borderRadius: "50%" }}
              />
            ) : (
              "-"
            )
          }
        />
        <Table.Column dataIndex="name" title="Name" />
        <Table.Column dataIndex="position" title="Position" />
        {/* Make the rating a star icon */}
        <Table.Column dataIndex="rate" title="Rating" render={(v: number) => v ? Array.from({ length: v }, (_, i) => <StarFilled key={i} style={{ color: "#ffd700" }} />) : "—"} />
        <Table.Column dataIndex="content" title="Content" render={(v: string) => v ? v.substring(0, 30) + "..." : "—"} />
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
