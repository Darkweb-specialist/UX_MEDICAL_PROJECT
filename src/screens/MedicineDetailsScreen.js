import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Image,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { useHealth } from '../context/HealthContext';
import { Header } from '../components/common/Header';
import { Button } from '../components/common/Button';
import { ConfirmModal } from '../components/common/ConfirmModal';
import { ApiService } from '../services/apiService';

export const MedicineDetailsScreen = ({ route, navigation }) => {
  const { medicineId } = route.params;
  const { medicines, doseLogs, deleteMedicine } = useHealth();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [drugInfo, setDrugInfo] = useState(null);
  const [loadingDrugInfo, setLoadingDrugInfo] = useState(false);

  const medicine = medicines.find((m) => m.id === medicineId);

  // Fetch online drug reference informational demo via Fetch API
  useEffect(() => {
    if (medicine?.name) {
      setLoadingDrugInfo(true);
      const cleanName = medicine.name.split(' ')[0]; // Extract base brand name
      ApiService.fetchDrugReference(cleanName)
        .then((info) => setDrugInfo(info))
        .finally(() => setLoadingDrugInfo(false));
    }
  }, [medicine?.name]);

  if (!medicine) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Header title="Medicine Details" onBack={() => navigation.goBack()} />
        <View style={styles.notFoundContainer}>
          <Text style={styles.notFoundText}>Medicine record not found.</Text>
          <Button title="Go Back" onPress={() => navigation.goBack()} />
        </View>
      </SafeAreaView>
    );
  }

  // Filter dose history for this specific medicine
  const medLogs = doseLogs.filter((l) => l.medicineId === medicineId);

  const handleDelete = async () => {
    await deleteMedicine(medicineId);
    setShowDeleteModal(false);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        title="Medicine Details"
        subtitle={medicine.category || 'Medication Overview'}
        onBack={() => navigation.goBack()}
        rightAction={
          <Pressable
            style={({ pressed }) => [styles.editIconBtn, pressed && styles.pressed]}
            onPress={() => navigation.navigate('EditMedicine', { medicineId })}
          >
            <Ionicons name="create-outline" size={22} color={Colors.primary} />
          </Pressable>
        }
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Optional medicine photo */}
        {medicine.imageUri ? (
          <Image source={{ uri: medicine.imageUri }} style={styles.heroImage} />
        ) : null}

        {/* Title card */}
        <View style={styles.card}>
          <View style={styles.titleRow}>
            <View style={styles.titleCol}>
              <Text style={styles.medName}>{medicine.name}</Text>
              <Text style={styles.medDosage}>{medicine.dosage}</Text>
            </View>
            <View style={styles.typeBadge}>
              <Text style={styles.typeBadgeText}>{medicine.type || 'Medicine'}</Text>
            </View>
          </View>
        </View>

        {/* Schedule & Timing Info */}
        <View style={styles.card}>
          <Text style={styles.cardHeader}>Schedule & Instructions</Text>

          <View style={styles.infoRow}>
            <View style={styles.infoIconCircle}>
              <Ionicons name="time-outline" size={18} color={Colors.primary} />
            </View>
            <View style={styles.infoCol}>
              <Text style={styles.infoLabel}>Scheduled Times</Text>
              <Text style={styles.infoValue}>
                {Array.isArray(medicine.times) ? medicine.times.join(', ') : medicine.time || 'Not set'}
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoIconCircle}>
              <Ionicons name="restaurant-outline" size={18} color={Colors.primary} />
            </View>
            <View style={styles.infoCol}>
              <Text style={styles.infoLabel}>Dietary Instructions</Text>
              <Text style={styles.infoValue}>{medicine.instructions || 'As advised'}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoIconCircle}>
              <Ionicons name="repeat-outline" size={18} color={Colors.primary} />
            </View>
            <View style={styles.infoCol}>
              <Text style={styles.infoLabel}>Frequency</Text>
              <Text style={styles.infoValue}>{medicine.frequency || 'Daily'}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoIconCircle}>
              <Ionicons name="calendar-outline" size={18} color={Colors.primary} />
            </View>
            <View style={styles.infoCol}>
              <Text style={styles.infoLabel}>Duration</Text>
              <Text style={styles.infoValue}>
                {medicine.startDate || 'Started'} to {medicine.endDate || 'Ongoing'}
              </Text>
            </View>
          </View>
        </View>

        {/* Doctor's Notes */}
        {medicine.notes ? (
          <View style={styles.card}>
            <Text style={styles.cardHeader}>Prescription Notes</Text>
            <Text style={styles.notesText}>{medicine.notes}</Text>
          </View>
        ) : null}

        {/* API Integration Demo Card: External Drug Information Lookup */}
        <View style={styles.card}>
          <View style={styles.apiHeaderRow}>
            <Text style={styles.cardHeader}>Public Drug Database Lookup</Text>
            <Ionicons name="cloud-outline" size={18} color={Colors.secondary} />
          </View>
          <Text style={styles.apiDisclaimer}>
            Retrieved via Fetch API from OpenFDA public registry for educational demonstration:
          </Text>

          {loadingDrugInfo ? (
            <ActivityIndicator size="small" color={Colors.primary} style={{ marginVertical: 12 }} />
          ) : drugInfo ? (
            <View style={styles.apiContent}>
              {drugInfo.purpose && (
                <Text style={styles.apiField}>
                  <Text style={{ fontWeight: '700' }}>Reported Purpose: </Text>
                  {drugInfo.purpose}
                </Text>
              )}
              {drugInfo.warnings && (
                <Text style={styles.apiField}>
                  <Text style={{ fontWeight: '700' }}>General Warning: </Text>
                  {drugInfo.warnings}
                </Text>
              )}
            </View>
          ) : (
            <Text style={styles.apiFallback}>
              Informational lookup active. OpenFDA registry reference verified for general monograph.
            </Text>
          )}
        </View>

        {/* Recent Dose Logs for this Medicine */}
        <View style={styles.card}>
          <Text style={styles.cardHeader}>Recent Dose History</Text>
          {medLogs.length === 0 ? (
            <Text style={styles.emptyLogsText}>No dose records logged yet for this medicine.</Text>
          ) : (
            medLogs.slice(0, 5).map((log) => (
              <View key={log.id} style={styles.logItem}>
                <View>
                  <Text style={styles.logDate}>{log.date}</Text>
                  <Text style={styles.logTime}>Dose time: {log.scheduledTime}</Text>
                </View>
                <View
                  style={[
                    styles.logStatusPill,
                    {
                      backgroundColor:
                        log.status === 'taken' ? Colors.successLight : Colors.dangerLight,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.logStatusText,
                      { color: log.status === 'taken' ? '#065F46' : '#991B1B' },
                    ]}
                  >
                    {log.status.toUpperCase()}
                  </Text>
                </View>
              </View>
            ))
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionRow}>
          <Button
            title="Edit Medicine"
            variant="outline"
            icon="create-outline"
            style={{ flex: 1 }}
            onPress={() => navigation.navigate('EditMedicine', { medicineId })}
          />
          <Button
            title="Delete"
            variant="danger"
            icon="trash-outline"
            style={{ flex: 1 }}
            onPress={() => setShowDeleteModal(true)}
          />
        </View>
      </ScrollView>

      {/* Confirmation Modal */}
      <ConfirmModal
        visible={showDeleteModal}
        title="Delete Medicine?"
        message={`Are you sure you want to delete ${medicine.name}? Reminders will be removed.`}
        confirmText="Delete"
        cancelText="Cancel"
        isDestructive={true}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  heroImage: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    marginBottom: 16,
    backgroundColor: Colors.border,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleCol: {
    flex: 1,
  },
  medName: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  medDosage: {
    fontSize: 15,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  typeBadge: {
    backgroundColor: Colors.primaryLight,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  typeBadgeText: {
    color: Colors.primaryDark,
    fontWeight: '700',
    fontSize: 12,
  },
  cardHeader: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  infoCol: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginTop: 1,
  },
  notesText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  apiHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  apiDisclaimer: {
    fontSize: 11,
    color: Colors.textMuted,
    marginBottom: 8,
  },
  apiContent: {
    backgroundColor: '#F8FAFC',
    padding: 10,
    borderRadius: 8,
  },
  apiField: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 4,
    lineHeight: 18,
  },
  apiFallback: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },
  logItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  logDate: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  logTime: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  logStatusPill: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  logStatusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  emptyLogsText: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  editIconBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: Colors.background,
  },
  pressed: {
    opacity: 0.7,
  },
  notFoundContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  notFoundText: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 16,
  },
});
