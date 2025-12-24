import { ipcMain, app, BrowserWindow, shell } from 'electron';
import activeWindow from 'active-win';
import { uIOhook } from 'uiohook-napi';
import screenshot from 'screenshot-desktop';
import { db, storage } from './firebase';
import { collection, addDoc, serverTimestamp, deleteDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { categorizeWindow, calculateFocusScore } from './categorizer';
import * as fs from 'fs';
import * as path from 'path';

export class ActivityTracker {
  private keystrokes = 0;
  private mouseMoves = 0;
  private keystrokes_minute = 0;
  private mouseMoves_minute = 0;
  private currentWindow = '';
  private intervalTimer: NodeJS.Timeout | null = null;
  private windowCheckTimer: NodeJS.Timeout | null = null;
  private minuteTimer: NodeJS.Timeout | null = null;
  private isRunning = false;
  private userId = '';
  private currentApp = '';
  private activityBatches: any[] = [];
  private minuteStats: { timestamp: number, keys: number, mouse: number }[] = [];
  private storagePath: string;
  private blocklistPath: string;
  private localScreenshotsPath: string;
  private blocklist: string[] = ['reddit', 'facebook', 'twitter', 'instagram', 'youtube', 'netflix'];
  private isFocusSessionActive = false;
  private lastDistraction: string | null = null;
  private uiohookInitialized = false;
  private onDistraction: (app: string, title: string) => void;
  private onClearDistraction: () => void;

  constructor(
    onDistraction: (app: string, title: string) => void,
    onClearDistraction: () => void
  ) {
    this.onDistraction = onDistraction;
    this.onClearDistraction = onClearDistraction;
    this.storagePath = path.join(app.getPath('userData'), 'activity_logs.json');
    this.blocklistPath = path.join(app.getPath('userData'), 'blocklist.json');
    this.localScreenshotsPath = path.join(app.getPath('userData'), 'local_screenshots');
    
    if (!fs.existsSync(this.storagePath)) {
      fs.writeFileSync(this.storagePath, JSON.stringify([]));
    }

    if (!fs.existsSync(this.localScreenshotsPath)) {
      fs.mkdirSync(this.localScreenshotsPath, { recursive: true });
    }
// ... constructor continues ...
    if (fs.existsSync(this.blocklistPath)) {
      try {
        this.blocklist = JSON.parse(fs.readFileSync(this.blocklistPath, 'utf8'));
      } catch (e) {
        console.error('Tracker: Failed to load blocklist:', e);
      }
    } else {
      fs.writeFileSync(this.blocklistPath, JSON.stringify(this.blocklist));
    }

    this.setupIPC();
  }

  private isFirebaseConfigured() {
    return !!process.env.VITE_FIREBASE_API_KEY && !!process.env.VITE_FIREBASE_PROJECT_ID;
  }

  private setupListeners() {
    if (this.uiohookInitialized) return;
    try {
      uIOhook.on('keydown', () => {
        if (this.isRunning) {
          this.keystrokes++;
          this.keystrokes_minute++;
        }
      });
      uIOhook.on('mousemove', () => {
        if (this.isRunning) {
          this.mouseMoves++;
          this.mouseMoves_minute++;
        }
      });
      this.uiohookInitialized = true;
    } catch (e) {
      console.error('Tracker: Failed to setup uIOhook listeners:', e);
    }
  }

  private setupIPC() {
    ipcMain.handle('tracker:start', (_, { userId }: { userId: string }) => this.start(userId));
    ipcMain.handle('tracker:stop', () => this.stop());
    ipcMain.handle('tracker:status', () => ({
      isRunning: this.isRunning,
      keystrokes: this.keystrokes,
      mouseMoves: this.mouseMoves,
      currentWindow: `${this.currentApp} - ${this.currentWindow}`,
      focusScore: calculateFocusScore(this.keystrokes, this.mouseMoves, 10),
      category: this.activityBatches.length > 0 ? this.activityBatches[this.activityBatches.length - 1].category : 'Other',
      isFocusSessionActive: this.isFocusSessionActive
    }));
    
    // New Rize features
    ipcMain.handle('tracker:get-logs', () => this.getLocalLogs());
    ipcMain.handle('tracker:delete-log', (_, { id }: { id: string }) => this.deleteLog(id));

    // Focus Session & Blocklist IPCs
    ipcMain.handle('focus:toggle', (_, { active }: { active: boolean }) => {
      console.log('Tracker: Received focus:toggle signal - active:', active);
      this.isFocusSessionActive = active;
      if (!active) {
        console.log('Tracker: Clearing distractions and hiding blocker');
        this.emitClearDistraction();
      }
      return this.isFocusSessionActive;
    });

    ipcMain.handle('blocklist:get', () => this.blocklist);
    ipcMain.handle('blocklist:update', (_, { list }: { list: string[] }) => {
      this.blocklist = list;
      fs.writeFileSync(this.blocklistPath, JSON.stringify(this.blocklist));
      return true;
    });
  }

  private getLocalLogs() {
    try {
      const data = fs.readFileSync(this.storagePath, 'utf8');
      return JSON.parse(data);
    } catch (e) {
      return [];
    }
  }

  private async deleteLog(id: string) {
    try {
      // Delete from local
      let logs = this.getLocalLogs();
      logs = logs.filter((l: any) => l.id !== id);
      fs.writeFileSync(this.storagePath, JSON.stringify(logs));

      // Attempt delete from Firebase if we have ID
      if (this.isFirebaseConfigured()) {
        await deleteDoc(doc(db, 'activity_logs', id));
      }
      return true;
    } catch (e) {
      console.error('Failed to delete log:', e);
      return false;
    }
  }

  private saveLogLocally(log: any) {
    try {
      const logs = this.getLocalLogs();
      logs.unshift(log); // Newest first
      fs.writeFileSync(this.storagePath, JSON.stringify(logs.slice(0, 500))); // Keep last 500 for granular history
    } catch (e) {
      console.error('Failed to save log locally:', e);
    }
  }

  public async start(userId: string) {
    if (this.isRunning) return;
    this.userId = userId;

    this.setupListeners();
    try {
      uIOhook.start();
    } catch (e) {
      console.error('Tracker: Failed to start uIOhook:', e);
      // Continue without global hooks if it fails
    }

    this.isRunning = true;
    this.keystrokes = 0;
    this.mouseMoves = 0;
    this.keystrokes_minute = 0;
    this.mouseMoves_minute = 0;
    this.minuteStats = [];

    // Start granular minute tracker
    this.minuteTimer = setInterval(() => {
      this.minuteStats.push({
        timestamp: Date.now(),
        keys: this.keystrokes_minute,
        mouse: this.mouseMoves_minute
      });
      // Keep only last 20 minutes in buffer to avoid bloat (snapshots take them out)
      if (this.minuteStats.length > 20) this.minuteStats.shift();
      
      this.keystrokes_minute = 0;
      this.mouseMoves_minute = 0;
    }, 60000);

    // Start the 10-minute cycles
    this.scheduleSnapshots();
    this.intervalTimer = setInterval(() => this.scheduleSnapshots(), 10 * 60 * 1000);
    
    this.windowCheckTimer = setInterval(async () => {
      const getWin = typeof activeWindow === 'function' ? activeWindow : (activeWindow as any).default;
      const win = await getWin();
      
      if (win) {
        this.currentApp = win.owner.name;
        this.currentWindow = win.title;
        const category = categorizeWindow(win.owner.name, win.title);

        // Distraction Blocker Logic
        if (this.isFocusSessionActive) {
          const lowerApp = this.currentApp.toLowerCase();
          const lowerTitle = this.currentWindow.toLowerCase();
          const keyword = this.blocklist.find(k => 
            lowerApp.includes(k.toLowerCase()) || lowerTitle.includes(k.toLowerCase())
          );

          if (keyword) {
            this.emitDistraction(this.currentApp, this.currentWindow);
          } else {
            this.emitClearDistraction();
          }
        }
        
        this.activityBatches.push({
          app: win.owner.name,
          title: win.title,
          category,
          timestamp: Date.now()
        });
      }
    }, 5000);

    return true;
  }

  private emitDistraction(app: string, title: string) {
    const distractionId = `${app}-${title}`;
    if (this.lastDistraction === distractionId) return; // Prevent spam
    this.lastDistraction = distractionId;
    
    this.onDistraction(app, title);
    
    const windows = BrowserWindow.getAllWindows();
    windows.forEach(win => {
      win.webContents.send('distraction:detected', { app, title });
    });
  }

  private emitClearDistraction() {
    if (!this.lastDistraction) return;
    this.lastDistraction = null;
    this.onClearDistraction();
    
    const windows = BrowserWindow.getAllWindows();
    windows.forEach(win => {
      win.webContents.send('distraction:cleared');
    });
  }

  private scheduleSnapshots() {
    const count = Math.floor(Math.random() * 3) + 1;
    for (let i = 0; i < count; i++) {
      const delay = Math.random() * 10 * 60 * 1000;
      setTimeout(() => this.takeSnapshot(), delay);
    }
  }

  public stop() {
    this.isRunning = false;
    if (this.intervalTimer) clearInterval(this.intervalTimer);
    if (this.windowCheckTimer) clearInterval(this.windowCheckTimer);
    if (this.minuteTimer) clearInterval(this.minuteTimer);
    this.isFocusSessionActive = false;
    return false;
  }

  private async takeSnapshot() {
    if (!this.isRunning) return;

    try {
      const img = await screenshot({ format: 'png' });
      const timestamp = Date.now();
      
      // Save Locally first for instant UI response
      const localFilename = `${timestamp}.png`;
      const localFilePath = path.join(this.localScreenshotsPath, localFilename);
      fs.writeFileSync(localFilePath, img);
      
      // We'll use a custom media:// protocol to serve these
      const localUrl = `media://${localFilename}`;

      const filename = `screenshots/${this.userId}/${timestamp}.png`;
      const storageRef = ref(storage, filename);
      
      console.log('Main: Snapshot capturing start...');
      this.notifyCapture('capturing', null);
      shell.beep();

      let downloadURL = '';
      if (this.isFirebaseConfigured()) {
        await uploadBytes(storageRef, img);
        downloadURL = await getDownloadURL(storageRef);
      }

      const focusScore = calculateFocusScore(this.keystrokes, this.mouseMoves, 10);
      const mainCategory = this.activityBatches.length > 0 
        ? this.activityBatches[this.activityBatches.length - 1].category 
        : 'Other';

      const logData = {
        userId: this.userId,
        timestamp,
        keystrokes: this.keystrokes,
        mouseMoves: this.mouseMoves,
        focusScore,
        category: mainCategory,
        windowTitle: `${this.currentApp} - ${this.currentWindow}`,
        screenshotUrl: downloadURL || localUrl, // Use downloadURL if available, else local
        localUrl, // Always keep localUrl as fallback
        activities: this.activityBatches.slice(-5),
        minuteBreakdown: [...this.minuteStats] // Include per-minute stats
      };

      let firebaseId = '';
      if (this.isFirebaseConfigured()) {
        const docRef = await addDoc(collection(db, 'activity_logs'), {
          ...logData,
          timestamp: serverTimestamp(),
          activities: this.activityBatches.slice(-20)
        });
        firebaseId = docRef.id;
      }

      const logWithId = { ...logData, id: firebaseId || `local-${timestamp}` };
      this.saveLogLocally(logWithId);

      // Notify with localUrl for speed
      this.notifyCapture('completed', localUrl);
    } catch (error) {
      console.error('Failed to take snapshot:', error);
      this.notifyCapture('failed', null);
    }
  }

  private notifyCapture(status: 'capturing' | 'completed' | 'failed', url: string | null) {
    const windows = BrowserWindow.getAllWindows();
    windows.forEach(win => {
      win.webContents.send('snapshot:notification', { status, url });
    });
  }
}
