import { Refine, useCan, useIsAuthenticated } from "@refinedev/core";
import type { ReactNode } from "react";
import {
  ErrorComponent,
  RefineThemes,
  useNotificationProvider,
} from "@refinedev/antd";
import routerProvider, { DocumentTitleHandler } from "@refinedev/react-router";
import {
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  Outlet,
  Navigate,
} from "react-router";
import { UnsavedChangesGuard } from "./components/UnsavedChangesGuard";
import { ConfigProvider, App as AntdApp } from "antd";
import "@ant-design/v5-patch-for-react-19";
import "@refinedev/antd/dist/reset.css";
import "./styles/admin-modern.css";

import { authProvider } from "./providers/authProvider";
import { accessControlProvider } from "./providers/accessControlProvider";
import { dataProvider } from "./providers/dataProvider";
import { DashboardPage } from "./pages/dashboard";
import { LoginPage } from "./pages/login";
import { ContactList, ContactShow, ContactEdit } from "./pages/contacts";
import { StaticSiteInfoList, StaticSiteInfoEdit } from "./pages/static-site-info";
import { PrivacyPolicyList, PrivacyPolicyEdit } from "./pages/privacy-policy";
import { SeoList, SeoEdit } from "./pages/seo";
import {
  BlogCategoryCreate,
  BlogCategoryEdit,
} from "./pages/blog-categories";
import {
  BlogsPage,
  BlogCreate,
  BlogEdit,
  BlogShow,
} from "./pages/blogs";
import {
  PartnerList,
  PartnerCreate,
  PartnerEdit,
} from "./pages/partners";
import {
  PortfolioCategoryCreate,
  PortfolioCategoryEdit,
} from "./pages/portfolio-categories";
import {
  PortfoliosPage,
  PortfolioCreate,
  PortfolioEdit,
  PortfolioShow,
} from "./pages/portfolios";
import {
  TestimonialList,
  TestimonialCreate,
  TestimonialEdit,
  TestimonialShow,
} from "./pages/testimonials";
import {
  ServiceCategoryCreate,
  ServiceCategoryEdit,
} from "./pages/service-categories";
import {
  ServicesPage,
  ServiceCreate,
  ServiceEdit,
} from "./pages/services";
import {
  PackageList,
  PackageCreate,
  PackageEdit,
} from "./pages/packages";
import {
  RoleList,
  RoleCreate,
  RoleEdit,
} from "./pages/roles";
import {
  AdminList,
  AdminCreate,
  AdminEdit,
} from "./pages/admins";
import { AppShell, LoadingSkeleton, ToastProvider } from "./components/ui";
import { UnauthorizedPage } from "./pages/unauthorized";

const AuthenticatedShell = () => {
  const { data, isLoading, isFetching } = useIsAuthenticated();
  if (isLoading || isFetching) {
    return <LoadingSkeleton />;
  }
  if (!data?.authenticated) {
    return <Navigate to="/login" replace />;
  }
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
};

const ProtectedRoute = ({
  resource,
  action,
  children,
}: {
  resource: string;
  action: "list" | "create" | "edit" | "show";
  children: ReactNode;
}) => {
  const { data, isLoading, isFetching } = useCan({ resource, action });

  if (isLoading || isFetching) {
    return <LoadingSkeleton />;
  }

  if (!data?.can) {
    return <UnauthorizedPage />;
  }

  return <>{children}</>;
};

const resources = [
  { name: "dashboard", list: "/", meta: { label: "Dashboard" } },
  {
    name: "static_site_info",
    list: "/static-site-info",
    edit: "/static-site-info/edit/:id",
    meta: { label: "Static site", canDelete: false },
  },
  {
    name: "privacy_policy",
    list: "/privacy-policy",
    edit: "/privacy-policy/edit/:id",
    meta: { label: "Privacy policy", canDelete: false },
  },
  {
    name: "seo",
    list: "/seo",
    edit: "/seo/edit/:id",
    meta: { label: "SEO", canDelete: false },
  },
  {
    name: "blog_categories",
    list: "/blogs/categories",
    create: "/blogs/categories/create",
    edit: "/blogs/categories/edit/:id",
    meta: { label: "Blog categories", canDelete: true, hide: true },
  },
  {
    name: "blogs",
    list: "/blogs",
    create: "/blogs/create",
    edit: "/blogs/edit/:id",
    show: "/blogs/show/:id",
    meta: { label: "Blogs", canDelete: true },
  },
  {
    name: "partners",
    list: "/partners",
    create: "/partners/create",
    edit: "/partners/edit/:id",
    meta: { label: "Partners", canDelete: true },
  },
  {
    name: "portfolio_categories",
    list: "/portfolios/categories",
    create: "/portfolios/categories/create",
    edit: "/portfolios/categories/edit/:id",
    meta: { label: "Portfolio categories", canDelete: true, hide: true },
  },
  {
    name: "portfolios",
    list: "/portfolios",
    create: "/portfolios/create",
    edit: "/portfolios/edit/:id",
    show: "/portfolios/show/:id",
    meta: { label: "Portfolios", canDelete: true },
  },
  {
    name: "testimonials",
    list: "/testimonials",
    create: "/testimonials/create",
    edit: "/testimonials/edit/:id",
    show: "/testimonials/show/:id",
    meta: { label: "Testimonials", canDelete: true },
  },
  {
    name: "service_categories",
    list: "/services/categories",
    create: "/services/categories/create",
    edit: "/services/categories/edit/:id",
    meta: { label: "Service categories", canDelete: true, hide: true },
  },
  {
    name: "services",
    list: "/services",
    create: "/services/create",
    edit: "/services/edit/:id",
    meta: { label: "Services", canDelete: true },
  },
  {
    name: "packages",
    list: "/packages",
    create: "/packages/create",
    edit: "/packages/edit/:id",
    meta: { label: "Packages", canDelete: true },
  },
  {
    name: "contacts",
    list: "/contacts",
    edit: "/contacts/edit/:id",
    show: "/contacts/show/:id",
    meta: { label: "Contacts", canDelete: true },
  },
  {
    name: "roles",
    list: "/roles",
    create: "/roles/create",
    edit: "/roles/edit/:id",
    meta: { label: "Roles", canDelete: true },
  },
  {
    name: "admins",
    list: "/admins",
    create: "/admins/create",
    edit: "/admins/edit/:id",
    meta: { label: "Admins", canDelete: true },
  },
];

