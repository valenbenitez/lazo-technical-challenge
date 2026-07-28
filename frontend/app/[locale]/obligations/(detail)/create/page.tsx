"use client";

import { toTypeLabelKey } from "@/src/entities/obligation/lib/typeLabelKey";
import { Type } from "@/src/entities/obligation/model/obligation";
import { createObligation } from "@/src/features/create-obligation/actions/create-obligation";
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

export default function CreateObligationPage() {
  const t = useTranslations("Form");
  const tCommon = useTranslations("common");
  const tType = useTranslations("Type");
  const [state, submitAction, isPending] = useActionState(createObligation, null);

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          {t("createTitle")}
        </h1>
        <p className="text-sm text-neutral-500">{t("createSubtitle")}</p>
      </header>

      <ErrorBanner errorKey={state?.errorKey} />

      <form action={submitAction} className="flex w-full flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="title" required>
            {t("title")}
          </Label>
          <Input
            id="title"
            name="title"
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
              defaultValue={Type.ANNUAL_REPORT}
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
            <Input id="dueDate" name="dueDate" type="date" required />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="owner" required>
            {t("owner")}
          </Label>
          <Input
            id="owner"
            name="owner"
            placeholder={t("ownerPlaceholder")}
            required
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="companyTaxId" required>
            {t("companyTaxId")}
          </Label>
          <Input
            id="companyTaxId"
            name="companyTaxId"
            placeholder={t("companyTaxIdPlaceholder")}
            required
          />
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
              placeholder={t("documentUrlPlaceholder")}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <ButtonLink href="/obligations" variant="secondary">
            {tCommon("cancel")}
          </ButtonLink>
          <Button type="submit" disabled={isPending}>
            {isPending ? t("creating") : t("create")}
          </Button>
        </div>
      </form>
    </div>
  );
}
