import { MODULES, contentLabelOf, hasInnerSidebar, itemKind, itemLabel, moduleOf, type Mode } from './modules'

export type Tab = {
  /** Tab id doubles as the nav item id that produced it (leaf module or sub-item). */
  id: string
}

export type NavState = {
  mode: Mode
  tabs: Tab[]
  activeTabId: string | null
  expanded: string[]
  /** Current-state behaviour: the sidebar highlight is simply the last clicked item. */
  lastClicked: string | null
  /** Current-state only: the sidebar can collapse to an icon rail (observation 10). */
  sidebarCollapsed: boolean
  narration: string
}

export type NavAction =
  | { type: 'setMode'; mode: Mode }
  | { type: 'toggleSidebar' }
  | { type: 'clickModule'; moduleId: string }
  | { type: 'clickChevron'; moduleId: string }
  | { type: 'clickItem'; itemId: string }
  | { type: 'activateTab'; tabId: string }
  | { type: 'closeTab'; tabId: string }

export const initialNavState: NavState = {
  mode: 'current',
  tabs: [{ id: 'dashboard' }],
  activeTabId: 'dashboard',
  expanded: [],
  lastClicked: 'dashboard',
  sidebarCollapsed: false,
  narration: 'Ready — click anything in the sidebar or tab bar to see what happens.',
}

/** Tab label depends on the mode: by module today, by content in the concept. */
export function tabLabel(tab: Tab, mode: Mode): string {
  return mode === 'current' ? moduleOf(tab.id).label : contentLabelOf(tab.id)
}

/** Which sidebar item is highlighted. */
export function highlightedItem(state: NavState): string | null {
  return state.mode === 'current' ? state.lastClicked : state.activeTabId
}

const toggle = (list: string[], id: string) =>
  list.includes(id) ? list.filter((x) => x !== id) : [...list, id]

const ensure = (list: string[], id: string) => (list.includes(id) ? list : [...list, id])

/** Current state only: for the demo the tab bar is capped at four tabs.
 *  Four identical “Artikel” tabs already make the point; a fifth drops the oldest. */
const CURRENT_TAB_CAP = 4

function openOrActivate(state: NavState, itemId: string): { state: NavState; wasOpen: boolean } {
  const wasOpen = state.tabs.some((t) => t.id === itemId)
  let tabs = wasOpen ? state.tabs : [...state.tabs, { id: itemId }]
  if (!wasOpen && state.mode === 'current' && tabs.length > CURRENT_TAB_CAP) {
    tabs = tabs.slice(tabs.length - CURRENT_TAB_CAP)
  }
  return {
    wasOpen,
    state: {
      ...state,
      tabs,
      activeTabId: itemId,
    },
  }
}

/** Rule 5 (both modes): whenever the active tab moves to a module without views or records,
 *  the inner sidebar column disappears and the narration says so. */
