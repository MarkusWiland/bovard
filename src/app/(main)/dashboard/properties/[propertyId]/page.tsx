import { notFound, redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { getServerSession } from "@/lib/get-session";

import { CreateUnitDialog } from "./_components/create-unit-dialog";
import { UnitsTable, UnitRow } from "./_components/units-table";

/* ======================================================
   DATA FETCHING
====================================================== */

async function getPropertyWithUnits(propertyId: string) {
  // 🔐 Auth
  const session = await getServerSession();
  if (!session?.user) {
    redirect("/sign-in");
  }

  // 🔐 Organisation
  const organization = await prisma.organization.findFirst({
    where: {
      memberships: {
        some: { userId: session.user.id },
      },
    },
    select: { id: true },
  });

  if (!organization) {
    redirect("/sign-in");
  }

  // 🏢 Property + Units
  const property = await prisma.property.findFirst({
    where: {
      id: propertyId,
      organizationId: organization.id,
    },
    include: {
      units: {
        orderBy: { label: "asc" },
        include: {
          // 🔹 Aktivt kontrakt (om finns)
          contracts: {
            where: { status: "ACTIVE" },
            take: 1,
            include: {
              tenant: {
                select: { name: true },
              },
            },
          },

          // 🔹 Senaste betalning
          payments: {
            orderBy: { dueDate: "desc" },
            take: 1,
          },
        },
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
    const activeContract = unit.contracts[0];
    const latestPayment = unit.payments[0];

    let status: UnitRow["status"] = "vacant";

    if (activeContract) {
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
      tenant: activeContract
        ? { name: activeContract.tenant.name }
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
  params: Promise<{ propertyId: string }>;
}) {
  const {propertyId} = await params
  const { property, units } = await getPropertyWithUnits(
    propertyId
  );

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{property.name}</h1>
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
