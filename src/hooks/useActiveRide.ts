import { useState, useCallback, useRef, useEffect } from 'react';
import { router } from 'expo-router';
import type { RefObject } from 'react';
import type { CameraRef } from '@maplibre/maplibre-react-native';

import { useTripContext } from '../context/TripContext';
import { useRoute } from './useRoute';
import { useDriverSimulation } from './useDriverSimulation';
import { MOCK_DRIVER, ROUTE_WAYPOINTS } from '../constants/mockData';
import type { Driver, LngLat } from '../types';

// ─── Camera behaviour ────────────────────────────────────────────────────────
/** Target number of smooth camera repositions over the full trip */
const CAMERA_PANS = 12;
/** Duration (ms) of each camera ease animation */
const CAMERA_EASE_MS = 2500;
/** Padding (pts) when fitting the full route into view on load */
const FIT_PADDING = { top: 80, bottom: 280, left: 50, right: 50 };

// ─── Return type ─────────────────────────────────────────────────────────────
export interface UseActiveRideReturn {
  // Status — drives early return and loading overlay in the screen
  isLoading: boolean;
  loadingMessage: string;
  mapError: string | null;
  routeFallbackNote: string | null;

  // Map layer data
  cameraRef: RefObject<CameraRef | null>;
  allCoords: LngLat[];
  driverCoord: LngLat;
  currentIndex: number;

  // Driver info card
  driver: Driver;
  waypointIndex: number;
  totalSteps: number;

  // Map lifecycle callbacks
  onMapLoaded: () => void;
  onMapError: () => void;
}

/**
 * Orchestration hook for the Active Ride screen.
 *
 * Composes useRoute + useDriverSimulation + TripContext and owns all
 * derived state, refs, effects, and camera logic. The screen only
 * handles layout and delegates every behaviour decision here.
 */
export function useActiveRide(): UseActiveRideReturn {
  const { state, dispatch } = useTripContext();

  // ── Route ──────────────────────────────────────────────────────────────────
  const route = useRoute();

  // ── Driver position — updated at ~60 fps via rAF ──────────────────────────
  const [driverCoord, setDriverCoord] = useState<LngLat>(ROUTE_WAYPOINTS[0]!);

  // ── Simulation waypoint index — advances once per step (every 250 ms) ─────
  const [currentIndex, setCurrentIndex] = useState(0);

  // ── Map lifecycle ──────────────────────────────────────────────────────────
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);

  // ── Camera ─────────────────────────────────────────────────────────────────
  const cameraRef = useRef<CameraRef>(null);

  /**
   * How many steps to skip between camera repositions.
   * Recalculated once after the OSRM route loads.
   */
  const cameraUpdateEveryRef = useRef(1);
  useEffect(() => {
    const total = route.allCoords.length - 1;
    cameraUpdateEveryRef.current = Math.max(1, Math.ceil(total / CAMERA_PANS));
  }, [route.allCoords.length]);

  // ── Fit full route into view once map + route are both ready ──────────────
  useEffect(() => {
    if (!mapLoaded || route.loading) return;

    const [sw, ne] = route.bounds;
    cameraRef.current?.fitBounds(
      [sw[0], sw[1], ne[0], ne[1]],
      { padding: FIT_PADDING, duration: 800 },
    );

    // After the overview animation settles, zoom into the driver start
    const timer = setTimeout(() => {
      cameraRef.current?.easeTo({
        center: route.allCoords[0] ?? ROUTE_WAYPOINTS[0]!,
        zoom: 15,
        duration: 1000,
      });
    }, 1600);

    return () => clearTimeout(timer);
  }, [mapLoaded, route.loading, route.bounds, route.allCoords]);

  // ── Simulation callbacks ───────────────────────────────────────────────────
  const handlePositionUpdate = useCallback((coord: LngLat) => {
    setDriverCoord(coord);
  }, []);

  const handleWaypointAdvance = useCallback(
    (index: number) => {
      setCurrentIndex(index);
      dispatch({ type: 'ADVANCE_WAYPOINT', index });

      // Throttle camera to ~CAMERA_PANS repositions over the full trip
      if (index % cameraUpdateEveryRef.current === 0) {
        cameraRef.current?.easeTo({
          center: route.allCoords[index]!,
          zoom: 15,
          duration: CAMERA_EASE_MS,
        });
      }
    },
    [dispatch, route.allCoords],
  );

  const handleArrived = useCallback(() => {
    dispatch({ type: 'ARRIVE' });
    setTimeout(() => router.push('/arrival'), 800);
  }, [dispatch]);

  useDriverSimulation({
    waypoints: route.allCoords,
    onPositionUpdate: handlePositionUpdate,
    onWaypointAdvance: handleWaypointAdvance,
    onArrived: handleArrived,
  });

  // ── Map event handlers (stable references for Map props) ──────────────────
  const onMapLoaded = useCallback(() => setMapLoaded(true), []);
  const onMapError = useCallback(
    () => setMapError('Could not load map tiles. Check your connection.'),
    [],
  );

  // ── Derived status ─────────────────────────────────────────────────────────
  const isLoading = !mapLoaded || route.loading;
  const loadingMessage = !mapLoaded ? 'Loading map…' : 'Planning route…';

  return {
    isLoading,
    loadingMessage,
    mapError,
    routeFallbackNote: route.error,

    cameraRef,
    allCoords: route.allCoords,
    driverCoord,
    currentIndex,

    driver: MOCK_DRIVER,
    waypointIndex: state.waypointIndex,
    totalSteps: route.allCoords.length - 1,

    onMapLoaded,
    onMapError,
  };
}
