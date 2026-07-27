export default function ObligationsDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Obligations
        </h1>
        <p className="text-sm text-neutral-500">
          Track filings, renewals, and deadlines.
        </p>
      </header>
      <div className="flex flex-col gap-3">{children}</div>
    </>
  );
}
