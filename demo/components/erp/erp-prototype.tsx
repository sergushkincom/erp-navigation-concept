'use client'

import { useReducer } from 'react'
import { highlightedItem, initialNavState, navReducer } from '@/lib/erp/navigation'
import { ContentView } from './content-view'
import { InnerSidebar } from './inner-sidebar'
import { ModeSwitcher } from './mode-switcher'
import { Sidebar } from './sidebar'
import { TabBar } from './tab-bar'

export function ErpPrototype() {
  const [state, dispatch] = useReducer(navReducer, initialNavState)

  return (
    <div className="flex h-dvh flex-col bg-background text-foreground">
      <header className="flex h-12 shrink-0 items-center justify-between border-b border-border px-4">
        <div className="flex items-center gap-2.5 text-sm">
          <span className="flex size-6 items-center justify-center rounded-md bg-primary text-[13px] font-medium text-primary-foreground">
            E
          </span>
          <span className="font-medium">ERP Navigation</span>
          <span className="text-muted-foreground">Prototyp</span>
        </div>
        <ModeSwitcher mode={state.mode} onChange={(mode) => dispatch({ type: 'setMode', mode })} />
      </header>

      <p
        role="status"
        aria-live="polite"
        className="shrink-0 border-b border-border bg-background px-4 py-2 text-[13px] text-muted-foreground"
      >
        {state.narration}
      </p>

      <div className="flex min-h-0 flex-1">
        <Sidebar
          mode={state.mode}
          expanded={state.expanded}
          highlighted={highlightedItem(state)}
          collapsed={state.sidebarCollapsed}
          onToggleCollapse={() => dispatch({ type: 'toggleSidebar' })}
          onClickModule={(moduleId) => dispatch({ type: 'clickModule', moduleId })}
          onClickChevron={(moduleId) => dispatch({ type: 'clickChevron', moduleId })}
          onClickItem={(itemId) => dispatch({ type: 'clickItem', itemId })}
        />
        <InnerSidebar
          mode={state.mode}
          activeTabId={state.activeTabId}
          highlighted={highlightedItem(state)}
          onClickItem={(itemId) => dispatch({ type: 'clickItem', itemId })}
        />
        <main className="flex min-w-0 flex-1 flex-col">
          <TabBar
            mode={state.mode}
            tabs={state.tabs}
            activeTabId={state.activeTabId}
            onActivate={(tabId) => dispatch({ type: 'activateTab', tabId })}
            onClose={(tabId) => dispatch({ type: 'closeTab', tabId })}
          />
          <ContentView tabId={state.activeTabId} />
        </main>
      </div>
    </div>
  )
}
