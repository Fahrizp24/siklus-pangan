"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";

export interface DisputeRecord {
  id: string;
  donor_id: string;
  donor_name: string;
  listing_id: string;
  listing_title: string;
  reported_by: string;
  reporter_name: string;
  reason: string;
  donor_evidence_url: string | null;
  donor_statement: string | null;
  is_resolved: boolean;
  penalty_applied: boolean;
  created_at: string;
  deadline_at: string; // 24 hours after creation
}

export interface DisputeSummary {
  activeDisputesCount: number;
  resolvedDisputesCount: number;
  complianceRate: number;
  accountsBlockedCount: number;
  disputes: DisputeRecord[];
}

const rebuttalSchema = z.object({
  dispute_id: z.string().uuid(),
  donor_statement: z.string().trim().min(10).max(2000),
  donor_evidence_url: z.string().url().max(2048).optional().or(z.literal("")),
});

export async function getDisputesData(donorId?: string): Promise<DisputeSummary> {
  try {
    const admin = createAdminClient();

    let query = admin
      .from("strike_disputes")
      .select(`
        id,
        donor_id,
        listing_id,
        reported_by,
        reason,
        donor_evidence_url,
        donor_statement,
        is_resolved,
        penalty_applied,
        created_at
      `)
      .order("created_at", { ascending: false });

    if (donorId) {
      query = query.eq("donor_id", donorId);
    }

    let { data: disputes, error } = await query;

    if (error && (!disputes || disputes.length === 0)) {
      throw error || new Error("Gagal memuat sengketa.");
    }

    // Fetch related names & listing titles
    const [profilesRes, listingsRes] = await Promise.all([
      admin.from("profiles").select("id, display_name"),
      admin.from("food_listings").select("id, title"),
    ]);

    const profileMap = new Map((profilesRes.data || []).map((p) => [p.id, p.display_name]));
    const listingMap = new Map((listingsRes.data || []).map((l) => [l.id, l.title]));

    const formattedDisputes: DisputeRecord[] = (disputes || []).map((d) => {
      const createdAt = new Date(d.created_at || Date.now());
      const deadlineAt = new Date(createdAt.getTime() + 24 * 60 * 60 * 1000);

      return {
        id: d.id,
        donor_id: d.donor_id,
        donor_name: profileMap.get(d.donor_id) || "Katering Selera Nusantara",
        listing_id: d.listing_id,
        listing_title: listingMap.get(d.listing_id) || "Menu Pangan Surplus",
        reported_by: d.reported_by,
        reporter_name: profileMap.get(d.reported_by) || "Penerima Manfaat Komunitas",
        reason: d.reason,
        donor_evidence_url: d.donor_evidence_url,
        donor_statement: d.donor_statement,
        is_resolved: d.is_resolved,
        penalty_applied: d.penalty_applied,
        created_at: d.created_at,
        deadline_at: deadlineAt.toISOString(),
      };
    });

    const activeCount = formattedDisputes.filter((d) => !d.is_resolved).length;
    const resolvedCount = formattedDisputes.filter((d) => d.is_resolved).length;
    const totalDisputes = formattedDisputes.length;
    const complianceRate =
      totalDisputes === 0 ? 100 : Math.max(0, Math.round((1 - activeCount / totalDisputes) * 1000) / 10);

    // Check banned accounts count
    const { count: bannedCount } = await admin
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("is_banned", true);

    return {
      activeDisputesCount: activeCount,
      resolvedDisputesCount: resolvedCount,
      complianceRate,
      accountsBlockedCount: bannedCount || 0,
      disputes: formattedDisputes,
    };
  } catch (err: any) {
    console.error("[getDisputesData error]:", err);
    return {
      activeDisputesCount: 0,
      resolvedDisputesCount: 0,
      complianceRate: 100,
      accountsBlockedCount: 0,
      disputes: [],
    };
  }
}

export async function submitDisputeRebuttal(
  input: unknown
): Promise<{ success: boolean; error?: string }> {
  const parsed = rebuttalSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Masukan sanggahan tidak valid. Penjelasan minimal 10 karakter." };
  }

  try {
    const admin = createAdminClient();
    const { error } = await admin
      .from("strike_disputes")
      .update({
        donor_statement: parsed.data.donor_statement,
        donor_evidence_url: parsed.data.donor_evidence_url || null,
      })
      .eq("id", parsed.data.dispute_id);

    if (error) {
      console.error("[submitDisputeRebuttal error]:", error);
      return { success: false, error: "Gagal menyimpan sanggahan resmi ke sistem." };
    }

    revalidatePath("/disputes");
    revalidatePath("/admin");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || "Terjadi kesalahan sistem saat mengirim sanggahan." };
  }
}
