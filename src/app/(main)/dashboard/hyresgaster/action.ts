"use server";

import { getServerSession } from "@/lib/get-session";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createTenantSchema, CreateTenantInput } from "@/lib/schema/create-tenant";

export async function createTenant(rawData: CreateTenantInput) {
  const session = await getServerSession();
  const user = session?.user;

  if (!user) {
    redirect("/sign-in");
  }

  // ✅ Validera input
  const parsed = createTenantSchema.safeParse(rawData);
  if (!parsed.success) {
    return { ok: false, message: "Ogiltig data" };
  }

  const { contract, ...tenantData } = parsed.data;

  try {
    await prisma.$transaction(async (tx) => {
      const tenant = await tx.tenant.create({
        data: {
          ...tenantData,
          moveInDate: new Date(tenantData.moveInDate),
        },
      });

      if (contract) {
        const createdContract = await tx.contract.create({
          data: {
            tenantId: tenant.id,
            unitId: contract.unitId,
            templateId: contract.templateId,
            status: "ACTIVE",
            startDate: new Date(contract.startDate),
            endDate: contract.endDate
              ? new Date(contract.endDate)
              : null,
            data: contract.data ?? {},
          },
        });

        if (contract.document) {
          await tx.document.create({
            data: {
              name: contract.document.name,
              type: contract.document.type,
              contractId: createdContract.id,
            },
          });
        }
      }
    });

    revalidatePath("/dashboard/hyresgaster");

    return { ok: true, message: "Hyresgäst skapad" };
  } catch (error) {
    console.error(error);
    return { ok: false, message: "Kunde inte skapa hyresgäst" };
  }
}
