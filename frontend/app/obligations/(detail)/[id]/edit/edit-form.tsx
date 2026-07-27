"use client";

import type { ObligationListItem } from "@/src/entities/obligation/api/obligations-api";
import { updateObligation } from "@/src/features/update-obligation/actions/update-obligation";
import Button from "@/src/shared/ui/button";
import ButtonLink from "@/src/shared/ui/button-link";
import ErrorBanner from "@/src/shared/ui/error-banner";
import Input from "@/src/shared/ui/input";
import Label from "@/src/shared/ui/label";
import { useActionState } from "react";

const selectClassName = [
  "w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900",
  "focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-400",
].join(" ");

function toDateInputValue(isoDate: string) {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return "";
  return isoDate.slice(0, 10);
}

type EditObligationFormProps = {
  obligation: ObligationListItem;
};

export default function EditObligationForm({
  obligation,
}: EditObligationFormProps) {
  const [state, submitAction, isPending] = useActionState(
    updateObligation,
    null,
  );

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          Edit obligation
        </h1>
        <p className="text-sm text-neutral-500">
          Update the fields below. Status changes happen from the detail page.
        </p>
      </header>

      <ErrorBanner message={state?.error} />

      <form action={submitAction} className="flex w-full flex-col gap-4">
        <input type="hidden" name="id" value={obligation.id} />

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="title" required>
            Title
          </Label>
          <Input
            id="title"
            name="title"
            defaultValue={obligation.title}
            placeholder="Annual report 2026"
            required
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="description" optional>
            Description
          </Label>
          <Input
            id="description"
            name="description"
            defaultValue={obligation.description ?? ""}
            placeholder="Description of the obligation"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="type" required>
              Type
            </Label>
            <select
              id="type"
              name="type"
              className={selectClassName}
              required
              defaultValue={obligation.type}
            >
              <option value="annual_report">Annual report</option>
              <option value="franchise_tax">Franchise tax</option>
              <option value="boi_report">BOI report</option>
              <option value="registered_agent_renewal">
                Registered agent renewal
              </option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="dueDate" required>
              Due date
            </Label>
            <Input
              id="dueDate"
              name="dueDate"
              type="date"
              defaultValue={toDateInputValue(obligation.dueDate)}
              required
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="owner" required>
            Owner
          </Label>
          <Input
            id="owner"
            name="owner"
            defaultValue={obligation.owner}
            placeholder="David Doe"
            required
          />
        </div>

        <div className="rounded-md border border-neutral-200 bg-neutral-50 px-3 py-3">
          <p className="text-xs font-medium text-neutral-500">Company tax ID</p>
          <p className="mt-1 text-sm font-medium text-neutral-900">
            {obligation.companyTaxId}
          </p>
          <p className="mt-1 text-xs text-neutral-400">
            Sensitive — not editable here.
          </p>
        </div>

        <div className="grid items-end gap-4 sm:grid-cols-[auto_1fr]">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="requiresDocument">Requires document</Label>
            <label
              htmlFor="requiresDocument"
              className="flex h-[42px] items-center gap-2 rounded-md border border-neutral-300 bg-white px-3"
            >
              <input
                id="requiresDocument"
                name="requiresDocument"
                type="checkbox"
                value="true"
                defaultChecked={obligation.requiresDocument}
                className="h-4 w-4 shrink-0 accent-neutral-900"
              />
              <span className="text-sm text-neutral-700">Yes</span>
            </label>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="documentUrl" optional>
              Document URL
            </Label>
            <Input
              id="documentUrl"
              name="documentUrl"
              defaultValue={obligation.documentUrl ?? ""}
              placeholder="https://example.com/document.pdf"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <ButtonLink
            href={`/obligations/${obligation.id}`}
            variant="secondary"
          >
            Cancel
          </ButtonLink>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving…" : "Save"}
          </Button>
        </div>
      </form>
    </div>
  );
}
