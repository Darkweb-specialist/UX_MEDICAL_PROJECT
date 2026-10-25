import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Pressable,
  Image,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { useHealth } from '../context/HealthContext';
import { Header } from '../components/common/Header';
import { InputField } from '../components/common/InputField';
import { Button } from '../components/common/Button';

const MEDICINE_TYPES = ['Tablet', 'Capsule', 'Syrup', 'Drops', 'Injection', 'Cream'];
const INSTRUCTION_OPTIONS = ['After Food', 'Before Food', 'With Food', 'Empty Stomach', 'At Bedtime'];
const FREQUENCY_OPTIONS = ['Daily', 'Twice Daily', 'Selected Days', 'As Needed'];
const DEFAULT_TIMES = ['08:00', '14:00', '20:00'];

export const EditMedicineScreen = ({ route, navigation }) => {
  const { medicineId } = route.params;
  const { medicines, updateMedicine } = useHealth();

  const existingMedicine = medicines.find((m) => m.id === medicineId);

  const [name, setName] = useState(existingMedicine?.name || '');
  const [dosage, setDosage] = useState(existingMedicine?.dosage || '');
  const [selectedType, setSelectedType] = useState(existingMedicine?.type || 'Tablet');
  const [instruction, setInstruction] = useState(existingMedicine?.instructions || 'After Food');
  const [frequency, setFrequency] = useState(existingMedicine?.frequency || 'Daily');
  const [times, setTimes] = useState(
    Array.isArray(existingMedicine?.times) ? existingMedicine.times : ['08:00']
  );
  const [startDate, setStartDate] = useState(existingMedicine?.startDate || '');
  const [endDate, setEndDate] = useState(existingMedicine?.endDate || '');
  const [notes, setNotes] = useState(existingMedicine?.notes || '');
  const [category, setCategory] = useState(existingMedicine?.category || '');
  const [imageUri, setImageUri] = useState(existingMedicine?.imageUri || null);

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const errs = {};
    if (!name.trim()) errs.name = 'Medicine name is required';
    if (!dosage.trim()) errs.dosage = 'Dosage is required';
    if (times.length === 0) errs.times = 'At least one reminder time is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Gallery permission is required to update photo.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleToggleTime = (timeStr) => {
    if (times.includes(timeStr)) {
      if (times.length > 1) {
        setTimes(times.filter((t) => t !== timeStr));
      }
    } else {
      setTimes([...times, timeStr].sort());
    }
  };

  const handleUpdate = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await updateMedicine(medicineId, {
        name: name.trim(),
        dosage: dosage.trim(),
        type: selectedType,
        instructions: instruction,
        frequency,
        times,
        startDate,
        endDate: endDate ? endDate.trim() : null,
        category: category.trim() || 'General',
        imageUri,
        notes: notes.trim(),
      });

      navigation.goBack();
    } catch {
      Alert.alert('Error', 'Failed to update medicine details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <Header
        title="Edit Medicine"
        subtitle="Update schedules or instructions"
        onBack={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Photo preview / change */}
        <View style={styles.photoSection}>
          {imageUri ? (
            <View style={styles.imagePreviewContainer}>
              <Image source={{ uri: imageUri }} style={styles.previewImage} />
              <Pressable style={styles.removeImageBtn} onPress={() => setImageUri(null)}>
                <Ionicons name="close-circle" size={24} color={Colors.danger} />
              </Pressable>
              <Pressable style={styles.changeImageBtn} onPress={handlePickImage}>
                <Text style={styles.changeImageText}>Change Photo</Text>
              </Pressable>
            </View>
          ) : (
            <Pressable style={styles.uploadBox} onPress={handlePickImage}>
              <Ionicons name="camera-outline" size={28} color={Colors.primary} />
              <Text style={styles.uploadTitle}>Attach Medicine Photo</Text>
            </Pressable>
          )}
        </View>

        <InputField
          label="Medicine Name *"
          value={name}
          onChangeText={setName}
          error={errors.name}
        />

        <InputField
          label="Dosage *"
          value={dosage}
          onChangeText={setDosage}
          error={errors.dosage}
        />

        <InputField
          label="Category"
          value={category}
          onChangeText={setCategory}
        />

        {/* Types */}
        <View style={styles.selectorSection}>
          <Text style={styles.sectionLabel}>Medicine Form</Text>
          <View style={styles.chipsRow}>
            {MEDICINE_TYPES.map((type) => (
              <Pressable
                key={type}
                style={[styles.chip, selectedType === type && styles.chipSelected]}
                onPress={() => setSelectedType(type)}
              >
                <Text
                  style={[styles.chipText, selectedType === type && styles.chipTextSelected]}
                >
                  {type}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Instructions */}
        <View style={styles.selectorSection}>
          <Text style={styles.sectionLabel}>Instructions</Text>
          <View style={styles.chipsRow}>
            {INSTRUCTION_OPTIONS.map((opt) => (
              <Pressable
                key={opt}
                style={[styles.chip, instruction === opt && styles.chipSelected]}
                onPress={() => setInstruction(opt)}
              >
                <Text
                  style={[styles.chipText, instruction === opt && styles.chipTextSelected]}
                >
                  {opt}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Reminder Times */}
        <View style={styles.selectorSection}>
          <Text style={styles.sectionLabel}>Reminder Times</Text>
          <View style={styles.timeButtonsRow}>
            {DEFAULT_TIMES.map((timeStr) => {
              const isSelected = times.includes(timeStr);
              return (
                <Pressable
                  key={timeStr}
                  style={[styles.timeBtn, isSelected && styles.timeBtnSelected]}
                  onPress={() => handleToggleTime(timeStr)}
                >
                  <Ionicons
                    name="alarm-outline"
                    size={16}
                    color={isSelected ? '#FFFFFF' : Colors.textSecondary}
                  />
                  <Text style={[styles.timeBtnText, isSelected && styles.timeBtnTextSelected]}>
                    {timeStr}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Notes */}
        <InputField
          label="Notes"
          value={notes}
          onChangeText={setNotes}
          multiline={true}
          numberOfLines={3}
        />

        <Button
          title="Save Changes"
          onPress={handleUpdate}
          loading={isSubmitting}
          size="large"
          icon="save-outline"
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
  photoSection: {
    marginBottom: 20,
  },
  uploadBox: {
    borderWidth: 2,
    borderColor: '#CBD5E1',
    borderStyle: 'dashed',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  uploadTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginTop: 6,
  },
  imagePreviewContainer: {
    alignItems: 'center',
    position: 'relative',
  },
  previewImage: {
    width: '100%',
    height: 180,
    borderRadius: 16,
  },
  removeImageBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
  },
  changeImageBtn: {
    marginTop: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#E2E8F0',
  },
  changeImageText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  selectorSection: {
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chipSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  chipTextSelected: {
    color: '#FFFFFF',
  },
  timeButtonsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  timeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 6,
  },
  timeBtnSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  timeBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  timeBtnTextSelected: {
    color: '#FFFFFF',
  },
});
