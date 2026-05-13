import type { ReactNode } from "react";
import { Avatar, Card, Divider, Space, Statistic, Typography } from "antd";
import { ArrowUpOutlined } from "@ant-design/icons";

type StatCardProps = {
  title: string;
  value: number;
  icon: ReactNode;
  accent: string;
  extra: string;
};

export const StatCard = ({ title, value, icon, accent, extra }: StatCardProps) => {
  return (
    <Card className="admin-kpi-card">
      <Space align="start" style={{ width: "100%", justifyContent: "space-between" }}>
        <Statistic title={title} value={value} />
        <Avatar
          shape="square"
          size={40}
          style={{
            background: `${accent}1A`,
            color: accent,
            borderRadius: 10,
          }}
          icon={icon}
        />
      </Space>
      <Divider style={{ margin: "12px 0" }} />
      <Space size={6}>
        <ArrowUpOutlined style={{ color: "#16a34a" }} />
        <Typography.Text type="secondary">{extra}</Typography.Text>
      </Space>
    </Card>
  );
};
