"use client";

import Link from "next/link";
import {
  Home,
  ChevronRight,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

/* ======================================================
   TYPES
====================================================== */

export type PropertyStatus =
  | "paid"
  | "pending"
  | "overdue"
  | "empty";

export interface PropertyListItem {
  id: string;
  address: string;
  city: string;
  tenants: number;
  rent: number;
  status: Exclude<PropertyStatus, "empty">;
}

interface PropertiesListProps {
  properties: PropertyListItem[];
}

/* ======================================================
   COMPONENT
====================================================== */

export function PropertiesList({
  properties,
}: PropertiesListProps) {
  if (properties.length === 0) {
    return (
      <div className="py-8 text-center text-sm text-muted-foreground">
        Inga fastigheter hittades
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {properties.map((property) => {
        const effectiveStatus: PropertyStatus =
          property.tenants === 0
            ? "empty"
            : property.status;

        return (
          <Link
            key={property.id}
            href={`/dashboard/properties/${property.id}`}
            className={cn(
              "group flex items-center justify-between rounded-lg border p-4 transition-all",
              "hover:bg-muted hover:shadow-sm",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            )}
          >
            {/* LEFT */}
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-muted p-3">
                <Home className="h-5 w-5 text-muted-foreground" />
              </div>

              <div>
                <p className="font-medium leading-none">
                  {property.address}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {property.city} •{" "}
                  {property.tenants === 0
                    ? "Inga hyresgäster"
                    : `${property.tenants} ${
                        property.tenants === 1
                          ? "hyresgäst"
                          : "hyresgäster"
                      }`}
                </p>
              </div>
            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="font-semibold">
                  {property.rent.toLocaleString("sv-SE")} kr
                </p>
                <StatusBadge status={effectiveStatus} />
              </div>

              <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
            </div>
          </Link>
        );
      })}
    </div>
  );
}

/* ======================================================
   STATUS BADGE
====================================================== */

function StatusBadge({
  status,
}: {
  status: PropertyStatus;
}) {
  switch (status) {
    case "paid":
      return (
        <Badge
          variant="outline"
          className="mt-1 border-green-300 text-green-700"
        >
          <CheckCircle className="mr-1 h-3 w-3" />
          Betald
        </Badge>
      );

    case "overdue":
      return (
        <Badge
          variant="outline"
          className="mt-1 border-red-300 text-red-700"
        >
          <AlertCircle className="mr-1 h-3 w-3" />
          Försenad
        </Badge>
      );

    case "empty":
      return (
        <Badge
          variant="outline"
          className="mt-1 border-dashed text-muted-foreground"
        >
          Inga enheter
        </Badge>
      );

    default:
      return (
        <Badge
          variant="outline"
          className="mt-1 border-amber-300 text-amber-700"
        >
          <Clock className="mr-1 h-3 w-3" />
          Väntande
        </Badge>
      );
  }
}
