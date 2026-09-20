import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { getWasteBatchById } from "@/actions/waste";
import { WasteManifestDetailView } from "@/components/pages/waste/waste-manifest-detail-view";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function WasteBatchDetailPage({ params }: PageProps) {
  const { id } = await params;
  const batch = await getWasteBatchById(id);

  if (!batch) {
    notFound();
  }

  return (
    <AppShell>
      <main className="w-full py-8 sm:py-10 flex flex-col items-center justify-start max-w-6xl mx-auto px-4 sm:px-6">
        <WasteManifestDetailView batch={batch} />
      </main>
    </AppShell>
  );
}
