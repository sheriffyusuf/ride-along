import { STEP_DURATION_MS } from '../constants/mockData';

/**
 * Calculate ETA in whole minutes based on the number of remaining
 * waypoint-to-waypoint steps and the duration of each step.
 */
export function calculateETA(
  remainingSteps: number,
  stepDurationMs: number = STEP_DURATION_MS,
): number {
  if (remainingSteps <= 0) return 0;
  return Math.ceil((remainingSteps * stepDurationMs) / 60_000);
}

/**
 * Format a distance in kilometres to a human-readable string.
 *   0.45  → "450 m"
 *   3.2   → "3.2 km"
 */
export function formatDistance(km: number): string {
  if (km < 1) {
    return `${Math.round(km * 1000)} m`;
  }
  return `${km.toFixed(1)} km`;
}

/**
 * Format a monetary amount as a dollar string.
 *   12.4  → "$12.40"
 */
export function formatFare(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

/**
 * Calculate a trip fare from distance using a base fare plus a per-km rate.
 */
export function calculateFare(
  distanceKm: number,
  baseFare: number = 2.5,
  ratePerKm: number = 1.85,
): number {
  return parseFloat((baseFare + distanceKm * ratePerKm).toFixed(2));
}

/**
 * Linear interpolation between two numbers.
 *   lerp(0, 10, 0.5) → 5
 */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/**
 * Returns true when the driver has reached or passed the final waypoint.
 */
export function isTripComplete(
  waypointIndex: number,
  totalWaypoints: number,
): boolean {
  return waypointIndex >= totalWaypoints - 1;
}

/**
 * Format a duration in minutes to a compact string.
 *   8   → "8 min"
 *   60  → "1 hr"
 *   65  → "1 hr 5 min"
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours} hr ${mins} min` : `${hours} hr`;
}
