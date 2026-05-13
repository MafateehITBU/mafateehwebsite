/** Mirrors backend `PERMISSIONS` + "*" for role assignment UI */
export const ADMIN_PERMISSION_OPTIONS: { label: string; value: string }[] = [
  { label: "Super (all)", value: "*" },
  { label: "Blogs", value: "blogs" },
  { label: "Portfolios", value: "portfolios" },
  { label: "Services", value: "services" },
  { label: "Static site info", value: "static_info" },
  { label: "Privacy policy", value: "privacy" },
  { label: "Partners", value: "partners" },
  { label: "Testimonials", value: "testimonials" },
  { label: "Packages", value: "packages" },
  { label: "Contacts", value: "contacts" },
  { label: "SEO", value: "seo" },
  { label: "Roles", value: "roles" },
  { label: "Admins", value: "admins" },
  { label: "Upload assets", value: "upload_assets" },
];
