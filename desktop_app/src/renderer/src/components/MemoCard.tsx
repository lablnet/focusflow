import { MessageSquare } from 'lucide-react';

interface MemoCardProps {
    memo: string;
    onClick: () => void;
}

export default function MemoCard({ memo, onClick }: MemoCardProps) {
    return (
        <button
            className="w-full bg-card border border-border rounded-xl px-4 py-3 flex items-center gap-3 group cursor-pointer hover:border-primary/50 transition-all text-left"
            onClick={onClick}
        >
            <div className="p-2 bg-secondary rounded-lg group-hover:bg-primary/10 transition-colors shrink-0">
                <MessageSquare className="w-4 h-4 text-primary" />
            </div>
            <div className="min-w-0">
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                    Memo
                </p>
                <p className="text-sm font-medium text-foreground truncate">{memo}</p>
            </div>
        </button>
    );
}
