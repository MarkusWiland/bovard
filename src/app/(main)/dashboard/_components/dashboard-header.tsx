"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreatePropertyDialog } from "./create-property-dialog";

export function DashboardHeader({
  title = "Dashboard",
}: {
  title?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 h-14 border-b bg-background flex items-center justify-between px-6">
        <h2 className="text-lg font-semibold">{title}</h2>

        <Button size="sm" onClick={() => setOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Ny fastighet
        </Button>
      </header>

      <CreatePropertyDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
