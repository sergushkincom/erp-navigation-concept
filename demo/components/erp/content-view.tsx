import { itemLabel, moduleOf, viewOf } from '@/lib/erp/modules'
import { ArtikelListe } from './views/artikel-liste'
import { ArtikelStammdaten } from './views/artikel-stammdaten'
import { Auftraege } from './views/auftraege'
import { Dashboard } from './views/dashboard'

// Bar widths for the empty-state skeleton, one array per row.
const SKELETON_ROWS = [
  ['w-24', 'w-48', 'w-16', 'w-20'],
  ['w-20', 'w-40', 'w-12', 'w-24'],
  ['w-24', 'w-56', 'w-14', 'w-20'],
  ['w-20', 'w-44', 'w-16', 'w-16'],
  ['w-24', 'w-36', 'w-12', 'w-24'],
]

function EmptySkeleton() {
  return (
    <div aria-hidden="true" className="flex w-full max-w-3xl flex-col gap-3 rounded-lg border border-border bg-card p-6">
      <div className="h-4 w-40 rounded bg-secondary" />
      <div className="mt-2 flex flex-col divide-y divide-border">
        <div className="flex gap-6 pb-3">
          {['w-24', 'w-48', 'w-16', 'w-20'].map((w, i) => (
            <div key={i} className={`h-2.5 ${w} rounded bg-secondary`} />
          ))}
        </div>
        {SKELETON_ROWS.map((row, r) => (
          <div key={r} className="flex gap-6 py-3.5">
            {row.map((w, i) => (
              <div key={i} className={`h-2.5 ${w} rounded bg-secondary`} />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

function Screen({ tabId }: { tabId: string }) {
  switch (viewOf(tabId)) {
    case 'dashboard':
      return <Dashboard />
    case 'artikel-liste':
      // Every saved view shows the same table under its own title, like the real prototype.
      return <ArtikelListe title={itemLabel(tabId)} />
    case 'artikel-stammdaten':
      return <ArtikelStammdaten />
    case 'auftraege':
      return <Auftraege moduleLabel={moduleOf(tabId).label} />
  }
}

export function ContentView({ tabId }: { tabId: string | null }) {
  return (
    <section className="flex flex-1 flex-col overflow-auto bg-background px-6 py-5">
      {tabId ? (
        <Screen key={tabId} tabId={tabId} />
      ) : (
        <>
          <p className="sr-only">Keine Ansicht geöffnet.</p>
          <EmptySkeleton />
        </>
      )}
    </section>
  )
}
