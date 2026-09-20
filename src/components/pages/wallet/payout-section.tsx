"use client";

import React, { useState } from "react";
import {
  ArrowDownToLine,
  Banknote,
  CheckCircle2,
  Clock,
  Lock,
  Utensils,
  Droplet,
  Coffee,
  Info,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

/* =========================================================================
   CONFIGURABLE DATA & CONSTANTS (EASY TO EDIT AT TOP OF FILE)
   ========================================================================= */

export const WALLET_PAYOUT_DATA = {
  payoutForm: {
    title: "Tarik Saldo Insentif ke Rekening Perusahaan",
    gatewayBadge: "BI-FAST 24/7 Enabled",
    accountsLabel: "Pilih Rekening Bank Mitra Terdaftar",
    accounts: [
      {
        id: "mandiri",
        bankName: "Bank Mandiri",
        accountNumber: "137-00-189283-9",
        tag: "UTAMA (REKONSILIASI)",
        isPrimary: true,
      },
      {
        id: "bca",
        bankName: "BCA Bisnis",
        accountNumber: "088-729-1029",
        tag: "CADANGAN",
        isPrimary: false,
      },
      {
        id: "bri",
        bankName: "BRI Corporate",
        accountNumber: "002-192-8821",
        tag: "OPERASIONAL",
        isPrimary: false,
      },
    ],
    amountLabel: "Nominal Penarikan (IDR)",
    maxWithdrawLabel: "Tarik Maksimal",
    defaultAmount: "14.850.000",
    refLabel: "Catatan Referensi Internal (ERP/SAP)",
    defaultRefNote: "PAYOUT-REVERSE-TIP-MAY25",
    perks: {
      adminFee: "Bebas Biaya Admin (Corporate Tier A)",
      estimation: "Estimasi: Instan (< 60 detik via BI-FAST)",
    },
    authorizationNotice:
      "Otorisasi dual-signature diverifikasi oleh Tim Keuangan PT Boga Sejahtera.",
    submitButtonText: "Konfirmasi & Payout Sekarang",
  },
  tariffIndex: {
    title: "Indeks Tarif Insentif Sirkular",
    dateBadge: "Update Mei 2025",
    description:
      "Nilai reverse tipping fee yang diterima generator limbah per kilogram material terpilah dan tersertifikasi lolos timbang IoT dock.",
    tariffs: [
      {
        id: "kitchen_waste",
        title: "Sisa Dapur Komersial / Hotel",
        subtitle: "Feedstock Larva Black Soldier Fly (BSF)",
        rate: "Rp 500",
        unit: "/ kg tersertifikasi",
        isPrimaryRate: true,
        icon: Utensils,
        iconColor: "text-primary bg-accent/70 border-primary/25",
      },
      {
        id: "uco",
        title: "Minyak Jelantah (UCO)",
        subtitle: "Bahan Baku Sustainable Aviation Fuel (SAF)",
        rate: "Rp 7.500",
        unit: "/ kg terfilter",
        isPrimaryRate: false,
        icon: Droplet,
        iconColor: "text-amber-600 bg-amber-50 border-amber-200",
      },
      {
        id: "coffee_dry_organic",
        title: "Ampas Kopi & Organik Kering",
        subtitle: "Bio-pellet & Substrat Jamur Tiram",
        rate: "Rp 350",
        unit: "/ kg densitas tinggi",
        isPrimaryRate: false,
        icon: Coffee,
        iconColor: "text-secondary bg-muted border-border",
      },
    ],
    footer: {
      benchmarkText: "Benchmark Asosiasi Biokonversi Bali",
      slaLinkText: "Ketentuan SLA Mutu >",
      slaUrl: "#",
    },
  },
};

/* =========================================================================
   COMPONENT IMPLEMENTATION
   ========================================================================= */

import { requestPayoutAction } from "@/actions/wallet";

interface PayoutSectionProps {
  activeBalance?: number;
}

export function PayoutSection({ activeBalance = 180000 }: PayoutSectionProps) {
  const { payoutForm, tariffIndex } = WALLET_PAYOUT_DATA;

  // Form states
  const [selectedAccountId, setSelectedAccountId] = useState("mandiri");
  const [withdrawAmount, setWithdrawAmount] = useState(
    activeBalance > 0 ? activeBalance.toLocaleString("id-ID") : "100.000"
  );
  const [refNote, setRefNote] = useState(payoutForm.defaultRefNote);
  const [isProcessing, setIsProcessing] = useState(false);
  const [payoutSuccess, setPayoutSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleMaxWithdraw = () => {
    setWithdrawAmount(activeBalance.toLocaleString("id-ID"));
    setErrorMessage(null);
  };

  const handleConfirmPayout = async () => {
    setErrorMessage(null);
    const cleanAmount = parseInt(withdrawAmount.replace(/\D/g, ""), 10);
    if (isNaN(cleanAmount) || cleanAmount < 10000) {
      setErrorMessage("Nominal penarikan minimal Rp 10.000.");
      return;
    }

    const selectedAcc = payoutForm.accounts.find((a) => a.id === selectedAccountId) || payoutForm.accounts[0];

    setIsProcessing(true);
    try {
      const res = await requestPayoutAction({
        amount: cleanAmount,
        bankName: selectedAcc.bankName,
        accountNumber: selectedAcc.accountNumber,
        refNote: refNote.trim(),
      });

      if (res.success) {
        setPayoutSuccess(true);
        setTimeout(() => {
          setPayoutSuccess(false);
          window.location.reload();
        }, 2000);
      } else {
        setErrorMessage(res.error || "Gagal memproses penarikan saldo.");
      }
    } catch (err: any) {
      setErrorMessage(err?.message || "Terjadi kesalahan jaringan.");
    } finally {
      setIsProcessing(false);
    }
  };


  return (
    <section className="w-full max-w-6xl mx-auto px-4 sm:px-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ===================================================================
            LEFT COLUMN (7 COLS): Tarik Saldo Insentif ke Rekening Perusahaan
            =================================================================== */}
        <div className="lg:col-span-7 w-full">
          <div className="rounded-3xl border border-border bg-card p-6 sm:p-7 shadow-[0_4px_24px_-4px_rgba(11,27,61,0.05)] flex flex-col gap-5">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-5 border-b border-border/70">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-accent text-primary flex items-center justify-center shrink-0 border border-primary/20">
                  <ArrowDownToLine className="w-4 h-4 text-primary" />
                </div>
                <h2 className="text-base sm:text-lg font-bold text-foreground font-headline">
                  {payoutForm.title}
                </h2>
              </div>
              <span className="font-mono text-[10px] font-bold text-muted-foreground bg-muted/70 px-2.5 py-1 rounded-md border border-border self-start sm:self-auto">
                {payoutForm.gatewayBadge}
              </span>
            </div>

            {/* 3 Bank Account Cards Selector */}
            <div>
              <label className="text-xs font-bold text-foreground font-headline block mb-2.5">
                {payoutForm.accountsLabel}
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {payoutForm.accounts.map((acc) => {
                  const isSelected = selectedAccountId === acc.id;

                  return (
                    <div
                      key={acc.id}
                      onClick={() => setSelectedAccountId(acc.id)}
                      className={`p-3.5 rounded-2xl cursor-pointer transition-all border flex items-start gap-2.5 ${
                        isSelected
                          ? "border-2 border-primary bg-card shadow-xs"
                          : "border-border bg-card hover:bg-muted/30"
                      }`}
                    >
                      {/* Radio Circle */}
                      <div className="mt-0.5 shrink-0">
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            isSelected
                              ? "border-primary bg-primary"
                              : "border-muted-foreground/40 bg-card"
                          }`}
                        >
                          {isSelected && (
                            <span className="w-1.5 h-1.5 rounded-full bg-white" />
                          )}
                        </div>
                      </div>

                      {/* Bank Details */}
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-foreground font-headline truncate">
                          {acc.bankName}
                        </h4>
                        <p className="text-[11px] font-mono text-muted-foreground mt-0.5 truncate">
                          {acc.accountNumber}
                        </p>
                        <span
                          className={`text-[9px] font-bold uppercase tracking-wider block mt-1 ${
                            isSelected ? "text-primary" : "text-muted-foreground"
                          }`}
                        >
                          {acc.tag}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Nominal Penarikan & Ref Note (2 Columns) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
              {/* Left: Amount Input */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-foreground font-headline">
                    {payoutForm.amountLabel}
                  </label>
                  <button
                    type="button"
                    onClick={handleMaxWithdraw}
                    className="text-[11px] font-bold text-primary hover:underline font-headline"
                  >
                    {payoutForm.maxWithdrawLabel}
                  </button>
                </div>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground font-mono pointer-events-none">
                    Rp
                  </span>
                  <input
                    type="text"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    className="field pl-10 pr-3.5 py-2.5 text-sm sm:text-base font-extrabold font-mono text-foreground"
                  />
                </div>
              </div>

              {/* Right: Ref Note Input */}
              <div>
                <label className="text-xs font-bold text-foreground font-headline block mb-1.5">
                  {payoutForm.refLabel}
                </label>
                <input
                  type="text"
                  value={refNote}
                  onChange={(e) => setRefNote(e.target.value)}
                  className="field px-3.5 py-2.5 text-xs sm:text-sm font-mono text-foreground"
                />
              </div>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-semibold flex items-center gap-2">
                <span>{errorMessage}</span>
              </div>
            )}

            {payoutSuccess && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Permintaan payout berhasil dikonfirmasi dan saldo telah terpotong di database!</span>
              </div>
            )}

            {/* Bottom Row: Authorization Note & Submit Button */}
            <div className="pt-4 border-t border-border/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <p className="text-[11px] text-muted-foreground font-body leading-relaxed max-w-xs">
                {payoutForm.authorizationNotice}
              </p>

              <Button
                type="button"
                disabled={isProcessing}
                onClick={handleConfirmPayout}
                className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground font-headline font-bold text-xs sm:text-sm rounded-xl py-3 px-6 h-12 gap-2 shadow-xs shrink-0"
              >
                <Lock className="w-4 h-4" />
                <span>
                  {isProcessing
                    ? "Memproses..."
                    : payoutSuccess
                    ? "Payout Berhasil!"
                    : payoutForm.submitButtonText}
                </span>
              </Button>
            </div>
          </div>
        </div>

        {/* ===================================================================
            RIGHT COLUMN (5 COLS): Indeks Tarif Insentif Sirkular
            =================================================================== */}
        <div className="lg:col-span-5 w-full">
          <div className="rounded-3xl border border-border bg-card p-6 sm:p-7 shadow-[0_4px_24px_-4px_rgba(11,27,61,0.05)] flex flex-col gap-4">
            {/* Header */}
            <div className="flex items-center justify-between pb-3.5 border-b border-border/70">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-accent text-primary flex items-center justify-center shrink-0 border border-primary/20">
                  <Banknote className="w-4 h-4 text-primary" />
                </div>
                <h2 className="text-base sm:text-lg font-bold text-foreground font-headline">
                  {tariffIndex.title}
                </h2>
              </div>
              <span className="text-[11px] font-medium text-muted-foreground font-body">
                {tariffIndex.dateBadge}
              </span>
            </div>

            {/* Subtitle */}
            <p className="text-xs text-muted-foreground font-body leading-relaxed">
              {tariffIndex.description}
            </p>

            {/* 3 Tariff Cards */}
            <div className="flex flex-col gap-3 mt-1">
              {tariffIndex.tariffs.map((tariff) => {
                const Icon = tariff.icon;

                return (
                  <div
                    key={tariff.id}
                    className="p-3.5 rounded-2xl border border-border bg-card shadow-2xs flex items-center justify-between gap-3 hover:bg-muted/20 transition-colors"
                  >
                    {/* Left side: Icon & Name */}
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${tariff.iconColor}`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-foreground font-headline truncate">
                          {tariff.title}
                        </h4>
                        <p className="text-[11px] text-muted-foreground font-body leading-tight mt-0.5 truncate">
                          {tariff.subtitle}
                        </p>
                      </div>
                    </div>

                    {/* Right side: Rate */}
                    <div className="text-right shrink-0">
                      <span
                        className={`text-base sm:text-lg font-extrabold font-headline block tracking-tight ${
                          tariff.isPrimaryRate ? "text-primary" : "text-foreground"
                        }`}
                      >
                        {tariff.rate}
                      </span>
                      <span className="text-[10px] text-muted-foreground font-mono block">
                        {tariff.unit}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Footer: SLA Benchmark */}
            <div className="pt-3 border-t border-border/70 flex items-center justify-between gap-2 text-[11px]">
              <div className="flex items-center gap-1.5 text-muted-foreground font-body">
                <Info className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                <span>{tariffIndex.footer.benchmarkText}</span>
              </div>
              <a
                href={tariffIndex.footer.slaUrl}
                className="font-bold text-foreground hover:text-primary font-headline transition-colors flex items-center gap-0.5"
              >
                <span>{tariffIndex.footer.slaLinkText}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
