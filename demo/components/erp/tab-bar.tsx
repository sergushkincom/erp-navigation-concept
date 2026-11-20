'use client'

import { X } from 'lucide-react'
import type { Mode } from '@/lib/erp/modules'
import { tabLabel, type Tab } from '@/lib/erp/navigation'
import { cn } from '@/lib/utils'
import { DisagreementMarker, TAB_SIDEBAR_DISAGREEMENT_LABEL } from './disagreement-marker'

type Props = {
  mode: Mode
  tabs: Tab[]
  activeTabId: string | null
  /** Current state only. Ignored in Concept, where the tab is the source of truth. */
  disagree: boolean
  onActivate: (tabId: string) => void
  onClose: (tabId: string) => void
}

export function TabBar({ mode, tabs, activeTabId, disagree, onActivate, onClose }: Props) {
  const showDisagreement = mode === 'current' && disagree
  return (
    <div
      role="tablist"
      aria-label="Offene Ansichten"
      className="flex h-14 shrink-0 items-end overflow-x-auto border-b border-border bg-sidebar pl-6"
    >
      {tabs.length === 0 && (
        <p className="self-center text-[15px] text-muted-foreground">Keine Ansicht geöffnet</p>
      )}
      {tabs.map((tab) => {
        const active = tab.id === activeTabId
        const label = tabLabel(tab, mode)
        return (
          <div
            key={tab.id}
            title={active && showDisagreement ? `${label} — ${TAB_SIDEBAR_DISAGREEMENT_LABEL}` : label}
            className={cn(
              'group relative flex h-12 min-w-[100px] shrink-0 items-center rounded-t-[12px] border border-b-0 text-[16px] font-semibold',
              active
                ? '-mb-px max-w-[240px] border-border bg-background pl-6 pr-3 text-foreground'
                : 'max-w-[200px] border-transparent px-6 text-foreground/80 hover:text-foreground',
            )}
          >
            <button
              type="button"
              role="tab"
              aria-selected={active}
              title={active && showDisagreement ? TAB_SIDEBAR_DISAGREEMENT_LABEL : undefined}
              onClick={() => onActivate(tab.id)}
              className={cn('relative flex h-full min-w-0 flex-1 items-center text-left', active && 'pr-2')}
            >
              <span className="truncate whitespace-nowrap">{label}</span>
              {active && showDisagreement && (
                <DisagreementMarker className="absolute top-0 bottom-0 -left-4 my-auto h-2 w-2" />
              )}
            </button>
            {tabs.length > 1 && (
              <button
                type="button"
                onClick={() => onClose(tab.id)}
                aria-label={`„${label}“ schließen`}
                className={cn(
                  'flex size-7 items-center justify-center rounded-md text-foreground hover:bg-secondary',
                  !active && 'sr-only',
                )}
              >
                <X className="size-4" />
              </button>
            )}
          </div>
        )
      })}
    </div>
  )
}
