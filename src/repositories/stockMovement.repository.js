const StockMovement = require("../models/StockMovement");

const create = async (data, session = null) => {
  const movement = new StockMovement(data);
  return session ? movement.save({ session }) : movement.save();
};

const existsByRawMaterial = async (rawMaterialId) =>
  Boolean(await StockMovement.exists({ rawMaterial: rawMaterialId }));

module.exports = {
  create,
  existsByRawMaterial,
};
