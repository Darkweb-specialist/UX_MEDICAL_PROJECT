import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';

export const AdherenceChart = ({ weeklyData }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.chartTitle}>7-Day Adherence Trend</Text>
      <View style={styles.chartArea}>
        {weeklyData.map((item, index) => {
          const heightPct = Math.max(item.percentage, 8); // Minimum bar height for visibility

          return (
            <View key={index} style={styles.barCol}>
              <Text style={styles.pctLabel}>{item.percentage}%</Text>
              <View style={styles.track}>
                <View
                  style={[
                    styles.bar,
                    { height: `${heightPct}%` },
                    item.isToday && styles.todayBar,
                    item.percentage < 50 && styles.lowAdherenceBar,
                  ]}
                />
              </View>
              <Text style={[styles.dayLabel, item.isToday && styles.todayLabel]}>
                {item.day}
              </Text>
            </View>
          );
        })}
      </View>
      <View style={styles.legendRow}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: Colors.primary }]} />
          <Text style={styles.legendText}>Good (≥80%)</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: Colors.warning }]} />
          <Text style={styles.legendText}>Moderate</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: Colors.danger }]} />
          <Text style={styles.legendText}>Needs Attention</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chartTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  chartArea: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 140,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  barCol: {
    flex: 1,
    alignItems: 'center',
    height: '100%',
    justifyContent: 'flex-end',
  },
  pctLabel: {
    fontSize: 10,
    color: Colors.textSecondary,
    fontWeight: '600',
    marginBottom: 4,
  },
  track: {
    width: 14,
    height: 90,
    backgroundColor: '#F1F5F9',
    borderRadius: 7,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  bar: {
    width: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 7,
  },
  todayBar: {
    backgroundColor: Colors.primaryDark,
  },
  lowAdherenceBar: {
    backgroundColor: Colors.warning,
  },
  dayLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 6,
    fontWeight: '500',
  },
  todayLabel: {
    color: Colors.primary,
    fontWeight: '700',
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginTop: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
});
