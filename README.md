# MediCare – Medicine Reminder & Health Diary App

> **BTech Computer Science & Engineering (CSE) Mini Project**  
> **Domain:** Mobile Application Development, Full-Stack Architecture, Cloud DevOps  
> **Tech Stack:** React Native (Expo), JavaScript, React Navigation, AsyncStorage, Expo Hardware APIs, Node.js, Express, SQLite, Docker, Kubernetes, GitHub Actions CI/CD.

---

## 1. Project Overview & Objectives

**MediCare** is a production-grade, patient-centric mobile application designed to improve medication adherence and personal health tracking. Non-adherence to prescription regimens is one of the leading causes of preventable medical complications and treatment failures. MediCare bridges this gap by providing an intuitive, accessible, and offline-capable mobile companion that empowers individuals to manage complex dosage schedules, log observations and vitals, and review historical adherence trends.

### Core Objectives:
1. **Medication Schedule Management:** Facilitate recording of medications with precise dosages, administration instructions (e.g. before/after food), forms, frequencies, and multi-interval reminders.
2. **Local Notification Reminders:** Schedule localized notification alarms using `expo-notifications` ensuring reminders trigger reliably without constant internet connectivity.
3. **Interactive Health Diary:** Provide a personal journal to record date/time stamped wellness notes, symptoms, and basic vital signs (body temperature, blood pressure, pulse rate).
4. **Visual Analytics & Adherence Auditing:** Compute real-time adherence percentages and render 7-day adherence trend charts using responsive Flexbox layouts.
5. **Hardware Device Integration:** Utilize Expo Image Picker for camera/strip photo capture and Expo Location for optional geographic context in diary logs.
6. **Robust Offline-First Architecture:** Rely on local `AsyncStorage` as the primary persistent data store, with an optional containerized Express & SQLite REST API backend.

---

## 2. System Architecture & Syllabus Compliance Matrix

| Syllabus Requirement | How It Is Implemented | Source File Location |
| :--- | :--- | :--- |
| **React Native Core Components** | `View`, `Text`, `TextInput`, `Image`, `Pressable`, `ScrollView`, `FlatList`, `SafeAreaView`, `ActivityIndicator`, `Modal` | Throughout `src/components/` & `src/screens/` |
| **Responsive Flexbox Layouts** | Percentage widths, row/column flex directions, gap spacing, elevation & drop shadows across varying screen sizes | `src/components/reports/StatSummary.js`, `src/components/reports/AdherenceChart.js` |
| **Input Handling & Validation** | Controlled text inputs with regex/empty string validation, dynamic error feedback, chips selection | `src/screens/AddMedicineScreen.js`, `src/components/common/InputField.js` |
| **Navigation: Bottom Tabs** | 5 Bottom Tabs: Home, Medicines, Health Diary, History, Profile with responsive icon badges | `src/navigation/TabNavigator.js` |
| **Navigation: Native Stack** | Screen transitions for Onboarding, Add Medicine, Medicine Details, Edit Medicine, Add Diary | `src/navigation/StackNavigator.js` |
| **React Hooks** | `useState`, `useEffect`, `useCallback`, `useMemo`, `useRef`, custom `useHealth` & `useHealthData` | `src/context/HealthContext.js`, `src/hooks/useHealthData.js` |
| **AsyncStorage Persistence** | Custom storage service with key namespacing, CRUD operations, initial seed data, data reset & JSON export | `src/storage/storageService.js`, `src/storage/storageKeys.js` |
| **Camera & Image Picker** | `expo-image-picker` with runtime permission requests, photo gallery selection, image preview, removal | `src/screens/AddMedicineScreen.js`, `src/screens/EditMedicineScreen.js` |
| **Local Reminders** | `expo-notifications` with Android notification channels, time triggers, cancellation & rescheduling | `src/services/notificationService.js` |
| **Location Hardware (Demo)** | `expo-location` with balanced accuracy and reverse-geocoding into city/region name for diary logs | `src/services/locationService.js`, `src/screens/AddDiaryEntryScreen.js` |
| **API Integration (Fetch API)** | REST requests to Express backend + public OpenFDA drug database reference monograph queries | `src/services/apiService.js`, `src/screens/MedicineDetailsScreen.js` |
| **Animations API** | Hardware-accelerated fade-in and slide-up animations using React Native's `Animated` library | `src/components/common/AnimatedCard.js` |
| **Swipe Gestures** | Interactive Pan gestures: swipe left to trigger delete modal, swipe right to mark dose taken | `src/components/medicine/MedicineItemSwipeable.js` |
| **Backend REST API** | Node.js Express server with SQLite database for medicines, dose logs, diary records, and healthcheck | `backend/src/server.js`, `backend/src/config/database.js` |
| **GitHub Actions CI/CD** | Automated pipeline triggered on push/PR: validates Expo frontend, runs backend test suite, builds Docker image | `.github/workflows/ci.yml` |
| **Docker Containerization** | Multi-stage production `Dockerfile` with healthcheck probe and `docker-compose.yml` local orchestration | `backend/Dockerfile`, `docker/docker-compose.yml` |
| **Kubernetes Basics** | Declarative `Deployment` (2 replicas, liveness/readiness probes) and `Service` (NodePort 30500) | `k8s/backend-deployment.yaml`, `k8s/backend-service.yaml` |

