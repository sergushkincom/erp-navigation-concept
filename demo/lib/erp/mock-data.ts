export type Artikel = {
  nr: string
  name: string
  preisNetto: number
  bestand: number
  aktiv: boolean
}

export const ARTIKEL: Artikel[] = [
  { nr: 'ART-01001', name: 'Wanderjacke Fjellrygg', preisNetto: 129, bestand: 14, aktiv: true },
  { nr: 'ART-01002', name: 'Trekkingzelt Solo 1P', preisNetto: 189, bestand: 6, aktiv: true },
  { nr: 'ART-01003', name: 'Daunenschlafsack -5 °C', preisNetto: 149, bestand: 22, aktiv: true },
  { nr: 'ART-01004', name: 'Softshellhose Alpin', preisNetto: 79, bestand: 31, aktiv: true },
  { nr: 'ART-01005', name: 'Rucksack Trail 28 l', preisNetto: 89, bestand: 18, aktiv: true },
  { nr: 'ART-01006', name: 'Funktionsshirt Merino', preisNetto: 49, bestand: 64, aktiv: true },
  { nr: 'ART-01007', name: 'Isomatte Light', preisNetto: 59, bestand: 9, aktiv: true },
  { nr: 'ART-01008', name: 'Stirnlampe 400 lm', preisNetto: 35, bestand: 42, aktiv: true },
  { nr: 'ART-01009', name: 'Trinkflasche 0,75 l', preisNetto: 15, bestand: 120, aktiv: true },
  { nr: 'ART-01010', name: 'Wanderstöcke Carbon', preisNetto: 69, bestand: 12, aktiv: true },
  { nr: 'ART-01011', name: 'Regenjacke Packlite', preisNetto: 99, bestand: 27, aktiv: true },
  { nr: 'ART-01012', name: 'Fleecejacke Basis', preisNetto: 59, bestand: 38, aktiv: true },
  { nr: 'ART-01013', name: 'Gamaschen Wasserdicht', preisNetto: 29, bestand: 15, aktiv: true },
  { nr: 'ART-01014', name: 'Kocher Kompakt', preisNetto: 45, bestand: 7, aktiv: true },
  { nr: 'ART-01015', name: 'Hüttenschlafsack Seide', preisNetto: 39, bestand: 25, aktiv: true },
]

export type Bezahlstatus = 'Bezahlt' | 'Überfällig' | 'Nicht bezahlt' | 'Storniert'
export type Versandstatus = 'Geliefert' | 'Teilweise geliefert' | 'Offen'

export type Auftrag = {
  nr: string
  datum: string
  kundeNr: string
  netto: number
  brutto: number
  zahlungsart: string
  bezahl: Bezahlstatus
  versand: Versandstatus
}

export const AUFTRAEGE: Auftrag[] = [
  { nr: 'AU-2026-0430', datum: '14.10.2026', kundeNr: 'K-2031', netto: 812.0, brutto: 966.28, zahlungsart: 'Rechnung', bezahl: 'Bezahlt', versand: 'Geliefert' },
  { nr: 'AU-2026-0429', datum: '14.10.2026', kundeNr: 'K-2187', netto: 245.5, brutto: 292.14, zahlungsart: 'PayPal', bezahl: 'Überfällig', versand: 'Offen' },
  { nr: 'AU-2026-0428', datum: '13.10.2026', kundeNr: 'K-2044', netto: 1530.0, brutto: 1820.7, zahlungsart: 'Vorkasse', bezahl: 'Bezahlt', versand: 'Teilweise geliefert' },
  { nr: 'AU-2026-0427', datum: '13.10.2026', kundeNr: 'K-2310', netto: 64.9, brutto: 77.23, zahlungsart: 'Kreditkarte', bezahl: 'Nicht bezahlt', versand: 'Offen' },
  { nr: 'AU-2026-0426', datum: '12.10.2026', kundeNr: 'K-2099', netto: 420.0, brutto: 499.8, zahlungsart: 'Rechnung', bezahl: 'Storniert', versand: 'Offen' },
  { nr: 'AU-2026-0425', datum: '12.10.2026', kundeNr: 'K-2031', netto: 689.0, brutto: 819.91, zahlungsart: 'PayPal', bezahl: 'Bezahlt', versand: 'Geliefert' },
  { nr: 'AU-2026-0424', datum: '11.10.2026', kundeNr: 'K-2256', netto: 1275.0, brutto: 1517.25, zahlungsart: 'Vorkasse', bezahl: 'Bezahlt', versand: 'Geliefert' },
  { nr: 'AU-2026-0423', datum: '11.10.2026', kundeNr: 'K-2148', netto: 118.0, brutto: 140.42, zahlungsart: 'Kreditkarte', bezahl: 'Überfällig', versand: 'Teilweise geliefert' },
  { nr: 'AU-2026-0422', datum: '10.10.2026', kundeNr: 'K-2402', netto: 2390.0, brutto: 2844.1, zahlungsart: 'Rechnung', bezahl: 'Bezahlt', versand: 'Geliefert' },
  { nr: 'AU-2026-0421', datum: '10.10.2026', kundeNr: 'K-2044', netto: 199.9, brutto: 237.88, zahlungsart: 'PayPal', bezahl: 'Nicht bezahlt', versand: 'Offen' },
]

