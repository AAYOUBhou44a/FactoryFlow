const authService = require("../services/auth.service");

const login = async (req, res, next) => {
    try {
        const result = await authService.login(req.body);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

const getProfile = async (req, res, next) => {
    try {
        const user = await authService.getProfile(req.user._id);
        res.status(200).json({ user });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    login,
    getProfile
};