---

## 3. Directory Structure

```text
Mini_project/
├── .github/
│   └── workflows/
│       └── ci.yml                 # Automated CI/CD pipeline
├── assets/                        # App icons, splash screens, adaptive icons
│   ├── adaptive-icon.png
│   ├── favicon.png
│   ├── icon.png
│   └── splash.png
├── backend/                       # Node.js + Express + SQLite Backend
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js        # SQLite connection and schema init
│   │   ├── controllers/
│   │   │   ├── diaryController.js
│   │   │   └── medicineController.js
│   │   ├── routes/
│   │   │   ├── diaryRoutes.js
│   │   │   └── medicineRoutes.js
│   │   └── server.js              # Express app, CORS, routes & healthcheck
│   ├── .env.example
│   ├── Dockerfile                 # Container specification
│   ├── package.json
│   └── test.js                    # Automated backend validation script
├── docker/
│   └── docker-compose.yml         # Local container orchestration
├── k8s/
│   ├── backend-deployment.yaml    # Kubernetes Deployment (2 Pod Replicas)
│   └── backend-service.yaml       # Kubernetes Service (NodePort)
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── AnimatedCard.js    # Animated API card container
│   │   │   ├── Button.js          # Reusable styled button with states
│   │   │   ├── Card.js            # Elevated card container
│   │   │   ├── ConfirmModal.js    # Destructive action confirmation dialog
│   │   │   ├── EmptyState.js      # Clean empty list state component
│   │   │   ├── Header.js          # Top header with back button & title
│   │   │   ├── InputField.js      # Form input with validation error text
│   │   │   └── StatusBadge.js     # Status pill (Taken, Skipped, Pending)
│   │   ├── diary/
│   │   │   └── DiaryCard.js       # Health diary entry presentation card
│   │   ├── medicine/
│   │   │   ├── MedicineCard.js    # Medicine overview card with actions
│   │   │   └── MedicineItemSwipeable.js # PanResponder swipe gesture item
│   │   └── reports/
│   │       ├── AdherenceChart.js  # Weekly Flexbox visual adherence chart
│   │       └── StatSummary.js     # Completion %, Taken, Skipped & Pending
│   ├── constants/
│   │   ├── colors.js              # Healthcare Teal & Slate color palette
│   │   └── sampleData.js          # Initial fictional demo records
│   ├── context/
│   │   └── HealthContext.js       # Global React Context provider & state
│   ├── hooks/
│   │   └── useHealthData.js       # Derived analytics, trends & schedule hook
│   ├── navigation/
│   │   ├── StackNavigator.js      # Native stack navigation config
│   │   └── TabNavigator.js        # Bottom 5-tab navigation config
│   ├── screens/
│   │   ├── AddDiaryEntryScreen.js # Health notes & vitals input
│   │   ├── AddMedicineScreen.js   # New medicine form with camera/picker
│   │   ├── EditMedicineScreen.js  # Edit existing medicine schedule
│   │   ├── HealthDiaryScreen.js   # Chronological wellness log
│   │   ├── HistoryScreen.js       # Adherence charts & audit logs
│   │   ├── HomeScreen.js          # Dashboard, next reminder & schedule
│   │   ├── MedicineDetailsScreen.js # Full details & OpenFDA API monograph
│   │   ├── MedicinesScreen.js     # Searchable & filterable FlatList
│   │   ├── OnboardingScreen.js    # Welcome introductory walkthrough
│   │   └── ProfileScreen.js       # Settings, export, reset & profile info
│   ├── services/
│   │   ├── apiService.js          # Fetch API client with offline fallback
│   │   ├── locationService.js     # Expo Location reverse-geocoding service
│   │   └── notificationService.js # Expo Notifications reminder scheduler
│   └── storage/
│       ├── storageKeys.js         # Namespaced AsyncStorage keys
│       └── storageService.js      # AsyncStorage persistence helper
├── app.json                       # Expo configuration & permissions
├── App.js                         # Root React Native entry point
├── babel.config.js                # Babel preset and reanimated plugin
├── package.json                   # Mobile dependencies and run scripts
├── .gitignore                     # Git ignore rules for node_modules & build
└── README.md                      # Comprehensive project documentation
```

