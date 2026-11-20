import { CalendarDays, LayoutGrid, List, MoreVertical, Search, SlidersHorizontal, X } from 'lucide-react'
import { ARTIKEL, eur } from '@/lib/erp/mock-data'
import { Card, Crumb, FakeCheckbox, FakeSelect, HeaderActions, IconBox, Pill, td, th } from './primitives'

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

export function ArtikelListe({ title }: { title: string }) {
  return (
    <div className="flex flex-col gap-5">
      <Crumb icon={LayoutGrid}>Artikelübersicht</Crumb>

      {/* Title row */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-4">
          <IconBox icon={List} />
          <h1 className="truncate text-[28px] font-semibold leading-tight text-foreground">{title}</h1>
          <div className="flex items-center gap-2">
            {[0, 1, 2].map((i) => (
              <Pill key={i} tone="dark">
                Label
                <X className="size-3 opacity-80" aria-hidden="true" />
              </Pill>
            ))}
          </div>
          <span className="mx-1 h-6 w-px bg-border" aria-hidden="true" />
          <Pill tone="success">Gespeichert</Pill>
        </div>
        <HeaderActions />
      </div>

      {/* Filter row */}
      <div className="flex flex-wrap items-center gap-3">
        <label className="flex h-10 w-48 items-center gap-2 rounded-lg border border-border bg-card px-3 text-[15px] text-muted-foreground">
          <Search className="size-4" aria-hidden="true" />
          <input
            type="search"
            placeholder="Find in Table"
            className="min-w-0 flex-1 bg-transparent text-foreground outline-none placeholder:text-muted-foreground"
          />
          <SlidersHorizontal className="size-4" aria-hidden="true" />
        </label>
        <button
          type="button"
          className="flex h-10 items-center gap-2 rounded-lg border border-border bg-card px-3 text-[15px] text-foreground hover:bg-secondary"
        >
          <CalendarDays className="size-4" aria-hidden="true" />
          Datum auswählen
        </button>
        <FakeSelect label="[Filtername]" />
        <FakeSelect label="[Filtername]" />
        <FakeSelect label="[Filtername]" />
        <button type="button" className="h-10 px-1 text-[15px] text-primary hover:underline">
          Filter speichern
        </button>
        <FakeSelect label="Spalten" className="ml-auto" />
      </div>

      {/* Table */}
      <Card className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-border">
              <Th kebab={false} className="w-[20%]">
                <span className="flex items-center gap-4">
                  <FakeCheckbox label="Alle auswählen" />
                  Artikelnummer
                </span>
              </Th>
              <Th className="w-[18%]">Artikelname</Th>
              <Th className="w-[18%]">Preis Netto</Th>
              <Th className="w-[18%]">Lagerbestand</Th>
              <Th className="w-[18%]">Aktiv</Th>
              <Th kebab={false}>Status</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {ARTIKEL.map((a) => (
              <tr key={a.nr}>
                <td className={td}>
                  <span className="flex items-center gap-4">
                    <FakeCheckbox label={`${a.name} auswählen`} />
                    {a.nr}
                  </span>
                </td>
                <td className={td}>{a.name}</td>
                <td className={`${td} tabular-nums`}>{eur(a.preisNetto)}</td>
                <td className={`${td} tabular-nums`}>{a.bestand}</td>
                <td className={td}>
                  <FakeCheckbox label={`${a.name} aktiv`} />
                </td>
                <td className={td}>
                  <Pill tone="success" rounded="md">
                    Aktiv
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
