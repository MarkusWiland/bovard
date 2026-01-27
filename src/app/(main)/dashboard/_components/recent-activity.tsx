'use client';

import { CheckCircle, Bell, FileText, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Activity {
  id: string;
  type: 'payment' | 'reminder' | 'contract' | 'maintenance';
  tenant: string;
  property: string;
  date: string;
  amount: number;
}

interface RecentActivityProps {
  activities: Activity[];
}

export function RecentActivity({ activities }: RecentActivityProps) {
  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'payment':
        return { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-950' };
      case 'reminder':
        return { icon: Bell, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-950' };
      case 'contract':
        return { icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-950' };
      case 'maintenance':
        return { icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-950' };
    }
  };

  const getActivityText = (type: Activity['type']) => {
    switch (type) {
      case 'payment':
        return 'Betalning mottagen';
      case 'reminder':
        return 'Påminnelse skickad';
      case 'contract':
        return 'Nytt avtal skapat';
      case 'maintenance':
        return 'Felanmälan registrerad';
    }
  };

  return (
    <div className="space-y-3">
      {activities.map((activity) => {
        const { icon: Icon, color, bg } = getActivityIcon(activity.type);
        
        return (
          <div
            key={activity.id}
            className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className={cn('rounded-lg p-2', bg)}>
                <Icon className={cn('h-4 w-4', color)} />
              </div>
              <div>
                <p className="font-medium">{getActivityText(activity.type)}</p>
                <p className="text-sm text-muted-foreground">
                  {activity.tenant} • {activity.property}
                </p>
              </div>
            </div>
            <div className="text-right">
              {activity.amount > 0 && (
                <p className="font-semibold">{activity.amount.toLocaleString('sv-SE')} kr</p>
              )}
              <p className="text-sm text-muted-foreground">{activity.date}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}