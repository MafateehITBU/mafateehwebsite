import type { ReactNode } from "react";
import { Modal, Typography } from "antd";

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description?: ReactNode;
  okText?: string;
  cancelText?: string;
  confirmLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export const ConfirmDialog = ({
  open,
  title,
  description,
  okText = "Confirm",
  cancelText = "Cancel",
  confirmLoading,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) => {
  return (
    <Modal
      open={open}
      title={title}
      okText={okText}
      cancelText={cancelText}
      onOk={onConfirm}
      onCancel={onCancel}
      confirmLoading={confirmLoading}
      centered
    >
      {description ? <Typography.Paragraph>{description}</Typography.Paragraph> : null}
    </Modal>
  );
};
