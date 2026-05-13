import type { PropsWithChildren, ReactNode } from "react";
import { Card, Typography } from "antd";

type FormSectionProps = PropsWithChildren<{
  title: ReactNode;
  description?: ReactNode;
  className?: string;
}>;

export const FormSection = ({
  title,
  description,
  className,
  children,
}: FormSectionProps) => {
  return (
    <Card className={`form-section ${className ?? ""}`.trim()}>
      <Typography.Title level={5} className="form-section__title">
        {title}
      </Typography.Title>
      {description ? (
        <Typography.Paragraph className="form-section__description">
          {description}
        </Typography.Paragraph>
      ) : null}
      {children}
    </Card>
  );
};
