import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Colors } from '../theme/colors';

interface DayCellProps {
  day: number;
  hours: number;
  formattedHours: string;
  hasNotes?: boolean;
  isWeekend: boolean;
  isToday: boolean;
  onTap: () => void;
}

export const DayCell = ({ day, hours, formattedHours, hasNotes, isWeekend, isToday, onTap }: DayCellProps) => {
  const hasHours = hours > 0;

  return (
    <TouchableOpacity
      onPress={onTap}
      activeOpacity={0.7}
      style={[
        styles.container,
        isToday && styles.todayContainer,
        hasHours && styles.hasHoursContainer,
      ]}
    >
      <Text
        style={[
          styles.dayText,
          isWeekend && !hasHours && styles.weekendText,
          isToday && styles.todayText,
          hasHours && styles.hasHoursText,
        ]}
      >
        {day}
      </Text>
      
      {hasHours && (
        <View style={styles.hoursBadge}>
          <Text style={styles.hoursText}>
            {formattedHours}
          </Text>
        </View>
      )}

      {hasNotes && !hasHours && (
        <View style={styles.noteIndicator} />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 60,
    margin: 4,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  todayContainer: {
    borderColor: Colors.primary,
    backgroundColor: 'rgba(20, 255, 236, 0.1)',
  },
  hasHoursContainer: {
    backgroundColor: Colors.primary,
  },
  dayText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  weekendText: {
    color: Colors.textDim,
  },
  todayText: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
  hasHoursText: {
    color: Colors.black,
    fontWeight: 'bold',
  },
  hoursBadge: {
    position: 'absolute',
    bottom: 6,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
  },
  hoursText: {
    color: Colors.black,
    fontSize: 10,
    fontWeight: 'bold',
  },
  noteIndicator: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.accent,
  },
});
