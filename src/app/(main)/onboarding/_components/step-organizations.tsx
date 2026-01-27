// _components/step-organization.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { OnboardingShell } from "./onboarding-shell";
import { createOrganization } from "../actions";

export function StepOrganization() {
  const [name, setName] = useState("");
  const router = useRouter();

  async function submit() {
    await createOrganization(name);
    router.push("/onboarding?step=property");
  }

  return (
    <OnboardingShell title="Vad heter företaget?">
      <div className="space-y-4">
        <Input
          placeholder="Mitt Fastighetsbolag AB"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Button onClick={submit} className="w-full">
          Fortsätt
        </Button>
      </div>
    </OnboardingShell>
  );
}
