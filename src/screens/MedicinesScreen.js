import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  Pressable,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { useHealth } from '../context/HealthContext';
import { MedicineItemSwipeable } from '../components/medicine/MedicineItemSwipeable';
import { EmptyState } from '../components/common/EmptyState';
import { ConfirmModal } from '../components/common/ConfirmModal';

const FILTER_TAGS = ['All', 'Tablet', 'Capsule', 'Syrup', 'Supplement'];

export const MedicinesScreen = ({ navigation }) => {
  const { medicines, deleteMedicine, recordDose } = useHealth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');
  const [deletingId, setDeletingId] = useState(null);

  // Filtered and searched medicines list
  const filteredMedicines = useMemo(() => {
    return medicines.filter((med) => {
      const matchesSearch =
        med.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (med.category && med.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (med.notes && med.notes.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesTag =
        selectedTag === 'All' ||
        (med.type && med.type.toLowerCase().includes(selectedTag.toLowerCase())) ||
        (med.category && med.category.toLowerCase().includes(selectedTag.toLowerCase()));

      return matchesSearch && matchesTag;
    });
  }, [medicines, searchQuery, selectedTag]);

  const handleDeleteConfirm = async () => {
    if (deletingId) {
      await deleteMedicine(deletingId);
      setDeletingId(null);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header bar */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Medicines</Text>
          <Text style={styles.subtitle}>{medicines.length} medications registered</Text>
        </View>
        <Pressable
          style={({ pressed }) => [styles.addBtn, pressed && styles.pressed]}
          onPress={() => navigation.navigate('AddMedicine')}
        >
          <Ionicons name="add" size={20} color="#FFFFFF" />
          <Text style={styles.addBtnText}>Add</Text>
        </Pressable>
      </View>

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={18} color={Colors.textMuted} style={styles.searchIcon} />
        <TextInput
          placeholder="Search by name, category, or notes..."
          placeholderTextColor={Colors.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchInput}
          clearButtonMode="while-editing"
        />
        {searchQuery.length > 0 && (
          <Pressable onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={18} color={Colors.textMuted} />
          </Pressable>
        )}
      </View>

      {/* Filter Chips */}
      <View style={styles.tagsContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={FILTER_TAGS}
          keyExtractor={(item) => item}
          contentContainerStyle={styles.tagsContent}
          renderItem={({ item }) => {
            const isSelected = selectedTag === item;
            return (
              <Pressable
                onPress={() => setSelectedTag(item)}
                style={[styles.tagPill, isSelected && styles.tagPillSelected]}
              >
                <Text style={[styles.tagText, isSelected && styles.tagTextSelected]}>
                  {item}
                </Text>
              </Pressable>
            );
          }}
        />
      </View>

      {/* Swipe tip banner */}
      <View style={styles.swipeHint}>
        <Ionicons name="swap-horizontal" size={14} color={Colors.textSecondary} />
        <Text style={styles.swipeHintText}>
          Tip: Swipe card right to take, left to delete
        </Text>
      </View>

      {/* List */}
      <FlatList
        data={filteredMedicines}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <MedicineItemSwipeable
            medicine={item}
            onPress={() => navigation.navigate('MedicineDetails', { medicineId: item.id })}
            onDelete={() => setDeletingId(item.id)}
            onTakeDose={() =>
              recordDose({
                medicineId: item.id,
                medicineName: item.name,
                scheduledTime: item.times?.[0] || '12:00',
                status: 'taken',
              })
            }
          />
        )}
        ListEmptyComponent={
          <EmptyState
            icon="search-outline"
            title="No medicines found"
            description={
              searchQuery
                ? `No results matching "${searchQuery}". Try a different keyword.`
                : 'Your medicine cabinet is empty. Tap Add to record a new medication.'
            }
            actionTitle={searchQuery ? 'Clear Search' : '+ Add Medicine'}
            onAction={() => {
              if (searchQuery) setSearchQuery('');
              else navigation.navigate('AddMedicine');
            }}
          />
        }
      />

      {/* Deletion confirmation modal */}
      <ConfirmModal
        visible={!!deletingId}
        title="Delete Medication?"
        message="Are you sure you want to delete this medicine? Its scheduled reminders will also be cancelled."
        confirmText="Yes, Delete"
        cancelText="Cancel"
        isDestructive={true}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingId(null)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    gap: 4,
  },
  addBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  pressed: {
    opacity: 0.8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: Colors.textPrimary,
  },
  tagsContainer: {
    marginVertical: 10,
  },
  tagsContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  tagPill: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tagPillSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  tagText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  tagTextSelected: {
    color: '#FFFFFF',
  },
  swipeHint: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 6,
    gap: 6,
  },
  swipeHintText: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 30,
  },
});
