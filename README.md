# Smart Student Planner 📚

A mobile task management application built with React Native and Expo, designed to help university students manage their academic workload effectively.

## GitHub Repository
https://github.com/janukavidmaldamunupola/SmartStudentPlanner

---

## Features
- Login / Logout with input validation
- Dashboard with live task statistics
- Interactive calendar showing task due dates
- Dark mode toggle
- Add, Edit, Delete tasks
- Mark tasks complete / incomplete
- Search tasks by keyword, module or notes
- Local data persistence using AsyncStorage
- Responsive UI design

---

## Framework and Tools Used

## Project Structure

| File/Folder | Purpose |
|---|---|
| `App.js` | Main navigation setup |
| `storage.js` | AsyncStorage data persistence |
| `context/ThemeContext.js` | Dark mode state management |
| `screens/LoginScreen.js` | Login with validation |
| `screens/DashboardScreen.js` | Home with calendar and stats |
| `screens/TasksScreen.js` | Task list with CRUD operations |
| `screens/AddTaskScreen.js` | Add and edit tasks |
| `screens/SearchScreen.js` | Search tasks by keyword |
| `assets/` | Images and icons |

## Installation and Setup

### Prerequisites
- Node.js (v18 or above) — https://nodejs.org
- Git — https://git-scm.com

### Steps

1. Clone the repository
git clone https://github.com/janukavidmaldamunupola/SmartStudentPlanner.git

2. Navigate into the project folder
cd SmartStudentPlanner

3. Install dependencies
npm install

4. Install web support
npx expo install react-dom react-native-web @expo/metro-runtime

5. Start the app
npx expo start --web

6. Press W to open in browser

---

## Project Structure

SmartStudentPlanner/
├── screens/
│   ├── LoginScreen.js       # Login with validation
│   ├── DashboardScreen.js   # Home with calendar and stats
│   ├── TasksScreen.js       # Task list with CRUD operations
│   ├── AddTaskScreen.js     # Add and edit tasks
│   └── SearchScreen.js      # Search tasks by keyword
├── context/
│   └── ThemeContext.js      # Dark mode state management
├── storage.js               # AsyncStorage data persistence
├── App.js                   # Navigation setup
└── assets/                  # Images and icons

---

## Architecture

This app follows the MVC (Model-View-Controller) pattern:

- Model — storage.js handles all data operations using AsyncStorage
- View — Screen components in the screens/ folder
- Controller — Navigation and state logic in App.js and ThemeContext.js

---

## Known Limitations
- Authentication uses basic validation only
- Data is stored locally on device only (no cloud sync)
- Calendar only shows tasks by due date (no drag and drop)
- No push notifications for upcoming deadlines

---

## Future Enhancements
- Cloud sync with Firebase or Supabase
- Push notifications for task deadlines
- Drag and drop task prioritisation
- Collaboration features for group assignments
- Analytics dashboard showing productivity trends
- Export tasks to PDF or CSV

---

## Developer
Januka Damunupola
York St John University
Module: LDC6004M — Mobile Application Development
Submission: June 2026
