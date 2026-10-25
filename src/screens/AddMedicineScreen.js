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

export const AddMedicineScreen = ({ navigation }) => {
  const { addMedicine } = useHealth();

  // Form states
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [selectedType, setSelectedType] = useState('Tablet');
  const [instruction, setInstruction] = useState('After Food');
  const [frequency, setFrequency] = useState('Daily');
  const [times, setTimes] = useState(['08:00']);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState('');
  const [notes, setNotes] = useState('');
  const [category, setCategory] = useState('');
  const [imageUri, setImageUri] = useState(null);

  // Errors & loading
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation
  const validateForm = () => {
    const errs = {};
    if (!name.trim()) errs.name = 'Medicine name is required';
    if (!dosage.trim()) errs.dosage = 'Dosage (e.g. 1 Tablet, 5ml) is required';
    if (times.length === 0) errs.times = 'At least one reminder time is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Image Picker (Camera or Library)
  const handlePickImage = async () => {
    Alert.alert(
      'Attach Medicine Photo',
      'Choose a method to add a picture of your medicine package:',
      [
        {
          text: 'Take Photo',
          onPress: async () => {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            if (status !== 'granted') {
              Alert.alert(
                'Permission Denied',
                'Camera permission is required to photograph medicine packages. You can still use the app without photos.'
              );
              return;
            }
            const result = await ImagePicker.launchCameraAsync({
              allowsEditing: true,
              aspect: [4, 3],
              quality: 0.7,
            });
            if (!result.canceled && result.assets && result.assets.length > 0) {
              setImageUri(result.assets[0].uri);
            }
          },
        },
        {
          text: 'Choose from Gallery',
          onPress: async () => {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
              Alert.alert(
                'Permission Denied',
                'Photo library permission is needed to select a picture.'
              );
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
          },
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  // Toggle or add reminder time
  const handleToggleDefaultTime = (timeStr) => {
    if (times.includes(timeStr)) {
      if (times.length > 1) {
        setTimes(times.filter((t) => t !== timeStr));
      }
    } else {
      setTimes([...times, timeStr].sort());
    }
  };

  // Submit
  const handleSave = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await addMedicine({
        name: name.trim(),
        dosage: dosage.trim(),
        type: selectedType,
        instructions: instruction,
        frequency,
        times,
        startDate: startDate || new Date().toISOString().split('T')[0],
        endDate: endDate ? endDate.trim() : null,
        category: category.trim() || 'General',
        imageUri,
        notes: notes.trim(),
      });

      navigation.goBack();
    } catch (err) {
      Alert.alert('Error', 'Failed to save medication. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <Header
        title="Add Medicine"
        subtitle="Set up your reminders and dosage"
        onBack={() => navigation.goBack()}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Photo preview / upload banner */}
        <View style={styles.photoSection}>
          {imageUri ? (
            <View style={styles.imagePreviewContainer}>
              <Image source={{ uri: imageUri }} style={styles.previewImage} />
              <Pressable
                style={styles.removeImageBtn}
                onPress={() => setImageUri(null)}
              >
                <Ionicons name="close-circle" size={24} color={Colors.danger} />
              </Pressable>
              <Pressable style={styles.changeImageBtn} onPress={handlePickImage}>
                <Text style={styles.changeImageText}>Change Photo</Text>
              </Pressable>
            </View>
          ) : (
            <Pressable
              style={({ pressed }) => [styles.uploadBox, pressed && styles.pressed]}
              onPress={handlePickImage}
            >
              <Ionicons name="camera-outline" size={32} color={Colors.primary} />
              <Text style={styles.uploadTitle}>Take or Select Medicine Photo</Text>
              <Text style={styles.uploadSubtitle}>Optional: Helps easily identify your bottle</Text>
            </Pressable>
          )}
        </View>

        {/* Form Inputs */}
        <InputField
          label="Medicine Name *"
          placeholder="e.g. Amoxicillin, Paracetamol"
          value={name}
          onChangeText={(val) => {
            setName(val);
            if (errors.name) setErrors({ ...errors, name: null });
          }}
          error={errors.name}
        />

        <InputField
          label="Dosage *"
          placeholder="e.g. 1 Tablet, 500mg, 10 ml"
          value={dosage}
          onChangeText={(val) => {
            setDosage(val);
            if (errors.dosage) setErrors({ ...errors, dosage: null });
          }}
          error={errors.dosage}
        />

        <InputField
          label="Category (Optional)"
          placeholder="e.g. Antibiotic, Blood Pressure, Supplement"
          value={category}
          onChangeText={setCategory}
        />

        {/* Medicine Type Chips */}
        <View style={styles.selectorSection}>
          <Text style={styles.sectionLabel}>Medicine Form</Text>
          <View style={styles.chipsRow}>
            {MEDICINE_TYPES.map((type) => {
              const isSelected = selectedType === type;
              return (
                <Pressable
                  key={type}
                  style={[styles.chip, isSelected && styles.chipSelected]}
                  onPress={() => setSelectedType(type)}
                >
                  <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                    {type}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Food Instructions */}
        <View style={styles.selectorSection}>
          <Text style={styles.sectionLabel}>Instructions</Text>
          <View style={styles.chipsRow}>
            {INSTRUCTION_OPTIONS.map((opt) => {
              const isSelected = instruction === opt;
              return (
                <Pressable
                  key={opt}
                  style={[styles.chip, isSelected && styles.chipSelected]}
                  onPress={() => setInstruction(opt)}
                >
                  <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                    {opt}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Frequency */}
        <View style={styles.selectorSection}>
          <Text style={styles.sectionLabel}>Frequency</Text>
          <View style={styles.chipsRow}>
            {FREQUENCY_OPTIONS.map((freq) => {
              const isSelected = frequency === freq;
              return (
                <Pressable
                  key={freq}
                  style={[styles.chip, isSelected && styles.chipSelected]}
                  onPress={() => setFrequency(freq)}
                >
                  <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                    {freq}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Reminder Times */}
        <View style={styles.selectorSection}>
          <Text style={styles.sectionLabel}>Reminder Times *</Text>
          <Text style={styles.helperText}>Select time slots for daily reminder notifications:</Text>
          <View style={styles.timeButtonsRow}>
            {DEFAULT_TIMES.map((timeStr) => {
              const isSelected = times.includes(timeStr);
              return (
                <Pressable
                  key={timeStr}
                  style={[styles.timeBtn, isSelected && styles.timeBtnSelected]}
                  onPress={() => handleToggleDefaultTime(timeStr)}
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
          {errors.times && <Text style={styles.errorText}>{errors.times}</Text>}
        </View>

        {/* Dates */}
        <View style={styles.dateRow}>
          <View style={{ flex: 1, marginRight: 8 }}>
            <InputField
              label="Start Date"
              placeholder="YYYY-MM-DD"
              value={startDate}
              onChangeText={setStartDate}
              helperText="Format: YYYY-MM-DD"
            />
          </View>
          <View style={{ flex: 1, marginLeft: 8 }}>
            <InputField
              label="End Date (Optional)"
              placeholder="YYYY-MM-DD"
              value={endDate}
              onChangeText={setEndDate}
              helperText="Leave empty for continuous"
            />
          </View>
        </View>

        {/* Additional Notes */}
        <InputField
          label="Doctor's Instructions & Notes"
          placeholder="e.g. Take with plenty of water, do not crush tablet"
          value={notes}
          onChangeText={setNotes}
          multiline={true}
          numberOfLines={3}
        />

        {/* Save button */}
        <Button
          title="Save Medication & Reminders"
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
  photoSection: {
    marginBottom: 20,
  },
  uploadBox: {
    borderWidth: 2,
    borderColor: '#CBD5E1',
    borderStyle: 'dashed',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  pressed: {
    opacity: 0.8,
  },
  uploadTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginTop: 8,
  },
  uploadSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
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
  helperText: {
    fontSize: 12,
    color: Colors.textSecondary,
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
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  errorText: {
    fontSize: 12,
    color: Colors.danger,
    marginTop: 4,
    fontWeight: '500',
  },
  saveBtn: {
    marginTop: 12,
  },
});
