export interface NavItem {
  label: string;
  href: string;
  description?: string;
  badge?: string;
}

export interface FooterSection {
  title: string;
  links: NavItem[];
}

export function isNavItemActive(pathname: string, href: string) {
  return pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));
}

export const MAIN_NAV: NavItem[] = [
  { label: "Beranda", href: "/" },
  { label: "Live Radar", href: "/rescue" },
  { label: "Donasi Pangan", href: "/donate" },
  { label: "Limbah Organik", href: "/waste" },
  { label: "Dompet Sirkular", href: "/wallet" },
];

export const FOOTER_SECTIONS: FooterSection[] = [
  {
    title: "LAYANAN EKOSISTEM",
    links: [
      { label: "Live Surplus Radar", href: "/rescue" },
      { label: "Donasi Pangan B2B", href: "/donate" },
      { label: "Konversi Biogas & Kompos", href: "/waste" },
      { label: "Dompet Sirkular Karbon", href: "/wallet" },
      { label: "Dashboard Dampak", href: "/dashboard" },
    ],
  },
  {
    title: "AKTIVITAS PANGAN",
    links: [
      { label: "Klaim Pangan", href: "/claims" },
    ],
  },
];

export const FOOTER_INFO = {
  brandName: "SiklusPangan",
  description:
    "Infrastruktur rekayasa software & manajemen logistik surplus pangan berstandar Jepang. Membangkitkan efisiensi rantai pasok industri F&B melalui teknologi AI, kepatuhan BPOM, dan transparansi metrik ESG Scope 3.",
  engineeringCenters: [
    { city: "Tokyo", detail: "Yotsuya" },
    { city: "Bali", detail: "Renon Denpasar" },
    { city: "Jakarta", detail: "Kelapa Gading" },
  ],
  copyright:
    "© 2025 SiklusPangan Indonesia. Tokyo · Bali · Jakarta Engineering Hubs. Berstandar ISO 14044 & GHG Protocol. Hak Cipta Dilindungi.",
  systemStatus: "Seluruh Sistem Normal",
  engineVersion: "v4.8.2-prod",
};
