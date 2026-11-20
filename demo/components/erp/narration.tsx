'use client'

import type { Mode } from '@/lib/erp/modules'
import { cn } from '@/lib/utils'

/**
 * The line under the header that says what each click just did. A narration that ends in
 * "(observation N)" or "(rule N)" gets a badge, so Current state reads as a list of problems and
 * Concept as a list of rules. Each new line slides in; with reduced motion it simply appears.
 */
export function Narration({ text, mode }: { text: string; mode: Mode }) {
  const match = text.match(/\s*\((observation|rule)s? ([\d, and]+)\)\.?$/i)
  const kind = match?.[1].toLowerCase() as 'observation' | 'rule' | undefined
  const body = match ? text.slice(0, match.index) : text

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'relative shrink-0 overflow-hidden border-b border-border px-4 py-2 text-[13px] transition-colors duration-300',
        mode === 'concept' ? 'bg-success-soft/40' : 'bg-background',
      )}
    >
      <p
        key={text}
        className="flex items-center gap-2 text-muted-foreground motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-1 motion-safe:duration-300"
      >
        {kind && (
          <span
            className={cn(
              'inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium',
              kind === 'observation' ? 'bg-warning-soft text-warning' : 'bg-success-soft text-success',
            )}
          >
            <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />
            {kind === 'observation' ? 'Observation' : 'Rule'} {match![2].trim()}
          </span>
        )}
        <span className="text-foreground/80">{body}</span>
      </p>
    </div>
  )
}
