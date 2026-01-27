'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, TrendingUp, FileText, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface StatsCardsProps {
  stats: {
    totalProperties: number;
    monthlyRent: number;
    activeContracts: number;
    paidPercentage: number;
  };
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: 'Totala fastigheter',
      value: stats.totalProperties,
      change: '+2 denna månad',
      icon: Home,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-950',
    },
    {
      title: 'Månadshyra',
      value: `${stats.monthlyRent.toLocaleString('sv-SE')} kr`,
      change: `${stats.paidPercentage}% inbetald`,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-950',
    },
    {
      title: 'Aktiva kontrakt',
      value: stats.activeContracts,
      change: '2 förnyas snart',
      icon: FileText,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-950',
    },
    {
      title: 'Betalningsstatus',
      value: `${stats.paidPercentage}%`,
      change: 'På tid',
      icon: CheckCircle,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <div className={`rounded-lg p-2 ${card.bgColor}`}>
                <card.icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground">{card.change}</p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}