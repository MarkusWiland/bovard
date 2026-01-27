'use client';

import { useState } from 'react';
import { Home, ChevronRight, CheckCircle, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Property {
  id: string;
  address: string;
  city: string;
  tenants: number;
  rent: number;
  status: 'paid' | 'pending' | 'overdue';
}

interface PropertiesListProps {
  properties: Property[];
}

export function PropertiesList({ properties }: PropertiesListProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className="space-y-2">
      {properties.map((property) => (
        <div
          key={property.id}
          onMouseEnter={() => setHoveredId(property.id)}
          onMouseLeave={() => setHoveredId(null)}
          className={cn(
            'flex items-center justify-between p-4 rounded-lg border transition-all cursor-pointer',
            hoveredId === property.id && 'bg-muted shadow-sm'
          )}
        >
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-muted p-3">
              <Home className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium">{property.address}</p>
              <p className="text-sm text-muted-foreground">
                {property.city} • {property.tenants} hyresgäst
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-semibold">{property.rent.toLocaleString('sv-SE')} kr</p>
              {property.status === 'paid' ? (
                <Badge variant="outline" className="text-green-600 border-green-200">
                  <CheckCircle className="mr-1 h-3 w-3" />
                  Betald
                </Badge>
              ) : (
                <Badge variant="outline" className="text-amber-600 border-amber-200">
                  <Clock className="mr-1 h-3 w-3" />
                  Väntande
                </Badge>
              )}
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </div>
        </div>
      ))}
    </div>
  );
}