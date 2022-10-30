import jwt from 'jsonwebtoken';
import tokenModel from "../models/tokenModel.js";

const expirationAccessTokenTime = '30m';
export const expirationRefreshTokenTime = 40 * 24 * 60 * 60 * 1000;

export const generateTokens = (payload) => {
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET_ACCESS, {
        expiresIn: expirationAccessTokenTime
    });
    const refreshToken = jwt.sign(payload, process.env.JWT_SECRET_REFRESH, {
        expiresIn: expirationRefreshTokenTime
    });

    return {
        accessToken,
        refreshToken
    }
}

export const saveToken = async (userId, refreshToken) => {
    const existedTokenData = await tokenModel.findOne({ user: userId });

    if (existedTokenData) {
        return await existedTokenData.updateOne({ refreshToken });
    }

    return await tokenModel.create({ user: userId, refreshToken });
}

export const removeToken = async (refreshToken) => {
    await tokenModel.deleteOne({ refreshToken });
}


export const validateAccessToken = (accessToken) => {
    try {
        const userData = jwt.verify(accessToken, process.env.JWT_SECRET_ACCESS);
        return userData;
    } catch (err) {
        return null;
    }
}

export const validateRefreshToken = async (refreshToken) => {
    try {
        const userData = jwt.verify(refreshToken, process.env.JWT_SECRET_REFRESH);
        const existedToken = await tokenModel.findOne({ refreshToken });

        if (!userData || !existedToken) return null;

        return { userData, existedToken };
    } catch (err) {
        return null;
    }
}