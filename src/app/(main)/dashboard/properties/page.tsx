// app/dashboard/properties/page.tsx
import Link from "next/link";
import {
  Card, CardHeader, CardTitle, CardDescription, CardContent,
} from "@/components/ui/card";
import {
  Table, TableHeader, TableRow, TableHead, TableBody, TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, ArrowUpRight } from "lucide-react";
import prisma from "@/lib/prisma";
import { getServerSession } from "@/lib/get-session";
import { redirect } from "next/navigation";

// ================= MOCK DATA =================

// ================= PRISMA (AKTIVERA SEN) =================

 async function getProperties() {
   const session = await getServerSession();
   const user = session?.user;
   if (!user) {
     redirect("/sign-in");
   }
   const organization = await prisma.organization.findFirst({
     where: { memberships: { some: { userId: user.id } } },
   });
   if (!organization) {
     redirect("/sign-in");
   }
   const properties = await prisma.property.findMany({
     where: { organizationId: organization?.id },
     include: { units: true },
   });
   return properties;
 }

export default async function PropertiesPage() {
  const properties = await getProperties();
  console.log(properties);
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Fastigheter</h1>
          <p className="text-muted-foreground">
            Hus och byggnader du äger
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Ny fastighet
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Alla fastigheter</CardTitle>
          <CardDescription>
            Totalt {properties.length} fastigheter
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Namn</TableHead>
                <TableHead>Ort</TableHead>
                <TableHead>Enheter</TableHead>
                <TableHead>Total hyra</TableHead>
                <TableHead className="text-right" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {properties.map((p: any) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell>{p.city}</TableCell>
                  <TableCell>{p.units.length} st</TableCell>
                  <TableCell>{p.units.reduce((sum: number, unit: any) => sum + unit.rent, 0).toLocaleString("sv-SE")} kr</TableCell>
                  <TableCell className="text-right">
                    <Button asChild size="icon" variant="ghost">
                      <Link href={`/dashboard/properties/${p.id}`}>
                        <ArrowUpRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow> 
              ))}
              {properties.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                    Inga fastigheter ännu
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
