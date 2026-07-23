import { BadRequestException } from "@nestjs/common";
import { startOfDay } from "src/shared/dates";

export enum Type {
    ANNUAL_REPORT = "annual_report",
    FRANCHISE_TAX = "franchise_tax",
    BOI_REPORT = "boi_report",
    REGISTERED_AGENT_RENEWAL = "registered_agent_renewal",
}

export enum Status {
    PENDING = "pending",
    IN_PROGRESS = "in_progress",
    SUBMITTED = "submitted",
    DONE = "done"
}

export interface Obligation {
    id: string;
    type: Type;
    title: string;
    description: string;
    status: Status;
    dueDate: Date;
    owner: string;
    requiresDocument: boolean;
    documentUrl?: string;
    companyTaxId: string;
}

export type CreateObligationData = {
    type: Type;
    title: string;
    description?: string;
    dueDate: Date;
    owner: string;
    requiresDocument: boolean;
    documentUrl?: string;
    companyTaxId: string;
};

export function createObligation(data: CreateObligationData) {
    return {
        ...data,
        description: data.description ?? '',
        status: Status.PENDING,
    };
}

export function assertValidDueDate(dueDate: Date, now = new Date()) {
    const due = startOfDay(dueDate);
    const today = startOfDay(now);

    if (due < today) {
        return false;
    }

    return true;
}