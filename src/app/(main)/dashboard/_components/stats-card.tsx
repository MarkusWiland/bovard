"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Home,
  TrendingUp,
  FileText,
  CheckCircle,
} from "lucide-react";
import { motion } from "framer-motion";

/* ======================================================
   TYPES
====================================================== */

interface StatsCardsProps {
  stats: {
    totalProperties: number;
    monthlyRent: number;
    activeContracts: number;
    paidPercentage: number;
    upcomingExpirations: number;
  };
}

/* ======================================================
   COMPONENT
====================================================== */

export function StatsCards({
  stats,
}: StatsCardsProps) {
  const cards = [
    {
      title: "Totala fastigheter",
      value: stats.totalProperties,
      subtitle: "Registrerade objekt",
      icon: Home,
      color: "text-blue-600",
      bg: "bg-blue-50 dark:bg-blue-950",
    },
    {
      title: "Månadshyra",
      value: `${stats.monthlyRent.toLocaleString("sv-SE")} kr`,
      subtitle: `${stats.paidPercentage}% betalt`,
      icon: TrendingUp,
      color: "text-green-600",
      bg: "bg-green-50 dark:bg-green-950",
    },
    {
      title: "Aktiva avtal",
      value: stats.activeContracts,
      subtitle: `${stats.upcomingExpirations} löper ut snart`,
      icon: FileText,
      color: "text-purple-600",
      bg: "bg-purple-50 dark:bg-purple-950",
    },
    {
      title: "Betalningsgrad",
      value: `${stats.paidPercentage}%`,
      subtitle: "I tid",
      icon: CheckCircle,
      color: "text-emerald-600",
      bg: "bg-emerald-50 dark:bg-emerald-950",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, i) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>
              <div className={`rounded-lg p-2 ${card.bg}`}>
                <card.icon
                  className={`h-4 w-4 ${card.color}`}
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {card.value}
              </div>
              <p className="text-xs text-muted-foreground">
                {card.subtitle}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
