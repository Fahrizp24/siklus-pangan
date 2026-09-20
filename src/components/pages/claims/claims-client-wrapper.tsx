"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Ticket, Compass, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroSection } from "@/components/pages/claims/hero-section";
import { ClaimDetailsSection } from "@/components/pages/claims/claim-details-section";
import { ClaimActionsSection } from "@/components/pages/claims/claim-actions-section";
import { createClient } from "@/lib/supabase/client";

interface ClaimsClientWrapperProps {
  initialClaim?: any | null;
  user?: { id: string; name: string } | null;
}

export function ClaimsClientWrapper({
  initialClaim,
  user,
}: ClaimsClientWrapperProps) {
  const [claim, setClaim] = useState<any | null>(initialClaim ?? null);
  const [isLoading, setIsLoading] = useState(!initialClaim);

  useEffect(() => {
    if (initialClaim) {
      setClaim(initialClaim);
      setIsLoading(false);
      return;
    }

    async function fetchClientClaim() {
      setIsLoading(true);
      try {
        const supabase = createClient();
        let tokenToFind: string | null = null;
        let claimIdToFind: string | null = null;

        if (typeof window !== "undefined") {
          const params = new URLSearchParams(window.location.search);
          tokenToFind = params.get("token");
          claimIdToFind = params.get("claimId");

          if (!tokenToFind && !claimIdToFind) {
            const saved = localStorage.getItem("siklus_active_claim");
            if (saved) {
              try {
                const parsed = JSON.parse(saved);
                tokenToFind = parsed?.qrToken || null;
                claimIdToFind = parsed?.claimId || null;
              } catch {}
            }
          }
        }

        let query = supabase
          .from("food_claims")
          .select(`
            id,
            qr_token,
            portions_claimed,
            is_collected,
            collected_at,
            created_at,
            listing_id,
            food_listings (
              id,
              title,
              image_url,
              portions,
              safe_until,
              cooked_at,
              storage_method,
              dietary_tags,
              risky_ingredients,
              handling_notes
            )
          `)
          .order("created_at", { ascending: false });

        if (tokenToFind) {
          query = query.eq("qr_token", tokenToFind);
        } else if (claimIdToFind) {
          query = query.eq("id", claimIdToFind);
        } else if (user?.id) {
          query = query.eq("claimant_id", user.id).eq("is_collected", false);
        } else {
          setClaim(null);
          setIsLoading(false);
          return;
        }

        const { data, error } = await query.limit(1).maybeSingle();
        if (!error && data) {
          setClaim(data);
        } else {
          setClaim(null);
        }
      } catch (err) {
        console.warn("Error fetching active claim:", err);
        setClaim(null);
      } finally {
        setIsLoading(false);
      }
    }

    fetchClientClaim();
  }, [initialClaim, user?.id]);

  if (isLoading) {
    return (
      <div className="w-full max-w-6xl mx-auto px-4 py-16 flex flex-col items-center justify-center gap-4 animate-pulse">
        <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground">
          <RefreshCw className="w-6 h-6 animate-spin" />
        </div>
        <p className="text-xs font-mono text-muted-foreground">Memuat tiket klaim penjemputan...</p>
      </div>
    );
  }

  if (!claim) {
    return (
      <section className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="rounded-3xl border border-dashed border-border bg-card p-8 sm:p-14 text-center shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-5 shadow-2xs">
            <Ticket className="w-8 h-8" />
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold text-foreground font-headline tracking-tight">
            Belum Ada Tiket Klaim Penjemputan Aktif
          </h2>

          <p className="text-xs sm:text-sm text-muted-foreground font-body max-w-md mx-auto mt-2.5 leading-relaxed">
            Anda belum memiliki jadwal penjemputan hidangan pangan surplus. Silakan buka Radar Penyelamatan Pangan untuk memilih dan mengklaim porsi hidangan terdekat.
          </p>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Button
              asChild
              size="lg"
              className="rounded-xl font-headline font-bold text-xs sm:text-sm bg-primary hover:bg-primary/90 text-primary-foreground shadow-xs px-6 h-11 gap-2"
            >
              <Link href="/rescue">
                <Compass className="w-4 h-4" />
                <span>Jelajahi Radar Pangan</span>
              </Link>
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <HeroSection claim={claim} beneficiaryName={user?.name} />
      <ClaimDetailsSection initialClaim={claim} />
      <ClaimActionsSection claim={claim} />
    </>
  );
}
