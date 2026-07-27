"use server";

import {
  updateObligationStatusApi,
} from "@/src/entities/obligation/api/obligations-api";
import { Status } from "@/src/entities/obligation/model/obligation";
import { redirect } from "next/navigation";

function str(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function changeObligationStatus(
  _prevState: { error?: string } | null,
  formData: FormData,
) {
  const id = str(formData, "id");
  const status = str(formData, "status") as Status;

  if (!id) {
    return { error: "Obligation ID is required" };
  }

  if (!Object.values(Status).includes(status)) {
    return { error: "Invalid status" };
  }

  try {
    await updateObligationStatusApi(id, { status });
  } catch (error: unknown) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Failed to update obligation status",
    };
  }

  redirect(`/obligations/${id}`);
}