---

## 4. Installation & Running Instructions (Windows / Mac / Linux)

### Prerequisites:
- **Node.js:** v18.0.0 or higher
- **Expo Go App:** Installed on your physical Android/iOS phone from Google Play Store or Apple App Store.

---

### Step 1: Install Mobile App Dependencies
Open PowerShell or your preferred terminal in the project root directory:

```powershell
# In c:\Users\ameet\Desktop\Mini_project
npm install --legacy-peer-deps
```

---

### Step 2: Start the Expo Development Server

```powershell
npx expo start
```

Once executed, Expo will start the Metro bundler and display an interactive QR code in your terminal.

---

### Step 3: Run the App on your Phone

#### Method A: Physical Android Phone via Expo Go (Recommended for Viva)
1. Ensure your smartphone and your computer are connected to the **same Wi-Fi network**.
2. Open the **Expo Go** app on your Android device.
3. Tap **Scan QR Code** and point your phone camera at the QR code displayed in your computer terminal.
4. The JavaScript bundle will compile and launch the **MediCare** application immediately on your physical phone!

*(Tip: If your college Wi-Fi has client isolation, press `s` in the terminal to switch to Tunnel mode, or run `npx expo start --tunnel`)*

#### Method B: Android Emulator
If you have Android Studio installed:
1. Launch your Android Virtual Device (AVD).
2. Press `a` in the terminal running `npx expo start`.

#### Method C: Web Browser Preview
To preview responsive layouts on your PC:
1. Press `w` in the terminal running `npx expo start`.

---

### Step 4: Run the Backend REST API (Optional)

The mobile app works 100% offline using `AsyncStorage`. If you wish to demonstrate the optional Express & SQLite backend:

```powershell
cd backend
npm install
node src/server.js
```

You will see:
```text
===============================================
 MediCare Backend API running on port 5000
 Healthcheck: http://localhost:5000/api/health
===============================================
```

#### Test Backend Endpoints (cURL / PowerShell):
- **Healthcheck:**
  ```powershell
  curl http://localhost:5000/api/health
  ```
- **List Medicines:**
  ```powershell
  curl http://localhost:5000/api/medicines
  ```

---

## 5. Docker & Kubernetes Deployment

> **Important Note for Project Viva:** Docker and Kubernetes are utilized to containerize and orchestrate the **backend REST API**, demonstrating cloud-native deployment principles. They do not run the mobile application itself.

### A. Run Backend with Docker Compose:
```bash
cd docker
docker-compose up -d --build
```
Verify the container is healthy:
```bash
docker ps
curl http://localhost:5000/api/health
```

### B. Deploy to Kubernetes (Minikube / MicroK8s / Cloud K8s):
```bash
# 1. Apply Deployment (spawns 2 backend pod replicas with health probes)
kubectl apply -f k8s/backend-deployment.yaml

# 2. Apply Service (exposes API via NodePort 30500)
kubectl apply -f k8s/backend-service.yaml

# 3. Verify rollout
kubectl get deployments
kubectl get pods -l app=medicare-backend
kubectl get services medicare-backend-service
```

### C. Automated Deployment & Status Check Script (PowerShell):
```powershell
# Check Kubernetes cluster, replica pods & health probes status:
powershell.exe -ExecutionPolicy Bypass -File .\deploy.ps1 -Action k8s-status

# Check Docker container status:
powershell.exe -ExecutionPolicy Bypass -File .\deploy.ps1 -Action docker-status

# Check live backend health & uptime:
powershell.exe -ExecutionPolicy Bypass -File .\deploy.ps1 -Action health
```

