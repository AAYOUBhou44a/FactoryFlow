const User = require("../models/User");

const create = async (userData) => {
    return await User.create(userData);
};

const findByEmail = async (email) => {
    return await User.findOne({
        email: email.trim().toLowerCase()
    });
};

const findById = async (id) => {
    return await User.findById(id).select("-password");
};

module.exports = {
    create,
    findByEmail,
    findById
};