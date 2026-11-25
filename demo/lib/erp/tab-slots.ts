export type TabSlot = { key: string; id: string }

/**
 * Keeps a stable key per tab shell.
 * An in-place view swap changes the id at the same index and must reuse the key,
 * otherwise the tab would play the open animation when it was only renamed.
 * A tab that appears or disappears gets its own key, so the row can ease it in or out.
 */
export function reconcileTabSlots(prev: TabSlot[], ids: string[], nextKey: () => string): TabSlot[] {
  const used = new Set<number>()
  const byId = ids.map((id) => {
    const index = prev.findIndex((slot, i) => !used.has(i) && slot.id === id)
    if (index === -1) return -1
    used.add(index)
    return index
  })

  return ids.map((id, i) => {
    const match = byId[i]
    if (match !== -1) return { key: prev[match].key, id }
    // Same position, and nothing else claimed that shell: the id was replaced in place.
    if (prev[i] && !used.has(i)) {
      used.add(i)
      return { key: prev[i].key, id }
    }
    return { key: nextKey(), id }
  })
}
