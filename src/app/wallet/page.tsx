import type { Metadata } from "next";
import { AppShell } from "@/components/layout/app-shell";
import { HeroSection } from "@/components/pages/wallet/hero-section";
import { PocketSection } from "@/components/pages/wallet/pocket-section";
import { PayoutSection } from "@/components/pages/wallet/payout-section";
import { LedgerSection } from "@/components/pages/wallet/ledger-section";

export const metadata: Metadata = {
  title: "Dompet Sirkular",
  description: "Lihat ringkasan dompet sirkular, pencairan, dan riwayat transaksi di SiklusPangan.",
};

export default function WalletPage() {
  return (
    <AppShell mainId="main-content">
      <main id="main-content" tabIndex={-1} className="w-full py-8 sm:py-10 flex flex-col gap-8 sm:gap-10 items-center justify-start selection:bg-primary/20 selection:text-primary">
        <HeroSection />
        <PocketSection />
        <PayoutSection />
        <LedgerSection />
      </main>
    </AppShell>
  );
}
