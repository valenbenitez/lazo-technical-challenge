export default function ObligationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Obligations
        </h1>
        <p className="text-sm text-neutral-500">
          Track filings, renewals, and deadlines.
        </p>
      </header>

      <section aria-label="Summary">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {["Total", "By status", "Overdue", "Due soon"].map((label) => (
            <div
              key={label}
              className="rounded-md border border-neutral-200 bg-neutral-50 px-3 py-3"
            >
              <p className="text-xs text-neutral-500">{label}</p>
              <p className="mt-1 text-lg font-medium text-neutral-300">—</p>
            </div>
          ))}
        </div>
      </section>

      <section aria-label="Filters">
        <div className="rounded-md border border-dashed border-neutral-300 px-3 py-2.5 text-sm text-neutral-400">
          Filters
        </div>
      </section>

      <section aria-label="Obligation list" className="flex flex-col gap-3">
        {children}
      </section>
    </div>
  );
}
