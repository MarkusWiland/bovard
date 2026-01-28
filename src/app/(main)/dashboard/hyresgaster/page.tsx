// app/dashboard/hyresgaster/page.tsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { TenantsTable } from "./_components/tenants-table";
import prisma from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Link, Plus } from "lucide-react";
import { CreateTenantButton } from "@/components/buttons/create-tenant-button";

/* ================= MOCK DATA ================= */



async function getTenants() {
  const tenants = await prisma.tenant.findMany({
    include: {
      contracts: {
        where: { status: "ACTIVE" },
        take: 1,
        include: {
          template: true,
          unit: {
            include: {
              property: true,
            },
          },
        },
      },
    },
  });
  return tenants;
}



export default async function TenantsPage() {
  const tenants = await getTenants();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Hyresgäster</h1>
        <p className="text-muted-foreground">
          Alla aktiva hyresgäster i ditt bolag
        </p>
      </div>

      <Card>
        <CardHeader className="flex justify-between items-center">
          <div>

          <CardTitle>Hyresgäster</CardTitle>
          <CardDescription>
            Totalt {tenants.length} hyresgäster
          </CardDescription>
          </div>
          <div className="flex justify-end">
          <CreateTenantButton />
          </div>
        </CardHeader>

        <CardContent>
          <TenantsTable tenants={tenants} />
        </CardContent>
      </Card>
    </div>
  );
}
