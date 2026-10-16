const { z } = require("zod");

const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Identifiant MongoDB invalide.");

const compositionItemSchema = z
  .object({
    material: objectIdSchema,
    quantityPerUnit: z.number().positive(),
  })
  .strict();

const compositionSchema = z
  .array(compositionItemSchema)
  .min(1, "La composition doit contenir au moins une matière première.")
  .refine(
    (items) =>
      new Set(items.map((item) => item.material.toLowerCase())).size ===
      items.length,
    "Une matière première ne peut apparaître qu'une seule fois."
  );

const createProductSchema = z
  .object({
    reference: z.string().trim().min(2).max(50),
    name: z.string().trim().min(2).max(100),
    description: z.string().trim().max(500).default(""),
    composition: compositionSchema,
  })
  .strict();

const updateProductSchema = z
  .object({
    reference: z.string().trim().min(2).max(50),
    name: z.string().trim().min(2).max(100),
    description: z.string().trim().max(500),
    composition: compositionSchema,
  })
  .partial()
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Au moins un champ doit être fourni.",
  });

module.exports = {
  createProductSchema,
  updateProductSchema,
};