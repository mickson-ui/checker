import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { Clock, Wallet, Share2 } from 'lucide-react-native';
import { Colors } from '../theme/colors';
import { TouchableOpacity } from 'react-native';

interface SummaryCardProps {
  totalHours: number;
  formattedHours: string;
  salary: number;
  monthName: string;
  onExport?: () => void;
}

export const SummaryCard = ({ totalHours, formattedHours, salary, monthName, onExport }: SummaryCardProps) => {
  const { t } = useTranslation();

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString() + t('currencySuffix');
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.surfaceAlt, Colors.surface]}
        style={styles.card}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.title}>{t('summary')} - {monthName}</Text>
          {onExport && (
            <TouchableOpacity onPress={onExport} style={styles.exportButton}>
              <Share2 size={18} color={Colors.primary} />
            </TouchableOpacity>
          )}
        </View>
        
        <View style={styles.row}>
          <SummaryItem
            icon={<Clock size={20} color={Colors.primary} />}
            label={t('workedHours')}
            value={`${formattedHours} ${t('hoursShort')}`}
          />
          <View style={styles.divider} />
          <SummaryItem
            icon={<Wallet size={20} color={Colors.success} />}
            label={t('salary')}
            value={formatCurrency(salary)}
          />
        </View>
      </LinearGradient>
    </View>
  );
};

const SummaryItem = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) => (
  <View style={styles.item}>
    <View style={styles.itemHeader}>
      {icon}
      <Text style={styles.itemLabel}>{label}</Text>
    </View>
    <Text style={styles.itemValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  card: {
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    color: Colors.textDim,
    fontSize: 14,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  exportButton: {
    backgroundColor: 'rgba(20, 255, 236, 0.1)',
    padding: 8,
    borderRadius: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  item: {
    flex: 1,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemLabel: {
    color: Colors.textDim,
    fontSize: 12,
    marginLeft: 8,
  },
  itemValue: {
    color: Colors.white,
    fontSize: 20,
    fontWeight: 'bold',
  },
  divider: {
    width: 1,
    height: '60%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 16,
  },
});
