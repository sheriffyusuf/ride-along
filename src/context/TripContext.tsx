import React, {
  createContext,
  useContext,
  useReducer,
  type ReactNode,
} from 'react';
import type { TripPhase, TripState } from '../types';
import { MOCK_TRIP_SUMMARY, ROUTE_WAYPOINTS } from '../constants/mockData';

// ---------------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------------
type TripAction =
  | { type: 'ADVANCE_WAYPOINT'; index: number }
  | { type: 'ARRIVE' }
  | { type: 'COMPLETE_RIDE' };

// ---------------------------------------------------------------------------
// Context value
// ---------------------------------------------------------------------------
interface TripContextValue {
  state: TripState;
  dispatch: React.Dispatch<TripAction>;
}

// ---------------------------------------------------------------------------
// Initial state
// ---------------------------------------------------------------------------
const initialState: TripState = {
  phase: 'riding' as TripPhase,
  waypointIndex: 0,
  summary: MOCK_TRIP_SUMMARY,
};

// ---------------------------------------------------------------------------
// Reducer
// ---------------------------------------------------------------------------
function tripReducer(state: TripState, action: TripAction): TripState {
  switch (action.type) {
    case 'ADVANCE_WAYPOINT':
      return { ...state, waypointIndex: action.index };

    case 'ARRIVE':
      return {
        ...state,
        phase: 'arrived',
        waypointIndex: ROUTE_WAYPOINTS.length - 1,
      };

    case 'COMPLETE_RIDE':
      // Reset to clean slate
      return { ...initialState };

    default:
      return state;
  }
}

// ---------------------------------------------------------------------------
// Context + Provider
// ---------------------------------------------------------------------------
const TripContext = createContext<TripContextValue | null>(null);

export function TripProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(tripReducer, initialState);
  return (
    <TripContext.Provider value={{ state, dispatch }}>
      {children}
    </TripContext.Provider>
  );
}

export function useTripContext(): TripContextValue {
  const ctx = useContext(TripContext);
  if (!ctx) {
    throw new Error('useTripContext must be used within a <TripProvider>');
  }
  return ctx;
}
