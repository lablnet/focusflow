import { Play, Square, ShieldCheck, ShieldOff, Clock } from 'lucide-react';
import { cn } from '@focusflow/ui';

interface TimerCardProps {
    time: number;
    isActive: boolean;
    isFocusSession: boolean;
    formatTime: (s: number) => string;
    onToggleTimer: () => void;
    onToggleFocus: () => void;
}

export default function TimerCard({
    time,
    isActive,
    isFocusSession,
    formatTime,
    onToggleTimer,
    onToggleFocus,
}: TimerCardProps) {
    return (
        <div className="bg-card border border-border rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-5">
                <Clock className="w-20 h-20 text-foreground" />
            </div>

            <div className="flex items-center gap-6 relative z-10">
                {/* Timer display */}
                <div className="text-4xl font-black font-mono tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-foreground to-muted-foreground">
                    {formatTime(time)}
                </div>

                {/* Actions */}
                <div className="flex gap-2 ml-auto">
                    <button
                        onClick={onToggleTimer}
                        className={cn(
                            "flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95 shadow-sm",
                            isActive
                                ? "bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                                : "bg-primary hover:bg-primary/90 text-primary-foreground"
                        )}
                    >
                        {isActive ? (
                            <Square className="fill-current w-4 h-4" />
                        ) : (
                            <Play className="fill-current w-4 h-4" />
                        )}
                        {isActive ? 'Stop' : 'Start'}
                    </button>

                    <button
                        onClick={onToggleFocus}
                        disabled={!isActive}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95 border",
                            !isActive && "opacity-40 cursor-not-allowed",
                            isFocusSession
                                ? "bg-destructive/10 border-destructive text-destructive"
                                : "bg-secondary border-border text-muted-foreground hover:border-emerald-500 hover:text-emerald-500"
                        )}
                    >
                        {isFocusSession ? (
                            <ShieldCheck className="w-4 h-4" />
                        ) : (
                            <ShieldOff className="w-4 h-4" />
                        )}
                        {isFocusSession ? 'Focus On' : 'Focus'}
                    </button>
                </div>
            </div>
        </div>
    );
}
