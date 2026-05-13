import type { ReactNode } from "react";
import { Button, Empty, Space, Typography } from "antd";

type EmptyStateProps = {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: ReactNode;
};

export const EmptyState = ({
  title,
  description,
  actionLabel,
  onAction,
  icon,
}: EmptyStateProps) => {
  return (
    <div className="admin-empty-state">
      <Empty image={icon ?? Empty.PRESENTED_IMAGE_SIMPLE}>
        <Space direction="vertical" size={4}>
          <Typography.Text strong>{title}</Typography.Text>
          {description ? <Typography.Text type="secondary">{description}</Typography.Text> : null}
          {actionLabel && onAction ? (
            <Button type="primary" onClick={onAction}>
              {actionLabel}
            </Button>
          ) : null}
        </Space>
      </Empty>
    </div>
  );
};
