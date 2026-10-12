const errorMiddleware = (error, req, res, next) => {
    const statusCode = error.statusCode || 500;

    if (statusCode === 500) {
        console.error(error);
    }

    res.status(statusCode).json({
        message:
            statusCode === 500
                ? "Erreur interne du serveur."
                : error.message
    });
};

module.exports = errorMiddleware;