import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function Home({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("I18nSmoke");
  const tCommon = await getTranslations("common");

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 bg-zinc-50 font-sans dark:bg-black">
      <h1 className="text-2xl font-semibold tracking-tight">{tCommon("appName")}</h1>
      <p data-testid="i18n-smoke">{t("message")}</p>
      <Link href="/obligations" className="text-sm text-neutral-600 underline">
        Obligations
      </Link>
    </div>
  );
}
