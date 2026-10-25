import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { Button } from '../components/common/Button';

export const OnboardingScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.container}>
        {/* Top Illustration Box */}
        <View style={styles.illustrationCircle}>
          <Ionicons name="medical" size={64} color={Colors.primary} />
        </View>

        <Text style={styles.appTitle}>MediCare</Text>
        <Text style={styles.appSubtitle}>Medicine Reminder & Health Diary</Text>

        {/* Feature Highlights */}
        <View style={styles.featuresList}>
          <View style={styles.featureItem}>
            <View style={styles.iconBox}>
              <Ionicons name="alarm" size={20} color={Colors.primary} />
            </View>
            <View style={styles.featureTextCol}>
              <Text style={styles.featureHeading}>Timely Reminders</Text>
              <Text style={styles.featureDescription}>
                Never miss a dose with custom schedule alarms and push notifications.
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <View style={styles.iconBox}>
              <Ionicons name="camera" size={20} color={Colors.primary} />
            </View>
            <View style={styles.featureTextCol}>
              <Text style={styles.featureHeading}>Medicine Visuals</Text>
              <Text style={styles.featureDescription}>
                Capture photos of your medicine strips to easily identify each dose.
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <View style={styles.iconBox}>
              <Ionicons name="journal" size={20} color={Colors.secondary} />
            </View>
            <View style={styles.featureTextCol}>
              <Text style={styles.featureHeading}>Health Diary & Vitals</Text>
              <Text style={styles.featureDescription}>
                Keep track of symptoms, temperature, and weekly adherence trends.
              </Text>
            </View>
          </View>
        </View>

        {/* CTA Button */}
        <View style={styles.footer}>
          <Button
            title="Get Started"
            size="large"
            icon="arrow-forward"
            onPress={() => navigation.replace('MainTabs')}
          />
          <Text style={styles.footerNotice}>
            Demo App for BTech CSE Project Evaluation • Fictional Samples Included
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  illustrationCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginTop: 16,
    letterSpacing: -0.5,
  },
  appSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  featuresList: {
    width: '100%',
    marginVertical: 24,
    gap: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    padding: 14,
    borderRadius: 14,
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  featureTextCol: {
    flex: 1,
  },
  featureHeading: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  featureDescription: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
    lineHeight: 16,
  },
  footer: {
    width: '100%',
    marginBottom: 20,
  },
  footerNotice: {
    fontSize: 11,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: 12,
  },
});
