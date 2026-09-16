"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { WasteVlmScanner } from "@/components/scanner/waste-vlm-scanner";
import type { WasteInspectionResult } from "@/lib/harness/ai-guard";

export default function WasteScanPage() {
  const router = useRouter();

  const handleInspectionComplete = (
    _result: WasteInspectionResult,
    _imageUrl: string
  ) => {
    router.push("/waste");
  };

  return (
    <AppShell>
      <main className="w-full py-8 sm:py-12 flex flex-col items-center justify-center px-4">
        <WasteVlmScanner
          onInspectionComplete={handleInspectionComplete}
          onClose={() => router.push("/waste")}
        />
      </main>
    </AppShell>
  );
}
