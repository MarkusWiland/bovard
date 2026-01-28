import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { TenantEditForm } from "./_components/tenant-edit-form";
import { ActiveContractCard } from "./_components/active-contract";
import { AddContractDialog } from "./_components/add-contract-dialog.server";


export default async function EditTenantPage({
  params,
}: {
  params: Promise<{ tenantId: string }>;
}) {
  const {tenantId} = await params
  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId },
    include: {
      contracts: {
        where: { status: "ACTIVE" },
        include: {
          unit: { include: { property: true } },
          template: true,
        },
      },
    },
  });

  if (!tenant) notFound();

  return (
    <div className="space-y-6">
      <TenantEditForm tenant={tenant} />
   <AddContractDialog tenantId={tenantId}/>
    </div>
  );
}
