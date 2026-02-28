import TimerCard from './TimerCard';
import MemoCard from './MemoCard';
import StatsGrid from './StatsGrid';

interface DashboardViewProps {
    time: number;
    isActive: boolean;
    isFocusSession: boolean;
    formatTime: (s: number) => string;
    onToggleTimer: () => void;
    onToggleFocus: () => void;
    memo: string;
    onMemoClick: () => void;
    focusScore: number;
    category: string;
    currentWindow: string;
}

export default function DashboardView({
    time,
    isActive,
    isFocusSession,
    formatTime,
    onToggleTimer,
    onToggleFocus,
    memo,
    onMemoClick,
    focusScore,
    category,
    currentWindow,
}: DashboardViewProps) {
    return (
        <>
            <TimerCard
                time={time}
                isActive={isActive}
                isFocusSession={isFocusSession}
                formatTime={formatTime}
                onToggleTimer={onToggleTimer}
                onToggleFocus={onToggleFocus}
            />
            <MemoCard memo={memo} onClick={onMemoClick} />
            <StatsGrid
                focusScore={focusScore}
                time={time}
                formatTime={formatTime}
                category={category}
                currentWindow={currentWindow}
                isActive={isActive}
            />
        </>
    );
}
