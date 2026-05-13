import { useEffect } from "react";
import type { ReactNode } from "react";
import { usePermissions } from "@refinedev/core";
import { Tabs } from "antd";
import { useLocation, useNavigate } from "react-router";
import { BlogList } from "./list";
import { BlogCategoryList } from "../blog-categories";
import { PageContainer } from "../../components/ui";

export const BlogsPage = () => {
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
  const canBlogs = hasAll || permissions.includes("blogs");
  const canCategories = canBlogs;

  const requestedCategories = location.pathname.startsWith("/blogs/categories");
  const activeKey = requestedCategories ? "categories" : "blogs";

  useEffect(() => {
    if (canCategories && !canBlogs && !requestedCategories) {
      navigate("/blogs/categories", { replace: true });
      return;
    }
    if (canBlogs && !canCategories && requestedCategories) {
      navigate("/blogs", { replace: true });
    }
  }, [canBlogs, canCategories, requestedCategories, navigate]);

  const items: { key: string; label: string; children: ReactNode }[] = [];
  if (canBlogs) {
    items.push({
      key: "blogs",
      label: "Blogs",
      children: <BlogList />,
    });
  }
  if (canCategories) {
    items.push({
      key: "categories",
      label: "Blog Categories",
      children: <BlogCategoryList />,
    });
  }

  return (
    <PageContainer
      title="Blogs"
      subtitle="Manage content publishing, categories, and visibility in one place."
    >
      <Tabs
        className="admin-tabs"
        activeKey={activeKey}
        onChange={(key) => {
          navigate(key === "blogs" ? "/blogs" : "/blogs/categories");
        }}
        items={items}
      />
    </PageContainer>
  );
};
