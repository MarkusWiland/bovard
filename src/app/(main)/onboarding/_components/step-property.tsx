// _components/step-property.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { OnboardingShell } from "./onboarding-shell";
import { createProperty } from "../actions";

export function StepProperty() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    street: "",
    city: "",
  });

  async function submit() {
    await createProperty(form);
    router.push("/onboarding?step=unit");
  }

  return (
    <OnboardingShell title="Lägg till din första fastighet">
      <div className="space-y-4">
        <Input placeholder="Vasagatan 12" onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <Input placeholder="Vasagatan 12" onChange={(e) => setForm({ ...form, street: e.target.value })} />
        <Input placeholder="Stockholm" onChange={(e) => setForm({ ...form, city: e.target.value })} />
        <Button onClick={submit} className="w-full">Fortsätt</Button>
      </div>
    </OnboardingShell>
  );
}
