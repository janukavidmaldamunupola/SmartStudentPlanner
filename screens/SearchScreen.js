import { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, TextInput,
  TouchableOpacity, ScrollView, SafeAreaView
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { loadTasks, searchTasks } from '../storage';

export default function SearchScreen({ navigation }) {
  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const [allTasks, setAllTasks] = useState([]);

useFocusEffect(
    useCallback(() => {
      const fetchTasks = async () => {
        const loaded = await loadTasks();
        setAllTasks(loaded);
      };
      fetchTasks();
      setKeyword('');
      setResults([]);
      setSearched(false);
    }, [])
  );

const handleSearch = async (text) => {
    setKeyword(text);
    if (text.trim() === '') {
      setResults([]);
      setSearched(false);
      return;
    }
    setSearched(true);
    const current = await loadTasks();
    setResults(searchTasks(text, current));
  };

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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Search Tasks 🔍</Text>
        <Text style={styles.headerSub}>{allTasks.length} tasks total</Text>
      </View>

      <View style={styles.searchBox}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by title, module or notes..."
          value={keyword}
          onChangeText={handleSearch}
          autoCapitalize="none"
        />
        {keyword.length > 0 && (
          <TouchableOpacity onPress={() => handleSearch('')}>
            <Text style={styles.clearBtn}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView style={styles.body}>
        {!searched && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🔎</Text>
            <Text style={styles.emptyTitle}>Search your tasks</Text>
            <Text style={styles.emptySubtitle}>
              Type a keyword to find tasks by title, module or notes
            </Text>
          </View>
        )}

        {searched && results.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>😕</Text>
            <Text style={styles.emptyTitle}>No tasks found</Text>
            <Text style={styles.emptySubtitle}>
              Try a different keyword
            </Text>
          </View>
        )}

        {searched && results.length > 0 && (
          <Text style={styles.resultsLabel}>
            {results.length} result{results.length > 1 ? 's' : ''} found
          </Text>
        )}

        {results.map(task => (
          <TouchableOpacity
            key={task.id}
            style={[styles.taskCard, task.done && styles.taskCardDone]}
            onPress={() => navigation.navigate('AddTask', { taskId: task.id })}
          >
            <View style={styles.taskLeft}>
              <Text style={[
                styles.taskTitle,
                task.done && styles.taskTitleDone
              ]}>
                {task.done ? '✓ ' : ''}{task.title}
              </Text>
              <Text style={styles.taskMeta}>
                {task.module} · Due {task.due_date}
              </Text>
              {task.notes ? (
                <Text style={styles.taskNotes} numberOfLines={1}>
                  📝 {task.notes}
                </Text>
              ) : null}
            </View>
            <View style={[styles.badge,
              { backgroundColor: priorityColor(task.priority) }]}>
              <Text style={[styles.badgeText,
                { color: priorityTextColor(task.priority) }]}>
                {task.priority}
              </Text>
            </View>
          </TouchableOpacity>
        ))}

        <View style={{ height: 20 }} />
      </ScrollView>

      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate('Dashboard')}
        >
          <Text style={styles.navIcon}>🏠</Text>
          <Text style={styles.navLabel}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate('Tasks')}
        >
          <Text style={styles.navIcon}>✅</Text>
          <Text style={styles.navLabel}>Tasks</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>🔍</Text>
          <Text style={[styles.navLabel, { color: '#3A5A40' }]}>Search</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: {
    backgroundColor: '#3A5A40',
    padding: 24,
    paddingTop: 48,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#fff',
  },
  headerSub: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  searchIcon: { fontSize: 16 },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
  },
  clearBtn: {
    fontSize: 16,
    color: '#9CA3AF',
    paddingHorizontal: 4,
  },
  body: { flex: 1, paddingHorizontal: 16 },
  emptyState: {
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 32,
  },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  resultsLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 10,
    fontWeight: '500',
  },
  taskCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: '#E5E7EB',
  },
  taskCardDone: { opacity: 0.6 },
  taskLeft: { flex: 1, marginRight: 8 },
  taskTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 3,
  },
  taskTitleDone: {
    textDecorationLine: 'line-through',
    color: '#9CA3AF',
  },
  taskMeta: { fontSize: 12, color: '#6B7280', marginBottom: 3 },
  taskNotes: { fontSize: 11, color: '#9CA3AF' },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  badgeText: { fontSize: 11, fontWeight: '500' },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 0.5,
    borderTopColor: '#E5E7EB',
    paddingVertical: 8,
    flexDirection: 'row',
  },
  navItem: { flex: 1, alignItems: 'center', paddingVertical: 4 },
  navIcon: { fontSize: 20, marginBottom: 2 },
  navLabel: { fontSize: 10, color: '#6B7280' },
});