"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
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
import { User, UserPlus, Building2, Loader2, Check } from "lucide-react";
import { toast } from "sonner";
import { assignExistingTenant, createAndAssignTenant, getAssignableTenants } from "../../../../actions/tenant-action";



/* ======================================================
   SCHEMA
====================================================== */

const formSchema = z.object({
  name: z.string().min(1, "Namn krävs"),
  email: z.string().email("Ogiltig e-postadress"),
  phone: z.string().min(1, "Telefon krävs"),
  personalNumber: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

/* ======================================================
   TYPES
====================================================== */

interface Props {
  unitId: string;
  unitLabel?: string;
  propertyName?: string;
  currentTenant?: { id: string; name: string } | null;
  trigger?: React.ReactNode;
}

/* ======================================================
   COMPONENT
====================================================== */

export function AssignTenantDialog({
  unitId,
  unitLabel,
  propertyName,
  currentTenant,
  trigger,
}: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [unassigned, setUnassigned] = useState<
    Array<{ id: string; name: string; email: string; phone: string }>
  >([]);
  const [assigned, setAssigned] = useState<
    Array<{ id: string; name: string; email: string; currentUnit: string }>
  >([]);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "", phone: "", personalNumber: "" },
  });

  const isReplace = !!currentTenant;

  /* ======================================================
     LOAD TENANTS
  ====================================================== */

  useEffect(() => {
    if (!open) return;

    setIsLoading(true);
    getAssignableTenants()
      .then((data: any) => {
        console.log("data", data)
        setUnassigned(data.unassigned);
        setAssigned(data.assigned);
      })
      .catch(() => toast.error("Kunde inte ladda hyresgäster"))
      .finally(() => setIsLoading(false));
  }, [open]);

  /* ======================================================
     HANDLERS
  ====================================================== */

  function handleAssign(tenantId: string) {
    setSelectedId(tenantId);

    startTransition(async () => {
      try {
        await assignExistingTenant({ tenantId, unitId });
        toast.success("Hyresgäst kopplad!");
        setOpen(false);
        router.refresh();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Något gick fel");
        setSelectedId(null);
      }
    });
  }

  function handleCreate(values: FormData) {
    startTransition(async () => {
      try {
        await createAndAssignTenant({ ...values, unitId });
        toast.success("Hyresgäst skapad och kopplad!");
        setOpen(false);
        form.reset();
        router.refresh();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Något gick fel");
      }
    });
  }

  /* ======================================================
     RENDER
  ====================================================== */

  return (
    <>
      {trigger ? (
        <span onClick={() => setOpen(true)} className="cursor-pointer">
          {trigger}
        </span>
      ) : (
        <Button onClick={() => setOpen(true)}>
          <UserPlus className="mr-2 h-4 w-4" />
          {isReplace ? "Byt hyresgäst" : "Koppla hyresgäst"}
        </Button>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {isReplace ? "Byt hyresgäst" : "Koppla hyresgäst"}
            </DialogTitle>
            {(propertyName || unitLabel) && (
              <DialogDescription>
                {[propertyName, unitLabel].filter(Boolean).join(" – ")}
              </DialogDescription>
            )}
          </DialogHeader>

          {/* Nuvarande hyresgäst */}
          {currentTenant && (
            <div className="flex items-center gap-3 rounded-lg bg-muted p-3">
              <User className="h-4 w-4 text-muted-foreground" />
              <div className="text-sm">
                <span className="text-muted-foreground">Nuvarande: </span>
                <span className="font-medium">{currentTenant.name}</span>
              </div>
            </div>
          )}

          <Tabs defaultValue="existing" className="mt-2">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="existing">Befintlig</TabsTrigger>
              <TabsTrigger value="new">Skapa ny</TabsTrigger>
            </TabsList>

            {/* ========== BEFINTLIGA ========== */}
            <TabsContent value="existing" className="mt-4 space-y-4">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <>
                  {/* Lediga */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-green-500" />
                      Lediga ({unassigned.length})
                    </h4>

                    {unassigned.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4 border rounded-lg border-dashed">
                        Inga lediga hyresgäster
                      </p>
                    ) : (
                      <div className="space-y-2 max-h-[200px] overflow-y-auto">
                        {unassigned.map((t) => (
                          <div
                            key={t.id}
                            className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                          >
                            <div className="min-w-0">
                              <p className="font-medium text-sm truncate">
                                {t.name}
                              </p>
                              <p className="text-xs text-muted-foreground truncate">
                                {t.email}
                              </p>
                            </div>
                            <Button
                              size="sm"
                              onClick={() => handleAssign(t.id)}
                              disabled={isPending}
                            >
                              {isPending && selectedId === t.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <>
                                  <Check className="h-3 w-3 mr-1" />
                                  Välj
                                </>
                              )}
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <Separator />

                  {/* Kopplade */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-amber-500" />
                      Redan kopplade ({assigned.length})
                    </h4>

                    {assigned.length > 0 && (
                      <div className="space-y-2 max-h-[150px] overflow-y-auto">
                        {assigned.map((t) => (
                          <div
                            key={t.id}
                            className="flex items-center gap-3 p-3 border rounded-lg opacity-60"
                          >
                            <Building2 className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            <div className="min-w-0">
                              <p className="font-medium text-sm truncate">
                                {t.name}
                              </p>
                              <p className="text-xs text-muted-foreground truncate">
                                {t.currentUnit}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}
            </TabsContent>

            {/* ========== SKAPA NY ========== */}
            <TabsContent value="new" className="mt-4">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleCreate)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Namn *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Anna Andersson"
                            disabled={isPending}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-3">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>E-post *</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="anna@mail.se"
                              disabled={isPending}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Telefon *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="070-123 45 67"
                              disabled={isPending}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="personalNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Personnummer</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="ÅÅÅÅMMDD-XXXX"
                            disabled={isPending}
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full" disabled={isPending}>
                    {isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <UserPlus className="h-4 w-4 mr-2" />
                    )}
                    Skapa & koppla
                  </Button>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
}