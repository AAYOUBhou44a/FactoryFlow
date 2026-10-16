const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const installationRepository = require("../repositories/installation.repository");
const userRepository = require("../repositories/user.repository");

const createError = (message, statusCode) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
};

const getStatus = async () => {
    const installation = await installationRepository.find();

    return {
        installed: Boolean(installation)
    };
};

const install = async (data = {}) => {
    const { name, email, password } = data || {};

    if (
        typeof name !== "string" ||
        !name.trim() ||
        typeof email !== "string" ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ||
        typeof password !== "string" ||
        !password
    ) {
        throw createError("Nom, email valide et mot de passe sont requis.", 400);
    }

    const normalizedEmail = email.trim().toLowerCase();
    const hashedPassword = await bcrypt.hash(password, 10);
    const session = await mongoose.startSession();
    let result;

    try {
        await session.withTransaction(async () => {
            if (await installationRepository.find(session)) {
                throw createError("L'application est déjà installée.", 409);
            }

            if (await userRepository.findByEmail(normalizedEmail, session)) {
                throw createError("Un compte avec cet email existe déjà.", 409);
            }

            const admin = await userRepository.create({
                name: name.trim(),
                email: normalizedEmail,
                password: hashedPassword,
                role: "ADMIN"
            }, session);

            const installation = await installationRepository.create({
                admin: admin._id
            }, session);

            result = {
                installed: true,
                installation,
                admin: {
                    id: admin._id,
                    name: admin.name,
                    email: admin.email,
                    role: admin.role
                }
            };
        });

        return result;
    } catch (error) {
        if (error.code === 11000) {
            throw createError("L'application est déjà installée ou l'email est déjà utilisé.", 409);
        }
        throw error;
    } finally {
        await session.endSession();
    }
};

module.exports = {
    getStatus,
    install
};
