import { Suspense } from "react";
import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { PropertiesList } from "./_components/properties-list";
import { StatsCards } from "./_components/stats-card";
import { RecentActivity } from "./_components/recent-activity";
import { UpcomingTasks } from "./_components/upcoming-task";
import { QuickActions } from "./_components/quick-actions";
import {
  ActivitySkeleton,
  PropertiesListSkeleton,
  StatsCardsSkeleton,
  TasksSkeleton,
} from "./_components/skeleton-comps";

import { getServerSession } from "@/lib/get-session";
import prisma from "@/lib/prisma";
import { getDashboardStats } from "./actions";

/* ======================================================
   AUTH - Hämta organizationId säkert
====================================================== */

async function getOrganizationId(): Promise<string> {
  const session = await getServerSession();

  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  const membership = await prisma.membership.findFirst({
    where: { userId: session.user.id },
    select: { organizationId: true },
  });

  if (!membership?.organizationId) {
    redirect("/onboarding");
  }

  return membership.organizationId;
}

/* ======================================================
   DATA FETCHING
====================================================== */

async function getDashboardData() {
  const organizationId = await getOrganizationId();

  const [properties, recentPayments, expiringContracts] = await Promise.all([
    // 1. Alla fastigheter med units och aktiva kontrakt
    prisma.property.findMany({
      where: { organizationId },
      include: {
        units: {
          include: {
            contracts: {
              where: { status: "ACTIVE" },
              include: {
                tenant: { select: { name: true } },
              },
            },
            payments: {
              orderBy: { dueDate: "desc" },
              take: 1,
              select: { status: true, amount: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),

    // 2. Senaste betalningar
    prisma.payment.findMany({
      where: {
        unit: { property: { organizationId } },
      },
      include: {
        unit: {
          include: {
            property: { select: { name: true } },
            contracts: {
              where: { status: "ACTIVE" },
              include: {
                tenant: { select: { name: true } },
              },
              take: 1,
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),

    // 3. Kontrakt som löper ut inom 60 dagar
    prisma.contract.findMany({
      where: {
        status: "ACTIVE",
        unit: { property: { organizationId } },
        endDate: {
          lte: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
          gte: new Date(),
        },
      },
      include: {
        tenant: { select: { name: true } },
        unit: {
          include: {
            property: { select: { name: true } },
          },
        },
      },
      orderBy: { endDate: "asc" },
      take: 5,
    }),
  ]);

  /* ======================================================
     BERÄKNA STATS & PROPERTIES LIST
  ====================================================== */

  let totalMonthlyRent = 0;
  let activeContractsCount = 0;
  let paidCount = 0;
  let occupiedUnitsCount = 0;

  const propertiesList = properties.map((property) => {
    let propertyRent = 0;
    let tenantCount = 0;
    let hasLatePayment = false;

    for (const unit of property.units) {
      // Räkna hyra för alla units
      propertyRent += unit.rent;

      // Kolla om unit har aktivt kontrakt (= hyresgäst)
      const activeContract = unit.contracts[0];
      if (activeContract) {
        tenantCount++;
        activeContractsCount++;
        occupiedUnitsCount++;

        // Kolla senaste betalning
        const lastPayment = unit.payments[0];
        if (lastPayment) {
          if (lastPayment.status === "PAID") {
            paidCount++;
          } else if (lastPayment.status === "LATE") {
            hasLatePayment = true;
          }
        }
      }
    }

    totalMonthlyRent += propertyRent;

    return {
      id: property.id,
      address: property.name,
      city: property.city,
      tenants: tenantCount,
      rent: propertyRent,
      status: hasLatePayment ? ("pending" as const) : ("paid" as const),
    };
  });

  // Beräkna procent betalda
  const paidPercentage =
    occupiedUnitsCount > 0
      ? Math.round((paidCount / occupiedUnitsCount) * 100)
      : 100;

  /* ======================================================
     FORMATERA AKTIVITETER
  ====================================================== */

  const recentActivity = recentPayments.map((payment) => {
    const activeContract = payment.unit.contracts[0];
    const tenantName = activeContract?.tenant?.name ?? "Okänd hyresgäst";

    return {
      id: payment.id,
      type: "payment" as const,
      tenant: tenantName,
      property: payment.unit.property.name,
      date: payment.createdAt.toISOString().split("T")[0],
      amount: payment.amount,
    };
  });

  /* ======================================================
     FORMATERA UPPGIFTER
  ====================================================== */

  const upcomingTasks = expiringContracts.map((contract) => ({
    id: contract.id,
    task: `Avtalsförnyelse - ${contract.tenant.name}`,
    property: contract.unit.property.name,
    date: contract.endDate!.toISOString().split("T")[0],
    priority: "high" as const,
  }));

  /* ======================================================
     RETURN
  ====================================================== */

  return {
    stats: {
      totalProperties: properties.length,
      monthlyRent: totalMonthlyRent,
      activeContracts: activeContractsCount,
      paidPercentage,
    },
    properties: propertiesList,
    recentActivity,
    upcomingTasks,
  };
}

/* ======================================================
   PAGE COMPONENT
====================================================== */

export default async function DashboardPage() {
  const data = await getDashboardData();
  const stats = await getDashboardStats()
  return (
    <div className="flex-1 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Välkommen tillbaka!
        </h1>
        <p className="text-muted-foreground">
          Här är en översikt av dina fastigheter
        </p>
      </div>

      {/* Stats */}
      <Suspense fallback={<StatsCardsSkeleton />}>
        <StatsCards stats={stats.stats} />
      </Suspense>

      {/* Main Grid */}
      <div className="grid gap-6 lg:grid-cols-7">
        {/* Properties List */}
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Dina fastigheter</CardTitle>
            <CardDescription>
              {data.properties.length > 0
                ? `${data.properties.length} fastighet${data.properties.length > 1 ? "er" : ""} registrerad${data.properties.length > 1 ? "e" : ""}`
                : "Lägg till din första fastighet för att komma igång"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<PropertiesListSkeleton />}>
              <PropertiesList properties={data.properties} />
            </Suspense>
          </CardContent>
        </Card>

        {/* Sidebar */}
        <div className="lg:col-span-3 space-y-6">
          <QuickActions />

          <Card>
            <CardHeader>
              <CardTitle>Kommande uppgifter</CardTitle>
              <CardDescription>Avtal som snart löper ut</CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<TasksSkeleton />}>
                <UpcomingTasks tasks={data.upcomingTasks} />
              </Suspense>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Senaste aktiviteter</CardTitle>
          <CardDescription>Nyliga betalningar och händelser</CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<ActivitySkeleton />}>
            <RecentActivity activities={data.recentActivity} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}