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

export type UnitRow = {
  id: string;
  label: string;
  rent: number;
  status: "paid" | "late" | "vacant";
  tenant?: {
    name: string;
  } | null;
};

export function UnitsTable({
  propertyId,
  units,
}: {
  propertyId: string;
  units: UnitRow[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Enheter</CardTitle>
        <CardDescription>
          Totalt {units.length} enheter i fastigheten
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Enhet</TableHead>
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
                  {unit.tenant?.name ?? (
                    <span className="text-muted-foreground">
                      — Ledig —
                    </span>
                  )}
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
                    <Badge variant="secondary">Ledig</Badge>
                  )}
                </TableCell>

                <TableCell className="text-right">
                  <Button asChild size="icon" variant="ghost">
                    <Link
                      href={`/dashboard/properties/${propertyId}/units/${unit.id}`}
                    >
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}

            {units.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-muted-foreground py-8"
                >
                  Inga enheter ännu
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
