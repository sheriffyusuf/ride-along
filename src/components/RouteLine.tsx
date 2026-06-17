import React, { useMemo } from 'react';
import { GeoJSONSource, Layer } from '@maplibre/maplibre-react-native';
import type { LngLat } from '../types';

interface RouteLineProps {
  /** All road-following coordinates for the full route */
  allCoords: LngLat[];
  /**
   * The simulation's current waypoint index (advances once per step).
   * Passed directly from useDriverSimulation so we never need to scan
   * allCoords to find the closest point — eliminates the O(n) per-frame cost.
   */
  currentIndex: number;
}

// Stable empty FeatureCollection — fed to a source when its segment has
// fewer than 2 points so MapLibre never receives an invalid LineString.
const EMPTY_FC: GeoJSON.FeatureCollection = {
  type: 'FeatureCollection',
  features: [],
};

/**
 * Two always-mounted line sources:
 *  - Remaining (blue)  — currentIndex → end
 *  - Traveled  (grey)  — start        → currentIndex
 *
 * Both sources stay mounted throughout the trip. When a segment
 * shrinks below 2 points it receives EMPTY_FC instead of unmounting,
 * preventing the native GL race that causes "Invalid geometry" warnings.
 */
export function RouteLine({ allCoords, currentIndex }: RouteLineProps) {
  const remainingGeoJSON = useMemo((): GeoJSON.Feature | GeoJSON.FeatureCollection => {
    const coords = allCoords.slice(currentIndex);
    if (coords.length < 2) return EMPTY_FC;
    return {
      type: 'Feature',
      geometry: { type: 'LineString', coordinates: coords },
      properties: {},
    };
  }, [allCoords, currentIndex]);

  const traveledGeoJSON = useMemo((): GeoJSON.Feature | GeoJSON.FeatureCollection => {
    if (currentIndex < 1) return EMPTY_FC;
    const coords = allCoords.slice(0, currentIndex + 1);
    if (coords.length < 2) return EMPTY_FC;
    return {
      type: 'Feature',
      geometry: { type: 'LineString', coordinates: coords },
      properties: {},
    };
  }, [allCoords, currentIndex]);

  return (
    <>
      {/* Remaining route — bold blue */}
      <GeoJSONSource id="route-remaining" data={remainingGeoJSON}>
        <Layer
          id="route-remaining-line"
          type="line"
          layout={{ 'line-cap': 'round', 'line-join': 'round' }}
          paint={{
            'line-color': '#1A73E8',
            'line-width': 5,
            'line-opacity': 0.9,
          }}
        />
      </GeoJSONSource>

      {/* Traveled route — dimmed grey */}
      <GeoJSONSource id="route-traveled" data={traveledGeoJSON}>
        <Layer
          id="route-traveled-line"
          type="line"
          layout={{ 'line-cap': 'round', 'line-join': 'round' }}
          paint={{
            'line-color': '#AAAAAA',
            'line-width': 4,
            'line-opacity': 0.6,
          }}
        />
      </GeoJSONSource>
    </>
  );
}
