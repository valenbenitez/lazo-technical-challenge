import {
  DEFAULT_OBLIGATION_LIST_SKELETON_COUNT,
  skeletonItemKeys,
} from "../lib/skeleton-item-keys";
import ObligationSkeleton from "./obligation-skeleton";

type ObligationListSkeletonProps = {
  count?: number;
  label: string;
};

function KpiPlaceholder() {
  return (
    <div
      className="rounded-md border border-neutral-200 bg-neutral-50 px-3 py-3"
      aria-hidden="true"
    >
      <div className="h-3 w-16 rounded bg-neutral-200" />
      <div className="mt-3 h-8 w-12 rounded bg-neutral-200" />
    </div>
  );
}

export default function ObligationListSkeleton({
  count = DEFAULT_OBLIGATION_LIST_SKELETON_COUNT,
  label,
}: ObligationListSkeletonProps) {
  return (
    <div
      role="status"
      aria-busy="true"
      className="flex flex-col gap-4"
    >
      <span className="sr-only">{label}</span>
      <div className="grid animate-pulse grid-cols-2 gap-3 sm:grid-cols-4">
        <KpiPlaceholder />
        <KpiPlaceholder />
        <KpiPlaceholder />
        <KpiPlaceholder />
      </div>
      <div className="flex flex-col gap-3">
        {skeletonItemKeys(count).map((key) => (
          <ObligationSkeleton key={key} />
        ))}
      </div>
    </div>
  );
}
