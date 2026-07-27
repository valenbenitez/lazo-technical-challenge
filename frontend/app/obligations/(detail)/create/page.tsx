"use client";

import { createObligation } from "@/src/features/create-obligation/actions/create-obligation";
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


export default function CreateObligationPage() {
  const [state, submitAction, isPending] = useActionState(createObligation, null);

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          Create obligation
        </h1>
        <p className="text-sm text-neutral-500">
          Fields marked with * are required. Validation will run on the server.
        </p>
      </header>

      <ErrorBanner message={state?.error} />

      <form action={submitAction} className="flex w-full flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="title" required>
            Title
          </Label>
          <Input
            id="title"
            name="title"
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
              defaultValue="annual_report"
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
            <Input id="dueDate" name="dueDate" type="date" required />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="owner" required>
            Owner
          </Label>
          <Input id="owner" name="owner" placeholder="David Doe" required />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="companyTaxId" required>
            Company tax ID
          </Label>
          <Input
            id="companyTaxId"
            name="companyTaxId"
            placeholder="1234567890"
            required
          />
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
              placeholder="https://example.com/document.pdf"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <ButtonLink href="/obligations" variant="secondary">
            Cancel
          </ButtonLink>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Creating…" : "Create"}
          </Button>
        </div>
      </form>
    </div>
  );
}
