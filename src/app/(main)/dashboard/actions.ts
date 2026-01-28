// app/dashboard/_actions/get-dashboard-stats.ts
"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "@/lib/get-session";
import { redirect } from "next/navigation";

export async function getDashboardStats() {
  const session = await getServerSession();
  if (!session?.user) redirect("/sign-in");

  const membership = await prisma.membership.findFirst({
    where: { userId: session.user.id },
    select: { organizationId: true },
  });

  if (!membership) {
    throw new Error("No organization access");
  }

  const organizationId = membership.organizationId;

  const [totalProperties, activeContracts, upcomingExpirations] =
    await Promise.all([
      prisma.property.count({
        where: { organizationId },
      }),

      prisma.contract.findMany({
        where: {
          status: "ACTIVE",
          unit: {
            property: { organizationId },
          },
        },
        select: {
          unitId: true,
          unit: {
            select: {
              rent: true,
              payments: {
                orderBy: { dueDate: "desc" },
                take: 1,
                select: { status: true },
              },
            },
          },
        },
      }),

      prisma.contract.count({
        where: {
          status: "ACTIVE",
          endDate: {
            lte: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
          },
          unit: {
            property: { organizationId },
          },
        },
      }),
    ]);

  const monthlyRent = activeContracts.reduce(
    (sum, c) => sum + c.unit.rent,
    0
  );

  const paidCount = activeContracts.filter(
    (c) => c.unit.payments[0]?.status === "PAID"
  ).length;

  const paidPercentage =
    activeContracts.length === 0
      ? 0
      : Math.round((paidCount / activeContracts.length) * 100);

  return {
  stats: {
    totalProperties,
    monthlyRent,
    activeContracts: activeContracts.length,
    paidPercentage,
    upcomingExpirations, 
  },
  };
}
