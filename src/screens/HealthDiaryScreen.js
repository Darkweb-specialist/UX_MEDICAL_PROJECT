import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  SafeAreaView,
  StatusBar,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { useHealth } from '../context/HealthContext';
import { DiaryCard } from '../components/diary/DiaryCard';
import { EmptyState } from '../components/common/EmptyState';
import { ConfirmModal } from '../components/common/ConfirmModal';

export const HealthDiaryScreen = ({ navigation }) => {
  const { diaryEntries, deleteDiaryEntry } = useHealth();
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  // Filtered and chronological entries
  const filteredEntries = useMemo(() => {
    return diaryEntries
      .filter((entry) => {
        const query = searchQuery.toLowerCase();
        return (
          (entry.notes && entry.notes.toLowerCase().includes(query)) ||
          (entry.symptoms && entry.symptoms.toLowerCase().includes(query)) ||
          (entry.date && entry.date.includes(query))
        );
      })
      .sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  }, [diaryEntries, searchQuery]);

  const handleDeleteConfirm = async () => {
    if (deletingId) {
      await deleteDiaryEntry(deletingId);
      setDeletingId(null);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Health Diary</Text>
          <Text style={styles.subtitle}>Personal wellness logs & observations</Text>
        </View>
        <Pressable
          style={({ pressed }) => [styles.addBtn, pressed && styles.pressed]}
          onPress={() => navigation.navigate('AddDiaryEntry')}
        >
          <Ionicons name="add" size={20} color="#FFFFFF" />
          <Text style={styles.addBtnText}>New Note</Text>
        </Pressable>
      </View>

      {/* Medical disclaimer note banner */}
      <View style={styles.disclaimerBanner}>
        <Ionicons name="information-circle-outline" size={16} color={Colors.secondary} />
        <Text style={styles.disclaimerText}>
          Personal diary only. Not intended for diagnosis or emergency treatment.
        </Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={18} color={Colors.textMuted} style={styles.searchIcon} />
        <TextInput
          placeholder="Search symptoms, notes, or dates..."
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

      {/* Diary Entries List */}
      <FlatList
        data={filteredEntries}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <DiaryCard
            entry={item}
            onEdit={() => navigation.navigate('AddDiaryEntry', { editEntry: item })}
            onDelete={() => setDeletingId(item.id)}
          />
        )}
        ListEmptyComponent={
          <EmptyState
            icon="journal-outline"
            title="No diary entries yet"
            description="Log your daily health observations, symptoms, or body temperature."
            actionTitle="+ New Diary Entry"
            onAction={() => navigation.navigate('AddDiaryEntry')}
          />
        }
      />

      {/* Confirmation Modal */}
      <ConfirmModal
        visible={!!deletingId}
        title="Delete Diary Entry?"
        message="Are you sure you want to remove this log? This action cannot be reversed."
        confirmText="Delete"
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
    backgroundColor: Colors.secondary,
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
  disclaimerBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.secondaryLight,
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  disclaimerText: {
    fontSize: 11,
    color: '#075985',
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 8,
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
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 30,
  },
});
