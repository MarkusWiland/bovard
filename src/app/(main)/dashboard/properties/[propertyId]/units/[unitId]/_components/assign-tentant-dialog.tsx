"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Separator } from "@/components/ui/separator";

/* ================= SCHEMA ================= */

const createTenantSchema = z.object({
  name: z.string().min(1, "Namn krävs"),
  email: z.string().email().optional(),
  phone: z.string().optional(),
});

type FormValues = z.infer<typeof createTenantSchema>;

type AssignTenantDialogProps = {
  unitId: string;
  mode: "assign" | "replace";
  currentTenant?: {
    name: string;
    email?: string;
    phone?: string;
  };
  triggerLabel?: string;
  triggerVariant?: "default" | "outline";
};

/* ================= MOCK: BEFINTLIGA HYRESGÄSTER ================= */

const existingTenants = [
  {
    id: "t1",
    name: "Anna Andersson",
    email: "anna@email.com",
    phone: "070-123 45 67",
  },
  {
    id: "t2",
    name: "Erik Svensson",
    email: "erik@email.com",
    phone: "070-987 65 43",
  },
];

export function AssignTenantDialog({
  unitId,
  mode,
  currentTenant,
  triggerLabel = "Koppla hyresgäst",
  triggerVariant = "default",
}: AssignTenantDialogProps) {
  const [open, setOpen] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(createTenantSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  async function onSubmit(values: FormValues) {
    if (mode === "replace") {
      // 1. avsluta nuvarande hyresgäst (moveOutDate)
      // 2. skapa ny lease
    }

    // await assignTenantToUnit({ unitId, tenant: values })

    console.log("SUBMIT", { unitId, values, mode });
    form.reset();
    setOpen(false);
  }

  return (
    <>
      <Button variant={triggerVariant} onClick={() => setOpen(true)}>
        {triggerLabel}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {mode === "assign"
                ? "Koppla hyresgäst"
                : "Byt hyresgäst"}
            </DialogTitle>
          </DialogHeader>

          {mode === "replace" && currentTenant && (
            <div className="rounded-lg bg-muted p-3 text-sm">
              <p className="font-medium">Nuvarande hyresgäst</p>
              <p>{currentTenant.name}</p>
            </div>
          )}

          <Tabs defaultValue="new" className="mt-4">
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="new">Ny hyresgäst</TabsTrigger>
              <TabsTrigger value="existing">
                Befintlig
              </TabsTrigger>
            </TabsList>

            {/* ================= NY HYRESGÄST ================= */}
            <TabsContent value="new">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Namn</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telefon</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full">
                    {mode === "assign"
                      ? "Koppla hyresgäst"
                      : "Byt hyresgäst"}
                  </Button>
                </form>
              </Form>
            </TabsContent>

            {/* ================= BEFINTLIG ================= */}
            <TabsContent value="existing" className="space-y-3">
              <Input placeholder="Sök hyresgäst..." />

              <Separator />

              {existingTenants.map((tenant) => (
                <div
                  key={tenant.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div>
                    <p className="font-medium">{tenant.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {tenant.email}
                    </p>
                  </div>

                  <Button
                    size="sm"
                    onClick={() => {
                      console.log(
                        "Koppla befintlig tenant",
                        tenant.id,
                        "→",
                        unitId
                      );
                      setOpen(false);
                    }}
                  >
                    Välj
                  </Button>
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
}
