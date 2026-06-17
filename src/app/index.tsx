import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Map, Camera } from '@maplibre/maplibre-react-native';

import { useActiveRide } from '@/hooks/useActiveRide';
import { LoadingOverlay } from '@/components/LoadingOverlay';
import { MapErrorView } from '@/components/MapErrorView';
import { RouteLine } from '@/components/RouteLine';
import { DriverMarker } from '@/components/DriverMarker';
import { DestinationMarker } from '@/components/DestinationMarker';
import { DriverInfoCard } from '@/components/DriverInfoCard';
import { DESTINATION, ROUTE_WAYPOINTS } from '@/constants/mockData';

const MAP_STYLE_URL = 'https://tiles.openfreemap.org/styles/liberty';

export default function ActiveRideScreen() {
  const ride = useActiveRide();
  const insets = useSafeAreaInsets();

  // ── Hard error: map tiles failed to load ───────────────────────────────
  if (ride.mapError) {
    return <MapErrorView error={ride.mapError} />;
  }

  // ── Render ─────────────────────────────────────────────────────────────
  return (
    <View style={styles.container}>
      {/* Loading overlay — sits above the map while tiles / route load.
          The Map stays mounted so onDidFinishLoadingMap can still fire. */}
      {ride.isLoading && (
        <LoadingOverlay
          message={ride.loadingMessage}
          note={ride.routeFallbackNote}
        />
      )}

      <Map
        style={styles.map}
        mapStyle={MAP_STYLE_URL}
        onDidFinishLoadingMap={ride.onMapLoaded}
        onDidFailLoadingMap={ride.onMapError}
      >
        <Camera
          ref={ride.cameraRef}
          initialViewState={{ center: ROUTE_WAYPOINTS[0]!, zoom: 13 }}
        />

        {!ride.isLoading && (
          <RouteLine
            allCoords={ride.allCoords}
            currentIndex={ride.currentIndex}
          />
        )}

        <DestinationMarker lngLat={DESTINATION} />
        <DriverMarker
          lngLat={ride.driverCoord}
          initials={ride.driver.initials}
        />
      </Map>

      <View style={[styles.cardContainer, { paddingBottom: insets.bottom }]}>
        <DriverInfoCard
          driver={ride.driver}
          waypointIndex={ride.waypointIndex}
          totalSteps={ride.totalSteps}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  cardContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});
