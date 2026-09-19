"use client";

import React, { useState } from "react";
import { UserProfile, updateUserProfile } from "@/actions/profile";
import { Button } from "@/components/ui/button";
import { Building2, Save, Check, AlertCircle, Loader2 } from "lucide-react";

interface ProfileFormProps {
  profile: UserProfile;
}

export function ProfileForm({ profile }: ProfileFormProps) {
  const [displayName, setDisplayName] = useState(profile.display_name);
  const [phoneNumber, setPhoneNumber] = useState(profile.phone_number);
  const [address, setAddress] = useState(profile.address);
  const [isOrganization, setIsOrganization] = useState(profile.is_organization);
  const [orgCapacity, setOrgCapacity] = useState<number | string>(
    profile.organization_capacity || 50
  );

  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatusMessage(null);

    const res = await updateUserProfile({
      id: profile.id,
      display_name: displayName,
      phone_number: phoneNumber,
      address: address,
      is_organization: isOrganization,
      organization_capacity: isOrganization ? Number(orgCapacity) : null,
    });

    setSaving(false);
    if (res.success) {
      setStatusMessage({
        type: "success",
        text: "Perubahan data profil berhasil disimpan ke basis data!",
      });
      setTimeout(() => setStatusMessage(null), 5000);
    } else {
      setStatusMessage({
        type: "error",
        text: res.error || "Gagal menyimpan perubahan. Silakan periksa koneksi.",
      });
    }
  };

  return (
    <section className="w-full max-w-4xl mx-auto px-4 sm:px-6">
      <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-xs space-y-6">
        <div className="border-b border-border/80 pb-4">
          <h2 className="text-lg sm:text-xl font-extrabold text-foreground font-headline">
            Informasi Identitas & Lokasi Operasional
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground font-body mt-1">
            Data ini digunakan untuk koordinasi serah terima pangan surplus, titik temu kurir, dan verifikasi kepatuhan.
          </p>
        </div>

        {statusMessage && (
          <div
            className={`p-4 rounded-2xl border text-xs sm:text-sm font-body flex items-center gap-3 ${
              statusMessage.type === "success"
                ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                : "bg-rose-50 border-rose-200 text-rose-800"
            }`}
          >
            {statusMessage.type === "success" ? (
              <Check className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Nama Entitas / User */}
            <div className="space-y-1.5">
              <label className="text-xs font-headline font-bold text-foreground">
                Nama Lengkap / Nama Entitas Bisnis
              </label>
              <input
                type="text"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-muted/40 text-sm font-body focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground"
                placeholder="misal: Katering Selera Nusantara"
              />
            </div>

            {/* Nomor WhatsApp */}
            <div className="space-y-1.5">
              <label className="text-xs font-headline font-bold text-foreground">
                Nomor WhatsApp Koordinasi (+62)
              </label>
              <input
                type="tel"
                required
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-muted/40 text-sm font-body focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground"
                placeholder="misal: 081234567890"
              />
            </div>
          </div>

          {/* Alamat Lengkap */}
          <div className="space-y-1.5">
            <label className="text-xs font-headline font-bold text-foreground">
              Alamat Lengkap (Titik Temu / Pick-up / Dapur)
            </label>
            <textarea
              required
              rows={3}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-muted/40 text-sm font-body focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground resize-none"
              placeholder="Sebutkan jalan, nomor, patokan pintu loading dock atau gerbang..."
            />
          </div>

          {/* Organisasi / Panti Asuhan Toggle */}
          <div className="p-4 sm:p-5 rounded-2xl bg-muted/40 border border-border/80 space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-primary" />
                  <span className="text-sm font-headline font-bold text-foreground">
                    Tipe Akun Organisasi Sosial / Lembaga Amal / Panti Asuhan
                  </span>
                </div>
                <p className="text-xs text-muted-foreground font-body">
                  Aktifkan jika akun ini mewakili yayasan panti asuhan, balai lansia, atau dapur umum sosial untuk membuka kuota porsi terverifikasi.
                </p>
              </div>

              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={isOrganization}
                  onChange={(e) => setIsOrganization(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>

            {/* Kapasitas Anak Asuh (if organization active) */}
            {isOrganization && (
              <div className="pt-3 border-t border-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in duration-200">
                <div className="space-y-0.5">
                  <span className="text-xs font-headline font-bold text-foreground">
                    Kapasitas Penghuni / Anak Asuh Terdaftar
                  </span>
                  <p className="text-[11px] text-muted-foreground font-body">
                    Platform akan mengalokasikan kuota makanan selamat berdasarkan jumlah porsi ini per jendela makan.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    max={500}
                    value={orgCapacity}
                    onChange={(e) => setOrgCapacity(e.target.value)}
                    className="w-28 px-3 py-1.5 rounded-xl border border-border bg-background text-sm font-mono font-bold text-foreground text-center focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  <span className="text-xs font-body text-muted-foreground">jiwa</span>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-end pt-3">
            <Button
              type="submit"
              disabled={saving}
              className="rounded-xl px-6 py-2.5 text-xs font-headline font-semibold bg-primary text-primary-foreground hover:bg-primary/90 gap-2 shadow-xs"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Simpan Perubahan</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}
