import Link from "next/link";

export default function ObligationDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-8">
      <Link
        href="/obligations"
        className="w-fit text-sm text-neutral-600 hover:underline"
      >
        ← Back
      </Link>
      {children}
    </div>
  );
}
