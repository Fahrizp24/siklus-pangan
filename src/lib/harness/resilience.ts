/**
 * Harness Resilience & Offline Fallback Wrapper
 * 
 * Wrapper ini digunakan untuk membungkus panggilan API (Gemini VLM & Supabase).
 * Jika panggilan API mengalami timeout (> 3000ms) atau gagal karena kendala sinyal di lokasi penjurian UTM,
 * Harness akan mengalihkan antarmuka secara otomatis ke Mock Fixture tanpa memicu UI crash.
 */

export interface HarnessResponse<T> {
  data: T;
  isFallback: boolean;
  error?: string;
}

export async function withFallbackHarness<T>(
  primaryFn: () => Promise<T>,
  fallbackFixture: T,
  timeoutMs = 3000
): Promise<HarnessResponse<T>> {
  try {
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(`Harness Timeout (${timeoutMs}ms)`)), timeoutMs)
    );

    const result = await Promise.race([primaryFn(), timeoutPromise]);
    return { data: result, isFallback: false };
  } catch (error: any) {
    console.warn("⚠️ Harness Resilience Triggered: Switching to Local Offline Fixture", error?.message || error);
    return {
      data: fallbackFixture,
      isFallback: true,
      error: error?.message || "Koneksi terputus - menggunakan data simulasi offline.",
    };
  }
}
