import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { initialNavState, navReducer, tabAndSidebarDisagree, type NavState } from './navigation'

function state(partial: Partial<NavState>): NavState {
  return { ...initialNavState, ...partial }
}

describe('tabAndSidebarDisagree', () => {
  it('is quiet when the sidebar selection and the active tab are the same item', () => {
    assert.equal(
      tabAndSidebarDisagree(state({ mode: 'current', activeTabId: 'dashboard', lastClicked: 'dashboard' })),
      false,
    )
  })

  it('is quiet when the selection is the module that owns the active tab', () => {
    assert.equal(
      tabAndSidebarDisagree(
        state({ mode: 'current', activeTabId: 'artikel.artikelverwaltung', lastClicked: 'artikel' }),
      ),
      false,
    )
  })

  it('flags a sidebar selection that points somewhere else', () => {
    assert.equal(
      tabAndSidebarDisagree(
        state({ mode: 'current', activeTabId: 'dashboard', lastClicked: 'artikel.artikelverwaltung' }),
      ),
      true,
    )
  })

  it('flags a different item inside the same module', () => {
    assert.equal(
      tabAndSidebarDisagree(
        state({
          mode: 'current',
          activeTabId: 'artikel.view.jacken',
          lastClicked: 'artikel.artikelverwaltung',
        }),
      ),
      true,
    )
  })

  it('never flags Concept mode, even when the stored selection differs', () => {
    assert.equal(
      tabAndSidebarDisagree(
        state({ mode: 'concept', activeTabId: 'dashboard', lastClicked: 'artikel.artikelverwaltung' }),
      ),
      false,
    )
  })

  it('stays quiet when either place is missing', () => {
    assert.equal(tabAndSidebarDisagree(state({ mode: 'current', activeTabId: null, lastClicked: 'dashboard' })), false)
    assert.equal(tabAndSidebarDisagree(state({ mode: 'current', activeTabId: 'dashboard', lastClicked: null })), false)
  })
})

describe('navReducer keeps the disagreement rule', () => {
  it('disagrees after a tab switch in Current mode and agrees again in Concept', () => {
    const opened = navReducer(initialNavState, { type: 'clickItem', itemId: 'artikel.artikelverwaltung' })
    const switched = navReducer(opened, { type: 'activateTab', tabId: 'dashboard' })
    assert.equal(switched.mode, 'current')
    assert.equal(tabAndSidebarDisagree(switched), true)

    const concept = navReducer(switched, { type: 'setMode', mode: 'concept' })
    assert.equal(tabAndSidebarDisagree(concept), false)
    assert.equal(concept.activeTabId, 'dashboard')
  })
})
