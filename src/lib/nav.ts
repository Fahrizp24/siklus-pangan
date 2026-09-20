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

export const GUEST_NAV: NavItem[] = [
  { label: "Beranda", href: "/" },
  { label: "Live Radar", href: "/rescue" },
  { label: "Dashboard ESG", href: "/dashboard" },
  { label: "Wall of Fame", href: "/leaderboard" },
];

export const MAIN_NAV: NavItem[] = GUEST_NAV;

export const DONOR_NAV: NavItem[] = [
  { label: "Donasi Pangan", href: "/donate" },
  { label: "List Donasi", href: "/rescue" },
  { label: "Limbah Organik", href: "/waste" },
  { label: "Dompet Sirkular", href: "/wallet" },
  { label: "Sengketa", href: "/disputes" },
  { label: "Leaderboard", href: "/leaderboard" },
];

export const BENEFICIARY_NAV: NavItem[] = [
  { label: "Live Radar", href: "/rescue" },
  { label: "Tiket Klaim", href: "/claims" },
  { label: "Lapor Sengketa", href: "/disputes" },
  { label: "Wall of Fame", href: "/leaderboard" },
];

export const PROCESSOR_NAV: NavItem[] = [
  { label: "Radar Limbah BSF", href: "/waste" },
  { label: "Dompet Operasional", href: "/wallet" },
  { label: "Leaderboard", href: "/leaderboard" },
];

export const ADMIN_NAV: NavItem[] = [
  { label: "Konsol Admin", href: "/admin" },
  { label: "Radar Pangan", href: "/rescue" },
  { label: "Limbah Organik", href: "/waste" },
  { label: "Dompet", href: "/wallet" },
  { label: "Sengketa", href: "/disputes" },
];

export const FOOTER_SECTIONS: FooterSection[] = [
  {
    title: "LAYANAN EKOSISTEM",
    links: [
      { label: "Live Surplus Radar", href: "/rescue" },
      { label: "Donasi Pangan B2B", href: "/donate" },
      { label: "Konversi Biogas & Kompos", href: "/waste" },
      { label: "Dompet Sirkular Karbon", href: "/wallet" },
      { label: "Kalkulator Emisi Scope 3", href: "/dashboard" },
    ],
  },
  {
    title: "KEPATUHAN & SERTIFIKASI",
    links: [
      { label: "Standar Keamanan ISO 27001", href: "/compliance/iso-27001" },
      { label: "ISO 14044 Life Cycle Assessment", href: "/compliance/iso-14044" },
      { label: "Protokol Gas Rumah Kaca (GHG)", href: "/compliance/ghg" },
      { label: "Regulasi BPOM Pangan Olahan", href: "/compliance/bpom" },
      { label: "Sertifikasi Halal LPOM MUI", href: "/compliance/halal" },
    ],
  },
  {
    title: "PERUSAHAAN",
    links: [
      { label: "Kebijakan Privasi", href: "/privacy" },
      { label: "Ketentuan Layanan", href: "/terms" },
      { label: "ESG Compliance & Metrik", href: "/dashboard" },
      { label: "Sertifikasi Karbon", href: "/wallet" },
      { label: "Pusat Bantuan", href: "/help" },
      { label: "API Mitra B2B", href: "/api-docs" },
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
