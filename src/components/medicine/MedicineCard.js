import React from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { StatusBadge } from '../common/StatusBadge';

export const MedicineCard = ({
  medicine,
  onPress,
  onTakeDose,
  onSkipDose,
  showActions = false,
  status = null,
}) => {
  const getIconForType = (type) => {
    const t = (type || '').toLowerCase();
    if (t.includes('capsule')) return 'medical';
    if (t.includes('syrup') || t.includes('liquid')) return 'flask';
    if (t.includes('injection')) return 'fitness';
    return 'bandage';
  };

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.topRow}>
        <View style={styles.iconAndInfo}>
          {medicine.imageUri ? (
            <Image source={{ uri: medicine.imageUri }} style={styles.thumbnail} />
          ) : (
            <View style={styles.iconCircle}>
              <Ionicons name={getIconForType(medicine.type)} size={22} color={Colors.primary} />
            </View>
          )}

          <View style={styles.infoCol}>
            <View style={styles.nameRow}>
              <Text style={styles.name} numberOfLines={1}>
                {medicine.name}
              </Text>
            </View>
            <Text style={styles.dosage}>
              {medicine.dosage} • {medicine.instructions || 'Daily'}
            </Text>
          </View>
        </View>

        {status && <StatusBadge status={status} />}
      </View>

      <View style={styles.footerRow}>
        <View style={styles.timesList}>
          <Ionicons name="alarm-outline" size={14} color={Colors.textSecondary} />
          <Text style={styles.timeText}>
            {Array.isArray(medicine.times) ? medicine.times.join(', ') : medicine.time || 'No time set'}
          </Text>
        </View>

        {medicine.category && (
          <View style={styles.categoryPill}>
            <Text style={styles.categoryText}>{medicine.category}</Text>
          </View>
        )}
      </View>

      {showActions && status === 'pending' && (
        <View style={styles.actionsBar}>
          <Pressable
            onPress={onSkipDose}
            style={({ pressed }) => [styles.actionButton, styles.skipBtn, pressed && styles.pressed]}
          >
            <Ionicons name="close" size={16} color={Colors.danger} />
            <Text style={styles.skipBtnText}>Skip</Text>
          </Pressable>
          <Pressable
            onPress={onTakeDose}
            style={({ pressed }) => [styles.actionButton, styles.takeBtn, pressed && styles.pressed]}
          >
            <Ionicons name="checkmark" size={16} color="#FFFFFF" />
            <Text style={styles.takeBtnText}>Take Dose</Text>
          </Pressable>
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  pressed: {
    opacity: 0.94,
    transform: [{ scale: 0.995 }],
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconAndInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  thumbnail: {
    width: 44,
    height: 44,
    borderRadius: 10,
    marginRight: 12,
    backgroundColor: Colors.border,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  infoCol: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  dosage: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  timesList: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  categoryPill: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 6,
    backgroundColor: '#F1F5F9',
  },
  categoryText: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  actionsBar: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  skipBtn: {
    backgroundColor: Colors.dangerLight,
  },
  skipBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.danger,
  },
  takeBtn: {
    backgroundColor: Colors.primary,
  },
  takeBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
