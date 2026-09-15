/**
 * Deterministic Expiry Rules Engine
 * 
 * Rules Engine ini digunakan untuk menghitung jam aman konsumsi (safe_until)
 * secara deterministik berbasis parameter higienitas, bukan diestimasi secara probabilistik oleh LLM.
 */

export interface ExpiryCalculationInput {
  cookedAt: Date | string;
  storageMethod: 'room_temperature' | 'heated_display' | 'refrigerated' | 'sealed_container';
  riskyIngredients: string[]; // ['santan', 'susu', 'mayones', 'seafood', 'telur_setengah_matang']
  userOverrideHours?: number;
}

export interface ExpiryCalculationResult {
  safeUntil: Date;
  maxAllowedHours: number;
  isHighRisk: boolean;
  handlingRecommendations: string;
}

const HIGH_RISK_KEYWORDS = [
  'santan',
  'susu',
  'milk',
  'coconut',
  'mayo',
  'mayones',
  'seafood',
  'udang',
  'ikan',
  'telur',
  'egg',
  'daging_cincang'
];

export function calculateFoodExpiry(input: ExpiryCalculationInput): ExpiryCalculationResult {
  const cookedTime = typeof input.cookedAt === 'string' ? new Date(input.cookedAt) : input.cookedAt;
  
  // 1. Deteksi apakah terdapat bahan berisiko tinggi basi
  const isHighRisk = input.riskyIngredients.some((ing) =>
    HIGH_RISK_KEYWORDS.some((kw) => ing.toLowerCase().includes(kw))
  );

  // 2. Tentukan batas maksimal jam berdasarkan metode penyimpanan & risiko bahan
  let maxAllowedHours = 4; // Base: 4 jam suhu ruang

  if (isHighRisk) {
    maxAllowedHours = 2; // Bahan santan/susu/seafood max 2 jam pada suhu ruang
  }

  if (input.storageMethod === 'heated_display') {
    maxAllowedHours = isHighRisk ? 4 : 6;
  } else if (input.storageMethod === 'refrigerated') {
    maxAllowedHours = isHighRisk ? 6 : 8;
  } else if (input.storageMethod === 'sealed_container') {
    maxAllowedHours = isHighRisk ? 3 : 5;
  }

  // 3. Batasi jam jika donatur memberikan override manual (ambil nilai terkecil demi keamanan)
  if (input.userOverrideHours && input.userOverrideHours > 0) {
    maxAllowedHours = Math.min(maxAllowedHours, input.userOverrideHours);
  }

  // 4. Kalkulasi timestamp safeUntil
  const safeUntil = new Date(cookedTime.getTime() + maxAllowedHours * 60 * 60 * 1000);

  // 5. Buat instruksi penanganan higienis otomatis
  let handlingRecommendations = 'Simpan dalam wadah bersih dan tertutup pada suhu ruang.';
  if (isHighRisk) {
    handlingRecommendations = 'Bahan rentan basi terdeteksi (santan/susu/seafood). Wajib dipanaskan ulang hingga 70°C selama 5 menit sebelum dikonsumsi.';
  } else if (input.storageMethod === 'refrigerated') {
    handlingRecommendations = 'Simpan di lemari pendingin (4°C). Panaskan sebelum disajikan.';
  }

  return {
    safeUntil,
    maxAllowedHours,
    isHighRisk,
    handlingRecommendations,
  };
}
