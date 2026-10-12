const Installation = require("../models/Installation");

const find = async (session = null) => {
    let query = Installation.findOne({
        key: "factoryflow"
    });

    if (session) {
        query = query.session(session);
    }

    return query.exec();
};

const create = async (installationData, session = null) => {
    const installation = new Installation(installationData);

    if (session) {
        return installation.save({ session });
    }

    return installation.save();
};

module.exports = {
    find,
    create
};