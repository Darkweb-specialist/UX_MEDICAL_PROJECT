import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from './storageKeys';
import {
  INITIAL_MEDICINES,
  INITIAL_DOSE_LOGS,
  INITIAL_DIARY_ENTRIES,
  INITIAL_USER_PROFILE,
} from '../constants/sampleData';

/**
 * Storage Service for MediCare App
 * Handles all persistent storage operations using AsyncStorage
 */
export const StorageService = {
  /**
   * Initializes local storage with sample data on first launch
   */
  async initializeDefaults() {
    try {
      const initialized = await AsyncStorage.getItem(STORAGE_KEYS.APP_INITIALIZED);
      if (!initialized) {
        await AsyncStorage.setItem(STORAGE_KEYS.MEDICINES, JSON.stringify(INITIAL_MEDICINES));
        await AsyncStorage.setItem(STORAGE_KEYS.DOSE_LOGS, JSON.stringify(INITIAL_DOSE_LOGS));
        await AsyncStorage.setItem(STORAGE_KEYS.DIARY_ENTRIES, JSON.stringify(INITIAL_DIARY_ENTRIES));
        await AsyncStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(INITIAL_USER_PROFILE));
        await AsyncStorage.setItem(STORAGE_KEYS.APP_INITIALIZED, 'true');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to initialize storage defaults:', error);
      return false;
    }
  },

  // ================= MEDICINES =================
  async getMedicines() {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.MEDICINES);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error fetching medicines:', error);
      return [];
    }
  },

  async saveMedicine(medicine) {
    try {
      const current = await this.getMedicines();
      const updated = [medicine, ...current];
      await AsyncStorage.setItem(STORAGE_KEYS.MEDICINES, JSON.stringify(updated));
      return updated;
    } catch (error) {
      console.error('Error saving medicine:', error);
      throw error;
    }
  },

  async updateMedicine(id, updatedFields) {
    try {
      const current = await this.getMedicines();
      const updated = current.map((item) =>
        item.id === id ? { ...item, ...updatedFields, updatedAt: new Date().toISOString() } : item
      );
      await AsyncStorage.setItem(STORAGE_KEYS.MEDICINES, JSON.stringify(updated));
      return updated;
    } catch (error) {
      console.error('Error updating medicine:', error);
      throw error;
    }
  },

  async deleteMedicine(id) {
    try {
      const current = await this.getMedicines();
      const updated = current.filter((item) => item.id !== id);
      await AsyncStorage.setItem(STORAGE_KEYS.MEDICINES, JSON.stringify(updated));
      return updated;
    } catch (error) {
      console.error('Error deleting medicine:', error);
      throw error;
    }
  },

  // ================= DOSE LOGS =================
  async getDoseLogs() {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.DOSE_LOGS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error fetching dose logs:', error);
      return [];
    }
  },

  async logDose(doseRecord) {
    try {
      const current = await this.getDoseLogs();
      // Remove any existing log for this medicine + time + date to allow status toggle
      const filtered = current.filter(
        (log) =>
          !(
            log.medicineId === doseRecord.medicineId &&
            log.scheduledTime === doseRecord.scheduledTime &&
            log.date === doseRecord.date
          )
      );
      const newRecord = {
        id: `log-${Date.now()}`,
        loggedAt: new Date().toISOString(),
        ...doseRecord,
      };
      const updated = [newRecord, ...filtered];
      await AsyncStorage.setItem(STORAGE_KEYS.DOSE_LOGS, JSON.stringify(updated));
      return updated;
    } catch (error) {
      console.error('Error logging dose:', error);
      throw error;
    }
  },

  // ================= DIARY ENTRIES =================
  async getDiaryEntries() {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.DIARY_ENTRIES);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error fetching diary entries:', error);
      return [];
    }
  },

  async saveDiaryEntry(entry) {
    try {
      const current = await this.getDiaryEntries();
      const newEntry = {
        id: `diary-${Date.now()}`,
        createdAt: new Date().toISOString(),
        ...entry,
      };
      const updated = [newEntry, ...current];
      await AsyncStorage.setItem(STORAGE_KEYS.DIARY_ENTRIES, JSON.stringify(updated));
      return updated;
    } catch (error) {
      console.error('Error saving diary entry:', error);
      throw error;
    }
  },

  async updateDiaryEntry(id, updatedFields) {
    try {
      const current = await this.getDiaryEntries();
      const updated = current.map((item) =>
        item.id === id ? { ...item, ...updatedFields, updatedAt: new Date().toISOString() } : item
      );
      await AsyncStorage.setItem(STORAGE_KEYS.DIARY_ENTRIES, JSON.stringify(updated));
      return updated;
    } catch (error) {
      console.error('Error updating diary entry:', error);
      throw error;
    }
  },

  async deleteDiaryEntry(id) {
    try {
      const current = await this.getDiaryEntries();
      const updated = current.filter((item) => item.id !== id);
      await AsyncStorage.setItem(STORAGE_KEYS.DIARY_ENTRIES, JSON.stringify(updated));
      return updated;
    } catch (error) {
      console.error('Error deleting diary entry:', error);
      throw error;
    }
  },

  // ================= USER PROFILE =================
  async getUserProfile() {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.USER_PROFILE);
      return data ? JSON.parse(data) : INITIAL_USER_PROFILE;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return INITIAL_USER_PROFILE;
    }
  },

  async saveUserProfile(profile) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
      return profile;
    } catch (error) {
      console.error('Error saving profile:', error);
      throw error;
    }
  },

  // ================= DATA MANAGEMENT =================
  async resetToDefaults() {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.MEDICINES, JSON.stringify(INITIAL_MEDICINES));
      await AsyncStorage.setItem(STORAGE_KEYS.DOSE_LOGS, JSON.stringify(INITIAL_DOSE_LOGS));
      await AsyncStorage.setItem(STORAGE_KEYS.DIARY_ENTRIES, JSON.stringify(INITIAL_DIARY_ENTRIES));
      await AsyncStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(INITIAL_USER_PROFILE));
      return true;
    } catch (error) {
      console.error('Error resetting data:', error);
      return false;
    }
  },

  async exportAllData() {
    try {
      const medicines = await this.getMedicines();
      const doseLogs = await this.getDoseLogs();
      const diary = await this.getDiaryEntries();
      const profile = await this.getUserProfile();
      return JSON.stringify(
        {
          appName: 'MediCare',
          exportTimestamp: new Date().toISOString(),
          profile,
          medicines,
          doseLogs,
          diary,
        },
        null,
        2
      );
    } catch (error) {
      console.error('Error exporting data:', error);
      return null;
    }
  },
};
