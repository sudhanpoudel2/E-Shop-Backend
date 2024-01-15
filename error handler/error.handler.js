function errorHandler(error, req, res, next){
    if (error) {
        res.status(500).json({ message: error });
    }
}

export default errorHandler();