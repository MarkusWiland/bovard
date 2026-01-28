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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  label: z.string().min(1, "Beteckning krävs"),
  type: z.enum(["APARTMENT", "OFFICE", "STORAGE"]),
  rooms: z.number().min(0),
  sizeSqm: z.number().min(1),
  rent: z.number().min(0),
  floor: z.number().optional(),
  note: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export function CreateUnitDialog({
  propertyId,
}: {
  propertyId: string;
}) {
  const [open, setOpen] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      label: "",
      type: "APARTMENT",
      rooms: 1,
      sizeSqm: 40,
      rent: 0,
      floor: undefined,
      note: "",
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  
  async function onSubmit(values: FormValues) {
    setIsSubmitting(true);
  
    try {
      const res = await createUnit({
        propertyId,
        ...values,
        status: "VACANT",
      });
  
      if (!res.ok) {
        throw new Error(res.message);
      }
  
      form.reset();
      setOpen(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }
  

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        Ny enhet
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              Skapa ny enhet
            </DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4"
            >
              {/* Beteckning */}
              <FormField
                control={form.control}
                name="label"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Beteckning</FormLabel>
                    <FormControl>
                      <Input placeholder="LGH 1203" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Typ */}
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Typ</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="APARTMENT">
                          Lägenhet
                        </SelectItem>
                        <SelectItem value="OFFICE">
                          Kontor
                        </SelectItem>
                        <SelectItem value="STORAGE">
                          Förråd
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              {/* Storlek + rum */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="sizeSqm"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Yta (kvm)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="rooms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Antal rum</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              {/* Hyra + våning */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="rent"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hyra (kr/mån)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="floor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Våning</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value === ""
                                ? undefined
                                : Number(e.target.value)
                            )
                          }
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              {/* Notering */}
              <FormField
                control={form.control}
                name="note"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notering</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Ex. renoverad 2023, balkong mot innergård"
                        {...field}
                      />
                    </FormControl>
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
