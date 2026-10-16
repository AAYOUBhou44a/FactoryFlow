const mongoose = require("mongoose");
const productRepository = require("../repositories/product.repository");
const rawMaterialRepository = require("../repositories/rawMaterial.repository");
const stockMovementRepository = require("../repositories/stockMovement.repository");

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
const getAll = async () => rawMaterialRepository.findAll({}, { limit: 0 });

const getById = async (id) => {
  validateId(id);

  const material = await rawMaterialRepository.findById(id);

  if (!material) {
    throw createError("Matière première introuvable.", 404);
  }

  return material;
};

const create = async (data) => {
  const reference = data.reference.trim().toUpperCase();

  const existing = await rawMaterialRepository.findByReference(reference);

  if (existing) {
    throw createError("Cette référence existe déjà.", 409);
  }

  try {
    return await rawMaterialRepository.create({
      reference,
      name: data.name.trim(),
      unit: data.unit.trim(),
      alertThreshold: data.alertThreshold ?? 0,
      // quantity reste à 0 : le stock est ajouté via une entrée.
    });
  } catch (error) {
    if (error.code === 11000) {
      throw createError("Cette référence existe déjà.", 409);
    }
    throw error;
  }
};

const update = async (id, data) => {
  validateId(id);

  const material = await rawMaterialRepository.findById(id);

  if (!material) {
    throw createError("Matière première introuvable.", 404);
  }

  const updates = {};

  if (data.reference !== undefined) {
    const reference = data.reference.trim().toUpperCase();

    if (reference !== material.reference) {
      const existing =
        await rawMaterialRepository.findByReference(reference);

      if (existing) {
        throw createError("Cette référence existe déjà.", 409);
      }
    }

    updates.reference = reference;
  }

  if (data.name !== undefined) {
    updates.name = data.name.trim();
  }

  if (data.unit !== undefined) {
    updates.unit = data.unit.trim();
  }

  if (data.alertThreshold !== undefined) {
    updates.alertThreshold = data.alertThreshold;
  }

  try {
    return await rawMaterialRepository.updateById(id, updates);
  } catch (error) {
    if (error.code === 11000) {
      throw createError("Cette référence existe déjà.", 409);
    }
    throw error;
  }
};

const addStock = async (id, quantity, performedBy) => {
  validateId(id);

  if (!Number.isFinite(quantity) || quantity <= 0) {
    throw createError("La quantité doit être supérieure à zéro.", 400);
  }

  if (!mongoose.Types.ObjectId.isValid(performedBy)) {
    throw createError("Identifiant utilisateur invalide.", 400);
  }

  const session = await mongoose.startSession();
  let updatedMaterial;

  try {
    await session.withTransaction(async () => {
      const material = await rawMaterialRepository.findById(id, session);

      if (!material) {
        throw createError("Matière première introuvable.", 404);
      }

      const stockBefore = material.quantity;
      const stockAfter = stockBefore + quantity;

      updatedMaterial = await rawMaterialRepository.updateById(
        id,
        { quantity: stockAfter },
        session
      );

      await stockMovementRepository.create(
        {
          rawMaterial: id,
          type: "ENTRY",
          quantity,
          stockBefore,
          stockAfter,
          performedBy,
        },
        session
      );
    });

    return updatedMaterial;
  } finally {
    await session.endSession();
  }
};

const remove = async (id) => {
  validateId(id);

  const material = await rawMaterialRepository.findById(id);

  if (!material) {
    throw createError("Matière première introuvable.", 404);
  }

  if (material.quantity > 0) {
    throw createError(
      "Impossible de supprimer une matière dont le stock n'est pas nul.",
      409
    );
  }

  const [usedInProduct, hasMovements] = await Promise.all([
    productRepository.isMaterialUsed(id),
    stockMovementRepository.existsByRawMaterial(id),
  ]);

  if (usedInProduct || hasMovements) {
    throw createError(
      "Impossible de supprimer cette matière : elle est utilisée dans un produit ou possède un historique de stock.",
      409
    );
  }

  return rawMaterialRepository.deleteById(id);
};

const getLowStock = async () => rawMaterialRepository.findBelowThreshold();

module.exports = {
  getAll,
  getLowStock,
  addStock,
  getById,
  create,
  update,
  remove,
};