import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { StorageService } from '../storage/storageService';
import { NotificationService } from '../services/notificationService';
import { ApiService } from '../services/apiService';

const HealthContext = createContext(null);

export const HealthProvider = ({ children }) => {
  const [medicines, setMedicines] = useState([]);
  const [doseLogs, setDoseLogs] = useState([]);
  const [diaryEntries, setDiaryEntries] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [backendStatus, setBackendStatus] = useState({ isOnline: false, checked: false });

  // Initial load
  const loadAppData = useCallback(async () => {
    setIsLoading(true);
    try {
      await StorageService.initializeDefaults();
      const [storedMedicines, storedLogs, storedDiary, storedProfile] = await Promise.all([
        StorageService.getMedicines(),
        StorageService.getDoseLogs(),
        StorageService.getDiaryEntries(),
        StorageService.getUserProfile(),
      ]);

      setMedicines(storedMedicines);
      setDoseLogs(storedLogs);
      setDiaryEntries(storedDiary);
      setUserProfile(storedProfile);

      // Check backend availability asynchronously without blocking UI
      ApiService.checkBackendHealth().then((status) => {
        setBackendStatus({ isOnline: status.isOnline, checked: true });
      });
    } catch (error) {
      console.error('Failed to load initial app data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAppData();
  }, [loadAppData]);

  // ================= MEDICINES =================
  const addMedicine = async (medicineData) => {
    const newMedicine = {
      id: `med-${Date.now()}`,
      createdAt: new Date().toISOString(),
      ...medicineData,
    };

    // Save locally
    const updated = await StorageService.saveMedicine(newMedicine);
    setMedicines(updated);

    // Schedule local notification reminders
    if (userProfile?.notificationsEnabled !== false) {
      await NotificationService.scheduleMedicineReminders(newMedicine);
    }

    // Attempt remote sync if backend is active
    ApiService.postMedicine(newMedicine).catch(() => {});

    return newMedicine;
  };

  const updateMedicine = async (id, updatedFields) => {
    const updated = await StorageService.updateMedicine(id, updatedFields);
    setMedicines(updated);

    // Re-schedule notification
    const changedMedicine = updated.find((m) => m.id === id);
    if (changedMedicine && userProfile?.notificationsEnabled !== false) {
      await NotificationService.scheduleMedicineReminders(changedMedicine);
    }

    // Sync with backend
    ApiService.updateMedicine(id, updatedFields).catch(() => {});
    return updated;
  };

  const deleteMedicine = async (id) => {
    const updated = await StorageService.deleteMedicine(id);
    setMedicines(updated);
    ApiService.deleteMedicine(id).catch(() => {});
    return updated;
  };

  // ================= DOSE RECORDING =================
  const recordDose = async ({ medicineId, medicineName, scheduledTime, status }) => {
    const today = new Date().toISOString().split('T')[0];
    const logPayload = {
      medicineId,
      medicineName,
      scheduledTime,
      date: today,
      status, // 'taken' or 'skipped'
    };
    const updatedLogs = await StorageService.logDose(logPayload);
    setDoseLogs(updatedLogs);

    // Sync with backend
    ApiService.recordDoseLog(logPayload).catch(() => {});
    return updatedLogs;
  };

  // ================= DIARY =================
  const addDiaryEntry = async (entryData) => {
    const updated = await StorageService.saveDiaryEntry(entryData);
    setDiaryEntries(updated);

    // Find saved entry or pass entryData with id to sync with backend
    const savedEntry = updated[0] || entryData;
    ApiService.postDiaryEntry(savedEntry).catch(() => {});
    return updated;
  };

  const updateDiaryEntry = async (id, updatedFields) => {
    const updated = await StorageService.updateDiaryEntry(id, updatedFields);
    setDiaryEntries(updated);
    return updated;
  };

  const deleteDiaryEntry = async (id) => {
    const updated = await StorageService.deleteDiaryEntry(id);
    setDiaryEntries(updated);
    ApiService.deleteDiaryEntry(id).catch(() => {});
    return updated;
  };

  // ================= PROFILE & SETTINGS =================
  const updateProfile = async (newProfile) => {
    const updated = await StorageService.saveUserProfile(newProfile);
    setUserProfile(updated);
    return updated;
  };

  const resetAllData = async () => {
    await NotificationService.cancelAllNotifications();
    await StorageService.resetToDefaults();
    await loadAppData();
  };

  return (
    <HealthContext.Provider
      value={{
        medicines,
        doseLogs,
        diaryEntries,
        userProfile,
        isLoading,
        backendStatus,
        addMedicine,
        updateMedicine,
        deleteMedicine,
        recordDose,
        addDiaryEntry,
        updateDiaryEntry,
        deleteDiaryEntry,
        updateProfile,
        resetAllData,
        refreshData: loadAppData,
      }}
    >
      {children}
    </HealthContext.Provider>
  );
};

export const useHealth = () => {
  const context = useContext(HealthContext);
  if (!context) {
    throw new Error('useHealth must be used within a HealthProvider');
  }
  return context;
};
