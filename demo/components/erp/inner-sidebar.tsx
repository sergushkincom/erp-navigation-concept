'use client'

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

  // Rule 5: no column at all when the module has neither views nor records.
  if (!mod || !hasInnerSidebar(mod)) return null

  // The inner sidebar is identical in both modes: two visually distinct groups —
  // saved views (a filter over many items) and open records (single items).
  return (
    <aside
      aria-label={`Inhalte in ${mod.label}`}
      className="flex w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar"
    >
      {
        <div className="flex flex-col gap-5 px-3 pt-5">
          {/* ---------------- Übersichten: saved views (a filter over many items) ---------------- */}
          {mod.views && mod.views.length > 0 && (
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
                {mod.views.map((view) => {
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
          {mod.records && mod.records.length > 0 && (
            <section className="flex flex-col gap-2">
              <header className="flex h-7 items-center justify-between pl-2 pr-1">
                <h2 className="text-[13px] text-muted-foreground">{mod.label}</h2>
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
                  placeholder={`Suche ${mod.label}`}
                  className="min-w-0 flex-1 bg-transparent text-foreground outline-none placeholder:text-muted-foreground"
                />
              </label>
              <ul className="flex flex-col gap-0.5">
                {mod.records.map((record) => {
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
      }
    </aside>
  )
}
