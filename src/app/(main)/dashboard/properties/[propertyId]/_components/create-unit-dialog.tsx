"use client";

import { useState } from "react";
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
import { createUnit } from "../actions";


const schema = z.object({
  label: z.string().min(1, "Enhetsbeteckning krävs"),
  rent: z.number().min(0),
});

export function CreateUnitDialog({
  propertyId,
}: {
  propertyId: string;
}) {
  const [open, setOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      label: "",
      rent: 0,
    },
  });

  async function onSubmit(values: any) {
    await createUnit({
      propertyId,
      ...values,
    });

    form.reset();
    setOpen(false);
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        Ny enhet
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Skapa ny enhet</DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="label"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Beteckning</FormLabel>
                    <FormControl>
                      <Input placeholder="12A" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="rent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hyra (kr)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) =>
                          field.onChange(
                            Number(e.target.value)
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Skapa enhet
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
