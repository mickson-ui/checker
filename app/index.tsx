import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  Alert,
  Dimensions,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useTranslation } from 'react-i18next';
import { 
  ChevronLeft, 
  ChevronRight, 
  DollarSign, 
  Clock, 
  Plus, 
  Building2, 
  Coffee, 
  FileText, 
  Share2, 
  TrendingUp, 
  X,
  Lock,
  Unlock
} from 'lucide-react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { BarChart } from 'react-native-chart-kit';
import { useWorkData } from '../src/hooks/useWorkData';
import { Header } from '../src/components/Header';
import { SummaryCard } from '../src/components/SummaryCard';
import { CalendarGrid } from '../src/components/CalendarGrid';
import { Colors } from '../src/theme/colors';
import { ReportService } from '../src/services/report';
import { useSecurity } from '../src/hooks/useSecurity';
import '../src/services/i18n';

export default function HomeScreen() {
  const { t } = useTranslation();
  const { 
    workData, 
    isLoading, 
    updateHourlyRate, 
    setEntry, 
    addCompany, 
    switchCompany,
    renameCompany,
    deleteCompany
  } = useWorkData();

  const {
    isProtected,
    isAuthenticated,
    isLoading: securityLoading,
    authenticate,
    toggleProtection
  } = useSecurity();
  
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  
  // Entry Modal States
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [inputHours, setInputHours] = useState('');
  const [startTime, setStartTime] = useState<string | null>(null);
  const [endTime, setEndTime] = useState<string | null>(null);
  const [breakMinutes, setBreakMinutes] = useState('0');
  const [notes, setNotes] = useState('');
  const [showPicker, setShowPicker] = useState<'start' | 'end' | null>(null);

  // Stats Modal State
  const [isStatsVisible, setIsStatsVisible] = useState(false);

  const formatDuration = (decimalHours: number) => {
    if (decimalHours === 0) return '0';
    const totalMinutes = Math.round(decimalHours * 60);
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    if (m === 0) return h.toString();
    return `${h}:${m.toString().padStart(2, '0')}`;
  };

  const parseDurationToDecimal = (durationStr: string): number => {
    if (!durationStr.includes(':')) {
      return parseFloat(durationStr) || 0;
    }
    const [h, m] = durationStr.split(':').map(Number);
    return (h || 0) + (m || 0) / 60;
  };

  const navigateMonth = (direction: number) => {
    let newMonth = currentMonth + direction;
    let newYear = currentYear;
    if (newMonth > 12) {
      newMonth = 1;
      newYear++;
    } else if (newMonth < 1) {
      newMonth = 12;
      newYear--;
    }
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
  };

  const openHoursDialog = (day: number) => {
    const entry = workData.getEntry(currentYear, currentMonth, day);
    setSelectedDay(day);
    setInputHours(entry.hours > 0 ? formatDuration(entry.hours) : '');
    setStartTime(entry.startTime || null);
    setEndTime(entry.endTime || null);
    setBreakMinutes(entry.breakMinutes?.toString() || '0');
    setNotes(entry.notes || '');
    setIsModalVisible(true);
  };

  const calculateHours = (startStr: string | null, endStr: string | null, brkStr: string = '0') => {
    if (!startStr || !endStr) return;
    const [startH, startM] = startStr.split(':').map(Number);
    const [endH, endM] = endStr.split(':').map(Number);
    const brk = parseInt(brkStr) || 0;

    let startTotal = startH * 60 + startM;
    let endTotal = endH * 60 + endM;
    if (endTotal < startTotal) endTotal += 24 * 60;

    const diffMinutes = Math.max(0, endTotal - startTotal - brk);
    const h = Math.floor(diffMinutes / 60);
    const m = diffMinutes % 60;
    setInputHours(`${h}:${m.toString().padStart(2, '0')}`);
  };

  const handleSave = () => {
    if (selectedDay !== null) {
      const hours = parseDurationToDecimal(inputHours);
      setEntry(
        currentYear, 
        currentMonth, 
        selectedDay, 
        hours, 
        startTime || undefined, 
        endTime || undefined,
        parseInt(breakMinutes) || 0,
        notes || undefined
      );
    }
    setIsModalVisible(false);
  };

  const handleClear = () => {
    if (selectedDay !== null) setEntry(currentYear, currentMonth, selectedDay, 0);
    setIsModalVisible(false);
  };

  const onQuickSelect = (h: number) => {
    setInputHours(`${h}:00`);
    setStartTime(null);
    setEndTime(null);
    setBreakMinutes('0');
  };

  const onTimeChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    const type = showPicker;
    setShowPicker(null);
    if (selectedDate && type) {
      const h = selectedDate.getHours().toString().padStart(2, '0');
      const m = selectedDate.getMinutes().toString().padStart(2, '0');
      const timeStr = `${h}:${m}`;
      if (type === 'start') {
        setStartTime(timeStr);
        calculateHours(timeStr, endTime, breakMinutes);
      } else {
        setEndTime(timeStr);
        calculateHours(startTime, timeStr, breakMinutes);
      }
    }
  };

  const getTimeForPicker = (timeStr: string | null) => {
    const date = new Date();
    if (timeStr) {
      const [h, m] = timeStr.split(':').map(Number);
      date.setHours(h, m, 0, 0);
    } else {
      date.setHours(8, 0, 0, 0);
    }
    return date;
  };

  const handleExport = async () => {
    try {
      await ReportService.generateMonthlyPDF(activeCompany, currentYear, currentMonth, totalHours, salary);
    } catch (e) {
      Alert.alert(t('error'), t('failedToExport'));
    }
  };

  const handleAddCompany = () => {
    if (Platform.OS === 'ios') {
      Alert.prompt(t('addCompany'), t('enterCompanyName'), [
        { text: t('cancel'), style: 'cancel' },
        { text: t('add'), onPress: (name?: string) => name && addCompany(name) },
      ]);
    } else {
      const name = prompt(t('enterCompanyName'));
      if (name) addCompany(name);
    }
  };

  const handleCompanyOptions = (id: string, currentName: string) => {
    Alert.alert(currentName, t('chooseOption'), [
      { text: t('rename'), onPress: () => handleRename(id, currentName) },
      { text: t('delete'), onPress: () => confirmDelete(id, currentName), style: 'destructive' },
      { text: t('cancel'), style: 'cancel' },
    ]);
  };

  const confirmDelete = (id: string, name: string) => {
    if (workData.companies.length <= 1) {
      Alert.alert(t('error'), t('cannotDeleteLastCompany'));
      return;
    }
    Alert.alert(t('deleteCompany'), `${t('confirmDeleteCompany')} "${name}"?`, [
      { text: t('cancel'), style: 'cancel' },
      { text: t('delete'), style: 'destructive', onPress: () => deleteCompany(id) },
    ]);
  };

  const handleRename = (id: string, currentName: string) => {
    if (Platform.OS === 'ios') {
      Alert.prompt(t('renameCompany'), '', [
        { text: t('cancel'), style: 'cancel' },
        { text: t('save'), onPress: (newName?: string) => newName && renameCompany(id, newName) },
      ], 'plain-text', currentName);
    } else {
      const newName = prompt(t('renameCompany'), currentName);
      if (newName) renameCompany(id, newName);
    }
  };

  const getMonthName = (m: number) => {
    const names = [
      t('january'), t('february'), t('march'), t('april'), t('may'), t('june'),
      t('july'), t('august'), t('september'), t('october'), t('november'), t('december')
    ];
    return names[m - 1];
  };

  if (isLoading) return null;

  const activeCompany = workData.activeCompany;
  const monthKey = `${currentYear}-${currentMonth.toString().padStart(2, '0')}`;
  const monthData = activeCompany.workData[monthKey] || {};
  const totalHours = workData.getTotalHours(currentYear, currentMonth);
  const salary = workData.getSalary(currentYear, currentMonth);
  const monthName = getMonthName(currentMonth);

  const history = workData.getRecentHistory(6);
  const chartData = {
    labels: history.map(h => h.label),
    datasets: [{ data: history.map(h => h.salary) }]
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <StatusBar style="light" />
        <View style={styles.safeArea}>
          <Header
            rightActions={
              <View style={styles.headerActions}>
                <TouchableOpacity onPress={toggleProtection} style={styles.headerIconBtn}>
                  {isProtected ? (
                    <Lock size={20} color={Colors.primary} />
                  ) : (
                    <Unlock size={20} color={Colors.textDim} />
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setIsStatsVisible(true)}
                  style={styles.headerIconBtn}
                >
                  <TrendingUp size={20} color={Colors.primary} />
                </TouchableOpacity>
              </View>
            }
          />

          {/* Company Selector */}
          <View style={styles.companySelectorContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.companyScroll}>
              {workData.companies.map((company) => (
                <TouchableOpacity
                  key={company.id}
                  onPress={() => switchCompany(company.id)}
                  onLongPress={() => handleCompanyOptions(company.id, company.name)}
                  style={[styles.companyChip, company.id === workData.activeCompanyId && styles.companyChipActive]}
                >
                  <Building2 size={14} color={company.id === workData.activeCompanyId ? Colors.black : Colors.textDim} />
                  <Text style={[styles.companyName, company.id === workData.activeCompanyId && styles.companyNameActive]}>
                    {company.name}
                  </Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity onPress={handleAddCompany} style={styles.addCompanyButton}>
                <Plus size={18} color={Colors.primary} />
              </TouchableOpacity>
            </ScrollView>
          </View>
          
          {/* Rate Input */}
          <View style={styles.rateContainer}>
            <View style={styles.rateCard}>
              <DollarSign size={22} color={Colors.success} opacity={0.8} />
              <View style={styles.rateInfo}>
                <Text style={styles.rateLabel}>{activeCompany.name} {t('hourlyRate')}</Text>
              </View>
              <View style={styles.flex} />
              <TextInput
                style={styles.rateInput}
                value={activeCompany.hourlyRate > 0 ? activeCompany.hourlyRate.toString() : ''}
                onChangeText={(text) => updateHourlyRate(parseFloat(text) || 0)}
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor="rgba(255,255,255,0.3)"
              />
              <Text style={styles.currencySuffix}>{t('currencySuffix')}</Text>
            </View>
          </View>

          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.mainScrollContent}
          >
            {/* Month Nav */}
            <View style={styles.monthNav}>
              <TouchableOpacity onPress={() => navigateMonth(-1)} style={styles.navButton}>
                <ChevronLeft size={20} color={Colors.white} />
              </TouchableOpacity>
              <View style={styles.monthTitleContainer}>
                <Text style={styles.monthTitle}>{monthName.charAt(0).toUpperCase() + monthName.slice(1)}</Text>
                <Text style={styles.yearTitle}>{currentYear}</Text>
              </View>
              <TouchableOpacity onPress={() => navigateMonth(1)} style={styles.navButton}>
                <ChevronRight size={20} color={Colors.white} />
              </TouchableOpacity>
            </View>

            <CalendarGrid year={currentYear} month={currentMonth} monthData={monthData} onDayTap={openHoursDialog} />

            <SummaryCard
              totalHours={totalHours}
              formattedHours={formatDuration(totalHours)}
              salary={salary}
              monthName={monthName}
              onExport={handleExport}
            />
          </ScrollView>
        </View>

        {/* Daily Entry Modal */}
        <Modal visible={isModalVisible} transparent animationType="slide">
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalOverlay}>
            <TouchableOpacity style={styles.modalDismiss} activeOpacity={1} onPress={() => setIsModalVisible(false)} />
            <View style={styles.modalContent}>
              <View style={styles.modalHandle} />
              <Text style={styles.modalDate}>{selectedDay}. {monthName} {currentYear}</Text>
              <Text style={styles.companyIndicator}>{activeCompany.name}</Text>

              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.timePickersRow}>
                  <TimePickerButton label={t('startTime')} value={startTime} onPress={() => setShowPicker('start')} />
                  <View style={styles.width16} />
                  <TimePickerButton label={t('endTime')} value={endTime} onPress={() => setShowPicker('end')} />
                </View>

                <View style={styles.extraInputsRow}>
                  <View style={styles.breakInputContainer}>
                    <View style={styles.inputIconRow}>
                      <Coffee size={16} color={Colors.accent} />
                      <Text style={styles.inputLabel}>{t('breakMinutes')}</Text>
                    </View>
                    <TextInput
                      style={styles.breakInput}
                      value={breakMinutes}
                      onChangeText={(val) => { setBreakMinutes(val); calculateHours(startTime, endTime, val); }}
                      keyboardType="numeric"
                    />
                  </View>
                  <View style={styles.quickSelectGrid}>
                    {[4, 8, 12].map((h) => (
                      <TouchableOpacity key={h} onPress={() => onQuickSelect(h)} style={styles.quickButtonMini}>
                        <Text style={styles.quickButtonText}>{h}h</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {showPicker && (
                  <DateTimePicker
                    value={getTimeForPicker(showPicker === 'start' ? startTime : endTime)}
                    mode="time"
                    is24Hour={true}
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={onTimeChange}
                  />
                )}

                <Text style={styles.modalInstruction}>{t('enterHours')}</Text>
                <View style={styles.hoursInputRow}>
                  <TextInput
                    style={styles.hoursInput}
                    value={inputHours}
                    onChangeText={setInputHours}
                    keyboardType="numbers-and-punctuation"
                  />
                  <Text style={styles.hoursSuffix}>{t('hoursShort')}</Text>
                </View>

                <View style={styles.notesContainer}>
                  <View style={styles.inputIconRow}>
                    <FileText size={16} color={Colors.textDim} />
                    <Text style={styles.inputLabel}>{t('notes')}</Text>
                  </View>
                  <TextInput
                    style={styles.notesInput}
                    value={notes}
                    onChangeText={setNotes}
                    multiline
                    numberOfLines={3}
                    placeholder={t('addNotes')}
                    placeholderTextColor="rgba(255,255,255,0.2)"
                  />
                </View>

                <View style={styles.modalActions}>
                  <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
                    <Text style={styles.clearButtonText}>{t('clear')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
                    <Text style={styles.saveButtonText}>{t('save')}</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
        </Modal>

        {/* Stats Modal */}
        <Modal visible={isStatsVisible} animationType="slide">
          <View style={styles.statsContainer}>
            <View style={styles.statsHeader}>
              <Text style={styles.statsTitle}>{t('analytics') || 'Analytics'}</Text>
              <TouchableOpacity onPress={() => setIsStatsVisible(false)}>
                <X size={24} color={Colors.white} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.statsContent}>
              <Text style={styles.chartTitle}>{t('monthlyEarnings')} ({activeCompany.name})</Text>
              <BarChart
                data={chartData}
                width={Dimensions.get('window').width - 32}
                height={220}
                yAxisLabel="$"
                yAxisSuffix=""
                chartConfig={{
                  backgroundColor: Colors.background,
                  backgroundGradientFrom: Colors.surface,
                  backgroundGradientTo: Colors.surfaceAlt,
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(20, 255, 236, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                }}
                style={{ marginVertical: 8, borderRadius: 16 }}
              />
              <View style={styles.statsList}>
                {history.slice().reverse().map((h, i) => (
                  <View key={i} style={styles.statsItem}>
                    <Text style={styles.statsMonth}>{h.label}</Text>
                    <View style={styles.statsValues}>
                      <Text style={styles.statsHours}>{formatDuration(h.hours)}h</Text>
                      <Text style={styles.statsSalary}>{h.salary.toFixed(2)}{t('currencySuffix')}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>
        </Modal>

        {!isAuthenticated && isProtected && (
          <View style={styles.lockOverlay}>
            <Lock size={64} color={Colors.primary} />
            <Text style={styles.lockTitle}>Checker is Locked</Text>
            <TouchableOpacity onPress={authenticate} style={styles.unlockBtn}>
              <Text style={styles.unlockBtnText}>Unlock</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}

const TimePickerButton = ({ label, value, onPress }: { label: string, value: string | null, onPress: () => void }) => (
  <TouchableOpacity onPress={onPress} style={styles.timeButton}>
    <Text style={styles.timeLabel}>{label}</Text>
    <View style={styles.timeValueRow}>
      <Clock size={16} color={Colors.primary} opacity={0.8} />
      <Text style={styles.timeValue}>{value || '--:--'}</Text>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  safeArea: { flex: 1, paddingTop: 40 },
  mainScrollContent: { paddingBottom: 40 },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerIconBtn: {
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  lockOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  lockTitle: {
    color: Colors.white,
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 32,
  },
  unlockBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 16,
  },
  unlockBtnText: {
    color: Colors.black,
    fontSize: 16,
    fontWeight: 'bold',
  },
  statsContainer: { flex: 1, backgroundColor: Colors.background, paddingTop: 60 },
  statsHeader: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 24, marginBottom: 32 },
  statsTitle: { color: Colors.white, fontSize: 24, fontWeight: 'bold' },
  statsContent: { paddingHorizontal: 16 },
  chartTitle: { color: Colors.textDim, fontSize: 16, marginBottom: 16 },
  statsList: { marginTop: 32, gap: 12, paddingBottom: 40 },
  statsItem: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: Colors.surface, padding: 16, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  statsMonth: { color: Colors.white, fontSize: 16, fontWeight: '600' },
  statsValues: { alignItems: 'flex-end' },
  statsHours: { color: Colors.textDim, fontSize: 12 },
  statsSalary: { color: Colors.primary, fontSize: 16, fontWeight: 'bold' },
  companySelectorContainer: { marginBottom: 16 },
  companyScroll: { paddingHorizontal: 16, alignItems: 'center', gap: 10 },
  companyChip: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.05)', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)', gap: 6 },
  companyChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  companyName: { color: Colors.textDim, fontSize: 13, fontWeight: '600' },
  companyNameActive: { color: Colors.black },
  addCompanyButton: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(20, 255, 236, 0.1)', alignItems: 'center', justifyContent: 'center', marginLeft: 4 },
  rateContainer: { paddingHorizontal: 16, marginBottom: 16 },
  rateCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.05)', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)' },
  rateInfo: { marginLeft: 12 },
  rateLabel: { color: Colors.textDim, fontSize: 14 },
  flex: { flex: 1 },
  rateInput: { color: Colors.white, fontSize: 18, fontWeight: 'bold', textAlign: 'right', minWidth: 60 },
  currencySuffix: { color: Colors.textDim, fontSize: 14, marginLeft: 4 },
  monthNav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, marginBottom: 8 },
  navButton: { backgroundColor: 'rgba(255,255,255,0.1)', padding: 8, borderRadius: 10 },
  monthTitleContainer: { alignItems: 'center' },
  monthTitle: { color: Colors.white, fontSize: 20, fontWeight: 'bold' },
  yearTitle: { color: Colors.textDim, fontSize: 14 },
  modalOverlay: { flex: 1, justifyContent: 'flex-end' },
  modalDismiss: { flex: 1 },
  modalContent: { backgroundColor: Colors.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: Platform.OS === 'ios' ? 40 : 20, maxHeight: '90%' },
  modalHandle: { width: 40, height: 4, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
  modalDate: { color: Colors.white, fontSize: 20, fontWeight: 'bold', marginBottom: 4 },
  companyIndicator: { color: Colors.primary, fontSize: 14, fontWeight: '600', marginBottom: 20, opacity: 0.8 },
  timePickersRow: { flexDirection: 'row', marginBottom: 16 },
  extraInputsRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 24, gap: 12 },
  breakInputContainer: { flex: 1, backgroundColor: 'rgba(255,255,255,0.05)', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)' },
  inputIconRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6, gap: 8 },
  inputLabel: { color: Colors.textDim, fontSize: 12 },
  breakInput: { color: Colors.white, fontSize: 16, fontWeight: 'bold', padding: 0 },
  quickSelectGrid: { flexDirection: 'row', gap: 6 },
  quickButtonMini: { backgroundColor: 'rgba(255,255,255,0.08)', paddingHorizontal: 12, paddingVertical: 10, borderRadius: 8, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)' },
  notesContainer: { backgroundColor: 'rgba(255,255,255,0.05)', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)', marginBottom: 24 },
  notesInput: { color: Colors.white, fontSize: 14, textAlignVertical: 'top', padding: 0, minHeight: 60 },
  timeButton: { flex: 1, backgroundColor: 'rgba(255,255,255,0.05)', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)' },
  timeLabel: { color: Colors.textDim, fontSize: 12, marginBottom: 4 },
  timeValueRow: { flexDirection: 'row', alignItems: 'center' },
  timeValue: { color: Colors.white, fontSize: 16, fontWeight: 'bold', marginLeft: 8 },
  width16: { width: 16 },
  modalInstruction: { color: Colors.textDim, fontSize: 14, marginBottom: 12 },
  hoursInputRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 16, padding: 16, marginBottom: 24 },
  hoursInput: { color: Colors.white, fontSize: 32, fontWeight: 'bold', textAlign: 'center' },
  hoursSuffix: { color: Colors.textDim, fontSize: 18, marginLeft: 8 },
  modalActions: { flexDirection: 'row' },
  clearButton: { flex: 1, paddingVertical: 16, alignItems: 'center' },
  clearButtonText: { color: Colors.error, fontSize: 16, opacity: 0.8 },
  quickButtonText: { color: Colors.white, fontSize: 14, fontWeight: '600' },
  saveButton: { flex: 2, backgroundColor: Colors.primary, paddingVertical: 16, alignItems: 'center', borderRadius: 12 },
  saveButtonText: { color: Colors.black, fontSize: 16, fontWeight: 'bold' },
});
