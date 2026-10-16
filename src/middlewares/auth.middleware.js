const jwt = require("jsonwebtoken");
const userRepository = require("../repositories/user.repository");

const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            const error = new Error("Token manquant ou invalide.");
            error.statusCode = 401;
            throw error;
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await userRepository.findById(decoded.userId);

        if (!user) {
            const error = new Error("Utilisateur non autorisé.");
            error.statusCode = 401;
            throw error;
        }

        req.user = user;
        next();
    } catch (error) {
        if (["JsonWebTokenError", "TokenExpiredError", "NotBeforeError"].includes(error.name)) {
            error.statusCode = 401;
        }
        next(error);
    }
};

const authorize = (...roles) => (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
        const error = new Error("Vous n'avez pas les permissions nécessaires.");
        error.statusCode = 403;
        return next(error);
    }

    next();
};

module.exports = {
    authenticate,
    authorize
};
