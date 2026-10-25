import React, { useRef } from 'react';
import { View, Text, StyleSheet, Animated, PanResponder, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { MedicineCard } from './MedicineCard';

/**
 * MedicineItemSwipeable
 * Implements interactive swipe gestures:
 * - Swipe Left reveals Red Delete Action
 * - Swipe Right reveals Green Mark Taken Action
 * Smooth spring animation resets the card when released.
 */
export const MedicineItemSwipeable = ({
  medicine,
  onPress,
  onDelete,
  onTakeDose,
  onSkipDose,
  status,
  showActions,
}) => {
  const pan = useRef(new Animated.ValueXY()).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 20 && Math.abs(gestureState.dy) < 15;
      },
      onPanResponderMove: (_, gestureState) => {
        // Limit maximum swipe distance
        if (gestureState.dx > -120 && gestureState.dx < 120) {
          pan.setValue({ x: gestureState.dx, y: 0 });
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx > 80 && onTakeDose) {
          // Swiped right enough -> Trigger Take
          Animated.spring(pan, { toValue: { x: 0, y: 0 }, useNativeDriver: false }).start();
          onTakeDose();
        } else if (gestureState.dx < -80 && onDelete) {
          // Swiped left enough -> Trigger Delete
          Animated.spring(pan, { toValue: { x: 0, y: 0 }, useNativeDriver: false }).start();
          onDelete();
        } else {
          // Reset position
          Animated.spring(pan, { toValue: { x: 0, y: 0 }, useNativeDriver: false }).start();
        }
      },
    })
  ).current;

  return (
    <View style={styles.container}>
      {/* Background action buttons revealed behind */}
      <View style={styles.backgroundActions}>
        <View style={[styles.bgAction, styles.bgActionLeft]}>
          <Ionicons name="checkmark-circle" size={24} color="#FFFFFF" />
          <Text style={styles.bgActionText}>Take</Text>
        </View>
        <View style={[styles.bgAction, styles.bgActionRight]}>
          <Ionicons name="trash" size={24} color="#FFFFFF" />
          <Text style={styles.bgActionText}>Delete</Text>
        </View>
      </View>

      {/* Swipeable foreground card */}
      <Animated.View
        style={{ transform: [{ translateX: pan.x }] }}
        {...panResponder.panHandlers}
      >
        <MedicineCard
          medicine={medicine}
          onPress={onPress}
          onTakeDose={onTakeDose}
          onSkipDose={onSkipDose}
          status={status}
          showActions={showActions}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    marginVertical: 4,
  },
  backgroundActions: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 16,
    overflow: 'hidden',
  },
  bgAction: {
    width: 80,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  bgActionLeft: {
    backgroundColor: Colors.success,
  },
  bgActionRight: {
    backgroundColor: Colors.danger,
    alignSelf: 'flex-end',
  },
  bgActionText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
});
