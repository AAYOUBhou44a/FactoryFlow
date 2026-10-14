const mongoose = require("mongoose");

const productRepository = require("../repositories/product.repository");
const rawMaterialRepository = require("../repositories/rawMaterial.repository");
const manufacturingOrderRepository = require("../repositories/manufacturingOrder.repository");

const createError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const validateId = (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw createError("Identifiant invalide.", 400);
  }
};

const validateComposition = (composition) => {
  if (!Array.isArray(composition) || composition.length === 0) {
    throw createError(
      "La composition doit contenir au moins une matière première.",
      400
    );
  }

  const materialIds = [];

  for (const item of composition) {
    if (!mongoose.Types.ObjectId.isValid(item.material)) {
      throw createError("Identifiant de matière première invalide.", 400);
    }

    if (
      typeof item.quantityPerUnit !== "number" ||
      !Number.isFinite(item.quantityPerUnit) ||
      item.quantityPerUnit <= 0
    ) {
      throw createError(
        "La quantité par unité doit être supérieure à zéro.",
        400
      );
    }

    materialIds.push(String(item.material));
  }

  if (new Set(materialIds).size !== materialIds.length) {
    throw createError(
      "Une matière première ne peut apparaître qu'une seule fois.",
      400
    );
  }
};

const prepareComposition = async (composition) => {
  validateComposition(composition);

  const preparedComposition = await Promise.all(
    composition.map(async (item) => {
      const material = await rawMaterialRepository.findById(item.material);

      if (!material) {
        throw createError(
          `Matière première introuvable : ${item.material}.`,
          404
        );
      }

      return {
        material: material._id,
        quantityPerUnit: item.quantityPerUnit,
      };
    })
  );

  return preparedComposition;
};

const getAll = async () => {
  return productRepository.findAll();
};

const getById = async (id) => {
  validateId(id);

  const product = await productRepository.findById(id);

  if (!product) {
    throw createError("Produit introuvable.", 404);
  }

  return product;
};

const create = async (data) => {
  const reference = data.reference.trim().toUpperCase();

  const existingProduct =
    await productRepository.findByReference(reference);

  if (existingProduct) {
    throw createError("Cette référence de produit existe déjà.", 409);
  }

  const composition = await prepareComposition(data.composition);

  try {
    return await productRepository.create({
      reference,
      name: data.name.trim(),
      description: data.description?.trim() || "",
      composition,
    });
  } catch (error) {
    if (error.code === 11000) {
      throw createError("Cette référence de produit existe déjà.", 409);
    }

    throw error;
  }
};

const update = async (id, data) => {
  validateId(id);

  const product = await productRepository.findById(id);

  if (!product) {
    throw createError("Produit introuvable.", 404);
  }

  const updates = {};

  if (data.reference !== undefined) {
    const reference = data.reference.trim().toUpperCase();

    const existingProduct =
      await productRepository.findByReference(reference);

    if (
      existingProduct &&
      String(existingProduct._id) !== String(product._id)
    ) {
      throw createError("Cette référence de produit existe déjà.", 409);
    }

    updates.reference = reference;
  }

  if (data.name !== undefined) {
    updates.name = data.name.trim();
  }

  if (data.description !== undefined) {
    updates.description = data.description.trim();
  }

  if (data.composition !== undefined) {
    updates.composition = await prepareComposition(data.composition);
  }

  try {
    return await productRepository.updateById(id, updates);
  } catch (error) {
    if (error.code === 11000) {
      throw createError("Cette référence de produit existe déjà.", 409);
    }

    throw error;
  }
};

const remove = async (id) => {
  validateId(id);

  const product = await productRepository.findById(id);

  if (!product) {
    throw createError("Produit introuvable.", 404);
  }

  const hasOrders =
    await manufacturingOrderRepository.existsByProduct(id);

  if (hasOrders) {
    throw createError(
      "Impossible de supprimer ce produit : il est utilisé dans un ordre de fabrication.",
      409
    );
  }

  return productRepository.deleteById(id);
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
};