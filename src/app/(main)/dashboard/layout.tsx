import { ReactNode } from "react";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SidebarNav } from "./_components/sidebar-nav";
import { DashboardHeader } from "./_components/dashboard-header";
import { getServerSession } from "@/lib/get-session";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getServerSession()
  const user = session?.user
  if(!user) {
    redirect("/sign-up")
  }
  return (
    <div className="flex min-h-screen bg-muted/40">
      {/* SIDEBAR */}
      <aside className="fixed inset-y-0 left-0 z-40 w-64 border-r bg-background">
        <div className="flex h-full flex-col">
          <div className="p-6 border-b">
            <h1 className="text-xl font-bold">HyresPortal</h1>
            <p className="text-sm text-muted-foreground">
              Din fastighetsassistent
            </p>
          </div>

          <ScrollArea className="flex-1">
            <nav className="p-4 space-y-1">
              <SidebarNav
                items={[
                  { title: "Översikt", href: "/dashboard", icon: "home" },
                  {
                    title: "Fastigheter",
                    href: "/dashboard/properties",
                    icon: "building",
                  },
                  {
                    title: "Hyresgäster",
                    href: "/dashboard/hyresgaster",
                    icon: "users",
                  },
                  {
                    title: "Dokument",
                    href: "/dashboard/documents",
                    icon: "file",
                  },
                  {
                    title: "Avtalmallar",
                    href: "/dashboard/avtalsmallar",
                    icon: "file",
                  },
                  {
                    title: "Ekonomi",
                    href: "/dashboard/finance",
                    icon: "finance",
                  },
                ]}
              />
            </nav>
          </ScrollArea>

          <Separator />

          <div className="p-4">
            {/* Premium card */}
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <div className="flex flex-1 flex-col ml-64">
        <DashboardHeader />

        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
