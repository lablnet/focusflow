import React, { useEffect, useState } from 'react';
import { Camera, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface SnapshotToastProps {
  status: 'capturing' | 'completed' | 'failed';
  url: string | null;
}

const SnapshotToast: React.FC<SnapshotToastProps> = ({ status, url }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (status === 'capturing') {
      setIsVisible(true);
    }

    if (status === 'completed' || status === 'failed') {
      const timer = setTimeout(() => setIsVisible(false), 10000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [status]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[100] animate-in slide-in-from-right-10 fade-in duration-500">
      <div className="bg-card/95 border border-border backdrop-blur-xl rounded-2xl p-4 shadow-2xl flex items-center gap-4 max-w-xs ring-1 ring-border">
        <div className="relative">
          {status === 'completed' && url ? (
            <img
              src={url}
              alt="Snap"
              className="w-16 h-10 object-cover rounded-lg shadow-inner ring-1 ring-border"
            />
          ) : (
            <div className="w-16 h-10 bg-secondary rounded-lg flex items-center justify-center">
              {status === 'capturing' ? (
                <Loader2 className="w-5 h-5 text-primary animate-spin" />
              ) : (
                <Camera className="w-5 h-5 text-muted-foreground" />
              )}
            </div>
          )}
          {status === 'completed' && (
            <div className="absolute -top-1 -right-1 bg-emerald-500 rounded-full p-0.5">
              <CheckCircle className="w-3 h-3 text-white" />
            </div>
          )}
          {status === 'failed' && (
            <div className="absolute -top-1 -right-1 bg-destructive rounded-full p-0.5">
              <AlertCircle className="w-3 h-3 text-white" />
            </div>
          )}
        </div>

        <div className="flex-1">
          <p className="text-sm font-bold text-foreground">
            {status === 'capturing' && 'Capturing Snap...'}
            {status === 'completed' && 'Snapshot Saved!'}
            {status === 'failed' && 'Capture Failed'}
          </p>
          <p className="text-[10px] text-muted-foreground uppercase tracking-tighter">
            {status === 'capturing' && 'Uploading to cloud'}
            {status === 'completed' && 'Logged to timeline'}
            {status === 'failed' && 'Error during capture'}
          </p>
        </div>

        <button
          onClick={() => setIsVisible(false)}
          className="text-muted-foreground hover:text-foreground p-1 transition-colors"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default SnapshotToast;
