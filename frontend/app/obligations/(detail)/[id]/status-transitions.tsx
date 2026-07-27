"use client";

import { Status } from "@/src/entities/obligation/model/obligation";
import { changeObligationStatus } from "@/src/features/change-obligation-status/actions/change-obligation-status";
import Button from "@/src/shared/ui/button";
import ErrorBanner from "@/src/shared/ui/error-banner";
import { useActionState } from "react";

function label(value: string) {
  return value.replaceAll("_", " ");
}

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
        Valid transitions
      </h2>

      <ErrorBanner message={state?.error} />

      {!hasActions ? (
        <p className="text-sm text-neutral-500">No transitions available.</p>
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
                {isPending ? "Updating…" : `Move to ${label(status)}`}
              </Button>
            ))}
            {showBlockedSubmitted ? (
              <Button
                type="button"
                variant="secondary"
                disabled
                title="A document is required before submitting"
              >
                Move to submitted
              </Button>
            ) : null}
          </form>
          {showBlockedSubmitted ? (
            <p className="text-xs text-neutral-500">
              Add a document URL before moving to submitted.
            </p>
          ) : null}
        </div>
      )}
    </section>
  );
}
