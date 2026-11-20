'use client'

import type { Mode } from '@/lib/erp/modules'
import { cn } from '@/lib/utils'

const OPTIONS: { value: Mode; label: string }[] = [
  { value: 'current', label: 'Current state (today)' },
  { value: 'concept', label: 'Concept: one source of truth' },
]

export function ModeSwitcher({ mode, onChange }: { mode: Mode; onChange: (mode: Mode) => void }) {
  return (
    <div
      role="radiogroup"
      aria-label="Behaviour mode"
      className="flex items-center gap-0.5 rounded-md bg-secondary p-0.5 text-[13px]"
    >
      {OPTIONS.map((opt) => {
        const active = opt.value === mode
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(opt.value)}
            className={cn(
              'rounded-[6px] px-3 py-1.5 font-medium transition-colors',
              active
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}
