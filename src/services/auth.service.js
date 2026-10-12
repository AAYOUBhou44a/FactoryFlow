const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userRepository = require("../repositories/user.repository");

const login = async ({ email, password }) => {
    if (!email || !password) {
        const error = new Error("Email et mot de passe requis.");
        error.statusCode = 400;
        throw error;
    }

    const user = await userRepository.findByEmail(email);

    if (!user) {
        const error = new Error("Identifiants invalides.");
        error.statusCode = 401;
        throw error;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        const error = new Error("Identifiants invalides.");
        error.statusCode = 401;
        throw error;
    }

    const token = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "8h" }
    );

    return {
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    };
};

const getProfile = async (userId) => {
    const user = await userRepository.findById(userId);

    if (!user) {
        const error = new Error("Utilisateur introuvable.");
        error.statusCode = 404;
        throw error;
    }

    return user;
};

module.exports = {
    login,
    getProfile
};
