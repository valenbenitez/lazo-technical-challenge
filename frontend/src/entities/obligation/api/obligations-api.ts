import { Status, Type } from "../model/obligation";

export type CreateObligationInput = {
    type: Type;
    title: string;
    description?: string;
    dueDate: string; // ISO date
    owner: string;
    requiresDocument: boolean;
    documentUrl?: string;
    companyTaxId: string;
};

export type UpdateObligationInput = {
    type?: Type;
    title?: string;
    description?: string;
    dueDate?: string;
    owner?: string;
    requiresDocument?: boolean;
    documentUrl?: string;
    companyTaxId?: string;
}

export type UpdateObligationStatusInput = {
    status: Status;
}

export type ObligationListItem = {
    id: string;
    type: Type;
    title: string;
    status: Status;
    dueDate: string; // ISO date
    owner: string;
    description?: string;
    requiresDocument: boolean;
    documentUrl?: string;
    companyTaxId: string;
    enabled: boolean;
    deletedAt: string | null; // ISO date or null
    overdue?: boolean;
    validTransitions: Status[];
    history: Array<{
        id: string;
        fromStatus: Status;
        toStatus: Status;
        createdAt: string;
    }>;
};

const API_URL = process.env.API_URL;

export async function listObligations(companyTaxId: string): Promise<ObligationListItem[]> {
    const res = await fetch(
        `${API_URL}/obligations?companyTaxId=${encodeURIComponent(companyTaxId)}`,
        { cache: "no-store" },
    );
    if (!res.ok) {
        throw new Error("Failed to list obligations");
    }
    const json = await res.json();
    return json.data;
}

export async function createObligationApi(input: CreateObligationInput): Promise<ObligationListItem> {
    const res = await fetch(
        `${API_URL}/obligations`,
        {
            method: "POST",
            body: JSON.stringify(input),
            headers: {
                "Content-Type": "application/json",
            },
        },
    )
    if (!res.ok) {
        const body = await res.json().catch(() => null);
        const message = body?.message || "Failed to create obligation";
        const code = body?.code || "UNKNOWN_CODE";
        throw new Error(message, { cause: { code } });
    }

    const json = await res.json();
    return json.data;
}

export async function getObligation(id: string): Promise<ObligationListItem> {
    const res = await fetch(
        `${API_URL}/obligations/${id}`,
        { cache: "no-store" },
    )
    if (!res.ok) {
        throw new Error("Failed to get obligation");
    }
    const json = await res.json();
    return json.data;
}

export async function updateObligation(id: string, input: UpdateObligationInput): Promise<ObligationListItem> {
    const res = await fetch(
        `${API_URL}/obligations/${id}`,
        {
            method: "PATCH",
            body: JSON.stringify(input),
            headers: {
                "Content-Type": "application/json",
            },
        },
    )
    if (!res.ok) {
        throw new Error("Failed to update obligation");
    }
    const json = await res.json();
    return json.data;
}

export async function updateObligationStatus(id: string, input: UpdateObligationStatusInput): Promise<ObligationListItem> {
    const res = await fetch(
        `${API_URL}/obligations/${id}/update-status`,
        {
            method: "PATCH",
            body: JSON.stringify(input),
            headers: {
                "Content-Type": "application/json",
            },
        },
    )
    if (!res.ok) {
        throw new Error("Failed to update obligation status");
    }
    const json = await res.json();
    return json.data;
}