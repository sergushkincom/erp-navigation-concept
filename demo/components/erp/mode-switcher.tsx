'use client'

import type { Mode } from '@/lib/erp/modules'
import { cn } from '@/lib/utils'
import { useSlidingIndicator } from './use-sliding-indicator'

const OPTIONS: { value: Mode; label: string }[] = [
  { value: 'current', label: 'Current state (today)' },
  { value: 'concept', label: 'Concept: one source of truth' },
]

export function ModeSwitcher({ mode, onChange }: { mode: Mode; onChange: (mode: Mode) => void }) {
  const { ref, box } = useSlidingIndicator<HTMLDivElement>([mode])
  return (
    <div
      ref={ref}
      role="radiogroup"
      aria-label="Behaviour mode"
      className="relative flex items-center gap-0.5 rounded-md bg-secondary p-0.5 text-[13px]"
    >
      {box && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0 rounded-[6px] bg-background shadow-sm motion-safe:transition-[transform,width] motion-safe:duration-300 motion-safe:ease-[cubic-bezier(0.2,0.8,0.2,1)]"
          style={{ transform: `translate(${box.left}px, ${box.top}px)`, width: box.width, height: box.height }}
        />
      )}
      {OPTIONS.map((opt) => {
        const active = opt.value === mode
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={active}
            data-indicator-target={active ? '' : undefined}
            onClick={() => onChange(opt.value)}
            className={cn(
              'relative z-10 rounded-[6px] px-3 py-1.5 font-medium transition-colors',
              active ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {active && opt.value === 'concept' && (
              <span aria-hidden="true" className="mr-1.5 inline-block size-1.5 -translate-y-px rounded-full bg-success" />
            )}
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}
