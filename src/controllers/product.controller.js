const productService = require("../services/product.service");

const getAll = async (req, res, next) => {
  try {
    const products = await productService.getAll();

    res.status(200).json({
      count: products.length,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const product = await productService.getById(req.params.id);

    res.status(200).json({ data: product });
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const product = await productService.create(req.body);

    res.status(201).json({
      message: "Produit créé.",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const product = await productService.update(
      req.params.id,
      req.body
    );

    res.status(200).json({
      message: "Produit modifié.",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    await productService.remove(req.params.id);

    res.status(200).json({
      message: "Produit supprimé.",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
};