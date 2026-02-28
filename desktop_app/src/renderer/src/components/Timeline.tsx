import React, { useEffect, useState } from 'react';
import {
  Trash2,
  ExternalLink,
  Clock,
  Layers,
  ChevronRight,
  ChevronDown,
  Activity,
  Keyboard,
  MousePointer,
  PenLine,
  Monitor,
} from 'lucide-react';
import { Badge, ProgressBar, EmptyState } from '@focusflow/ui';

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
  isManual?: boolean;
  manualHours?: number;
  memo?: string;
}

interface GroupedActivity {
  intervalStart: number;
  logs: ActivityLog[];
  mainApp: string;
  totalKeys: number;
  totalMouse: number;
  avgFocus: number;
  hasManual: boolean;
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

    localLogs.forEach((log) => {
      const bucket = Math.floor(log.timestamp / interval) * interval;
      if (!groups[bucket]) groups[bucket] = [];
      groups[bucket].push(log);
    });

    const processedGroups: GroupedActivity[] = Object.entries(groups)
      .map(([timestamp, logs]) => {
        const ts = parseInt(timestamp);
        const totalKeys = logs.reduce((sum, l) => sum + l.keystrokes, 0);
        const totalMouse = logs.reduce((sum, l) => sum + l.mouseMoves, 0);
        const autoLogs = logs.filter((l) => !l.isManual);
        const avgFocus =
          autoLogs.length > 0
            ? Math.round(autoLogs.reduce((sum, l) => sum + l.focusScore, 0) / autoLogs.length)
            : 0;
        const hasManual = logs.some((l) => l.isManual);

        const appCounts: Record<string, number> = {};
        logs.forEach((l) => {
          const app = l.isManual ? '✏️ Manual' : l.windowTitle.split(' - ')[0];
          appCounts[app] = (appCounts[app] || 0) + 1;
        });
        const mainApp = Object.entries(appCounts).sort((a, b) => b[1] - a[1])[0][0];

        return {
          intervalStart: ts,
          logs: logs.sort((a, b) => b.timestamp - a.timestamp),
          mainApp,
          totalKeys,
          totalMouse,
          avgFocus,
          hasManual,
        };
      })
      .sort((a, b) => b.intervalStart - a.intervalStart);

