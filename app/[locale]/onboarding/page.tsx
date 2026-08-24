import { getTranslations } from "next-intl/server";
import { OnboardingForm } from "@/components/onboarding-form";

export default async function OnboardingPage() {
  const t = await getTranslations("onboarding");

  const suggestions = [
    t("suggestionHealth"),
    t("suggestionRelationships"),
    t("suggestionFinance"),
    t("suggestionGrowth"),
    t("suggestionJob"),
    t("suggestionCompany"),
  ];

  return (
    <div className="flex flex-1 justify-center">
      <OnboardingForm suggestions={suggestions} />
    </div>
  );
}
