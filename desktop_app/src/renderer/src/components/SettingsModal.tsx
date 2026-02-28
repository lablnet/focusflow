import { useState } from 'react';
import { Plus, Trash } from 'lucide-react';
import { Modal, Input } from '@focusflow/ui';
import type { User } from 'firebase/auth';

interface SettingsModalProps {
    open: boolean;
    onClose: () => void;
    user: User | null;
    blocklist: string[];
    onAddBlock: (keyword: string) => void;
    onRemoveBlock: (keyword: string) => void;
    onLogout: () => void;
}

export default function SettingsModal({
    open,
    onClose,
    user,
    blocklist,
    onAddBlock,
    onRemoveBlock,
    onLogout,
}: SettingsModalProps) {
    const [newBlockKeyword, setNewBlockKeyword] = useState('');

    const handleAdd = () => {
        if (!newBlockKeyword.trim()) return;
        onAddBlock(newBlockKeyword.trim());
        setNewBlockKeyword('');
    };

    return (
        <Modal open={open} onClose={onClose} size="max-w-sm">
            <h2 className="text-lg font-bold mb-5 text-foreground">Settings</h2>

            <div className="space-y-5">
                {/* Distraction Blocker */}
                <div>
                    <label className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold block mb-2">
                        Distraction Blocker
                    </label>
                    <div className="space-y-3">
                        <div className="flex gap-2 items-center">
                            <Input
                                type="text"
                                value={newBlockKeyword}
                                onChange={(e) => setNewBlockKeyword(e.target.value)}
                                placeholder="Add keyword (e.g. reddit)"
                                className="flex-1 text-xs"
                                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                            />
                            <button
                                onClick={handleAdd}
                                className="w-10 h-10 shrink-0 flex items-center justify-center bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>
                        {blocklist.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {blocklist.map((k) => (
                                    <span
                                        key={k}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-secondary rounded-lg text-xs font-medium text-foreground border border-border"
                                    >
                                        {k}
                                        <button
                                            onClick={() => onRemoveBlock(k)}
                                            className="text-muted-foreground hover:text-destructive transition-colors"
                                        >
                                            <Trash className="w-3 h-3" />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Auto-capture info */}
                <div>
                    <label className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold block mb-2">
                        Auto-Capture
                    </label>
                    <div className="p-3 bg-secondary rounded-lg text-xs text-muted-foreground border border-border">
                        Fixed at 10-minute intervals (1-3 random snaps).
                    </div>
                </div>

                {/* User Profile */}
                <div>
                    <label className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold block mb-2">
                        User Profile
                    </label>
                    <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg border border-border">
                        {user?.photoURL ? (
                            <img src={user.photoURL} className="w-8 h-8 rounded-full shrink-0" alt="" />
                        ) : (
                            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-xs font-bold uppercase text-primary-foreground shrink-0">
                                {user?.email?.[0]}
                            </div>
                        )}
                        <div className="overflow-hidden min-w-0">
                            <p className="text-sm font-semibold truncate text-foreground">{user?.displayName || 'User'}</p>
                            <p className="text-[11px] text-muted-foreground truncate">{user?.email}</p>
                        </div>
                    </div>
                </div>

                <button
                    onClick={() => { onClose(); onLogout(); }}
                    className="w-full py-3 rounded-lg text-sm font-semibold bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
                >
                    Sign Out
                </button>
            </div>
        </Modal>
    );
}
