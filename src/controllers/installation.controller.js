const installationService = require("../services/installation.service");

const getStatus = async (req, res, next) => {
    try {
        const result = await installationService.getStatus();

        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

const install = async (req, res, next) => {
    try {
        const result = await installationService.install(req.body);

        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getStatus,
    install
};