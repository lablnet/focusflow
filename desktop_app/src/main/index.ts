import 'dotenv/config'
import { app, shell, BrowserWindow, ipcMain, systemPreferences, dialog, protocol, net, screen } from 'electron'
import { join } from 'path'
import { pathToFileURL } from 'url'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { createTray } from './tray'
import { ActivityTracker } from './tracker'

let blockerWindow: BrowserWindow | null = null;
let tracker: ActivityTracker | null = null;

export function showBlocker(appName: string, title: string) {
  if (blockerWindow) {
    const primaryDisplay = screen.getPrimaryDisplay();
    const { width, height } = primaryDisplay.bounds;
    
    blockerWindow.setSize(width, height);
    blockerWindow.setPosition(0, 0);
    blockerWindow.webContents.send('blocker:data', { app: appName, title });
    blockerWindow.setAlwaysOnTop(true, 'screen-saver');
    blockerWindow.show();
    // Avoid native fullscreen to prevent workspace switch animations
  }
}

export function hideBlocker() {
  if (blockerWindow) {
    blockerWindow.hide();
    blockerWindow.setFullScreen(false);
  }
}

function createWindow(): BrowserWindow {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      backgroundThrottling: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  // Allow Firebase Auth popups to stay within the app
  mainWindow.webContents.setWindowOpenHandler((details) => {
    console.log('Main Process: Request to open window:', details.url);
    
    // Check for Firebase Auth handler or Google OAuth domains
    const url = details.url.toLowerCase();
    const isStorage = url.includes('firebasestorage.googleapis.com');
    const isAuthBase = url.includes('firebaseapp.com') || url.includes('google.com') || url.includes('googleapis.com');
    
    const isAuthUrl = isAuthBase && !isStorage;

    if (isAuthUrl) {
      console.log('Main Process: Allowing Auth Popup window');
      return { 
        action: 'allow',
        overrideBrowserWindowOptions: {
          width: 600,
          height: 800,
          autoHideMenuBar: true,
          webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            sandbox: false
          }
        }
      }
    }
    
    console.log('Main Process: Denying window and opening externally');
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  return mainWindow
}

function createBlockerWindow() {
  blockerWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    show: false,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    skipTaskbar: true,
    resizable: false,
    movable: false,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  // No default native fullscreen
  blockerWindow.setFullScreenable(false);
  
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    blockerWindow.loadURL(`${process.env['ELECTRON_RENDERER_URL']}#blocker=true`)
  } else {
    blockerWindow.loadFile(join(__dirname, '../renderer/index.html'), { hash: 'blocker=true' })
  }

  blockerWindow.on('closed', () => {
    blockerWindow = null;
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  console.log('Main Process: app.whenReady() triggered');
  console.log('Main Process: Env Key Check:', !!process.env.VITE_FIREBASE_API_KEY);

  // Register media protocol for local snapshots
  protocol.handle('media', (request) => {
    try {
      const url = new URL(request.url);
      const filename = url.hostname; // in media://1234.png, 1234.png is the host
      const screenshotsPath = join(app.getPath('userData'), 'local_screenshots');
      const filePath = join(screenshotsPath, filename);
      console.log('Main: Serving media:', filePath);
      return net.fetch(pathToFileURL(filePath).toString());
    } catch (e) {
      console.error('Main: Media protocol error:', e);
      return new Response('Not found', { status: 404 });
    }
  })

  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
    
    // Set User Agent for every window (including popups)
    const chromeUA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36';
    window.webContents.setUserAgent(chromeUA);
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  // Check Accessibility for macOS
  if (process.platform === 'darwin') {
    // ... logic remains same ...
    const isTrusted = systemPreferences.isTrustedAccessibilityClient(false)
    if (!isTrusted) {
      dialog.showMessageBox({
        type: 'warning',
        title: 'Accessibility Permission Required',
        message: 'This application requires Accessibility permissions to track keystrokes and mouse movements globally. Please grant access in System Settings.',
        buttons: ['Open System Settings', 'Later']
      }).then((result) => {
        if (result.response === 0) {
          shell.openExternal('x-apple.systempreferences:com.apple.preference.security?Privacy_Accessibility')
        }
      })
    }
  }

  tracker = new ActivityTracker(
    (app, title) => showBlocker(app, title),
    () => hideBlocker()
  )
  const mainWindow = createWindow()
  createTray(mainWindow)
  createBlockerWindow()

  // Blocker IPCs from Renderer
  ipcMain.on('blocker:hide', () => hideBlocker());
  ipcMain.on('blocker:show', (_, data) => showBlocker(data.app, data.title));

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
  app.on('will-quit', () => {
    if (tracker) tracker.stop();
  });

  app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
