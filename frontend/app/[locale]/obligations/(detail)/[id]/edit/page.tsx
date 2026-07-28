import { getObligation } from "@/src/entities/obligation/api/obligations-api";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import EditObligationForm from "./edit-form";

export default async function EditObligationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const t = await getTranslations("common");

  return (
    <Suspense fallback={<p className="text-sm text-neutral-500">{t("loading")}</p>}>
      <EditObligationContent params={params} />
    </Suspense>
  );
}

async function EditObligationContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!id) notFound();

  let obligation;
  try {
    obligation = await getObligation(id);
  } catch {
    notFound();
  }

  return <EditObligationForm obligation={obligation} />;
}
