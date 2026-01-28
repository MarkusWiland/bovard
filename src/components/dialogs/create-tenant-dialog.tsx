"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { createTenant } from "@/app/(main)/dashboard/hyresgaster/action";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function CreateTenantDialog({ open, onOpenChange }: Props) {
  const [isLoading, setIsLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    personalNumber: "",
    moveInDate: "",
  });

  const update = (key: string, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  async function onSubmit() {
    setIsLoading(true);

    try {
      const { ok, message } = await createTenant(form);
      console.log("res", { ok, message });
      if (!ok) throw new Error(message);

      toast.success(message);
      onOpenChange(false);
    } catch {
      toast.error("Kunde inte skapa hyresgäst");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ny hyresgäst</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Namn</Label>
            <Input
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              placeholder="Anna Andersson"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>E-post</Label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Telefon</Label>
              <Input
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Personnummer</Label>
              <Input
                value={form.personalNumber}
                onChange={(e) => update("personalNumber", e.target.value)}
                placeholder="YYYYMMDD-XXXX"
              />
            </div>

            <div className="space-y-2">
              <Label>Inflyttningsdatum</Label>
              <Input
                type="date"
                value={form.moveInDate}
                onChange={(e) => update("moveInDate", e.target.value)}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Avbryt
          </Button>
          <Button onClick={onSubmit} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Skapa hyresgäst
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
