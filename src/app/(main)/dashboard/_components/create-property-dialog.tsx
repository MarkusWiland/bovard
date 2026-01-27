"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const schema = z.object({
  fastighetNamn: z.string().min(1, "Namn krävs"),

});

export function CreatePropertyDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
        fastighetNamn: "",
     
    },
  });

  async function onSubmit(values: any) {
    // TODO: server action (skapa fastighet)
    console.log(values);
    // redirect till properties page
    onOpenChange(false);
    router.push(`/dashboard/properties/${values.id}/units`);
    toast.success("Fastighet skapad");
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ny fastighet</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="fastighetNamn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fastighetsnamn</FormLabel>
                  <FormControl>
                    <Input placeholder="Vasagatan 12" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              Skapa fastighet
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
