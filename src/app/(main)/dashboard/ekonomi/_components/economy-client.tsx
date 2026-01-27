"use client";

import { useMemo, useState } from "react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { EconomyChart } from "./economy-chart";
import { EconomyTable } from "./economy-table";

export function EconomyClient({ data }: { data: any }) {
  const [status, setStatus] = useState("all");

  const filtered = useMemo(() => {
    if (status === "all") return data.transactions;
    return data.transactions.filter(
      (t: any) => t.status === status
    );
  }, [status, data.transactions]);

  return (
    <div className="space-y-6">
      {/* SUMMARY */}
      <div className="grid md:grid-cols-4 gap-4">
        <SummaryCard title="Månadshyra" value={data.summary.monthlyRent} />
        <SummaryCard title="Betalt" value={data.summary.paidThisMonth} />
        <SummaryCard
          title="Obetalt"
          value={data.summary.outstanding}
          destructive
        />
        <SummaryCard
          title="Betalningsgrad"
          value={`${data.summary.paidPercentage}%`}
        />
      </div>

      {/* FILTER */}
      <Card>
        <CardHeader>
          <CardTitle>Filter</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-4">
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alla</SelectItem>
              <SelectItem value="paid">Betalda</SelectItem>
              <SelectItem value="late">Försenade</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* CHART */}
      <EconomyChart transactions={filtered} />

      {/* TABLE */}
      <EconomyTable transactions={filtered} />
    </div>
  );
}

function SummaryCard({
  title,
  value,
  destructive,
}: {
  title: string;
  value: number | string;
  destructive?: boolean;
}) {
  return (
    <Card>
      <CardHeader>
        <p className="text-sm text-muted-foreground">{title}</p>
        <CardTitle
          className={destructive ? "text-destructive" : ""}
        >
          {typeof value === "number"
            ? `${value.toLocaleString("sv-SE")} kr`
            : value}
        </CardTitle>
      </CardHeader>
    </Card>
  );
}
