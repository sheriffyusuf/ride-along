// Geographic coordinate: [longitude, latitude]
export type LngLat = [number, number];

export type TripPhase = 'riding' | 'arrived' | 'completed';

export interface Driver {
  id: string;
  name: string;
  /** Two-letter initials displayed in the avatar */
  initials: string;
  vehicle: {
    make: string;
    model: string;
    color: string;
    plate: string;
  };
  rating: number;
}

export interface TripSummary {
  distanceKm: number;
  durationMin: number;
  fare: number;
  pickupAddress: string;
  dropoffAddress: string;
}

export interface TripState {
  phase: TripPhase;
  waypointIndex: number;
  summary: TripSummary;
}
