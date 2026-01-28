"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

import { toast } from "sonner";
import { saveTenant } from "../action";

export function TenantEditForm({ tenant }: { tenant: any }) {
  const [form, setForm] = useState({
    name: tenant.name,
    email: tenant.email,
    phone: tenant.phone,
    personalNumber: tenant.personalNumber,
    moveInDate: tenant.moveInDate
    ? new Date(tenant.moveInDate).toISOString().slice(0, 10)
    : "",
  });

  function update(key: string, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSave() {
    const res = await saveTenant(tenant.id, form);
    res.ok ? toast.success("Sparat") : toast.error("Kunde inte spara");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hyresgäst</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label>Namn</Label>
          <Input value={form.name} onChange={(e) => update("name", e.target.value)} />
        </div>
        <div>
          <Label>E-post</Label>
          <Input value={form.email} onChange={(e) => update("email", e.target.value)} />
        </div>
        <div>
          <Label>Telefon</Label>
          <Input value={form.phone} onChange={(e) => update("phone", e.target.value)} />
        </div>
        <div>
          <Label>Personnummer</Label>
          <Input value={form.personalNumber} onChange={(e) => update("personalNumber", e.target.value)} />
        </div>
        <div>
          <Label>Inflytt</Label>
          <Input type="date" value={form.moveInDate} onChange={(e) => update("moveInDate", e.target.value)} />
        </div>

        <div className="sm:col-span-2">
          <Button onClick={onSave}>Spara ändringar</Button>
        </div>
      </CardContent>
    </Card>
  );
}
