import { useState, useEffect } from 'react';
import { ShieldAlert, XCircle, ArrowLeft } from 'lucide-react';

interface BlockerOverlayProps {
  app?: string;
  title?: string;
  onDismiss?: () => void;
  onEndSession?: () => void;
}

const BlockerOverlay: React.FC<BlockerOverlayProps> = ({
  app: initialApp,
  title: initialTitle,
  onDismiss,
  onEndSession,
}) => {
  const [data, setData] = useState({ app: initialApp || '', title: initialTitle || '' });
  const isStandalone = window.location.hash === '#blocker=true';

  useEffect(() => {
    if (isStandalone) {
      return window.api.tracker.onBlockerData((newData) => {
        setData(newData);
      });
    }
    return () => { };
  }, [isStandalone]);

  const app = isStandalone ? data.app : initialApp;
  const title = isStandalone ? data.title : initialTitle;

  return (
    <div className="fixed inset-0 z-[9999] bg-background/90 backdrop-blur-xl flex items-center justify-center p-6 animate-in fade-in zoom-in duration-300">
      <div className="max-w-md w-full bg-card border-2 border-destructive/50 rounded-[2.5rem] p-10 shadow-[0_0_50px_rgba(244,63,94,0.2)] text-center relative overflow-hidden">
        {/* Background Glow */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-destructive/20 blur-[100px] rounded-full" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-primary/20 blur-[100px] rounded-full" />

        <div className="relative z-10 flex flex-col items-center">
          <div className="w-20 h-20 bg-destructive/10 rounded-3xl flex items-center justify-center mb-8 ring-1 ring-destructive/30">
            <ShieldAlert className="w-10 h-10 text-destructive animate-pulse" />
          </div>

          <h2 className="text-3xl font-black text-foreground mb-2 tracking-tight">Focus Interrupted!</h2>
          <p className="text-muted-foreground font-medium mb-8 leading-relaxed">
            You're currently in a <span className="text-foreground font-bold">Focus Session</span>.
            Access to{' '}
            <span className="text-destructive font-bold underline decoration-destructive/30 underline-offset-4">
              {app}
            </span>{' '}
            is restricted.
          </p>

          <div className="w-full p-4 bg-secondary/50 rounded-2xl border border-border mb-10 text-left">
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black mb-1">
              Detected Activity
            </p>
            <p className="text-xs text-foreground font-mono line-clamp-2">{title}</p>
          </div>

          <div className="flex flex-col w-full gap-3">
            <button
              onClick={() => {
                if (isStandalone) {
                  window.api.tracker.hideBlocker();
                } else if (onDismiss) {
                  onDismiss();
                }
              }}
              className="w-full py-4 bg-destructive hover:bg-destructive/90 text-destructive-foreground font-black rounded-2xl transition-all active:scale-95 shadow-lg shadow-destructive/20 flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              I'm Going Back to Work
            </button>
            <button
              onClick={() => {
                if (isStandalone) {
                  window.api.tracker.focusToggle(false);
                } else if (onEndSession) {
                  onEndSession();
                }
              }}
              className="w-full py-4 bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-foreground font-bold rounded-2xl transition-all flex items-center justify-center gap-2"
            >
              <XCircle className="w-4 h-4" />
              Stop Focus Session
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlockerOverlay;
