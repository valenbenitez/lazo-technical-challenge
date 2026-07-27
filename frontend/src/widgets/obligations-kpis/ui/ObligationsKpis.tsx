import { ObligationListItem } from "@/src/entities/obligation/api/obligations-api";
import { Status } from "@/src/entities/obligation/model/obligation";

const DUE_SOON_DAYS = 14;
const inDueSoonDays = Date.now() + DUE_SOON_DAYS * 24 * 60 * 60 * 1000;

function getObligationsByStatus(obligations: ObligationListItem[]) {
    return Object.values(Status).reduce(
        (acc, status) => {
            acc[status] = obligations.filter((o) => o.status === status).length;
            return acc;
        },
        {} as Record<Status, number>,
    );
}

function getObligationsDueSoon(obligations: ObligationListItem[]) {
    return obligations.filter(
        (o) =>
            !o.overdue &&
            o.status !== Status.DONE &&
            o.status !== Status.SUBMITTED &&
            new Date(o.dueDate).getTime() <= inDueSoonDays,
    );
}

function getObligationsOverdue(obligations: ObligationListItem[]) {
    return obligations.filter((obligation) => obligation.overdue === true);
}

export default function ObligationsKpis({ obligations }: { obligations: ObligationListItem[] }) {
    const obligationsOverdue = getObligationsOverdue(obligations);
    const obligationsByStatus = getObligationsByStatus(obligations);
    const dueSoon = getObligationsDueSoon(obligations);

    return (
        <section aria-label="Summary">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div
                    key="Total"
                    className="rounded-md border border-neutral-200 bg-neutral-50 px-3 py-3"
                >
                    <p className="text-xs font-medium text-neutral-500">Total</p>
                    <p className="mt-1 text-2xl font-semibold tracking-tight text-neutral-900">
                        {obligations.length}
                    </p>
                </div>
                <div
                    key="By status"
                    className="rounded-md border border-neutral-200 bg-neutral-50 px-3 py-3"
                >
                    <p className="text-xs font-medium text-neutral-500">By status</p>
                    <ul className="mt-2 space-y-1">
                        {Object.entries(obligationsByStatus).map(([status, count]) => (
                            <li
                                key={status}
                                className="flex items-baseline justify-between gap-2 text-sm text-neutral-800"
                            >
                                <span className="text-neutral-600">
                                    {status.replaceAll("_", " ")}
                                </span>
                                <span className="font-semibold tabular-nums text-neutral-900">
                                    {count}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
                <div
                    key="Overdue"
                    className="rounded-md border border-neutral-200 bg-neutral-50 px-3 py-3"
                >
                    <p className="text-xs font-medium text-neutral-500">Overdue</p>
                    <p
                        className={[
                            "mt-1 text-2xl font-semibold tracking-tight tabular-nums",
                            obligationsOverdue.length > 0
                                ? "text-red-700"
                                : "text-neutral-900",
                        ].join(" ")}
                    >
                        {obligationsOverdue.length}
                    </p>
                </div>
                <div
                    key="Due soon"
                    className="rounded-md border border-neutral-200 bg-neutral-50 px-3 py-3"
                >
                    <p className="text-xs font-medium text-neutral-500">Due soon</p>
                    <p className="mt-1 text-2xl font-semibold tracking-tight tabular-nums text-neutral-900">
                        {dueSoon.length}
                    </p>
                </div>
            </div>
        </section>
    )
}