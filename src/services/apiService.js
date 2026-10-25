import { Platform } from 'react-native';

/**
 * Backend API Service
 * Integrates React Native with our Node.js / Express backend using the Fetch API.
 * Designed with offline-first resilience: if the backend server is unreachable,
 * the mobile app continues seamlessly using local AsyncStorage.
 */

// Use 10.0.2.2 for Android emulator, localhost for iOS/web, or computer IP for physical phones
const DEFAULT_HOST = Platform.OS === 'android' ? 'http://10.0.2.2:5000' : 'http://localhost:5000';
export const API_BASE_URL = `${DEFAULT_HOST}/api`;

export const ApiService = {
  /**
   * Health check to detect if Node.js backend is active
   */
  async checkBackendHealth() {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);

      const response = await fetch(`${API_BASE_URL}/health`, {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        return { isOnline: true, data };
      }
      return { isOnline: false, error: 'Server returned error status' };
    } catch (error) {
      return { isOnline: false, error: error.message };
    }
  },

  /**
   * Sync medicines to backend
   */
  async fetchRemoteMedicines() {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      const response = await fetch(`${API_BASE_URL}/medicines`, {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!response.ok) throw new Error('Failed to fetch from backend');
      return await response.json();
    } catch (error) {
      console.log('Backend not reachable for medicines, falling back to local storage.');
      return null;
    }
  },

  /**
   * Sync newly added medicine with backend
   */
  async postMedicine(medicine) {
    try {
      const response = await fetch(`${API_BASE_URL}/medicines`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(medicine),
      });
      return await response.json();
    } catch (error) {
      console.log('Remote sync skipped (offline mode).');
      return null;
    }
  },

  /**
   * Sync updated medicine with backend
   */
  async updateMedicine(id, updatedFields) {
    try {
      const response = await fetch(`${API_BASE_URL}/medicines/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFields),
      });
      return await response.json();
    } catch (error) {
      console.log('Remote update sync skipped (offline mode).');
      return null;
    }
  },

  /**
   * Sync deleted medicine with backend
   */
  async deleteMedicine(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/medicines/${id}`, {
        method: 'DELETE',
      });
      return await response.json();
    } catch (error) {
      console.log('Remote delete sync skipped (offline mode).');
      return null;
    }
  },

  /**
   * Sync dose record log with backend
   */
  async recordDoseLog(doseLog) {
    try {
      const response = await fetch(`${API_BASE_URL}/medicines/doses/log`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(doseLog),
      });
      return await response.json();
    } catch (error) {
      console.log('Remote dose log sync skipped (offline mode).');
      return null;
    }
  },

  /**
   * Sync new diary entry with backend
   */
  async postDiaryEntry(entry) {
    try {
      const response = await fetch(`${API_BASE_URL}/diary`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry),
      });
      return await response.json();
    } catch (error) {
      console.log('Remote diary sync skipped (offline mode).');
      return null;
    }
  },

  /**
   * Sync deleted diary entry with backend
   */
  async deleteDiaryEntry(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/diary/${id}`, {
        method: 'DELETE',
      });
      return await response.json();
    } catch (error) {
      console.log('Remote diary delete sync skipped (offline mode).');
      return null;
    }
  },

  /**
   * Fetch general drug safety facts / informational lookup demo
   */
  async fetchDrugReference(drugName) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);

      // Demonstrates public medical open data via OpenFDA endpoint with fallback
      const response = await fetch(
        `https://api.fda.gov/drug/label.json?search=openfda.brand_name:"${encodeURIComponent(
          drugName
        )}"&limit=1`,
        { signal: controller.signal }
      );
      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        if (data.results && data.results.length > 0) {
          const item = data.results[0];
          return {
            source: 'OpenFDA Public Drug Database',
            purpose: item.purpose ? item.purpose[0] : null,
            warnings: item.warnings ? item.warnings[0].substring(0, 300) + '...' : null,
          };
        }
      }
      return null;
    } catch {
      return null;
    }
  },
};
