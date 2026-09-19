"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export interface WasteBatchRecord {
  id: string;
  batchId: string;
  datetime: string;
  category: string;
  rawCategory?: string;
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
  qrHandoverToken?: string;
  imageUrl?: string | null;
}

export interface ProcessorWasteItem {
  id: string;
  batchNumber: string;
  category: string;
  categoryLabel: string;
  weightKg: number;
  ratePerKg: number;
  totalPrice: number;
  purity: {
    grade: string;
    percent: number;
  };
  imageUrl: string;
  donorId: string;
  donorName: string;
  donorAddress: string;
  donorPhone: string;
  isCollected: boolean;
  collectedAt?: string | null;
  createdAt: string;
  formattedDate: string;
}

const DEMO_DONOR_ID = "6dee3ea9-691a-49b3-8c7f-9b8feab49a02";

export async function getWasteBatchesHistory(explicitUserId?: string): Promise<WasteBatchRecord[]> {
  try {
    let donorId = explicitUserId;
    if (!donorId) {
      try {
        const client = await createClient();
        const {
          data: { user },
        } = await client.auth.getUser();
        donorId = user?.id;
      } catch (authErr) {
        console.warn("[getWasteBatchesHistory auth check]:", authErr);
      }
    }

    // Gunakan donorId terautentikasi atau demo donor
    const targetDonorId = donorId || DEMO_DONOR_ID;

    const admin = createAdminClient();
    const { data, error } = await admin
      .from("waste_batches")
      .select("*, processor:profiles!waste_batches_processor_id_fkey(display_name)")
      .eq("donor_id", targetDonorId)
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) {
      return [];
    }

    return data.map((b: any) => {
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

      const facilityName =
        b.processor?.display_name || "PT Bali Biokonversi Sirkular (Hub Tabanan)";

      return {
        id: b.id,
        batchId: `#SKP-${b.id.slice(0, 8).toUpperCase()}`,
        datetime: `${dateStr} WITA`,
        category: categoryLabels[b.target_category] || "Limbah Organik Terpilah",
        rawCategory: b.target_category,
        weight: `${b.weight_kg} kg`,
        weightKg: Number(b.weight_kg),
        ratePerKg: Number(b.rate_per_kg || 600),
        purityBadge: {
          type: "grade_a",
          text: "99.1% (Grade A)",
          hasCheck: true,
        },
        facility: facilityName,
        statusBadge: {
          type: b.is_collected ? "completed" : "incubating",
          dotColor: b.is_collected ? "bg-emerald-500" : "bg-primary",
          text: b.is_collected
            ? "Selesai Dikonversi Larva BSF"
            : "Menunggu Armada Penjemputan",
          hasCheck: b.is_collected,
        },
        certificateUrl: "#",
        qrHandoverToken: b.qr_handover_token,
        imageUrl: b.image_url,
      };
    });
  } catch (err) {
    console.error("[getWasteBatchesHistory error]:", err);
    return [];
  }
}

/**
 * Server Action: Mengambil Live Radar Pasokan Limbah Organik untuk Pengolah (Processor)
 */
export async function getAvailableWasteForProcessors(): Promise<ProcessorWasteItem[]> {
  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("waste_batches")
      .select("*, donor:profiles!waste_batches_donor_id_fkey(id, display_name, address, phone_number)")
      .order("created_at", { ascending: false });

    if (error || !data) {
      console.error("[getAvailableWasteForProcessors error]:", error);
      return [];
    }

    const categoryLabels: Record<string, string> = {
      bsf_maggot: "Sisa Dapur & Organik Maggot BSF",
      poultry_fish: "Residu Pastry & Pakan Unggas",
      compost_biogas: "Ampas Dapur & Kompos Biogas",
    };

    const categoryImages: Record<string, string> = {
      bsf_maggot: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=700&q=80",
      poultry_fish: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=700&q=80",
      compost_biogas: "https://images.unsplash.com/photo-1592417817098-8f3d6910985b?w=700&q=80",
    };

    return data.map((b: any) => {
      const weight = Number(b.weight_kg) || 0;
      const rate = Number(b.rate_per_kg) || 600;
      const totalPrice = weight * rate;

      const dateStr = new Date(b.created_at).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });

      return {
        id: b.id,
        batchNumber: `#SKP-${b.id.slice(0, 8).toUpperCase()}`,
        category: b.target_category,
        categoryLabel: categoryLabels[b.target_category] || "Limbah Organik Terpilah",
        weightKg: weight,
        ratePerKg: rate,
        totalPrice: totalPrice,
        purity: {
          grade: "Grade A BSF",
          percent: 98.8,
        },
        imageUrl: b.image_url || categoryImages[b.target_category] || categoryImages.bsf_maggot,
        donorId: b.donor?.id || b.donor_id,
        donorName: b.donor?.display_name || "Donatur Mitra SiklusPangan",
        donorAddress: b.donor?.address || "Denpasar, Bali",
        donorPhone: b.donor?.phone_number || "081234567890",
        isCollected: !!b.is_collected,
        collectedAt: b.collected_at,
        createdAt: b.created_at,
        formattedDate: `${dateStr} WITA`,
      };
    });
  } catch (err) {
    console.error("[getAvailableWasteForProcessors catch]:", err);
    return [];
  }
}

/**
 * Server Action: Konfirmasi Penjemputan / Angkut Limbah oleh Pengolah (Tanpa Perlu Token Manual)
 */
export async function claimWasteBatchByProcessor(batchId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const client = await createClient();
    const {
      data: { user },
    } = await client.auth.getUser();
    const processorId = user?.id || "644b1424-6859-4a21-a338-c82aea853ea9"; // Default CV Bali Biokonversi Maggot

    const admin = createAdminClient();
    const nowIso = new Date().toISOString();

    const { error } = await admin
      .from("waste_batches")
      .update({
        processor_id: processorId,
        is_collected: true,
        collected_at: nowIso,
      })
      .eq("id", batchId);

    if (error) {
      console.error("[claimWasteBatchByProcessor error]:", error);
      return { success: false, error: "Gagal memproses penjemputan limbah." };
    }

    revalidatePath("/waste");
    revalidatePath("/wallet");
    return { success: true };
  } catch (err: any) {
    console.error("[claimWasteBatchByProcessor catch]:", err);
    return { success: false, error: err?.message || "Terjadi kesalahan sistem." };
  }
}
