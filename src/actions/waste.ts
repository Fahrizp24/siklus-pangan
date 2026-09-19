"use server";

import { createAdminClient } from "@/lib/supabase/admin";

export interface WasteBatchRecord {
  id: string;
  batchId: string;
  datetime: string;
  category: string;
  weight: string;
  weightKg: number;
  ratePerKg: number;
  purityBadge: {
    type: string;
    text: string;
    hasCheck: boolean;
  };
  facility: string;
  statusBadge: {
    type: string;
    dotColor?: string;
    text: string;
    hasCheck?: boolean;
  };
  certificateUrl: string;
}

export async function getWasteBatchesHistory(): Promise<WasteBatchRecord[]> {
  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("waste_batches")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) {
      return [];
    }

    return data.map((b) => {
      const categoryLabels: Record<string, string> = {
        bsf_maggot: "Sisa Dapur & Organik Maggot BSF",
        poultry_fish: "Residu Pastry & Roti Pakan Unggas",
        compost_biogas: "Ampas Dapur & Kompos Biogas",
      };

      const dateStr = new Date(b.created_at).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });

      return {
        id: b.id,
        batchId: `#SKP-${b.id.slice(0, 8).toUpperCase()}`,
        datetime: `${dateStr} WITA`,
        category: categoryLabels[b.target_category] || "Limbah Organik Terpilah",
        weight: `${b.weight_kg} kg`,
        weightKg: Number(b.weight_kg),
        ratePerKg: Number(b.rate_per_kg || 600),
        purityBadge: {
          type: "grade_a",
          text: "99.1% (Grade A)",
          hasCheck: true,
        },
        facility: "PT Bali Biokonversi Sirkular (Jimbaran Hub)",
        statusBadge: {
          type: b.is_collected ? "completed" : "incubating",
          dotColor: b.is_collected ? "bg-emerald-500" : "bg-primary",
          text: b.is_collected
            ? "Selesai Dikonversi Larva BSF"
            : "Menunggu Armada Penjemputan",
          hasCheck: b.is_collected,
        },
        certificateUrl: "#",
      };
    });
  } catch (err) {
    console.error("[getWasteBatchesHistory error]:", err);
    return [];
  }
}
