const User = require("../models/User");

const create = async (userData, session = null) => {
    const user = new User(userData);
    return session ? user.save({ session }) : user.save();
};

const findByEmail = async (email, session = null) => {
    let query = User.findOne({
        email: email.trim().toLowerCase()
    });

    if (session) {
        query = query.session(session);
    }

    return query.exec();
};

const findById = async (id) => {
    return await User.findById(id).select("-password");
};

module.exports = {
    create,
    findByEmail,
    findById
};