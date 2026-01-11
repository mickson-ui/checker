import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Briefcase, Globe } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { Colors } from '../theme/colors';

interface HeaderProps {
  rightActions?: React.ReactNode;
}

export const Header = ({ rightActions }: HeaderProps) => {
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const nextLng = i18n.language === 'en' ? 'cs' : 'en';
    i18n.changeLanguage(nextLng);
  };

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <LinearGradient
          colors={['rgba(20, 255, 236, 0.2)', 'rgba(0, 229, 255, 0.1)']}
          style={styles.iconContainer}
        >
          <Briefcase size={24} color={Colors.primary} />
        </LinearGradient>
        <Text style={styles.title}>{t('workHours')}</Text>
      </View>

      <View style={styles.right}>
        <TouchableOpacity onPress={toggleLanguage} style={styles.langToggle}>
          <Globe size={18} color={Colors.primary} />
          <Text style={styles.langText}>{i18n.language.toUpperCase()}</Text>
        </TouchableOpacity>
        {rightActions}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    padding: 10,
    borderRadius: 12,
    marginRight: 12,
  },
  title: {
    color: Colors.white,
    fontSize: 22,
    fontWeight: 'bold',
  },
  langToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  langText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 6,
  },
});
