"use server";

import {
    createObligationApi,
    CreateObligationInput,
    ObligationListItem,
} from "@/src/entities/obligation/api/obligations-api";
import { Type } from "@/src/entities/obligation/model/obligation";
import { redirect } from "next/navigation";

function str(formData: FormData, key: string) {
    const value = formData.get(key);
    return typeof value === "string" ? value.trim() : "";
}


export async function createObligation(prevState: unknown, formData: FormData) {
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
            error:
                error instanceof Error ? error.message : "Failed to create obligation",
        };
    }
    redirect(`/obligations/${response.id}`);
}
