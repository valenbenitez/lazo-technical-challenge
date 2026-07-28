"use server";

import { ObligationListItem, updateObligationApi, UpdateObligationInput } from "@/src/entities/obligation/api/obligations-api";
import { Type } from "@/src/entities/obligation/model/obligation";
import { redirect } from "next/navigation";

function str(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function updateObligation(
  _prevState: { error?: string } | null,
  formData: FormData,
) {

  const id = str(formData, "id");
  if (!id) {
    return {
      error: "Obligation ID is required",
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
      error: error instanceof Error ? error.message : "Failed to update obligation",
    };
  }

  redirect(`/obligations/${response.id}`);
}
