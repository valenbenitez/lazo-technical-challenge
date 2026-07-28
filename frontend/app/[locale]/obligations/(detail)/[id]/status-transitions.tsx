"use client";

import { toStatusLabelKey } from "@/src/entities/obligation/lib/statusLabelKey";
import { Status } from "@/src/entities/obligation/model/obligation";
import { changeObligationStatus } from "@/src/features/change-obligation-status/actions/change-obligation-status";
import Button from "@/src/shared/ui/button";
import ErrorBanner from "@/src/shared/ui/error-banner";
import { useTranslations } from "next-intl";
import { useActionState } from "react";

type StatusTransitionsProps = {
  obligationId: string;
  currentStatus: Status;
  validTransitions: Status[];
  requiresDocument: boolean;
  documentUrl?: string;
};

export default function StatusTransitions({
  obligationId,
  currentStatus,
  validTransitions,
  requiresDocument,
  documentUrl,
}: StatusTransitionsProps) {
  const t = useTranslations("Transitions");
  const tStatus = useTranslations("Status");
  const [state, submitAction, isPending] = useActionState(
    changeObligationStatus,
    null,
  );

  const missingDocument = requiresDocument && !documentUrl;
  const showBlockedSubmitted =
    currentStatus === Status.IN_PROGRESS &&
    missingDocument &&
    !validTransitions.includes(Status.SUBMITTED);

  const hasActions =
    validTransitions.length > 0 || showBlockedSubmitted;

  return (
    <section className="rounded-md border border-neutral-200 p-4">
      <h2 className="mb-2 text-sm font-medium text-neutral-500">
        {t("title")}
      </h2>

      <ErrorBanner errorKey={state?.errorKey} />

      {!hasActions ? (
        <p className="text-sm text-neutral-500">{t("none")}</p>
      ) : (
        <div className="mt-3 flex flex-col gap-2">
          <form action={submitAction} className="flex flex-wrap gap-2">
            <input type="hidden" name="id" value={obligationId} />
            {validTransitions.map((status) => (
              <Button
                key={status}
                type="submit"
                name="status"
                value={status}
                variant="secondary"
                disabled={isPending}
              >
                {isPending
                  ? t("updating")
                  : t("moveTo", {
                      status: tStatus(toStatusLabelKey(status)),
                    })}
              </Button>
            ))}
            {showBlockedSubmitted ? (
              <Button
                type="button"
                variant="secondary"
                disabled
                title={t("blockedTitle")}
              >
                {t("moveTo", {
                  status: tStatus(toStatusLabelKey(Status.SUBMITTED)),
                })}
              </Button>
            ) : null}
          </form>
          {showBlockedSubmitted ? (
            <p className="text-xs text-neutral-500">{t("blockedHelp")}</p>
          ) : null}
        </div>
      )}
    </section>
  );
}
