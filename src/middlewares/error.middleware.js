const errorMiddleware = (error, req, res, next) => {
    const candidateStatus = error.statusCode || error.status ||
        (error.name === "ValidationError" || error.name === "CastError"
            ? 400
            : error.code === 11000
                ? 409
                : 500);
    const statusCode = Number.isInteger(candidateStatus) &&
        candidateStatus >= 400 && candidateStatus <= 599
        ? candidateStatus
        : 500;

    if (statusCode >= 500) {
        console.error(error);
    }

    res.status(statusCode).json({
        message: statusCode >= 500 ? "Erreur interne du serveur." : error.message,
    });
};

module.exports = errorMiddleware;