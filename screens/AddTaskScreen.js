import { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  TextInput, ScrollView, SafeAreaView, Modal
} from 'react-native';
import { loadTasks, addTask, updateTask } from '../storage';

export default function AddTaskScreen({ navigation, route }) {
  const taskId = route.params?.taskId;
  const isEditing = !!taskId;

  const [title, setTitle] = useState('');
  const [module, setModule] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchTask = async () => {
      if (isEditing) {
        const allTasks = await loadTasks();
        const task = allTasks.find(t => t.id === taskId);
        if (task) {
          setTitle(task.title);
          setModule(task.module);
          setDueDate(task.due_date);
          setPriority(task.priority);
          setNotes(task.notes);
        }
      }
    };
    fetchTask();
  }, [taskId]);

  const validate = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = 'Task title is required';
    if (!module.trim()) newErrors.module = 'Module is required';
    if (!dueDate.trim()) newErrors.dueDate = 'Due date is required';
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dueDate)) {
      newErrors.dueDate = 'Use format YYYY-MM-DD (e.g. 2026-06-11)';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    const currentTasks = await loadTasks();

    if (isEditing) {
      await updateTask(taskId,
        { title, module, due_date: dueDate, priority, notes },
        currentTasks
      );
      setSuccessMessage('Task updated successfully! ✅');
    } else {
      await addTask(
        { title, module, due_date: dueDate, priority, notes },
        currentTasks
      );
      setSuccessMessage('Task added successfully! ✅');
    }
    setShowSuccess(true);
  };

  const priorities = ['High', 'Medium', 'Low'];

  const priorityColor = (p) => {
    if (p === 'High') return { bg: '#D8E8D8', text: '#1A3A1A', border: '#3A5A40' };
    if (p === 'Medium') return { bg: '#E8F0E8', text: '#2A4A2A', border: '#3A5A40' };
    return { bg: '#F0F5F0', text: '#3A5A40', border: '#3A5A40' };
  };

  return (
    <SafeAreaView style={styles.container}>

      {/* Success Popup Modal */}
      <Modal
        visible={showSuccess}
        transparent
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalIcon}>🎉</Text>
            <Text style={styles.modalTitle}>
              {isEditing ? 'Task Updated!' : 'Task Added!'}
            </Text>
            <Text style={styles.modalMessage}>{successMessage}</Text>
            <TouchableOpacity
              style={styles.modalBtn}
              onPress={() => {
                setShowSuccess(false);
                navigation.navigate('Tasks');
              }}
            >
              <Text style={styles.modalBtnText}>Go to Tasks</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalBtnSecondary}
              onPress={() => {
                setShowSuccess(false);
                navigation.navigate('Dashboard');
              }}
            >
              <Text style={styles.modalBtnSecondaryText}>Go to Home</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backBtnText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isEditing ? 'Edit Task' : 'Add New Task'}
        </Text>
      </View>

      <ScrollView style={styles.body}>
        <Text style={styles.label}>Task Title *</Text>
        <TextInput
          style={[styles.input, errors.title && styles.inputError]}
          placeholder="e.g. Write reflective narrative"
          value={title}
          onChangeText={setTitle}
        />
        {errors.title && (
          <Text style={styles.errorText}>⚠️ {errors.title}</Text>
        )}

        <Text style={styles.label}>Module *</Text>
        <TextInput
          style={[styles.input, errors.module && styles.inputError]}
          placeholder="e.g. LDC6004M"
          value={module}
          onChangeText={setModule}
          autoCapitalize="characters"
        />
        {errors.module && (
          <Text style={styles.errorText}>⚠️ {errors.module}</Text>
        )}

        <Text style={styles.label}>Due Date * (YYYY-MM-DD)</Text>
        <TextInput
          style={[styles.input, errors.dueDate && styles.inputError]}
          placeholder="e.g. 2026-06-11"
          value={dueDate}
          onChangeText={setDueDate}
        />
        {errors.dueDate && (
          <Text style={styles.errorText}>⚠️ {errors.dueDate}</Text>
        )}

        <Text style={styles.label}>Priority</Text>
        <View style={styles.priorityRow}>
          {priorities.map(p => {
            const colors = priorityColor(p);
            const selected = priority === p;
            return (
              <TouchableOpacity
                key={p}
                style={[
                  styles.priorityBtn,
                  { borderColor: colors.border },
                  selected && { backgroundColor: colors.bg },
                ]}
                onPress={() => setPriority(p)}
              >
                <Text style={[
                  styles.priorityBtnText,
                  { color: selected ? colors.text : '#6B7280' },
                ]}>
                  {p}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={styles.label}>Notes (optional)</Text>
        <TextInput
          style={[styles.input, styles.notesInput]}
          placeholder="Any additional notes..."
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={4}
        />

        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveBtnText}>
            {isEditing ? '💾 Update Task' : '✅ Save Task'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelBtnText}>Cancel</Text>
        </TouchableOpacity>

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: {
    backgroundColor: '#3A5A40',
    padding: 24,
    paddingTop: 48,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  backBtn: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 8,
  },
  backBtnText: { color: '#fff', fontSize: 14 },
  headerTitle: { fontSize: 20, fontWeight: '600', color: '#fff' },
  body: { flex: 1, padding: 20 },
  label: {
    fontSize: 13,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 6,
    marginTop: 16,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    color: '#111827',
  },
  inputError: { borderColor: '#EF4444' },
  errorText: { fontSize: 12, color: '#DC2626', marginTop: 4 },
  notesInput: { height: 100, textAlignVertical: 'top' },
  priorityRow: { flexDirection: 'row', gap: 10 },
  priorityBtn: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1.5,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  priorityBtnText: { fontSize: 13, fontWeight: '500' },
  saveBtn: {
    backgroundColor: '#3A5A40',
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
    marginTop: 28,
  },
  saveBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  cancelBtn: {
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#fff',
  },
  cancelBtnText: { color: '#6B7280', fontSize: 14 },
  // Modal styles
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
  modalBtn: {
    backgroundColor: '#3A5A40',
    borderRadius: 10,
    padding: 12,
    width: '100%',
    alignItems: 'center',
    marginBottom: 8,
  },
  modalBtnText: { color: '#fff', fontSize: 15, fontWeight: '600' },
  modalBtnSecondary: {
    borderWidth: 1,
    borderColor: '#3A5A40',
    borderRadius: 10,
    padding: 12,
    width: '100%',
    alignItems: 'center',
  },
  modalBtnSecondaryText: { color: '#3A5A40', fontSize: 15 },
});