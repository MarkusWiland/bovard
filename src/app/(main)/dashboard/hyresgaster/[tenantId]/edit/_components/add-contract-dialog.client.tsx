"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import { createContract } from "../action";

/* ---------------- schema ---------------- */

const formSchema = z.object({
  templateId: z.string().min(1, "Välj avtalsmall"),
  unitId: z.string().min(1, "Välj enhet"),
});

type FormValues = z.infer<typeof formSchema>;

/* ---------------- types ---------------- */

type Props = {
  tenantId: string;
  activeContract?: {
    id: string;
    startDate: Date; // ✅ RÄTT
    unit: {
      label: string;
      rent: number;
      property: { name: string };
    };
    template: {
      name: string;
    };
  };
  templates: { id: string; name: string }[];
  units: {
    id: string;
    label: string;
    property: { name: string };
  }[];
};


/* ---------------- component ---------------- */

export function AddContractDialogClient({
  tenantId,
  activeContract,
  templates,
  units,
}: Props) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      templateId: "",
      unitId: "",
    },
  });

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true);

    const res = await createContract({
      tenantId,
      templateId: values.templateId,
      unitId: values.unitId,
      startDate: new Date().toISOString(),
    });

    if (res.ok) {
      toast.success(
        activeContract ? "Avtal uppdaterat" : "Avtal skapat"
      );
      setOpen(false);
      form.reset();
    } else {
      toast.error(res.message ?? "Misslyckades");
    }

    setIsSubmitting(false);
  }

  return (
    <>
      {/* ===== Aktivt avtal ===== */}
      {activeContract ? (
        <div className="rounded-lg border bg-muted/30 p-4 space-y-2">
          <div className="flex items-center justify-between">
            <div className="font-medium">Aktivt avtal</div>
            <span className="text-xs rounded-full bg-green-100 text-green-700 px-2 py-0.5">
              Aktivt
            </span>
          </div>

          <div className="text-sm">
            <strong>{activeContract.unit.label}</strong> –{" "}
            {activeContract.unit.property.name}
          </div>

          <div className="text-sm text-muted-foreground">
            Avtalsmall: {activeContract.template.name}
          </div>

          <div className="text-sm">
            Hyra:{" "}
            <strong>
              {activeContract.unit.rent.toLocaleString("sv-SE")} kr / mån
            </strong>
          </div>

          <div className="text-xs text-muted-foreground">
            Startdatum:{" "}
            {new Date(activeContract.startDate).toLocaleDateString("sv-SE")}
          </div>
        </div>
      ) : (
        <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
          Ingen aktivt avtal kopplat till denna hyresgäst.
        </div>
      )}

      {/* ===== CTA ===== */}
      <Button size="sm" onClick={() => setOpen(true)}>
        {activeContract ? "Byt avtal" : "Lägg till avtal"}
      </Button>

      {/* ===== Dialog ===== */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {activeContract ? "Byt avtal" : "Skapa avtal"}
            </DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="templateId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Avtalsmall</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Välj avtalsmall…" />
                        </SelectTrigger>
                        <SelectContent>
                          {templates.map((t) => (
                            <SelectItem key={t.id} value={t.id}>
                              {t.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="unitId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Enhet</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Välj enhet…" />
                        </SelectTrigger>
                        <SelectContent>
                          {units.map((u) => (
                            <SelectItem key={u.id} value={u.id}>
                              {u.label} – {u.property.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full"
              >
                {isSubmitting
                  ? "Sparar..."
                  : activeContract
                  ? "Byt avtal"
                  : "Skapa avtal"}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
