import { useState, useEffect } from 'react';
import type { LngLat } from '../types';
import { ROUTE_WAYPOINTS } from '../constants/mockData';

// Origin:      6.5774°N, 3.3211°E — Ikeja, Lagos
// Destination: 6.4281°N, 3.4219°E — Lekki Phase 1, Lagos
// OSRM expects coordinates as longitude,latitude (GeoJSON order)
const OSRM_URL =
  'https://router.project-osrm.org/route/v1/driving/' +
  '3.3211,6.5774;3.4219,6.4281' +
  '?overview=full&geometries=geojson';

export interface RouteData {
  /** All road-following coordinates — used for both the line layers and simulation */
  allCoords: LngLat[];
  /** [SW, NE] bounding box of the full route — used for fitBounds */
  bounds: [LngLat, LngLat];
  loading: boolean;
  error: string | null;
}

function computeBounds(coords: LngLat[]): [LngLat, LngLat] {
  let minLng = Infinity, minLat = Infinity;
  let maxLng = -Infinity, maxLat = -Infinity;
  for (const [lng, lat] of coords) {
    if (lng < minLng) minLng = lng;
    if (lat < minLat) minLat = lat;
    if (lng > maxLng) maxLng = lng;
    if (lat > maxLat) maxLat = lat;
  }
  return [
    [minLng, minLat], // SW
    [maxLng, maxLat], // NE
  ];
}

const FALLBACK: Omit<RouteData, 'loading' | 'error'> = {
  allCoords: ROUTE_WAYPOINTS,
  bounds: computeBounds(ROUTE_WAYPOINTS),
};

export function useRoute(): RouteData {
  const [data, setData] = useState<Omit<RouteData, 'loading' | 'error'>>(FALLBACK);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchRoute() {
      try {
        const res = await fetch(OSRM_URL);
        if (!res.ok) throw new Error(`OSRM responded ${res.status}`);

        const json = await res.json();
        const coords: LngLat[] = json.routes[0].geometry.coordinates;

        if (!cancelled) {
          setData({
            allCoords: coords,
            bounds: computeBounds(coords),
          });
        }
      } catch {
        if (!cancelled) {
          setError('Could not fetch live route — using fallback path.');
          setData(FALLBACK);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchRoute();
    return () => { cancelled = true; };
  }, []);

  return { ...data, loading, error };
}