function RefineLayout() {
  return (
    <ConfigProvider
        theme={{
          ...RefineThemes.Blue,
          token: {
            ...RefineThemes.Blue.token,
            colorPrimary: "#00502E",
            colorInfo: "#00502E",
            borderRadius: 12,
            colorBgLayout: "#f6f8fc",
            colorBgContainer: "#ffffff",
            colorBorderSecondary: "#e6ebf5",
            controlHeight: 40,
          },
          components: {
            ...RefineThemes.Blue.components,
            Card: { borderRadiusLG: 14 },
            Table: {
              borderColor: "#e0e0e0",
              headerBg: "#00502E",
              headerColor: "#ffffff",
            },
            Layout: { siderBg: "#0f172a", bodyBg: "#f6f8fc" },
            Menu: {
              darkItemBg: "#0f172a",
              darkItemSelectedBg: "#1d4ed8",
              darkItemHoverBg: "#1e293b",
            },
          },
        }}
      >
        <AntdApp>
          <ToastProvider />
          <Refine
            routerProvider={routerProvider}
            dataProvider={dataProvider}
            authProvider={authProvider}
            accessControlProvider={accessControlProvider}
            notificationProvider={useNotificationProvider}
            resources={resources}
            options={{
              syncWithLocation: true,
              warnWhenUnsavedChanges: true,
              projectId: "mafateeh-admin",
            }}
          >
            <Outlet />
            <UnsavedChangesGuard />
            <DocumentTitleHandler
              handler={({ autoGeneratedTitle }) =>
                autoGeneratedTitle.replace(/refine/gi, "Mafateeh").trim()
              }
            />
          </Refine>
        </AntdApp>
      </ConfigProvider>
  );
}

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<RefineLayout />}>
      <Route path="/login" element={<LoginPage />} />
                    <Route element={<AuthenticatedShell />}>
                      <Route index element={<DashboardPage />} />
                      <Route path="/static-site-info">
                        <Route
                          index
                          element={
                            <ProtectedRoute resource="static_site_info" action="list">
                              <StaticSiteInfoList />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="edit/:id"
                          element={
                            <ProtectedRoute resource="static_site_info" action="edit">
                              <StaticSiteInfoEdit />
                            </ProtectedRoute>
                          }
                        />
                      </Route>
                      <Route path="/privacy-policy">
                        <Route
                          index
                          element={
                            <ProtectedRoute resource="privacy_policy" action="list">
                              <PrivacyPolicyList />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="edit/:id"
                          element={
                            <ProtectedRoute resource="privacy_policy" action="edit">
                              <PrivacyPolicyEdit />
                            </ProtectedRoute>
                          }
                        />
                      </Route>
                      <Route path="/seo">
                        <Route
                          index
                          element={
                            <ProtectedRoute resource="seo" action="list">
                              <SeoList />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="edit/:id"
                          element={
                            <ProtectedRoute resource="seo" action="edit">
                              <SeoEdit />
                            </ProtectedRoute>
                          }
                        />
                      </Route>
                      <Route path="/blogs">
                        <Route
                          index
                          element={
                            <ProtectedRoute resource="blogs" action="list">
                              <BlogsPage />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="categories"
                          element={
                            <ProtectedRoute resource="blogs" action="list">
                              <BlogsPage />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="categories/create"
                          element={
                            <ProtectedRoute resource="blog_categories" action="create">
                              <BlogCategoryCreate />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="categories/edit/:id"
                          element={
                            <ProtectedRoute resource="blog_categories" action="edit">
                              <BlogCategoryEdit />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="create"
                          element={
                            <ProtectedRoute resource="blogs" action="create">
                              <BlogCreate />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="edit/:id"
                          element={
                            <ProtectedRoute resource="blogs" action="edit">
                              <BlogEdit />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="show/:id"
                          element={
                            <ProtectedRoute resource="blogs" action="show">
                              <BlogShow />
                            </ProtectedRoute>
                          }
                        />
                      </Route>
                      <Route path="/partners">
                        <Route
                          index
                          element={
                            <ProtectedRoute resource="partners" action="list">
                              <PartnerList />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="create"
                          element={
                            <ProtectedRoute resource="partners" action="create">
                              <PartnerCreate />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="edit/:id"
                          element={
                            <ProtectedRoute resource="partners" action="edit">
                              <PartnerEdit />
                            </ProtectedRoute>
                          }
                        />
                      </Route>
                      <Route path="/portfolios">
                        <Route
                          index
                          element={
                            <ProtectedRoute resource="portfolios" action="list">
                              <PortfoliosPage />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="categories"
                          element={
                            <ProtectedRoute resource="portfolios" action="list">
                              <PortfoliosPage />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="categories/create"
                          element={
                            <ProtectedRoute resource="portfolio_categories" action="create">
                              <PortfolioCategoryCreate />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="categories/edit/:id"
                          element={
                            <ProtectedRoute resource="portfolio_categories" action="edit">
                              <PortfolioCategoryEdit />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="create"
                          element={
                            <ProtectedRoute resource="portfolios" action="create">
                              <PortfolioCreate />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="edit/:id"
                          element={
                            <ProtectedRoute resource="portfolios" action="edit">
                              <PortfolioEdit />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="show/:id"
                          element={
                            <ProtectedRoute resource="portfolios" action="show">
                              <PortfolioShow />
                            </ProtectedRoute>
                          }
                        />
                      </Route>
                      <Route path="/testimonials">
                        <Route
                          index
                          element={
                            <ProtectedRoute resource="testimonials" action="list">
                              <TestimonialList />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="create"
                          element={
                            <ProtectedRoute resource="testimonials" action="create">
                              <TestimonialCreate />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="edit/:id"
                          element={
                            <ProtectedRoute resource="testimonials" action="edit">
                              <TestimonialEdit />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="show/:id"
                          element={
                            <ProtectedRoute resource="testimonials" action="show">
                              <TestimonialShow />
                            </ProtectedRoute>
                          }
                        />
                      </Route>
                      <Route path="/services">
                        <Route
                          index
                          element={
                            <ProtectedRoute resource="services" action="list">
                              <ServicesPage />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="categories"
                          element={
                            <ProtectedRoute resource="services" action="list">
                              <ServicesPage />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="categories/create"
                          element={
                            <ProtectedRoute resource="service_categories" action="create">
                              <ServiceCategoryCreate />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="categories/edit/:id"
                          element={
                            <ProtectedRoute resource="service_categories" action="edit">
                              <ServiceCategoryEdit />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="create"
                          element={
                            <ProtectedRoute resource="services" action="create">
                              <ServiceCreate />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="edit/:id"
                          element={
                            <ProtectedRoute resource="services" action="edit">
                              <ServiceEdit />
                            </ProtectedRoute>
                          }
                        />
                      </Route>
                      <Route path="/packages">
                        <Route
                          index
                          element={
                            <ProtectedRoute resource="packages" action="list">
                              <PackageList />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="create"
                          element={
                            <ProtectedRoute resource="packages" action="create">
                              <PackageCreate />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="edit/:id"
                          element={
                            <ProtectedRoute resource="packages" action="edit">
                              <PackageEdit />
                            </ProtectedRoute>
                          }
                        />
                      </Route>
                      <Route path="/contacts">
                        <Route
                          index
                          element={
                            <ProtectedRoute resource="contacts" action="list">
                              <ContactList />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="show/:id"
                          element={
                            <ProtectedRoute resource="contacts" action="show">
                              <ContactShow />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="edit/:id"
                          element={
                            <ProtectedRoute resource="contacts" action="edit">
                              <ContactEdit />
                            </ProtectedRoute>
                          }
                        />
                      </Route>
                      <Route path="/roles">
                        <Route
                          index
                          element={
                            <ProtectedRoute resource="roles" action="list">
                              <RoleList />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="create"
                          element={
                            <ProtectedRoute resource="roles" action="create">
                              <RoleCreate />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="edit/:id"
                          element={
                            <ProtectedRoute resource="roles" action="edit">
                              <RoleEdit />
                            </ProtectedRoute>
                          }
                        />
                      </Route>
                      <Route path="/admins">
                        <Route
                          index
                          element={
                            <ProtectedRoute resource="admins" action="list">
                              <AdminList />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="create"
                          element={
                            <ProtectedRoute resource="admins" action="create">
                              <AdminCreate />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="edit/:id"
                          element={
                            <ProtectedRoute resource="admins" action="edit">
                              <AdminEdit />
                            </ProtectedRoute>
                          }
                        />
                      </Route>
                      <Route path="*" element={<ErrorComponent />} />
                    </Route>
    </Route>
  )
);

export default function App() {
  return <RouterProvider router={router} />;
}

