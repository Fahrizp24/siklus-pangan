"use client";

import React from "react";
import {
  Activity,
  CheckCircle2,
  MapPin,
  ExternalLink,
  MessageSquare,
  ClipboardCheck,
  CheckSquare,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

/* =========================================================================
   CONFIGURABLE DATA & CONSTANTS (EASY TO EDIT AT TOP OF FILE)
   ========================================================================= */

export const PICKUP_PROTOCOL_CONTENT = {
  auditLog: {
    title: "Log Audit Serah Terima",
    nodeId: "Node: ID-DPS-RN01",
    steps: [
      {
        id: "step-1",
        title: "Listing Dipublikasikan",
        timeOrStatus: "10:45 WITA",
        description:
          "Donatur Terverifikasi Anonim #084 meluncurkan surplus bento box layak konsumsi.",
        status: "completed",
      },
      {
        id: "step-2",
        title: "Jatah 35 Porsi Diklaim",
        timeOrStatus: "11:15 WITA",
        description:
          "Yayasan Sayap Ibu mengunci alokasi melalui kuota harian B2B (Status Lock Terkonfirmasi).",
        status: "completed",
      },
      {
        id: "step-3",
        title: "Menuju Lokasi Penjemputan",
        timeOrStatus: "Saat Ini",
        description:
          "Menunggu tim logistik tiba di Loading Dock Barat Renon. Radius 1.2 km tersisa.",
        status: "active",
      },
      {
        id: "step-4",
        title: "Scan QR Bilateral & Tanda Terima",
        timeOrStatus: "Pending",
        description:
          "Penyelesaian sertifikat serah terima digital dan update ledger emisi CO2e.",
        status: "pending",
      },
    ],
  },
  pickupGuide: {
    badgeTop: "Koordinat & Akses Fasilitas",
    title: "Panduan Titik Penjemputan (Pickup Protocol)",
    distanceBadge: "1.2 km dari Posko",
    map: {
      zoneName: "Kawasan Renon, Denpasar Selatan",
      gpsStatus: "LIVE GPS",
      destinationTitle: "Loading Dock Barat F&B Service",
      address: "Jl. Raya Puputan No. 88, Renon",
      googleMapsUrl: "https://maps.google.com/?q=Renon+Denpasar",
    },
    facilityAccess: {
      title: "Protokol Masuk Fasilitas:",
      description:
        "Gunakan Pintu Belakang Loading Dock Barat. Jangan melalui lobby utama tamu hotel/katering. Lapor ke Pos Sekuriti F&B dengan menunjukkan ID Klaim.",
    },
    contact: {
      label: "Narahubung Operasional:",
      name: "Koordinator Dapur (Pak Wayan)",
      whatsappUrl: "https://wa.me/6281234567890",
      whatsappLabel: "WhatsApp Enkripsi",
    },
    checklist: {
      title: "Checklist SOP Higienitas & Pengambilan (Mandatori ISO 22000):",
      items: [
        {
          id: "item-1",
          boldPrefix: "Membawa Coolbox Insulasi",
          suffix: " tertutup bersih",
        },
        {
          id: "item-2",
          boldPrefix: "Mengenakan Masker &",
          suffix: " Sanitasi tangan di lokasi",
        },
        {
          id: "item-3",
          boldPrefix: "Periksa Kondisi Segel",
          suffix: " sebelum scan QR serah terima",
        },
      ],
    },
  },
};

/* =========================================================================
   COMPONENT IMPLEMENTATION
   ========================================================================= */

export function PickupProtocolSection() {
  const { auditLog, pickupGuide } = PICKUP_PROTOCOL_CONTENT;

  return (
    <section className="w-full max-w-6xl mx-auto px-4 sm:px-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ===================================================================
            LEFT COLUMN: Log Audit Serah Terima Timeline (5 Cols)
            =================================================================== */}
        <div className="lg:col-span-5 w-full">
          <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-[0_4px_24px_-4px_rgba(11,27,61,0.05)]">
            {/* Header */}
            <div className="flex items-center justify-between pb-5 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                  <Activity className="w-4 h-4 text-emerald-600" />
                </div>
                <h2 className="text-base sm:text-lg font-bold text-neutral-900 font-headline">
                  {auditLog.title}
                </h2>
              </div>
              <span className="font-mono text-xs text-slate-400 font-medium">
                {auditLog.nodeId}
              </span>
            </div>

            {/* Vertical Audit Timeline */}
            <div className="mt-6 relative pl-7 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-3 before:w-0.5 before:bg-slate-200">
              {auditLog.steps.map((step) => {
                const isCompleted = step.status === "completed";
                const isActive = step.status === "active";
                const isPending = step.status === "pending";

                return (
                  <div key={step.id} className="relative">
                    {/* Timeline Node Indicator Icon */}
                    <div className="absolute -left-7 top-0.5 z-10 flex items-center justify-center">
                      {isCompleted && (
                        <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                        </div>
                      )}
                      {isActive && (
                        <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
                          <div className="w-5 h-5 rounded-full bg-emerald-100 border-2 border-emerald-500 flex items-center justify-center">
                            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
                          </div>
                        </div>
                      )}
                      {isPending && (
                        <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
                          <div className="w-4 h-4 rounded-full border-2 border-slate-300 bg-white" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex items-start justify-between gap-2">
                      <h3
                        className={`text-xs sm:text-sm font-bold font-headline ${
                          isPending ? "text-slate-400" : "text-neutral-900"
                        }`}
                      >
                        {step.title}
                      </h3>

                      {isActive ? (
                        <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold shrink-0">
                          {step.timeOrStatus}
                        </span>
                      ) : (
                        <span className="font-mono text-[11px] text-slate-400 shrink-0">
                          {step.timeOrStatus}
                        </span>
                      )}
                    </div>

                    <p
                      className={`text-xs font-body mt-1 leading-relaxed ${
                        isPending ? "text-slate-400" : "text-slate-500"
                      }`}
                    >
                      {step.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ===================================================================
            RIGHT COLUMN: Panduan Titik Penjemputan Card (7 Cols)
            =================================================================== */}
        <div className="lg:col-span-7 w-full">
          <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-[0_4px_24px_-4px_rgba(11,27,61,0.05)]">
            {/* Header */}
            <div className="flex items-start justify-between gap-3 pb-5 border-b border-slate-100">
              <div>
                <span className="text-xs text-slate-500 font-medium font-body block">
                  {pickupGuide.badgeTop}
                </span>
                <h2 className="text-lg sm:text-xl font-extrabold text-neutral-900 font-headline mt-0.5">
                  {pickupGuide.title}
                </h2>
              </div>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold shrink-0 font-headline">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span>{pickupGuide.distanceBadge}</span>
              </span>
            </div>

            {/* Middle Row: Live GPS Map (Left) & Access Protocols / Contact (Right) */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch">
              {/* Minimalist Live GPS Map Graphic Card */}
              <div className="relative rounded-2xl border border-slate-200 bg-slate-50/70 p-4 sm:p-5 flex flex-col justify-between overflow-hidden shadow-2xs min-h-[190px]">
                {/* Subtle Grid Map Graphic Background */}
                <div
                  className="absolute inset-0 opacity-40 pointer-events-none"
                  style={{
                    backgroundImage:
                      "radial-gradient(#00AA13 0.75px, transparent 0.75px), radial-gradient(#00AA13 0.75px, #f8fafc 0.75px)",
                    backgroundSize: "20px 20px",
                    backgroundPosition: "0 0, 10px 10px",
                  }}
                />

                {/* SVG Route Trajectory Graphic */}
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  viewBox="0 0 200 150"
                  fill="none"
                >
                  <path
                    d="M 20 130 Q 80 110 130 60 T 170 30"
                    stroke="#10b981"
                    strokeWidth="2.5"
                    strokeDasharray="4 4"
                  />
                  <circle cx="20" cy="130" r="4" fill="#00AA13" />
                  <circle cx="170" cy="30" r="5" fill="#0B1B3D" />
                  <circle cx="170" cy="30" r="8" stroke="#10b981" strokeWidth="2" opacity="0.6" />
                </svg>

                {/* Top Location Tag */}
                <div className="relative z-10 flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold text-neutral-800 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-md border border-slate-200/80 shadow-2xs">
                    {pickupGuide.map.zoneName}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold font-mono px-2 py-0.5 rounded-md bg-emerald-600 text-white shadow-2xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                    {pickupGuide.map.gpsStatus}
                  </span>
                </div>

                {/* Bottom Address Card with Open Map Button */}
                <div className="relative z-10 mt-12 p-3 rounded-xl bg-white border border-slate-200/90 shadow-xs flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <h4 className="font-bold text-xs text-neutral-900 font-headline truncate">
                      {pickupGuide.map.destinationTitle}
                    </h4>
                    <p className="text-[10px] text-slate-500 truncate mt-0.5">
                      {pickupGuide.map.address}
                    </p>
                  </div>
                  <a
                    href={pickupGuide.map.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center shrink-0 transition-colors shadow-2xs"
                    title="Buka Peta"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* Access Protocol & WhatsApp Contact Box */}
              <div className="flex flex-col justify-between gap-4">
                {/* Facility Protocol Notice Box */}
                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 shadow-2xs">
                  <div className="flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <h4 className="font-bold text-xs text-neutral-900 font-headline">
                      {pickupGuide.facilityAccess.title}
                    </h4>
                  </div>
                  <p className="text-[11px] text-slate-600 font-body leading-relaxed mt-1.5">
                    {pickupGuide.facilityAccess.description}
                  </p>
                </div>

                {/* Narahubung & WhatsApp Enkripsi Button */}
                <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-2xs flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] text-slate-400 font-medium block">
                      {pickupGuide.contact.label}
                    </span>
                    <span className="font-bold text-xs text-neutral-900 font-headline block mt-0.5">
                      {pickupGuide.contact.name}
                    </span>
                  </div>

                  <a
                    href={pickupGuide.contact.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-xs font-headline shrink-0"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>{pickupGuide.contact.whatsappLabel}</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Bottom Checklist: SOP Higienitas ISO 22000 */}
            <div className="mt-6 pt-5 border-t border-slate-100">
              <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-900 font-headline">
                <ClipboardCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{pickupGuide.checklist.title}</span>
              </div>

              <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
                {pickupGuide.checklist.items.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl border border-slate-200/80 bg-slate-50/40 flex items-start gap-2 text-[11px] leading-relaxed shadow-2xs"
                  >
                    <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="text-slate-600">
                      <strong className="text-neutral-900 font-bold">
                        {item.boldPrefix}
                      </strong>
                      {item.suffix}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
