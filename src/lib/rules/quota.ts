export type MealWindow = "lunch" | "dinner";

export interface MealWindowRange {
  window: MealWindow;
  startsAt: Date;
  endsAt: Date;
}

/** Satu akun hanya boleh satu klaim pada setiap jendela makan lokal. */
export function getMealWindow(date = new Date()): MealWindowRange | null {
  const hour = date.getHours();
  const startsAt = new Date(date);
  const endsAt = new Date(date);

  if (hour >= 11 && hour < 14) {
    startsAt.setHours(11, 0, 0, 0);
    endsAt.setHours(14, 0, 0, 0);
    return { window: "lunch", startsAt, endsAt };
  }

  if (hour >= 17 && hour < 20) {
    startsAt.setHours(17, 0, 0, 0);
    endsAt.setHours(20, 0, 0, 0);
    return { window: "dinner", startsAt, endsAt };
  }

  return null;
}

export function canClaimInWindow(
  existingClaimCreatedAt: Date | string | null,
  now = new Date()
): boolean {
  const window = getMealWindow(now);
  if (!window) return false;
  if (!existingClaimCreatedAt) return true;

  const createdAt = new Date(existingClaimCreatedAt).getTime();
  return createdAt < window.startsAt.getTime() || createdAt >= window.endsAt.getTime();
}

/** Organisasi hanya menerima listing minimal 50% kapasitas terdaftar. */
export function shouldRouteToIndividualRadar(
  remainingPortions: number,
  organizationCapacity: number
): boolean {
  if (!Number.isInteger(remainingPortions) || remainingPortions < 0) return true;
  if (!Number.isInteger(organizationCapacity) || organizationCapacity <= 0) return true;
  return remainingPortions < organizationCapacity * 0.5;
}

export function capOrganizationClaim(
  requestedPortions: number,
  organizationCapacity: number
): number {
  if (!Number.isInteger(requestedPortions) || requestedPortions < 1) return 0;
  if (!Number.isInteger(organizationCapacity) || organizationCapacity < 1) return 0;
  return Math.min(requestedPortions, organizationCapacity);
}
