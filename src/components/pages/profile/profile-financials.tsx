"use client";

import React from "react";
import Link from "next/link";
import { Wallet, Gift, Clock, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserProfile } from "@/actions/profile";

interface ProfileFinancialsProps {
  profile: UserProfile;
}

export function ProfileFinancials({ profile }: ProfileFinancialsProps) {
  return (
    <section className="w-full max-w-4xl mx-auto px-4 sm:px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Card 1: Dompet Sirkular */}
        <div className="rounded-3xl border border-border bg-card p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-headline font-bold uppercase tracking-wider text-primary">
                Dompet Sirkular
              </span>
              <Wallet className="w-4 h-4 text-primary" />
            </div>
            <div className="font-mono text-2xl sm:text-3xl font-extrabold text-foreground">
              Rp{profile.credit_balance.toLocaleString("id-ID")}
            </div>
            <p className="text-xs text-muted-foreground font-body">
              Saldo kredit transaksi pengelolaan limbah dan deposit jaminan mutu.
            </p>
          </div>

          <div className="pt-3 border-t border-border/80 flex items-center justify-between">
            <span className="text-xs font-mono text-emerald-600 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Status Dompet Aktif</span>
            </span>
            <Button asChild variant="outline" size="sm" className="rounded-xl text-xs font-semibold gap-1">
              <Link href="/wallet">
                <span>Buka Dompet</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Card 2: Subsidi Platform & Jendela Makan */}
        <div className="rounded-3xl border border-border bg-card p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-headline font-bold uppercase tracking-wider text-primary">
                Hak Subsidi & Kuota
              </span>
              <Gift className="w-4 h-4 text-primary" />
            </div>
            <div className="font-mono text-2xl sm:text-3xl font-extrabold text-foreground">
              Rp{profile.subsidy_remaining.toLocaleString("id-ID")}
            </div>
            <p className="text-xs text-muted-foreground font-body">
              Alokasi reverse tipping fee per batch limbah untuk operasional sirkular perdana.
            </p>
          </div>

          <div className="pt-3 border-t border-border/80 flex items-center justify-between text-xs text-muted-foreground font-body">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-primary" />
              <span>Jendela Makan: 11-14 & 17-20 WITA</span>
            </div>
            <Link href="/rescue" className="text-primary font-bold hover:underline">
              Radar Pangan →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
