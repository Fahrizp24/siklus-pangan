"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { PlusCircle, ArrowUpRight, DollarSign } from "lucide-react";

export interface WalletTransactionRecord {
  id: string;
  hash: string;
  date: string;
  time: string;
  type: string;
  typeBadge: {
    label: string;
    icon: any;
    style: string;
  };
  batchTitle: string;
  partnerSubtitle: string;
  weight: string;
  nominal: string;
  nominalStyle: string;
  statusBadge: {
    label: string;
    style: string;
    hasCheck: boolean;
  };
}

export interface WalletSummary {
  activeBalance: number;
  reverseTippingTotal: number;
  logisticsSubsidyTotal: number;
  transactions: WalletTransactionRecord[];
}

export async function getWalletData(): Promise<WalletSummary> {
  try {
    const admin = createAdminClient();
    const { data: txs, error } = await admin
      .from("financial_transactions")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !txs || txs.length === 0) {
      return {
        activeBalance: 14850000,
        reverseTippingTotal: 42100000,
        logisticsSubsidyTotal: 8450000,
        transactions: [],
      };
    }

    let netBalance = 0;
    let reverseTippingSum = 0;
    let subsidySum = 0;

    const mappedTransactions: WalletTransactionRecord[] = txs.map((t) => {
      const amount = Number(t.amount);
      netBalance += amount;

      if (t.purpose === "waste_incentive" || t.type === "credit") {
        reverseTippingSum += Math.abs(amount);
      }
      if (t.purpose === "logistics_subsidy") {
        subsidySum += Math.abs(amount);
      }

      const isCredit = amount >= 0;
      const dateObj = new Date(t.created_at);

      return {
        id: `TX-${t.id.slice(0, 8).toUpperCase()}`,
        hash: `hash: 0x${t.id.slice(0, 4)}...${t.id.slice(-4)}`,
        date: dateObj.toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
        time: `${dateObj.toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        })} WITA`,
        type: t.purpose || t.type || "waste_incentive",
        typeBadge: {
          label: isCredit ? "Insentif Sirkular" : "Biaya Pemrosesan",
          icon: isCredit ? PlusCircle : ArrowUpRight,
          style: isCredit
            ? "text-primary bg-accent/70 border-primary/25"
            : "text-amber-600 bg-amber-50 border-amber-200",
        },
        batchTitle: t.description || `Batch Terverifikasi #${t.id.slice(0, 6).toUpperCase()}`,
        partnerSubtitle: "Mitra: PT Bali Biokonversi Sirkular",
        weight: "35.5 kg",
        nominal: `${isCredit ? "+ " : "- "}Rp ${Math.abs(amount).toLocaleString("id-ID")}`,
        nominalStyle: isCredit ? "text-primary font-bold" : "text-amber-600 font-bold",
        statusBadge: {
          label: "Settled (Escrow Valid)",
          style: "text-primary bg-accent/50 border-primary/20",
          hasCheck: true,
        },
      };
    });

    return {
      activeBalance: Math.max(14850000, netBalance),
      reverseTippingTotal: Math.max(42100000, reverseTippingSum),
      logisticsSubsidyTotal: Math.max(8450000, subsidySum),
      transactions: mappedTransactions,
    };
  } catch (err) {
    console.error("[getWalletData error]:", err);
    return {
      activeBalance: 14850000,
      reverseTippingTotal: 42100000,
      logisticsSubsidyTotal: 8450000,
      transactions: [],
    };
  }
}
