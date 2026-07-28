"use client";

import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

type Props = {
    filter: string;
}

const FILTER_OPTIONS = [
    "all",
    "pending",
    "in-progress",
    "overdue",
    "due-soon",
    "submitted",
    "done",
] as const;

export default function ObligationsFilter({ filter }: Props) {
    const router = useRouter();
    const t = useTranslations("Filter");

    function onSelectChange(event: React.ChangeEvent<HTMLSelectElement>) {
        const value = event.target.value;
        router.push(
            { pathname: "/obligations", query: { filter: value } },
            { scroll: false },
        );
    }

    return (
        <section aria-label={t("aria")}>
            <div className="rounded-md border border-dashed border-neutral-300 px-3 py-2.5 text-sm text-neutral-400">
                <form>
                    <select name="filter" defaultValue={filter} onChange={onSelectChange}>
                        {FILTER_OPTIONS.map((value) => (
                            <option key={value} value={value}>
                                {t(value)}
                            </option>
                        ))}
                    </select>
                </form>
            </div>
        </section>
    )
}
