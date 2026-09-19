"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Recycle,
  Scale,
  MapPin,
  Building2,
  Phone,
  CheckCircle2,
  Truck,
  ArrowRight,
  ExternalLink,
  Filter,
  Search,
  Check,
  Clock,
  Sparkles,
  Loader2,
  DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StatusPill } from "@/components/ui/status-pill";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { ProcessorWasteItem, claimWasteBatchByProcessor } from "@/actions/waste";

interface ProcessorWasteFeedProps {
  initialBatches: ProcessorWasteItem[];
}

export function ProcessorWasteFeed({ initialBatches }: ProcessorWasteFeedProps) {
  const [batches, setBatches] = useState<ProcessorWasteItem[]>(initialBatches);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedBatch, setSelectedBatch] = useState<ProcessorWasteItem | null>(null);
  const [isClaiming, setIsClaiming] = useState(false);
  const [claimSuccess, setClaimSuccess] = useState(false);

  // Filter batches
  const filteredBatches = batches.filter((b) => {
    const matchesCategory = selectedCategory === "all" || b.category === selectedCategory;
    const matchesSearch =
      b.donorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.donorAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.batchNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const totalAvailableKg = batches
    .filter((b) => !b.isCollected)
    .reduce((sum, b) => sum + b.weightKg, 0);

  const totalReadyBatches = batches.filter((b) => !b.isCollected).length;

  const handleClaim = async (batchId: string) => {
    setIsClaiming(true);
    try {
      const res = await claimWasteBatchByProcessor(batchId);
      if (res.success) {
        setBatches((prev) =>
          prev.map((b) => (b.id === batchId ? { ...b, isCollected: true } : b))
        );
        if (selectedBatch && selectedBatch.id === batchId) {
          setSelectedBatch({ ...selectedBatch, isCollected: true });
        }
        setClaimSuccess(true);
        setTimeout(() => setClaimSuccess(false), 4000);
      }
    } catch (err) {
      console.error("claim error:", err);
    } finally {
      setIsClaiming(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 flex flex-col gap-6">
      {/* Hero Header Radar Pengolah */}
      <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl -z-0 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-mono font-bold">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span>LIVE RADAR PASOKAN LIMBAH ORGANIK</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground font-headline tracking-tight">
              Bursa Substrat Biokonversi & Pakan Ternak
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground font-body leading-relaxed">
              Monitoring ketersediaan residu organik terpilah dari hotel, restoran, & katering donatur di Bali. Angkut batch untuk pakan larva BSF, unggas, atau bahan baku biodigester.
            </p>
          </div>

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-2 gap-3 shrink-0">
            <div className="p-4 rounded-2xl bg-muted/40 border border-border/80 text-center">
              <span className="text-[10px] uppercase font-headline font-bold text-muted-foreground block">
                Substrat Siap Angkut
              </span>
              <span className="font-mono text-xl sm:text-2xl font-extrabold text-primary block mt-0.5">
                {totalAvailableKg.toLocaleString("id-ID")} kg
              </span>
              <span className="text-[10px] text-muted-foreground mt-0.5 block">
                {totalReadyBatches} batch aktif
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center">
              <span className="text-[10px] uppercase font-headline font-bold text-emerald-700 dark:text-emerald-400 block">
                Standar Substrat BSF
              </span>
              <span className="font-mono text-xl sm:text-2xl font-extrabold text-emerald-700 dark:text-emerald-400 block mt-0.5">
                98.8%
              </span>
              <span className="text-[10px] text-emerald-600/80 dark:text-emerald-400/80 mt-0.5 block">
                Grade A Terverifikasi
              </span>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="mt-6 pt-5 border-t border-border/70 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: "all", label: "Semua Kategori" },
              { id: "bsf_maggot", label: "Maggot BSF" },
              { id: "poultry_fish", label: "Pakan Unggas" },
              { id: "compost_biogas", label: "Kompos & Biogas" },
            ].map((tab) => (
              <Button
                key={tab.id}
                type="button"
                variant={selectedCategory === tab.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(tab.id)}
                className={`rounded-xl text-xs font-headline font-semibold h-8 px-3 ${
                  selectedCategory === tab.id
                    ? "bg-primary text-white"
                    : "border-border text-foreground hover:bg-muted"
                }`}
              >
                {tab.label}
              </Button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Cari donatur atau lokasi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-border bg-background text-xs font-body text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>
      </div>

      {/* Grid Kartu Limbah Organik (Radar Pengolah) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredBatches.length === 0 ? (
          <div className="col-span-full py-16 text-center">
            <div className="flex flex-col items-center justify-center max-w-sm mx-auto text-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground border border-border">
                <Recycle className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-bold font-headline text-foreground text-base">
                Belum Ada Pasokan Limbah yang Cocok
              </h3>
              <p className="text-xs text-muted-foreground font-body leading-relaxed">
                Tidak ada batch limbah organik yang sesuai dengan filter pencarian saat ini. Silakan periksa kategori lain.
              </p>
            </div>
          </div>
        ) : (
          filteredBatches.map((item) => (
            <Card
              key={item.id}
              className="overflow-hidden border border-border/80 hover:border-primary/50 transition-all hover:shadow-md flex flex-col justify-between group"
            >
              <div>
                {/* Photo Header */}
                <div className="relative w-full h-44 bg-muted overflow-hidden">
                  <Image
                    src={item.imageUrl}
                    alt={item.categoryLabel}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                  {/* Badges on Photo */}
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    <span className="px-2.5 py-1 rounded-md bg-black/75 backdrop-blur-xs text-white text-[10px] font-mono font-bold">
                      {item.batchNumber}
                    </span>
                    <span className="px-2 py-1 rounded-md bg-emerald-600 text-white text-[10px] font-bold">
                      {item.purity.grade}
                    </span>
                  </div>

                  <div className="absolute top-2.5 right-2.5">
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold ${
                      item.isCollected
                        ? "bg-muted/90 text-foreground border border-border"
                        : "bg-emerald-500 text-white shadow-xs animate-pulse"
                    }`}>
                      {item.isCollected ? "Selesai Dijemput" : "Siap Angkut"}
                    </span>
                  </div>

                  {/* Bottom Strip on Image: Weight & Date */}
                  <div className="absolute bottom-2.5 inset-x-2.5 flex items-center justify-between text-white text-xs">
                    <span className="font-mono font-extrabold text-base bg-primary/90 px-2.5 py-0.5 rounded-lg">
                      {item.weightKg} kg
                    </span>
                    <span className="text-[11px] text-white/90 font-mono">
                      {item.formattedDate}
                    </span>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-bold text-foreground font-headline text-sm line-clamp-1 group-hover:text-primary transition-colors">
                      {item.categoryLabel}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                      <Building2 className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span className="font-semibold text-foreground truncate">{item.donorName}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground mt-0.5">
                      <MapPin className="w-3 h-3 text-muted-foreground shrink-0" />
                      <span className="truncate">{item.donorAddress}</span>
                    </div>
                  </div>

                  {/* Price & Commercial Info */}
                  <div className="p-3 rounded-xl bg-muted/40 border border-border/70 flex items-baseline justify-between">
                    <div>
                      <span className="text-[10px] text-muted-foreground uppercase font-headline font-bold block">
                        Tarif Substrat
                      </span>
                      <span className="font-mono font-semibold text-xs text-foreground">
                        Rp {item.ratePerKg.toLocaleString("id-ID")} / kg
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-muted-foreground uppercase font-headline font-bold block">
                        Total Biaya Tebus
                      </span>
                      <span className="font-mono font-extrabold text-sm text-primary">
                        Rp {item.totalPrice.toLocaleString("id-ID")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer Button */}
              <div className="p-4 pt-0">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setSelectedBatch(item)}
                  className="w-full rounded-xl text-xs font-headline font-bold text-foreground hover:bg-primary hover:text-white border-border gap-1.5 h-9"
                >
                  <span>Detail Limbah & Angkut</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Modal Detail Limbah Organik (Tanpa Token Manual) */}
      <Dialog open={!!selectedBatch} onOpenChange={(open) => !open && setSelectedBatch(null)}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          {selectedBatch && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-md bg-primary/10 text-primary font-mono font-bold text-xs">
                    {selectedBatch.batchNumber}
                  </span>
                  <DialogTitle className="text-base sm:text-lg">
                    Detail Batch Substrat Organik
                  </DialogTitle>
                </div>
                <DialogDescription className="text-xs text-muted-foreground">
                  Informasi komprehensif residu pangan donatur, lokasi loading dock, dan rincian transaksi biokonversi.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-2 text-xs">
                {/* Image Banner */}
                <div className="relative w-full h-44 rounded-2xl overflow-hidden bg-muted border border-border">
                  <Image
                    src={selectedBatch.imageUrl}
                    alt={selectedBatch.categoryLabel}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                  <div className="absolute top-3 left-3 bg-black/75 backdrop-blur-xs px-2.5 py-1 rounded text-white text-[10px] font-mono font-bold">
                    SUBSTRAT: {selectedBatch.purity.grade} ({selectedBatch.purity.percent}%)
                  </div>
                </div>

                {/* Metrics 3-Col */}
                <div className="grid grid-cols-3 gap-2.5 bg-muted/30 p-3 rounded-xl border border-border/70 text-center">
                  <div>
                    <span className="text-[10px] uppercase text-muted-foreground font-headline font-bold">Berat Bersih</span>
                    <p className="font-mono text-base font-extrabold text-foreground mt-0.5">
                      {selectedBatch.weightKg} kg
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-muted-foreground font-headline font-bold">Tarif / kg</span>
                    <p className="font-mono text-base font-bold text-foreground mt-0.5">
                      Rp {selectedBatch.ratePerKg}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-muted-foreground font-headline font-bold">Total Tebus</span>
                    <p className="font-mono text-base font-extrabold text-primary mt-0.5">
                      Rp {selectedBatch.totalPrice.toLocaleString("id-ID")}
                    </p>
                  </div>
                </div>

                {/* Donor & Loading Dock Information */}
                <div className="p-4 rounded-xl border border-border/80 bg-card space-y-3">
                  <div className="flex items-center justify-between border-b border-border/60 pb-2">
                    <h4 className="font-bold font-headline text-foreground text-xs uppercase tracking-wide flex items-center gap-1.5">
                      <Building2 className="w-4 h-4 text-primary" />
                      <span>Titik Temu & Donatur</span>
                    </h4>
                    <span className="text-[11px] font-mono text-muted-foreground">
                      {selectedBatch.formattedDate}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <p className="font-headline font-bold text-foreground text-sm">
                      {selectedBatch.donorName}
                    </p>
                    <p className="text-muted-foreground text-xs flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span>{selectedBatch.donorAddress}</span>
                    </p>
                    <p className="text-muted-foreground text-xs flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-primary shrink-0" />
                      <a
                        href={`https://wa.me/62${selectedBatch.donorPhone.replace(/^0/, "")}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary font-semibold hover:underline flex items-center gap-1"
                      >
                        <span>WhatsApp: {selectedBatch.donorPhone}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </p>
                  </div>
                </div>

                {/* Status Notice */}
                {claimSuccess && (
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold flex items-center gap-2 animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Penjemputan berhasil dikonfirmasi! Batch telah dicatat ke jadwal armada Anda.</span>
                  </div>
                )}
              </div>

              <DialogFooter className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 pt-2 border-t border-border/60">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedBatch(null)}
                  className="text-xs font-headline font-semibold"
                >
                  Tutup
                </Button>

                {!selectedBatch.isCollected ? (
                  <Button
                    type="button"
                    size="sm"
                    disabled={isClaiming}
                    onClick={() => handleClaim(selectedBatch.id)}
                    className="bg-primary hover:bg-primary/90 text-white font-headline font-bold text-xs rounded-xl px-5 gap-1.5 shadow-xs"
                  >
                    {isClaiming ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Mengonfirmasi...</span>
                      </>
                    ) : (
                      <>
                        <Truck className="w-4 h-4" />
                        <span>Konfirmasi Penjemputan / Angkut Batch</span>
                      </>
                    )}
                  </Button>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Telah Diangkut oleh Armada Anda</span>
                  </span>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
