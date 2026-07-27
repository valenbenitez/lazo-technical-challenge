"use client";

import { useRouter } from "next/navigation";

type Props = {
    filter: string;
}

export default function ObligationsFilter({ filter }: Props) {
    const router = useRouter();

    function onSelectChange(event: React.ChangeEvent<HTMLSelectElement>) {
        const value = event.target.value;
        router.push(`/obligations?filter=${value}`, { scroll: false });
    }

    return (
        <section aria-label="Filters">
            <div className="rounded-md border border-dashed border-neutral-300 px-3 py-2.5 text-sm text-neutral-400">
                <form>
                    <select name="filter" defaultValue={filter} onChange={onSelectChange}>
                        <option value="all">All</option>
                        <option value="pending">Pending</option>
                        <option value="in-progress">In progress</option>
                        <option value="overdue">Overdue</option>
                        <option value="due-soon">Due soon</option>
                        <option value="submitted">Submitted</option>
                        <option value="done">Done</option>
                    </select>
                </form>
            </div>
        </section>
    )
}