'use client'

import { Box, ChevronDown, Clock, Euro, LayoutDashboard, Puzzle, Settings, ShoppingCart, TrendingUp } from 'lucide-react'
import { CartesianGrid, ComposedChart, Line, ResponsiveContainer, Scatter, Tooltip, XAxis, YAxis } from 'recharts'
import {
  LIEFERZEITEN,
  OFFENE_BESTELLUNGEN,
  REKLAMATIONEN,
  SUPPORTFAELLE,
  TOP_KUNDEN,
  TOP_SELLER,
  UMSATZ,
  eurShort,
} from '@/lib/erp/mock-data'
import { cn } from '@/lib/utils'
import { Card, IconBox, Pill } from './primitives'

type Tone = 'success' | 'warning' | 'danger' | 'info'

const KPIS: { label: string; value: string; hint: string; tone: Tone; icon: React.ComponentType<{ className?: string }> }[] = [
  { label: 'Umsatz aktuell', value: '€86.240', hint: '+7% zum Vormonat', tone: 'success', icon: Euro },
  { label: 'Gewinn', value: '€21.370', hint: '-3% zum Vormonat', tone: 'danger', icon: TrendingUp },
  { label: 'Offene Aufträge', value: '31', hint: '6 dringend', tone: 'warning', icon: ShoppingCart },
  { label: 'Lagerwert gesamt', value: '€148.900', hint: '612 Artikel', tone: 'info', icon: Box },
]

const ICON_TONE: Record<Tone, string> = {
  success: 'text-success',
  danger: 'text-danger',
  warning: 'text-warning',
  info: 'text-info',
}

const COUNT_TONE = {
  danger: 'text-danger',
  warning: 'text-warning',
  neutral: 'text-foreground',
} as const

/** Full-width grey segmented control used above charts and lists. */
function Segmented({ options, active }: { options: string[]; active: string }) {
  return (
    <div role="tablist" className="flex h-10 items-stretch rounded-md bg-secondary p-0.5 text-[15px]">
      {options.map((o) => (
        <button
          key={o}
          type="button"
          role="tab"
          aria-selected={o === active}
          className={cn(
            'flex-1 rounded-[5px]',
            o === active ? 'bg-card text-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground',
          )}
        >
          {o}
        </button>
      ))}
    </div>
  )
}

function CardTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="flex flex-col gap-1">
      <h2 className="text-[20px] font-semibold leading-tight text-foreground">{title}</h2>
      {subtitle && <p className="text-[15px] text-muted-foreground">{subtitle}</p>}
    </div>
  )
}

function Bar({ value, max, className }: { value: number; max: number; className?: string }) {
  return (
    <div className={cn('h-1.5 w-full overflow-hidden rounded-full bg-secondary', className)} aria-hidden="true">
      <div className="h-full rounded-full bg-chart-1" style={{ width: `${Math.round((value / max) * 100)}%` }} />
    </div>
  )
}

