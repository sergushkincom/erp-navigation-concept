'use client'

import { X } from 'lucide-react'
import type { Mode } from '@/lib/erp/modules'
import { tabLabel, type Tab } from '@/lib/erp/navigation'
import { cn } from '@/lib/utils'

type Props = {
  mode: Mode
  tabs: Tab[]
  activeTabId: string | null
  onActivate: (tabId: string) => void
  onClose: (tabId: string) => void
}

export function TabBar({ mode, tabs, activeTabId, onActivate, onClose }: Props) {
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
            title={label}
            className={cn(
              'group flex h-12 min-w-[100px] shrink-0 items-center rounded-t-[12px] border border-b-0 text-[16px] font-semibold',
              active
                ? '-mb-px max-w-[240px] border-border bg-background pl-6 pr-3 text-foreground'
                : 'max-w-[200px] border-transparent px-6 text-foreground/80 hover:text-foreground',
            )}
          >
            <button
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onActivate(tab.id)}
              className={cn('min-w-0 flex-1 truncate whitespace-nowrap text-left', active && 'pr-2')}
            >
              {label}
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
