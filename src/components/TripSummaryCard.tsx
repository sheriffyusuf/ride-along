import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { TripSummary } from '../types';
import { formatDistance, formatFare, formatDuration } from '../utils/tripCalculations';

interface TripSummaryCardProps {
  summary: TripSummary;
}

export function TripSummaryCard({ summary }: TripSummaryCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Trip Summary</Text>

      {/* Stat row */}
      <View style={styles.statsRow}>
        <StatItem
          icon="📍"
          value={formatDistance(summary.distanceKm)}
          label="Distance"
        />
        <View style={styles.dividerV} />
        <StatItem
          icon="⏱"
          value={formatDuration(summary.durationMin)}
          label="Duration"
        />
        <View style={styles.dividerV} />
        <StatItem
          icon="💳"
          value={formatFare(summary.fare)}
          label="Fare"
        />
      </View>

      <View style={styles.dividerH} />

      {/* Addresses */}
      <AddressRow label="From" address={summary.pickupAddress} dot="#1A73E8" />
      <AddressRow label="To" address={summary.dropoffAddress} dot="#34A853" />
    </View>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------
interface StatItemProps {
  icon: string;
  value: string;
  label: string;
}

function StatItem({ icon, value, label }: StatItemProps) {
  return (
    <View style={styles.statItem}>
      <Text style={styles.statIcon}>{icon}</Text>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

interface AddressRowProps {
  label: string;
  address: string;
  dot: string;
}

function AddressRow({ label, address, dot }: AddressRowProps) {
  return (
    <View style={styles.addressRow}>
      <View style={[styles.dot, { backgroundColor: dot }]} />
      <View style={styles.addressText}>
        <Text style={styles.addressLabel}>{label}</Text>
        <Text style={styles.address}>{address}</Text>
      </View>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------
const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    marginHorizontal: 20,
    marginVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 14,
    elevation: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111111',
    textAlign: 'center',
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 20,
  },
  dividerV: {
    width: 1,
    height: 48,
    backgroundColor: '#F0F0F0',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  statIcon: {
    fontSize: 22,
  },
  statValue: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111111',
  },
  statLabel: {
    fontSize: 11,
    color: '#999999',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  dividerH: {
    height: 1,
    backgroundColor: '#F4F4F4',
    marginBottom: 16,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 12,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: 5,
    flexShrink: 0,
  },
  addressText: {
    flex: 1,
  },
  addressLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#AAAAAA',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  address: {
    fontSize: 14,
    color: '#333333',
    lineHeight: 20,
  },
});
