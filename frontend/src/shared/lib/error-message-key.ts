export const ERROR_MESSAGE_KEYS = [
  "createFailed",
  "updateFailed",
  "statusUpdateFailed",
  "idRequired",
  "invalidStatus",
  "INVALID_DUE_DATE",
  "INVALID_COMPANY_TAX_ID",
  "INVALID_OBLIGATION_ID",
  "OBLIGATION_NOT_FOUND",
  "CONFLICT_OBLIGATION_VERSION",
  "INVALID_STATUS_TRANSITION",
  "INTERNAL_SERVER_ERROR",
  "HISTORY_NOT_FOUND",
  "UNKNOWN_CODE",
] as const;

export type ErrorMessageKey = (typeof ERROR_MESSAGE_KEYS)[number];

const ERROR_MESSAGE_KEY_SET = new Set<string>(ERROR_MESSAGE_KEYS);

export function toErrorMessageKey(codeOrKey: string): ErrorMessageKey {
  if (ERROR_MESSAGE_KEY_SET.has(codeOrKey)) {
    return codeOrKey as ErrorMessageKey;
  }

  return "UNKNOWN_CODE";
}

export function getErrorCode(error: unknown): string | undefined {
  if (!(error instanceof Error)) {
    return undefined;
  }

  const cause = error.cause;
  if (cause && typeof cause === "object" && "code" in cause) {
    const code = (cause as { code: unknown }).code;
    return typeof code === "string" ? code : undefined;
  }

  return undefined;
}

export function toActionErrorKey(
  error: unknown,
  fallback: ErrorMessageKey,
): ErrorMessageKey {
  const code = getErrorCode(error);
  if (code) {
    return toErrorMessageKey(code);
  }

  return fallback;
}
