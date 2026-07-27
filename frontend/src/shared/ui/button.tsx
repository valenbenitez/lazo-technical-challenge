import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
};

const variantClass: Record<Variant, string> = {
  primary:
    "border-neutral-900 bg-neutral-900 text-white hover:bg-neutral-800",
  secondary:
    "border-neutral-300 bg-white text-neutral-900 hover:bg-neutral-50",
  ghost:
    "border-transparent bg-transparent text-neutral-700 hover:bg-neutral-100",
};

export function buttonClassName(variant: Variant = "primary", className = "") {
  return [
    "inline-flex items-center justify-center rounded-md border px-3 py-2 text-sm font-medium transition-colors",
    "disabled:cursor-not-allowed disabled:opacity-50",
    variantClass[variant],
    className,
  ]
    .filter(Boolean)
    .join(" ");
}

export default function Button({
  variant = "primary",
  className = "",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonClassName(variant, className)}
      {...props}
    />
  );
}
