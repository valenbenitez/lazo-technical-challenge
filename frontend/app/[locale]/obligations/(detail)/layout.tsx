import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

async function BackLink() {
  const t = await getTranslations("common");

  return (
    <Link
      href="/obligations"
      className="w-fit text-sm text-neutral-600 hover:underline"
    >
      {t("back")}
    </Link>
  );
}

export default async function ObligationDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = await getTranslations("common");

  return (
    <div className="flex flex-col gap-8">
      <Suspense
        fallback={
          <span className="w-fit text-sm text-neutral-600">{t("back")}</span>
        }
      >
        <BackLink />
      </Suspense>
      {children}
    </div>
  );
}
