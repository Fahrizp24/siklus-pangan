export type UserRole = 'donor' | 'beneficiary' | 'orphanage' | 'processor' | 'admin';
export type ListingStatus = 'active' | 'claimed' | 'expired' | 'recalled';
export type WasteCategory = 'bsf_maggot' | 'poultry_fish' | 'compost_biogas';
export type TransactionType = 'prepaid_deposit' | 'monthly_invoice' | 'processor_incentive';

export interface Profile {
  id: string;
  role: UserRole;
  display_name: string;
  phone_number?: string;
  address: string;
  organization_capacity: number;
  credit_balance: number;
  strikes_count: number;
  is_banned: boolean;
  created_at: string;
}

export interface FoodListing {
  id: string;
  donor_id: string;
  title: string;
  image_url: string;
  portions: number;
  remaining_portions: number;
  risky_ingredients: string[];
  dietary_tags: string[];
  storage_method: string;
  cooked_at: string;
  safe_until: string;
  handling_notes?: string;
  status: ListingStatus;
  created_at: string;
  donor?: Profile;
}

export interface FoodClaim {
  id: string;
  listing_id: string;
  claimant_id: string;
  portions_claimed: number;
  qr_token: string;
  is_collected: boolean;
  collected_at?: string;
  created_at: string;
  listing?: FoodListing;
}

export interface StrikeDispute {
  id: string;
  donor_id: string;
  listing_id: string;
  reported_by: string;
  reason: string;
  donor_evidence_url?: string;
  donor_statement?: string;
  is_resolved: boolean;
  penalty_applied: boolean;
  created_at: string;
}

export interface WasteBatch {
  id: string;
  donor_id: string;
  processor_id?: string;
  image_url: string;
  target_category: WasteCategory;
  weight_kg: number;
  rate_per_kg: number;
  is_collected: boolean;
  qr_handover_token: string;
  collected_at?: string;
  created_at: string;
}

export interface FinancialTransaction {
  id: string;
  user_id: string;
  waste_batch_id?: string;
  amount: number;
  type: TransactionType;
  description?: string;
  created_at: string;
}
