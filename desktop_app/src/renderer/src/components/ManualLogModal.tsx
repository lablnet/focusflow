import { useState } from 'react';
import { PenLine, Calendar, Clock, Tag, FileText } from 'lucide-react';
import { Modal, Input, Textarea } from '@focusflow/ui';
import { useManualLog, type ManualLogEntry } from '../hooks/useManualLog';

interface ManualLogModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export default function ManualLogModal({ open, onClose, onSuccess }: ManualLogModalProps) {
    const { addManualLog } = useManualLog();
    const [form, setForm] = useState<ManualLogEntry>({
        date: new Date().toISOString().split('T')[0],
        hours: 1,
        memo: '',
        category: 'Development',
    });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const categories = [
        'Development', 'Design', 'Meeting', 'Research',
        'Documentation', 'Testing', 'DevOps', 'Other',
    ];

    const handleSubmit = async () => {
        if (!form.date || form.hours <= 0) {
            setError('Please provide a valid date and hours.');
            return;
        }
        if (form.hours > 24) {
            setError('Hours cannot exceed 24 per day.');
            return;
        }

        setSubmitting(true);
        setError('');

        try {
            const result = await addManualLog(form);
            if (result) {
                setForm({
                    date: new Date().toISOString().split('T')[0],
                    hours: 1,
                    memo: '',
                    category: 'Development',
                });
                onSuccess?.();
                onClose();
            } else {
                setError('Failed to save manual log. Please try again.');
            }
        } catch {
            setError('An unexpected error occurred.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Modal open={open} onClose={onClose} size="max-w-sm">
            {/* Header */}
            <div className="flex items-center gap-3 mb-5">
                <div className="p-2 bg-violet-500/10 rounded-lg shrink-0">
                    <PenLine className="w-4 h-4 text-violet-500" />
                </div>
                <div>
                    <h2 className="text-lg font-bold text-foreground leading-tight">Log Hours Manually</h2>
                    <p className="text-[11px] text-muted-foreground">Track time without the auto-tracker</p>
                </div>
            </div>

            <div className="space-y-3">
                {/* Date */}
                <div>
                    <label className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mb-1 flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> Date
                    </label>
                    <Input
                        type="date"
                        value={form.date}
                        onChange={(e) => setForm({ ...form, date: e.target.value })}
                        max={new Date().toISOString().split('T')[0]}
                    />
                </div>

                {/* Hours */}
                <div>
                    <label className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mb-1 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Hours
                    </label>
                    <Input
                        type="number"
                        value={form.hours}
                        onChange={(e) => setForm({ ...form, hours: parseFloat(e.target.value) || 0 })}
                        min="0.25"
                        max="24"
                        step="0.25"
                        placeholder="e.g. 2.5"
                    />
                </div>

                {/* Category */}
                <div>
                    <label className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mb-1 flex items-center gap-1">
                        <Tag className="w-3 h-3" /> Category
                    </label>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setForm({ ...form, category: cat })}
                                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${form.category === cat
                                        ? 'bg-primary text-primary-foreground'
                                        : 'bg-secondary text-muted-foreground hover:text-foreground'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Notes */}
                <div>
                    <label className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mb-1 flex items-center gap-1">
                        <FileText className="w-3 h-3" /> Notes
                    </label>
                    <Textarea
                        value={form.memo}
                        onChange={(e) => setForm({ ...form, memo: e.target.value })}
                        placeholder="What did you work on?"
                        className="h-16 text-sm"
                    />
                </div>

                {/* Error */}
                {error && <p className="text-xs text-destructive font-medium">{error}</p>}

                {/* Actions */}
                <div className="flex gap-2 pt-1">
                    <button
                        onClick={onClose}
                        className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={submitting}
                        className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-violet-600 hover:bg-violet-500 text-white transition-colors disabled:opacity-50"
                    >
                        {submitting ? 'Saving...' : 'Log Hours'}
                    </button>
                </div>
            </div>
        </Modal>
    );
}
