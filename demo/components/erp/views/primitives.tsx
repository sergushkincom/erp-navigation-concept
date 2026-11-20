import { ChevronDown, Lightbulb, MoreVertical, Puzzle } from 'lucide-react'
import { cn } from '@/lib/utils'

/* ------------------------------------------------------------------ */
/* Page header pieces                                                  */
/* ------------------------------------------------------------------ */

/** Small grey breadcrumb line above the title, e.g. "▣ Artikelübersicht". */
export function Crumb({ icon: Icon, children }: { icon: React.ComponentType<{ className?: string }>; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 text-[15px] text-foreground">
      <Icon className="size-4 text-muted-foreground" aria-hidden="true" />
      <span>{children}</span>
    </div>
  )
}

/** Bordered square icon box that sits left of the page title. */
export function IconBox({ icon: Icon }: { icon: React.ComponentType<{ className?: string }> }) {
  return (
    <span className="flex size-12 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-foreground">
      <Icon className="size-5" aria-hidden="true" />
    </span>
  )
}

/** "Guide ▾ ⋮ ⚙" cluster shown top-right on every page. */
export function HeaderActions({ children }: { children?: React.ReactNode }) {
  return (
    <div className="flex shrink-0 items-center gap-2">
      {children}
      <div className="flex h-10 items-stretch overflow-hidden rounded-lg border border-border bg-card text-[15px] text-foreground">
        <button type="button" className="flex items-center gap-2 px-3 hover:bg-secondary">
          <Lightbulb className="size-4" aria-hidden="true" />
          Guide
        </button>
        <button type="button" aria-label="Guide-Optionen" className="flex items-center border-l border-border px-2.5 hover:bg-secondary">
          <ChevronDown className="size-4" />
        </button>
      </div>
      <button
        type="button"
        aria-label="Weitere Aktionen"
        className="flex size-10 items-center justify-center rounded-lg text-foreground hover:bg-secondary"
      >
        <MoreVertical className="size-4" />
      </button>
      <button
        type="button"
        aria-label="Erweiterungen"
        className="flex size-10 items-center justify-center rounded-lg border border-border bg-card text-foreground hover:bg-secondary"
      >
        <Puzzle className="size-4" />
      </button>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Form-ish controls                                                    */
/* ------------------------------------------------------------------ */

/** Non-interactive filter dropdown lookalike. */
export function FakeSelect({ label, className, icon: Icon }: { label: string; className?: string; icon?: React.ComponentType<{ className?: string }> }) {
  return (
    <div
      className={cn(
        'flex h-10 items-center gap-2 rounded-lg border border-border bg-card px-3 text-[15px] text-foreground',
        className,
      )}
    >
      {Icon && <Icon className="size-4 text-foreground" aria-hidden="true" />}
      <span>{label}</span>
      <ChevronDown className="size-4 text-foreground" aria-hidden="true" />
    </div>
  )
}

export function FakeCheckbox({ checked = false, label }: { checked?: boolean; label: string }) {
  return (
    <span
      role="checkbox"
      aria-checked={checked}
      aria-label={label}
      className={cn(
        'flex size-[18px] items-center justify-center rounded-[4px] border',
        checked ? 'border-primary bg-primary' : 'border-[#9ca3af] bg-card',
      )}
    >
      {checked && (
        <svg viewBox="0 0 10 8" className="size-2.5 text-primary-foreground" aria-hidden="true">
          <path d="M1 4l3 3 5-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </span>
  )
}

export function Toggle({ on, label }: { on: boolean; label: string }) {
  return (
    <span className="flex items-center gap-2 text-[15px] text-foreground">
      <span
        role="switch"
        aria-checked={on}
        aria-label={label}
        className={cn('relative inline-flex h-6 w-11 items-center rounded-full', on ? 'bg-primary' : 'bg-[#d1d5db]')}
      >
        <span className={cn('absolute size-5 rounded-full bg-card shadow-sm transition-transform', on ? 'translate-x-5' : 'translate-x-0.5')} />
      </span>
      {label}
    </span>
  )
}

/* ------------------------------------------------------------------ */
/* Pills                                                                */
/* ------------------------------------------------------------------ */

type Tone = 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'dark'

const TONES: Record<Tone, string> = {
  success: 'bg-success-soft text-success border-success/25',
  warning: 'bg-warning-soft text-warning border-warning/25',
  danger: 'bg-danger-soft text-danger border-danger/25',
  info: 'bg-info-soft text-info border-info/25',
  neutral: 'bg-secondary text-muted-foreground border-border',
  dark: 'bg-foreground text-background border-foreground',
}

export function Pill({
  tone,
  children,
  rounded = 'full',
  className,
}: {
  tone: Tone
  children: React.ReactNode
  rounded?: 'full' | 'md'
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex h-[22px] items-center gap-1 border px-2 text-[13px] font-medium leading-none whitespace-nowrap',
        rounded === 'full' ? 'rounded-full' : 'rounded-md',
        TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}

/* ------------------------------------------------------------------ */
/* Card + table cells                                                  */
/* ------------------------------------------------------------------ */

export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn('rounded-lg border border-border bg-card', className)}>{children}</div>
}

/** Tables: 52px rows, 15px text, column dividers, no zebra. */
export const th = 'h-[52px] border-r border-border px-4 text-left text-[15px] font-normal text-foreground last:border-r-0'
export const td = 'h-[52px] border-r border-border px-4 text-[15px] text-foreground whitespace-nowrap last:border-r-0'
