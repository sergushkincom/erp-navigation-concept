import { cn } from '@/lib/utils'

/** Tooltip and accessible name when the active tab and the sidebar selection differ. */
export const TAB_SIDEBAR_DISAGREEMENT_LABEL = 'Tab and sidebar disagree'

/**
 * Small amber dot. The fade lives on `.disagreement-marker` and only runs when the user
 * has not asked for reduced motion. The visible dot is decorative; the text is the name.
 */
export function DisagreementMarker({ className }: { className?: string }) {
  return (
    <span
      title={TAB_SIDEBAR_DISAGREEMENT_LABEL}
      data-disagreement-marker=""
      className={cn('inline-flex size-2 shrink-0', className)}
    >
      <span aria-hidden="true" className="disagreement-marker size-2 rounded-full bg-amber-600 ring-2 ring-background" />
      <span className="sr-only">{TAB_SIDEBAR_DISAGREEMENT_LABEL}</span>
    </span>
  )
}
