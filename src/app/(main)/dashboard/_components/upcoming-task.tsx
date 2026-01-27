'use client';

import { AlertCircle, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Task {
  id: string;
  task: string;
  property: string;
  date: string;
  priority: 'high' | 'medium' | 'low';
}

interface UpcomingTasksProps {
  tasks: Task[];
}

export function UpcomingTasks({ tasks }: UpcomingTasksProps) {
  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-50 dark:bg-red-950 text-red-600 border-red-200';
      case 'medium':
        return 'bg-amber-50 dark:bg-amber-950 text-amber-600 border-amber-200';
      case 'low':
        return 'bg-blue-50 dark:bg-blue-950 text-blue-600 border-blue-200';
    }
  };

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <div
          key={task.id}
          className="flex items-start gap-4 rounded-lg border p-4 hover:bg-muted transition-colors"
        >
          <div className={cn('rounded-lg p-2', getPriorityColor(task.priority))}>
            <AlertCircle className="h-4 w-4" />
          </div>
          <div className="flex-1 space-y-1">
            <p className="font-medium">{task.task}</p>
            <p className="text-sm text-muted-foreground">{task.property}</p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>Förfaller: {task.date}</span>
            </div>
          </div>
          <Button size="sm" variant="outline">
            Hantera
          </Button>
        </div>
      ))}
    </div>
  );
}