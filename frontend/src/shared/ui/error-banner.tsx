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
  const [visible, setVisible] = useState(Boolean(message));

  useEffect(() => {
    if (!message) {
      setVisible(false);
      return;
    }

    setVisible(true);
    const timeoutId = window.setTimeout(() => {
      setVisible(false);
    }, durationMs);

    return () => window.clearTimeout(timeoutId);
  }, [message, durationMs]);

  if (!message || !visible) return null;

  return (
    <div
      role="alert"
      className="rounded-md border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-800"
    >
      {message}
    </div>
  );
}
