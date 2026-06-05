import AsyncStorage from '@react-native-async-storage/async-storage';

const TASKS_KEY = 'tasks';

const defaultTasks = [
  {
    id: 1,
    title: 'Mobile App Portfolio',
    module: 'LDC6004M',
    due_date: '2026-06-11',
    priority: 'High',
    notes: 'Build using React Native',
    done: false,
  },
  {
    id: 2,
    title: 'Database coursework',
    module: 'LDC5002M',
    due_date: '2026-05-28',
    priority: 'Medium',
    notes: 'Focus on SQL queries',
    done: false,
  },
  {
    id: 3,
    title: 'Research proposal draft',
    module: 'LDC6001M',
    due_date: '2026-06-05',
    priority: 'Low',
    notes: '',
    done: true,
  },
];

export const loadTasks = async () => {
  try {
    const data = await AsyncStorage.getItem(TASKS_KEY);
    if (data !== null) {
      return JSON.parse(data);
    }
    await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(defaultTasks));
    return defaultTasks;
  } catch (error) {
    console.error('Error loading tasks:', error);
    return defaultTasks;
  }
};

export const saveTasks = async (tasks) => {
  try {
    await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
    return true;
  } catch (error) {
    console.error('Error saving tasks:', error);
    return false;
  }
};

export const addTask = async (task, currentTasks) => {
  try {
    const newId = currentTasks.length > 0
      ? Math.max(...currentTasks.map(t => t.id)) + 1
      : 1;
    const newTask = { ...task, id: newId, done: false };
    const updated = [...currentTasks, newTask];
    await saveTasks(updated);
    return updated;
  } catch (error) {
    console.error('Error adding task:', error);
    return currentTasks;
  }
};

export const updateTask = async (id, updatedFields, currentTasks) => {
  try {
    const updated = currentTasks.map(t =>
      t.id === id ? { ...t, ...updatedFields } : t
    );
    await saveTasks(updated);
    return updated;
  } catch (error) {
    console.error('Error updating task:', error);
    return currentTasks;
  }
};

export const deleteTask = async (id, currentTasks) => {
  try {
    console.log('Deleting task with id:', id);
    console.log('Current tasks before delete:', currentTasks);
    const updated = currentTasks.filter(t => t.id !== id);
    console.log('Tasks after delete:', updated);
    const saved = await saveTasks(updated);
    console.log('Save result:', saved);
    return updated;
  } catch (error) {
    console.error('Error deleting task:', error);
    return currentTasks;
  }
};

export const toggleTask = async (id, currentTasks) => {
  try {
    const updated = currentTasks.map(t =>
      t.id === id ? { ...t, done: !t.done } : t
    );
    await saveTasks(updated);
    return updated;
  } catch (error) {
    console.error('Error toggling task:', error);
    return currentTasks;
  }
};

export const searchTasks = (keyword, currentTasks) => {
  const k = keyword.toLowerCase();
  return currentTasks.filter(t =>
    t.title.toLowerCase().includes(k) ||
    t.module.toLowerCase().includes(k) ||
    t.notes.toLowerCase().includes(k)
  );
};