import { listObligations } from "@/src/entities/obligation/api/obligations-api";
import { cacheLife } from "next/cache";
import Link from "next/link";

export default async function ObligationsPage() {
  "use cache";
  cacheLife("minutes");

  const obligations = await listObligations("0002");

  return (
    <>
      {obligations.map((obligation) => (
        <Link href={`/obligations/${obligation.id}`} key={obligation.id}>
          <div
            className="rounded-md border border-neutral-200 px-4 py-3"
          >
            <h2 className="font-medium">{obligation.title}</h2>
            <p className="mt-1 text-sm text-neutral-500">
              {obligation.description ?? "No description"}
            </p>
            <p className="mt-2 text-sm text-neutral-600">
              {obligation.status} · {obligation.dueDate}
            </p>
          </div>
        </Link>
      ))}
    </>
  );
}
