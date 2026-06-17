import {
  calculateETA,
  formatDistance,
  formatFare,
  calculateFare,
  lerp,
  isTripComplete,
  formatDuration,
} from './tripCalculations';
import { ROUTE_WAYPOINTS } from '../constants/mockData';

describe('tripCalculations', () => {
  // ---------------------------------------------------------------------------
  // calculateETA
  // ---------------------------------------------------------------------------
  describe('calculateETA', () => {
    it('returns 0 when there are no remaining steps', () => {
      expect(calculateETA(0)).toBe(0);
    });

    it('rounds up to the nearest minute (6 steps × 3 000 ms = 0.3 min → 1)', () => {
      expect(calculateETA(6, 3_000)).toBe(1);
    });

    it('returns exactly 1 when steps × duration equals exactly 60 s', () => {
      expect(calculateETA(20, 3_000)).toBe(1); // 60 000 ms = 1 min exactly
    });

    it('rounds up when result is fractional (25 × 3 000 ms = 1.25 min → 2)', () => {
      expect(calculateETA(25, 3_000)).toBe(2);
    });

    it('handles a single remaining step correctly', () => {
      expect(calculateETA(1, 3_000)).toBe(1);
    });
  });

  // ---------------------------------------------------------------------------
  // formatDistance
  // ---------------------------------------------------------------------------
  describe('formatDistance', () => {
    it('formats sub-kilometre distances in metres', () => {
      expect(formatDistance(0.45)).toBe('450 m');
    });

    it('formats kilometre distances with one decimal place', () => {
      expect(formatDistance(3.2)).toBe('3.2 km');
    });

    it('formats exactly 1 km', () => {
      expect(formatDistance(1)).toBe('1.0 km');
    });

    it('formats very short distances', () => {
      expect(formatDistance(0.1)).toBe('100 m');
    });
  });

  // ---------------------------------------------------------------------------
  // formatFare
  // ---------------------------------------------------------------------------
  describe('formatFare', () => {
    it('always shows two decimal places', () => {
      expect(formatFare(12.4)).toBe('$12.40');
    });

    it('formats a whole-number fare', () => {
      expect(formatFare(10)).toBe('$10.00');
    });

    it('prepends a dollar sign', () => {
      expect(formatFare(0)).toBe('$0.00');
    });
  });

  // ---------------------------------------------------------------------------
  // calculateFare
  // ---------------------------------------------------------------------------
  describe('calculateFare', () => {
    it('applies default base fare and per-km rate (2.50 + 3.2 × 1.85 = 8.42)', () => {
      expect(calculateFare(3.2)).toBe(8.42);
    });

    it('accepts custom rates (base 1.00 + 2 km × 2.00 = 5.00)', () => {
      expect(calculateFare(2, 1.0, 2.0)).toBe(5.0);
    });

    it('returns base fare for zero distance', () => {
      expect(calculateFare(0)).toBe(2.5);
    });
  });

  // ---------------------------------------------------------------------------
  // lerp
  // ---------------------------------------------------------------------------
  describe('lerp', () => {
    it('returns the start value at t = 0', () => {
      expect(lerp(0, 10, 0)).toBe(0);
    });

    it('returns the end value at t = 1', () => {
      expect(lerp(0, 10, 1)).toBe(10);
    });

    it('returns the midpoint at t = 0.5', () => {
      expect(lerp(0, 10, 0.5)).toBe(5);
    });

    it('interpolates negative ranges', () => {
      expect(lerp(-10, 10, 0.5)).toBe(0);
    });

    it('works with floating-point coordinates (longitude)', () => {
      const result = lerp(-122.399, -122.4194, 0.5);
      expect(result).toBeCloseTo(-122.4092, 4);
    });
  });

  // ---------------------------------------------------------------------------
  // isTripComplete — core trip-completion logic
  // ---------------------------------------------------------------------------
  describe('isTripComplete', () => {
    const total = ROUTE_WAYPOINTS.length; // 12

    it('returns false when the driver has not yet reached the last waypoint', () => {
      expect(isTripComplete(0, total)).toBe(false);
      expect(isTripComplete(total - 2, total)).toBe(false);
    });

    it('returns true when the driver is exactly at the last waypoint', () => {
      expect(isTripComplete(total - 1, total)).toBe(true);
    });

    it('returns true when the index exceeds the last waypoint (defensive)', () => {
      expect(isTripComplete(total, total)).toBe(true);
      expect(isTripComplete(total + 5, total)).toBe(true);
    });

    it('matches the ROUTE_WAYPOINTS length (regression: 12 waypoints)', () => {
      expect(ROUTE_WAYPOINTS.length).toBe(12);
      expect(isTripComplete(11, 12)).toBe(true);
      expect(isTripComplete(10, 12)).toBe(false);
    });
  });

  // ---------------------------------------------------------------------------
  // formatDuration
  // ---------------------------------------------------------------------------
  describe('formatDuration', () => {
    it('formats durations under 60 minutes', () => {
      expect(formatDuration(8)).toBe('8 min');
      expect(formatDuration(1)).toBe('1 min');
      expect(formatDuration(59)).toBe('59 min');
    });

    it('formats exactly 60 minutes as "1 hr"', () => {
      expect(formatDuration(60)).toBe('1 hr');
    });

    it('formats durations over 60 minutes with hours and minutes', () => {
      expect(formatDuration(65)).toBe('1 hr 5 min');
      expect(formatDuration(90)).toBe('1 hr 30 min');
      expect(formatDuration(120)).toBe('2 hr');
      expect(formatDuration(125)).toBe('2 hr 5 min');
    });
  });
});
