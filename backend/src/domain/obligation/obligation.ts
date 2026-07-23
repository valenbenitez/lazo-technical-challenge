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
    enabled: boolean;
    deletedAt: Date | null;
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

export function assertValidDueDate(dueDate: Date, now = new Date()) {
    const obligationDate = startOfDay(dueDate);
    const today = startOfDay(now);

    return obligationDate >= today;
}

export function isOverdue({ dueDate, status, now = new Date() }: { dueDate: Date, status: Status, now?: Date }) {

    if (status === Status.DONE || status === Status.SUBMITTED) return false;

    const obligationDate = startOfDay(dueDate);
    const today = startOfDay(now);

    return obligationDate < today;
}

export function createObligation(data: CreateObligationData) {
    return {
        ...data,
        description: data.description ?? '',
        status: Status.PENDING,
        enabled: true,
        deletedAt: null,
    };
}

