// app/dashboard/properties/[propertyId]/page.tsx

import { notFound, redirect } from "next/navigation";
import { CreateUnitDialog } from "./_components/create-unit-dialog";
import { UnitsTable, UnitRow } from "./_components/units-table";


import { auth } from "@/lib/auth";
import { getServerSession } from "@/lib/get-session";
import prisma from "@/lib/prisma";

/* ======================================================
   DATA FETCHING
====================================================== */

async function getPropertyWithUnits(propertyId: string) {
  const session = await getServerSession();
  const user = session?.user;
  if (!user) {
    redirect("/sign-in");
  }
  const organization = await prisma.organization.findFirst({
    where: { memberships: { some: { userId: user.id } } },
  });
  if (!organization) {
    redirect("/sign-in");
  }
  const membership = await prisma.membership.findFirst({
    where: { userId: user.id },
    include: { organization: true },
  });
  if (!membership) {
    redirect("/sign-in");
  }
  const property = await prisma.property.findFirst({
    where: {
      id: propertyId,
      organizationId: organization?.id,
    },
    include: {
      units: {
        include: {
          tenant: true,
          payments: {
            orderBy: { dueDate: "desc" },
            take: 1,
          },
        },
        orderBy: { label: "asc" },
      },
    },
  });

  if (!property) {
    notFound();
  }

  /* =========================
     FORMAT FOR TABLE
  ========================= */

  const units: UnitRow[] = property.units.map((unit) => {
    const latestPayment = unit.payments[0];

    let status: UnitRow["status"] = "vacant";

    if (unit.tenant) {
      if (latestPayment?.status === "LATE") {
        status = "late";
      } else {
        status = "paid";
      }
    }

    return {
      id: unit.id,
      label: unit.label,
      rent: unit.rent,
      status,
      tenant: unit.tenant
        ? { name: unit.tenant.name }
        : null,
    };
  });

  return {
    property: {
      id: property.id,
      name: property.name,
      city: property.city,
    },
    units,
  };
}

/* ======================================================
   PAGE
====================================================== */

export default async function PropertyPage({
  params,
}: {
  params: { propertyId: string };
}) {
  const { property, units } =
    await getPropertyWithUnits(params.propertyId);

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            {property.name}
          </h1>
          <p className="text-muted-foreground">
            Hantera enheter i fastigheten
          </p>
        </div>

        <CreateUnitDialog propertyId={property.id} />
      </div>

      {/* UNITS TABLE */}
      <UnitsTable
        propertyId={property.id}
        units={units}
      />
    </div>
  );
}
