import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { Driver } from '../types';
import { calculateETA, formatDuration } from '../utils/tripCalculations';
import { STEP_DURATION_MS } from '../constants/mockData';

interface DriverInfoCardProps {
  driver: Driver;
  waypointIndex: number;
  /** Total number of steps in the route (allCoords.length - 1) */
  totalSteps: number;
}

export function DriverInfoCard({ driver, waypointIndex, totalSteps }: DriverInfoCardProps) {
  const remainingSteps = Math.max(0, totalSteps - waypointIndex);
  const etaMin = calculateETA(remainingSteps, STEP_DURATION_MS);
  const progressPct = totalSteps > 0
    ? Math.min((waypointIndex / totalSteps) * 100, 100)
    : 0;

  return (
    <View style={styles.card}>
      {/* Driver row */}
      <View style={styles.row}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{driver.initials}</Text>
        </View>

        <View style={styles.driverInfo}>
          <Text style={styles.driverName}>{driver.name}</Text>
          <Text style={styles.vehicleInfo} numberOfLines={1}>
            {driver.vehicle.color} {driver.vehicle.make} {driver.vehicle.model}
            {'  ·  '}
            {driver.vehicle.plate}
          </Text>
          <View style={styles.ratingRow}>
            <Text style={styles.star}>★</Text>
            <Text style={styles.ratingText}>{driver.rating.toFixed(1)}</Text>
          </View>
        </View>

        <View style={styles.etaBadge}>
          <Text style={styles.etaValue}>{etaMin}</Text>
          <Text style={styles.etaLabel}>{etaMin === 1 ? 'min' : 'min'}</Text>
        </View>
      </View>

      {/* Progress bar */}
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progressPct}%` }]} />
      </View>

      <Text style={styles.statusText}>
        {remainingSteps > 0
          ? `Arriving in ${formatDuration(etaMin)}`
          : 'Driver has arrived'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#1A73E8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  driverInfo: {
    flex: 1,
  },
  driverName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111111',
    marginBottom: 2,
  },
  vehicleInfo: {
    fontSize: 13,
    color: '#777777',
    marginBottom: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  star: {
    color: '#F4B400',
    fontSize: 14,
  },
  ratingText: {
    fontSize: 13,
    color: '#444444',
    fontWeight: '600',
  },
  etaBadge: {
    alignItems: 'center',
    backgroundColor: '#EBF3FF',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 10,
    minWidth: 60,
  },
  etaValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1A73E8',
    lineHeight: 28,
  },
  etaLabel: {
    fontSize: 11,
    color: '#1A73E8',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  progressTrack: {
    height: 4,
    backgroundColor: '#EEEEEE',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressFill: {
    height: 4,
    backgroundColor: '#1A73E8',
    borderRadius: 2,
  },
  statusText: {
    fontSize: 13,
    color: '#999999',
    textAlign: 'center',
    paddingBottom: 4,
  },
});
