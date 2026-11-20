'use client'

import { useLayoutEffect, useRef, useState, type DependencyList } from 'react'

export type IndicatorBox = { top: number; left: number; width: number; height: number } | null

/**
 * Measures the element marked `[data-indicator-target]` inside the container and returns its box,
 * so one highlight can slide between items instead of jumping. The highlight moves only when the
 * marked element changes, which is the point of the demo: in Current state it stays behind.
 */
export function useSlidingIndicator<T extends HTMLElement>(deps: DependencyList) {
  const ref = useRef<T>(null)
  const [box, setBox] = useState<IndicatorBox>(null)

  useLayoutEffect(() => {
    const root = ref.current
    if (!root) return
    const measure = () => {
      const target = root.querySelector<HTMLElement>('[data-indicator-target]')
      if (!target) return setBox(null)
      const r = root.getBoundingClientRect()
      const t = target.getBoundingClientRect()
      setBox({ top: t.top - r.top + root.scrollTop, left: t.left - r.left, width: t.width, height: t.height })
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(root)
    return () => ro.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return { ref, box }
}
