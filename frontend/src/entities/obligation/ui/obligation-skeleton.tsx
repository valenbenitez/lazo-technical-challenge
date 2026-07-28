export default function ObligationSkeleton() {
  return (
    <div
      className="animate-pulse rounded-md border border-neutral-200 px-4 py-3"
      aria-hidden="true"
    >
      <div className="h-5 w-2/5 rounded bg-neutral-200" />
      <div className="mt-2 h-4 w-4/5 rounded bg-neutral-100" />
      <div className="mt-3 h-4 w-1/3 rounded bg-neutral-100" />
    </div>
  );
}
