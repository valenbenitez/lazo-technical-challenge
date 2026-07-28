import { Status } from "../model/obligation";

const STATUS_LABEL_KEYS = Object.values(Status);

export type StatusLabelKey = Status;

export function toStatusLabelKey(status: string): StatusLabelKey {
  if ((STATUS_LABEL_KEYS as readonly string[]).includes(status)) {
    return status as StatusLabelKey;
  }

  throw new Error(`Unknown obligation status: ${status}`);
}
