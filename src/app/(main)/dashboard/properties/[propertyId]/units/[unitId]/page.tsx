// app/dashboard/properties/[propertyId]/units/[unitId]/page.tsx

import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  ArrowLeft,
  DollarSign,
  Calendar,
  CheckCircle,
  Mail,
  Phone,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

import { AssignTenantDialog } from "./_components/assign-tentant-dialog";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { getServerSession } from "@/lib/get-session";

/* ======================================================
   DATA
====================================================== */

async function getUnitData({
  propertyId,
  unitId,
}: {
  propertyId: string;
  unitId: string;
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

  const unit = await prisma.unit.findFirst({
    where: {
      id: unitId,
      propertyId,
      property: {
        organizationId: membership.organizationId,
      },
    },
    include: {
      tenant: true,
      payments: {
        orderBy: { dueDate: "desc" },
      },
      documents: {
        orderBy: { uploadedAt: "desc" },
      },
    },
  });

  if (!unit) {
    notFound();
  }

  const contractEndInDays = Math.max(
    0,
    Math.ceil(
      (unit.contractEnd.getTime() - Date.now()) /
        (1000 * 60 * 60 * 24)
    )
  );

  return {
    unit: {
      id: unit.id,
      label: unit.label,
      type: unit.type,
      size: unit.size,
      rent: unit.rent,
      status: unit.status,
      contractEndInDays,
    },
    tenant: unit.tenant,
    payments: unit.payments,
    documents: unit.documents,
  };
}

/* ======================================================
   PAGE
====================================================== */

export default async function UnitDetailPage({
  params,
}: {
  params: { propertyId: string; unitId: string };
}) {
  const { unit, tenant } = await getUnitData(params);
  const isOccupied = !!tenant;

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button asChild variant="outline" size="icon">
            <Link
              href={`/dashboard/properties/${params.propertyId}`}
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>

          <div>
            <h1 className="text-2xl font-semibold">
              Enhet {unit.label}
            </h1>
            <p className="text-muted-foreground">
              {unit.type} • {unit.size}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline">Redigera</Button>

          {isOccupied ? (
            <AssignTenantDialog
              unitId={unit.id}
              mode="replace"
              currentTenant={{
                name: tenant!.name,
                email: tenant!.email,
                phone: tenant!.phone,
              }}
              triggerLabel="Byt hyresgäst"
              triggerVariant="outline"
            />
          ) : (
            <AssignTenantDialog
              unitId={unit.id}
              mode="assign"
              triggerLabel="Koppla hyresgäst"
            />
          )}
        </div>
      </div>

      {/* TABS */}
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Översikt</TabsTrigger>
          <TabsTrigger value="payments">Betalningar</TabsTrigger>
          <TabsTrigger value="documents">Dokument</TabsTrigger>
        </TabsList>

        {/* ================= OVERVIEW ================= */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid md:grid-cols-3 gap-4">
            <StatCard
              icon={<DollarSign />}
              label="Månadshyra"
              value={`${unit.rent.toLocaleString(
                "sv-SE"
              )} kr`}
            />
            <StatCard
              icon={<Calendar />}
              label="Avtal slut"
              value={`${unit.contractEndInDays} dagar`}
            />
            <StatCard
              icon={<CheckCircle />}
              label="Status"
              value={isOccupied ? "Uthyrd" : "Ledig"}
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Hyresgäst</CardTitle>
              <CardDescription>
                {isOccupied
                  ? "Aktiv hyresgäst"
                  : "Ingen hyresgäst kopplad"}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {isOccupied && tenant && (
                <>
                  <p className="font-medium">
                    {tenant.name}
                  </p>

                  <Separator />

                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      {tenant.email}
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      {tenant.phone}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

/* ======================================================
   HELPER
====================================================== */

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center gap-3">
          <div className="text-muted-foreground">
            {icon}
          </div>
          <div>
            <p className="text-sm text-muted-foreground">
              {label}
            </p>
            <p className="text-xl font-semibold">
              {value}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
