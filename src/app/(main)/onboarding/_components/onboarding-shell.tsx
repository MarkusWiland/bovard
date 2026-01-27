"use client";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { ReactNode } from "react";

export function OnboardingShell({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      {children}
    </Card>
  );
}
