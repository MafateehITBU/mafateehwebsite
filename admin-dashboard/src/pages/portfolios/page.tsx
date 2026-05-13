import { useEffect } from "react";
import type { ReactNode } from "react";
import { usePermissions } from "@refinedev/core";
import { Tabs } from "antd";
import { useLocation, useNavigate } from "react-router";
import { PortfolioList } from "./list";
import { PortfolioCategoryList } from "../portfolio-categories";
import { PageContainer } from "../../components/ui";

export const PortfoliosPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { data: permissionsData } = usePermissions<string[] | string>({});
  const permissions = Array.isArray(permissionsData)
    ? permissionsData
    : typeof permissionsData === "string"
      ? (() => {
          try {
            const parsed = JSON.parse(permissionsData) as unknown;
            return Array.isArray(parsed)
              ? parsed.filter((p): p is string => typeof p === "string")
              : [];
          } catch {
            return [];
          }
        })()
      : [];
  const hasAll = permissions.includes("*");
  const canPortfolios = hasAll || permissions.includes("portfolios");
  const canCategories = canPortfolios;

  const requestedCategories = location.pathname.startsWith("/portfolios/categories");
  const activeKey = requestedCategories ? "categories" : "portfolios";

  useEffect(() => {
    if (canCategories && !canPortfolios && !requestedCategories) {
      navigate("/portfolios/categories", { replace: true });
      return;
    }
    if (canPortfolios && !canCategories && requestedCategories) {
      navigate("/portfolios", { replace: true });
    }
  }, [canPortfolios, canCategories, requestedCategories, navigate]);

  const items: { key: string; label: string; children: ReactNode }[] = [];
  if (canPortfolios) {
    items.push({
      key: "portfolios",
      label: "Portfolios",
      children: <PortfolioList />,
    });
  }
  if (canCategories) {
    items.push({
      key: "categories",
      label: "Portfolio Categories",
      children: <PortfolioCategoryList />,
    });
  }

  return (
    <PageContainer
      title="Portfolios"
      subtitle="Organize projects and categories with polished content management."
    >
      <Tabs
        className="admin-tabs"
        activeKey={activeKey}
        onChange={(key) => {
          navigate(key === "portfolios" ? "/portfolios" : "/portfolios/categories");
        }}
        items={items}
      />
    </PageContainer>
  );
};
