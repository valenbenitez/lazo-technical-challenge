import Link from "next/link";
import type { ComponentProps } from "react";
import { buttonClassName } from "./button";

type Variant = "primary" | "secondary" | "ghost";

type ButtonLinkProps = ComponentProps<typeof Link> & {
  variant?: Variant;
  className?: string;
};

export default function ButtonLink({
  variant = "primary",
  className = "",
  ...props
}: ButtonLinkProps) {
  return (
    <Link className={buttonClassName(variant, className)} {...props} />
  );
}
