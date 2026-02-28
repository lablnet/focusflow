import { Modal, Textarea } from '@focusflow/ui';

interface MemoModalProps {
    open: boolean;
    onClose: () => void;
    memo: string;
    onMemoChange: (v: string) => void;
}

export default function MemoModal({ open, onClose, memo, onMemoChange }: MemoModalProps) {
    return (
        <Modal open={open} onClose={onClose} size="max-w-sm">
            <h2 className="text-lg font-bold mb-1 text-foreground">Update Memo</h2>
            <p className="text-muted-foreground text-xs mb-4">Tell us what you are working on right now.</p>

            <Textarea
                value={memo}
                onChange={(e) => onMemoChange(e.target.value)}
                className="mb-4 h-24 text-sm"
                placeholder="E.g. Developing UI components..."
            />

            <div className="flex gap-2">
                <button
                    onClick={onClose}
                    className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
                >
                    Cancel
                </button>
                <button
                    onClick={onClose}
                    className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                    Save
                </button>
            </div>
        </Modal>
    );
}
