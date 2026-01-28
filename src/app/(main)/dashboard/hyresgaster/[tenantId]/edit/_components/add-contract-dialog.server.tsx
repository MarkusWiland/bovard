
import { getContractFormData } from "../action";
import { AddContractDialogClient } from "./add-contract-dialog.client";

export async function AddContractDialog({ tenantId }: { tenantId: string }) {
  const { templates, units, activeContract } =
    await getContractFormData(tenantId);

  return (
    <AddContractDialogClient
      activeContract={activeContract ?? undefined}
      tenantId={tenantId}
      templates={templates}
      units={units}
    />
  );
}
