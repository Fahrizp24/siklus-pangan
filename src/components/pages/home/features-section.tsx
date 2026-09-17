"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Compass,
  Recycle,
  ArrowRight,
  Scale,
  Truck,
  CheckCircle2,
  ScanEye,
  Camera,
  ShieldCheck,
  QrCode,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { FilterPills } from "@/components/ui/filter-pills";
import { SurplusFoodCard, SurplusFoodCardData } from "@/components/ui/surplus-food-card";

/* =========================================================================
   SHOWCASE CONFIG & DATA
   ========================================================================= */

export const SHOWCASE_TABS = [
  {
    id: "radar",
    label: "Live Surplus Radar",
    icon: Compass,
  },
  {
    id: "ai_vision",
    label: "Donasi Pangan & AI Vision",
    icon: ScanEye,
  },
  {
    id: "waste_scale",
    label: "Simulasi Timbangan IoT & Biokonversi",
    icon: Scale,
  },
];

export const RADAR_SHOWCASE_CONTENT = {
  title: "Katalog Penyelamatan Surplus Pangan Aktif",
  subtitle:
    "Setiap listing dilindungi kode anonim (#00X) untuk privasi komersial donor, dengan masa aman konsumsi berbasis sensor cold chain.",
  filters: [
    { id: "all", label: "Semua Kategori" },
    { id: "halal", label: "Halal Terverifikasi" },
    { id: "vegetarian", label: "Vegetarian" },
    { id: "gluten_free", label: "Bebas Gluten" },
  ],
};

export const SHOWCASE_FOOD_CARDS: (SurplusFoodCardData & {
  category: "halal" | "vegetarian" | "gluten_free" | "all";
})[] = [
  {
    id: "card-1",
    donorCode: "Donatur Anonim #084",
    imageUrl:
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=700&auto=format&fit=crop&q=80",
    remainingTime: "01j 45m",
    isUrgentBadge: true,
    title: "Buffet Chicken Teriyaki & Nasi Pulen Organik",
    description: "Surplus banquet hotel bintang 5, tersimpan higienis dalam thermo-box standar BPOM.",
    portionsRemainingText: "35 Porsi Tersisa",
    tags: [
      { label: "Halal MUI", colorScheme: "green" },
      { label: "Bebas Kacang", colorScheme: "blue" },
    ],
    costInfo: {
      topLabel: "Porsi Bebas Biaya",
      bottomLabel: "Subsidi CSR Hotel #084",
    },
    category: "halal",
  },
  {
    id: "card-2",
    donorCode: "Donatur Anonim #022",
    imageUrl:
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=700&auto=format&fit=crop&q=80",
    remainingTime: "02j 30m",
    isUrgentBadge: false,
    title: "Artisan Sourdough & Croissant Pastry Box",
    description: "Sisa panggangan pagi bakery premium dengan kemasan tertutup rapi.",
    portionsRemainingText: "24 Paket Tersisa",
    tags: [
      { label: "Vegetarian", colorScheme: "green" },
      { label: "Mengandung Gluten", colorScheme: "yellow" },
    ],
    costInfo: {
      topLabel: "Porsi Bebas Biaya",
      bottomLabel: "Subsidi CSR Bakery #022",
    },
    category: "vegetarian",
  },
  {
    id: "card-3",
    donorCode: "Donatur Anonim #119",
    imageUrl:
      "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=700&auto=format&fit=crop&q=80",
    remainingTime: "03j 15m",
    isUrgentBadge: false,
    title: "Medley Salad Bowl & Sayuran Segar Hidroponik",
    description: "Salad bar siap santap dengan dressing terpisah, bersuhu 4°C stabil.",
    portionsRemainingText: "40 Porsi Tersisa",
    tags: [
      { label: "Bebas Gluten", colorScheme: "blue" },
      { label: "Vegan Friendly", colorScheme: "green" },
    ],
    costInfo: {
      topLabel: "Porsi Bebas Biaya",
      bottomLabel: "Subsidi Resto #119",
    },
    category: "gluten_free",
  },
];

/* =========================================================================
   COMPONENT IMPLEMENTATION
   ========================================================================= */

