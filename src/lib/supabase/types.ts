export type UserRole = 'donor' | 'beneficiary' | 'orphanage' | 'processor' | 'admin';
export type ListingStatus = 'active' | 'claimed' | 'expired' | 'recalled';
export type FoodCondition = 'safe_for_consumption' | 'expired' | 'damaged';
export type StorageMethod = 'room_temperature' | 'heated_display' | 'refrigerated' | 'sealed_container';
export type WasteCategory = 'bsf_maggot' | 'poultry_fish' | 'compost_biogas';
export type WasteBillingMode = 'prepaid' | 'monthly_invoice';
export type TransactionType = 'prepaid_deposit' | 'monthly_invoice' | 'processor_incentive' | 'deposit';
export type TransactionPurpose = 'donor_charge' | 'processor_incentive' | 'welcome_subsidy';
export type MealWindow = 'lunch' | 'dinner';

export interface Profile {
  id: string;
  role: UserRole;
  display_name: string;
  phone_number?: string | null;
  address?: string | null;
  is_organization: boolean;
  organization_capacity?: number | null;
  credit_balance: number;
  strikes_count: number;
  is_banned: boolean;
  created_at: string;
  updated_at?: string;
}

export interface FoodListing {
  id: string;
  donor_id: string;
  title: string;
  image_url?: string | null;
  portions: number;
  remaining_portions: number;
  risky_ingredients: string[];
  dietary_tags: string[];
  storage_method: StorageMethod | string;
  cooked_at: string;
  safe_until: string;
  handling_notes?: string | null;
  food_condition: FoodCondition | string;
  status: ListingStatus;
  created_at: string;
  updated_at?: string;
  donor?: Profile;
}

export interface FoodClaim {
  id: string;
  listing_id: string;
  claimant_id: string;
  portions_claimed: number;
  qr_token: string;
  is_collected: boolean;
  collected_at?: string | null;
  meal_date?: string | null;
  meal_window?: MealWindow | string | null;
  created_at: string;
  listing?: FoodListing;
}

export interface StrikeDispute {
  id: string;
  donor_id: string;
  listing_id: string;
  reported_by: string;
  reason: string;
  donor_evidence_url?: string | null;
  donor_statement?: string | null;
  is_resolved: boolean;
  penalty_applied: boolean;
  created_at: string;
  response_deadline: string;
}

export interface WasteBatch {
  id: string;
  donor_id: string;
  processor_id?: string | null;
  image_url?: string | null;
  target_category: WasteCategory | string;
  weight_kg: number;
  rate_per_kg: number;
  is_collected: boolean;
  qr_handover_token: string;
  billing_mode: WasteBillingMode | string;
  subsidy_amount: number;
  donor_charge: number;
  processor_credit: number;
  collected_at?: string | null;
  paid_at?: string | null;
  created_at: string;
  updated_at?: string;
}

export interface FinancialTransaction {
  id: string;
  user_id: string;
  waste_batch_id?: string | null;
  amount: number;
  type: TransactionType | string;
  purpose?: TransactionPurpose | string | null;
  description?: string | null;
  created_at: string;
}

export interface DonorSubsidy {
  donor_id: string;
  granted_amount: number;
  remaining_amount: number;
  granted_at: string;
}

