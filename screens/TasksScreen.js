import { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, SafeAreaView, Alert,Modal
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { loadTasks, toggleTask, deleteTask } from '../storage';

export default function TasksScreen({ navigation }) {
  const [tasks, setTasks] = useState([])
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  useFocusEffect(
    useCallback(() => {
      const fetchTasks = async () => {
        const loaded = await loadTasks();
        setTasks(loaded);
      };
      fetchTasks();
    }, [])
  );

  const handleToggle = async (id) => {
    const updated = await toggleTask(id, tasks);
    setTasks([...updated]);
  };

  const handleDelete = (id) => {
    setTaskToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    const updated = await deleteTask(taskToDelete, tasks);
    setTasks([...updated]);
    setShowDeleteModal(false);
    setTaskToDelete(null);
  };

  const priorityColor = (priority) => {
    if (priority === 'High') return '#D8E8D8';
    if (priority === 'Medium') return '#E8F0E8';
    return '#F0F5F0';
  };

  const priorityTextColor = (priority) => {
    if (priority === 'High') return '#1A3A1A';
    if (priority === 'Medium') return '#2A4A2A';
    return '#3A5A40';
  };

  const pending = tasks.filter(t => !t.done);
  const completed = tasks.filter(t => t.done);

  return (
    <SafeAreaView style={styles.container}>
      {/* Delete Confirmation Modal */}
<Modal visible={showDeleteModal} transparent animationType="fade">
  <View style={styles.modalOverlay}>
    <View style={styles.modalBox}>
      <Text style={styles.modalIcon}>🗑️</Text>
      <Text style={styles.modalTitle}>Delete Task?</Text>
      <Text style={styles.modalMessage}>
        This action cannot be undone.
      </Text>
      <TouchableOpacity
        style={styles.modalDeleteBtn}
        onPress={confirmDelete}
      >
        <Text style={styles.modalDeleteBtnText}>Yes, Delete</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.modalCancelBtn}
        onPress={() => setShowDeleteModal(false)}
      >
        <Text style={styles.modalCancelBtnText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Tasks</Text>
        <Text style={styles.headerSub}>
          {pending.length} pending · {completed.length} completed
        </Text>
      </View>

      <ScrollView style={styles.body}>
        <Text style={styles.sectionLabel}>Pending</Text>
        {pending.length === 0 && (
          <Text style={styles.emptyText}>No pending tasks 🎉</Text>
        )}
        {pending.map(task => (
          <View key={task.id} style={styles.taskCard}>
            <TouchableOpacity
              style={styles.checkbox}
              onPress={() => handleToggle(task.id)}
            >
              <Text style={styles.checkboxInner}></Text>
            </TouchableOpacity>
            <View style={styles.taskMiddle}>
              <Text style={styles.taskTitle}>{task.title}</Text>
              <Text style={styles.taskMeta}>
                {task.module} · Due {task.due_date}
              </Text>
              <View style={[styles.badge,
                { backgroundColor: priorityColor(task.priority) }]}>
                <Text style={[styles.badgeText,
                  { color: priorityTextColor(task.priority) }]}>
                  {task.priority}
                </Text>
              </View>
            </View>
            <View style={styles.taskActions}>
              <TouchableOpacity
                style={styles.editBtn}
                onPress={() => navigation.navigate('AddTask',
                  { taskId: task.id })}
              >
                <Text style={styles.editBtnText}>✏️</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => handleDelete(task.id)}
              >
                <Text style={styles.deleteBtnText}>🗑️</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        <Text style={[styles.sectionLabel, { marginTop: 16 }]}>
          Completed
        </Text>
        {completed.length === 0 && (
          <Text style={styles.emptyText}>No completed tasks yet</Text>
        )}
        {completed.map(task => (
          <View key={task.id} style={[styles.taskCard, styles.taskCardDone]}>
            <TouchableOpacity
              style={[styles.checkbox, styles.checkboxDone]}
              onPress={() => handleToggle(task.id)}
            >
              <Text style={styles.checkboxTick}>✓</Text>
            </TouchableOpacity>
            <View style={styles.taskMiddle}>
              <Text style={[styles.taskTitle, styles.taskTitleDone]}>
                {task.title}
              </Text>
              <Text style={styles.taskMeta}>{task.module}</Text>
            </View>
            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() => handleDelete(task.id)}
            >
              <Text style={styles.deleteBtnText}>🗑️</Text>
            </TouchableOpacity>
          </View>
        ))}
        <View style={{ height: 80 }} />
      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddTask', {})}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate('Dashboard')}
        >
          <Text style={styles.navIcon}>🏠</Text>
          <Text style={styles.navLabel}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>✅</Text>
          <Text style={[styles.navLabel, { color: '#3A5A40' }]}>Tasks</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate('Search')}
        >
          <Text style={styles.navIcon}>🔍</Text>
          <Text style={styles.navLabel}>Search</Text>
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
  headerTitle: { fontSize: 22, fontWeight: '600', color: '#fff' },
  headerSub: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  body: { flex: 1, padding: 16 },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 13,
    color: '#9CA3AF',
    textAlign: 'center',
    padding: 16,
  },
  taskCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: '#E5E7EB',
  },
  taskCardDone: { opacity: 0.7 },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#3A5A40',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxDone: { backgroundColor: '#3A5A40' },
  checkboxInner: { fontSize: 10 },
  checkboxTick: { color: '#fff', fontSize: 12, fontWeight: '700' },
  taskMiddle: { flex: 1 },
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
  taskMeta: { fontSize: 11, color: '#6B7280', marginBottom: 4 },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
  },
  badgeText: { fontSize: 10, fontWeight: '500' },
  taskActions: { flexDirection: 'row', gap: 4 },
  editBtn: { padding: 6 },
  editBtnText: { fontSize: 16 },
  deleteBtn: { padding: 6 },
  deleteBtnText: { fontSize: 16 },
  fab: {
    position: 'absolute',
    bottom: 70,
    right: 20,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#3A5A40',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
  fabText: { color: '#fff', fontSize: 28, fontWeight: '300' },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 0.5,
    borderTopColor: '#E5E7EB',
    paddingVertical: 8,
  },
  navItem: { flex: 1, alignItems: 'center', paddingVertical: 4 },
  navIcon: { fontSize: 20, marginBottom: 2 },
  navLabel: { fontSize: 10, color: '#6B7280' },

modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 28,
    width: '80%',
    alignItems: 'center',
  },
  modalIcon: { fontSize: 48, marginBottom: 12 },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  modalMessage: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalDeleteBtn: {
    backgroundColor: '#DC2626',
    borderRadius: 10,
    padding: 12,
    width: '100%',
    alignItems: 'center',
    marginBottom: 8,
  },
  modalDeleteBtnText: { color: '#fff', fontSize: 15, fontWeight: '600' },
  modalCancelBtn: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    padding: 12,
    width: '100%',
    alignItems: 'center',
  },
  modalCancelBtnText: { color: '#6B7280', fontSize: 15 },
});