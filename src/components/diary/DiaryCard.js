import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';

export const DiaryCard = ({ entry, onEdit, onDelete }) => {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.dateBlock}>
          <Ionicons name="calendar-outline" size={16} color={Colors.primary} />
          <Text style={styles.dateText}>{entry.date}</Text>
          {entry.time && <Text style={styles.timeText}>• {entry.time}</Text>}
        </View>

        <View style={styles.headerActions}>
          {onEdit && (
            <Pressable
              onPress={onEdit}
              style={({ pressed }) => [styles.iconBtn, pressed && styles.pressed]}
              accessibilityRole="button"
              accessibilityLabel="Edit diary entry"
            >
              <Ionicons name="create-outline" size={18} color={Colors.textSecondary} />
            </Pressable>
          )}
          {onDelete && (
            <Pressable
              onPress={onDelete}
              style={({ pressed }) => [styles.iconBtn, pressed && styles.pressed]}
              accessibilityRole="button"
              accessibilityLabel="Delete diary entry"
            >
              <Ionicons name="trash-outline" size={18} color={Colors.danger} />
            </Pressable>
          )}
        </View>
      </View>

      {/* Vitals row */}
      {(entry.temperature || entry.bloodPressure || entry.pulse) && (
        <View style={styles.vitalsRow}>
          {entry.temperature ? (
            <View style={styles.vitalItem}>
              <Ionicons name="thermometer-outline" size={14} color="#EA580C" />
              <Text style={styles.vitalText}>{entry.temperature}</Text>
            </View>
          ) : null}
          {entry.bloodPressure ? (
            <View style={styles.vitalItem}>
              <Ionicons name="heart-outline" size={14} color={Colors.danger} />
              <Text style={styles.vitalText}>{entry.bloodPressure}</Text>
            </View>
          ) : null}
          {entry.pulse ? (
            <View style={styles.vitalItem}>
              <Ionicons name="pulse" size={14} color={Colors.primary} />
              <Text style={styles.vitalText}>{entry.pulse}</Text>
            </View>
          ) : null}
        </View>
      )}

      {/* Symptoms */}
      {entry.symptoms ? (
        <View style={styles.symptomsBox}>
          <Text style={styles.sectionLabel}>Observations & Symptoms:</Text>
          <Text style={styles.symptomsText}>{entry.symptoms}</Text>
        </View>
      ) : null}

      {/* Notes */}
      {entry.notes ? (
        <Text style={styles.notesText}>{entry.notes}</Text>
      ) : null}

      {/* Location tag (if captured) */}
      {entry.location ? (
        <View style={styles.locationFooter}>
          <Ionicons name="location-outline" size={13} color={Colors.textMuted} />
          <Text style={styles.locationText}>{entry.location}</Text>
        </View>
      ) : null}
    </View>
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  dateBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dateText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  timeText: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 6,
  },
  iconBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
  },
  pressed: {
    opacity: 0.7,
  },
  vitalsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    marginBottom: 10,
  },
  vitalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  vitalText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  symptomsBox: {
    marginBottom: 8,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  symptomsText: {
    fontSize: 14,
    color: Colors.textPrimary,
    lineHeight: 19,
  },
  notesText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginTop: 4,
  },
  locationFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  locationText: {
    fontSize: 11,
    color: Colors.textMuted,
  },
});
