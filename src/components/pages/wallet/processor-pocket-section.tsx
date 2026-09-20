"use client";

import React, { useState } from "react";
import {
  Wallet,
  PlusCircle,
  CreditCard,
  QrCode,
  Building,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowUpRight,
  TrendingDown,
  Scale,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { topUpProcessorWallet } from "@/actions/wallet";

interface ProcessorPocketSectionProps {
  initialBalance: number;
  reverseTippingTotal: number;
  logisticsSubsidyTotal: number;
}

const TOPUP_PRESETS = [100000, 250000, 500000, 1000000, 2500000];

const PAYMENT_METHODS = [
  { id: "qris", name: "QRIS Instan (GoPay, OVO, ShopeePay, BCA)", icon: QrCode, badge: "Instan" },
  { id: "bca_va", name: "BCA Virtual Account", icon: CreditCard, badge: "Otomatis" },
  { id: "mandiri_va", name: "Mandiri Virtual Account", icon: Building, badge: "Otomatis" },
  { id: "bri_va", name: "BRI Virtual Account", icon: CreditCard, badge: "Otomatis" },
];

export function ProcessorPocketSection({
  initialBalance,
  reverseTippingTotal,
  logisticsSubsidyTotal,
}: ProcessorPocketSectionProps) {
  const [balance, setBalance] = useState<number>(initialBalance);
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState<number>(250000);
  const [selectedMethod, setSelectedMethod] = useState<string>("qris");
  const [isProcessing, setIsProcessing] = useState(false);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  const handleTopUpSubmit = async () => {
    if (topUpAmount < 10000) {
      setErrorNotice("Nominal top-up minimal Rp 10.000");
      return;
    }

    setIsProcessing(true);
    setErrorNotice(null);

    const methodName = PAYMENT_METHODS.find((m) => m.id === selectedMethod)?.name || "Virtual Account";

    try {
      const res = await topUpProcessorWallet({
        amount: topUpAmount,
        paymentMethod: methodName,
      });

      if (res.success && res.newBalance !== undefined) {
        setBalance(res.newBalance);
        setSuccessNotice(`Top-Up sebesar Rp ${topUpAmount.toLocaleString("id-ID")} berhasil! Saldo operasional telah diperbarui di database.`);
        setTimeout(() => {
          setShowTopUpModal(false);
          setSuccessNotice(null);
        }, 2000);
      } else {
        setErrorNotice(res.error || "Gagal memproses top up.");
      }
    } catch (err: any) {
      setErrorNotice(err?.message || "Terjadi kesalahan koneksi.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <section className="w-full max-w-6xl mx-auto px-4 sm:px-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Card Utama: Saldo Dompet Operasional Pengolah B2B */}
        <Card className="lg:col-span-7 p-6 sm:p-8 rounded-3xl border border-border bg-gradient-to-br from-card via-card to-primary/5 shadow-xs flex flex-col justify-between space-y-6 relative overflow-hidden">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
                  <Wallet className="w-5 h-5" />
                </span>
                <div>
                  <span className="text-[11px] font-headline font-bold uppercase tracking-wider text-muted-foreground block">
                    Saldo Operasional Pengolah
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-foreground font-semibold">
                    <span>CV Bali Biokonversi Sirkular</span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
                      <ShieldCheck className="w-3 h-3" />
                      Terverifikasi DLHK
                    </span>
                  </div>
                </div>
              </div>

              <Button
                type="button"
                onClick={() => {
                  setShowTopUpModal(true);
                  setSuccessNotice(null);
                  setErrorNotice(null);
                }}
                className="bg-primary hover:bg-primary/90 text-white font-headline font-bold text-xs rounded-xl px-4 py-2 gap-1.5 shadow-xs"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Top-Up Saldo</span>
              </Button>
            </div>

            <div>
              <span className="text-xs text-muted-foreground font-body block">
                Total Saldo Dompet Siap Digunakan
              </span>
              <div className="text-3xl sm:text-4xl font-extrabold font-mono text-foreground mt-1 tracking-tight">
                Rp {balance.toLocaleString("id-ID")}
              </div>
              <p className="text-xs text-muted-foreground font-body mt-1">
                Digunakan untuk mendanai biaya penebusan substrat residu organik dari donatur dan armada jemput.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-border/70 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-muted-foreground">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Rekening Escrow Biokonversi Terproteksi</span>
            </div>
            <button
              type="button"
              onClick={() => setShowTopUpModal(true)}
              className="text-primary font-bold hover:underline font-headline text-xs flex items-center gap-1"
            >
              <span>Isi Saldo Tambahan</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </Card>

        {/* Card Samping: Metrik Biaya Pengadaan & Substrat */}
        <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
          <Card className="p-5 rounded-3xl border border-border bg-card shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-headline font-bold uppercase tracking-wider text-muted-foreground">
                Total Tebus Substrat
              </span>
              <TrendingDown className="w-4 h-4 text-amber-600" />
            </div>
            <div className="mt-2">
              <span className="font-mono text-xl sm:text-2xl font-extrabold text-foreground">
                Rp {reverseTippingTotal.toLocaleString("id-ID")}
              </span>
              <p className="text-[11px] text-muted-foreground font-body mt-0.5">
                Alokasi dana pembelian bahan pakan maggot BSF & biodigester.
              </p>
            </div>
          </Card>

          <Card className="p-5 rounded-3xl border border-border bg-card shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-headline font-bold uppercase tracking-wider text-muted-foreground">
                Kapasitas Olah Bulanan
              </span>
              <Scale className="w-4 h-4 text-primary" />
            </div>
            <div className="mt-2">
              <span className="font-mono text-xl sm:text-2xl font-extrabold text-primary">
                15.000 kg / bulan
              </span>
              <p className="text-[11px] text-muted-foreground font-body mt-0.5">
                Target biokonversi fasilitas sentral Tabanan & Denpasar Hub.
              </p>
            </div>
          </Card>
        </div>
      </div>

      {/* Modal Top-Up Saldo Operasional (Layaknya Customer B2B) */}
      <Dialog open={showTopUpModal} onOpenChange={(open) => !open && setShowTopUpModal(false)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
                <PlusCircle className="w-4 h-4" />
              </span>
              <DialogTitle className="text-base sm:text-lg">
                Top-Up Saldo Dompet Operasional
              </DialogTitle>
            </div>
            <DialogDescription className="text-xs text-muted-foreground">
              Isi saldo dompet untuk mendanai penebusan limbah organik dan operasional armada biokonversi.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2 text-xs">
            {/* Alert Status */}
            {successNotice && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{successNotice}</span>
              </div>
            )}

            {errorNotice && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-400 font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorNotice}</span>
              </div>
            )}

            {/* Input Nominal Top-Up */}
            <div>
              <label className="text-xs font-bold text-foreground font-headline block mb-1.5">
                Pilih atau Masukkan Nominal Top-Up
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground font-mono pointer-events-none">
                  Rp
                </span>
                <input
                  type="number"
                  min="10000"
                  step="10000"
                  value={topUpAmount}
                  onChange={(e) => setTopUpAmount(Number(e.target.value))}
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-border bg-background text-base font-mono font-extrabold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* Quick Presets */}
              <div className="flex flex-wrap items-center gap-2 mt-2.5">
                {TOPUP_PRESETS.map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setTopUpAmount(val)}
                    className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all border ${
                      topUpAmount === val
                        ? "bg-primary text-white border-primary shadow-2xs"
                        : "bg-muted/50 text-foreground border-border hover:bg-muted"
                    }`}
                  >
                    Rp {val.toLocaleString("id-ID")}
                  </button>
                ))}
              </div>
            </div>

            {/* Pilihan Metode Pembayaran */}
            <div className="pt-2">
              <label className="text-xs font-bold text-foreground font-headline block mb-2">
                Metode Pembayaran
              </label>
              <div className="space-y-2">
                {PAYMENT_METHODS.map((method) => {
                  const Icon = method.icon;
                  const isSelected = selectedMethod === method.id;

                  return (
                    <div
                      key={method.id}
                      onClick={() => setSelectedMethod(method.id)}
                      className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                        isSelected
                          ? "border-2 border-primary bg-primary/5"
                          : "border-border bg-card hover:bg-muted/40"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          isSelected ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                        }`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="font-semibold text-foreground text-xs">{method.name}</span>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-muted text-muted-foreground">
                        {method.badge}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Ringkasan Pembayaran */}
            <div className="p-3 rounded-xl bg-muted/40 border border-border/70 space-y-1.5 font-mono text-xs">
              <div className="flex items-center justify-between text-muted-foreground">
                <span>Nominal Pengisian:</span>
                <span>Rp {topUpAmount.toLocaleString("id-ID")}</span>
              </div>
              <div className="flex items-center justify-between text-muted-foreground">
                <span>Biaya Admin (B2B Subsidy):</span>
                <span className="text-emerald-600 font-bold">Rp 0 (GRATIS)</span>
              </div>
              <div className="pt-1.5 border-t border-border/70 flex items-center justify-between text-foreground font-bold">
                <span>Total Pembayaran:</span>
                <span className="text-primary text-sm">Rp {topUpAmount.toLocaleString("id-ID")}</span>
              </div>
            </div>
          </div>

          <DialogFooter className="flex items-center justify-between gap-2 pt-2 border-t border-border/60">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowTopUpModal(false)}
              className="text-xs font-headline font-semibold"
            >
              Batal
            </Button>
            <Button
              type="button"
              size="sm"
              disabled={isProcessing || topUpAmount < 10000}
              onClick={handleTopUpSubmit}
              className="bg-primary hover:bg-primary/90 text-white font-headline font-bold text-xs rounded-xl px-5 gap-2 shadow-xs"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Memproses Pembayaran...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Bayar & Isi Saldo Sekarang</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