    setGroupedLogs(processedGroups);
    setLoading(false);
  };

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleDeleteBucket = async (logs: ActivityLog[]) => {
    const promises = logs.map((l) => window.api.tracker.deleteLog(l.id));
    await Promise.all(promises);
    fetchLogs();
  };

  const toggleExpand = (ts: number) => {
    setExpandedBuckets((prev) => ({ ...prev, [ts]: !prev[ts] }));
  };

  if (loading)
    return (
      <div className="flex justify-center p-12">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );

  if (groupedLogs.length === 0)
    return (
      <EmptyState
        icon={<Layers className="w-12 h-12" />}
        title="No activity logged yet."
        description="Start tracking or log hours manually to see your timeline."
      />
    );

  return (
    <div className="space-y-6">
      {groupedLogs.map((group) => (
        <div key={group.intervalStart} className="relative pl-6 border-l-2 border-border pb-2">
          <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-secondary border-4 border-background ring-2 ring-primary/20" />

          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-muted-foreground" />
              <h3 className="text-xs font-black text-muted-foreground tracking-widest uppercase">
                {new Date(group.intervalStart).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
                {' - '}
                {new Date(group.intervalStart + 10 * 60000).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </h3>
              {group.hasManual && (
                <Badge variant="manual">
                  <PenLine className="w-2.5 h-2.5" />
                  Manual
                </Badge>
              )}
            </div>
            <button
              onClick={() => handleDeleteBucket(group.logs)}
              className="text-muted-foreground/50 hover:text-destructive transition-colors p-1"
              title="Delete this interval"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/30 transition-all">
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center text-primary border border-border">
                  {group.hasManual && group.logs.every((l) => l.isManual) ? (
                    <PenLine className="w-5 h-5" />
                  ) : (
                    <Activity className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-foreground">Activity: {group.mainApp}</h4>
                  <div className="flex items-center gap-4 mt-1">
                    {group.avgFocus > 0 && (
                      <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span className="text-[10px] text-muted-foreground font-bold">
                          {group.avgFocus}% Focus
                        </span>
                      </div>
                    )}
                    <span className="text-[10px] text-muted-foreground font-bold">
                      {group.logs.filter((l) => !l.isManual).length} Snaps
                    </span>
                    {group.hasManual && (
                      <span className="text-[10px] text-violet-500 font-bold">
                        {group.logs.filter((l) => l.isManual).length} Manual
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <button
                onClick={() => toggleExpand(group.intervalStart)}
                className="p-2 hover:bg-secondary rounded-lg transition-colors text-muted-foreground"
              >
                {expandedBuckets[group.intervalStart] ? <ChevronDown /> : <ChevronRight />}
              </button>
            </div>

            {expandedBuckets[group.intervalStart] && (
              <div className="px-4 pb-6 space-y-6">
                {/* Manual Logs Section */}
                {group.logs.some((l) => l.isManual) && (
                  <div className="bg-violet-500/5 rounded-xl p-4 border border-violet-500/20">
                    <h5 className="text-[10px] font-black text-violet-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <PenLine className="w-3 h-3" />
                      Manually Logged
                    </h5>
                    {group.logs
                      .filter((l) => l.isManual)
                      .map((log) => (
                        <div key={log.id} className="flex items-center gap-3 py-2">
                          <Badge variant="manual" className="text-[8px]">
                            {log.manualHours}h
                          </Badge>
                          <span className="text-xs text-foreground font-medium">
                            {log.memo || log.category}
                          </span>
                          <Badge variant="outline" className="ml-auto text-[8px]">
                            {log.category}
                          </Badge>
                        </div>
                      ))}
                  </div>
                )}

                {/* Minute-by-Minute Breakdown */}
                <div className="bg-secondary/30 rounded-xl p-4 border border-border">
                  <h5 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Clock className="w-3 h-3" />
                    Minute-by-Minute Activity
                  </h5>
                  <div className="space-y-3">
                    {group.logs[0]?.minuteBreakdown?.map((min, idx) => (
                      <div key={idx} className="flex items-center gap-4">
                        <span className="text-[10px] font-mono text-muted-foreground w-12 shrink-0">
                          {new Date(min.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>

                        <div className="flex-1 grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <div className="flex justify-between items-center text-[9px] font-bold">
                              <span className="flex items-center gap-1 text-muted-foreground">
                                <Keyboard className="w-2.5 h-2.5" /> {min.keys} keys
                              </span>
                            </div>
                            <ProgressBar
                              value={min.keys}
                              max={100}
                              variant="indigo"
                              size="sm"
                            />
                          </div>

                          <div className="space-y-1">
                            <div className="flex justify-between items-center text-[9px] font-bold">
                              <span className="flex items-center gap-1 text-muted-foreground">
                                <MousePointer className="w-2.5 h-2.5" /> {min.mouse} moves
                              </span>
                            </div>
                            <ProgressBar
                              value={min.mouse}
                              max={300}
                              variant="sky"
                              size="sm"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    {(!group.logs[0]?.minuteBreakdown ||
                      group.logs[0].minuteBreakdown.length === 0) && (
                        <p className="text-[10px] text-muted-foreground italic">
                          No granular data for this period.
                        </p>
                      )}
                  </div>
                </div>

                {/* Snapshots Grid */}
                <div className="grid grid-cols-3 gap-2">
                  {group.logs
                    .filter((l) => !l.isManual)
                    .map((log) => (
                      <div
                        key={log.id}
                        className="group relative aspect-video bg-secondary rounded-lg overflow-hidden border border-border hover:border-primary/50 transition-all"
                      >
                        <img
                          src={log.localUrl || log.screenshotUrl}
                          className="w-full h-full object-cover"
                          alt="Snap"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-1 transition-all">
                          <button
                            onClick={() => window.open(log.screenshotUrl, '_blank')}
                            className="p-1.5 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-md"
                          >
                            <ExternalLink className="w-3.5 h-3.5 text-white" />
                          </button>
                          <span className="text-[8px] font-black text-white uppercase tracking-tighter">
                            {new Date(log.timestamp).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                              second: '2-digit',
                            })}
                          </span>
                          <div className="flex items-center gap-1">
                            <Badge variant="auto" className="text-[7px]">
                              <Monitor className="w-2 h-2" />
                              Auto
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {!expandedBuckets[group.intervalStart] && group.logs.length > 0 && (
              <div className="px-4 pb-4 flex gap-2">
                {group.logs
                  .filter((l) => !l.isManual)
                  .slice(0, 3)
                  .map((l) => (
                    <img
                      key={l.id}
                      src={l.localUrl || l.screenshotUrl}
                      className="w-8 h-6 object-cover rounded border border-border opacity-40 shrink-0"
                      alt=""
                    />
                  ))}
                {group.logs.filter((l) => !l.isManual).length > 3 && (
                  <div className="text-[10px] text-muted-foreground flex items-center">
                    + {group.logs.filter((l) => !l.isManual).length - 3} more
                  </div>
                )}
                {group.hasManual && (
                  <Badge variant="manual" className="ml-1 text-[8px]">
                    <PenLine className="w-2 h-2" />
                    Manual
                  </Badge>
                )}
                {group.logs[0]?.minuteBreakdown && (
                  <div className="ml-auto flex items-center gap-1 text-[10px] font-black text-primary/60 uppercase tracking-widest">
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
