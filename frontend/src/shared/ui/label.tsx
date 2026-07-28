"use client";

import { useTranslations } from "next-intl";
import type { LabelHTMLAttributes } from "react";

type LabelProps = LabelHTMLAttributes<HTMLLabelElement> & {
  required?: boolean;
  optional?: boolean;
};

export default function Label({
  className = "",
  required = false,
  optional = false,
  children,
  ...props
}: LabelProps) {
  const t = useTranslations("common");

  return (
    <label
      className={["block text-xs font-medium text-neutral-600", className]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      <span className="inline-flex items-center gap-1">
        {children}
        {required ? (
          <span className="text-red-600" aria-hidden="true">
            *
          </span>
        ) : null}
        {optional ? (
          <span className="font-normal text-neutral-400">{t("optional")}</span>
        ) : null}
      </span>
    </label>
  );
}
