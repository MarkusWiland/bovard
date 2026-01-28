"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { getServerSession } from "@/lib/get-session";

/* ======================================================
   SCHEMAS
====================================================== */

const assignTenantSchema = z.object({
  tenantId: z.string().min(1),
  unitId: z.string().min(1),
});

const createTenantSchema = z.object({
  unitId: z.string().min(1),
  name: z.string().min(1, "Namn krävs"),
  email: z.string().email("Ogiltig e-post"),
  phone: z.string().min(1, "Telefon krävs"),
  personalNumber: z.string().optional(),
});

/* ======================================================
   AUTH HELPER
====================================================== */

async function requireAuth() {
  const session = await getServerSession();

  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  const membership = await prisma.membership.findFirst({
    where: { userId: session.user.id },
    select: { organizationId: true, role: true },
  });

  if (!membership) {
    redirect("/onboarding");
  }

  return membership;
}

/* ======================================================
   VERIFY UNIT ACCESS
====================================================== */

async function verifyUnitAccess(unitId: string, organizationId: string) {
  const unit = await prisma.unit.findFirst({
    where: {
      id: unitId,
      property: { organizationId },
    },
    select: {
      id: true,
      propertyId: true,
      tenantId: true,
      status: true,
    },
  });

  if (!unit) {
    throw new Error("Enheten hittades inte");
  }

  return unit;
}

/* ======================================================
   GET ASSIGNABLE TENANTS
   Returnerar lediga och kopplade hyresgäster
====================================================== */

export async function getAssignableTenants() {
  const { organizationId } = await requireAuth();

  const tenants = await prisma.tenant.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,

      // 🔹 Direkt koppling (unit.tenantId)
      units: {
        where: {
          property: { organizationId },
        },
        select: {
          label: true,
          property: { select: { name: true } },
        },
        take: 1,
      },

      // 🔹 Aktivt kontrakt
      contracts: {
        where: {
          status: "ACTIVE",
          unit: {
            property: { organizationId },
          },
        },
        select: {
          unit: {
            select: {
              label: true,
              property: { select: { name: true } },
            },
          },
        },
        take: 1,
      },
    },
    orderBy: { name: "asc" },
  });

  const unassigned: {
    id: string;
    name: string;
    email: string;
    phone: string;
  }[] = [];

  const assigned: {
    id: string;
    name: string;
    email: string;
    currentUnit: string;
  }[] = [];

  for (const t of tenants) {
    const unit =
      t.units[0] ??
      t.contracts[0]?.unit ??
      null;

    if (unit) {
      assigned.push({
        id: t.id,
        name: t.name,
        email: t.email,
        currentUnit: `${unit.property.name} – ${unit.label}`,
      });
    } else {
      unassigned.push({
        id: t.id,
        name: t.name,
        email: t.email,
        phone: t.phone,
      });
    }
  }

  return {
    // 👇 redan sorterat & redo för UI
    unassigned,
    assigned,
  };
}


/* ======================================================
   ASSIGN EXISTING TENANT TO UNIT
   Kopplar befintlig tenant direkt till unit (utan kontrakt)
====================================================== */

export async function assignExistingTenant(
  input: z.infer<typeof assignTenantSchema>
) {
  const { organizationId } = await requireAuth();
  const { tenantId, unitId } = assignTenantSchema.parse(input);

  const unit = await verifyUnitAccess(unitId, organizationId);

  // Verifiera att tenant finns
  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId },
    select: { id: true, units: { select: { id: true } } },
  });

  if (!tenant) {
    throw new Error("Hyresgästen hittades inte");
  }

  await prisma.$transaction(async (tx) => {
    // Ta bort tenant från eventuell annan unit i samma org
    await tx.unit.updateMany({
      where: {
        tenantId,
        property: { organizationId },
        id: { not: unitId },
      },
      data: {
        tenantId: null,
        status: "VACANT",
      },
    });

    // Koppla tenant till ny unit
    await tx.unit.update({
      where: { id: unitId },
      data: {
        tenantId,
        status: "OCCUPIED",
      },
    });
  });

  revalidatePath(`/dashboard/properties/${unit.propertyId}`);
  revalidatePath(`/dashboard/properties/${unit.propertyId}/units/${unitId}`);
  revalidatePath("/dashboard");

  return { success: true };
}

/* ======================================================
   CREATE AND ASSIGN NEW TENANT
   Skapar ny tenant och kopplar direkt till unit
====================================================== */

export async function createAndAssignTenant(
  input: z.infer<typeof createTenantSchema>
) {
  const { organizationId } = await requireAuth();
  const data = createTenantSchema.parse(input);

  const unit = await verifyUnitAccess(data.unitId, organizationId);

  const tenant = await prisma.$transaction(async (tx) => {
    // Skapa tenant
    const newTenant = await tx.tenant.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        personalNumber: data.personalNumber || "",
        moveInDate: new Date(),
      },
    });

    // Koppla till unit
    await tx.unit.update({
      where: { id: data.unitId },
      data: {
        tenantId: newTenant.id,
        status: "OCCUPIED",
      },
    });

    return newTenant;
  });

  revalidatePath(`/dashboard/properties/${unit.propertyId}`);
  revalidatePath(`/dashboard/properties/${unit.propertyId}/units/${data.unitId}`);
  revalidatePath("/dashboard");

  return { success: true, tenantId: tenant.id };
}

/* ======================================================
   REMOVE TENANT FROM UNIT
   Tar bort koppling (men behåller tenant i systemet)
====================================================== */

export async function removeTenantFromUnit(unitId: string) {
  const { organizationId } = await requireAuth();

  const unit = await verifyUnitAccess(unitId, organizationId);

  if (!unit.tenantId) {
    throw new Error("Enheten har ingen kopplad hyresgäst");
  }

  // Kolla om det finns aktivt kontrakt
  const activeContract = await prisma.contract.findFirst({
    where: {
      unitId,
      status: "ACTIVE",
    },
    select: { id: true },
  });

  if (activeContract) {
    throw new Error(
      "Kan inte ta bort hyresgäst med aktivt kontrakt. Avsluta kontraktet först."
    );
  }

  await prisma.unit.update({
    where: { id: unitId },
    data: {
      tenantId: null,
      status: "VACANT",
    },
  });

  revalidatePath(`/dashboard/properties/${unit.propertyId}`);
  revalidatePath(`/dashboard/properties/${unit.propertyId}/units/${unitId}`);
  revalidatePath("/dashboard");

  return { success: true };
}

/* ======================================================
   GET ALL TENANTS (för lista/sökning)
====================================================== */

export async function getTenants(search?: string) {
  const { organizationId } = await requireAuth();

  return prisma.tenant.findMany({
    where: {
      OR: [
        { units: { some: { property: { organizationId } } } },
        { contracts: { some: { unit: { property: { organizationId } } } } },
      ],
      ...(search && {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
        ],
      }),
    },
    include: {
      units: {
        where: { property: { organizationId } },
        select: {
          id: true,
          label: true,
          rent: true,
          property: { select: { id: true, name: true } },
        },
      },
      _count: { select: { contracts: true } },
    },
    orderBy: { name: "asc" },
  });
}