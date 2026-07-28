"use server";

import { getLocale } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import {
  ObligationListItem,
  updateObligationApi,
  UpdateObligationInput,
} from "@/src/entities/obligation/api/obligations-api";
import { Type } from "@/src/entities/obligation/model/obligation";
import {
  type ErrorMessageKey,
  toActionErrorKey,
} from "@/src/shared/lib/error-message-key";

function str(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function updateObligation(
  _prevState: { errorKey?: ErrorMessageKey } | null | undefined,
  formData: FormData,
): Promise<{ errorKey: ErrorMessageKey } | null> {
  const id = str(formData, "id");
  if (!id) {
    return {
      errorKey: "idRequired",
    };
  }

  const input: UpdateObligationInput = {
    title: str(formData, "title"),
    type: str(formData, "type") as Type,
    dueDate: str(formData, "dueDate"),
    owner: str(formData, "owner"),
    requiresDocument: formData.get("requiresDocument") === "true",
    description: str(formData, "description"),
    documentUrl: str(formData, "documentUrl") || undefined,
  };

  let response: ObligationListItem;
  try {
    response = await updateObligationApi(id, input);
  } catch (error: unknown) {
    return {
      errorKey: toActionErrorKey(error, "updateFailed"),
    };
  }

  const locale = await getLocale();
  return redirect({ href: `/obligations/${response.id}`, locale });
}
