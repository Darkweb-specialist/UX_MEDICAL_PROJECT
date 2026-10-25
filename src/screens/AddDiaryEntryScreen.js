import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Pressable,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { useHealth } from '../context/HealthContext';
import { Header } from '../components/common/Header';
import { InputField } from '../components/common/InputField';
import { Button } from '../components/common/Button';
import { LocationService } from '../services/locationService';

export const AddDiaryEntryScreen = ({ route, navigation }) => {
  const editEntry = route.params?.editEntry;
  const { addDiaryEntry, updateDiaryEntry } = useHealth();

  const now = new Date();
  const defaultTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const defaultDate = now.toISOString().split('T')[0];

  const [date, setDate] = useState(editEntry?.date || defaultDate);
  const [time, setTime] = useState(editEntry?.time || defaultTime);
  const [symptoms, setSymptoms] = useState(editEntry?.symptoms || '');
  const [temperature, setTemperature] = useState(editEntry?.temperature || '');
  const [bloodPressure, setBloodPressure] = useState(editEntry?.bloodPressure || '');
  const [pulse, setPulse] = useState(editEntry?.pulse || '');
  const [notes, setNotes] = useState(editEntry?.notes || '');
  const [location, setLocation] = useState(editEntry?.location || '');

  const [isLocating, setIsLocating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Optional Location Integration
  const handleDetectLocation = async () => {
    setIsLocating(true);
    try {
      const locName = await LocationService.getApproximateLocationName();
      if (locName) {
        setLocation(locName);
      } else {
        Alert.alert(
          'Location Optional',
          'Could not retrieve approximate location. You can type your location manually or leave it blank.'
        );
      }
    } catch {
      Alert.alert('Notice', 'Location access is optional and was skipped.');
    } finally {
      setIsLocating(false);
    }
  };

  const handleSave = async () => {
    if (!symptoms.trim() && !notes.trim() && !temperature.trim()) {
      setError('Please add at least symptoms, notes, or temperature.');
      return;
    }

    setIsSubmitting(true);
    try {
      const entryPayload = {
        date: date.trim() || defaultDate,
        time: time.trim() || defaultTime,
        symptoms: symptoms.trim(),
        temperature: temperature.trim(),
        bloodPressure: bloodPressure.trim(),
        pulse: pulse.trim(),
        notes: notes.trim(),
        location: location.trim(),
      };

      if (editEntry) {
        await updateDiaryEntry(editEntry.id, entryPayload);
      } else {
        await addDiaryEntry(entryPayload);
      }

      navigation.goBack();
    } catch {
      Alert.alert('Error', 'Failed to save health diary entry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <Header
        title={editEntry ? 'Edit Health Entry' : 'New Diary Entry'}
        subtitle="Record your daily wellness & symptoms"
        onBack={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Date & Time Row */}
        <View style={styles.row}>
          <View style={{ flex: 1, marginRight: 8 }}>
            <InputField
              label="Date"
              placeholder="YYYY-MM-DD"
              value={date}
              onChangeText={setDate}
            />
          </View>
          <View style={{ flex: 1, marginLeft: 8 }}>
            <InputField
              label="Time"
              placeholder="e.g. 09:30 AM"
              value={time}
              onChangeText={setTime}
            />
          </View>
        </View>

        {/* Vitals Measurements Grid */}
        <Text style={styles.sectionTitle}>Vitals & Measurements (Optional)</Text>
        <View style={styles.vitalsGrid}>
          <View style={styles.vitalCol}>
            <InputField
              label="Body Temp"
              placeholder="98.6 °F"
              value={temperature}
              onChangeText={setTemperature}
            />
          </View>
          <View style={styles.vitalCol}>
            <InputField
              label="Blood Pressure"
              placeholder="120/80"
              value={bloodPressure}
              onChangeText={setBloodPressure}
            />
          </View>
          <View style={styles.vitalCol}>
            <InputField
              label="Pulse Rate"
              placeholder="72 bpm"
              value={pulse}
              onChangeText={setPulse}
            />
          </View>
        </View>

        {/* Symptoms / Observations */}
        <InputField
          label="Symptoms or Observations"
          placeholder="e.g. Mild headache, throat irritation, energetic after breakfast"
          value={symptoms}
          onChangeText={(val) => {
            setSymptoms(val);
            if (error) setError(null);
          }}
          multiline={true}
          numberOfLines={3}
        />

        {/* General Health Notes */}
        <InputField
          label="Health Notes & Activities"
          placeholder="e.g. Walked 30 mins, drank 3L water, slept 8 hours"
          value={notes}
          onChangeText={(val) => {
            setNotes(val);
            if (error) setError(null);
          }}
          multiline={true}
          numberOfLines={4}
        />

        {/* Optional Location Integration Demonstration */}
        <View style={styles.locationSection}>
          <View style={styles.locationHeaderRow}>
            <Text style={styles.locationLabel}>Location (Optional Hardware Demo)</Text>
            <Pressable
              style={styles.detectBtn}
              onPress={handleDetectLocation}
              disabled={isLocating}
            >
              {isLocating ? (
                <ActivityIndicator size="small" color={Colors.primary} />
              ) : (
                <>
                  <Ionicons name="navigate" size={14} color={Colors.primary} />
                  <Text style={styles.detectBtnText}>Detect Location</Text>
                </>
              )}
            </Pressable>
          </View>
          <InputField
            placeholder="e.g. Home, Office, Campus Clinic"
            value={location}
            onChangeText={setLocation}
          />
        </View>

        {error && <Text style={styles.errorText}>{error}</Text>}

        {/* Educational Disclaimer */}
        <Text style={styles.disclaimerText}>
          ℹ️ Note: This is a personal diary record. It does not provide medical diagnoses or treatment prescriptions.
        </Text>

        <Button
          title={editEntry ? 'Update Diary Entry' : 'Save Diary Entry'}
          onPress={handleSave}
          loading={isSubmitting}
          size="large"
          icon="checkmark-circle-outline"
          style={styles.saveBtn}
        />
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
    padding: 16,
    paddingBottom: 40,
  },
  row: {
    flexDirection: 'row',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 8,
    marginTop: 4,
  },
  vitalsGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  vitalCol: {
    flex: 1,
  },
  locationSection: {
    marginTop: 6,
  },
  locationHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  locationLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  detectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: Colors.primaryLight,
  },
  detectBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primaryDark,
  },
  errorText: {
    color: Colors.danger,
    fontSize: 13,
    marginBottom: 10,
    fontWeight: '500',
  },
  disclaimerText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    marginBottom: 16,
    lineHeight: 18,
  },
  saveBtn: {
    marginTop: 8,
  },
});
