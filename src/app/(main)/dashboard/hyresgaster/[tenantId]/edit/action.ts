"use server";

import { getServerSession } from "@/lib/get-session";
import prisma from "@/lib/prisma";
import { SaveTenantInput, saveTenantSchema } from "@/lib/schema/save-tenant";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";



type CreateContractInput = {
  tenantId: string;
  unitId: string;
  templateId: string;
  startDate: string;
};

export async function createContract(data: CreateContractInput) {
  const session = await getServerSession();
  if (!session?.user) {
    redirect("/sign-in");
  }

  try {
    await prisma.$transaction(async (tx) => {
      // 1️⃣ Hämta ev. aktivt avtal
      const activeContract = await tx.contract.findFirst({
        where: {
          tenantId: data.tenantId,
          status: "ACTIVE",
        },
        select: { id: true },
      });

      // 2️⃣ Terminera befintligt avtal (om det finns)
      if (activeContract) {
        await tx.contract.update({
          where: { id: activeContract.id },
          data: {
            status: "TERMINATED",
            endDate: new Date(),
          },
        });
      }

      // 3️⃣ Skapa nytt aktivt avtal
      await tx.contract.create({
        data: {
          tenantId: data.tenantId,
          unitId: data.unitId,
          templateId: data.templateId,
          status: "ACTIVE",
          startDate: new Date(data.startDate),
          data: {}, // fylls senare med variabler
        },
      });

      // 4️⃣ (valfritt men rekommenderat) Uppdatera enhetens status
      await tx.unit.update({
        where: { id: data.unitId },
        data: { status: "OCCUPIED" },
      });
    });

    // 🔄 Revalidera relevanta sidor
    revalidatePath(`/dashboard/hyresgaster/${data.tenantId}`);
    revalidatePath(`/dashboard/hyresgaster/${data.tenantId}/edit`);

    return {
      ok: true,
    };
  } catch (error) {
    console.error("createContract failed", error);
    return {
      ok: false,
      message: "Kunde inte skapa eller uppdatera avtal",
    };
  }
}



export async function saveTenant(
  tenantId: string,
  rawData: SaveTenantInput
) {
  // 🔐 Auth
  const session = await getServerSession();
  if (!session?.user) {
    redirect("/sign-in");
  }

  // ✅ Validera input
  const parsed = saveTenantSchema.safeParse(rawData);
  if (!parsed.success) {
    return {
      ok: false,
      message: "Ogiltig data",
    };
  }

  try {
    await prisma.tenant.update({
      where: { id: tenantId },
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        phone: parsed.data.phone,
        personalNumber: parsed.data.personalNumber,
        moveInDate: new Date(parsed.data.moveInDate),
      },
    });

    // 🔄 Uppdatera relevanta sidor
    revalidatePath(`/dashboard/hyresgaster/${tenantId}`);
    revalidatePath(`/dashboard/hyresgaster/${tenantId}/edit`);
    revalidatePath("/dashboard/hyresgaster");

    return {
      ok: true,
    };
  } catch (error) {
    console.error("saveTenant failed", error);
    return {
      ok: false,
      message: "Kunde inte spara hyresgäst",
    };
  }
}
export async function getContractFormData(tenantId: string) {
  const session = await getServerSession();
  if (!session?.user) {
    redirect("/sign-in");
  }

  // 🔹 Aktivt avtal för hyresgästen
  const activeContract = await prisma.contract.findFirst({
    where: {
      tenantId,
      status: "ACTIVE",
    },
    orderBy: {
      startDate: "desc",
    },
    select: {
      id: true,
      startDate: true,
      unit: {
        select: {
          label: true,
          rent: true,
          property: {
            select: { name: true },
          },
        },
      },
      template: {
        select: {
          name: true,
        },
      },
      
    },
  });

  // 🔹 Avtalsmallar
  const templates = await prisma.template.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
    },
  });

  // 🔹 Lediga enheter
  const units = await prisma.unit.findMany({
    where: { status: "VACANT" },
    orderBy: { label: "asc" },
    include: {
      property: {
        select: { name: true },
      },
    },
  });

  return {
    activeContract,
    templates,
    units,
  };
}