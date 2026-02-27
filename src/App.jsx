import { useState } from 'react'
import { Sidebar } from './components/layout/Sidebar.jsx'
import { Topbar } from './components/layout/Topbar.jsx'
import { Dashboard } from './components/pages/Dashboard.jsx'
import { MemoryStore } from './components/pages/MemoryStore.jsx'
import { DecisionEngine } from './components/pages/DecisionEngine.jsx'
import { Inspector } from './components/pages/Inspector.jsx'
import { AddMemory } from './components/pages/AddMemory.jsx'
import { Analytics } from './components/pages/Analytics.jsx'
import { useMemories } from './hooks/useMemories.js'
import { C } from './utils/theme.js'

export default function App() {
  const [page, setPage]               = useState('dashboard')
  const [collapsed, setCollapsed]     = useState(false)
  const [inspectTarget, setInspectTarget] = useState(null)

  const {
    memories, loading, error, apiMode,
    addMemory, deleteMemory, refresh,
  } = useMemories()

  // Navigate to inspector with a pre-selected memory
  const openInspector = (memory) => {
    setInspectTarget(memory)
    setPage('inspector')
  }

  const renderPage = () => {
    switch (page) {
      case 'dashboard':
        return <Dashboard memories={memories} goTo={setPage} />
      case 'memories':
        return <MemoryStore memories={memories} deleteMemory={deleteMemory} openInspector={openInspector} />
      case 'decision':
        return <DecisionEngine memories={memories} apiMode={apiMode} />
      case 'inspector':
        return <Inspector memories={memories} initial={inspectTarget} />
      case 'add':
        return <AddMemory addMemory={addMemory} />
      case 'analytics':
        return <Analytics memories={memories} />
      default:
        return <Dashboard memories={memories} goTo={setPage} />
    }
  }

  return (
    <div style={{ display: 'flex', height: '100vh', background: C.bg, overflow: 'hidden' }}>
      <Sidebar
        page={page}
        setPage={setPage}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Topbar
          page={page}
          memoryCount={memories.length}
          apiMode={apiMode}
          loading={loading}
          onRefresh={refresh}
        />

        {/* Error banner */}
        {error && (
          <div style={{
            padding: '8px 24px', background: '#FEF2F2',
            borderBottom: `1px solid ${C.redBorder}`,
            fontSize: 12, color: C.red, flexShrink: 0,
          }}>
            ⚠ API error: {error}
          </div>
        )}

        <main style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
          <div key={page} className="page-enter">
            {renderPage()}
          </div>
        </main>
      </div>
    </div>
  )
}
