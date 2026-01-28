"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Mail, Phone, Search } from "lucide-react";
import prisma from "@/lib/prisma";
import { Contract, ContractStatus } from "@/generated/prisma";

type TenantRow = {
  id: string;
  name: string;
  email: string;  
  phone: string;
  moveInDate: Date;
  contracts: {
    id: string;
    status: ContractStatus;
    template: {
      id: string;
      name: string;
    };
    unit: {
      id: string;
      label: string;
      rent: number;
      property: {
        id: string;
        name: string;
      };
    };
  }[];
};

  
export function TenantsTable({ tenants }: { tenants: TenantRow[] }) {
  const [query, setQuery] = useState("");
  const filteredTenants = useMemo(() => {
    const q = query.toLowerCase();
 
    return tenants.filter((t) => {
      const contract = t.contracts[0];
      return [
        t.name,
        t.email,
        contract?.unit.label,
        contract?.unit.property.name,
      ]
        .filter(Boolean)
        .some((field) => field!.toLowerCase().includes(q));
    });
  }, [query, tenants]);
  console.log("tenants", tenants);
  return (
    <div className="space-y-4">
      {/* SEARCH */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Sök hyresgäst, enhet eller fastighet…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* TABLE */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Namn</TableHead>
            <TableHead>Kontakt</TableHead>
            <TableHead>Enhet</TableHead>
            <TableHead>Fastighet</TableHead>
            <TableHead>Inflytt</TableHead>
            <TableHead>Avtal</TableHead>
            <TableHead>Hyra</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right" />
          </TableRow>
        </TableHeader>

        <TableBody>
          {filteredTenants.map((tenant) => (
            <TableRow key={tenant.id}>
              <TableCell className="font-medium">
                {tenant.name}
              </TableCell>

              <TableCell>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    {tenant.email}
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    {tenant.phone}
                  </div>
                </div>
              </TableCell>

              <TableCell>
  {tenant.contracts[0]?.unit?.label ?? "—"}
</TableCell>


              <TableCell>
                <Link
                  href={`/dashboard/properties/${tenant.contracts[0]?.unit?.property?.id}`}
                  className="hover:underline"
                >
                  {tenant.contracts[0]?.unit?.property?.name}
                </Link>
              </TableCell>

              <TableCell>
                {new Date(tenant.moveInDate).toLocaleDateString("sv-SE")}
              </TableCell>

              <TableCell>
                {tenant.contracts[0]?.unit?.rent?.toLocaleString("sv-SE")} kr
              </TableCell>

              <TableCell>
                {tenant.contracts[0]?.status === "ACTIVE" && (
                  <Badge variant="default">Aktiv</Badge>
                )}
                {tenant.contracts[0]?.status === "EXPIRED" && (
                  <Badge variant="destructive">Utgången avtal</Badge>
                )}
                {tenant.contracts[0]?.status === "TERMINATED" && (
                  <Badge variant="destructive">Avslutat</Badge>
                )}
                {tenant.contracts[0]?.status === "DRAFT" && (
                  <Badge variant="secondary">Utkast</Badge>
                )}
              </TableCell>
              <TableCell>
  {tenant.contracts[0]?.template.id ? (
    <Badge variant="outline">
      {tenant.contracts[0]?.template.name}
    </Badge>
  ) : (
    <span className="text-muted-foreground text-sm">Inget avtal</span>
  )}
</TableCell>

              <TableCell className="text-right">
              <Button
  asChild
  size="icon"
  variant="ghost"
  title="Visa hyresgäst"
>
  <Link href={`/dashboard/hyresgaster/${tenant.id}`}>
    <ArrowUpRight className="h-4 w-4" />
  </Link>
</Button>

              </TableCell>
            </TableRow>
          ))}

          {filteredTenants.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={8}
                className="text-center text-muted-foreground py-8"
              >
                Inga matchande hyresgäster
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
