import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { TenantHeader } from "./_components/tenant-header";
import { ActiveContract } from "./_components/active-contract";
import { PaymentsStats } from "./_components/payment-stats";
import { ContractsHistory } from "./_components/contract-history";
import { TenantOverview } from "./_components/tenant-overview";



export default async function TenantPage({
  params,
}: {
  params: Promise<{ tenantId : string }>;
}) {
  const {tenantId} = await params
  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId },
    include: {
      contracts: {
        orderBy: { startDate: "desc" },
        include: {
          unit: {
            include: { property: true },
          },
          template: true,
          documents: true,
        },
      },
    },
  });

  if (!tenant) notFound();

  const activeContract = tenant.contracts.find(
    (c) => c.status === "ACTIVE"
  );

  return (
    <div className="space-y-8">
      <TenantHeader tenant={tenant} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <ActiveContract contract={activeContract} />
          <ContractsHistory contracts={tenant.contracts} />
        </div>

        <div className="space-y-6">
          <TenantOverview tenant={tenant} />
          <PaymentsStats tenantId={tenant.id} />
        </div>
      </div>
    </div>
  );
}
