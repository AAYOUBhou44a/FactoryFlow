const bcrypt = require("bcryptjs");
const installationRepository = require("../repositories/installation.repository");
const userRepository = require("../repositories/user.repository");

const getStatus = async () => {
    const installation = await installationRepository.find();

    return {
        installed: Boolean(installation)
    };
};

const install = async ({ name, email, password }) => {
    if (!name || !email || !password) {
        const error = new Error("Nom, email et mot de passe sont requis.");
        error.statusCode = 400;
        throw error;
    }

    const existingInstallation = await installationRepository.find();
    if (existingInstallation) {
        const error = new Error("L'application est déjà installée.");
        error.statusCode = 409;
        throw error;
    }

    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
        const error = new Error("Un compte avec cet email existe déjà.");
        error.statusCode = 409;
        throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await userRepository.create({
        name,
        email,
        password: hashedPassword,
        role: "ADMIN"
    });

    const installation = await installationRepository.create({
        admin: admin._id
    });

    return {
        installed: true,
        installation,
        admin: {
            id: admin._id,
            name: admin.name,
            email: admin.email,
            role: admin.role
        }
    };
};

module.exports = {
    getStatus,
    install
};
