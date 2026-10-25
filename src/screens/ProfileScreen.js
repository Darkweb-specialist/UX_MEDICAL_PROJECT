import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Switch,
  Pressable,
  Modal,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { useHealth } from '../context/HealthContext';
import { StorageService } from '../storage/storageService';
import { ConfirmModal } from '../components/common/ConfirmModal';
import { Button } from '../components/common/Button';

export const ProfileScreen = ({ navigation }) => {
  const { userProfile, updateProfile, resetAllData, backendStatus } = useHealth();
  const [showResetModal, setShowResetModal] = useState(false);
  const [exportModalVisible, setExportModalVisible] = useState(false);
  const [exportedData, setExportedData] = useState('');

  const handleToggleNotifications = async (val) => {
    await updateProfile({
      ...userProfile,
      notificationsEnabled: val,
    });
  };

  const handleExportData = async () => {
    const jsonStr = await StorageService.exportAllData();
    setExportedData(jsonStr);
    setExportModalVisible(true);
  };

  const handleConfirmReset = async () => {
    setShowResetModal(false);
    await resetAllData();
    Alert.alert('Data Reset', 'All records have been reset to initial college demo samples.');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Profile & Settings</Text>
        <Text style={styles.subtitle}>Health profile, preferences, and data options</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* User Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarCircle}>
            <Ionicons name="person" size={36} color={Colors.primary} />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.userName}>{userProfile?.name || 'Alex Morgan'}</Text>
            <Text style={styles.userSub}>
              Age: {userProfile?.age || '21'} • Blood Group: {userProfile?.bloodGroup || 'B+'}
            </Text>
            <View style={styles.tagRow}>
              <View style={styles.demoTag}>
                <Text style={styles.demoTagText}>Demo Student Profile</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Emergency & Doctor Contact Card */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Emergency & Clinical Contacts</Text>

          <View style={styles.rowItem}>
            <Ionicons name="call-outline" size={18} color={Colors.primary} />
            <View style={styles.rowItemText}>
              <Text style={styles.rowLabel}>Emergency Contact</Text>
              <Text style={styles.rowValue}>{userProfile?.emergencyContact || '+91 98765 43210'}</Text>
            </View>
          </View>

          <View style={styles.rowItem}>
            <Ionicons name="medkit-outline" size={18} color={Colors.primary} />
            <View style={styles.rowItemText}>
              <Text style={styles.rowLabel}>Primary Physician</Text>
              <Text style={styles.rowValue}>{userProfile?.doctorName || 'Dr. Sarah Verma, MD'}</Text>
            </View>
          </View>
        </View>

        {/* Notifications & System Settings */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Preferences & Reminders</Text>

          <View style={styles.settingToggleRow}>
            <View style={styles.settingTextCol}>
              <Text style={styles.settingTitle}>Medication Reminders</Text>
              <Text style={styles.settingSubtitle}>
                Schedule local alarms for designated dose times
              </Text>
            </View>
            <Switch
              value={userProfile?.notificationsEnabled !== false}
              onValueChange={handleToggleNotifications}
              trackColor={{ false: '#CBD5E1', true: Colors.primaryLight }}
              thumbColor={userProfile?.notificationsEnabled !== false ? Colors.primary : '#F1F5F9'}
            />
          </View>

          <View style={styles.settingDivider} />

          <View style={styles.rowItem}>
            <Ionicons name="volume-high-outline" size={18} color={Colors.primary} />
            <View style={styles.rowItemText}>
              <Text style={styles.rowLabel}>Alarm Sound</Text>
              <Text style={styles.rowValue}>Default Gentle Chime</Text>
            </View>
          </View>
        </View>

        {/* Backend & Cloud Connectivity Status */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Backend Server Status</Text>
          <View style={styles.backendStatusRow}>
            <View
              style={[
                styles.statusIndicator,
                { backgroundColor: backendStatus.isOnline ? Colors.success : Colors.warning },
              ]}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.backendStatusTitle}>
                {backendStatus.isOnline
                  ? 'Express / SQLite Backend Connected'
                  : 'Operating in Offline Mode (AsyncStorage)'}
              </Text>
              <Text style={styles.backendStatusSub}>
                {backendStatus.isOnline
                  ? 'Local REST API endpoints active at :5000'
                  : 'All features remain 100% operational offline using device storage.'}
              </Text>
            </View>
          </View>
        </View>

        {/* Data Management Actions */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Data Management</Text>

          <Pressable
            style={({ pressed }) => [styles.actionRow, pressed && styles.pressed]}
            onPress={handleExportData}
          >
            <View style={styles.actionIconTitle}>
              <Ionicons name="download-outline" size={20} color={Colors.primary} />
              <Text style={styles.actionText}>Export Local Data as JSON</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
          </Pressable>

          <View style={styles.settingDivider} />

          <Pressable
            style={({ pressed }) => [styles.actionRow, pressed && styles.pressed]}
            onPress={() => setShowResetModal(true)}
          >
            <View style={styles.actionIconTitle}>
              <Ionicons name="refresh-circle-outline" size={20} color={Colors.danger} />
              <Text style={[styles.actionText, { color: Colors.danger }]}>
                Reset to Sample Demo Data
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
          </Pressable>
        </View>

        {/* Project & Syllabus Information */}
        <View style={styles.aboutCard}>
          <Text style={styles.aboutTitle}>MediCare • BTech CSE Mini Project</Text>
          <Text style={styles.aboutText}>
            Demonstrates React Native Flexbox, Stack & Tab Navigation, React Hooks,
            AsyncStorage, Expo Notifications, Expo Image Picker, Camera permissions,
            Gesture Handler, Express Backend, Docker, and Kubernetes.
          </Text>
        </View>
      </ScrollView>

      {/* Confirmation Modal for Data Reset */}
      <ConfirmModal
        visible={showResetModal}
        title="Reset All Data?"
        message="This will restore initial sample medicines, history, and diary entries for your college demonstration."
        confirmText="Yes, Reset"
        cancelText="Cancel"
        isDestructive={true}
        onConfirm={handleConfirmReset}
        onCancel={() => setShowResetModal(false)}
      />

      {/* Export JSON Modal */}
      <Modal visible={exportModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Local Data Export</Text>
              <Pressable onPress={() => setExportModalVisible(false)}>
                <Ionicons name="close" size={24} color={Colors.textPrimary} />
              </Pressable>
            </View>
            <Text style={styles.modalSub}>
              Raw JSON representation of medicines, dose records, and diary entries:
            </Text>
            <ScrollView style={styles.jsonBox}>
              <Text style={styles.jsonText}>{exportedData}</Text>
            </ScrollView>
            <Button
              title="Close"
              onPress={() => setExportModalVisible(false)}
              style={{ marginTop: 12 }}
            />
          </View>
        </View>
      </Modal>
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
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  avatarCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  userSub: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  tagRow: {
    flexDirection: 'row',
    marginTop: 6,
  },
  demoTag: {
    backgroundColor: Colors.primaryMuted,
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.primaryLight,
  },
  demoTagText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.primaryDark,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  rowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 12,
  },
  rowItemText: {
    flex: 1,
  },
  rowLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  rowValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginTop: 1,
  },
  settingToggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingTextCol: {
    flex: 1,
    marginRight: 12,
  },
  settingTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  settingSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  settingDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 12,
  },
  backendStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  backendStatusTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  backendStatusSub: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  actionIconTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  pressed: {
    opacity: 0.7,
  },
  aboutCard: {
    backgroundColor: '#F1F5F9',
    borderRadius: 16,
    padding: 16,
    marginTop: 6,
  },
  aboutTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  aboutText: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  modalSub: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 12,
  },
  jsonBox: {
    backgroundColor: '#0F172A',
    borderRadius: 12,
    padding: 12,
    maxHeight: 300,
  },
  jsonText: {
    fontFamily: 'monospace',
    color: '#38BDF8',
    fontSize: 11,
  },
});
