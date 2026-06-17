import type { Driver, LngLat, TripSummary } from '../types';

/**
 * Offline fallback route — Lagos, Nigeria (Ikeja → Lekki Phase 1).
 * 12 points linearly interpolated between origin and destination.
 * Only used when the OSRM fetch fails; in normal operation the live
 * road-following coordinates from useRoute() take over.
 */
export const ROUTE_WAYPOINTS: LngLat[] = [
  [3.3211, 6.5774], // Start — Ikeja
  [3.3303, 6.5638],
  [3.3394, 6.5503],
  [3.3486, 6.5367],
  [3.3578, 6.5231],
  [3.3669, 6.5096],
  [3.3761, 6.4960],
  [3.3852, 6.4824],
  [3.3944, 6.4688],
  [3.4036, 6.4552],
  [3.4127, 6.4417],
  [3.4219, 6.4281], // End — Lekki Phase 1
];

/** Static destination pin coordinate (last waypoint) */
export const DESTINATION: LngLat = ROUTE_WAYPOINTS[ROUTE_WAYPOINTS.length - 1]!;

/** How long (ms) the driver takes to move between two consecutive waypoints */
/**
 * Duration (ms) the driver spends travelling between two consecutive
 * OSRM coordinates. With ~577 coords the full trip takes ~144 s (~2.4 min).
 * Increase to slow down the simulation; decrease to speed it up.
 */
export const STEP_DURATION_MS = 250;

export const MOCK_DRIVER: Driver = {
  id: 'driver_001',
  name: 'Marcus Rivera',
  initials: 'MR',
  vehicle: {
    make: 'Toyota',
    model: 'Camry',
    color: 'Silver',
    plate: '7ABC123',
  },
  rating: 4.9,
};

export const MOCK_TRIP_SUMMARY: TripSummary = {
  distanceKm: 25.4,
  durationMin: 22,
  fare: 49.49,
  pickupAddress: 'CMD Road, Ikeja, Lagos',
  dropoffAddress: 'Admiralty Way, Lekki Phase 1, Lagos',
};
