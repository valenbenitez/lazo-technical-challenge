"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import type { ErrorMessageKey } from "@/src/shared/lib/error-message-key";

type ErrorBannerProps = {
  errorKey?: ErrorMessageKey | null;
  durationMs?: number;
};

export default function ErrorBanner({
  errorKey,
  durationMs = 5000,
}: ErrorBannerProps) {
  const t = useTranslations("Errors");
  const [dismissed, setDismissed] = useState(false);
  const [prevErrorKey, setPrevErrorKey] = useState(errorKey);

  if (errorKey !== prevErrorKey) {
    setPrevErrorKey(errorKey);
    setDismissed(false);
  }

  useEffect(() => {
    if (!errorKey) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setDismissed(true);
    }, durationMs);

    return () => window.clearTimeout(timeoutId);
  }, [errorKey, durationMs]);

  if (!errorKey || dismissed) return null;

  return (
    <div
      role="alert"
      className="rounded-md border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-800"
    >
      {t(errorKey)}
    </div>
  );
}
