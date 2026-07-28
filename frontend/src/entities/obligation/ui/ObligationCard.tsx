import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { ObligationListItem } from "../api/obligations-api";
import { toStatusLabelKey } from "../lib/statusLabelKey";

export default async function ObligationCard(obligation: ObligationListItem) {
    const t = await getTranslations("ObligationCard");
    const tStatus = await getTranslations("Status");

    return (
        <Link href={`/obligations/${obligation.id}`}>
            <div
                className="rounded-md border border-neutral-200 px-4 py-3"
            >
                <h2 className="font-medium">{obligation.title}</h2>
                <p className="mt-1 text-sm text-neutral-500">
                    {obligation.description ?? t("noDescription")}
                </p>
                <p className="mt-2 text-sm text-neutral-600">
                    {tStatus(toStatusLabelKey(obligation.status))} · {obligation.dueDate}
                </p>
                {obligation.overdue && <p className="mt-2 text-sm text-neutral-600 text-red-500">{t("overdue")}</p>}
            </div>
        </Link>
    )
}
