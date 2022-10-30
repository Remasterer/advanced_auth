import ApiError from "../utils/ApiError.js";

export const errorMiddleware = (err, req, res, next) => {
    console.log(err);
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({ message: err.message });
    }

    return res.status(500).json({ message: 'Internal server error' });
}