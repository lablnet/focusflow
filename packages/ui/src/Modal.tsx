import * as React from "react"
import { X } from "lucide-react"
import { cn } from "./utils"

export interface ModalProps {
    open: boolean;
    onClose: () => void;
    children: React.ReactNode;
    className?: string;
    size?: string;
    showClose?: boolean;
}

export function Modal({ open, onClose, children, className, size = "max-w-md", showClose = true }: ModalProps) {
    React.useEffect(() => {
        if (!open) return;
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 9999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '24px',
            }}
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            {/* Solid backdrop — pointer-events none so clicks fall through to parent's onClose handler */}
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.75)',
                    pointerEvents: 'none',
                }}
            />

            {/* Modal card */}
            <div
                className={cn(
                    "relative w-full bg-card text-card-foreground rounded-xl",
                    size,
                    className
                )}
                style={{
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
                    border: '1px solid hsl(var(--border))',
                    maxHeight: '85vh',
                    display: 'flex',
                    flexDirection: 'column',
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header bar with close button */}
                {showClose && (
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            padding: '8px 8px 0 8px',
                            flexShrink: 0,
                        }}
                    >
                        <button
                            onClick={onClose}
                            className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                            aria-label="Close"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                )}

                {/* Scrollable content */}
                <div
                    style={{
                        padding: showClose ? '4px 24px 24px 24px' : '24px 24px 24px 24px',
                        overflowY: 'auto',
                        flex: 1,
                    }}
                >
                    {children}
                </div>
            </div>
        </div>
    );
}
