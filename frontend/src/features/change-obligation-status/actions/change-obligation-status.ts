"use server";

import { getLocale } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import {
  updateObligationStatusApi,
} from "@/src/entities/obligation/api/obligations-api";
import { Status } from "@/src/entities/obligation/model/obligation";
import {
  type ErrorMessageKey,
  toActionErrorKey,
} from "@/src/shared/lib/error-message-key";


function str(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function changeObligationStatus(
  _prevState: { errorKey?: ErrorMessageKey } | null,
  formData: FormData,
): Promise<{ errorKey: ErrorMessageKey } | null> {
  const id = str(formData, "id");
  const status = str(formData, "status") as Status;

  if (!id) {
    return { errorKey: "idRequired" };
  }

  if (!Object.values(Status).includes(status)) {
    return { errorKey: "invalidStatus" };
  }

  try {
    await updateObligationStatusApi(id, { status });
  } catch (error: unknown) {
    return {
      errorKey: toActionErrorKey(error, "statusUpdateFailed"),
    };
  }

  const locale = await getLocale();
  return redirect({ href: `/obligations/${id}`, locale });
}
