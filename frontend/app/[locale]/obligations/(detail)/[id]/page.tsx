import { getObligation } from "@/src/entities/obligation/api/obligations-api";
import { toStatusLabelKey } from "@/src/entities/obligation/lib/statusLabelKey";
import { toTypeLabelKey } from "@/src/entities/obligation/lib/typeLabelKey";
import ObligationDetailSkeleton from "@/src/entities/obligation/ui/obligation-detail-skeleton";
import ButtonLink from "@/src/shared/ui/button-link";
import { getLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Suspense, type ReactNode } from "react";
import StatusTransitions from "./status-transitions";

function formatDate(value: string, locale: string) {
  const [year, month, day] = value.slice(0, 10).split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatDateTime(value: string, locale: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function ObligationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const t = await getTranslations("common");

  return (
    <Suspense fallback={<ObligationDetailSkeleton label={t("loading")} />}>
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

  const locale = await getLocale();
  const t = await getTranslations("Detail");
  const tCommon = await getTranslations("common");
  const tStatus = await getTranslations("Status");
  const tType = await getTranslations("Type");

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-md bg-neutral-100 px-2 py-0.5 text-xs text-neutral-700">
              {tStatus(toStatusLabelKey(obligation.status))}
            </span>
            {obligation.overdue ? (
              <span className="rounded-md bg-red-50 px-2 py-0.5 text-xs text-red-700">
                {t("overdue")}
              </span>
            ) : null}
          </div>
          <ButtonLink
            href={`/obligations/${id}/edit`}
            variant="secondary"
            className="px-2.5 py-1 text-xs"
          >
            {t("edit")}
          </ButtonLink>
        </div>

        <h1 className="text-2xl font-semibold tracking-tight">
          {obligation.title}
        </h1>
      </header>

      <dl className="grid gap-3 sm:grid-cols-2">
        <Field label={t("type")}>
          {tType(toTypeLabelKey(obligation.type))}
        </Field>
        <Field label={t("dueDate")}>
          {formatDate(obligation.dueDate, locale)}
        </Field>
        <Field label={t("owner")}>{obligation.owner}</Field>
        <Field label={t("taxId")}>{obligation.companyTaxId}</Field>
        <Field label={t("requiresDocument")}>
          {obligation.requiresDocument ? tCommon("yes") : tCommon("no")}
        </Field>
        <Field label={t("document")}>
          {obligation.documentUrl ?? tCommon("emDash")}
        </Field>
        <Field label={t("description")} className="sm:col-span-2">
          {obligation.description ?? tCommon("emDash")}
        </Field>
      </dl>

      <StatusTransitions
        obligationId={obligation.id}
        currentStatus={obligation.status}
        validTransitions={obligation.validTransitions}
        requiresDocument={obligation.requiresDocument}
        documentUrl={obligation.documentUrl}
      />

      <section className="rounded-md border border-neutral-200 p-4">
        <h2 className="mb-3 text-sm font-medium text-neutral-500">
          {t("history")}
        </h2>
        {obligation.history.length === 0 ? (
          <p className="text-sm text-neutral-500">{t("noHistory")}</p>
        ) : (
          <ul className="divide-y divide-neutral-100">
            {obligation.history.map((entry) => (
              <li
                key={entry.id}
                className="flex flex-wrap items-baseline justify-between gap-2 py-2 text-sm first:pt-0 last:pb-0"
              >
                <span>
                  {tStatus(toStatusLabelKey(entry.fromStatus))} →{" "}
                  {tStatus(toStatusLabelKey(entry.toStatus))}
                </span>
                <span className="text-neutral-500">
                  {formatDateTime(entry.createdAt, locale)}
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
