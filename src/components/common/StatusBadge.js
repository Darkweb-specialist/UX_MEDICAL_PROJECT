import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';

export const StatusBadge = ({ status, label }) => {
  const normalized = (status || '').toLowerCase();

  const getBadgeConfig = () => {
    switch (normalized) {
      case 'taken':
        return {
          bg: Colors.successLight,
          textColor: '#065F46',
          icon: 'checkmark-circle',
          text: label || 'Taken',
        };
      case 'skipped':
        return {
          bg: Colors.dangerLight,
          textColor: '#991B1B',
          icon: 'close-circle',
          text: label || 'Skipped',
        };
      case 'pending':
        return {
          bg: Colors.warningLight,
          textColor: '#92400E',
          icon: 'time',
          text: label || 'Pending',
        };
      case 'active':
        return {
          bg: Colors.primaryLight,
          textColor: Colors.primaryDark,
          icon: 'pulse',
          text: label || 'Active',
        };
      default:
        return {
          bg: '#E2E8F0',
          textColor: Colors.textSecondary,
          icon: 'information-circle',
          text: label || normalized,
        };
    }
  };

  const config = getBadgeConfig();

  return (
    <View style={[styles.badge, { backgroundColor: config.bg }]}>
      <Ionicons name={config.icon} size={13} color={config.textColor} style={styles.icon} />
      <Text style={[styles.text, { color: config.textColor }]}>{config.text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  icon: {
    marginRight: 4,
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
});
