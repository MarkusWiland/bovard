// app/dashboard/units/page.tsx
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";

// ================= MOCK DATA =================
async function getUnits() {
  return [
    {
      id: "u1",
      label: "12A",
      rent: 12500,
      status: "paid",
      property: {
        id: "p1",
        name: "Vasagatan 12",
      },
      tenant: "Anna Andersson",
    },
    {
      id: "u2",
      label: "12B",
      rent: 11500,
      status: "late",
      property: {
        id: "p1",
        name: "Vasagatan 12",
      },
      tenant: "Erik Svensson",
    },
    {
      id: "u3",
      label: "12C",
      rent: 12500,
      status: "vacant",
      property: {
        id: "p1",
        name: "Vasagatan 12",
      },
      tenant: null,
    },
    {
      id: "u4",
      label: "1A",
      rent: 13500,
      status: "paid",
      property: {
        id: "p2",
        name: "Kungsgatan 23",
      },
      tenant: "Lars Nilsson",
    },
  ] as const;
}

// ================= PRISMA (AKTIVERA SEN) =================
// import { prisma } from "@/lib/prisma";
// async function getUnits() {
//   return prisma.unit.findMany({
//     include: {
//       property: true,
//       tenant: true,
//     },
//   });
// }

export default async function UnitsPage() {
  const units = await getUnits();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Enheter</h1>
        <p className="text-muted-foreground">
          Alla lägenheter och lokaler
        </p>
      </div>

      {/* Units table */}
      <Card>
        <CardHeader>
          <CardTitle>Alla enheter</CardTitle>
          <CardDescription>
            Totalt {units.length} enheter
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Enhet</TableHead>
                <TableHead>Fastighet</TableHead>
                <TableHead>Hyresgäst</TableHead>
                <TableHead>Hyra</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right" />
              </TableRow>
            </TableHeader>

            <TableBody>
              {units.map((unit) => (
                <TableRow key={unit.id}>
                  <TableCell className="font-medium">
                    {unit.label}
                  </TableCell>

                  <TableCell>
                    <Link
                      href={`/dashboard/properties/${unit.property.id}`}
                      className="hover:underline"
                    >
                      {unit.property.name}
                    </Link>
                  </TableCell>

                  <TableCell>
                    {unit.tenant ?? "—"}
                  </TableCell>

                  <TableCell>
                    {unit.rent.toLocaleString("sv-SE")} kr
                  </TableCell>

                  <TableCell>
                    {unit.status === "paid" && (
                      <Badge variant="default">Betald</Badge>
                    )}
                    {unit.status === "late" && (
                      <Badge variant="destructive">
                        Försenad
                      </Badge>
                    )}
                    {unit.status === "vacant" && (
                      <Badge variant="secondary">
                        Ledig
                      </Badge>
                    )}
                  </TableCell>

                  <TableCell className="text-right">
                    <Button asChild size="icon" variant="ghost">
                      <Link
                        href={`/dashboard/properties/${unit.property.id}/units/${unit.id}`}
                      >
                        <ArrowUpRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}

              {units.length > 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="py-8 text-center text-muted-foreground"
                  >
                    Inga enheter ännu
                  </TableCell>
                </TableRow>
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    Inga enheter ännu
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
