import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { reconcileTabSlots, type TabSlot } from './tab-slots'

function keys(slots: TabSlot[]) {
  return slots.map((slot) => slot.key)
}

describe('reconcileTabSlots', () => {
  it('gives each new tab its own key', () => {
    let n = 0
    const slots = reconcileTabSlots([], ['dashboard', 'artikel'], () => `k${++n}`)
    assert.deepEqual(keys(slots), ['k1', 'k2'])
    assert.deepEqual(
      slots.map((slot) => slot.id),
      ['dashboard', 'artikel'],
    )
  })

  it('keeps keys when a tab opens or closes', () => {
    const prev: TabSlot[] = [
      { key: 'a', id: 'dashboard' },
      { key: 'b', id: 'artikel' },
      { key: 'c', id: 'verkauf' },
    ]
    let n = 0
    const opened = reconcileTabSlots(prev, ['dashboard', 'artikel', 'verkauf', 'zahlungen'], () => `n${++n}`)
    assert.deepEqual(keys(opened), ['a', 'b', 'c', 'n1'])

    const closed = reconcileTabSlots(opened, ['dashboard', 'verkauf', 'zahlungen'], () => `x${++n}`)
    assert.deepEqual(keys(closed), ['a', 'c', 'n1'])
  })

  it('reuses the shell when a view swap only changes the id', () => {
    const prev: TabSlot[] = [
      { key: 'a', id: 'dashboard' },
      { key: 'b', id: 'artikel.artikelverwaltung' },
    ]
    const next = reconcileTabSlots(prev, ['dashboard', 'artikel.view.alle-aktiv'], () => {
      throw new Error('a rename should not open a new tab')
    })
    assert.deepEqual(keys(next), ['a', 'b'])
    assert.equal(next[1].id, 'artikel.view.alle-aktiv')
  })

  it('drops the oldest shell when the cap makes room for a new tab', () => {
    const prev: TabSlot[] = [
      { key: 'a', id: 'one' },
      { key: 'b', id: 'two' },
      { key: 'c', id: 'three' },
      { key: 'd', id: 'four' },
    ]
    let n = 0
    const next = reconcileTabSlots(prev, ['two', 'three', 'four', 'five'], () => `n${++n}`)
    assert.deepEqual(keys(next), ['b', 'c', 'd', 'n1'])
  })
})
