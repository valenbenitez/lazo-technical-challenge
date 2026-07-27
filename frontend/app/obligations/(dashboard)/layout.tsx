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
      <section aria-label="Obligation list" className="flex flex-col gap-3">
        {children}
      </section>
    </div>
  );
}
