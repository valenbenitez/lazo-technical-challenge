import { getObligation } from "@/src/entities/obligation/api/obligations-api";
import ButtonLink from "@/src/shared/ui/button-link";
import { notFound } from "next/navigation";
import { Suspense, type ReactNode } from "react";

function formatDate(value: string) {
  const [year, month, day] = value.slice(0, 10).split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatDateTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function label(value: string) {
  return value.replaceAll("_", " ");
}

export default function ObligationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense fallback={<p className="text-sm text-neutral-500">Loading…</p>}>
      <ObligationContent params={params} />
    </Suspense>
  );
}

async function ObligationContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const obligation = await getObligation(id);

  if (!obligation) notFound();

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-md bg-neutral-100 px-2 py-0.5 text-xs text-neutral-700">
            {label(obligation.status)}
          </span>
          <ButtonLink href={`/obligations/${id}/edit`}>Edit</ButtonLink>
          {obligation.overdue ? (
            <span className="rounded-md bg-red-50 px-2 py-0.5 text-xs text-red-700">
              Overdue
            </span>
          ) : null}
        </div>

        <h1 className="text-2xl font-semibold tracking-tight">
          {obligation.title}
        </h1>
      </header>

      <dl className="grid gap-3 sm:grid-cols-2">
        <Field label="Type">{label(obligation.type)}</Field>
        <Field label="Due date">{formatDate(obligation.dueDate)}</Field>
        <Field label="Owner">{obligation.owner}</Field>
        <Field label="Tax ID">{obligation.companyTaxId}</Field>
        <Field label="Requires document">
          {obligation.requiresDocument ? "Yes" : "No"}
        </Field>
        <Field label="Document">{obligation.documentUrl ?? "—"}</Field>
        <Field label="Description" className="sm:col-span-2">
          {obligation.description ?? "—"}
        </Field>
      </dl>

      <section className="rounded-md border border-neutral-200 p-4">
        <h2 className="mb-2 text-sm font-medium text-neutral-500">
          Valid transitions
        </h2>
        <p className="text-sm">
          {obligation.validTransitions.length
            ? obligation.validTransitions.map(label).join(", ")
            : "None"}
        </p>
      </section>

      <section className="rounded-md border border-neutral-200 p-4">
        <h2 className="mb-3 text-sm font-medium text-neutral-500">History</h2>
        {obligation.history.length === 0 ? (
          <p className="text-sm text-neutral-500">No history</p>
        ) : (
          <ul className="divide-y divide-neutral-100">
            {obligation.history.map((entry) => (
              <li
                key={entry.id}
                className="flex flex-wrap items-baseline justify-between gap-2 py-2 text-sm first:pt-0 last:pb-0"
              >
                <span>
                  {label(entry.fromStatus)} → {label(entry.toStatus)}
                </span>
                <span className="text-neutral-500">
                  {formatDateTime(entry.createdAt)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function Field({
  label: fieldLabel,
  children,
  className = "",
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-md border border-neutral-200 bg-neutral-50/60 px-3 py-3 ${className}`}
    >
      <dt className="text-xs text-neutral-500">{fieldLabel}</dt>
      <dd className="mt-1 text-sm font-medium text-neutral-900">{children}</dd>
    </div>
  );
}
