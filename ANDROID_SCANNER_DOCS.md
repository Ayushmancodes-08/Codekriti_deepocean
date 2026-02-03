# CodeKriti 4.0 Verification App - "Vibe-Code" Guide

This documentation provides a complete, step-by-step guide to building the **CodeKriti Verifier** Android application. We will use **Expo (React Native)** because it allows you to build a high-quality native Android app using the React skills you already have, completely free and without complex Android Studio setups.

---

## 🏗️ 1. Technical Stack (The "Problem-Free" Stack)

*   **Framework:** [Expo](https://expo.dev/) (React Native) - The fastest way to build native apps.
*   **Language:** TypeScript - For type safety and better coding experience.
*   **Camera & Scanning:** `expo-camera` - Robust camera handling.
*   **Networking:** `axios` - For talking to your Google Script.
*   **UI Storage:** `@react-native-async-storage/async-storage` - To remember the admin PIN.
*   **Styling:** NativeWind (Tailwind CSS for React Native) OR standard StyleSheet (we'll use standard StyleSheet for simplicity and zero-config setup to ensure it works "out of the box").

---

## 🚀 2. Backend Setup (Google Apps Script)

Before scanning, the backend needs to know how to verify.
**Action:** Update your `GOOGLE_APPS_SCRIPT_INSTRUCTIONS.js` (or the actual script in Google Sheets).

### Add this new case to your `doPost(e)` function:

```javascript
/* INSIDE doPost(e) function... */
if (action === "VERIFY_TICKET") {
    const adminSecret = params.adminSecret;
    // 1. Simple Security Check
    // Ideally store this key in Script Properties, but hardcoded is fine for this scale
    if (adminSecret !== "YOUR_SECRET_PIN_1234") { 
        return createResponse({ status: 'error', message: 'Unauthorized: Invalid Admin PIN' });
    }

    const ticketId = payload.id; // The ID scanned from QR (e.g., CK-123456)
    
    // 2. Search All Registration Sheets
    const ss = getSpreadsheet();
    const sheets = ss.getSheets();
    let foundRow = null;
    let targetSheet = null;
    let participantData = {};

    // Iterate through all sheets to find the ID (since events are on diff sheets)
    for (let sheet of sheets) {
        if (sheet.getName() === "Newsletter") continue; // Skip misc sheets
        
        // Assuming ID is in Column B (Index 2), but let's check your specific layout
        // Based on script: ID is Col 2 (Index 1 in 0-based array? No, getValues is 2D array)
        // Let's grab all data first
        const data = sheet.getDataRange().getValues();
        // Row 1 is header. Start loop from Row 2 (index 1)
        for (let i = 1; i < data.length; i++) {
            if (data[i][1] == ticketId) { // Column B is ID
                foundRow = i + 1; // 1-based row index
                targetSheet = sheet;
                participantData = {
                    name: data[i][3], // Col D: Leader Name
                    event: sheet.getName(),
                    team: data[i][2], // Col C: Team Name
                    status: data[i][12] // Column M (13th column)? 
                    // Wait, let's verify column index from your script:
                    // 1:Timestamp, 2:ID, 3:Team, 4:Leader, 5:Email, 6:Phone, 7:College, 8:Year, 9:Branch, 10:Members, 11:Subscribe, 12:Signature
                    // So Status isn't in the original appendRow! We need to ADD a Status column.
                };
                
                // Check if we have a "Status" column header. If not, add verification logic
                const headerRow = data[0];
                if (!headerRow.includes("Check-in Status")) {
                   // This implies we need to handle legacy sheets or update them manually first
                   // For this script, we'll assume Verified is stored in Column M (Index 12) if it exists, or we append it.
                }
                
                // Let's check the current status in Col 13 (Index 12)
                const currentStatus = data[i][12]; 
                
                if (currentStatus === "VERIFIED") {
                     return createResponse({ 
                        status: 'warning', 
                        message: 'ALREADY VERIFIED', 
                        data: { ...participantData, verifiedAt: data[i][13] } 
                    });
                } else {
                    // Mark as Verified
                    targetSheet.getRange(foundRow, 13).setValue("VERIFIED"); // Col M
                    targetSheet.getRange(foundRow, 14).setValue(new Date().toISOString()); // Col N (Time)
                    return createResponse({ 
                        status: 'success', 
                        message: 'ACCESS GRANTED', 
                        data: participantData 
                    });
                }
            }
        }
    }

    return createResponse({ status: 'error', message: 'TICKET NOT FOUND' });
}
```

> **IMPORTANT:** In your Google Sheet, ensure you have space for columns M (Status) and N (Time) or add headers manually: "Check-in Status", "Time".

---

## 📱 3. Android App Steps ("Vibe-Code" Instructions)

### A. Environment Setup
1.  **Install Node.js** (You already have this).
2.  **Install Expo CLI** (globally):
    ```bash
    npm install -g expo-cli
    ```
3.  **Create Project**:
    ```bash
    npx create-expo-app CodeKritiScanner --template blank-typescript
    cd CodeKritiScanner
    ```
4.  **Install Dependencies**:
    ```bash
    npx expo install expo-camera expo-barcode-scanner axios @react-native-async-storage/async-storage expo-linear-gradient lucide-react-native
    ```

### B. The Code (Copy & Paste)

Here is the complete code. You can put everything in `App.tsx` for a single-file "vibe-code" solution, or split it if you want. We will provide a refined **Single File Solution** for maximum speed.

**File:** `App.tsx`

```tsx
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal, ActivityIndicator, Vibration, StatusBar, InputModeOptions, TextInput } from 'react-native';
import { Camera, CameraView, BarcodeScanningResult } from 'expo-camera'; // Note: Newer expo-camera versions use CameraView
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import { Scan, X, History, LogOut, Zap, ZapOff, CheckCircle, AlertTriangle, ShieldAlert } from 'lucide-react-native';

// --- CONFIGURATION ---
const GOOGLE_SCRIPT_URL = "YOUR_DEPLOYED_WEB_APP_URL_HERE"; // <--- REPLACE THIS
const ADMIN_PIN = "2026"; // Simple Local PIN
const API_SECRET = "YOUR_SECRET_PIN_1234"; // Must match Backend

// --- TYPES ---
type ScanResult = 'success' | 'warning' | 'error' | null;
type ScanData = {
  name?: string;
  event?: string;
  team?: string;
  message?: string;
  verifiedAt?: string;
};

export default function App() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  
  // Flashlight & UI State
  const [flash, setFlash] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [loading, setLoading] = useState(false);

  // Result Modal Data
  const [resultStatus, setResultStatus] = useState<ScanResult>(null);
  const [resultData, setResultData] = useState<ScanData>({});
  
  // History
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    // Check Permission & Auth
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
      
      const savedAuth = await AsyncStorage.getItem('isAuth');
      if (savedAuth === 'true') setIsAuthenticated(true);
      
      const savedHistory = await AsyncStorage.getItem('scanHistory');
      if (savedHistory) setHistory(JSON.parse(savedHistory));
    })();
  }, []);

  const handleLogin = async () => {
    if (pinInput === ADMIN_PIN) {
      setIsAuthenticated(true);
      await AsyncStorage.setItem('isAuth', 'true');
    } else {
      alert("Invalid Access Code");
      setPinInput('');
    }
  };

  const handleLogout = async () => {
    setIsAuthenticated(false);
    await AsyncStorage.removeItem('isAuth');
  };

  const onScan = async ({ data }: {data: string}) => {
    if (scanned || loading) return;
    setScanned(true);
    setLoading(true);
    Vibration.vibrate(50);

    try {
      // 1. Parse QR Data
      let parsedData;
      try {
        parsedData = JSON.parse(data); // Expecting { id: "...", ... }
      } catch (e) {
         // Fallback for plain text ID
         parsedData = { id: data };
      }

      const ticketId = parsedData.id || data;

      // 2. Call API
      const response = await axios.post(GOOGLE_SCRIPT_URL, {
        action: 'VERIFY_TICKET',
        adminSecret: API_SECRET,
        payload: { id: ticketId }
      });

      const res = response.data;
      
      // 3. Handle Response
      if (res.status === 'success') {
        setResultStatus('success');
        setResultData(res.data);
        addToHistory(res.data, 'success', ticketId);
        Vibration.vibrate([0, 100, 50, 100]); // Success pattern
      } else if (res.status === 'warning') {
        setResultStatus('warning');
        setResultData(res.data);
         addToHistory(res.data, 'warning', ticketId);
        Vibration.vibrate(500); // Long buzz
      } else {
        throw new Error(res.message || "Invalid Ticket");
      }

    } catch (error: any) {
      setResultStatus('error');
      setResultData({ message: error.message || "Scan Failed" });
       Vibration.vibrate([0, 200, 100, 200]); // Error pattern
    } finally {
      setLoading(false);
    }
  };

  const addToHistory = async (data: any, status: string, id: string) => {
    const newItem = {
      id,
      name: data.name || "Unknown",
      time: new Date().toLocaleTimeString(),
      status
    };
    const newHistory = [newItem, ...history].slice(0, 50); // Keep last 50
    setHistory(newHistory);
    await AsyncStorage.setItem('scanHistory', JSON.stringify(newHistory));
  }

  const resetScan = () => {
    setScanned(false);
    setResultStatus(null);
    setResultData({});
  };

  // --- RENDER HELPERS ---
  if (hasPermission === null) return <View style={styles.container}><Text>Requesting permission...</Text></View>;
  if (hasPermission === false) return <View style={styles.container}><Text>No access to camera</Text></View>;

  // --- LOGIN SCREEN ---
  if (!isAuthenticated) {
    return (
      <View style={styles.loginContainer}>
        <StatusBar barStyle="light-content" />
        <LinearGradient colors={['#020c1b', '#0a192f']} style={styles.background} />
        <ShieldAlert color="#64ffda" size={64} style={{marginBottom: 20}} />
        <Text style={styles.title}>CODEKRITI <Text style={{color: '#64ffda'}}>VERIFIER</Text></Text>
        <Text style={styles.subtitle}>SECURE ACCESS REQUIRED</Text>
        
        <TextInput 
          style={styles.input}
          placeholder="ENTER PIN"
          placeholderTextColor="#8892b0"
          value={pinInput}
          onChangeText={setPinInput}
          keyboardType="numeric"
          secureTextEntry
          maxLength={4}
        />
        
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>UNLOCK SYSTEM</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // --- MAIN SCANNER ---
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* CAMERA LAYER */}
      <CameraView 
        style={StyleSheet.absoluteFillObject}
        facing="back"
        enableTorch={flash}
        onBarcodeScanned={scanned ? undefined : onScan}
        barcodeScannerSettings={{
            barcodeTypes: ["qr", "pdf417"],
        }}
      />

      {/* OVERLAY */}
      <View style={styles.overlay}>
        <View style={styles.header}>
            <Text style={styles.headerText}>CodeKriti Scanner</Text>
            <TouchableOpacity onPress={handleLogout}><LogOut color="#fff" size={24} /></TouchableOpacity>
        </View>

        <View style={styles.scanFrame}>
            <View style={[styles.corner, styles.tl]} />
            <View style={[styles.corner, styles.tr]} />
            <View style={[styles.corner, styles.bl]} />
            <View style={[styles.corner, styles.br]} />
            {loading && <ActivityIndicator size="large" color="#64ffda" />}
        </View>

        <View style={styles.controls}>
             <TouchableOpacity style={styles.iconBtn} onPress={() => setFlash(!flash)}>
                {flash ? <Zap color="#64ffda" size={28}/> : <ZapOff color="#fff" size={28}/>}
             </TouchableOpacity>
             
             <TouchableOpacity style={[styles.iconBtn, styles.manualBtn]} onPress={() => setShowHistory(true)}>
                <History color="#0a192f" size={28} />
             </TouchableOpacity>
        </View>
      </View>

      {/* RESULT MODAL */}
      <Modal visible={!!resultStatus} transparent animationType="slide">
        <View style={styles.modalOverlay}>
            <View style={[styles.modalCard, 
                resultStatus === 'success' ? {borderColor: '#64ffda'} : 
                resultStatus === 'warning' ? {borderColor: '#f59e0b'} : {borderColor: '#ef4444'}
            ]}>
                {resultStatus === 'success' && <CheckCircle size={80} color="#64ffda" />}
                {resultStatus === 'warning' && <AlertTriangle size={80} color="#f59e0b" />}
                {resultStatus === 'error' && <X size={80} color="#ef4444" />}

                <Text style={styles.resultTitle}>
                    {resultStatus === 'success' ? "ACCESS GRANTED" : 
                     resultStatus === 'warning' ? "ALREADY SCANNED" : "INVALID TICKET"}
                </Text>

                {resultData.name && <Text style={styles.resultName}>{resultData.name}</Text>}
                {resultData.event && <Text style={styles.resultInfo}>{resultData.event}</Text>}
                {resultData.message && <Text style={styles.resultMsg}>{resultData.message}</Text>}

                <TouchableOpacity style={styles.closeBtn} onPress={resetScan}>
                    <Text style={styles.closeBtnText}>SCAN NEXT</Text>
                </TouchableOpacity>
            </View>
        </View>
      </Modal>

      {/* HISTORY MODAL */}
      <Modal visible={showHistory} animationType="slide" presentationStyle="pageSheet">
         <View style={styles.historyContainer}>
            <View style={styles.historyHeader}>
                <Text style={styles.historyTitle}>Recent Scans</Text>
                <TouchableOpacity onPress={() => setShowHistory(false)}>
                    <X color="#fff" size={24} />
                </TouchableOpacity>
            </View>
            {history.map((item, idx) => (
                <View key={idx} style={styles.historyItem}>
                    <View style={{flexDirection:'row', alignItems:'center'}}>
                        <View style={[styles.dot, {backgroundColor: item.status === 'success' ? '#64ffda' : 'orange'}]} />
                        <View>
                            <Text style={styles.hName}>{item.name}</Text>
                            <Text style={styles.hId}>{item.id}</Text>
                        </View>
                    </View>
                    <Text style={styles.hTime}>{item.time}</Text>
                </View>
            ))}
         </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  loginContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  background: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#fff', letterSpacing: 2 },
  subtitle: { color: '#8892b0', fontSize: 12, marginBottom: 40, letterSpacing: 1 },
  input: { width: '80%', height: 50, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 10, color: '#fff', textAlign: 'center', fontSize: 24, letterSpacing: 8, marginBottom: 20, borderWidth: 1, borderColor: 'rgba(100, 255, 218, 0.3)' },
  button: { width: '80%', height: 50, backgroundColor: 'rgba(100, 255, 218, 0.1)', justifyContent: 'center', alignItems: 'center', borderRadius: 10, borderWidth: 1, borderColor: '#64ffda' },
  buttonText: { color: '#64ffda', fontWeight: 'bold', paddingHorizontal: 20 },
  
  overlay: { flex: 1, justifyContent: 'space-between', padding: 20, paddingTop: 50 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerText: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  
  scanFrame: { height: 250, width: 250, alignSelf: 'center', justifyContent: 'center', position: 'relative' },
  corner: { position: 'absolute', width: 40, height: 40, borderColor: '#64ffda', borderWidth: 4 },
  tl: { top: 0, left: 0, borderRightWidth: 0, borderBottomWidth: 0 },
  tr: { top: 0, right: 0, borderLeftWidth: 0, borderBottomWidth: 0 },
  bl: { bottom: 0, left: 0, borderRightWidth: 0, borderTopWidth: 0 },
  br: { bottom: 0, right: 0, borderLeftWidth: 0, borderTopWidth: 0 },
  
  controls: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginBottom: 30 },
  iconBtn: { padding: 15, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 50 },
  manualBtn: { backgroundColor: '#64ffda' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalCard: { width: '100%', backgroundColor: '#112240', borderRadius: 20, padding: 30, alignItems: 'center', borderWidth: 2 },
  resultTitle: { fontSize: 28, fontWeight: 'bold', color: '#fff', marginVertical: 20, textAlign: 'center' },
  resultName: { fontSize: 22, color: '#ccd6f6', fontWeight: 'bold' },
  resultInfo: { fontSize: 16, color: '#8892b0', marginTop: 5 },
  resultMsg: { fontSize: 14, color: '#ef4444', marginTop: 10 },
  closeBtn: { marginTop: 30, backgroundColor: '#64ffda', paddingVertical: 15, paddingHorizontal: 40, borderRadius: 10 },
  closeBtnText: { color: '#0a192f', fontWeight: 'bold', fontSize: 16 },

  historyContainer: { flex: 1, backgroundColor: '#020c1b', padding: 20 },
  historyHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 20 },
  historyTitle: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  historyItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.1)' },
  dot: { width: 10, height: 10, borderRadius: 5, marginRight: 10 },
  hName: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  hId: { color: '#8892b0', fontSize: 12 },
  hTime: { color: '#8892b0' }
});
```

---

## 📲 4. Running the App

1.  **Start the server:**
    ```bash
    npx expo start
    ```
2.  **On your Android Phone:**
    *   Download **"Expo Go"** from the Play Store.
    *   Scan the QR code shown in your terminal.
    *   **Vibe-Check:** The app will load immediately on your phone. You can edit code and see changes instantly.

## 📦 5. Building an APK (For real installation)

Once you are happy and want a standalone APK file to install without Expo Go:

1.  **Install EAS CLI:**
    ```bash
    npm install -g eas-cli
    ```
2.  **Login:**
    ```bash
    eas login
    ```
3.  **Configure:**
    ```bash
    eas build:configure
    ```
4.  **Build:**
    ```bash
    eas build -p android --profile preview
    ```
    *   This will take about 15mins in the cloud and give you a download link for an `.apk` file.

---

That's it! You have a fully functional, dark-mode, animated verification scanner linked to your Google Sheets.
