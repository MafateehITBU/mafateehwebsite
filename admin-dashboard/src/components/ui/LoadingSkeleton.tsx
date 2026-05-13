import { Skeleton, Space } from "antd";

export const LoadingSkeleton = () => {
  return (
    <div className="loading-skeleton">
      <Space direction="vertical" style={{ width: "100%" }} size={16}>
        <Skeleton active paragraph={{ rows: 1 }} />
        <Skeleton active paragraph={{ rows: 4 }} />
      </Space>
    </div>
  );
};
