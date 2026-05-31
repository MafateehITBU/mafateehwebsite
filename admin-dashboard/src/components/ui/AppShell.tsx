import type { PropsWithChildren, ReactNode } from "react";
import { useGetIdentity, useLogout, useMenu, usePermissions } from "@refinedev/core";
import { Link, useLocation } from "react-router";
import { Avatar, Button, Drawer, Input } from "antd";
import { useMemo, useState } from "react";
import {
  AppstoreOutlined,
  BookOutlined,
  FolderOpenOutlined,
  SearchOutlined,
  ClusterOutlined,
  DashboardOutlined,
  FileTextOutlined,
  GlobalOutlined,
  IdcardOutlined,
  LogoutOutlined,
  MailOutlined,
  MenuOutlined,
  SafetyCertificateOutlined,
  ShopOutlined,
  TagsOutlined,
  TeamOutlined,
  UserOutlined,
  UserSwitchOutlined,
} from "@ant-design/icons";

type MenuItem = {
  key: string;
  label: string;
  route: string;
  icon: ReactNode;
};

/** Sidebar order (logout is rendered separately at the bottom). */
const SIDEBAR_MENU_ORDER = [
  "dashboard",
  "roles",
  "admins",
  "static_site_info",
  "seo",
  "portfolios",
  "partners",
  "testimonials",
  "packages",
  "services",
  "blogs",
  "contacts",
  "privacy_policy",
] as const;

const sidebarMenuRank = (key: string) => {
  const index = SIDEBAR_MENU_ORDER.indexOf(key as (typeof SIDEBAR_MENU_ORDER)[number]);
  return index === -1 ? SIDEBAR_MENU_ORDER.length : index;
};

const iconMap: Record<string, ReactNode> = {
  dashboard: <DashboardOutlined />,
  static_site_info: <GlobalOutlined />,
  privacy_policy: <SafetyCertificateOutlined />,
  seo: <SearchOutlined />,
  blogs: <FileTextOutlined />,
  blog_categories: <TagsOutlined />,
  partners: <TeamOutlined />,
  portfolios: <AppstoreOutlined />,
  portfolio_categories: <FolderOpenOutlined />,
  testimonials: <IdcardOutlined />,
  services: <BookOutlined />,
  service_categories: <ClusterOutlined />,
  packages: <ShopOutlined />,
  contacts: <MailOutlined />,
  roles: <SafetyCertificateOutlined />,
  admins: <UserSwitchOutlined />,
};

const resolveMenuIcon = (item: { key?: string; name?: string; label?: string; route?: string }) => {
  const source = `${item.key ?? ""} ${item.name ?? ""} ${item.label ?? ""} ${item.route ?? ""}`.toLowerCase();
  const normalized = source.replace(/[-\s/]/g, "_");

  const directKey =
    iconMap[String(item.key ?? "")] ??
    iconMap[String(item.name ?? "")] ??
    iconMap[normalized];
  if (directKey) return directKey;

  if (source.includes("dashboard")) return <DashboardOutlined />;
  if (source.includes("blog")) return <FileTextOutlined />;
  if (source.includes("portfolio")) return <AppstoreOutlined />;
  if (source.includes("service")) return <BookOutlined />;
  if (source.includes("contact")) return <MailOutlined />;
  if (source.includes("partner")) return <TeamOutlined />;
  if (source.includes("testimonial")) return <IdcardOutlined />;
  if (source.includes("package")) return <ShopOutlined />;
  if (source.includes("role")) return <SafetyCertificateOutlined />;
  if (source.includes("admin")) return <UserSwitchOutlined />;
  if (source.includes("seo")) return <SearchOutlined />;
  if (source.includes("privacy")) return <SafetyCertificateOutlined />;
  if (source.includes("static")) return <GlobalOutlined />;

  return <AppstoreOutlined />;
};

