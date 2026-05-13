import { useList, usePermissions } from "@refinedev/core";
import { Typography } from "antd";
import { useEffect, useMemo, type ReactNode } from "react";
import { Link } from "react-router";
import type { IContact } from "../../interfaces";
import {
  ArrowRightOutlined,
  CommentOutlined,
  CustomerServiceOutlined,
  FundProjectionScreenOutlined,
  InboxOutlined,
  ShopOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { notify } from "../../lib/notify";
import { LoadingSkeleton, PageContainer } from "../../components/ui";

type BlogRow = {
  id: string;
  title?: string;
  createdAt?: string;
  published?: boolean;
};

type StatTone = "primary" | "secondary" | "neutral";

type StatItem = {
  key: string;
  to: string;
  label: string;
  value: number;
  hint?: string;
  icon: ReactNode;
  tone: StatTone;
};

export const DashboardPage = () => {
  const { data: permissionsData } = usePermissions<string[]>({});
  const permissions = Array.isArray(permissionsData) ? permissionsData : [];
  const hasAll = permissions.includes("*");
  const can = (p: string) => hasAll || permissions.includes(p);

  const canReadContacts = can("contacts");
  const canReadBlogs = can("blogs");
  const canReadPartners = can("partners");
  const canReadPortfolios = can("portfolios");
  const canReadServices = can("services");
  const canReadTestimonials = can("testimonials");
  const canReadPackages = can("packages");

  const contacts = useList<IContact>({
    resource: "contacts",
    pagination: { mode: "off" },
    queryOptions: { enabled: canReadContacts },
  });
  const blogs = useList<BlogRow>({
    resource: "blogs",
    pagination: { mode: "off" },
    queryOptions: { enabled: canReadBlogs },
  });
  const partners = useList({
    resource: "partners",
    pagination: { mode: "off" },
    queryOptions: { enabled: canReadPartners },
  });
  const portfolios = useList({
    resource: "portfolios",
    pagination: { mode: "off" },
    queryOptions: { enabled: canReadPortfolios },
  });
  const services = useList({
    resource: "services",
    pagination: { mode: "off" },
    queryOptions: { enabled: canReadServices },
  });
  const testimonials = useList({
    resource: "testimonials",
    pagination: { mode: "off" },
    queryOptions: { enabled: canReadTestimonials },
  });
  const packages = useList({
    resource: "packages",
    pagination: { mode: "off" },
    queryOptions: { enabled: canReadPackages },
  });

  const loading =
    (canReadContacts && contacts.query.isLoading) ||
    (canReadBlogs && blogs.query.isLoading) ||
    (canReadPartners && partners.query.isLoading) ||
    (canReadPortfolios && portfolios.query.isLoading) ||
    (canReadServices && services.query.isLoading) ||
    (canReadTestimonials && testimonials.query.isLoading) ||
    (canReadPackages && packages.query.isLoading);

  const err =
    (canReadContacts && contacts.query.isError) ||
    (canReadBlogs && blogs.query.isError) ||
    (canReadPartners && partners.query.isError) ||
    (canReadPortfolios && portfolios.query.isError) ||
    (canReadServices && services.query.isError) ||
    (canReadTestimonials && testimonials.query.isError) ||
    (canReadPackages && packages.query.isError);

  const newContactsCount =
    contacts.result?.data?.filter((c) => c.status === "NEW").length ?? 0;

  const blogData = blogs.result?.data;
  const blogRows = blogData ?? [];
  const publishedBlogs = blogRows.filter((b) => b.published).length;
  const draftBlogs = Math.max(0, (blogs.result?.total ?? 0) - publishedBlogs);

  const newContactsPreview = useMemo(() => {
    if (!canReadContacts || !contacts.result?.data?.length) return [];
    return [...contacts.result.data]
      .filter((c) => c.status === "NEW")
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .slice(0, 6);
  }, [canReadContacts, contacts.result?.data]);

  const recentBlogs = useMemo(() => {
    if (!canReadBlogs || !blogData?.length) return [];
    return [...blogData]
      .sort(
        (a, b) =>
          new Date(b.createdAt ?? 0).getTime() -
          new Date(a.createdAt ?? 0).getTime(),
      )
      .slice(0, 6);
  }, [canReadBlogs, blogData]);

  const stats: StatItem[] = useMemo(() => {
    const items: StatItem[] = [];
    const tones: StatTone[] = ["primary", "secondary", "neutral"];
    let i = 0;
    const push = (item: Omit<StatItem, "tone">) => {
      items.push({ ...item, tone: tones[i % tones.length] });
      i += 1;
    };
    if (canReadPartners) {
      push({
        key: "partners",
        to: "/partners",
        label: "Partners",
        value: partners.result?.total ?? 0,
        hint: "Logo partners on the site",
        icon: <TeamOutlined />,
      });
    }
    if (canReadPortfolios) {
      push({
        key: "portfolios",
        to: "/portfolios",
        label: "Portfolios",
        value: portfolios.result?.total ?? 0,
        hint: "Showcase projects",
        icon: <FundProjectionScreenOutlined />,
      });
    }
    if (canReadServices) {
      push({
        key: "services",
        to: "/services",
        label: "Services",
        value: services.result?.total ?? 0,
        hint: "Service offerings",
        icon: <CustomerServiceOutlined />,
      });
    }
    if (canReadTestimonials) {
      push({
        key: "testimonials",
        to: "/testimonials",
        label: "Testimonials",
        value: testimonials.result?.total ?? 0,
        hint: "Client quotes",
        icon: <CommentOutlined />,
      });
    }
    if (canReadPackages) {
      push({
        key: "packages",
        to: "/packages",
        label: "Packages",
        value: packages.result?.total ?? 0,
        hint: "Pricing packages",
        icon: <ShopOutlined />,
      });
    }
    if (canReadContacts) {
      push({
        key: "contacts",
        to: "/contacts",
        label: "Contact messages",
        value: contacts.result?.total ?? 0,
        hint: `${newContactsCount} new · needs attention`,
        icon: <InboxOutlined />,
      });
    }
    return items;
  }, [
    canReadPartners,
    canReadPortfolios,
    canReadServices,
    canReadTestimonials,
    canReadPackages,
    canReadContacts,
    partners.result?.total,
    portfolios.result?.total,
    services.result?.total,
    testimonials.result?.total,
    packages.result?.total,
    contacts.result?.total,
    newContactsCount,
  ]);

  useEffect(() => {
    if (err) {
      notify.warning("Some statistics could not be loaded. Check permissions or try again.");
    }
  }, [err]);

  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <PageContainer
      title="Dashboard"
      subtitle="Live counts for partners, portfolios, services, testimonials, packages, and inbound messages."
    >
      {stats.length === 0 ? (
        <article className="maf-dashboard-empty">
          <Typography.Paragraph style={{ marginBottom: 8 }}>
            No statistics to show yet. Your account does not have list access to partners, portfolios, services, or
            related resources.
          </Typography.Paragraph>
          <Typography.Text type="secondary">
            Ask an administrator to grant permissions such as partners or contacts.
          </Typography.Text>
        </article>
      ) : (
        <div className="maf-dashboard-stats-wrap">
          <section className="maf-dashboard-stats" aria-label="Content statistics">
            {stats.map((item) => (
              <Link key={item.key} to={item.to} className="maf-stat-card-link">
                <article className={`maf-stat-card maf-stat-card--${item.tone}`}>
                  <div className="maf-stat-card__icon" aria-hidden>
                    {item.icon}
                  </div>
                  <div className="maf-stat-card__body">
                    <p className="maf-stat-card__label">{item.label}</p>
                    <h3 className="maf-stat-card__value">{item.value}</h3>
                    {item.hint ? <small className="maf-stat-card__hint">{item.hint}</small> : null}
                  </div>
                </article>
              </Link>
            ))}
          </section>
        </div>
      )}

      {(canReadBlogs || canReadContacts) && (
        <section className="maf-dashboard-grid">
          {canReadBlogs ? (
            <article className="maf-card maf-dashboard-split-card">
              <h4>Blog publishing</h4>
              <div className="maf-dashboard-pill-row">
                <div className="maf-dashboard-pill maf-dashboard-pill--primary">
                  <span className="maf-dashboard-pill__value">{publishedBlogs}</span>
                  <span className="maf-dashboard-pill__label">Published</span>
                </div>
                <div className="maf-dashboard-pill maf-dashboard-pill--secondary">
                  <span className="maf-dashboard-pill__value">{draftBlogs}</span>
                  <span className="maf-dashboard-pill__label">Draft</span>
                </div>
              </div>
              {recentBlogs.length > 0 ? (
                <>
                  <p className="maf-dashboard-subhead">Recent posts</p>
                  <ul className="maf-dashboard-link-list">
                    {recentBlogs.map((b) => (
                      <li key={b.id}>
                        <Link to={`/blogs/show/${b.id}`} className="maf-dashboard-link-row">
                          <span className="maf-dashboard-link-title">{b.title ?? "Untitled"}</span>
                          <ArrowRightOutlined className="maf-dashboard-link-chevron" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <Link to="/blogs" className="maf-dashboard-see-all">
                    View all blogs
                  </Link>
                </>
              ) : (
                <p className="maf-dashboard-muted">No blog posts yet.</p>
              )}
            </article>
          ) : null}

          {canReadContacts ? (
            <article className="maf-card maf-dashboard-split-card">
              <div className="maf-card__header-inline">
                <h4>Inbox</h4>
                {newContactsCount > 0 ? (
                  <span className="maf-dashboard-badge-new">{newContactsCount} new</span>
                ) : null}
              </div>
              {newContactsPreview.length > 0 ? (
                <ul className="maf-dashboard-inbox-list">
                  {newContactsPreview.map((c) => (
                    <li key={c.id}>
                      <Link to={`/contacts/show/${c.id}`} className="maf-dashboard-inbox-row">
                        <div>
                          <p className="maf-dashboard-inbox-name">{c.name}</p>
                          <small className="maf-dashboard-inbox-meta">
                            {c.email}
                            {c.createdAt
                              ? ` · ${new Date(c.createdAt).toLocaleDateString(undefined, {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })}`
                              : null}
                          </small>
                        </div>
                        <ArrowRightOutlined />
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="maf-dashboard-muted">No new messages. Great job staying on top of the inbox.</p>
              )}
              <Link to="/contacts" className="maf-dashboard-see-all">
                Open contacts
              </Link>
            </article>
          ) : null}
        </section>
      )}
    </PageContainer>
  );
};
