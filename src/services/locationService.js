import * as Location from 'expo-location';

/**
 * Location Service (Optional Demonstration Feature)
 * Demonstrates device hardware integration by capturing approximate
 * location name for health diary notes.
 */
export const LocationService = {
  async getApproximateLocationName() {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        return null;
      }

      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      if (!position || !position.coords) return null;

      const [address] = await Location.reverseGeocodeAsync({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });

      if (address) {
        const parts = [address.city || address.subregion, address.region, address.country].filter(Boolean);
        return parts.join(', ');
      }

      return `${position.coords.latitude.toFixed(2)}, ${position.coords.longitude.toFixed(2)}`;
    } catch (error) {
      console.warn('Location retrieval skipped/unavailable:', error?.message);
      return null;
    }
  },
};
