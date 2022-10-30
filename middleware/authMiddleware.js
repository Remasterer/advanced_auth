import ApiError from "../utils/ApiError.js";
import { validateAccessToken } from "../services/tokenService.js";

export const authMiddleware = (req, res, next) => {
   try {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader)  return next(new ApiError(300, 'Not authenticated!'));

    const accessToken = authorizationHeader.split(' ')[1];
    if (!accessToken)  return next(new ApiError(300, 'Not authenticated!'));

    const userData = validateAccessToken(accessToken);
    if (!userData)  return next(new ApiError(300, 'Not authenticated!'));

    req.user = userData;
    next();
   } catch (err) {
       return next(new ApiError(300, 'Not authenticated!'))
   }
}