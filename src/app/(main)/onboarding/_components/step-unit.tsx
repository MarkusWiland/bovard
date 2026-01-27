// _components/step-unit.tsx
"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { OnboardingShell } from "./onboarding-shell";
import { createUnit } from "../actions";
import { useRouter } from "next/navigation";

export function StepUnit() {
  const router = useRouter();
  const [label, setLabel] = useState("");
  const [rent, setRent] = useState("");

  async function submit() {
    const { ok } = await createUnit({
      label,
      rent: Number(rent),
    });
    if (ok) {
      router.push("/dashboard");
    }
  }

  return (
    <OnboardingShell title="Skapa första enheten">
      <div className="space-y-4">
        <Input placeholder="12A" value={label} onChange={(e) => setLabel(e.target.value)} />
        <Input placeholder="12500" value={rent} onChange={(e) => setRent(e.target.value)} />
        <Button onClick={submit} className="w-full">
          Gå till dashboard
        </Button>
      </div>
    </OnboardingShell>
  );
}
