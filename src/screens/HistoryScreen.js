import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { useHealth } from '../context/HealthContext';
import { useHealthData } from '../hooks/useHealthData';
import { StatSummary } from '../components/reports/StatSummary';
import { AdherenceChart } from '../components/reports/AdherenceChart';
import { EmptyState } from '../components/common/EmptyState';

export const HistoryScreen = ({ navigation }) => {
  const { doseLogs, diaryEntries } = useHealth();
  const { todayStats, weeklyAdherence } = useHealthData();
  const [selectedFilter, setSelectedFilter] = useState('all'); // 'all', 'taken', 'skipped'

  const filteredLogs = doseLogs.filter((log) => {
    if (selectedFilter === 'all') return true;
    return log.status === selectedFilter;
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>History & Reports</Text>
        <Text style={styles.subtitle}>Medication adherence trends & logged vitals</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Today's Overview Stats */}
        <Text style={styles.sectionTitle}>Today's Adherence</Text>
        <StatSummary stats={todayStats} />

        {/* 7-Day Adherence Visual Trend Chart */}
        <AdherenceChart weeklyData={weeklyAdherence} />

        {/* Dose Log Records */}
        <View style={styles.logsHeaderRow}>
          <Text style={styles.sectionTitle}>Dose Audit Log ({filteredLogs.length})</Text>

          {/* Filter Pills */}
          <View style={styles.filterGroup}>
            <Pressable
              onPress={() => setSelectedFilter('all')}
              style={[styles.filterBtn, selectedFilter === 'all' && styles.filterBtnActive]}
            >
              <Text
                style={[
                  styles.filterBtnText,
                  selectedFilter === 'all' && styles.filterBtnTextActive,
                ]}
              >
                All
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setSelectedFilter('taken')}
              style={[styles.filterBtn, selectedFilter === 'taken' && styles.filterBtnActive]}
            >
              <Text
                style={[
                  styles.filterBtnText,
                  selectedFilter === 'taken' && styles.filterBtnTextActive,
                ]}
              >
                Taken
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setSelectedFilter('skipped')}
              style={[styles.filterBtn, selectedFilter === 'skipped' && styles.filterBtnActive]}
            >
              <Text
                style={[
                  styles.filterBtnText,
                  selectedFilter === 'skipped' && styles.filterBtnTextActive,
                ]}
              >
                Skipped
              </Text>
            </Pressable>
          </View>
        </View>

        {filteredLogs.length === 0 ? (
          <EmptyState
            icon="clipboard-outline"
            title="No dose records for this filter"
            description="Dose actions logged from the Dashboard or Reminders appear here."
          />
        ) : (
          filteredLogs.slice(0, 15).map((log) => {
            const isTaken = log.status === 'taken';
            return (
              <View key={log.id} style={styles.logCard}>
                <View style={styles.logLeft}>
                  <View
                    style={[
                      styles.logIconCircle,
                      { backgroundColor: isTaken ? Colors.successLight : Colors.dangerLight },
                    ]}
                  >
                    <Ionicons
                      name={isTaken ? 'checkmark' : 'close'}
                      size={18}
                      color={isTaken ? Colors.success : Colors.danger}
                    />
                  </View>
                  <View>
                    <Text style={styles.logMedName}>{log.medicineName}</Text>
                    <Text style={styles.logMeta}>
                      {log.date} • Dose Time: {log.scheduledTime}
                    </Text>
                  </View>
                </View>

                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: isTaken ? Colors.successLight : Colors.dangerLight },
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      { color: isTaken ? '#065F46' : '#991B1B' },
                    ]}
                  >
                    {isTaken ? 'Taken' : 'Skipped'}
                  </Text>
                </View>
              </View>
            );
          })
        )}

        {/* Recent Diary Entries preview */}
        <View style={styles.diarySectionHeader}>
          <Text style={styles.sectionTitle}>Recent Diary Observations ({diaryEntries.length})</Text>
          <Pressable onPress={() => navigation.navigate('DiaryTab')}>
            <Text style={styles.seeAllText}>View All</Text>
          </Pressable>
        </View>

        {diaryEntries.slice(0, 2).map((item) => (
          <View key={item.id} style={styles.diaryMiniCard}>
            <View style={styles.miniHeader}>
              <Text style={styles.miniDate}>{item.date} ({item.time})</Text>
              {item.temperature && (
                <Text style={styles.miniTemp}>🌡️ {item.temperature}</Text>
              )}
            </View>
            {item.symptoms && <Text style={styles.miniSymptoms}>Symptoms: {item.symptoms}</Text>}
            {item.notes && <Text style={styles.miniNotes} numberOfLines={2}>{item.notes}</Text>}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  logsHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  filterGroup: {
    flexDirection: 'row',
    backgroundColor: '#E2E8F0',
    borderRadius: 8,
    padding: 2,
  },
  filterBtn: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  filterBtnActive: {
    backgroundColor: '#FFFFFF',
  },
  filterBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  filterBtnTextActive: {
    color: Colors.textPrimary,
  },
  logCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginVertical: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  logLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  logIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  logMedName: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  logMeta: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },
  diarySectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 8,
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.primary,
  },
  diaryMiniCard: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 12,
    marginVertical: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  miniHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  miniDate: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  miniTemp: {
    fontSize: 12,
    color: '#EA580C',
    fontWeight: '600',
  },
  miniSymptoms: {
    fontSize: 12,
    color: Colors.textPrimary,
    fontWeight: '500',
    marginBottom: 2,
  },
  miniNotes: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
});
