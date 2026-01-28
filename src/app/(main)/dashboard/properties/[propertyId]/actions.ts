"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "@/lib/get-session";
import { redirect } from "next/navigation";
import { z } from "zod";
import { revalidatePath } from "next/cache";

/* ======================================================
   VALIDATION
====================================================== */

const createUnitSchema = z.object({
  propertyId: z.string().cuid(),

  label: z.string().min(1),
  type: z.enum(["APARTMENT", "OFFICE", "STORAGE"]),
  rooms: z.number().min(0),
  sizeSqm: z.number().min(1),
  rent: z.number().min(0),
  floor: z.number().optional(),
  note: z.string().optional(),
  status: z.enum(["VACANT", "OCCUPIED", "MAINTENANCE"]),
});

type CreateUnitInput = z.infer<typeof createUnitSchema>;

/* ======================================================
   ACTION
====================================================== */

export async function createUnit(rawData: CreateUnitInput) {
  // 🔐 Auth
  const session = await getServerSession();
  if (!session?.user) {
    redirect("/sign-in");
  }

  // ✅ Validate input
  const parsed = createUnitSchema.safeParse(rawData);
  if (!parsed.success) {
    return {
      ok: false,
      message: "Ogiltig data",
    };
  }

  const {
    propertyId,
    label,
    type,
    rooms,
    sizeSqm,
    rent,
    floor,
    note,
    status,
  } = parsed.data;

  // 🔐 Kontrollera organisationstillhörighet
  const membership = await prisma.membership.findFirst({
    where: {
      userId: session.user.id,
      organization: {
        properties: {
          some: { id: propertyId },
        },
      },
    },
    select: { organizationId: true },
  });

  if (!membership) {
    return {
      ok: false,
      message: "Åtkomst nekad",
    };
  }

  // 🏗 Skapa enhet
  await prisma.unit.create({
    data: {
      label,
      type,
      rooms,
      sizeSqm,
      rent,
      floor,
      note,
      status,
      propertyId,
    },
  });
  revalidatePath("/dashboard/properties")
  return {
    ok: true,
    message: "Enhet skapad",
  };
}


export async function getAssignableTenants() {
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
  const [unassigned, assigned] = await Promise.all([
    prisma.tenant.findMany({
      where: {
     
        contracts: {
          none: { status: "ACTIVE" },
        },
      },
      orderBy: { name: "asc" },
    }),
  
    prisma.tenant.findMany({
      where: {
     
        contracts: {
          some: {
            status: "ACTIVE",
            unit: {
              property: { organizationId },
            },
          },
        },
      },
      include: {
        contracts: {
          where: { status: "ACTIVE" },
          include: {
            unit: {
              select: {
                label: true,
                property: { select: { name: true } },
              },
            },
          },
        },
      },
      orderBy: { name: "asc" },
    }),
  ]);
  
  return {
    unassigned, assigned
  }
}


type AssignExistingTenantInput = {
  tenantId: string;
  unitId: string;
  mode: "assign" | "replace";
};

export async function assignExistingTenant({
  tenantId,
  unitId,
  mode,
}: AssignExistingTenantInput) {
  const session = await getServerSession();
  if (!session?.user) redirect("/sign-in");

  // 🔐 Säkerställ organisationstillhörighet via unit
  const unit = await prisma.unit.findFirst({
    where: {
      id: unitId,
      property: {
        organization: {
          memberships: {
            some: { userId: session.user.id },
          },
        },
      },
    },
    select: {
      id: true,
      propertyId: true,
    },
  });

  if (!unit) {
    throw new Error("Ingen åtkomst till enheten");
  }

    
  // 🔄 Revalidate paths
  revalidatePath(`/dashboard/properties/${unit.propertyId}`);
  revalidatePath(`/dashboard/properties/${unit.propertyId}/units/${unitId}`);

  return { ok: true };
}
