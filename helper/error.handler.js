function errorHandler(error, req, res, next) {
    if (error.name === "UnauthorizedError") {
        return res.status(401).json({ message: "The user is not authorized" });
    }

    if (error.name === "ValidationError") {
        return res.status(400).json({ message: error.message });
    }

    // Server error
    console.error(error); // Log the error for debugging
    return res.status(500).json({ message: 'Internal Server Error' });
}

export default errorHandler;
