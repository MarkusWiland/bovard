// app/onboarding/actions.ts
"use server";

import { getServerSession } from "@/lib/get-session";
import prisma from "@/lib/prisma";
import { addDays, addYears } from "date-fns";
// import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

/* ===============================
   STEP 1 – ORGANISATION
================================ */

export async function createOrganization(name: string) {
  const session = await getServerSession();
  const user = session?.user;

  if (!user) {
    redirect("/sign-in");
  }

   const org = await prisma.organization.create({
     data: {
       name,
      trialEndsAt: addDays(new Date(), 14),
      memberships: {
        create: {
          userId: user.id,
          role: "OWNER",
        },
      },
    },
  });

  return { ok: true, organization: org };
}

/* ===============================
   STEP 2 – PROPERTY
================================ */

export async function createProperty(data: {
  name: string;
  street: string;
  city: string;
}) {
  const session = await getServerSession();
  const user = session?.user;

  if (!user) {
    redirect("/sign-in");
  }

  const membership = await prisma.membership.findFirst({
    where: { userId: user.id },
  });

  if (!membership) {
    redirect("/sign-in");
  }

   const property = await prisma.property.create({
    data: {
      ...data,
       organizationId: membership!.organizationId,
       postalCode: "",
       country: "SE",
    },
  });

  return { ok: true, property: property };
}

/* ===============================
   STEP 3 – UNIT
================================ */

export async function createUnit(data: {
  label: string;
  rent: number;
}) {
  const session = await getServerSession();
  const user = session?.user;

  if (!user) {
    redirect("/sign-in");
  }
  const membership = await prisma.membership.findFirst({

    where: { userId: user.id },
    select: { organizationId: true },
  });
  const property = await prisma.property.findFirst({
    where: { organizationId: membership!.organizationId },
    select: { id: true },
  });

  if (!property) {
    redirect("/sign-in");
  }

  const unit = await prisma.unit.create({
    data: {
      label: data.label,
      rent: data.rent,
      propertyId: property!.id,
      type: "2 rum och kök",
      size: "62",
      deposit: 0,
      status: "VACANT",
      contracts: {  
        create: {
          startDate: new Date(),
          endDate: addYears(new Date(), 1),
          data: {},
          tenantId: user!.id,
          templateId: "1",
        },
      },
    },
  });
  return { ok: true, unit: unit };
}
