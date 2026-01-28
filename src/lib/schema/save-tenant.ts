import { z } from "zod";

export const saveTenantSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(5),
  personalNumber: z.string().min(6),
  moveInDate: z.string(), // yyyy-mm-dd
});

export type SaveTenantInput = z.infer<typeof saveTenantSchema>;
