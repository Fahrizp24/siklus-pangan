import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { getWasteBatchById } from "@/actions/waste";
import { WasteManifestDetailView } from "@/components/pages/waste/waste-manifest-detail-view";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function WasteBatchDetailPage({ params }: PageProps) {
  const { id } = await params;
  const [batch, supabase] = await Promise.all([
    getWasteBatchById(id),
    createClient(),
  ]);

  if (!batch) {
    notFound();
  }

  const { data: { user } } = await supabase.auth.getUser();
  const role = user?.user_metadata?.role;

  return (
    <AppShell role={role}>
      <main className="w-full py-8 sm:py-10 flex flex-col items-center justify-start max-w-6xl mx-auto px-4 sm:px-6">
        <WasteManifestDetailView batch={batch} />
      </main>
    </AppShell>
  );
}
