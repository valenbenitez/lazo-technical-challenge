import Link from "next/link";
import { ObligationListItem } from "../api/obligations-api";

export default function ObligationCard(obligation: ObligationListItem) {
    return (
        <Link href={`/obligations/${obligation.id}`}>
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
                {obligation.overdue && <p className="mt-2 text-sm text-neutral-600 text-red-500">Overdue</p>}
            </div>
        </Link>
    )
}