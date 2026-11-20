import { CalendarDays, LayoutGrid, MoreVertical, Plus, Search, ShoppingCart, SlidersHorizontal } from 'lucide-react'
import { AUFTRAEGE, eur, type Bezahlstatus, type Versandstatus } from '@/lib/erp/mock-data'
import { Card, Crumb, FakeCheckbox, FakeSelect, HeaderActions, IconBox, Pill, td, th } from './primitives'

const BEZAHL_TONE: Record<Bezahlstatus, 'success' | 'warning' | 'danger'> = {
  Bezahlt: 'success',
  Überfällig: 'warning',
  'Nicht bezahlt': 'danger',
  Storniert: 'danger',
}

const VERSAND_TONE: Record<Versandstatus, 'success' | 'info' | 'neutral'> = {
  Geliefert: 'success',
  'Teilweise geliefert': 'info',
  Offen: 'neutral',
}

function Th({ children, className, kebab = true }: { children?: React.ReactNode; className?: string; kebab?: boolean }) {
  return (
    <th className={`${th} ${className ?? ''}`}>
      <div className="flex items-center justify-between gap-2">
        <span>{children}</span>
        {kebab && <MoreVertical className="size-3.5 text-muted-foreground" aria-hidden="true" />}
      </div>
    </th>
  )
}

export function Auftraege({ moduleLabel }: { moduleLabel: string }) {
  return (
    <div className="flex flex-col gap-5">
      <Crumb icon={LayoutGrid}>{moduleLabel} / Aufträge</Crumb>

      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-4">
          <IconBox icon={ShoppingCart} />
          <h1 className="truncate text-[28px] font-semibold leading-tight text-foreground">Aufträge</h1>
          <span className="mx-1 h-6 w-px bg-border" aria-hidden="true" />
          <Pill tone="success">Gespeichert</Pill>
        </div>
        <HeaderActions>
          <button
            type="button"
            className="flex h-10 items-center gap-2 rounded-lg bg-foreground px-4 text-[15px] font-medium text-background hover:opacity-90"
          >
            <Plus className="size-4" aria-hidden="true" />
            Auftrag anlegen
          </button>
        </HeaderActions>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <label className="flex h-10 w-48 items-center gap-2 rounded-lg border border-border bg-card px-3 text-[15px] text-muted-foreground">
          <Search className="size-4" aria-hidden="true" />
          <input type="search" placeholder="Find in Table" className="min-w-0 flex-1 bg-transparent text-foreground outline-none placeholder:text-muted-foreground" />
          <SlidersHorizontal className="size-4" aria-hidden="true" />
        </label>
        <FakeSelect label="Auftragsdatum" icon={CalendarDays} />
        <FakeSelect label="Vorgang" />
        <FakeSelect label="Kundschaft" />
        <FakeSelect label="Zahlungsart" />
        <button type="button" className="h-10 px-1 text-[15px] text-primary hover:underline">
          Filter speichern
        </button>
        <FakeSelect label="Spalten" className="ml-auto" />
      </div>

      <Card className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-border">
              <Th kebab={false}>
                <span className="flex items-center gap-4">
                  <FakeCheckbox label="Alle auswählen" />
                  Auftragsnummer
                </span>
              </Th>
              <Th>Auftragsdatum</Th>
              <Th>Kundschaftsnr</Th>
              <Th>Auftragswert netto</Th>
              <Th>Auftragswert brutto</Th>
              <Th>Zahlungsart</Th>
              <Th>Bezahlstatus</Th>
              <Th kebab={false}>Versandstatus</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {AUFTRAEGE.map((a) => (
              <tr key={a.nr}>
                <td className={td}>
                  <span className="flex items-center gap-4">
                    <FakeCheckbox label={`${a.nr} auswählen`} />
                    <button type="button" className="text-primary hover:underline">
                      {a.nr}
                    </button>
                  </span>
                </td>
                <td className={td}>{a.datum}</td>
                <td className={td}>{a.kundeNr}</td>
                <td className={`${td} tabular-nums`}>{eur(a.netto)}</td>
                <td className={`${td} tabular-nums`}>{eur(a.brutto)}</td>
                <td className={td}>{a.zahlungsart}</td>
                <td className={td}>
                  <Pill tone={BEZAHL_TONE[a.bezahl]} rounded="md">
                    {a.bezahl}
                  </Pill>
                </td>
                <td className={td}>
                  <Pill tone={VERSAND_TONE[a.versand]} rounded="md">
                    {a.versand}
                  </Pill>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  )
}
