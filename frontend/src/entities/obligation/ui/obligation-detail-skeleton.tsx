type ObligationDetailSkeletonProps = {
  label: string;
};

function FieldPlaceholder({ className = "" }: { className?: string }) {
  return (
    <div
      className={`rounded-md border border-neutral-200 bg-neutral-50/60 px-3 py-3 ${className}`}
      aria-hidden="true"
    >
      <div className="h-3 w-16 rounded bg-neutral-200" />
      <div className="mt-2 h-4 w-2/3 rounded bg-neutral-200" />
    </div>
  );
}

export default function ObligationDetailSkeleton({
  label,
}: ObligationDetailSkeletonProps) {
  return (
    <div
      role="status"
      aria-busy="true"
      className="flex animate-pulse flex-col gap-8"
    >
      <span className="sr-only">{label}</span>

      <header className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="h-5 w-20 rounded-md bg-neutral-200" />
          <div className="h-7 w-16 rounded-md bg-neutral-200" />
        </div>
        <div className="h-8 w-3/5 rounded bg-neutral-200" />
      </header>

      <div className="grid gap-3 sm:grid-cols-2">
        <FieldPlaceholder />
        <FieldPlaceholder />
        <FieldPlaceholder />
        <FieldPlaceholder />
        <FieldPlaceholder />
        <FieldPlaceholder />
        <FieldPlaceholder className="sm:col-span-2" />
      </div>

      <div
        className="flex flex-col gap-2"
        aria-hidden="true"
      >
        <div className="h-4 w-28 rounded bg-neutral-200" />
        <div className="flex flex-wrap gap-2">
          <div className="h-8 w-24 rounded-md bg-neutral-200" />
          <div className="h-8 w-24 rounded-md bg-neutral-200" />
        </div>
      </div>

      <section
        className="rounded-md border border-neutral-200 p-4"
        aria-hidden="true"
      >
        <div className="mb-3 h-4 w-20 rounded bg-neutral-200" />
        <div className="space-y-3">
          <div className="flex justify-between gap-2">
            <div className="h-4 w-40 rounded bg-neutral-100" />
            <div className="h-4 w-24 rounded bg-neutral-100" />
          </div>
          <div className="flex justify-between gap-2">
            <div className="h-4 w-36 rounded bg-neutral-100" />
            <div className="h-4 w-24 rounded bg-neutral-100" />
          </div>
        </div>
      </section>
    </div>
  );
}
