import React, { useEffect, useState } from 'react';
import { Trash2, ExternalLink, Clock, Layers, ChevronRight, ChevronDown, Activity, Keyboard, MousePointer } from 'lucide-react';

interface MinuteStat {
  timestamp: number;
  keys: number;
  mouse: number;
}

interface ActivityLog {
  id: string;
  timestamp: number;
  windowTitle: string;
  category: string;
  focusScore: number;
  screenshotUrl: string;
  localUrl?: string;
  keystrokes: number;
  mouseMoves: number;
  minuteBreakdown?: MinuteStat[];
}

interface GroupedActivity {
  intervalStart: number;
  logs: ActivityLog[];
  mainApp: string;
  totalKeys: number;
  totalMouse: number;
  avgFocus: number;
}

const Timeline: React.FC = () => {
  const [groupedLogs, setGroupedLogs] = useState<GroupedActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedBuckets, setExpandedBuckets] = useState<Record<number, boolean>>({});

  const fetchLogs = async () => {
    const localLogs: ActivityLog[] = await window.api.tracker.getLogs();
    
    // Group by 10-minute intervals
    const groups: Record<number, ActivityLog[]> = {};
    const interval = 10 * 60 * 1000;

    localLogs.forEach(log => {
      const bucket = Math.floor(log.timestamp / interval) * interval;
      if (!groups[bucket]) groups[bucket] = [];
      groups[bucket].push(log);
    });

    const processedGroups: GroupedActivity[] = Object.entries(groups).map(([timestamp, logs]) => {
      const ts = parseInt(timestamp);
      const totalKeys = logs.reduce((sum, l) => sum + l.keystrokes, 0);
      const totalMouse = logs.reduce((sum, l) => sum + l.mouseMoves, 0);
      const avgFocus = Math.round(logs.reduce((sum, l) => sum + l.focusScore, 0) / logs.length);
      
      const appCounts: Record<string, number> = {};
      logs.forEach(l => {
        const app = l.windowTitle.split(' - ')[0];
        appCounts[app] = (appCounts[app] || 0) + 1;
      });
      const mainApp = Object.entries(appCounts).sort((a,b) => b[1] - a[1])[0][0];

      return {
        intervalStart: ts,
        logs: logs.sort((a,b) => b.timestamp - a.timestamp),
        mainApp,
        totalKeys,
        totalMouse,
        avgFocus
      };
    }).sort((a,b) => b.intervalStart - a.intervalStart);

    setGroupedLogs(processedGroups);
    setLoading(false);
  };

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleDeleteBucket = async (logs: ActivityLog[]) => {
    const promises = logs.map(l => window.api.tracker.deleteLog(l.id));
    await Promise.all(promises);
    fetchLogs();
  };

  const toggleExpand = (ts: number) => {
    setExpandedBuckets(prev => ({ ...prev, [ts]: !prev[ts] }));
  };

  if (loading) return (
    <div className="flex justify-center p-12">
      <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (groupedLogs.length === 0) return (
    <div className="text-center p-12 bg-slate-950/30 rounded-3xl border border-dashed border-slate-800">
      <Layers className="w-12 h-12 text-slate-700 mx-auto mb-4" />
      <p className="text-slate-500 font-medium">No activity logged yet.</p>
    </div>
  );

  return (
    <div className="space-y-6">
      {groupedLogs.map((group) => (
        <div key={group.intervalStart} className="relative pl-6 border-l-2 border-slate-800 pb-2">
          <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-slate-800 border-4 border-slate-950 ring-2 ring-indigo-500/20" />
          
          <div className="flex justify-between items-center mb-3">
             <div className="flex items-center gap-2">
               <Clock className="w-3.5 h-3.5 text-slate-500" />
               <h3 className="text-xs font-black text-slate-400 tracking-widest uppercase">
                 {new Date(group.intervalStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                 {" - "}
                 {new Date(group.intervalStart + 10 * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
               </h3>
             </div>
             <button 
                onClick={() => handleDeleteBucket(group.logs)}
                className="text-slate-600 hover:text-rose-500 transition-colors p-1"
                title="Delete this interval"
             >
                <Trash2 className="w-3.5 h-3.5" />
             </button>
          </div>

          <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl overflow-hidden hover:border-indigo-500/30 transition-all">
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center text-indigo-400 border border-slate-700/50">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-200">Activity: {group.mainApp}</h4>
                  <div className="flex items-center gap-4 mt-1">
                    <div className="flex items-center gap-1.5 grayscale opacity-60">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span className="text-[10px] text-slate-300 font-bold">{group.avgFocus}% Focus</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-bold">
                      {group.logs.length} Snaps
                    </span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => toggleExpand(group.intervalStart)}
                className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-500"
              >
                {expandedBuckets[group.intervalStart] ? <ChevronDown /> : <ChevronRight />}
              </button>
            </div>

            {expandedBuckets[group.intervalStart] && (
              <div className="px-4 pb-6 space-y-6">
                {/* Minute-by-Minute Breakdown */}
                <div className="bg-slate-950/50 rounded-xl p-4 border border-slate-800/50">
                  <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Clock className="w-3 h-3" />
                    Minute-by-Minute Activity
                  </h5>
                  <div className="space-y-3">
                    {group.logs[0]?.minuteBreakdown?.map((min, idx) => (
                      <div key={idx} className="flex items-center gap-4 group/min">
                        <span className="text-[10px] font-mono text-slate-500 w-12 shrink-0">
                          {new Date(min.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        
                        <div className="flex-1 grid grid-cols-2 gap-4">
                          {/* Keystrokes Bar */}
                          <div className="space-y-1">
                            <div className="flex justify-between items-center text-[9px] font-bold">
                              <span className="flex items-center gap-1 text-slate-400">
                                <Keyboard className="w-2.5 h-2.5" /> {min.keys} keys
                              </span>
                            </div>
                            <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                              <div 
                                className="bg-indigo-500 h-full transition-all duration-500" 
                                style={{ width: `${Math.min((min.keys / 100) * 100, 100)}%` }}
                              />
                            </div>
                          </div>

                          {/* Mouse Bar */}
                          <div className="space-y-1">
                            <div className="flex justify-between items-center text-[9px] font-bold">
                              <span className="flex items-center gap-1 text-slate-400">
                                <MousePointer className="w-2.5 h-2.5" /> {min.mouse} moves
                              </span>
                            </div>
                            <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                              <div 
                                className="bg-sky-500 h-full transition-all duration-500" 
                                style={{ width: `${Math.min((min.mouse / 300) * 100, 100)}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {(!group.logs[0]?.minuteBreakdown || group.logs[0].minuteBreakdown.length === 0) && (
                      <p className="text-[10px] text-slate-600 italic">No granular data for this period.</p>
                    )}
                  </div>
                </div>

                {/* Snapshots Grid */}
                <div className="grid grid-cols-3 gap-2">
                  {group.logs.map((log) => (
                    <div key={log.id} className="group relative aspect-video bg-slate-950 rounded-lg overflow-hidden border border-slate-800 hover:border-indigo-500/50 transition-all">
                      <img src={log.localUrl || log.screenshotUrl} className="w-full h-full object-cover" alt="Snap" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-1 transition-all">
                        <button 
                          onClick={() => window.open(log.screenshotUrl, '_blank')}
                          className="p-1.5 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-md"
                        >
                          <ExternalLink className="w-3.5 h-3.5 text-white" />
                        </button>
                        <span className="text-[8px] font-black text-white uppercase tracking-tighter">
                          {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {!expandedBuckets[group.intervalStart] && group.logs.length > 0 && (
              <div className="px-4 pb-4 flex gap-2">
                {group.logs.slice(0, 3).map(l => (
                   <img key={l.id} src={l.localUrl || l.screenshotUrl} className="w-8 h-6 object-cover rounded border border-slate-800 opacity-40 shrink-0" alt="" />
                ))}
                {group.logs.length > 3 && (
                  <div className="text-[10px] text-slate-600 flex items-center">+ {group.logs.length - 3} more</div>
                )}
                {group.logs[0]?.minuteBreakdown && (
                  <div className="ml-auto flex items-center gap-1 text-[10px] font-black text-indigo-500/60 uppercase tracking-widest">
                    <Activity className="w-3 h-3" />
                    Granular
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Timeline;
