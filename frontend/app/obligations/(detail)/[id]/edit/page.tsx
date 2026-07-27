import { getObligation } from "@/src/entities/obligation/api/obligations-api";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import EditObligationForm from "./edit-form";

export default function EditObligationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense fallback={<p className="text-sm text-neutral-500">Loading…</p>}>
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
