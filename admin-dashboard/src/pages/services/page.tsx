import { useEffect } from "react";
import type { ReactNode } from "react";
import { usePermissions } from "@refinedev/core";
import { Tabs } from "antd";
import { useLocation, useNavigate } from "react-router";
import { ServiceList } from "./list";
import { ServiceCategoryList } from "../service-categories";
import { PageContainer } from "../../components/ui";

export const ServicesPage = () => {
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
  const canServices = hasAll || permissions.includes("services");
  const canCategories = canServices;

  const requestedCategories = location.pathname.startsWith("/services/categories");
  const activeKey = requestedCategories ? "categories" : "services";

  useEffect(() => {
    if (canCategories && !canServices && !requestedCategories) {
      navigate("/services/categories", { replace: true });
      return;
    }
    if (canServices && !canCategories && requestedCategories) {
      navigate("/services", { replace: true });
    }
  }, [canServices, canCategories, requestedCategories, navigate]);

  const items: { key: string; label: string; children: ReactNode }[] = [];
  if (canServices) {
    items.push({
      key: "services",
      label: "Services",
      children: <ServiceList />,
    });
  }
  if (canCategories) {
    items.push({
      key: "categories",
      label: "Service Categories",
      children: <ServiceCategoryList />,
    });
  }

  return (
    <PageContainer
      title="Services"
      subtitle="Manage offerings and service categories in a unified workspace."
    >
      <Tabs
        className="admin-tabs"
        activeKey={activeKey}
        onChange={(key) => {
          navigate(key === "services" ? "/services" : "/services/categories");
        }}
        items={items}
      />
    </PageContainer>
  );
};
