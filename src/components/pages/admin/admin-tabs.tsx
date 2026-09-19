"use client";

import React, { useState } from "react";
import {
  AdminUserRecord,
  AdminTransactionRecord,
  toggleUserBan,
  adjustUserStrikes,
  resolveAdminDispute,
} from "@/actions/admin";
import { Button } from "@/components/ui/button";
import {
  Users,
  Scale,
  Receipt,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Ban,
  CheckCircle,
  Loader2,
  Check,
} from "lucide-react";

interface AdminTabsProps {
  initialUsers: AdminUserRecord[];
  initialDisputes: Array<{
    id: string;
    donor_id: string;
    donor_name: string;
    listing_title: string;
    reporter_name: string;
    reason: string;
    donor_statement: string | null;
    is_resolved: boolean;
    penalty_applied: boolean;
    created_at: string;
  }>;
  initialTransactions: AdminTransactionRecord[];
}

export function AdminTabs({
  initialUsers,
  initialDisputes,
  initialTransactions,
}: AdminTabsProps) {
  const [activeTab, setActiveTab] = useState<"users" | "disputes" | "ledger">("users");

  const [users, setUsers] = useState<AdminUserRecord[]>(initialUsers);
  const [disputes, setDisputes] = useState(initialDisputes);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // User moderation handlers
  const handleToggleBan = async (userId: string, currentBanned: boolean) => {
    setLoadingAction(`ban-${userId}`);
    setActionSuccess(null);

    const res = await toggleUserBan({ userId, isBanned: !currentBanned });
    setLoadingAction(null);

    if (res.success) {
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, is_banned: !currentBanned } : u))
      );
      setActionSuccess(`Status blokir pengguna berhasil diubah.`);
      setTimeout(() => setActionSuccess(null), 4000);
    }
  };

  const handleAdjustStrike = async (userId: string, currentStrikes: number, delta: number) => {
    const nextStrikes = Math.max(0, Math.min(3, currentStrikes + delta));
    setLoadingAction(`strike-${userId}`);
    setActionSuccess(null);

    const res = await adjustUserStrikes({ userId, strikesCount: nextStrikes });
    setLoadingAction(null);

    if (res.success) {
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId
            ? { ...u, strikes_count: nextStrikes, is_banned: nextStrikes >= 3 ? true : u.is_banned }
            : u
        )
      );
      setActionSuccess(`Jumlah strike berhasil diperbarui menjadi ${nextStrikes}/3.`);
      setTimeout(() => setActionSuccess(null), 4000);
    }
  };

  // Dispute resolution handler
  const handleResolveDispute = async (disputeId: string, penaltyApplied: boolean) => {
    setLoadingAction(`disp-${disputeId}`);
    setActionSuccess(null);

    const res = await resolveAdminDispute({ disputeId, penaltyApplied });
    setLoadingAction(null);

    if (res.success) {
      setDisputes((prev) =>
        prev.map((d) =>
          d.id === disputeId ? { ...d, is_resolved: true, penalty_applied: penaltyApplied } : d
        )
      );
      setActionSuccess(
        penaltyApplied
          ? "Sengketa diselesaikan: Pelanggaran terbukti dan 1 strike diterapkan."
          : "Sengketa diselesaikan: Klarifikasi diterima, donatur dibebaskan dari sanksi."
      );
      setTimeout(() => setActionSuccess(null), 4000);
    }
  };

  return (
    <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-4 space-y-6">
      {/* Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-border pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab("users")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-headline font-bold transition-all cursor-pointer ${
            activeTab === "users"
              ? "bg-primary text-primary-foreground shadow-xs"
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Manajemen Pengguna & Strike ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("disputes")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-headline font-bold transition-all cursor-pointer ${
            activeTab === "disputes"
              ? "bg-primary text-primary-foreground shadow-xs"
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
          }`}
        >
          <Scale className="w-4 h-4" />
          <span>Moderasi Sengketa ({disputes.filter((d) => !d.is_resolved).length} Terbuka)</span>
        </button>

        <button
          onClick={() => setActiveTab("ledger")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-headline font-bold transition-all cursor-pointer ${
            activeTab === "ledger"
              ? "bg-primary text-primary-foreground shadow-xs"
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
          }`}
        >
          <Receipt className="w-4 h-4" />
          <span>Audit Ledger & Arus Subsidi</span>
        </button>
      </div>

      {actionSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-body flex items-center gap-2 animate-in fade-in duration-200">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* TAB 1: USERS */}
      {activeTab === "users" && (
        <div className="rounded-3xl border border-border bg-card p-5 sm:p-7 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border/80">
            <div>
              <h3 className="font-headline font-bold text-base text-foreground">
                Daftar Akun Terdaftar & Kontrol Kepatuhan
              </h3>
              <p className="text-xs text-muted-foreground font-body">
                Kelola status sanksi strike (0/3), pembekuan akun pelanggar higienitas, dan kuota organisasi.
              </p>
            </div>
            <span className="text-xs font-mono text-muted-foreground bg-muted px-2.5 py-1 rounded-md">
              Total: {users.length} Akun
            </span>
          </div>

          <div className="overflow-x-auto -mx-2 sm:mx-0">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b border-border/80 text-[11px] font-mono font-bold text-muted-foreground uppercase tracking-wider">
                  <th className="py-3 px-3">Nama Entitas / Pengguna</th>
                  <th className="py-3 px-3">Peran & Tipe</th>
                  <th className="py-3 px-3">Alamat & Kontak</th>
                  <th className="py-3 px-3 text-center">Status Strike</th>
                  <th className="py-3 px-3 text-center">Status Akun</th>
                  <th className="py-3 px-3 text-right">Tindakan Moderasi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {users.map((u) => (
                  <tr key={u.id} className="group hover:bg-muted/40 transition-colors">
                    <td className="py-3.5 px-3 align-middle">
                      <div className="font-headline font-bold text-sm text-foreground">
                        {u.display_name}
                      </div>
                      <div className="text-[11px] font-mono text-muted-foreground">
                        ID: {u.id.slice(0, 8)}...
                      </div>
                    </td>

                    <td className="py-3.5 px-3 align-middle">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-muted text-xs font-mono font-semibold text-foreground capitalize">
                        {u.role} {u.is_organization && "• Lembaga"}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 align-middle max-w-xs">
                      <div className="text-xs font-body text-foreground truncate" title={u.address}>
                        {u.address}
                      </div>
                      <div className="text-[11px] font-mono text-muted-foreground">
                        {u.phone_number}
                      </div>
                    </td>

                    <td className="py-3.5 px-3 text-center align-middle">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono font-bold ${
                          u.strikes_count === 0
                            ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                            : u.strikes_count < 3
                            ? "bg-amber-100 text-amber-900 border border-amber-300"
                            : "bg-rose-100 text-rose-900 border border-rose-300"
                        }`}
                      >
                        {u.strikes_count}/3
                      </span>
                    </td>

                    <td className="py-3.5 px-3 text-center align-middle">
                      {u.is_banned ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-rose-100 text-rose-800 text-xs font-mono font-bold">
                          <Ban className="w-3 h-3" />
                          <span>DIBLOKIR</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-xs font-mono font-medium">
                          <CheckCircle className="w-3 h-3 text-emerald-600" />
                          <span>Aktif</span>
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-3 text-right align-middle">
                      <div className="inline-flex items-center gap-1.5">
                        {/* Adjust Strike button */}
                        {u.strikes_count < 3 ? (
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={loadingAction === `strike-${u.id}`}
                            onClick={() => handleAdjustStrike(u.id, u.strikes_count, 1)}
                            className="h-7 text-[11px] px-2 rounded-lg font-headline hover:bg-amber-50 hover:text-amber-800"
                          >
                            +1 Strike
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={loadingAction === `strike-${u.id}`}
                            onClick={() => handleAdjustStrike(u.id, u.strikes_count, -3)}
                            className="h-7 text-[11px] px-2 rounded-lg font-headline hover:bg-emerald-50 hover:text-emerald-800"
                          >
                            Reset
                          </Button>
                        )}

                        {/* Ban / Unban button */}
                        <Button
                          size="sm"
                          variant="ghost"
                          disabled={loadingAction === `ban-${u.id}`}
                          onClick={() => handleToggleBan(u.id, u.is_banned)}
                          className={`h-7 text-[11px] px-2.5 rounded-lg font-headline font-semibold ${
                            u.is_banned
                              ? "text-emerald-700 hover:bg-emerald-50"
                              : "text-rose-700 hover:bg-rose-50"
                          }`}
                        >
                          {loadingAction === `ban-${u.id}` ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : u.is_banned ? (
                            "Buka Blokir"
                          ) : (
                            "Blokir"
                          )}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: DISPUTES */}
      {activeTab === "disputes" && (
        <div className="rounded-3xl border border-border bg-card p-5 sm:p-7 shadow-xs space-y-4">
          <div className="pb-3 border-b border-border/80">
            <h3 className="font-headline font-bold text-base text-foreground">
              Antrean Moderasi Sengketa & Investigasi HACCP
            </h3>
            <p className="text-xs text-muted-foreground font-body">
              Tinjau sanggahan donatur dan buat keputusan final apakah penalti strike perlu dijatuhkan.
            </p>
          </div>

          <div className="space-y-4">
            {disputes.map((d, index) => (
              <div
                key={d.id}
                className="p-5 rounded-2xl border border-border bg-muted/30 space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border/60">
                  <div>
                    <span className="font-mono text-xs font-bold text-primary">
                      KASUS #{d.id.slice(0, 8)} • LAPORAN KE-{index + 1}
                    </span>
                    <h4 className="font-headline font-bold text-sm text-foreground mt-0.5">
                      {d.listing_title}
                    </h4>
                  </div>
                  <div>
                    {d.is_resolved ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-mono font-bold text-emerald-800">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>{d.penalty_applied ? "Selesai (Strike Dijatuhkan)" : "Selesai (Dibebaskan)"}</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 border border-amber-300 text-xs font-mono font-bold text-amber-900">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Menunggu Keputusan Pengawas</span>
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-body">
                  <div className="space-y-1 bg-background p-3.5 rounded-xl border border-border/60">
                    <span className="font-headline font-bold text-foreground block">
                      Laporan Pelapor ({d.reporter_name}):
                    </span>
                    <p className="text-muted-foreground italic">&ldquo;{d.reason}&rdquo;</p>
                  </div>

                  <div className="space-y-1 bg-background p-3.5 rounded-xl border border-border/60">
                    <span className="font-headline font-bold text-foreground block">
                      Sanggahan Donatur ({d.donor_name}):
                    </span>
                    <p className="text-muted-foreground">
                      {d.donor_statement || "Belum ada pernyataan sanggahan yang dikirimkan."}
                    </p>
                  </div>
                </div>

                {!d.is_resolved && (
                  <div className="pt-2 flex flex-wrap items-center justify-end gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={loadingAction === `disp-${d.id}`}
                      onClick={() => handleResolveDispute(d.id, false)}
                      className="rounded-xl text-xs font-semibold hover:bg-emerald-50 hover:text-emerald-800"
                    >
                      Bebaskan (Good Samaritan Berlaku)
                    </Button>
                    <Button
                      size="sm"
                      disabled={loadingAction === `disp-${d.id}`}
                      onClick={() => handleResolveDispute(d.id, true)}
                      className="rounded-xl text-xs font-headline font-semibold bg-rose-600 text-white hover:bg-rose-700"
                    >
                      Terapkan Strike Pelanggaran (+1)
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: LEDGER */}
      {activeTab === "ledger" && (
        <div className="rounded-3xl border border-border bg-card p-5 sm:p-7 shadow-xs space-y-4">
          <div className="pb-3 border-b border-border/80 flex items-center justify-between">
            <div>
              <h3 className="font-headline font-bold text-base text-foreground">
                Audit Ledger Finansial & Reverse Tipping Fee
              </h3>
              <p className="text-xs text-muted-foreground font-body">
                Rekonsiliasi transaksi aliran dana subsidi platform (Rp12.000), tarif donatur, dan insentif pengolah limbah.
              </p>
            </div>
            <span className="text-xs font-mono text-muted-foreground bg-muted px-2.5 py-1 rounded-md">
              {initialTransactions.length} Transaksi
            </span>
          </div>

          <div className="overflow-x-auto -mx-2 sm:mx-0">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-border/80 text-[11px] font-mono font-bold text-muted-foreground uppercase tracking-wider">
                  <th className="py-3 px-3">Tanggal & Jam</th>
                  <th className="py-3 px-3">Pihak Entitas</th>
                  <th className="py-3 px-4">Deskripsi Transaksi</th>
                  <th className="py-3 px-3 text-right">Nominal (IDR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {initialTransactions.map((tx) => {
                  const isPositive = tx.amount > 0;
                  return (
                    <tr key={tx.id} className="group hover:bg-muted/40 transition-colors">
                      <td className="py-3 px-3 font-mono text-xs text-muted-foreground align-middle">
                        {new Date(tx.created_at).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>

                      <td className="py-3 px-3 font-headline font-bold text-xs text-foreground align-middle">
                        {tx.user_name}
                      </td>

                      <td className="py-3 px-4 font-body text-xs text-foreground align-middle">
                        {tx.description}
                      </td>

                      <td className="py-3 px-3 text-right align-middle">
                        <span
                          className={`font-mono text-xs sm:text-sm font-bold ${
                            isPositive ? "text-emerald-600" : "text-foreground"
                          }`}
                        >
                          {isPositive ? "+" : ""}
                          Rp{Math.abs(tx.amount).toLocaleString("id-ID")}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}
