import { router } from 'expo-router';
import { useTripContext } from '../context/TripContext';
import type { TripSummary } from '../types';

interface UseArrivalReturn {
  summary: TripSummary;
  onCompleteRide: () => void;
}

/**
 * Encapsulates all logic for the Arrival screen:
 *   - reads trip summary from shared context
 *   - dispatches COMPLETE_RIDE and navigates back to a clean slate
 *
 * The screen itself only handles layout and presentation.
 */
export function useArrival(): UseArrivalReturn {
  const { state, dispatch } = useTripContext();

  function onCompleteRide() {
    dispatch({ type: 'COMPLETE_RIDE' });
    router.replace('/');
  }

  return {
    summary: state.summary,
    onCompleteRide,
  };
}
