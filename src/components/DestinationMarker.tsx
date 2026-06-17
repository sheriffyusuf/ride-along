import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ViewAnnotation } from '@maplibre/maplibre-react-native';
import type { LngLat } from '../types';

interface DestinationMarkerProps {
  lngLat: LngLat;
}

/** Static destination pin rendered as a React Native view on the map. */
export function DestinationMarker({ lngLat }: DestinationMarkerProps) {
  return (
    <ViewAnnotation lngLat={lngLat} anchor="bottom">
      <View style={styles.container}>
        <View style={styles.pin}>
          <Text style={styles.icon}>📍</Text>
        </View>
        <View style={styles.label}>
          <Text style={styles.labelText}>Destination</Text>
        </View>
      </View>
    </ViewAnnotation>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  pin: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 36,
  },
  label: {
    backgroundColor: '#34A853',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginTop: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  labelText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
