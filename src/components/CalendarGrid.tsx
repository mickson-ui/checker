import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import { DayCell } from './DayCell';
import { MonthData } from '../models/WorkData';
import { Colors } from '../theme/colors';

interface CalendarGridProps {
  year: number;
  month: number;
  monthData: MonthData;
  onDayTap: (day: number) => void;
}

export const CalendarGrid = ({ year, month, monthData, onDayTap }: CalendarGridProps) => {
  const { t } = useTranslation();

  const daysInMonth = new Date(year, month, 0).getDate();
  const firstDayOfMonth = new Date(year, month - 1, 1);
  const firstWeekday = (firstDayOfMonth.getDay() + 6) % 7; // Monday = 0

  const today = new Date();
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() + 1 === month;
  const dayLabels = [t('mon'), t('tue'), t('wed'), t('thu'), t('fri'), t('sat'), t('sun')];

  const data = [
    ...Array(firstWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const weeks = [];
  for (let i = 0; i < data.length; i += 7) {
    weeks.push(data.slice(i, i + 7));
  }

  const renderCell = (item: number | null, index: number) => {
    if (item === null) return <View key={`empty-${index}`} style={styles.emptyCell} />;

    const day = item;
    const date = new Date(year, month - 1, day);
    const weekday = date.getDay();
    const isWeekend = weekday === 0 || weekday === 6;
    const isToday = isCurrentMonth && today.getDate() === day;
    const hours = monthData[day]?.hours || 0;

    const formatDuration = (decimalHours: number) => {
      if (decimalHours === 0) return '0';
      const totalMinutes = Math.round(decimalHours * 60);
      const h = Math.floor(totalMinutes / 60);
      const m = totalMinutes % 60;
      if (m === 0) return h.toString();
      return `${h}:${m.toString().padStart(2, '0')}`;
    };

    const hasNotes = !!monthData[day]?.notes;

    return (
      <View key={`day-${day}`} style={styles.cellContainer}>
        <DayCell
          day={day}
          hours={hours}
          formattedHours={formatDuration(hours)}
          hasNotes={hasNotes}
          isWeekend={isWeekend}
          isToday={isToday}
          onTap={() => onDayTap(day)}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.labelsRow}>
        {dayLabels.map((label, i) => (
          <View key={i} style={styles.labelCell}>
            <Text style={[styles.labelText, i >= 5 && styles.weekendLabel]}>
              {label}
            </Text>
          </View>
        ))}
      </View>
      
      <View style={styles.grid}>
        {weeks.map((week, weekIndex) => (
          <View key={weekIndex} style={styles.weekRow}>
            {week.map((day, dayIndex) => renderCell(day, dayIndex))}
          </View>
        ))}
      </View>
    </View>
  );
};

const { width } = Dimensions.get('window');
const cellWidth = (width - 16) / 7;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 0,
  },
  labelsRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  labelCell: {
    flex: 1,
    alignItems: 'center',
  },
  labelText: {
    color: Colors.textDim,
    fontSize: 13,
    fontWeight: '600',
  },
  weekendLabel: {
    color: 'rgba(255, 255, 255, 0.4)',
  },
  grid: {
    paddingHorizontal: 8,
    paddingBottom: 16,
  },
  weekRow: {
    flexDirection: 'row',
  },
  cellContainer: {
    width: cellWidth,
    padding: 2,
  },
  emptyCell: {
    width: cellWidth,
    height: 60,
    padding: 2,
  },
});
