// app/onboarding/page.tsx

import { StepOrganization } from "./_components/step-organizations";
import { StepProperty } from "./_components/step-property";
import { StepUnit } from "./_components/step-unit";

export default function OnboardingPage({
  searchParams,
}: {
  searchParams: { step?: string };
}) {
  const step = searchParams.step ?? "organization";

  switch (step) {
    case "property":
      return <StepProperty />;
    case "unit":
      return <StepUnit />;
    default:
      return <StepOrganization />;
  }
}
