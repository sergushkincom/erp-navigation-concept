'use client'

import { useRef } from 'react'
import { X } from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import type { Mode } from '@/lib/erp/modules'
import { tabLabel, type Tab } from '@/lib/erp/navigation'
import { reconcileTabSlots, type TabSlot } from '@/lib/erp/tab-slots'
import { cn } from '@/lib/utils'
import { DisagreementMarker, TAB_SIDEBAR_DISAGREEMENT_LABEL } from './disagreement-marker'

/** Same ease as the sidebar highlight, long enough to see the neighbours move. */
const TAB_EASE = [0.22, 1, 0.36, 1] as const

/**
 * A view swap changes a tab's id in place. The shell key has to survive that,
 * or the renamed tab would shrink away and grow back.
 */
function useTabSlots(tabs: Tab[]): TabSlot[] {
  const serial = useRef(0)
  const slots = useRef<TabSlot[] | null>(null)
  const signature = tabs.map((tab) => tab.id).join('\0')
  const current = slots.current?.map((slot) => slot.id).join('\0')
  if (slots.current === null || current !== signature) {
    slots.current = reconcileTabSlots(slots.current ?? [], tabs.map((tab) => tab.id), () => {
      serial.current += 1
      return `tab-${serial.current}`
    })
  }
  return slots.current
}

type Props = {
  mode: Mode
  tabs: Tab[]
  activeTabId: string | null
  /** Current state only. Ignored in Concept, where the tab is the source of truth. */
  disagree: boolean
  onActivate: (tabId: string) => void
  onClose: (tabId: string) => void
}

export function TabBar({ mode, tabs, activeTabId, disagree, onActivate, onClose }: Props) {
  const showDisagreement = mode === 'current' && disagree
  const reduceMotion = useReducedMotion() === true
  const slots = useTabSlots(tabs)

  return (
    <div
      role="tablist"
      aria-label="Offene Ansichten"
      className="flex h-14 shrink-0 items-end overflow-x-auto border-b border-border bg-sidebar pl-6"
    >
      {tabs.length === 0 && (
        <p className="self-center text-[15px] text-muted-foreground">Keine Ansicht geöffnet</p>
      )}
      <AnimatePresence initial={false}>
        {tabs.map((tab, index) => {
          const active = tab.id === activeTabId
          const label = tabLabel(tab, mode)
          return (
            <motion.div
              key={slots[index].key}
              // The shell's width is the layout change, so neighbours in the flex row slide.
              // The tab inside stays at its real size and is clipped, instead of squashing its label.
              initial={reduceMotion ? false : { width: 0, opacity: 0 }}
              animate={{ width: 'auto', opacity: 1 }}
              exit={
                reduceMotion
                  ? { opacity: 1, transition: { duration: 0 } }
                  : { width: 0, opacity: 0 }
              }
              transition={reduceMotion ? { duration: 0 } : { duration: 0.3, ease: TAB_EASE }}
              className={cn('min-w-0 shrink-0 self-end overflow-hidden', active && '-mb-px')}
            >
              <div
                title={active && showDisagreement ? `${label} — ${TAB_SIDEBAR_DISAGREEMENT_LABEL}` : label}
                className={cn(
                  'group relative flex h-12 w-max min-w-[100px] items-center rounded-t-[12px] border border-b-0 text-[16px] font-semibold',
                  active
                    ? 'max-w-[240px] border-border bg-background pl-6 pr-3 text-foreground'
                    : 'max-w-[200px] border-transparent px-6 text-foreground/80 hover:text-foreground',
                )}
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={active}
                  title={active && showDisagreement ? TAB_SIDEBAR_DISAGREEMENT_LABEL : undefined}
                  onClick={() => onActivate(tab.id)}
                  className={cn('relative flex h-full min-w-0 flex-1 items-center text-left', active && 'pr-2')}
                >
                  <span className="truncate whitespace-nowrap">{label}</span>
                  {active && showDisagreement && (
                    <DisagreementMarker className="absolute top-0 bottom-0 -left-4 my-auto h-2 w-2" />
                  )}
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
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
