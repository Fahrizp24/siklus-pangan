"use client";

import React from "react";
import { ShieldCheck, CheckCircle2, AlertTriangle, Building2, User } from "lucide-react";
import { UserProfile } from "@/actions/profile";

interface ProfileHeaderProps {
  profile: UserProfile;
}

export function ProfileHeader({ profile }: ProfileHeaderProps) {
  const getRoleTitle = (role: string) => {
    switch (role) {
      case "donor":
        return "Donatur Pangan Terverifikasi";
      case "processor":
        return "Pengolah Residu Organik";
      case "admin":
        return "Pengawas DLHK / Administrator";
      default:
        return profile.is_organization ? "Organisasi Sosial / Panti Asuhan" : "Penerima Manfaat Komunitas";
    }
  };

  const initials = profile.display_name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <section className="w-full max-w-4xl mx-auto px-4 sm:px-6 pt-4">
      <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-xs relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-0" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4 sm:gap-5">
            {/* Avatar Initials */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-primary/10 border-2 border-primary/20 flex items-center justify-center font-headline font-extrabold text-xl sm:text-2xl text-primary shadow-inner shrink-0">
              {initials || "SP"}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-foreground font-headline">
                  {profile.display_name}
                </h1>
                <CheckCircle2 className="w-5 h-5 text-primary fill-primary/10 shrink-0" />
              </div>

              <p className="text-xs sm:text-sm text-muted-foreground font-body">
                {profile.email}
              </p>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-muted border border-border text-xs font-mono font-medium text-foreground">
                  {profile.is_organization ? (
                    <Building2 className="w-3 h-3 text-primary" />
                  ) : (
                    <User className="w-3 h-3 text-primary" />
                  )}
                  <span>{getRoleTitle(profile.role)}</span>
                </span>

                {profile.is_organization && profile.organization_capacity && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-primary/10 border border-primary/20 text-xs font-mono font-semibold text-primary">
                    Kapasitas: {profile.organization_capacity} Jiwa
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Zero-Strike Status Pill */}
          <div className="flex flex-col sm:items-end justify-center shrink-0">
            {profile.strikes_count === 0 ? (
              <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono font-bold shadow-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <div className="font-headline font-extrabold text-xs">Status: Zero Strike (0/3)</div>
                  <div className="text-[10px] font-normal text-emerald-700 font-body">Kepatuhan Good Samaritan 100%</div>
                </div>
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-mono font-bold shadow-xs">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <div>
                  <div className="font-headline font-extrabold text-xs">Status: {profile.strikes_count}/3 Pelanggaran</div>
                  <div className="text-[10px] font-normal text-amber-700 font-body">Audit Penanganan Pangan Aktif</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
