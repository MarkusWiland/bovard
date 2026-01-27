import { Suspense } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { StatsCards } from "./_components/stats-card";
import { PropertiesList } from "./_components/properties-list";
import { RecentActivity } from "./_components/recent-activity";
import { UpcomingTasks } from "./_components/upcoming-task";
import { QuickActions } from "./_components/quick-actions";

import {
  ActivitySkeleton,
  PropertiesListSkeleton,
  StatsCardsSkeleton,
  TasksSkeleton,
} from "./_components/skeleton-comps";

import { auth } from "@/lib/auth";

import { getServerSession } from "@/lib/get-session";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

/* ======================================================
   DATA FETCHING (SERVER)
====================================================== */

async function getDashboardData() {
      const session = await getServerSession();
      const user = session?.user;
      if (!user) {
        redirect("/sign-in");
      }

  const membership = await prisma.membership.findFirst({
    where: { userId: user.id },
    include: { organization: true },
  });

  if (!membership) {
    throw new Error("User has no organization");
  }

  const organizationId = membership.organizationId;

  /* =========================
     PROPERTIES + UNITS
  ========================= */

  const properties = await prisma.property.findMany({
    where: { organizationId },
    include: {
      units: {
        include: {
          tenant: true,
          payments: {
            orderBy: { dueDate: "desc" },
            take: 1,
          },
        },
      },
    },
  });

  /* =========================
     STATS
  ========================= */

  const totalProperties = properties.length;

  const monthlyRent = properties
    .flatMap((p) => p.units)
    .reduce((sum, unit) => sum + unit.rent, 0);

  const activeContracts = properties
    .flatMap((p) => p.units)
    .filter((u) => u.tenant).length;

  const paidUnits = properties
    .flatMap((p) => p.units)
    .filter(
      (u) =>
        u.payments[0] &&
        u.payments[0].status === "PAID"
    ).length;

  const paidPercentage =
    activeContracts === 0
      ? 0
      : Math.round((paidUnits / activeContracts) * 100);

  /* =========================
     PROPERTIES LIST
  ========================= */

  const propertiesList = properties.map((p) => {
    const totalRent = p.units.reduce(
      (sum, u) => sum + u.rent,
      0
    );

    const hasLatePayment = p.units.some(
      (u) => u.payments[0]?.status === "LATE"
    );

    return {
      id: p.id,
      address: p.name,
      city: p.city,
      tenants: p.units.filter((u) => u.tenant).length,
      rent: totalRent,
      status: hasLatePayment ? "pending" : "paid",
    } as const;
  });

  /* =========================
     RECENT ACTIVITY
  ========================= */

  const recentPayments = await prisma.payment.findMany({
    where: {
      unit: {
        property: {
          organizationId,
        },
      },
    },
    include: {
      unit: {
        include: {
          tenant: true,
          property: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  const recentActivity = recentPayments.map((p) => ({
    id: p.id,
    type: "payment" as const,
    tenant: p.unit.tenant?.name ?? "Okänd",
    property: p.unit.property.name,
    date: p.createdAt.toISOString().split("T")[0],
    amount: p.amount,
  }));

  /* =========================
     UPCOMING TASKS
  ========================= */

  const upcomingContracts = await prisma.unit.findMany({
    where: {
      property: { organizationId },
      contractEnd: {
        lte: new Date(
          Date.now() + 1000 * 60 * 60 * 24 * 60
        ), // 60 dagar
      },
    },
    include: {
      property: true,
    },
    orderBy: { contractEnd: "asc" },
    take: 5,
  });

  const upcomingTasks = upcomingContracts.map((u) => ({
    id: u.id,
    task: "Avtalsförnyelse",
    property: u.property.name,
    date: u.contractEnd.toISOString().split("T")[0],
    priority: "high" as const,
  }));

  return {
    stats: {
      totalProperties,
      monthlyRent,
      activeContracts,
      paidPercentage,
    },
    properties: propertiesList,
    recentActivity,
    upcomingTasks,
  };
}

/* ======================================================
   PAGE
====================================================== */

export default async function DashboardPage() {
  const data = await getDashboardData();

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <main className="flex-1 space-y-4 p-4 sm:p-6">
        {/* Welcome */}
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Välkommen tillbaka!
          </h2>
          <p className="text-muted-foreground">
            Här är en översikt av dina fastigheter
          </p>
        </div>

        {/* Stats */}
        <Suspense fallback={<StatsCardsSkeleton />}>
          <StatsCards stats={data.stats} />
        </Suspense>

        {/* Main Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-full lg:col-span-4">
            <CardHeader>
              <CardTitle>Dina fastigheter</CardTitle>
              <CardDescription>
                Översikt av alla dina hyresfastigheter
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<PropertiesListSkeleton />}>
                <PropertiesList properties={data.properties} />
              </Suspense>
            </CardContent>
          </Card>

          <div className="col-span-full lg:col-span-3 space-y-4">
            <QuickActions />

            <Card>
              <CardHeader>
                <CardTitle>Kommande uppgifter</CardTitle>
                <CardDescription>
                  Saker som kräver din uppmärksamhet
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<TasksSkeleton />}>
                  <UpcomingTasks tasks={data.upcomingTasks} />
                </Suspense>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Senaste aktiviteter</CardTitle>
            <CardDescription>
              Nyliga händelser i dina fastigheter
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<ActivitySkeleton />}>
              <RecentActivity activities={data.recentActivity} />
            </Suspense>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
