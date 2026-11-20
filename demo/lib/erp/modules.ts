export type Mode = 'current' | 'concept'

/** Which screen a nav item renders in the content area. */
export type ViewKind = 'dashboard' | 'artikel-liste' | 'artikel-stammdaten' | 'auftraege'

export type NavItem = {
  id: string
  label: string
  /** Label used for the tab in Concept mode (labelled by content). */
  contentLabel: string
  view: ViewKind
  /** Prototype limitation: shown but not wired up. Non-interactive in BOTH modes. */
  disabled?: boolean
}

export type NavModule = {
  id: string
  label: string
  /** Label used for the tab in Concept mode when the module itself is a leaf / default view. */
  contentLabel: string
  view: ViewKind
  /** Sub-modules — shown in the LEFT sidebar under the module. */
  children?: NavItem[]
  /** Saved views ("Übersichten") — shown in the INNER sidebar only. A view is a filter over many items. */
  views?: NavItem[]
  /** Open records — shown in the INNER sidebar only. A record is one item. */
  records?: NavItem[]
}

export const MODULES: NavModule[] = [
  { id: 'dashboard', label: 'Dashboard', contentLabel: 'Dashboard', view: 'dashboard' },
  {
    id: 'artikel',
    label: 'Artikel',
    contentLabel: 'Artikel: alle aktiven',
    view: 'artikel-liste',
    children: [
      {
        id: 'artikel.artikelverwaltung',
        label: 'Artikelverwaltung',
        contentLabel: 'Artikel: Artikelverwaltung',
        view: 'artikel-liste',
      },
      {
        id: 'artikel.stammdaten',
        label: 'Stammdaten',
        contentLabel: 'Artikel: Stammdaten',
        view: 'artikel-stammdaten',
        disabled: true,
      },
      {
        id: 'artikel.struktur',
        label: 'Struktur & Sortimente',
        contentLabel: 'Artikel: Struktur & Sortimente',
        view: 'artikel-liste',
        disabled: true,
      },
      {
        id: 'artikel.sonderpreise',
        label: 'Sonderpreise',
        contentLabel: 'Artikel: Sonderpreise',
        view: 'artikel-liste',
        disabled: true,
      },
      {
        id: 'artikel.importe',
        label: 'Importe',
        contentLabel: 'Artikel: Importe',
        view: 'artikel-liste',
        disabled: true,
      },
    ],
    views: [
      {
        id: 'artikel.view.alle-aktiv',
        label: 'Alle Artikel – aktiv',
        contentLabel: 'Artikel: alle aktiven',
        view: 'artikel-liste',
      },
      {
        id: 'artikel.view.jacken',
        label: 'Jacken mit niedrigem Bestand',
        contentLabel: 'Artikel: Jacken, niedriger Bestand',
        view: 'artikel-liste',
      },
      {
        id: 'artikel.view.zelte',
        label: 'Zelte ohne Zubehör',
        contentLabel: 'Artikel: Zelte ohne Zubehör',
        view: 'artikel-liste',
      },
    ],
    records: [
      {
        id: 'artikel.record.wanderjacke',
        label: 'Wanderjacke Fjellrygg',
        contentLabel: 'Artikel: Wanderjacke Fjellrygg',
        view: 'artikel-stammdaten',
      },
      {
        id: 'artikel.record.trekkingzelt',
        label: 'Trekkingzelt Solo 1P',
        contentLabel: 'Artikel: Trekkingzelt Solo 1P',
        view: 'artikel-stammdaten',
      },
    ],
  },
  {
    id: 'verkauf',
    label: 'Verkauf',
    contentLabel: 'Verkauf: Aufträge',
    view: 'auftraege',
    views: [
      { id: 'verkauf.view.alle', label: 'Alle Aufträge', contentLabel: 'Verkauf: alle Aufträge', view: 'auftraege' },
      { id: 'verkauf.view.ohne-rechnung', label: 'Ohne Rechnung', contentLabel: 'Verkauf: ohne Rechnung', view: 'auftraege' },
      { id: 'verkauf.view.bezahlt', label: 'Bezahlt', contentLabel: 'Verkauf: bezahlt', view: 'auftraege' },
      { id: 'verkauf.view.storniert', label: 'Storniert', contentLabel: 'Verkauf: storniert', view: 'auftraege' },
    ],
    records: [
      { id: 'verkauf.record.au-0412', label: 'AU-2026-0412', contentLabel: 'Verkauf: AU-2026-0412', view: 'auftraege' },
      { id: 'verkauf.record.au-0419', label: 'AU-2026-0419', contentLabel: 'Verkauf: AU-2026-0419', view: 'auftraege' },
    ],
  },
  { id: 'zahlungen', label: 'Zahlungen', contentLabel: 'Zahlungen: Aufträge', view: 'auftraege' },
]

/** Rule 5: the inner sidebar only exists where the module has saved views or open records. */
export function hasInnerSidebar(mod: NavModule): boolean {
  return (mod.views?.length ?? 0) > 0 || (mod.records?.length ?? 0) > 0
}

export type ItemKind = 'module' | 'child' | 'view' | 'record'

/** What kind of object an id refers to — rule 5 treats views and records differently. */
export function itemKind(itemId: string): ItemKind {
  if (MODULES.some((m) => m.id === itemId)) return 'module'
  for (const m of MODULES) {
    if (m.views?.some((v) => v.id === itemId)) return 'view'
    if (m.records?.some((r) => r.id === itemId)) return 'record'
  }
  return 'child'
}

/** Everything a module owns besides itself: sub-modules, saved views and records. */
function ownedItems(mod: NavModule): NavItem[] {
  return [...(mod.children ?? []), ...(mod.views ?? []), ...(mod.records ?? [])]
}

/** Returns the module that owns an item id (module ids own themselves). */
export function moduleOf(itemId: string): NavModule {
  const direct = MODULES.find((m) => m.id === itemId)
  if (direct) return direct
  const parent = MODULES.find((m) => ownedItems(m).some((c) => c.id === itemId))
  if (!parent) throw new Error(`Unknown nav item: ${itemId}`)
  return parent
}

function findItem(itemId: string): NavModule | NavItem | undefined {
  const mod = MODULES.find((m) => m.id === itemId)
  if (mod) return mod
  for (const m of MODULES) {
    const child = ownedItems(m).find((c) => c.id === itemId)
    if (child) return child
  }
  return undefined
}

export function itemLabel(itemId: string): string {
  return findItem(itemId)?.label ?? itemId
}

export function contentLabelOf(itemId: string): string {
  return findItem(itemId)?.contentLabel ?? itemId
}

export function viewOf(itemId: string): ViewKind {
  return findItem(itemId)?.view ?? 'artikel-liste'
}