---

## 6. Git Version Control Commands

To initialize and push this project to your GitHub profile:

```bash
# 1. Initialize Git repository
git init

# 2. Check status of staged/untracked files
git status

# 3. Stage all files
git add .

# 4. Commit changes
git commit -m "feat: complete MediCare mobile application with Express backend and CI/CD"

# 5. Link to your personal GitHub repository
git remote add origin https://github.com/<your-username>/medicare-health-app.git

# 6. Push to main branch
git branch -M main
git push -u origin main
```

---

## 7. College Demonstration Script & Test Cases

| Test Case ID | Test Scenario | Action Performed | Expected Result | Pass / Fail |
| :---: | :--- | :--- | :--- | :---: |
| **TC-01** | **Initial Launch & Seed Data** | Launch app on clean install | Default sample medicines (Amoxicillin, Vitamin D3, Paracetamol) and past 7-day adherence charts appear. | **PASS** |
| **TC-02** | **Add Medicine Validation** | Tap "+ Add Medicine", leave required fields empty and tap Save | Helpful red validation warnings appear under Name, Dosage, and Reminder Times. Form does not submit. | **PASS** |
| **TC-03** | **Add Medicine with Photo** | Enter "Cetirizine 10mg", select "Tablet", choose "After Food", pick photo via Image Picker, tap Save | Image is attached, record is saved to AsyncStorage, reminder is registered, and dashboard updates instantly. | **PASS** |
| **TC-04** | **Mark Dose as Taken** | On Home dashboard or Medicines list, tap "Take Dose" | Dose changes to green "Taken" badge. Today's adherence completion percentage increases immediately. | **PASS** |
| **TC-05** | **Mark Dose as Skipped** | Tap "Skip" on a scheduled dose | Dose changes to red "Skipped" badge. Statistics reflect skipped count without corrupting total calculation. | **PASS** |
| **TC-06** | **Swipe Gesture Action** | In Medicines tab, swipe card towards the right | Green "Take" action triggers. Swiping left reveals Red "Delete" action with confirmation prompt. | **PASS** |
| **TC-07** | **Add Diary Entry with Location** | Open Diary tab, tap "+ New Note", input temp (98.6 °F), tap "Detect Location" | Location service captures reverse-geocoded city name. Entry appears chronologically at the top. | **PASS** |
| **TC-08** | **Search & Filter Medicines** | Type "Capsule" in the medicine search bar or click "Tablet" chip | FlatList re-renders immediately displaying only matching records. Empty state shown if no matches. | **PASS** |
| **TC-09** | **Export Local Data** | Navigate to Profile -> "Export Local Data as JSON" | Clean modal opens displaying raw JSON backup of medicines, logs, and profile records. | **PASS** |
| **TC-10** | **Reset Demo Data** | Navigate to Profile -> "Reset to Sample Demo Data", confirm prompt | All stored data safely resets back to initial university demonstration state. | **PASS** |

---

## 8. Project Report Outline

1. **Chapter 1: Introduction**
   - 1.1 Problem Statement & Background
   - 1.2 Motivation & Real-world Relevance
   - 1.3 Project Objectives
2. **Chapter 2: Literature Survey & Feasibility Study**
   - 2.1 Existing Healthcare Reminder Systems
   - 2.2 Technical Feasibility of Cross-Platform Frameworks
   - 2.3 Evaluation of Local-first Offline Architecture vs Pure Cloud
3. **Chapter 3: System Requirement Analysis**
   - 3.1 Functional Requirements (F1–F8)
   - 3.2 Non-Functional Requirements (Performance, Privacy, Offline Resilience)
   - 3.3 Hardware & Software Specifications
4. **Chapter 4: System Architecture & Design**
   - 4.1 High-Level Component Architecture (UI, Context, Storage, Hardware, Network)
   - 4.2 Database Schema Design (SQLite & AsyncStorage Data Models)
   - 4.3 Navigation State Flow Diagram
5. **Chapter 5: Implementation Details**
   - 5.1 React Native UI & Responsive Flexbox Layouts
   - 5.2 State Management via Custom React Hooks & Context API
   - 5.3 Local Notifications Scheduling Algorithm
   - 5.4 Hardware Device Integration (Camera, Image Picker, Location)
   - 5.5 Express REST Backend & Health Probes
