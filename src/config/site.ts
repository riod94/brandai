export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "BerandAI",
  description: "AI-powered logo generator. Create professional, stunning logos for your brand in seconds with artificial intelligence.",
  navItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Pricing",
      href: "/#pricing",
    },
    {
      label: "About",
      href: "/about",
    },
  ],
  navMenuItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Dashboard",
      href: "/app",
    },
    {
      label: "Credits",
      href: "/app/credits",
    },
    {
      label: "About",
      href: "/about",
    },
  ],
  links: {
    github: "https://github.com/berandai",
    twitter: "https://twitter.com/berandai",
    instagram: "https://instagram.com/berandai",
  },
};
