import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface LoadingOverlayProps {
  /** Primary status message — e.g. "Loading map…" or "Planning route…" */
  message: string;
  /** Optional non-fatal note rendered below the spinner — e.g. fallback warning */
  note?: string | null;
}

/**
 * Full-screen absolute overlay shown while the map or route data is loading.
 * Sits above the (already-mounted) Map so MapLibre can still fire
 * onDidFinishLoadingMap in the background.
 */
export function LoadingOverlay({ message, note }: LoadingOverlayProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ActivityIndicator size="large" color="#1A73E8" />
      <Text style={styles.message}>{message}</Text>
      {!!note && <Text style={styles.note}>{note}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#F8FBFF',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  message: {
    marginTop: 14,
    fontSize: 16,
    color: '#444444',
    fontWeight: '600',
  },
  note: {
    marginTop: 8,
    fontSize: 12,
    color: '#AAAAAA',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
});
