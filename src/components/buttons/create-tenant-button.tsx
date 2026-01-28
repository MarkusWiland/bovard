"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CreateTenantDialog } from "@/components/dialogs/create-tenant-dialog";

export function CreateTenantButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus className="mr-2 h-4 w-4" />
        Ny hyresgäst
      </Button>

      <CreateTenantDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
