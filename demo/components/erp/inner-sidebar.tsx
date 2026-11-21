'use client'

import { useState } from 'react'
import { Ellipsis, FileText, List, Plus, Search } from 'lucide-react'
import { hasInnerSidebar, moduleOf, type Mode, type NavModule } from '@/lib/erp/modules'
import { cn } from '@/lib/utils'

type Props = {
  mode: Mode
  /** The inner sidebar always shows the module of the ACTIVE TAB — never the last item clicked. */
  activeTabId: string | null
  highlighted: string | null
  onClickItem: (itemId: string) => void
}

export function InnerSidebar({ mode, activeTabId, highlighted, onClickItem }: Props) {
  const mod: NavModule | null = activeTabId ? moduleOf(activeTabId) : null
  const live = mod && hasInnerSidebar(mod) ? mod : null
  // Keep the last module on screen while the column eases shut, so the close clips
  // real rows instead of an empty slot. Same column in both modes.
  const [painted, setPainted] = useState(live)
  if (live && painted?.id !== live.id) setPainted(live)
  const open = live !== null

  // Rule 5: modules without views or records have no column. The width eases a
  // little longer than the highlight, because the column travels further, so you
  // can see it follow the active tab. Reduced motion snaps it.
  // The lists themselves are identical in both modes: saved views (a filter over many
  // items) and open records (single items), kept visually distinct.
  return (
    <div
      aria-hidden={open ? undefined : true}
      inert={open ? undefined : true}
      className={cn(
        'flex min-h-0 min-w-0 shrink-0 overflow-hidden motion-safe:transition-[width] motion-safe:duration-500 motion-safe:ease-[cubic-bezier(0.22,1,0.36,1)]',
        open ? 'w-64' : 'w-0',
      )}
    >
      {painted && (
        <aside
          aria-label={`Inhalte in ${painted.label}`}
          className="flex w-64 flex-col border-r border-sidebar-border bg-sidebar"
        >
          <div
            className={cn(
              'flex flex-col gap-5 px-3 pt-5',
              'motion-safe:transition-opacity motion-safe:duration-150 motion-safe:ease-[cubic-bezier(0.22,1,0.36,1)]',
              open ? 'motion-safe:opacity-100 motion-safe:delay-100' : 'motion-safe:opacity-0',
            )}
          >
          {/* ---------------- Übersichten: saved views (a filter over many items) ---------------- */}
          {painted.views && painted.views.length > 0 && (
            <section className="flex flex-col gap-1">
              <header className="flex h-7 items-center justify-between pl-2 pr-1">
                <h2 className="text-[13px] text-muted-foreground">Übersichten</h2>
                <div className="flex items-center gap-0.5 text-muted-foreground">
                  <span aria-hidden="true" className="flex size-6 items-center justify-center">
                    <List className="size-4" />
                  </span>
                  <span aria-hidden="true" className="flex size-6 items-center justify-center">
                    <Search className="size-4" />
                  </span>
                  <span aria-hidden="true" className="flex size-6 items-center justify-center">
                    <Ellipsis className="size-4" />
                  </span>
                </div>
              </header>
              <ul className="flex flex-col gap-0.5">
                {painted.views.map((view) => {
                  const active = highlighted === view.id
                  return (
                    <li key={view.id}>
                      <button
                        type="button"
                        onClick={() => onClickItem(view.id)}
                        aria-current={active ? 'page' : undefined}
                        className={cn(
                          'flex h-9 w-full items-center gap-2.5 rounded-md px-2 text-left text-sm',
                          active
                            ? 'bg-sidebar-primary font-medium text-sidebar-primary-foreground'
                            : 'text-sidebar-foreground hover:bg-sidebar-accent',
                        )}
                      >
                        <List className={cn('size-4 shrink-0', active ? 'text-sidebar-primary-foreground' : 'text-muted-foreground')} />
                        <span className="truncate">{view.label}</span>
                      </button>
                    </li>
                  )
                })}
              </ul>
            </section>
          )}

          {/* ---------------- Records: single open items ---------------- */}
          {painted.records && painted.records.length > 0 && (
            <section className="flex flex-col gap-2">
              <header className="flex h-7 items-center justify-between pl-2 pr-1">
                <h2 className="text-[13px] text-muted-foreground">{painted.label}</h2>
                <div className="flex items-center gap-0.5 text-muted-foreground">
                  <span aria-hidden="true" className="flex size-6 items-center justify-center text-primary">
                    <Search className="size-4" />
                  </span>
                  <span aria-hidden="true" className="flex size-6 items-center justify-center">
                    <Plus className="size-4" />
                  </span>
                  <span aria-hidden="true" className="flex size-6 items-center justify-center">
                    <Ellipsis className="size-4" />
                  </span>
                </div>
              </header>
              <label className="flex h-9 items-center gap-2 rounded-lg border border-border bg-card px-2.5 text-sm text-muted-foreground">
                <Search className="size-4 shrink-0" aria-hidden="true" />
                <input
                  type="search"
                  placeholder={`Suche ${painted.label}`}
                  className="min-w-0 flex-1 bg-transparent text-foreground outline-none placeholder:text-muted-foreground"
                />
              </label>
              <ul className="flex flex-col gap-0.5">
                {painted.records.map((record) => {
                  const active = highlighted === record.id
                  return (
                    <li key={record.id}>
                      <button
                        type="button"
                        onClick={() => onClickItem(record.id)}
                        aria-current={active ? 'page' : undefined}
                        className={cn(
                          'flex h-9 w-full items-center gap-2.5 rounded-md border px-2 text-left text-sm',
                          active
                            ? 'border-primary/30 bg-sidebar-primary font-medium text-sidebar-primary-foreground'
                            : 'border-border bg-card text-sidebar-foreground hover:bg-sidebar-accent',
                        )}
                      >
                        <FileText className={cn('size-4 shrink-0', active ? 'text-sidebar-primary-foreground' : 'text-foreground')} />
                        <span className="truncate">{record.label}</span>
                      </button>
                    </li>
                  )
                })}
              </ul>
            </section>
          )}
          </div>
        </aside>
      )}
    </div>
  )
}
