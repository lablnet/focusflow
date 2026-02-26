import { Tray, Menu, BrowserWindow, app } from 'electron';
import { join } from 'path';

let tray: Tray | null = null;

export function createTray(mainWindow: BrowserWindow) {
  const iconPath = join(__dirname, '../../resources/icon.png');
  tray = new Tray(iconPath);

  const contextMenu = Menu.buildFromTemplate([
    { 
      label: 'Show App', 
      click: () => mainWindow.show() 
    },
    { type: 'separator' },
    { 
      label: 'Quit', 
      click: () => {
        app.quit();
      } 
    }
  ]);

  tray.setToolTip('TimeTracker');
  tray.setContextMenu(contextMenu);

  tray.on('double-click', () => {
    mainWindow.show();
  });

  return tray;
}
