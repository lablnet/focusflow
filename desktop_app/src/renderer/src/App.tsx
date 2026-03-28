import { useRef, useState, useEffect } from 'react'
import { useAuth } from '@focusflow/hooks'

import Login from './components/Login'
import AppLayout from './components/AppLayout'
import DashboardView from './components/DashboardView'
import Timeline from './components/Timeline'
import SnapshotToast from './components/SnapshotToast'
import BlockerOverlay from './components/BlockerOverlay'
import MemoModal from './components/MemoModal'
import SettingsModal from './components/SettingsModal'
import ManualLogModal from './components/ManualLogModal'

import { useTimer } from './hooks/useTimer'
import { useTrackerStats } from './hooks/useTrackerStats'
import { useFocusSession } from './hooks/useFocusSession'
import { useBlocklist } from './hooks/useBlocklist'

function App() {
  const isBlockerMode = window.location.hash === '#blocker=true'
  const { user, loading, logout, isAuthenticated } = useAuth()
  const notifyTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const [activeTab, setActiveTab] = useState<string>('dashboard')
  const [memo, setMemo] = useState('Working on general tasks')
  const [showMemoModal, setShowMemoModal] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showManualLog, setShowManualLog] = useState(false)
  const [snapshotNotify, setSnapshotNotify] = useState<{
    status: 'capturing' | 'completed' | 'failed'
    url: string | null
  } | null>(null)
  const [distraction, setDistraction] = useState<{ app: string; title: string } | null>(null)

  const { time, isActive, formatTime, setIsActive } = useTimer()
  const stats = useTrackerStats(isActive)
  const { isFocusSession, toggleFocus } = useFocusSession()
  const { blocklist, addKeyword, removeKeyword } = useBlocklist()

  // Memo reminder every 20 min
  useEffect(() => {
    const interval = setInterval(() => {
      if (isActive) setShowMemoModal(true)
    }, 20 * 60 * 1000)
    return () => clearInterval(interval)
  }, [isActive])

  // Snapshot notifications
  useEffect(() => {
    const unsubscribe = window.api.tracker.onSnapshot((data) => {
      setSnapshotNotify(data)
      if (notifyTimeoutRef.current) clearTimeout(notifyTimeoutRef.current)
      if (data.status === 'completed' || data.status === 'failed') {
        notifyTimeoutRef.current = setTimeout(() => {
          setSnapshotNotify(null)
          notifyTimeoutRef.current = null
        }, 12000)
      }
    })
    return () => {
      unsubscribe()
      if (notifyTimeoutRef.current) clearTimeout(notifyTimeoutRef.current)
    }
  }, [])

  // Distraction detection
  useEffect(() => {
    const unsubscribe = window.api.tracker.onDistraction(setDistraction)
    return unsubscribe
  }, [])

  // Handle nav tab changes
  const handleTabChange = (id: string) => {
    if (id === 'manual') {
      setShowManualLog(true)
    } else {
      setActiveTab(id)
    }
  }

  // Timer toggle
  const toggleTimer = async () => {
    if (isActive) {
      await window.api.tracker.stop()
      setIsActive(false)
    } else {
      if (!user) return
      await window.api.tracker.start({ userId: String(user.id) })
      setIsActive(true)
    }
  }

  // Loading
  if (loading) {
    return (
      <div className="h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  // Auth check
  if (!isAuthenticated && !isBlockerMode) return <Login />

  // Blocker overlay
  if (isBlockerMode) {
    return (
      <BlockerOverlay
        app={distraction?.app || 'Unknown'}
        title={distraction?.title || 'Unknown Activity'}
        onDismiss={() => { }}
        onEndSession={() => window.api.tracker.focusToggle(false)}
      />
    )
  }

  return (
    <AppLayout
      activeTab={activeTab}
      onTabChange={handleTabChange}
      onSettingsClick={() => setShowSettings(true)}
      onLogout={logout}
      isFocusSession={isFocusSession}
    >
      {activeTab === 'dashboard' ? (
        <DashboardView
          time={time}
          isActive={isActive}
          isFocusSession={isFocusSession}
          formatTime={formatTime}
          onToggleTimer={toggleTimer}
          onToggleFocus={toggleFocus}
          memo={memo}
          onMemoClick={() => setShowMemoModal(true)}
          focusScore={stats.focusScore}
          category={stats.category}
          currentWindow={stats.currentWindow}
        />
      ) : (
        <Timeline />
      )}

      {snapshotNotify && <SnapshotToast status={snapshotNotify.status} url={snapshotNotify.url} />}

      <MemoModal
        open={showMemoModal}
        onClose={() => setShowMemoModal(false)}
        memo={memo}
        onMemoChange={setMemo}
      />

      <SettingsModal
        open={showSettings}
        onClose={() => setShowSettings(false)}
        user={user}
        blocklist={blocklist}
        onAddBlock={addKeyword}
        onRemoveBlock={removeKeyword}
        onLogout={logout}
      />

      <ManualLogModal
        open={showManualLog}
        onClose={() => setShowManualLog(false)}
      />
    </AppLayout>
  )
}

export default App
