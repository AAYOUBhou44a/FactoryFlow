const Product = require("../models/Product");

const create = async (data) => {
  return Product.create(data);
};

const findAll = async () => {
  return Product.find()
    .populate("composition.material", "reference name unit")
    .sort({ createdAt: -1 });
};

const findById = async (id) => {
  return Product.findById(id).populate(
    "composition.material",
    "reference name unit"
  );
};

const findByReference = async (reference) => {
  return Product.findOne({
    reference: reference.trim().toUpperCase(),
  });
};

const updateById = async (id, data) => {
  return Product.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  }).populate("composition.material", "reference name unit");
};

const deleteById = async (id) => {
  return Product.findByIdAndDelete(id);
};

const count = async (filter = {}) => {
  return Product.countDocuments(filter);
};

module.exports = {
  create,
  findAll,
  findById,
  findByReference,
  updateById,
  deleteById,
  count,
};