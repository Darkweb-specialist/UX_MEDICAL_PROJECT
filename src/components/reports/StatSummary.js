import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';

export const StatSummary = ({ stats }) => {
  return (
    <View style={styles.grid}>
      <View style={[styles.statCard, { borderLeftColor: Colors.primary }]}>
        <View style={styles.headerRow}>
          <Text style={styles.label}>Completion</Text>
          <Ionicons name="pie-chart" size={16} color={Colors.primary} />
        </View>
        <Text style={styles.value}>{stats.completionRate}%</Text>
        <Text style={styles.subtext}>of today's schedule</Text>
      </View>

      <View style={[styles.statCard, { borderLeftColor: Colors.success }]}>
        <View style={styles.headerRow}>
          <Text style={styles.label}>Taken</Text>
          <Ionicons name="checkmark-circle" size={16} color={Colors.success} />
        </View>
        <Text style={[styles.value, { color: Colors.success }]}>{stats.taken}</Text>
        <Text style={styles.subtext}>doses recorded</Text>
      </View>

      <View style={[styles.statCard, { borderLeftColor: Colors.warning }]}>
        <View style={styles.headerRow}>
          <Text style={styles.label}>Pending</Text>
          <Ionicons name="time" size={16} color={Colors.warning} />
        </View>
        <Text style={[styles.value, { color: Colors.warning }]}>{stats.pending}</Text>
        <Text style={styles.subtext}>doses left today</Text>
      </View>

      <View style={[styles.statCard, { borderLeftColor: Colors.danger }]}>
        <View style={styles.headerRow}>
          <Text style={styles.label}>Skipped</Text>
          <Ionicons name="close-circle" size={16} color={Colors.danger} />
        </View>
        <Text style={[styles.value, { color: Colors.danger }]}>{stats.skipped}</Text>
        <Text style={styles.subtext}>doses marked skipped</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginVertical: 10,
  },
  statCard: {
    flexBasis: '48%',
    flexGrow: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    borderLeftWidth: 4,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  value: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  subtext: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
  },
});
