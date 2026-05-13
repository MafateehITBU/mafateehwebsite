import type { PropsWithChildren, ReactNode } from "react";
import { Space, Typography } from "antd";

type PageContainerProps = PropsWithChildren<{
  title: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
  className?: string;
}>;

export const PageContainer = ({
  title,
  subtitle,
  actions,
  className,
  children,
}: PageContainerProps) => {
  return (
    <section className={`page-container ${className ?? ""}`.trim()}>
      <header className="page-container__header">
        <div>
          <Typography.Title level={3} className="page-container__title">
            {title}
          </Typography.Title>
          {subtitle ? (
            <Typography.Paragraph className="page-container__subtitle">
              {subtitle}
            </Typography.Paragraph>
          ) : null}
        </div>
        {actions ? <Space>{actions}</Space> : null}
      </header>
      <div className="page-container__body">{children}</div>
    </section>
  );
};
