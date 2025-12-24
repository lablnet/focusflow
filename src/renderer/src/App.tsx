import { useRef, useState, useEffect } from 'react'
import { useAuth } from './context/AuthContext'
import Login from './components/Login'
import Timeline from './components/Timeline'
import SnapshotToast from './components/SnapshotToast'
import BlockerOverlay from './components/BlockerOverlay'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { Play, Square, Settings, Activity, Clock, MessageSquare, LogOut, LayoutDashboard, History, ShieldCheck, ShieldOff, Plus, Trash } from 'lucide-react'

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

function App() {
  const isBlockerMode = window.location.hash === '#blocker=true'
  const { user, loading, logout } = useAuth()
  const notifyTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'timeline'>('dashboard')
  const [time, setTime] = useState(0)
  const [isActive, setIsActive] = useState(false)
  const [memo, setMemo] = useState('Working on general tasks')
  const [showMemoModal, setShowMemoModal] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [snapshotNotify, setSnapshotNotify] = useState<{ status: 'capturing' | 'completed' | 'failed', url: string | null } | null>(null);
  const [isFocusSession, setIsFocusSession] = useState(false);
  const [distraction, setDistraction] = useState<{ app: string, title: string } | null>(null);
  const [blocklist, setBlocklist] = useState<string[]>([]);
  const [newBlockKeyword, setNewBlockKeyword] = useState('');
  const [stats, setStats] = useState({ 
    keystrokes: 0, 
    mouseMoves: 0, 
    currentWindow: '',
    focusScore: 0,
    category: 'Other'
  })

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isActive) {
      interval = setInterval(() => {
        setTime((t) => t + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isActive])

  useEffect(() => {
    const reminderInterval = setInterval(() => {
      if (isActive) {
        setShowMemoModal(true)
      }
    }, 20 * 60 * 1000)
    return () => clearInterval(reminderInterval)
  }, [isActive])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isActive) {
      interval = setInterval(async () => {
        const currentStats = await window.api.tracker.getStatus()
        setStats({
          keystrokes: currentStats.keystrokes,
          mouseMoves: currentStats.mouseMoves,
          currentWindow: currentStats.currentWindow,
          focusScore: currentStats.focusScore,
          category: currentStats.category
        })
      }, 5000)
    }
    return () => clearInterval(interval)
  }, [isActive])

  useEffect(() => {
    // Listen for snapshot notifications
    const unsubscribe = window.api.tracker.onSnapshot((data) => {
      console.log('Renderer: Snapshot notification received:', data.status);
      setSnapshotNotify(data);
      
      if (notifyTimeoutRef.current) clearTimeout(notifyTimeoutRef.current);

      if (data.status === 'completed' || data.status === 'failed') {
        notifyTimeoutRef.current = setTimeout(() => {
          setSnapshotNotify(null);
          notifyTimeoutRef.current = null;
        }, 12000);
      }
    });
    return () => {
      unsubscribe();
      if (notifyTimeoutRef.current) clearTimeout(notifyTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    // Listen for distractions
    const unsubscribe = window.api.tracker.onDistraction((data) => {
      setDistraction(data);
    });
    
    // Initial blocklist fetch
    window.api.tracker.getBlocklist().then(setBlocklist);
    
    return unsubscribe;
  }, []);

  const toggleTimer = async () => {
    if (isActive) {
      await window.api.tracker.stop()
      setIsActive(false)
    } else {
      if (!user) return
      await window.api.tracker.start({ userId: user.uid })
      setIsActive(true)
    }
  }

  const toggleFocusSession = async () => {
    const newState = !isFocusSession;
    const success = await window.api.tracker.focusToggle(newState);
    if (success !== undefined) setIsFocusSession(newState);
  }

  const handleAddBlock = async () => {
    if (!newBlockKeyword) return;
    const newList = [...blocklist, newBlockKeyword];
    await window.api.tracker.updateBlocklist(newList);
    setBlocklist(newList);
    setNewBlockKeyword('');
  }

  const handleRemoveBlock = async (keyword: string) => {
    const newList = blocklist.filter(k => k !== keyword);
    await window.api.tracker.updateBlocklist(newList);
    setBlocklist(newList);
  }

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!user && !isBlockerMode) {
    return <Login />
  }

  if (isBlockerMode) {
    return <BlockerOverlay 
      app={distraction?.app || 'Unknown'} 
      title={distraction?.title || 'Unknown Activity'} 
      onDismiss={() => {}} // Controlled by main process
      onEndSession={() => window.api.tracker.focusToggle(false)}
    />
  }

  return (
    <div className={cn(
      "min-h-screen transition-colors duration-1000 p-6 selection:bg-indigo-500/30",
      isFocusSession ? "bg-slate-950 ring-inset ring-[12px] ring-rose-900/10" : "bg-slate-950"
    )}>
      <header className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Clock className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">TimeTracker</h1>
        </div>
        <div className="flex items-center gap-2">
          <nav className="flex bg-slate-900 rounded-xl p-1 mr-2 border border-slate-800">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                activeTab === 'dashboard' ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"
              )}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              Dash
            </button>
            <button 
              onClick={() => setActiveTab('timeline')}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                activeTab === 'timeline' ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"
              )}
            >
              <History className="w-3.5 h-3.5" />
              Logs
            </button>
          </nav>
          <button 
            onClick={() => setShowSettings(true)}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors group">
            <Settings className="w-5 h-5 text-slate-400 group-hover:text-indigo-400 transition-colors" />
          </button>
          <button 
            onClick={() => logout()}
            className="p-2 hover:bg-rose-950/30 rounded-lg transition-colors group"
            title="Logout"
          >
            <LogOut className="w-5 h-5 text-slate-400 group-hover:text-rose-400 transition-colors" />
          </button>
        </div>
      </header>

      <main className="max-w-md mx-auto space-y-6">
        {activeTab === 'dashboard' ? (
          <>
            <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Clock className="w-24 h-24" />
              </div>
              
              <div className="flex flex-col items-center gap-6 relative z-10">
                <div className="text-6xl font-black font-mono tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-500">
                  {formatTime(time)}
                </div>
                
                <div className="flex gap-4 w-full">
                  <button
                    onClick={toggleTimer}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-bold transition-all active:scale-95 shadow-lg",
                      isActive 
                        ? "bg-rose-600 hover:bg-rose-500 shadow-rose-500/20" 
                        : "bg-indigo-600 hover:bg-indigo-500 shadow-indigo-500/20"
                    )}
                  >
                    {isActive ? <Square className="fill-current w-5 h-5" /> : <Play className="fill-current w-5 h-5" />}
                    {isActive ? 'Stop Tracking' : 'Start Tracking'}
                  </button>

                  <button
                    onClick={toggleFocusSession}
                    disabled={!isActive}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-bold transition-all active:scale-95 shadow-lg border-2",
                      !isActive && "opacity-50 cursor-not-allowed grayscale",
                      isFocusSession 
                        ? "bg-rose-950/40 border-rose-500 group" 
                        : "bg-slate-950/40 border-slate-800 hover:border-emerald-500 group"
                    )}
                  >
                    {isFocusSession ? (
                      <ShieldCheck className="w-5 h-5 text-rose-500 group-hover:scale-110 transition-transform" />
                    ) : (
                      <ShieldOff className="w-5 h-5 text-slate-500 group-hover:text-emerald-500" />
                    )}
                    <span className={isFocusSession ? "text-rose-500" : "text-slate-400 group-hover:text-emerald-500"}>
                      {isFocusSession ? 'Focus Active' : 'Enable Focus'}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 flex items-center justify-between group cursor-pointer hover:border-indigo-500/50 transition-all"
                onClick={() => setShowMemoModal(true)}>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-slate-800 rounded-xl group-hover:bg-indigo-900/30 transition-colors">
                  <MessageSquare className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Current Memo</p>
                  <p className="font-semibold text-slate-200 line-clamp-1">{memo}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 relative overflow-hidden">
                <div className="flex items-center gap-3 mb-2">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Focus Score</p>
                </div>
                <p className="text-xl font-bold text-slate-200">{stats.focusScore}%</p>
                <div className="mt-2 w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-emerald-500 h-full transition-all duration-1000" 
                    style={{ width: `${stats.focusScore}%` }}
                  />
                </div>
              </div>
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-2">
                  <Clock className="w-4 h-4 text-sky-400" />
                  <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Today</p>
                </div>
                <p className="text-xl font-bold text-slate-200">{formatTime(time)}</p>
                <p className="text-[10px] text-slate-500 font-medium">Session total</p>
              </div>
            </div>

            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-900/20 rounded-xl">
                  <Activity className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Category</p>
                  <p className="font-semibold text-slate-200">{stats.category}</p>
                </div>
              </div>
              <div className="text-xs font-bold px-3 py-1 bg-slate-800 rounded-full text-slate-400">
                {isActive ? 'Tracking' : 'Idle'}
              </div>
            </div>

            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 overflow-hidden">
              <div className="flex items-center gap-3 mb-3">
                <Activity className="w-4 h-4 text-amber-400" />
                <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Current Window</p>
              </div>
              <p className="text-sm font-medium text-slate-300 truncate">{stats.currentWindow || 'Idle'}</p>
            </div>
          </>
        ) : (
          <Timeline />
        )}
      </main>

      {snapshotNotify && (
        <SnapshotToast status={snapshotNotify.status} url={snapshotNotify.url} />
      )}

      {snapshotNotify && (
        <SnapshotToast status={snapshotNotify.status} url={snapshotNotify.url} />
      )}

      {/* Memo Modal */}
      {showMemoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 w-full max-w-sm shadow-2xl animate-in zoom-in-95 duration-200">
            <h2 className="text-2xl font-bold mb-2">Update Memo</h2>
            <p className="text-slate-400 text-sm mb-6">Tell us what you are working on right now.</p>
            
            <textarea
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors mb-6 h-32 resize-none"
              placeholder="E.g. Developing UI components..."
            />
            
            <div className="flex gap-3">
              <button 
                onClick={() => setShowMemoModal(false)}
                className="flex-1 py-3 rounded-xl font-bold bg-slate-800 hover:bg-slate-700 transition-colors">
                Cancel
              </button>
              <button 
                onClick={() => setShowMemoModal(false)}
                className="flex-1 py-3 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-500 transition-colors">
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 w-full max-w-sm shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Settings</h2>
              <button 
                onClick={() => setShowSettings(false)}
                className="text-slate-500 hover:text-white"
              >✕</button>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="text-xs text-slate-500 uppercase tracking-widest font-bold block mb-2">Distraction Blocker</label>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input 
                      type="text"
                      value={newBlockKeyword}
                      onChange={(e) => setNewBlockKeyword(e.target.value)}
                      placeholder="Add keyword (e.g. reddit)"
                      className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-indigo-500"
                    />
                    <button 
                      onClick={handleAddBlock}
                      className="p-2 bg-indigo-600 rounded-lg hover:bg-indigo-500 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {blocklist.map(k => (
                      <span key={k} className="flex items-center gap-1.5 px-2 py-1 bg-slate-800 rounded-md text-[10px] font-bold text-slate-300 border border-slate-700">
                        {k}
                        <button onClick={() => handleRemoveBlock(k)} className="hover:text-rose-500">
                          <Trash className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-500 uppercase tracking-widest font-bold block mb-2">Auto-Capture</label>
                <div className="p-3 bg-slate-950 rounded-xl text-xs text-slate-400 border border-slate-800">
                  Fixed at 10-minute intervals (1-3 random snaps).
                </div>
              </div>
              
              <div>
                <label className="text-xs text-slate-500 uppercase tracking-widest font-bold block mb-2">User Profile</label>
                <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-xl">
                  {user?.photoURL ? (
                    <img src={user?.photoURL} className="w-8 h-8 rounded-full" alt="" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold uppercase">
                      {user?.email?.[0]}
                    </div>
                  )}
                  <div className="overflow-hidden">
                    <p className="text-sm font-bold truncate">{user?.displayName || 'User'}</p>
                    <p className="text-[10px] text-slate-500 truncate">{user?.email}</p>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => { setShowSettings(false); logout(); }}
                className="w-full py-4 rounded-xl font-bold bg-rose-600/10 text-rose-500 hover:bg-rose-600/20 transition-colors">
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
