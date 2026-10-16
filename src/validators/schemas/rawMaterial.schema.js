const { z } = require("zod");

const createRawMaterialSchema = z
  .object({
    reference: z.string().trim().min(2).max(50),
    name: z.string().trim().min(2).max(100),
    unit: z.string().trim().min(1).max(20),
    alertThreshold: z.number().min(0).default(0),
  })
  .strict();

const updateRawMaterialSchema = z
  .object({
    reference: z.string().trim().min(2).max(50),
    name: z.string().trim().min(2).max(100),
    unit: z.string().trim().min(1).max(20),
    alertThreshold: z.number().min(0),
  })
  .partial()
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Au moins un champ doit être fourni.",
  });

const stockEntrySchema = z
  .object({
    quantity: z.number().positive(),
  })
  .strict();

module.exports = {
  createRawMaterialSchema,
  updateRawMaterialSchema,
  stockEntrySchema,
};