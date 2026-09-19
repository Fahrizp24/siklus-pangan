import { AppShell } from "@/components/layout/app-shell";
import { HeroSection } from "@/components/pages/wallet/hero-section";
import { PocketSection } from "@/components/pages/wallet/pocket-section";
import { PayoutSection } from "@/components/pages/wallet/payout-section";
import { LedgerSection } from "@/components/pages/wallet/ledger-section";
import { getWalletData } from "@/actions/wallet";

export const dynamic = "force-dynamic";

export default async function WalletPage() {
  const walletData = await getWalletData();

  return (
    <AppShell>
      <main className="w-full py-8 sm:py-10 flex flex-col gap-8 sm:gap-10 items-center justify-start selection:bg-primary/20 selection:text-primary">
        <HeroSection />
        <PocketSection
          activeBalance={walletData.activeBalance}
          reverseTippingTotal={walletData.reverseTippingTotal}
          logisticsSubsidyTotal={walletData.logisticsSubsidyTotal}
        />
        <PayoutSection />
        <LedgerSection initialTransactions={walletData.transactions} />
      </main>
    </AppShell>
  );
}
