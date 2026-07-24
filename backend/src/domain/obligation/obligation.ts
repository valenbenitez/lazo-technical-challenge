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

interface UpdateObligationStatusResponse {
    success: boolean;
    error?: string;
}

export const TRANSITIONS: Record<Status, Status[]> = {
    [Status.PENDING]: [Status.IN_PROGRESS],
    [Status.IN_PROGRESS]: [Status.SUBMITTED, Status.PENDING],
    [Status.SUBMITTED]: [Status.DONE, Status.IN_PROGRESS],
    [Status.DONE]: [Status.IN_PROGRESS],
}

export function canTransition(from: Status, to: Status): boolean {
    return TRANSITIONS[from].includes(to);
}

export function getValidTransitions(from: Status): Status[] {
    return [...TRANSITIONS[from]];
}

export function assertCanSubmit(requiresDocument: boolean, documentUrl?: string | null): boolean {
    if (!requiresDocument) return true;
    return Boolean(documentUrl);
}

export function assertValidDueDate(dueDate: Date, now = new Date()): boolean {
    const obligationDate = startOfDay(dueDate);
    const today = startOfDay(now);

    return obligationDate >= today;
}

export function isOverdue({ dueDate, status, now = new Date() }: { dueDate: Date, status: Status, now?: Date }): boolean {

    if (status === Status.DONE || status === Status.SUBMITTED) return false;

    const obligationDate = startOfDay(dueDate);
    const today = startOfDay(now);

    return obligationDate < today;
}

export function createObligation(data: CreateObligationData): Omit<Obligation, "id"> {
    return {
        ...data,
        description: data.description ?? '',
        status: Status.PENDING,
        enabled: true,
        deletedAt: null,
    };
}

export function updateObligationStatus(obligation: Obligation, newStatus: Status): UpdateObligationStatusResponse {
    if (!canTransition(obligation.status, newStatus)) return { success: false, error: "Invalid status transition" };

    if (newStatus === Status.SUBMITTED && !assertCanSubmit(obligation.requiresDocument, obligation.documentUrl)) {
        return { success: false, error: "Document is required for submission" };
    }

    return { success: true };
}

