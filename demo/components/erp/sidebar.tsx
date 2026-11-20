'use client'

import {
  Archive,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  CreditCard,
  LayoutDashboard,
  LayoutGrid,
  Package,
  PieChart,
  Puzzle,
  Search,
  ShoppingBag,
  ShoppingCart,
  Truck,
  Undo2,
  UserCog,
  Users,
  Wallet,
} from 'lucide-react'
import { MODULES, moduleOf, type Mode } from '@/lib/erp/modules'
import { cn } from '@/lib/utils'
import { DisagreementMarker, TAB_SIDEBAR_DISAGREEMENT_LABEL } from './disagreement-marker'
import { useSlidingIndicator } from './use-sliding-indicator'

type IconType = React.ComponentType<{ className?: string }>

const ICONS: Record<string, IconType> = {
  dashboard: LayoutDashboard,
  artikel: Package,
  verkauf: ShoppingCart,
  zahlungen: CreditCard,
}

/**
 * Observation 10: the collapsed rail shows a DIFFERENT, longer menu than the
 * expanded sidebar. Only some entries correspond to the four modules; the rest
 * lead nowhere and the sub-items are not reachable at all.
 */
const RAIL: { id: string; label: string; icon: IconType; moduleId?: string }[] = [
  { id: 'r-dashboard', label: 'Dashboard', icon: LayoutDashboard, moduleId: 'dashboard' },
  { id: 'r-artikel', label: 'Artikel', icon: Package, moduleId: 'artikel' },
  { id: 'r-verkauf', label: 'Verkauf', icon: ShoppingCart, moduleId: 'verkauf' },
  { id: 'r-lager', label: 'Lager', icon: Archive },
  { id: 'r-kunden', label: 'Kunden', icon: Users },
  { id: 'r-einkauf', label: 'Einkauf', icon: ShoppingBag },
  { id: 'r-zahlungen', label: 'Zahlungen', icon: Wallet, moduleId: 'zahlungen' },
  { id: 'r-versand', label: 'Versand', icon: Truck },
  { id: 'r-retouren', label: 'Retouren', icon: Undo2 },
  { id: 'r-apps', label: 'Apps', icon: LayoutGrid },
  { id: 'r-berichte', label: 'Berichte', icon: PieChart },
  { id: 'r-benutzer', label: 'Benutzer', icon: UserCog },
  { id: 'r-hilfe', label: 'Hilfe', icon: CircleHelp },
  { id: 'r-support', label: 'Support', icon: CircleHelp },
  { id: 'r-plugins', label: 'Plugins', icon: Puzzle },
]

type Props = {
  mode: Mode
  expanded: string[]
  highlighted: string | null
  collapsed: boolean
  /** Current state only. Ignored in Concept, where the tab is the source of truth. */
  disagree: boolean
  onToggleCollapse: () => void
  onClickModule: (moduleId: string) => void
  onClickChevron: (moduleId: string) => void
  onClickItem: (itemId: string) => void
}

