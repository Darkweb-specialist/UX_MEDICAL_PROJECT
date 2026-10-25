import React from 'react';
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
import { AnimatedCard } from '../components/common/AnimatedCard';
import { MedicineCard } from '../components/medicine/MedicineCard';
import { StatSummary } from '../components/reports/StatSummary';
import { EmptyState } from '../components/common/EmptyState';

export const HomeScreen = ({ navigation }) => {
  const { userProfile, recordDose } = useHealth();
  const { todaySchedule, todayStats, nextReminder } = useHealthData();

  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>
              Hello, {userProfile?.name?.split(' ')[0] || 'Patient'} 👋
            </Text>
            <Text style={styles.dateText}>{formattedDate}</Text>
          </View>
          <Pressable
            style={({ pressed }) => [styles.profileAvatar, pressed && styles.pressed]}
            onPress={() => navigation.navigate('ProfileTab')}
          >
            <Ionicons name="person-circle" size={40} color={Colors.primary} />
          </Pressable>
        </View>

        {/* Next Upcoming Reminder Banner */}
        {nextReminder ? (
          <AnimatedCard delay={100} style={styles.reminderBanner}>
            <View style={styles.reminderRow}>
              <View style={styles.reminderIconCircle}>
                <Ionicons name="alarm" size={24} color="#FFFFFF" />
              </View>
              <View style={styles.reminderTextCol}>
                <Text style={styles.reminderSubtitle}>Next Scheduled Dose</Text>
                <Text style={styles.reminderTitle}>
                  {nextReminder.name} ({nextReminder.dosage})
                </Text>
                <Text style={styles.reminderTime}>
                  ⏰ Scheduled for today at {nextReminder.time}
                </Text>
              </View>
            </View>
            <View style={styles.bannerActions}>
              <Pressable
                style={({ pressed }) => [styles.bannerBtn, styles.bannerBtnSkip, pressed && styles.pressed]}
                onPress={() =>
                  recordDose({
                    medicineId: nextReminder.medicineId,
                    medicineName: nextReminder.name,
                    scheduledTime: nextReminder.time,
                    status: 'skipped',
                  })
                }
              >
                <Text style={styles.bannerBtnTextSkip}>Skip</Text>
              </Pressable>
              <Pressable
                style={({ pressed }) => [styles.bannerBtn, styles.bannerBtnTake, pressed && styles.pressed]}
                onPress={() =>
                  recordDose({
                    medicineId: nextReminder.medicineId,
                    medicineName: nextReminder.name,
                    scheduledTime: nextReminder.time,
                    status: 'taken',
                  })
                }
              >
                <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                <Text style={styles.bannerBtnTextTake}>Mark Taken</Text>
              </Pressable>
            </View>
          </AnimatedCard>
        ) : (
          <View style={styles.allDoneBanner}>
            <Ionicons name="checkmark-done-circle" size={24} color={Colors.success} />
            <Text style={styles.allDoneText}>All doses for today have been logged!</Text>
          </View>
        )}

        {/* Quick Action Buttons */}
        <View style={styles.quickActionsRow}>
          <Pressable
            style={({ pressed }) => [styles.quickActionCard, pressed && styles.pressed]}
            onPress={() => navigation.navigate('AddMedicine')}
          >
            <View style={[styles.qaIconCircle, { backgroundColor: Colors.primaryLight }]}>
              <Ionicons name="add-circle" size={24} color={Colors.primary} />
            </View>
            <Text style={styles.qaTitle}>Add Medicine</Text>
            <Text style={styles.qaSub}>Set reminder schedule</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.quickActionCard, pressed && styles.pressed]}
            onPress={() => navigation.navigate('AddDiaryEntry')}
          >
            <View style={[styles.qaIconCircle, { backgroundColor: Colors.secondaryLight }]}>
              <Ionicons name="journal" size={24} color={Colors.secondary} />
            </View>
            <Text style={styles.qaTitle}>Record Diary</Text>
            <Text style={styles.qaSub}>Log symptoms & vitals</Text>
          </Pressable>
        </View>

        {/* Today's Adherence Stats */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Today's Adherence</Text>
        </View>
        <StatSummary stats={todayStats} />

        {/* Today's Medicine Timeline */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Today's Schedule ({todaySchedule.length})</Text>
          <Pressable onPress={() => navigation.navigate('MedicinesTab')}>
            <Text style={styles.seeAllText}>View All</Text>
          </Pressable>
        </View>

        {todaySchedule.length === 0 ? (
          <EmptyState
            icon="medical-outline"
            title="No medicines scheduled for today"
            description="Add your prescribed medicines to get timely reminders."
            actionTitle="+ Add Medicine"
            onAction={() => navigation.navigate('AddMedicine')}
          />
        ) : (
          todaySchedule.map((item) => (
            <MedicineCard
              key={item.id}
              medicine={item}
              status={item.status}
              showActions={true}
              onPress={() =>
                navigation.navigate('MedicineDetails', { medicineId: item.medicineId })
              }
              onTakeDose={() =>
                recordDose({
                  medicineId: item.medicineId,
                  medicineName: item.name,
                  scheduledTime: item.time,
                  status: 'taken',
                })
              }
              onSkipDose={() =>
                recordDose({
                  medicineId: item.medicineId,
                  medicineName: item.name,
                  scheduledTime: item.time,
                  status: 'skipped',
                })
              }
            />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 6,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  dateText: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  profileAvatar: {
    padding: 2,
  },
  pressed: {
    opacity: 0.8,
  },
  reminderBanner: {
    backgroundColor: Colors.primaryDark,
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    borderWidth: 0,
  },
  reminderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reminderIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  reminderTextCol: {
    flex: 1,
  },
  reminderSubtitle: {
    fontSize: 12,
    color: Colors.primaryLight,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  reminderTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 2,
  },
  reminderTime: {
    fontSize: 13,
    color: '#E0F2FE',
    marginTop: 4,
  },
  bannerActions: {
    flexDirection: 'row',
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.15)',
    gap: 10,
  },
  bannerBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  bannerBtnSkip: {
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  bannerBtnTextSkip: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 13,
  },
  bannerBtnTake: {
    backgroundColor: '#FFFFFF',
  },
  bannerBtnTextTake: {
    color: Colors.primaryDark,
    fontWeight: '700',
    fontSize: 13,
  },
  allDoneBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.successLight,
    padding: 14,
    borderRadius: 14,
    marginBottom: 16,
    gap: 10,
  },
  allDoneText: {
    fontSize: 14,
    color: '#065F46',
    fontWeight: '600',
  },
  quickActionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  quickActionCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  qaIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  qaTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  qaSub: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.primary,
  },
});
