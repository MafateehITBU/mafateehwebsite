import type { PropsWithChildren, ReactNode } from "react";
import { Empty, Space } from "antd";
import { useEffect, useRef } from "react";

type DataTableWrapperProps = PropsWithChildren<{
  actions?: ReactNode;
  className?: string;
}>;

export const DataTableWrapper = ({
  actions,
  className,
  children,
}: DataTableWrapperProps) => {
  const tableContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleSearch = (event: Event) => {
      const customEvent = event as CustomEvent<string>;
      const query = customEvent.detail ?? "";
      const rows =
        tableContainerRef.current?.querySelectorAll<HTMLTableRowElement>(
          ".ant-table-tbody > tr",
        ) ?? [];

      rows.forEach((row) => {
        if (!query) {
          row.style.display = "";
          return;
        }
        const text = row.textContent?.toLowerCase() ?? "";
        row.style.display = text.includes(query) ? "" : "none";
      });
    };

    window.addEventListener("mafateeh:table-search", handleSearch as EventListener);
    return () =>
      window.removeEventListener(
        "mafateeh:table-search",
        handleSearch as EventListener,
      );
  }, []);

  return (
    <div className={`data-table-wrapper ${className ?? ""}`.trim()}>
      {actions ? <Space className="data-table-wrapper__actions">{actions}</Space> : null}
      <div className="data-table-wrapper__table" ref={tableContainerRef}>
        {children}
      </div>
    </div>
  );
};

export const TableEmptyState = ({
  title = "No data yet",
  description = "Content will appear here once records are created.",
}: {
  title?: string;
  description?: string;
}) => (
  <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={<span>{title}</span>}>
    <span className="table-empty-state__hint">{description}</span>
  </Empty>
);
