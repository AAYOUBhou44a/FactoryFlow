
const RawMaterial = require("../models/RawMaterial");

const create = async (data, session = null) => {
    const material = new RawMaterial(data);

    return session
        ? material.save({ session })
        : material.save();
};

const findAll = async (filter = {}, options = {}) => {
    const { skip = 0, limit = 10 } = options;

    return RawMaterial.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
};

const findById = async (id, session = null) => {
    let query = RawMaterial.findById(id);

    if (session) query = query.session(session);

    return query.exec();
};

const findByReference = async (reference) => {
    return RawMaterial.findOne({
        reference: reference.trim().toUpperCase()
    });
};

const updateById = async (id, data, session = null) => {
    return RawMaterial.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
        session
    });
};

const deleteById = async (id) => {
    return RawMaterial.findByIdAndDelete(id);
};

const count = async (filter = {}) => {
    return RawMaterial.countDocuments(filter);
};

const findBelowThreshold = async () => {
    return RawMaterial.find({
        $expr: {
            $lte: ["$quantity", "$alertThreshold"]
        }
    }).sort({ quantity: 1 });
};

module.exports = {
    create,
    findAll,
    findById,
    findByReference,
    updateById,
    deleteById,
    count,
    findBelowThreshold
};
