"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AddContractDialog } from "./add-contract-dialog.server";


export function ActiveContractCard({ tenant }: { tenant: any }) {
  const active = tenant.contracts[0];

  return (
    <Card>
      <CardHeader className="flex justify-between items-center">
        <CardTitle>Aktivt avtal</CardTitle>
        <AddContractDialog tenantId={tenant.id} />
      </CardHeader>
      <CardContent>
        {active ? (
          <>
            <div>{active.unit.label} – {active.unit.property.name}</div>
            <div>Hyra: {active.unit.rent.toLocaleString("sv-SE")} kr</div>
            <div>Mall: {active.template.name}</div>
          </>
        ) : (
          <div className="text-muted-foreground">Inget aktivt avtal</div>
        )}
      </CardContent>
    </Card>
  );
}