6. **Chapter 6: Testing, CI/CD & Deployment**
   - 6.1 Unit & Integration Testing Strategy
   - 6.2 GitHub Actions Automated CI/CD Workflow
   - 6.3 Docker Containerization & Kubernetes Cluster Orchestration
7. **Chapter 7: Results & Discussion**
   - 7.1 Screen Flow Walkthrough
   - 7.2 Performance Analysis & Limitations
8. **Chapter 8: Conclusion & Future Enhancements**
   - 8.1 Summary of Contributions
   - 8.2 Future Scope (OCR Prescription Scanning, BLE Smart Pillbox Integration)

---

## 9. Viva Voce Questions & Answers

**Q1: Why did you choose React Native with Expo instead of native Android (Java/Kotlin)?**  
*Answer:* React Native with Expo allows cross-platform development with a single JavaScript/React codebase. It bridges native UI components, delivering native performance (60 FPS) while dramatically accelerating development through fast refresh, reusable component architecture, and standard web-friendly styling via Flexbox.

**Q2: How does the application store data, and how is it kept usable offline?**  
*Answer:* The application implements an offline-first architecture using `@react-native-async-storage/async-storage`. All medication schedules, dose histories, and health diary entries are written to and read from device storage first. If the optional backend REST API is available, data is asynchronously synced via the Fetch API; if offline, the app operates without interruption or data loss.

**Q3: How are reminder notifications scheduled? Can they work when the app is closed?**  
*Answer:* Local reminders are scheduled using `expo-notifications` with time-based triggers (`hour` and `minute` with `repeats: true`). On Android production/EAS builds, this interacts with the system alarm manager via the `SCHEDULE_EXACT_ALARM` permission configured in `app.json`. In development mode on Expo Go, OS power management and battery optimization can delay background triggers, which is why production APK builds are recommended for production deployments.

**Q4: How does State Management work in this app?**  
*Answer:* State management is structured cleanly using the React Context API (`HealthContext.js`) combined with custom hooks (`useHealth` and `useHealthData`). The context holds core arrays and functions (`addMedicine`, `recordDose`, `addDiaryEntry`), while `useHealthData` memoizes derived calculations (daily completion rates, 7-day adherence percentages, and next scheduled dose) using `useMemo` to prevent unnecessary re-renders.

**Q5: How did you implement swipe gestures for marking doses and deleting entries?**  
*Answer:* In `src/components/medicine/MedicineItemSwipeable.js`, we implemented swipe gestures using React Native's `PanResponder` and `Animated` API. Horizontal touch delta (`dx`) is captured: swiping right beyond a threshold triggers `onTakeDose()`, while swiping left reveals the destructive delete action. Smooth spring animations (`Animated.spring`) return the card to position if the swipe is released below the threshold.

**Q6: What role do Docker and Kubernetes play in a mobile app project?**  
*Answer:* Docker and Kubernetes are used to containerize and orchestrate the **backend REST API**. The backend handles synchronization, medicine retrieval, and healthchecks. Docker packages the Node.js runtime, SQLite database, and dependencies into an immutable container image. Kubernetes manages deployment scaling (configured for 2 pod replicas) and service routing, ensuring high availability with automatic health checks (`/api/health` probes).

**Q7: How does the GitHub Actions CI/CD pipeline ensure code quality?**  
*Answer:* The `.github/workflows/ci.yml` pipeline triggers automatically on every git `push` or `pull_request`. It sets up an Ubuntu container, installs dependencies, validates the Expo configuration (`npx expo-doctor`), runs automated backend tests (`test.js`), and builds the Docker container to ensure no breaking changes are introduced.

**Q8: How did you handle camera and location permissions?**  
*Answer:* We implemented runtime asynchronous permission requests using `ImagePicker.requestCameraPermissionsAsync()` and `Location.requestForegroundPermissionsAsync()`. If a user denies permission, the app catches the condition gracefully, displays an informative alert, and allows the user to proceed with full functionality—demonstrating non-blocking, fault-tolerant mobile architecture.

---

## 10. Medical & Project Disclaimer

> **Academic Notice:** MediCare is developed strictly as an educational mini-project for the BTech Computer Science & Engineering degree curriculum. It is intended for personal medication tracking and health journaling. It does not provide medical diagnoses, treatment recommendations, or automatic drug interaction alerts. Always consult qualified healthcare professionals for medical guidance.
