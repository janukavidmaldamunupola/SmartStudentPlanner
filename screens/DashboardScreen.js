import { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, SafeAreaView, Switch
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Calendar } from 'react-native-calendars';
import { loadTasks } from '../storage';
import { useTheme } from '../context/ThemeContext';

export default function DashboardScreen({ navigation, route }) {
  const username = route.params?.username || 'Student';
  const [tasks, setTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [markedDates, setMarkedDates] = useState({});
  const { colors, isDark, toggleTheme } = useTheme();

  useFocusEffect(
    useCallback(() => {
      const fetchTasks = async () => {
        const loaded = await loadTasks();
        setTasks(loaded);
        buildMarkedDates(loaded);
      };
      fetchTasks();
    }, [])
  );

  const buildMarkedDates = (taskList) => {
    const marked = {};
    taskList.forEach(task => {
      if (task.due_date) {
        const color = task.done ? '#3A5A40' :
          task.priority === 'High' ? '#DC2626' :
          task.priority === 'Medium' ? '#D97706' : '#3A5A40';
        marked[task.due_date] = {
          marked: true,
          dotColor: color,
          selectedColor: '#3A5A40',
        };
      }
    });
    return marked;
  };

  const getTasksForDate = (date) => {
    return tasks.filter(t => t.due_date === date);
  };

  const total = tasks.length;
  const completed = tasks.filter(t => t.done).length;
  const pending = total - completed;
  const highPriority = tasks.filter(t =>
    t.priority === 'High' && !t.done).length;

  const priorityColor = (priority) => {
    if (priority === 'High') return '#FEE2E2';
    if (priority === 'Medium') return '#FEF3C7';
    return '#DCFCE7';
  };

  const priorityTextColor = (priority) => {
    if (priority === 'High') return '#991B1B';
    if (priority === 'Medium') return '#92400E';
    return '#166534';
  };

  const selectedTasks = selectedDate ? getTasksForDate(selectedDate) : [];

  return (
    <SafeAreaView style={[styles.container,
      { backgroundColor: colors.background }]}>

      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.header }]}>
        <View>
          <Text style={styles.greeting}>
            Good morning, {username}! 👋
          </Text>
          <Text style={styles.date}>{new Date().toDateString()}</Text>
        </View>
        <View style={styles.headerRight}>
          <Text style={styles.darkModeLabel}>
            {isDark ? '🌙' : '☀️'}
          </Text>
          <Switch
            value={isDark}
            onValueChange={toggleTheme}
            trackColor={{ false: '#86EFAC', true: '#374151' }}
            thumbColor={isDark ? '#F9FAFB' : '#3A5A40'}
          />
          <TouchableOpacity
            style={styles.logoutBtn}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.body}>

        {/* Stats Row */}
        <Text style={[styles.sectionLabel, { color: colors.subtext }]}>
          Overview
        </Text>
        <View style={styles.statRow}>
          <View style={[styles.statCard, { backgroundColor: colors.card,
            borderColor: colors.border }]}>
            <Text style={[styles.statNum, { color: colors.primary }]}>
              {total}
            </Text>
            <Text style={[styles.statLabel, { color: colors.subtext }]}>
              Total
            </Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.card,
            borderColor: colors.border }]}>
            <Text style={[styles.statNum, { color: '#16A34A' }]}>
              {completed}
            </Text>
            <Text style={[styles.statLabel, { color: colors.subtext }]}>
              Done
            </Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.card,
            borderColor: colors.border }]}>
            <Text style={[styles.statNum, { color: '#DC2626' }]}>
              {highPriority}
            </Text>
            <Text style={[styles.statLabel, { color: colors.subtext }]}>
              High
            </Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.card,
            borderColor: colors.border }]}>
            <Text style={[styles.statNum, { color: '#D97706' }]}>
              {pending}
            </Text>
            <Text style={[styles.statLabel, { color: colors.subtext }]}>
              Pending
            </Text>
          </View>
        </View>

        {/* Calendar */}
        <Text style={[styles.sectionLabel, { color: colors.subtext }]}>
          Task Calendar
        </Text>
        <View style={[styles.calendarCard, { backgroundColor: colors.card,
          borderColor: colors.border }]}>
          <Calendar
            markedDates={{
              ...buildMarkedDates(tasks),
              ...(selectedDate ? {
                [selectedDate]: {
                  ...buildMarkedDates(tasks)[selectedDate],
                  selected: true,
                  selectedColor: '#3A5A40',
                }
              } : {})
            }}
            onDayPress={(day) => setSelectedDate(day.dateString)}
            theme={{
              backgroundColor: colors.card,
              calendarBackground: colors.card,
              textSectionTitleColor: colors.subtext,
              selectedDayBackgroundColor: '#3A5A40',
              selectedDayTextColor: '#fff',
              todayTextColor: '#3A5A40',
              dayTextColor: colors.text,
              textDisabledColor: colors.subtext,
              arrowColor: '#3A5A40',
              monthTextColor: colors.text,
              indicatorColor: '#3A5A40',
            }}
          />
        </View>

        {/* Tasks for selected date */}
        {selectedDate ? (
          <View style={{ marginTop: 8 }}>
            <Text style={[styles.sectionLabel, { color: colors.subtext }]}>
              Tasks for {selectedDate}
            </Text>
            {selectedTasks.length === 0 ? (
              <View style={[styles.emptyCard, { backgroundColor: colors.card,
                borderColor: colors.border }]}>
                <Text style={[styles.emptyText, { color: colors.subtext }]}>
                  No tasks due on this date 🎉
                </Text>
              </View>
            ) : (
              selectedTasks.map(task => (
                <View key={task.id} style={[styles.taskCard,
                  { backgroundColor: colors.card,
                    borderColor: colors.border }]}>
                  <View style={styles.taskLeft}>
                    <Text style={[styles.taskTitle, { color: colors.text },
                      task.done && styles.taskTitleDone]}>
                      {task.done ? '✓ ' : ''}{task.title}
                    </Text>
                    <Text style={[styles.taskMeta,
                      { color: colors.subtext }]}>
                      {task.module}
                    </Text>
                  </View>
                  <View style={[styles.badge,
                    { backgroundColor: priorityColor(task.priority) }]}>
                    <Text style={[styles.badgeText,
                      { color: priorityTextColor(task.priority) }]}>
                      {task.priority}
                    </Text>
                  </View>
                </View>
              ))
            )}
          </View>
        ) : (
          <View style={[styles.emptyCard, { backgroundColor: colors.card,
            borderColor: colors.border }]}>
            <Text style={[styles.emptyText, { color: colors.subtext }]}>
              📅 Tap a date to see tasks due that day
            </Text>
          </View>
        )}

        {/* Due Soon */}
        <Text style={[styles.sectionLabel, { color: colors.subtext,
          marginTop: 16 }]}>
          Due Soon
        </Text>
        {tasks.filter(t => !t.done).slice(0, 3).map(task => (
          <View key={task.id} style={[styles.taskCard,
            { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.taskLeft}>
              <Text style={[styles.taskTitle, { color: colors.text }]}>
                {task.title}
              </Text>
              <Text style={[styles.taskMeta, { color: colors.subtext }]}>
                {task.module} · Due {task.due_date}
              </Text>
            </View>
            <View style={[styles.badge,
              { backgroundColor: priorityColor(task.priority) }]}>
              <Text style={[styles.badgeText,
                { color: priorityTextColor(task.priority) }]}>
                {task.priority}
              </Text>
            </View>
          </View>
        ))}

        <TouchableOpacity
          style={[styles.viewAllBtn, { borderColor: colors.primary }]}
          onPress={() => navigation.navigate('Tasks')}
        >
          <Text style={[styles.viewAllText, { color: colors.primary }]}>
            View all tasks →
          </Text>
        </TouchableOpacity>

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Bottom Nav */}
      <View style={[styles.bottomNav, { backgroundColor: colors.card,
        borderTopColor: colors.border }]}>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>🏠</Text>
          <Text style={[styles.navLabel, { color: colors.primary }]}>
            Home
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate('Tasks')}
        >
          <Text style={styles.navIcon}>✅</Text>
          <Text style={[styles.navLabel, { color: colors.subtext }]}>
            Tasks
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate('Search')}
        >
          <Text style={styles.navIcon}>🔍</Text>
          <Text style={[styles.navLabel, { color: colors.subtext }]}>
            Search
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    padding: 24,
    paddingTop: 48,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: { fontSize: 18, fontWeight: '600', color: '#fff' },
  date: { fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  darkModeLabel: { fontSize: 18 },
  logoutBtn: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  logoutText: { color: '#fff', fontSize: 12 },
  body: { flex: 1, padding: 16 },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
    marginTop: 4,
  },
  statRow: { flexDirection: 'row', gap: 8, marginBottom: 20 },
  statCard: {
    flex: 1,
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    borderWidth: 0.5,
  },
  statNum: { fontSize: 22, fontWeight: '600' },
  statLabel: { fontSize: 10, marginTop: 2, textAlign: 'center' },
  calendarCard: {
    borderRadius: 12,
    borderWidth: 0.5,
    overflow: 'hidden',
    marginBottom: 12,
  },
  emptyCard: {
    borderRadius: 10,
    borderWidth: 0.5,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  emptyText: { fontSize: 13 },
  taskCard: {
    borderRadius: 10,
    padding: 14,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 0.5,
  },
  taskLeft: { flex: 1 },
  taskTitle: { fontSize: 14, fontWeight: '500', marginBottom: 3 },
  taskTitleDone: {
    textDecorationLine: 'line-through',
    color: '#9CA3AF',
  },
  taskMeta: { fontSize: 12 },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    marginLeft: 8,
  },
  badgeText: { fontSize: 11, fontWeight: '500' },
  viewAllBtn: {
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    marginTop: 4,
    marginBottom: 16,
  },
  viewAllText: { fontSize: 14, fontWeight: '500' },
  bottomNav: {
    flexDirection: 'row',
    borderTopWidth: 0.5,
    paddingVertical: 8,
  },
  navItem: { flex: 1, alignItems: 'center', paddingVertical: 4 },
  navIcon: { fontSize: 20, marginBottom: 2 },
  navLabel: { fontSize: 10 },
});