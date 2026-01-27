// app/dashboard/hyresgaster/page.tsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { TenantsTable } from "./_components/tenants-table";

/* ================= MOCK DATA ================= */

async function getTenants() {
  return [
    {
      id: "t1",
      name: "Anna Andersson",
      email: "anna@email.com",
      phone: "070-123 45 67",
      moveInDate: "2024-01-01",
      rent: 12500,
      unit: { id: "u1", label: "12A" },
      property: { id: "p1", name: "Vasagatan 12" },
      status: "active",
    },
    {
      id: "t2",
      name: "Erik Svensson",
      email: "erik@email.com",
      phone: "070-987 65 43",
      moveInDate: "2023-06-01",
      rent: 11500,
      unit: { id: "u2", label: "12B" },
      property: { id: "p1", name: "Vasagatan 12" },
      status: "late",
    },
  ] as const;
}

/* ================= PRISMA (AKTIVERA SEN) ================= */
// samma prisma-query som tidigare, oförändrad

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
        <CardHeader>
          <CardTitle>Hyresgäster</CardTitle>
          <CardDescription>
            Totalt {tenants.length} hyresgäster
          </CardDescription>
        </CardHeader>

        <CardContent>
          <TenantsTable tenants={tenants} />
        </CardContent>
      </Card>
    </div>
  );
}