const SidebarContent = ({ onNavigate }: { onNavigate?: () => void }) => {
  const { menuItems } = useMenu();
  const location = useLocation();
  const { mutate: logout } = useLogout();
  const { data: permissionsData, isLoading: permissionsLoading } = usePermissions<string[] | string>({});
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
  const can = (permission: string) => hasAll || permissions.includes(permission);
  const canViewMenuItem = (item: { key?: string; name?: string; label?: string; route?: string }): boolean => {
    const source = `${item.key ?? ""} ${item.name ?? ""} ${item.label ?? ""} ${item.route ?? ""}`.toLowerCase();
    if (source.includes("dashboard") || item.route === "/") return true;
    if (source.includes("blog") || source.includes("tag")) return can("blogs");
    if (source.includes("portfolio")) return can("portfolios");
    if (source.includes("service")) return can("services");
    if (source.includes("static")) return can("static_info");
    if (source.includes("privacy")) return can("privacy");
    if (source.includes("partner")) return can("partners");
    if (source.includes("testimonial")) return can("testimonials");
    if (source.includes("package")) return can("packages");
    if (source.includes("contact")) return can("contacts");
    if (source.includes("seo")) return can("seo");
    if (source.includes("role")) return can("roles");
    if (source.includes("admin")) return can("admins");
    return true;
  };

  const items = useMemo(
    () =>
      menuItems
        .filter((item) => Boolean(item.route) && Boolean(item.key))
        .filter((item) => permissionsLoading || canViewMenuItem(item))
        .map(
          (item) =>
            ({
              key: String(item.key),
              label: String(item.label ?? item.name ?? item.key),
              route: item.route ?? "/",
              icon: resolveMenuIcon({
                key: String(item.key),
                name: item.name,
                label: String(item.label ?? ""),
                route: item.route ?? "/",
              }),
            }) as MenuItem,
        )
        .sort((a, b) => sidebarMenuRank(a.key) - sidebarMenuRank(b.key)),
    [menuItems, permissionsLoading, permissionsData],
  );

  return (
    <div className="maf-sidebar-panel">
      <div className="maf-brand">
        <img src="/logo.png" alt="Mafateeh" className="maf-brand__logo" />
        <div>
          <p className="maf-brand__name">Mafateeh</p>
        </div>
      </div>

      <p className="maf-sidebar__section">MENU</p>
      <nav className="maf-menu">
        {items.map((item) => {
          const active =
            item.route === "/"
              ? location.pathname === "/"
              : location.pathname.startsWith(item.route);
          return (
            <Link
              key={item.key}
              to={item.route}
              onClick={onNavigate}
              className={`maf-menu__item ${active ? "is-active" : ""}`}
            >
              <span className="maf-menu__icon">{item.icon}</span>
              <span className="maf-menu__label">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="maf-menu" style={{ marginTop: "auto" }}>
        <button type="button" className="maf-menu__item" onClick={() => logout()}>
          <span className="maf-menu__icon">
            <LogoutOutlined />
          </span>
          <span className="maf-menu__label">Logout</span>
        </button>
      </div>
    </div>
  );
};

export const AppShell = ({ children }: PropsWithChildren) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { data } = useGetIdentity<{ name?: string; email?: string }>();

  const handleGlobalSearch = (value: string) => {
    window.dispatchEvent(
      new CustomEvent("mafateeh:table-search", {
        detail: value.trim().toLowerCase(),
      }),
    );
  };

  return (
    <div className="admin-app-shell">
      <div className="maf-shell">
        <aside className="maf-sidebar">
          <SidebarContent />
        </aside>

        <Drawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          placement="left"
          width={290}
          rootClassName="maf-mobile-drawer"
        >
          <SidebarContent onNavigate={() => setDrawerOpen(false)} />
        </Drawer>

        <div className="maf-content">
          <header className="maf-header">
            <div className="maf-header__left">
              <Button
                icon={<MenuOutlined />}
                className="maf-header__menu-btn"
                onClick={() => setDrawerOpen(true)}
              />
              <div className="maf-header__search">
                <Input
                  prefix={<SearchOutlined />}
                  placeholder="Search in current table..."
                  onChange={(event) => handleGlobalSearch(event.target.value)}
                />
              </div>
            </div>
            <div className="maf-header__right">
              <div className="maf-header__profile">
                <Avatar icon={<UserOutlined />} />
                <div>
                  <p className="maf-header__name">{data?.name ?? "Mafateeh Admin"}</p>
                  <p className="maf-header__email">
                    {data?.email ?? "admin@mafateeh.com"}
                  </p>
                </div>
              </div>
            </div>
          </header>

          <main className="admin-content-wrap">{children}</main>
        </div>
      </div>
    </div>
  );
};
