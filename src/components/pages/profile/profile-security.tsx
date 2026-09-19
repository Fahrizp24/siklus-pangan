"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, ShieldAlert, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

export function ProfileSecurity() {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleSignOut = async () => {
    setLoggingOut(true);
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push("/login");
      router.refresh();
    } catch (err) {
      console.error("Sign out error:", err);
      setLoggingOut(false);
    }
  };

  return (
    <section className="w-full max-w-4xl mx-auto px-4 sm:px-6 pb-6">
      <div className="rounded-3xl border border-border bg-card p-6 sm:p-7 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1 max-w-xl">
            <div className="flex items-center gap-2 text-xs font-headline font-bold text-foreground">
              <ShieldAlert className="w-4 h-4 text-primary" />
              <span>Perlindungan Hukum & Ketentuan Good Samaritan</span>
            </div>
            <p className="text-xs text-muted-foreground font-body leading-relaxed">
              Donatur pangan yang mendistribusikan makanan berlebih secara cuma-cuma dengan itikad baik dan memenuhi standar penanganan higienitas dilindungi dari tuntutan hukum perdata berdasarkan prinsip regulasi Pangan Olahan Berkelanjutan.
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            disabled={loggingOut}
            onClick={handleSignOut}
            className="rounded-xl border-rose-200 text-rose-700 hover:bg-rose-50 hover:text-rose-800 text-xs font-headline font-semibold gap-2 shrink-0 self-start sm:self-center"
          >
            {loggingOut ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Keluar...</span>
              </>
            ) : (
              <>
                <LogOut className="w-4 h-4" />
                <span>Keluar dari Akun</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </section>
  );
}