export function FeaturesSection() {
  const [activeTab, setActiveTab] = useState("radar");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [claimedId, setClaimedId] = useState<string | null>(null);

  // Waste simulator state
  const [simulatedKg, setSimulatedKg] = useState(75);
  const incentivePerKg = 500;
  const co2SavedPerKg = 0.58;
  const totalIncentive = simulatedKg * incentivePerKg;
  const totalCo2 = (simulatedKg * co2SavedPerKg).toFixed(1);

  const filteredCards = SHOWCASE_FOOD_CARDS.filter((card) => {
    if (selectedFilter === "all") return true;
    return card.category === selectedFilter;
  });

  return (
    <section className="w-full max-w-6xl mx-auto px-4 sm:px-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="rounded-3xl border border-border bg-card p-6 sm:p-8 lg:p-10 shadow-[0_4px_24px_-4px_rgba(11,27,61,0.05)]">
        {/* Tab Navigation Header with Semantic ARIA */}
        <TabsList
          aria-label="Fitur Utama SiklusPangan"
          className="flex h-auto justify-start rounded-none bg-transparent p-0 items-center gap-4 sm:gap-6 border-b border-border/80 overflow-x-auto no-scrollbar"
        >
          {SHOWCASE_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className={`inline-flex items-center gap-2 rounded-none pt-0 pb-3 px-2 text-xs sm:text-sm font-semibold whitespace-nowrap transition-all relative outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none ${
                  isActive
                    ? "text-primary font-bold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive ? "text-primary stroke-[2.5]" : "text-muted-foreground"
                  }`}
                />
                <span>{tab.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeFeatureUnderline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                  />
                )}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {/* Tab Content Panels */}
        <div className="mt-6 sm:mt-8">
          <AnimatePresence mode="wait">
            {/* TAB 1: RADAR RESCUE SHOWCASE */}
            {activeTab === "radar" && (
              <TabsContent key="tab-panel-radar" value="radar" asChild forceMount className="mt-0">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                {/* Header & Filter Controls */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-extrabold text-foreground font-headline tracking-tight">
                      {RADAR_SHOWCASE_CONTENT.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground font-body mt-1 max-w-2xl">
                      {RADAR_SHOWCASE_CONTENT.subtitle}
                    </p>
                  </div>

                  {/* Filter Pills */}
                  <FilterPills
                    options={RADAR_SHOWCASE_CONTENT.filters}
                    selectedId={selectedFilter}
                    onSelect={setSelectedFilter}
                  />
                </div>

                {/* 3 Food Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pt-2">
                  {filteredCards.map((card) => (
                    <SurplusFoodCard
                      key={card.id}
                      card={card}
                      isClaimed={claimedId === card.id}
                      onClaim={(id) => setClaimedId(id)}
                    />
                  ))}
                </div>

                {/* Direct CTA to full radar */}
                <div className="pt-4 flex items-center justify-between border-t border-border/70 flex-wrap gap-3">
                  <p className="text-xs text-muted-foreground font-body">
                    Menampilkan 3 dari 14 batch donasi yang aktif di radius 5.0 km Anda.
                  </p>
                  <Button asChild className="rounded-xl shadow-xs gap-2 text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90">
                    <Link href="/rescue">
                      <span>Buka Seluruh Radar Makanan (14 Batch)</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </Button>
                </div>
              </motion.div>
              </TabsContent>
            )}

            {/* TAB 2: DONASI PANGAN & AI VISION */}
            {activeTab === "ai_vision" && (
              <TabsContent key="tab-panel-ai_vision" value="ai_vision" asChild forceMount className="mt-0">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="py-2 space-y-6"
              >
                <div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-foreground font-headline tracking-tight">
                    Verifikasi Mutu & Kelayakan Pangan Otomatis
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground font-body mt-1 max-w-2xl">
                    Pipeline Computer Vision berbasis Gemini 2.5 Flash multimodal VLM yang mengekstrak estimasi porsi, bahan, dan alergen, dipadukan dengan kalkulator batas aman konsumsi BPOM.
                  </p>
                </div>

                {/* Showcase Grid: Inspection Simulator & Pipeline Steps */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                  {/* Left Column: Live Inspection Mock Card (5 cols) */}
                  <div className="lg:col-span-5 rounded-2xl border border-border bg-muted/30 p-5 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center justify-between pb-3 border-b border-border">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                          <span className="text-xs font-bold text-foreground font-headline">
                            Inspeksi Gemini 2.5 Flash VLM
                          </span>
                        </div>
                        <span className="text-[11px] font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                          Score: 98.4%
                        </span>
                      </div>

                      {/* Sample Food Photo with Computer Vision Highlights */}
                      <div className="relative mt-3 rounded-xl overflow-hidden border border-border bg-slate-900 aspect-video group">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=700&auto=format&fit=crop&q=80"
                          alt="Inspeksi Makanan"
                          className="w-full h-full object-cover opacity-90"
                        />
                        {/* Overlay Detection Bounding Box */}
                        <div className="absolute inset-3 border-2 border-dashed border-emerald-400/80 rounded-lg pointer-events-none flex flex-col justify-between p-2 bg-emerald-950/20">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono font-bold bg-emerald-600 text-white px-2 py-0.5 rounded shadow-xs">
                              Ayam Teriyaki & Bento
                            </span>
                            <span className="text-[10px] font-mono font-semibold bg-black/60 text-emerald-300 px-1.5 py-0.5 rounded backdrop-blur-xs">
                              Thermo: 62°C (Aman)
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-[10px] text-white/90 font-mono bg-black/50 px-2 py-1 rounded backdrop-blur-xs">
                            <span>Estimasi: 35 Porsi</span>
                            <span>aw: 0.92</span>
                          </div>
                        </div>
                      </div>

                      {/* Structured Output Tags */}
                      <div className="mt-4 space-y-2.5">
                        <div className="text-[11px] font-bold text-muted-foreground uppercase font-headline">
                          Hasil Ekstraksi Multimodal:
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          <span className="text-xs px-2.5 py-1 rounded-lg bg-card border border-border font-medium text-foreground">
                            🍗 Fillet Ayam & Saus Manis
                          </span>
                          <span className="text-xs px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/20 font-medium">
                            ✓ Bebas Kacang
                          </span>
                          <span className="text-xs px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/20 font-medium">
                            ✓ Halal Terverifikasi
                          </span>
                          <span className="text-xs px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-500/20 font-medium">
                            ℹ Mengandung Gluten (Kecap Shoyu)
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-card border border-border text-xs text-muted-foreground font-body">
                      <p className="text-[11px] leading-relaxed">
                        <strong className="text-foreground">Aturan Ketat:</strong> Model AI dilarang menebak jam kedaluwarsa secara halusinasi. Safe Until wajib dihitung oleh Deterministic Expiry Engine.
                      </p>
                    </div>
                  </div>

                  {/* Right Column: 3 Step Pipeline Cards (7 cols) */}
                  <div className="lg:col-span-7 flex flex-col justify-between gap-3.5">
                    {/* Step 1 */}
                    <div className="rounded-2xl border border-border bg-card p-4 sm:p-5 flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 font-headline font-extrabold text-base">
                        01
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm sm:text-base font-bold text-foreground font-headline flex items-center gap-2">
                          <span>Unggah Dokumentasi Hidangan</span>
                          <Camera className="w-3.5 h-3.5 text-primary" />
                        </h4>
                        <p className="text-xs text-muted-foreground font-body leading-relaxed">
                          Tim dapur atau staf banquet mengambil foto makanan dari nampan buffet. Sistem membaca metadata waktu pemanasan terakhir dan kondisi kemasan.
                        </p>
                      </div>
                    </div>

                    {/* Step 2 */}
                    <div className="rounded-2xl border border-border bg-card p-4 sm:p-5 flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 font-headline font-extrabold text-base">
                        02
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm sm:text-base font-bold text-foreground font-headline flex items-center gap-2">
                          <span>Analisis VLM & Deterministic Safe Until</span>
                          <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                        </h4>
                        <p className="text-xs text-muted-foreground font-body leading-relaxed">
                          Gemini VLM mengidentifikasi komposisi bahan dan potensi alergen. Rules Engine BPOM secara kaku menghitung jam aman konsumsi (suhu ruang maks 4 jam, thermo-box dingin hingga 24 jam).
                        </p>
                      </div>
                    </div>

                    {/* Step 3 */}
                    <div className="rounded-2xl border border-border bg-card p-4 sm:p-5 flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 font-headline font-extrabold text-base">
                        03
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm sm:text-base font-bold text-foreground font-headline flex items-center gap-2">
                          <span>QR Dinamis & Serah Terima Terverifikasi</span>
                          <QrCode className="w-3.5 h-3.5 text-primary" />
                        </h4>
                        <p className="text-xs text-muted-foreground font-body leading-relaxed">
                          Batch otomatis terbit di Live Radar. Relawan atau pengelola panti memindai QR Code serah terima di lokasi penjemputan, memicu pencatatan audit trail instan.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Footer */}
                <div className="pt-4 flex items-center justify-between border-t border-border/70 flex-wrap gap-3">
                  <p className="text-xs text-muted-foreground font-body">
                    Proses inspeksi donasi membutuhkan waktu kurang dari 15 detik dari foto hingga terbit di radar.
                  </p>
                  <Button asChild className="rounded-xl shadow-xs gap-2 text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90">
                    <Link href="/donate">
                      <span>Daftarkan Surplus Makanan Sekarang</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </Button>
                </div>
              </motion.div>
              </TabsContent>
            )}

            {/* TAB 3: WASTE SCALE & BSF SIMULATOR */}
            {activeTab === "waste_scale" && (
              <TabsContent key="tab-panel-waste" value="waste_scale" asChild forceMount className="mt-0">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="py-2 space-y-6"
              >
                <div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-foreground font-headline tracking-tight">
                    Simulasi Insentif Reverse Tipping & Biokonversi BSF
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground font-body mt-1 max-w-2xl">
                    Bagaimana sisa makanan dapur hotel/restoran Anda diubah langsung menjadi rupiah di Dompet Sirkular dan reduksi karbon terverifikasi.
                  </p>
                </div>

                {/* Simulator Interactive Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                  {/* Left Column: Interactive Slider (7 cols) */}
                  <div className="lg:col-span-7 rounded-2xl border border-border bg-muted/40 p-6 space-y-5">
                    <div className="flex items-center justify-between">
                      <label htmlFor="sim-weight" className="text-xs sm:text-sm font-bold text-foreground font-headline">
                        Estimasi Berat Residu Dapur:
                      </label>
                      <span className="font-mono text-base sm:text-lg font-extrabold text-primary bg-accent px-3 py-1 rounded-lg border border-primary/25">
                        {simulatedKg} kg / hari
                      </span>
                    </div>

                    {/* Weight Range Slider */}
                    <input
                      id="sim-weight"
                      type="range"
                      min={10}
                      max={300}
                      step={5}
                      value={simulatedKg}
                      onChange={(e) => setSimulatedKg(Number(e.target.value))}
                      className="w-full accent-primary h-2 bg-muted rounded-lg cursor-pointer"
                    />

                    <div className="flex justify-between text-[11px] text-muted-foreground font-mono">
                      <span>10 kg (Kafe)</span>
                      <span>100 kg (Resto Menengah)</span>
                      <span>300 kg (Hotel Bintang 5)</span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-card border border-border text-xs text-muted-foreground font-body space-y-1.5">
                      <div className="flex items-center gap-2 text-foreground font-semibold">
                        <Truck className="w-3.5 h-3.5 text-primary" />
                        <span>Armada Jemput Truk Dingin Terjadwal</span>
                      </div>
                      <p className="text-[11px] leading-relaxed">
                        Timbangan digital terhubung otomatis via IoT Bluetooth saat driver tiba di loading dock. Nilai insentif langsung dikreditkan seketika.
                      </p>
                    </div>
                  </div>

                  {/* Right Column: Calculated Yield Cards (5 cols) */}
                  <div className="lg:col-span-5 flex flex-col gap-4">
                    {/* Incentive Card */}
                    <div className="rounded-2xl border border-border bg-card p-5 shadow-2xs">
                      <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider font-headline block">
                        Insentif Dompet Sirkular
                      </span>
                      <div className="mt-2 flex items-baseline gap-1">
                        <span className="font-mono text-2xl sm:text-3xl font-extrabold text-primary">
                          Rp {totalIncentive.toLocaleString("id-ID")}
                        </span>
                        <span className="text-xs text-muted-foreground font-medium">
                          / penjemputan
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-1 font-body">
                        Tarif standar Rp 500 / kg (dapat dicairkan via BI-FAST).
                      </p>
                    </div>

                    {/* Carbon Offset Card */}
                    <div className="rounded-2xl border border-border bg-card p-5 shadow-2xs">
                      <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider font-headline block">
                        Pencegahan Emisi Metana (GHG)
                      </span>
                      <div className="mt-2 flex items-baseline gap-1">
                        <span className="font-mono text-2xl sm:text-3xl font-extrabold text-foreground">
                          {totalCo2} kg
                        </span>
                        <span className="text-xs text-muted-foreground font-medium">
                          CO₂e dicegah
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-1 font-body">
                        Tersertifikasi ISO 14044 LCA untuk audit ESG korporat.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Footer */}
                <div className="pt-4 flex items-center justify-end border-t border-border/70">
                  <Button asChild className="rounded-xl shadow-xs gap-2 text-xs font-semibold bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                    <Link href="/waste">
                      <span>Buka Modul Pengolahan Limbah & Armada</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </Button>
                </div>
              </motion.div>
              </TabsContent>
            )}
          </AnimatePresence>
        </div>
      </Tabs>
    </section>
  );
}