export function Sidebar({
  mode,
  expanded,
  highlighted,
  collapsed,
  disagree,
  onToggleCollapse,
  onClickModule,
  onClickChevron,
  onClickItem,
}: Props) {
  const showCollapseControl = mode === 'current'
  const showDisagreement = mode === 'current' && disagree
  const { ref: navRef, box } = useSlidingIndicator<HTMLElement>([highlighted, expanded.join(','), mode, collapsed])
  const isCollapsed = showCollapseControl && collapsed

  /* ---------------------------------------------------------------- */
  /* Collapsed icon rail (current state only)                          */
  /* ---------------------------------------------------------------- */
  if (isCollapsed) {
    const highlightedModuleId = highlighted ? moduleOf(highlighted).id : null

    return (
      <nav aria-label="Module (eingeklappt)" className="flex w-16 shrink-0 flex-col border-r border-sidebar-border bg-sidebar">
        <div className="flex h-14 items-center justify-center">
          <button
            type="button"
            onClick={onToggleCollapse}
            aria-label="Seitenleiste ausklappen"
            aria-expanded={false}
            className="flex size-8 items-center justify-center rounded-lg border border-border bg-card text-foreground shadow-xs hover:bg-secondary"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
        <ul className="flex flex-col items-center gap-1 px-2 pb-2">
          {RAIL.map((entry) => {
            const Icon = entry.icon
            const active = entry.moduleId != null && entry.moduleId === highlightedModuleId
            const marked = active && showDisagreement
            const accessibleLabel = marked ? `${entry.label}. ${TAB_SIDEBAR_DISAGREEMENT_LABEL}` : entry.label
            return (
              <li key={entry.id}>
                <button
                  type="button"
                  title={accessibleLabel}
                  aria-label={accessibleLabel}
                  aria-current={active ? 'page' : undefined}
                  onClick={entry.moduleId ? () => onClickModule(entry.moduleId!) : undefined}
                  className={cn(
                    'relative flex size-10 items-center justify-center rounded-xl',
                    active
                      ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent',
                  )}
                >
                  <Icon className="size-[18px]" />
                  {marked && <DisagreementMarker className="absolute top-1 right-1" />}
                </button>
              </li>
            )
          })}
        </ul>
      </nav>
    )
  }

  /* ---------------------------------------------------------------- */
  /* Expanded sidebar                                                  */
  /* ---------------------------------------------------------------- */
  return (
    <nav ref={navRef} aria-label="Module" className="relative flex w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar">
      {/* One highlight that slides to the highlighted row. In Concept it follows the active tab; in
          Current state it stays where the sidebar last was, which is observation 7. */}
      {box && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0 z-0 rounded-md bg-sidebar-primary motion-safe:transition-[transform,width,height] motion-safe:duration-300 motion-safe:ease-[cubic-bezier(0.2,0.8,0.2,1)]"
          style={{ transform: `translate(${box.left}px, ${box.top}px)`, width: box.width, height: box.height }}
        />
      )}
      {/* Search field */}
      <div className="flex items-center gap-2 px-4 pb-1 pt-4">
        <label className="flex h-9 flex-1 items-center gap-2 rounded-lg px-2 text-sm text-muted-foreground">
          <Search className="size-4" aria-hidden="true" />
          <input
            type="search"
            placeholder="Suchen"
            className="min-w-0 flex-1 bg-transparent text-foreground outline-none placeholder:text-muted-foreground"
          />
        </label>
      </div>

      {showCollapseControl && (
        <button
          type="button"
          onClick={onToggleCollapse}
          aria-label="Seitenleiste einklappen"
          aria-expanded={true}
          className="absolute -right-4 top-5 flex size-8 items-center justify-center rounded-lg border border-border bg-card text-foreground shadow-xs hover:bg-secondary"
        >
          <ChevronLeft className="size-4" />
        </button>
      )}

      <ul className="relative z-10 flex flex-col gap-0.5 p-2">
        {MODULES.map((mod) => {
          const Icon = ICONS[mod.id]
          const isOpen = expanded.includes(mod.id)
          const ownsHighlight = highlighted != null && moduleOf(highlighted).id === mod.id
          const visibleChildHighlighted = isOpen && (mod.children?.some((c) => c.id === highlighted) ?? false)
          // The module row carries the highlight unless a visible sub-module does. Saved views and
          // records live in the inner sidebar, so their module is what lights up here.
          const isHighlighted = ownsHighlight && !visibleChildHighlighted
          const marked = isHighlighted && showDisagreement
          const Chevron = isOpen ? ChevronDown : ChevronRight

          return (
            <li key={mod.id} className="flex flex-col gap-0.5">
              <div
                data-indicator-target={isHighlighted ? '' : undefined}
                className={cn(
                  'group relative z-10 flex h-9 items-center rounded-md text-sm font-medium transition-colors',
                  isHighlighted
                    ? 'text-sidebar-primary-foreground'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent',
                )}
              >
                <button
                  type="button"
                  onClick={() => onClickModule(mod.id)}
                  aria-current={isHighlighted ? 'page' : undefined}
                  title={marked ? TAB_SIDEBAR_DISAGREEMENT_LABEL : undefined}
                  className="flex h-full min-w-0 flex-1 items-center gap-2.5 pl-3 pr-2 text-left"
                >
                  <Icon className="size-4 shrink-0" />
                  <span className="min-w-0 flex-1 truncate">{mod.label}</span>
                  {marked && <DisagreementMarker />}
                </button>

                {mod.children &&
                  (mode === 'concept' ? (
                    <button
                      type="button"
                      onClick={() => onClickChevron(mod.id)}
                      aria-label={isOpen ? `${mod.label} einklappen` : `${mod.label} ausklappen`}
                      aria-expanded={isOpen}
                      className={cn(
                        'mr-1 flex size-7 shrink-0 items-center justify-center rounded-md',
                        isHighlighted
                          ? 'text-sidebar-primary-foreground hover:bg-sidebar-primary-foreground/10'
                          : 'text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground',
                      )}
                    >
                      <Chevron className="size-4" />
                    </button>
                  ) : (
                    <Chevron
                      aria-hidden="true"
                      className={cn(
                        'mr-3 size-4 shrink-0',
                        isHighlighted ? 'text-sidebar-primary-foreground' : 'text-muted-foreground',
                      )}
                    />
                  ))}
              </div>

              {mod.children && isOpen && (
                <ul className="ml-3 flex flex-col gap-0.5 border-l border-sidebar-border pl-2">
                  {mod.children.map((child) => {
                    const active = highlighted === child.id
                    const marked = active && showDisagreement
                    // Prototype limitation (both modes): unwired sub-items are inert — no tab, no narration.
                    if (child.disabled) {
                      return (
                        <li key={child.id}>
                          <button
                            type="button"
                            disabled
                            aria-disabled="true"
                            className="flex h-9 w-full cursor-default items-center rounded-md px-3 text-left text-[13px] font-normal text-muted-foreground/60"
                          >
                            <span className="truncate">{child.label}</span>
                          </button>
                        </li>
                      )
                    }
                    return (
                      <li key={child.id}>
                        <button
                          type="button"
                          onClick={() => onClickItem(child.id)}
                          aria-current={active ? 'page' : undefined}
                          title={marked ? TAB_SIDEBAR_DISAGREEMENT_LABEL : undefined}
                          data-indicator-target={active ? '' : undefined}
                          className={cn(
                            'relative z-10 flex h-9 w-full items-center gap-2 rounded-md px-3 text-left text-[13px] font-normal transition-colors',
                            active
                              ? 'text-sidebar-primary-foreground'
                              : 'text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground',
                          )}
                        >
                          <span className="min-w-0 flex-1 truncate">{child.label}</span>
                          {marked && <DisagreementMarker />}
                        </button>
                      </li>
                    )
                  })}
                </ul>
              )}
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
