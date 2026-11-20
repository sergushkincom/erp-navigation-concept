import { Check, ChevronDown, ChevronsUpDown, ImageIcon, LayoutGrid, Minus, Package, Plus, Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card, Crumb, HeaderActions, IconBox, Pill, Toggle } from './primitives'

const TABS = [
  'Allgemein',
  'Beschreibung',
  'Bestände',
  'Lieferanten',
  'Bilder',
  'Attribute/Merkmale',
  'Sonstiges',
  'Variationen',
  'Verkaufskanäle',
]

type FieldProps = {
  label: string
  value: string
  required?: boolean
  select?: boolean
  placeholder?: boolean
  trailing?: 'plus' | 'stepper'
  className?: string
}

function Field({ label, value, required, select, placeholder, trailing, className }: FieldProps) {
  const id = `field-${label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <label htmlFor={id} className="text-[15px] font-medium text-foreground">
        {label}
        {required && <span className="text-danger">*</span>}
      </label>
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <input
            id={id}
            defaultValue={value}
            readOnly={select}
            className={cn(
              'h-11 w-full rounded-lg border border-border bg-card px-3 text-[15px] outline-none focus:border-primary',
              select && 'pr-9',
              placeholder ? 'text-muted-foreground' : 'text-foreground',
            )}
          />
          {select && (
            <ChevronDown
              className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-foreground"
              aria-hidden="true"
            />
          )}
        </div>
        {trailing === 'plus' && (
          <button type="button" aria-label={`${label} hinzufügen`} className="flex size-11 shrink-0 items-center justify-center rounded-lg border border-border bg-secondary text-foreground">
            <Plus className="size-4" />
          </button>
        )}
        {trailing === 'stepper' && (
          <div className="flex shrink-0 items-center gap-1">
            <button type="button" aria-label={`${label} verringern`} className="flex size-8 items-center justify-center rounded-md border border-border bg-card text-foreground">
              <Minus className="size-3.5" />
            </button>
            <button type="button" aria-label={`${label} erhöhen`} className="flex size-8 items-center justify-center rounded-md border border-border bg-card text-foreground">
              <Plus className="size-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

/** Fieldset with the legend floating on the top border. */
function Group({ title, className, children }: { title: string; className?: string; children: React.ReactNode }) {
  return (
    <fieldset className={cn('relative rounded-lg border border-border px-4 pb-5 pt-6', className)}>
      <legend className="px-1 text-[15px] text-muted-foreground">{title}</legend>
      {children}
    </fieldset>
  )
}

export function ArtikelStammdaten() {
  return (
    <div className="flex flex-col gap-5">
      <Crumb icon={LayoutGrid}>Artikel</Crumb>

      {/* Title row */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-4">
          <IconBox icon={Package} />
          <h1 className="truncate text-[28px] font-semibold leading-tight text-foreground">Wanderjacke Fjellrygg</h1>
          <span className="mx-1 h-6 w-px bg-border" aria-hidden="true" />
          <Pill tone="info">Standardartikel</Pill>
        </div>
        <HeaderActions>
          <Toggle on label="Artikel aktiv" />
        </HeaderActions>
      </div>

      {/* Tabs */}
      <div role="tablist" className="flex gap-6 border-b border-border text-[15px]">
        {TABS.map((t, i) => (
          <button
            key={t}
            type="button"
            role="tab"
            aria-selected={i === 0}
            className={cn(
              '-mb-px border-b-2 pb-3 pt-1',
              i === 0 ? 'border-foreground font-medium text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground',
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Stammdaten + Vorschaubild */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_360px]">
        <Group title="Stammdaten">
          <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">
            <Field label="Artikelnummer" value="ART-01001" required />
            <Field label="GTIN" value="0000000010010" trailing="plus" />
            <Field label="Artikelname" value="Wanderjacke Fjellrygg" required />
            <Field label="Sortiernummer" value="Placeholder" placeholder trailing="stepper" />
            <Field label="Hersteller" value="Nordwand Outdoor" select trailing="plus" />
            <Field label="Verantwortliche Person" value="Lea Brandt" />
            <Field label="HAN" value="NW-FJ-001" />
            <Field label="Steuerklasse" value="Normaler Steuersatz" required select />
            <Field label="Versandklasse" value="bitte wählen" required select placeholder />
            <Field label="Warengruppe" value="Outdoorbekleidung" select />
            <div className="flex flex-col gap-2 md:col-span-2">
              <span className="text-[15px] font-medium text-foreground">
                Kategorien auswählen<span className="text-danger">*</span>
              </span>
              <div className="flex min-h-11 items-center gap-2 rounded-lg border border-border bg-card px-3">
                {['Sportgeräte', 'Yoga', 'Kleidung'].map((k) => (
                  <Pill key={k} tone="info">
                    {k}
                    <X className="size-3" aria-hidden="true" />
                  </Pill>
                ))}
                <ChevronsUpDown className="ml-auto size-4 text-foreground" aria-hidden="true" />
              </div>
            </div>
          </div>
        </Group>

        <Card className="flex flex-col gap-4 p-4">
          <p className="text-[15px] text-muted-foreground">Vorschaubild</p>
          <div className="flex aspect-square items-center justify-center rounded-lg bg-secondary">
            <ImageIcon className="size-14 text-muted-foreground" strokeWidth={1.25} aria-hidden="true" />
            <span className="sr-only">Kein Vorschaubild vorhanden</span>
          </div>
          <button type="button" className="h-10 rounded-lg bg-secondary text-[15px] font-medium text-foreground hover:bg-border">
            Bilder bearbeiten
          </button>
        </Card>
      </div>

      {/* Preise */}
      <Group title="Preise">
        <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-3">
          <Field label="UVP (brutto)" value="0" />
          <Field label="Ø Einkaufspreis (netto)" value="61,40" />
          <Field label="Brutto-VK" value="153,51" />
          <Field label="Netto-VK" value="129,00" />
          <Field label="Letzter EK ‘nicht erfasst’ Kosten" value="0" />
        </div>

        {/* Kunden sub-panel */}
        <div className="mt-6 flex flex-col gap-4 rounded-lg border border-border p-4">
          <div className="flex items-center justify-between gap-4">
            <div className="relative w-full max-w-4xl">
              <input
                readOnly
                defaultValue="Kunden"
                aria-label="Preisgruppe"
                className="h-11 w-full rounded-lg border border-border bg-card px-3 pr-9 text-[15px] text-foreground outline-none"
              />
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-foreground" aria-hidden="true" />
            </div>
            <Toggle on={false} label="Bruttopreise anzeigen" />
          </div>
          <div className="flex items-center gap-3">
            <label className="flex h-11 flex-1 items-center gap-2 rounded-lg border border-border bg-card px-3 text-[15px] text-muted-foreground">
              <Search className="size-4" aria-hidden="true" />
              <input type="search" placeholder="Suche" className="min-w-0 flex-1 bg-transparent text-foreground outline-none placeholder:text-muted-foreground" />
            </label>
            <button type="button" className="h-11 rounded-lg bg-secondary px-4 text-[15px] font-medium text-foreground hover:bg-border">
              Kunden hinzufügen
            </button>
          </div>
          <table className="w-full border-collapse overflow-hidden rounded-lg border border-border">
            <thead>
              <tr className="border-b border-border bg-muted text-[15px] text-foreground">
                <th className="h-12 border-r border-border px-3 text-left font-normal">Kundengruppe (Rabatt)</th>
                <th className="h-12 border-r border-border px-3 text-right font-normal">Akt. Netto</th>
                <th className="h-12 px-3 text-right font-normal">Indiv. VKNetto</th>
              </tr>
            </thead>
            <tbody>
              <tr className="text-[15px] text-foreground">
                <td className="h-12 border-r border-border px-3">Endkunden (Standard)</td>
                <td className="h-12 border-r border-border px-3 text-right tabular-nums">11,18</td>
                <td className="h-12 px-3" />
              </tr>
            </tbody>
          </table>
        </div>
      </Group>

      <div className="flex justify-end">
        <button
          type="button"
          className="flex h-11 items-center gap-2 rounded-lg bg-foreground px-5 text-[15px] font-medium text-background hover:opacity-90"
        >
          <Check className="size-4" aria-hidden="true" />
          Speichern
        </button>
      </div>
    </div>
  )
}
