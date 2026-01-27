// app/dashboard/_components/sidebar-nav.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Building2,
  Users,
  FileText,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

const iconMap = {
  home: Home,
  building: Building2,
  users: Users,
  file: FileText,
  finance: TrendingUp,
};

interface NavItem {
  title: string;
  href: string;
  icon: keyof typeof iconMap;
}

export function SidebarNav({ items }: { items: NavItem[] }) {
  const pathname = usePathname();

  return (
    <>
      {items.map((item) => {
        const isRootDashboard = item.href === "/dashboard";

        const isActive = isRootDashboard
          ? pathname === "/dashboard"
          : pathname === item.href ||
            pathname.startsWith(item.href + "/");

        const Icon = iconMap[item.icon];

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
              isActive
                ? "bg-accent text-accent-foreground"
                : "hover:bg-accent"
            )}
          >
            <Icon className="h-5 w-5" />
            {item.title}
          </Link>
        );
      })}
    </>
  );
}
