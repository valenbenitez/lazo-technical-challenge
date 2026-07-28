import { listObligations, ObligationListItem } from "@/src/entities/obligation/api/obligations-api";
import { Status } from "@/src/entities/obligation/model/obligation";
import ObligationCard from "@/src/entities/obligation/ui/ObligationCard";
import ObligationListSkeleton from "@/src/entities/obligation/ui/obligation-list-skeleton";
import ObligationsFilter from "@/src/features/filter-obligations/ui/ObligationsFilter";
import { getDemoCompanyTaxId } from "@/src/shared/config/demo-company-tax-id";
import ButtonLink from "@/src/shared/ui/button-link";
import ObligationsKpis from "@/src/widgets/obligations-kpis/ui/ObligationsKpis";
import { cacheLife } from "next/cache";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

type Props = {
  searchParams: Promise<{ filter?: string }>;
}

type Filter = "all" | "pending" | "in-progress" | "due-soon" | "overdue" | "submitted" | "done";

const DUE_SOON_DAYS = 14;
const inDueSoonDays = Date.now() + DUE_SOON_DAYS * 24 * 60 * 60 * 1000;

async function getObligations() {
  "use cache"
  cacheLife("minutes")

  return listObligations(getDemoCompanyTaxId());
}

function getObligationsOverdue(obligations: ObligationListItem[]) {
  return obligations.filter((obligation) => obligation.overdue === true);
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

function getObligationsFiltered(obligations: ObligationListItem[], filter: Filter) {
  switch (filter) {
    case "all":
      return obligations;
    case "pending":
      return obligations.filter((o) => o.status === Status.PENDING);
    case "in-progress":
      return obligations.filter((o) => o.status === Status.IN_PROGRESS);
    case "due-soon":
      return getObligationsDueSoon(obligations);
    case "overdue":
      return getObligationsOverdue(obligations);
    case "submitted":
      return obligations.filter((o) => o.status === Status.SUBMITTED);
    case "done":
      return obligations.filter((o) => o.status === Status.DONE);
  }
}


export default async function ObligationsPage({ searchParams }: Props) {
  const t = await getTranslations("Dashboard");

  return (
    <Suspense fallback={<ObligationListSkeleton label={t("loading")} />}>
      <ObligationsContent searchParams={searchParams} />
    </Suspense>
  );
}

async function ObligationsContent({ searchParams }: Props) {
  const t = await getTranslations("Dashboard");
  const { filter = "all" as Filter } = await searchParams;
  const obligations = await getObligations();
  const obligationsFiltered = getObligationsFiltered(obligations, filter as Filter);


  return (
    <>
      <div className="flex justify-end">
        <ButtonLink href="/obligations/create">{t("createObligation")}</ButtonLink>
      </div>
      <ObligationsKpis obligations={obligations} />
      <ObligationsFilter filter={filter} />
      {obligationsFiltered.map((obligation: ObligationListItem) => (
        <ObligationCard key={obligation.id} {...obligation} />
      ))}
    </>
  )
}
