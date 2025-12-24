import { contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  tracker: {
    start: (data: { userId: string }) => electronAPI.ipcRenderer.invoke('tracker:start', data),
    stop: () => electronAPI.ipcRenderer.invoke('tracker:stop'),
    getStatus: () => electronAPI.ipcRenderer.invoke('tracker:status'),
    getLogs: () => electronAPI.ipcRenderer.invoke('tracker:get-logs'),
    deleteLog: (id: string) => electronAPI.ipcRenderer.invoke('tracker:delete-log', { id }),
    onSnapshot: (callback: (data: { status: 'capturing' | 'completed' | 'failed', url: string | null }) => void) => {
      const subscription = (_event: any, data: any) => callback(data);
      electronAPI.ipcRenderer.on('snapshot:notification', subscription);
      return () => electronAPI.ipcRenderer.removeListener('snapshot:notification', subscription);
    },
    focusToggle: (active: boolean) => electronAPI.ipcRenderer.invoke('focus:toggle', { active }),
    getBlocklist: () => electronAPI.ipcRenderer.invoke('blocklist:get'),
    updateBlocklist: (list: string[]) => electronAPI.ipcRenderer.invoke('blocklist:update', { list }),
    onDistraction: (callback: (data: { app: string, title: string }) => void) => {
      const subscription = (_event: any, data: any) => callback(data);
      electronAPI.ipcRenderer.on('distraction:detected', subscription);
      return () => electronAPI.ipcRenderer.removeListener('distraction:detected', subscription);
    },
    onBlockerData: (callback: (data: { app: string, title: string }) => void) => {
      const subscription = (_event: any, data: any) => callback(data);
      electronAPI.ipcRenderer.on('blocker:data', subscription);
      return () => electronAPI.ipcRenderer.removeListener('blocker:data', subscription);
    },
    hideBlocker: () => electronAPI.ipcRenderer.send('blocker:hide')
  }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
