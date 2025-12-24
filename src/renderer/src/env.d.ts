/// <reference types="vite/client" />

interface Window {
  api: {
    tracker: {
      start: (data: { userId: string }) => Promise<boolean>;
      stop: () => Promise<boolean>;
      getStatus: () => Promise<{
        isRunning: boolean;
        keystrokes: number;
        mouseMoves: number;
        currentWindow: string;
        focusScore: number;
        category: string;
      }>;
      getLogs: () => Promise<any[]>;
      deleteLog: (id: string) => Promise<boolean>;
      onSnapshot: (callback: (data: { status: 'capturing' | 'completed' | 'failed', url: string | null }) => void) => () => void;
      focusToggle: (active: boolean) => Promise<boolean>;
      getBlocklist: () => Promise<string[]>;
      updateBlocklist: (list: string[]) => Promise<boolean>;
      onDistraction: (callback: (data: { app: string, title: string }) => void) => () => void;
      onBlockerData: (callback: (data: { app: string, title: string }) => void) => () => void;
      hideBlocker: () => void;
    };
  };
}
