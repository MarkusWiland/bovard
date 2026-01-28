"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil } from "lucide-react";

export function TenantHeader({ tenant }: { tenant: any }) {
  const active = tenant.contracts.some(
    (c: any) => c.status === "ACTIVE"
  );

  return (
    <div className="flex justify-between items-start gap-4">
      <div>
        <h1 className="text-2xl font-bold">{tenant.name}</h1>
        <p className="text-muted-foreground">{tenant.email}</p>
        <div className="mt-2">
          {active ? (
            <Badge>Aktiv hyresgäst</Badge>
          ) : (
            <Badge variant="secondary">Ingen aktiv bostad</Badge>
          )}
        </div>
      </div>

      <Button asChild variant="outline">
        <Link href={`/dashboard/hyresgaster/${tenant.id}/edit`}>
          <Pencil className="mr-2 h-4 w-4" />
          Redigera
        </Link>
      </Button>
    </div>
  );
}
