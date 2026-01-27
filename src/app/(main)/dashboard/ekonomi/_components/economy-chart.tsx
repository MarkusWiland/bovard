"use client";

import { useMemo, useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type ChartMode = "line" | "bar";

export function EconomyChart({
  transactions,
}: {
  transactions: {
    month: string;
    amount: number;
    status: "paid" | "late";
  }[];
}) {
  const [mode, setMode] = useState<ChartMode>("line");

  /**
   * Aggregera per månad
   */
  const data = useMemo(() => {
    const map = new Map<
      string,
      { month: string; paid: number; late: number }
    >();

    for (const t of transactions) {
      if (!map.has(t.month)) {
        map.set(t.month, {
          month: t.month,
          paid: 0,
          late: 0,
        });
      }

      const entry = map.get(t.month)!;
      if (t.status === "paid") entry.paid += t.amount;
      if (t.status === "late") entry.late += t.amount;
    }

    return Array.from(map.values());
  }, [transactions]);

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Intäkter över tid</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Ingen data att visa för vald period.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Intäkter över tid</CardTitle>

        {/* Chart mode toggle */}
        <div className="flex gap-1">
          <Button
            size="sm"
            variant={mode === "line" ? "default" : "outline"}
            onClick={() => setMode("line")}
          >
            Trend
          </Button>
          <Button
            size="sm"
            variant={mode === "bar" ? "default" : "outline"}
            onClick={() => setMode("bar")}
          >
            Fördelning
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <ChartContainer
          className="h-[320px]"
          config={{
            paid: {
              label: "Betalt",
              color: "hsl(var(--chart-1))",
            },
            late: {
              label: "Obetalt",
              color: "hsl(var(--chart-2))",
            },
          }}
        >
          {mode === "line" ? (
            <LineChart data={data}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />

              <Line
                type="monotone"
                dataKey="paid"
                stroke="var(--color-paid)"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="late"
                stroke="var(--color-late)"
                strokeWidth={2}
              />
            </LineChart>
          ) : (
            <BarChart data={data}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />

              <Bar
                dataKey="paid"
                fill="var(--color-paid)"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="late"
                fill="var(--color-late)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          )}
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
