import { create } from 'zustand';

interface TimerState {
    isActive: boolean;
    seconds: number;
    startTime: string | null;
    task: string | null;
    setIsActive: (isActive: boolean) => void;
    setSeconds: (seconds: number) => void;
    setTask: (task: string | null) => void;
    resetTimer: () => void;
}

export const useTimerStore = create<TimerState>((set) => ({
    isActive: false,
    seconds: 0,
    startTime: null,
    task: null,

    setIsActive: (isActive) => set({ isActive }),
    setSeconds: (seconds) => set({ seconds }),
    setTask: (task) => set({ task }),
    resetTimer: () =>
        set({
            isActive: false,
            seconds: 0,
            startTime: null,
            task: null,
        }),
}));
