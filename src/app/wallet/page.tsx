import { AppShell } from "@/components/layout/app-shell";
import { HeroSection } from "@/components/pages/wallet/hero-section";
import { PocketSection } from "@/components/pages/wallet/pocket-section";
import { ProcessorPocketSection } from "@/components/pages/wallet/processor-pocket-section";
import { PayoutSection } from "@/components/pages/wallet/payout-section";
import { LedgerSection } from "@/components/pages/wallet/ledger-section";
import { getWalletData } from "@/actions/wallet";
import { createClient } from "@/lib/supabase/server";

export default async function WalletPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let role = user?.user_metadata?.role;
  if (!role && user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    role = profile?.role;
  }
  const isDonor = role === "donor";
  const isProcessor = role === "processor";

  const walletData = await getWalletData(user?.id, role);

  return (
    <AppShell role={role}>
      <main className="w-full py-8 sm:py-10 flex flex-col gap-8 sm:gap-10 items-center justify-start selection:bg-primary/20 selection:text-primary">
        <HeroSection />
        {isProcessor ? (
          <ProcessorPocketSection
            initialBalance={walletData.activeBalance}
            reverseTippingTotal={walletData.reverseTippingTotal}
            logisticsSubsidyTotal={walletData.logisticsSubsidyTotal}
          />
        ) : (
          <PocketSection
            activeBalance={walletData.activeBalance}
            reverseTippingTotal={walletData.reverseTippingTotal}
            logisticsSubsidyTotal={walletData.logisticsSubsidyTotal}
            pendingEscrowTotal={walletData.pendingEscrowTotal}
            pendingBatchesCount={walletData.pendingBatchesCount}
            totalWasteKg={walletData.totalWasteKg}
            isDonor={isDonor}
          />
        )}
        {isDonor && <PayoutSection activeBalance={walletData.activeBalance} />}
        <LedgerSection initialTransactions={walletData.transactions} />
      </main>
    </AppShell>
  );
}
