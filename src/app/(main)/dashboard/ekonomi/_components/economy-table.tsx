"use client";

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
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Mail } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function EconomyTable({ transactions }: { transactions: any[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaktioner</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Hyresgäst</TableHead>
              <TableHead>Månad</TableHead>
              <TableHead>Belopp</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Stripe</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>

          <TableBody>
            {transactions.map((tx) => (
              <TableRow key={tx.id}>
                <TableCell>{tx.tenant}</TableCell>
                <TableCell>{tx.month}</TableCell>
                <TableCell>
                  {tx.amount.toLocaleString("sv-SE")} kr
                </TableCell>

                <TableCell>
                  <Badge
                    variant={
                      tx.status === "paid"
                        ? "default"
                        : "destructive"
                    }
                  >
                    {tx.status === "paid"
                      ? "Betald"
                      : "Försenad"}
                  </Badge>
                </TableCell>

                <TableCell>
                  <Badge variant="secondary">
                    {tx.stripeStatus}
                  </Badge>
                </TableCell>

                <TableCell>
                  {tx.status === "late" && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Mail className="h-4 w-4 mr-2" />
                          Skicka påminnelse
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
