import React from "react";
import { AppShell } from "@/components/layout/app-shell";
import { getAdminDashboardData } from "@/actions/admin";
import { AdminHero } from "@/components/pages/admin/admin-hero";
import { AdminTabs } from "@/components/pages/admin/admin-tabs";
import { createClient } from "@/lib/supabase/server";
import { ShieldCheck, Lock } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const data = await getAdminDashboardData();
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let userRole = "guest";
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();
    userRole = profile?.role || user.user_metadata?.role || "authenticated";
  }

  return (
    <AppShell>
      <main className="w-full py-6 sm:py-8 flex flex-col gap-6 sm:gap-8 items-center justify-start selection:bg-primary/20 selection:text-primary">
        {/* Security / Access Level Notice */}
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6">
          <div className="p-3.5 rounded-2xl bg-secondary/10 border border-secondary/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-secondary font-medium">
              <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
              <span>
                <strong>Sesi Pengawas:</strong> {user ? user.email : "Akses Penjurian Lomba (Operator Mode)"} • Peran Terdeteksi: <span className="font-mono font-bold uppercase">{userRole}</span>
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground font-mono text-[11px]">
              <Lock className="w-3.5 h-3.5 text-primary" />
              <span>Privileged Console Active</span>
            </div>
          </div>
        </div>

        <AdminHero telemetry={data.telemetry} />
        <AdminTabs
          initialUsers={data.users}
          initialDisputes={data.disputes}
          initialTransactions={data.transactions}
        />
      </main>
    </AppShell>
  );
}
