import expressValidator from "express-validator";
import ApiError from "../utils/ApiError.js";

const { validationResult } = expressValidator;

export const validate = (rules) => {
    return async (req, res, next) => {
        await Promise.all(rules.map(validation => validation.run(req)));

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return next(new ApiError(400, errors.array()))
        }

        return next();
    }
}