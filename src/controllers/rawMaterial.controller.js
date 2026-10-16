const rawMaterialService = require("../services/rawMaterial.service");

const getAll = async (req, res, next) => {
  try {
    const materials = await rawMaterialService.getAll();

    res.status(200).json({
      count: materials.length,
      data: materials,
    });
  } catch (error) {           
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const material = await rawMaterialService.getById(req.params.id);

    res.status(200).json({ data: material });
  } catch (error) {                      
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const material = await rawMaterialService.create(req.body);

    res.status(201).json({
      message: "Matière première créée.",
      data: material,
    });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const material = await rawMaterialService.update(
      req.params.id,
      req.body
    );

    res.status(200).json({
      message: "Matière première modifiée.",
      data: material,
    });
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    await rawMaterialService.remove(req.params.id);

    res.status(200).json({
      message: "Matière première supprimée.",
    });
  } catch (error) {
    next(error);
  }
};

const getLowStock = async (req, res, next) => {
  try {
    const materials = await rawMaterialService.getLowStock();
    res.status(200).json(materials);
  } catch (error) {
    next(error);
  }
};

const addStock = async (req, res, next) => {
  try {
    const material = await rawMaterialService.addStock(
      req.params.id,
      req.body.quantity,
      req.user._id
    );

    res.status(200).json({
      message: "Entrée de stock enregistrée.",
      data: material,
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
  getLowStock,
  addStock,
};