function withInnerSidebarRule(prev: NavState, next: NavState): NavState {
  const prevMod = prev.activeTabId ? moduleOf(prev.activeTabId) : null
  const nextMod = next.activeTabId ? moduleOf(next.activeTabId) : null
  const wasShown = !!prevMod && hasInnerSidebar(prevMod)
  const isShown = !!nextMod && hasInnerSidebar(nextMod)
  // In Current state an observation is the more useful thing to say, so it keeps the line.
  const observationAlreadyNarrated = next.mode === 'current' && /\(observation/.test(next.narration)
  if (wasShown && !isShown && nextMod && !observationAlreadyNarrated) {
    return {
      ...next,
      narration: `${nextMod.label} has no views or records — the inner sidebar is not shown here (rule 5).`,
    }
  }
  return next
}

export function navReducer(state: NavState, action: NavAction): NavState {
  return withInnerSidebarRule(state, applyAction(state, action))
}

function applyAction(state: NavState, action: NavAction): NavState {
  switch (action.type) {
    case 'setMode': {
      if (action.mode === state.mode) return state
      return {
        ...state,
        mode: action.mode,
        // The concept has no collapse control, so an icon rail can never be left behind.
        sidebarCollapsed: action.mode === 'concept' ? false : state.sidebarCollapsed,
        narration:
          action.mode === 'concept'
            ? 'Switched to the concept — the same open tabs are now labelled by their content, and the active tab is the only source of truth.'
            : 'Switched back to today’s behaviour — the same open tabs are labelled by module again, and the sidebar highlight is wherever you last clicked.',
      }
    }
    case 'toggleSidebar': {
      // Current state only — the concept never renders the control.
      if (state.mode !== 'current') return state
      const collapsed = !state.sidebarCollapsed
      return {
        ...state,
        sidebarCollapsed: collapsed,
        narration: collapsed
          ? 'Collapsed the sidebar — it now shows a different menu, and the sub-items cannot be reached at all (observation 10).'
          : 'Expanded the sidebar — the four modules are back.',
      }
    }
    case 'activateTab':
      return state.mode === 'current' ? currentActivateTab(state, action.tabId) : conceptActivateTab(state, action.tabId)
    case 'closeTab':
      return closeTab(state, action.tabId)
    case 'clickModule':
      return state.mode === 'current'
        ? currentClickModule(state, action.moduleId)
        : conceptClickModule(state, action.moduleId)
    case 'clickChevron':
      return state.mode === 'current'
        ? currentClickModule(state, action.moduleId)
        : conceptClickChevron(state, action.moduleId)
    case 'clickItem':
      return state.mode === 'current' ? currentClickItem(state, action.itemId) : conceptClickItem(state, action.itemId)
  }
}

/* ------------------------------------------------------------------ */
/* CURRENT STATE — reproduces today's behaviour, including its flaws.  */
/* ------------------------------------------------------------------ */

function currentClickModule(state: NavState, moduleId: string): NavState {
  const mod = MODULES.find((m) => m.id === moduleId)!
  if (!mod.children) {
    const { state: next, wasOpen } = openOrActivate(state, moduleId)
    return {
      ...next,
      lastClicked: moduleId,
      narration: wasOpen
        ? `Activated the existing “${mod.label}” tab — a module without sub-items opens or activates directly (observation 2).`
        : `Opened a “${mod.label}” tab immediately — a module without sub-items needs no second click (observation 2).`,
    }
  }
  const openTab = state.tabs.find((t) => moduleOf(t.id).id === moduleId)
  if (openTab) {
    return {
      ...state,
      activeTabId: openTab.id,
      expanded: state.expanded.filter((x) => x !== moduleId),
      lastClicked: moduleId,
      narration: `Clicked “${mod.label}” again — its tab is activated AND its sub-items collapse in the same click (observation 3).`,
    }
  }
  const nowExpanded = !state.expanded.includes(moduleId)
  return {
    ...state,
    expanded: toggle(state.expanded, moduleId),
    lastClicked: moduleId,
    narration: nowExpanded
      ? `Expanded “${mod.label}” — nothing opened; a tab only appears after clicking a sub-item (observation 1).`
      : `Collapsed “${mod.label}” — still no tab; the click only toggled the sub-items (observation 1).`,
  }
}

function currentClickItem(state: NavState, itemId: string): NavState {
  const kind = itemKind(itemId)
  if (kind === 'view') return currentClickView(state, itemId)

  // Records and sub-modules keep the open-or-activate behaviour.
  const mod = moduleOf(itemId)
  const { state: next, wasOpen } = openOrActivate(state, itemId)
  const sameModuleTabs = next.tabs.filter((t) => moduleOf(t.id).id === mod.id).length
  return {
    ...next,
    lastClicked: itemId,
    narration: wasOpen
      ? `Activated the tab for “${itemLabel(itemId)}” — it is still labelled “${mod.label}” like any other ${mod.label} view (observation 4).`
      : sameModuleTabs > 1
        ? `Opened a second view — both tabs are labelled '${mod.label}' (observation 4).`
        : `Opened a tab for “${itemLabel(itemId)}” — labelled “${mod.label}” after its module, not after its content (observation 4).`,
  }
}

/** Observation 4: clicking a saved view changes the ACTIVE tab's content but not its label —
 *  the tab keeps saying “Artikel” while showing a different view. No new tab opens; only a
 *  left-sidebar module click opens tabs. */
function currentClickView(state: NavState, viewId: string): NavState {
  const mod = moduleOf(viewId)
  const active = state.activeTabId

  // Nothing sensible to swap into: fall back to opening the module's tab (still labelled by module).
  if (!active) {
    const { state: next } = openOrActivate(state, viewId)
    return {
      ...next,
      lastClicked: viewId,
      narration: `Opened a tab for “${itemLabel(viewId)}” — labelled “${mod.label}” after its module, not after its content (observation 4).`,
    }
  }

  // Swap the active tab's content in place; its id changes but its label stays the module name.
  return {
    ...state,
    tabs: state.tabs.map((t) => (t.id === active ? { id: viewId } : t)),
    activeTabId: viewId,
    lastClicked: viewId,
    narration: `Switched view — the tab is still labelled '${mod.label}' and gives no hint what is inside it (observation 4).`,
  }
}

function currentActivateTab(state: NavState, tabId: string): NavState {
  if (tabId === state.activeTabId) {
    return { ...state, narration: 'Clicked the tab that was already active — nothing changed.' }
  }
  const highlight = state.lastClicked ? moduleOf(state.lastClicked).label : 'nothing'
  const mismatch = state.lastClicked !== tabId
  return {
    ...state,
    activeTabId: tabId,
    narration: mismatch
      ? `Switched tabs — the sidebar still highlights ${highlight}, not ${moduleOf(tabId).label} (observation 7).`
      : `Switched tabs — the sidebar happens to match because you last clicked ${highlight} (observation 7).`,
  }
}

/* ------------------------------------------------------------------ */
/* CONCEPT — the active tab is the only source of truth for location. */
/* ------------------------------------------------------------------ */

function conceptClickModule(state: NavState, moduleId: string): NavState {
  const mod = MODULES.find((m) => m.id === moduleId)!
  // If the module already has a tab open (any view/record/sub-module of it), activate that one —
  // never a duplicate. Otherwise open its default view.
  const existing = state.tabs.find((t) => moduleOf(t.id).id === moduleId)
  const targetId = existing ? existing.id : mod.children ? mod.children[0].id : moduleId
  const { state: next, wasOpen } = openOrActivate(state, targetId)
  return {
    ...next,
    expanded: mod.children ? ensure(next.expanded, moduleId) : next.expanded,
    narration: wasOpen
      ? `Activated “${contentLabelOf(targetId)}” — clicking a module never collapses its sub-items (rule 3).`
      : `Opened “${contentLabelOf(targetId)}” — the module name navigates; the chevron alone controls expansion (rule 4).`,
  }
}

function conceptClickChevron(state: NavState, moduleId: string): NavState {
  const mod = MODULES.find((m) => m.id === moduleId)!
  const nowExpanded = !state.expanded.includes(moduleId)
  return {
    ...state,
    expanded: toggle(state.expanded, moduleId),
    narration: nowExpanded
      ? `Expanded “${mod.label}” via its chevron — no navigation, the active tab is untouched (rule 4).`
      : `Collapsed “${mod.label}” via its chevron — no navigation, the active tab is untouched (rule 4).`,
  }
}

function conceptClickItem(state: NavState, itemId: string): NavState {
  const kind = itemKind(itemId)
  if (kind === 'view') return conceptClickView(state, itemId)
  if (kind === 'record') return conceptClickRecord(state, itemId)

  // Sub-modules keep the rule-2 behaviour.
  const { state: next, wasOpen } = openOrActivate(state, itemId)
  const mod = moduleOf(itemId)
  const sameModuleTabs = next.tabs.filter((t) => moduleOf(t.id).id === mod.id).length
  return {
    ...next,
    narration: wasOpen
      ? `Activated “${contentLabelOf(itemId)}” — already open, so no duplicate tab (rule 3).`
      : sameModuleTabs > 1
        ? 'Opened a second view — the tab is named by its content (rule 2).'
        : `Opened “${contentLabelOf(itemId)}” — the tab is labelled by its content, not its module (rule 2).`,
  }
}

/** Rule 5: a saved view is a lens on a list — it changes what the ACTIVE tab shows and re-labels it.
 *  It never hijacks another module's tab; in that case a new tab for its own module opens. */
function conceptClickView(state: NavState, viewId: string): NavState {
  const mod = moduleOf(viewId)
  const active = state.activeTabId

  if (active === viewId) {
    return { ...state, narration: 'Clicked the view that is already shown — nothing changed.' }
  }

  // Already open elsewhere (e.g. left over from Current mode): activate it, never duplicate (rule 3).
  if (state.tabs.some((t) => t.id === viewId)) {
    return {
      ...state,
      activeTabId: viewId,
      narration: `Activated “${contentLabelOf(viewId)}” — already open, so no duplicate tab (rule 3).`,
    }
  }

  // Active tab belongs to a different module (or nothing is open) → new tab for this module.
  if (!active || moduleOf(active).id !== mod.id) {
    return {
      ...state,
      tabs: [...state.tabs, { id: viewId }],
      activeTabId: viewId,
      narration: `Opened “${contentLabelOf(viewId)}” in a new tab — a view never takes over another module’s tab (rule 5).`,
    }
  }

  // Same module: swap the active tab's content and name in place. Tab count stays the same.
  return {
    ...state,
    tabs: state.tabs.map((t) => (t.id === active ? { id: viewId } : t)),
    activeTabId: viewId,
    narration: 'Switched view — the active tab changed its content and its name, no new tab (rule 5).',
  }
}

/** Rule 5: a record is worked on in parallel — it always gets its own tab. */
function conceptClickRecord(state: NavState, recordId: string): NavState {
  const { state: next, wasOpen } = openOrActivate(state, recordId)
  return {
    ...next,
    narration: wasOpen
      ? `Activated “${contentLabelOf(recordId)}” — already open, so no duplicate tab (rule 3).`
      : 'Opened a record — it gets its own tab, because records are worked on in parallel (rule 5).',
  }
}

function conceptActivateTab(state: NavState, tabId: string): NavState {
  if (tabId === state.activeTabId) {
    return { ...state, narration: 'Clicked the tab that was already active — nothing changed.' }
  }
  return {
    ...state,
    activeTabId: tabId,
    narration: `Switched tabs — the sidebar highlight follows to ${itemLabel(tabId)} (rule 1).`,
  }
}

/* ------------------------------------------------------------------ */
/* Shared: closing a tab.                                              */
/* ------------------------------------------------------------------ */

function closeTab(state: NavState, tabId: string): NavState {
  const index = state.tabs.findIndex((t) => t.id === tabId)
  if (index === -1) return state
  const tabs = state.tabs.filter((t) => t.id !== tabId)
  let activeTabId = state.activeTabId
  if (state.activeTabId === tabId) {
    const neighbour = tabs[index] ?? tabs[index - 1] ?? null
    activeTabId = neighbour?.id ?? null
  }
  const label = tabLabel({ id: tabId }, state.mode)
  const narration =
    state.mode === 'current'
      ? `Closed “${label}” — the sidebar highlight stays where you last clicked, whatever tab is active now (observation 7).`
      : activeTabId
        ? `Closed “${label}” — the sidebar highlight moves with the newly active tab (rule 1).`
        : `Closed “${label}” — no tab is open, so nothing in the sidebar is highlighted (rule 1).`
  return { ...state, tabs, activeTabId, narration }
}
