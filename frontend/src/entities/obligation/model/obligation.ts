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