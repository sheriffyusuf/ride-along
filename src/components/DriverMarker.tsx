import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ViewAnnotation } from '@maplibre/maplibre-react-native';
import type { LngLat } from '../types';

interface DriverMarkerProps {
  lngLat: LngLat;
  initials: string;
}

/**
 * Animated driver marker rendered as a React Native view on the map.
 * Position updates at ~60 fps driven by useDriverSimulation.
 */
export function DriverMarker({ lngLat, initials }: DriverMarkerProps) {
  return (
    <ViewAnnotation lngLat={lngLat} anchor="bottom">
      <View style={styles.container}>
        <View style={styles.bubble}>
          <Text style={styles.icon}>🚗</Text>
        </View>
        <View style={styles.tail} />
        <View style={styles.initialsChip}>
          <Text style={styles.initialsText}>{initials}</Text>
        </View>
      </View>
    </ViewAnnotation>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  bubble: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1A73E8',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
    borderColor: '#FFFFFF',
    shadowColor: '#1A73E8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  icon: {
    fontSize: 22,
  },
  tail: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 7,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#1A73E8',
    marginTop: -1,
  },
  initialsChip: {
    backgroundColor: '#111111',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginTop: 3,
  },
  initialsText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
