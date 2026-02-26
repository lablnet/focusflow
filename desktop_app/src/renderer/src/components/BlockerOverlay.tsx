import { useState, useEffect } from 'react';
import { ShieldAlert, XCircle, ArrowLeft } from 'lucide-react';

interface BlockerOverlayProps {
  app?: string;
  title?: string;
  onDismiss?: () => void;
  onEndSession?: () => void;
}

const BlockerOverlay: React.FC<BlockerOverlayProps> = ({ app: initialApp, title: initialTitle, onDismiss, onEndSession }) => {
  const [data, setData] = useState({ app: initialApp || '', title: initialTitle || '' });
  const isStandalone = window.location.hash === '#blocker=true';

  useEffect(() => {
    if (isStandalone) {
      return window.api.tracker.onBlockerData((newData) => {
        setData(newData);
      });
    }
    return () => {}; // return empty cleanup if not standalone
  }, [isStandalone]);

  const app = isStandalone ? data.app : initialApp;
  const title = isStandalone ? data.title : initialTitle;
  return (
    <div className="fixed inset-0 z-[9999] bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-6 animate-in fade-in zoom-in duration-300">
      <div className="max-w-md w-full bg-slate-900 border-2 border-rose-500/50 rounded-[2.5rem] p-10 shadow-[0_0_50px_rgba(244,63,94,0.2)] text-center relative overflow-hidden">
        {/* Background Glow */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-rose-500/20 blur-[100px] rounded-full" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-indigo-500/20 blur-[100px] rounded-full" />

        <div className="relative z-10 flex flex-col items-center">
          <div className="w-20 h-20 bg-rose-500/10 rounded-3xl flex items-center justify-center mb-8 ring-1 ring-rose-500/30">
            <ShieldAlert className="w-10 h-10 text-rose-500 animate-pulse" />
          </div>

          <h2 className="text-3xl font-black text-white mb-2 tracking-tight">Focus Interrupted!</h2>
          <p className="text-slate-400 font-medium mb-8 leading-relaxed">
            You're currently in a <span className="text-white font-bold">Focus Session</span>. 
            Access to <span className="text-rose-400 font-bold underline decoration-rose-500/30 underline-offset-4">{app}</span> is restricted.
          </p>

          <div className="w-full p-4 bg-slate-950/50 rounded-2xl border border-slate-800 mb-10 text-left">
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black mb-1">Detected Activity</p>
            <p className="text-xs text-slate-300 font-mono line-clamp-2">{title}</p>
          </div>

          <div className="flex flex-col w-full gap-3">
            <button 
              onClick={() => {
                console.log('Blocker: Dismiss clicked');
                if (isStandalone) {
                  window.api.tracker.hideBlocker();
                } else if (onDismiss) {
                  onDismiss();
                }
              }}
              className="w-full py-4 bg-rose-600 hover:bg-rose-500 text-white font-black rounded-2xl transition-all active:scale-95 shadow-lg shadow-rose-600/20 flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              I'm Going Back to Work
            </button>
            <button 
              onClick={() => {
                console.log('Blocker: End Session clicked');
                if (isStandalone) {
                  window.api.tracker.focusToggle(false);
                } else if (onEndSession) {
                  onEndSession();
                }
              }}
              className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-2"
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
