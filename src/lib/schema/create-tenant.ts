import { z } from "zod";

export const createTenantSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(5),
  personalNumber: z.string().min(6),
  moveInDate: z.string(),

  contract: z
    .object({
      unitId: z.string(),
      templateId: z.string(),
      startDate: z.string(),
      endDate: z.string().optional(),
      data: z.any().optional(),

      document: z
        .object({
          name: z.string(),
          type: z.string(),
          fileUrl: z.string(),
        })
        .optional(),
    })
    .optional(),
});

export type CreateTenantInput = z.infer<typeof createTenantSchema>;
