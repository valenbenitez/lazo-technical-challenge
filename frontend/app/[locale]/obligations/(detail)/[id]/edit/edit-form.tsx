"use client";

import type { ObligationListItem } from "@/src/entities/obligation/api/obligations-api";
import { toTypeLabelKey } from "@/src/entities/obligation/lib/typeLabelKey";
import { Type } from "@/src/entities/obligation/model/obligation";
import { updateObligation } from "@/src/features/update-obligation/actions/update-obligation";
import Button from "@/src/shared/ui/button";
import ButtonLink from "@/src/shared/ui/button-link";
import ErrorBanner from "@/src/shared/ui/error-banner";
import Input from "@/src/shared/ui/input";
import Label from "@/src/shared/ui/label";
import { useTranslations } from "next-intl";
import { useActionState } from "react";

const selectClassName = [
  "w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900",
  "focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-400",
].join(" ");

const TYPE_OPTIONS = Object.values(Type);

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
  const t = useTranslations("Form");
  const tCommon = useTranslations("common");
  const tType = useTranslations("Type");
  const [state, submitAction, isPending] = useActionState(
    updateObligation,
    null,
  );

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          {t("editTitle")}
        </h1>
        <p className="text-sm text-neutral-500">{t("editSubtitle")}</p>
      </header>

      <ErrorBanner errorKey={state?.errorKey} />

      <form action={submitAction} className="flex w-full flex-col gap-4">
        <input type="hidden" name="id" value={obligation.id} />

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="title" required>
            {t("title")}
          </Label>
          <Input
            id="title"
            name="title"
            defaultValue={obligation.title}
            placeholder={t("titlePlaceholder")}
            required
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="description" optional>
            {t("description")}
          </Label>
          <Input
            id="description"
            name="description"
            defaultValue={obligation.description ?? ""}
            placeholder={t("descriptionPlaceholder")}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="type" required>
              {t("type")}
            </Label>
            <select
              id="type"
              name="type"
              className={selectClassName}
              required
              defaultValue={obligation.type}
            >
              {TYPE_OPTIONS.map((type) => (
                <option key={type} value={type}>
                  {tType(toTypeLabelKey(type))}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="dueDate" required>
              {t("dueDate")}
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
            {t("owner")}
          </Label>
          <Input
            id="owner"
            name="owner"
            defaultValue={obligation.owner}
            placeholder={t("ownerPlaceholder")}
            required
          />
        </div>

        <div className="rounded-md border border-neutral-200 bg-neutral-50 px-3 py-3">
          <p className="text-xs font-medium text-neutral-500">
            {t("companyTaxId")}
          </p>
          <p className="mt-1 text-sm font-medium text-neutral-900">
            {obligation.companyTaxId}
          </p>
          <p className="mt-1 text-xs text-neutral-400">{t("taxIdNotEditable")}</p>
        </div>

        <div className="grid items-end gap-4 sm:grid-cols-[auto_1fr]">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="requiresDocument">{t("requiresDocument")}</Label>
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
              <span className="text-sm text-neutral-700">{tCommon("yes")}</span>
            </label>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="documentUrl" optional>
              {t("documentUrl")}
            </Label>
            <Input
              id="documentUrl"
              name="documentUrl"
              defaultValue={obligation.documentUrl ?? ""}
              placeholder={t("documentUrlPlaceholder")}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <ButtonLink
            href={`/obligations/${obligation.id}`}
            variant="secondary"
          >
            {tCommon("cancel")}
          </ButtonLink>
          <Button type="submit" disabled={isPending}>
            {isPending ? t("saving") : t("save")}
          </Button>
        </div>
      </form>
    </div>
  );
}