/** Smooth curve + scattered points. */
export const UMSATZ = [
  { monat: 'Jan', umsatz: 7200, punkt: null },
  { monat: 'Feb', umsatz: 11400, punkt: 9300 },
  { monat: 'Mar', umsatz: 13800, punkt: 12100 },
  { monat: 'Apr', umsatz: 9600, punkt: 14200 },
  { monat: 'May', umsatz: 12300, punkt: 10900 },
  { monat: 'Jun', umsatz: 16100, punkt: 13500 },
]

export const TOP_SELLER = [
  { name: 'Wanderjacke Fjellrygg', bestand: 14, max: 40, kritisch: false },
  { name: 'Trekkingzelt Solo 1P', bestand: 6, max: 30, kritisch: true },
  { name: 'Rucksack Trail 28 l', bestand: 18, max: 25, kritisch: false },
  { name: 'Isomatte Light', bestand: 9, max: 45, kritisch: true },
  { name: 'Funktionsshirt Merino', bestand: 64, max: 80, kritisch: false },
]

export const TOP_KUNDEN = [
  { name: 'Bergsport Kessler', umsatz: 19840, anteil: 11 },
  { name: 'Alpinladen Rautner', umsatz: 15210, anteil: 8 },
  { name: 'Outdoor Nordlicht', umsatz: 11960, anteil: 7 },
  { name: 'Hüttenbedarf Lenz', umsatz: 9480, anteil: 5 },
]

export const LIEFERZEITEN = [
  { name: 'Bekleidung', tage: '1.9 Tage' },
  { name: 'Zelte', tage: '3.6 Tage' },
  { name: 'Ausrüstung', tage: '2.4 Tage' },
]

export const OFFENE_BESTELLUNGEN = [
  { name: 'Dringend (<3 Tage)', wert: 6, tone: 'warning' as const },
  { name: 'Standard (3-7 Tage)', wert: 21, tone: 'neutral' as const },
  { name: 'Langfristig (>7 Tage)', wert: 4, tone: 'neutral' as const },
]

export const SUPPORTFAELLE = [
  { name: 'Kritisch', wert: 2, tone: 'danger' as const },
  { name: 'Hoch', wert: 5, tone: 'warning' as const },
  { name: 'Mittel', wert: 9, tone: 'neutral' as const },
  { name: 'Niedrig', wert: 4, tone: 'neutral' as const },
]

export const REKLAMATIONEN = [
  { name: 'Produktqualität', wert: 3 },
  { name: 'Lieferprobleme', wert: 5 },
  { name: 'Falsche Artikel', wert: 1 },
]

export const eur = (n: number) =>
  n.toLocaleString('de-DE', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2 })

/** "€24.560" style used on the dashboard (no decimals, symbol first). */
export const eurShort = (n: number) => `€${n.toLocaleString('de-DE', { maximumFractionDigits: 0 })}`