export function Dashboard() {
  return (
    <div className="flex flex-col gap-5">
      {/* Title row */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <IconBox icon={LayoutDashboard} />
          <div className="flex flex-col">
            <span className="text-[15px] font-medium text-muted-foreground">Dashboard</span>
            <button type="button" className="flex items-center gap-2 text-[24px] font-semibold leading-tight text-foreground">
              Daily Dashboard
              <ChevronDown className="size-5" aria-hidden="true" />
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" aria-label="Einstellungen" className="flex size-10 items-center justify-center rounded-lg text-foreground hover:bg-secondary">
            <Settings className="size-4" />
          </button>
          <button type="button" aria-label="Erweiterungen" className="flex size-10 items-center justify-center rounded-lg border border-border bg-card text-foreground hover:bg-secondary">
            <Puzzle className="size-4" />
          </button>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 gap-5 xl:grid-cols-4">
        {KPIS.map((k) => {
          const Icon = k.icon
          return (
            <Card key={k.label} className="flex flex-col gap-4 p-6">
              <div className="flex items-center justify-between">
                <p className="text-[15px] font-medium text-foreground">{k.label}</p>
                <Icon className={cn('size-5', ICON_TONE[k.tone])} aria-hidden="true" />
              </div>
              <p className="text-[32px] font-bold leading-none tabular-nums text-foreground">{k.value}</p>
              <div>
                <Pill tone={k.tone}>{k.hint}</Pill>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Chart + top sellers */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <Card className="flex flex-col gap-5 p-6">
          <CardTitle title="Umsatzentwicklung" subtitle="Umsatz der letzten 6 Monate" />
          <Segmented options={['Letzten 6 Monate', 'Ganzes Jahr']} active="Letzten 6 Monate" />
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={UMSATZ} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
                <CartesianGrid vertical={false} stroke="var(--border)" />
                <XAxis dataKey="monat" axisLine={false} tickLine={false} tick={{ fontSize: 13, fill: 'var(--muted-foreground)' }} />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  width={44}
                  domain={[0, 20000]}
                  ticks={[0, 5000, 10000, 15000, 20000]}
                  tick={{ fontSize: 13, fill: 'var(--muted-foreground)' }}
                  tickFormatter={(v: number) => (v === 0 ? '0' : `${Math.round(v / 1000)}k`)}
                />
                <Tooltip
                  cursor={{ stroke: 'var(--border)' }}
                  contentStyle={{ fontSize: 13, borderRadius: 8, border: '1px solid var(--border)', boxShadow: 'none' }}
                  formatter={(v) => [`€${Number(v).toLocaleString('de-DE')}`, 'Umsatz']}
                />
                <Line type="natural" dataKey="umsatz" stroke="var(--chart-1)" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
                <Scatter dataKey="punkt" fill="var(--chart-1)" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-2 text-[13px] text-foreground">
            <span className="size-2.5 rounded-[2px] bg-chart-1" aria-hidden="true" />
            Item 1
          </div>
        </Card>

        <Card className="flex flex-col gap-5 p-6">
          <CardTitle title="Bestand an Top-Sellern" subtitle="2 von 4 Top-Sellern haben einen Kritischen Lagerbestand" />
          <ul className="flex flex-col divide-y divide-border">
            {TOP_SELLER.map((t) => (
              <li key={t.name} className="flex items-end justify-between gap-6 py-4 first:pt-0 last:pb-0">
                <div className="flex flex-col gap-1.5">
                  <span className="text-[16px] font-semibold text-foreground">{t.name}</span>
                  <span className="flex items-center gap-2 text-[15px] text-muted-foreground">
                    Bestand: {t.bestand}
                    {t.kritisch && <Pill tone="danger">Kritisch</Pill>}
                  </span>
                </div>
                <div className="flex w-32 shrink-0 flex-col items-end gap-2">
                  <span className="text-[13px] tabular-nums text-muted-foreground">
                    {t.bestand}/{t.max}
                  </span>
                  <Bar value={t.bestand} max={t.max} />
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Lower row */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <Card className="flex flex-col gap-5 p-6">
          <CardTitle title="Top 5 Kunden & Artikel" />
          <Segmented options={['Kunden', 'Artikel']} active="Kunden" />
          <ul className="flex flex-col gap-5">
            {TOP_KUNDEN.map((k) => (
              <li key={k.name} className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-[16px]">
                  <span className="font-semibold text-foreground">{k.name}</span>
                  <span className="tabular-nums text-foreground">{eurShort(k.umsatz)}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Bar value={k.anteil} max={50} />
                  <span className="w-8 text-right text-[13px] tabular-nums text-muted-foreground">
                    {String(k.anteil).padStart(2, '0')}%
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="flex flex-col gap-5 p-6">
          <CardTitle title="Lieferzeiten" />
          <section className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="text-[16px] font-semibold text-foreground">Lieferzeiten im Durchschnitt</h3>
              <Pill tone="success">
                <Clock className="size-3" aria-hidden="true" />
                3.2 Tage
              </Pill>
            </div>
            <ul className="flex flex-col gap-3 text-[15px]">
              {LIEFERZEITEN.map((l) => (
                <li key={l.name} className="flex items-center justify-between">
                  <span className="font-medium text-foreground">{l.name}</span>
                  <span className="text-foreground">{l.tage}</span>
                </li>
              ))}
            </ul>
          </section>
          <hr className="border-border" />
          <section className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="text-[16px] font-semibold text-foreground">Offene Bestellungen</h3>
              <Pill tone="warning">47</Pill>
            </div>
            <ul className="flex flex-col gap-3 text-[15px]">
              {OFFENE_BESTELLUNGEN.map((b) => (
                <li key={b.name} className="flex items-center justify-between">
                  <span className="font-medium text-foreground">{b.name}</span>
                  <span className={cn('tabular-nums', COUNT_TONE[b.tone])}>{b.wert}</span>
                </li>
              ))}
            </ul>
          </section>
        </Card>

        <Card className="flex flex-col gap-5 p-6">
          <CardTitle title="Support" />
          <section className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="text-[16px] font-semibold text-foreground">Supportfälle</h3>
              <Pill tone="danger">
                <Clock className="size-3" aria-hidden="true" />
                24 offen
              </Pill>
            </div>
            <ul className="flex flex-col gap-3 text-[15px]">
              {SUPPORTFAELLE.map((s) => (
                <li key={s.name} className="flex items-center justify-between">
                  <span className="font-medium text-foreground">{s.name}</span>
                  <span className={cn('tabular-nums', COUNT_TONE[s.tone])}>{s.wert}</span>
                </li>
              ))}
            </ul>
          </section>
          <hr className="border-border" />
          <section className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="text-[16px] font-semibold text-foreground">Reklamationen</h3>
              <Pill tone="warning">12 im letzten Monat</Pill>
            </div>
            <ul className="flex flex-col gap-3 text-[15px]">
              {REKLAMATIONEN.map((r) => (
                <li key={r.name} className="flex items-center justify-between">
                  <span className="font-medium text-foreground">{r.name}</span>
                  <span className="tabular-nums text-foreground">{r.wert}</span>
                </li>
              ))}
            </ul>
          </section>
        </Card>
      </div>
    </div>
  )
}
