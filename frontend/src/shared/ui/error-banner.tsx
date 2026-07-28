"use client";

import { useEffect, useState } from "react";

type ErrorBannerProps = {
  message: string | null | undefined;
  durationMs?: number;
};

export default function ErrorBanner({
  message,
  durationMs = 5000,
}: ErrorBannerProps) {
  const [dismissed, setDismissed] = useState(false);
  const [prevMessage, setPrevMessage] = useState(message);

  if (message !== prevMessage) {
    setPrevMessage(message);
    setDismissed(false);
  }

  useEffect(() => {
    if (!message) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setDismissed(true);
    }, durationMs);

    return () => window.clearTimeout(timeoutId);
  }, [message, durationMs]);

  if (!message || dismissed) return null;

  return (
    <div
      role="alert"
      className="rounded-md border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-800"
    >
      {message}
    </div>
  );
}
