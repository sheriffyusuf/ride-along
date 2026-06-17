import { useEffect, useRef, useCallback } from 'react';
import { STEP_DURATION_MS } from '../constants/mockData';
import { lerp } from '../utils/tripCalculations';
import type { LngLat } from '../types';

interface UseDriverSimulationOptions {
  /** Road-following waypoints to animate along (from useRoute) */
  waypoints: LngLat[];
  /** Called on every animation frame with the interpolated driver coordinate */
  onPositionUpdate: (coord: LngLat) => void;
  /** Called once each time the driver reaches the next waypoint (~every 3 s) */
  onWaypointAdvance: (index: number) => void;
  /** Called once when the driver reaches the final destination */
  onArrived: () => void;
}

/**
 * Simulates a driver moving along `waypoints`.
 *
 * Animation strategy (bonus requirement):
 *   Between each pair of waypoints the driver position is smoothly
 *   interpolated at ~60 fps using requestAnimationFrame + linear lerp.
 *   `onPositionUpdate` fires every frame; `onWaypointAdvance` fires
 *   once per STEP_DURATION_MS.
 *
 *   Waits until `waypoints` is non-empty before starting so the
 *   screen can fetch road-following coordinates first.
 */
export function useDriverSimulation({
  waypoints,
  onPositionUpdate,
  onWaypointAdvance,
  onArrived,
}: UseDriverSimulationOptions): void {
  const rafRef = useRef<number>(0);
  const stepStartTimeRef = useRef<number>(0);
  const waypointIndexRef = useRef<number>(0);
  const isRunningRef = useRef<boolean>(false);

  // Stable callback refs — the rAF loop reads these without re-registering
  const onPositionUpdateRef = useRef(onPositionUpdate);
  const onWaypointAdvanceRef = useRef(onWaypointAdvance);
  const onArrivedRef = useRef(onArrived);
  const waypointsRef = useRef(waypoints);

  useEffect(() => { onPositionUpdateRef.current = onPositionUpdate; }, [onPositionUpdate]);
  useEffect(() => { onWaypointAdvanceRef.current = onWaypointAdvance; }, [onWaypointAdvance]);
  useEffect(() => { onArrivedRef.current = onArrived; }, [onArrived]);
  useEffect(() => { waypointsRef.current = waypoints; }, [waypoints]);

  const animate = useCallback((timestamp: number) => {
    if (!isRunningRef.current) return;

    const pts = waypointsRef.current;

    if (stepStartTimeRef.current === 0) {
      stepStartTimeRef.current = timestamp;
    }

    const elapsed = timestamp - stepStartTimeRef.current;
    const progress = Math.min(elapsed / STEP_DURATION_MS, 1);

    const idx = waypointIndexRef.current;
    const from = pts[idx]!;
    const to = pts[idx + 1]!;

    onPositionUpdateRef.current([
      lerp(from[0], to[0], progress),
      lerp(from[1], to[1], progress),
    ]);

    if (progress >= 1) {
      waypointIndexRef.current += 1;
      stepStartTimeRef.current = 0;

      if (waypointIndexRef.current >= pts.length - 1) {
        onPositionUpdateRef.current(pts[pts.length - 1]!);
        isRunningRef.current = false;
        onArrivedRef.current();
        return;
      }

      onWaypointAdvanceRef.current(waypointIndexRef.current);
    }

    rafRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    // Don't start until we have actual waypoints
    if (waypoints.length < 2) return;

    isRunningRef.current = true;
    stepStartTimeRef.current = 0;
    waypointIndexRef.current = 0;

    onPositionUpdateRef.current(waypoints[0]!);
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      isRunningRef.current = false;
      cancelAnimationFrame(rafRef.current);
    };
  // Re-run only when the waypoints array reference changes (i.e. route loaded)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [waypoints, animate]);
}
