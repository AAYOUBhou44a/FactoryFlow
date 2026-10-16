const ManufacturingOrder = require("../models/ManufacturingOrder");

const existsByProduct = async (productId) =>
  Boolean(await ManufacturingOrder.exists({ product: productId }));

module.exports = {
  existsByProduct,
};
