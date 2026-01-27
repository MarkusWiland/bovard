"use server";

// import { prisma } from "@/lib/prisma";
// import { auth } from "@/lib/auth";

export async function createUnit({
  propertyId,
  label,
  rent,
}: {
  propertyId: string;
  label: string;
  rent: number;
}) {
  // const user = await auth.requireUser();

  // kontrollera att propertyId tillhör userns organisation
  // via prisma.property.findUnique({ organizationId })

  // await prisma.unit.create({
  //   data: {
  //     label,
  //     rent,
  //     propertyId,
  //   },
  // });
}
