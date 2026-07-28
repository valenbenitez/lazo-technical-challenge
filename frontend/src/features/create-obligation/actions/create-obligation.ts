"use server";

import { updateTag } from "next/cache";
import { getLocale } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import {
    createObligationApi,
    CreateObligationInput,
    ObligationListItem,
} from "@/src/entities/obligation/api/obligations-api";
import { obligationsListCacheTag } from "@/src/entities/obligation/lib/obligations-list-cache-tag";
import { Type } from "@/src/entities/obligation/model/obligation";
import {
    type ErrorMessageKey,
    toActionErrorKey,
} from "@/src/shared/lib/error-message-key";

function str(formData: FormData, key: string) {
    const value = formData.get(key);
    return typeof value === "string" ? value.trim() : "";
}


export async function createObligation(
    prevState: unknown,
    formData: FormData,
): Promise<{ errorKey: ErrorMessageKey } | null> {
    const input: CreateObligationInput = {
        title: str(formData, "title"),
        type: str(formData, "type") as Type,
        dueDate: str(formData, "dueDate"),
        owner: str(formData, "owner"),
        companyTaxId: str(formData, "companyTaxId"),
        requiresDocument: Boolean(formData.get("requiresDocument")) || false,
    };
    const description = str(formData, "description");
    const documentUrl = str(formData, "documentUrl");

    if (description) input.description = description;
    if (documentUrl) input.documentUrl = documentUrl;

    let response: ObligationListItem;
    try {
        response = await createObligationApi(input);
    } catch (error: unknown) {
        return {
            errorKey: toActionErrorKey(error, "createFailed"),
        };
    }

    // Use the raw tax ID from the form — API responses return it masked.
    updateTag(obligationsListCacheTag(input.companyTaxId));

    const locale = await getLocale();
    return redirect({ href: `/obligations/${response.id}`, locale });
}
