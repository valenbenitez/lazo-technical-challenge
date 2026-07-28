import { getTranslations } from "next-intl/server";

export default async function ObligationsDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = await getTranslations("Dashboard");

  return (
    <>
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          {t("title")}
        </h1>
        <p className="text-sm text-neutral-500">
          {t("subtitle")}
        </p>
      </header>
      <div className="flex flex-col gap-3">{children}</div>
    </>
  );
}
