import UserModel from "../models/userModel.js";
import bcrypt from 'bcrypt';
import * as uuid from "uuid";
import { sendActivationEmail } from "../services/emailService.js";
import {
    expirationRefreshTokenTime,
    generateTokens,
    removeToken,
    saveToken,
    validateRefreshToken
} from "../services/tokenService.js";
import ApiError from "../utils/ApiError.js";

const generateTokensFromUserData = async (user) => {
    const id = user._id;

    const userData = { id, email: user.email, isActivated: user.isActivated  };

    const { refreshToken, accessToken } = generateTokens(userData);

    await saveToken(id, refreshToken);

    return {
        refreshToken,
        accessToken,
        userData
    }
}

export const registerUser = async (req, res, next) => {
    try {
        const { email, password, name } = req.body;
        const userWithSameEmail = await UserModel.findOne({ email });

        if (userWithSameEmail) {
            throw new ApiError(300, 'User with same email already exists!');
        }

        const hashedPassword = await bcrypt.hash(password, 3);
        const activationLink = uuid.v4();
        const newUser = await UserModel.create({ email, password: hashedPassword, activationLink, name });

        await sendActivationEmail(email,`${process.env.APP_URL}/v1/auth/activate/${activationLink}`);

        const { refreshToken, accessToken, userData } = await generateTokensFromUserData(newUser);

        res.cookie('refreshToken', refreshToken, { maxAge: expirationRefreshTokenTime, httpOnly: true });
        return res.json({ refreshToken, accessToken, user: userData })
    } catch (err) {
        next(err);
    }
}

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const existedUser = await UserModel.findOne({ email });

        if (!existedUser) {
            throw new ApiError(300, 'User with such email doest not exist!');
        }

        const isPassEquals = await bcrypt.compare(password, existedUser.password);

        if (!isPassEquals) {
            throw new ApiError(300, 'Password is not correct!');
        }

        const { refreshToken, accessToken, userData } = await generateTokensFromUserData(existedUser);

        res.cookie('refreshToken', refreshToken, { maxAge: expirationRefreshTokenTime, httpOnly: true });
        return res.json({ refreshToken, accessToken, user: userData })
    } catch (err) {
        next(err);
    }
}

export const logout = async (req, res, next) => {
    try {
        const { refreshToken } = req.cookies;

        await removeToken(refreshToken);

        res.clearCookie('refreshToken');
        return res.status(200).json({ message: 'Logout success' })
    } catch (err) {
        next(err);
    }
}

export const refreshSession = async (req, res, next) => {
    try {
        const { refreshToken } = req.cookies;


        if (!refreshToken) {
            throw new ApiError(300, 'Auth error!');
        }

        const validationResult = await validateRefreshToken(refreshToken);

        if (!validationResult) throw new ApiError(300, 'Authentication failed!');

        const { userData } = validationResult;

        const existedUser = await UserModel.findOne({ _id: userData.id })

        const refreshedTokens = await generateTokensFromUserData(existedUser);

        res.cookie('refreshToken', refreshToken, { maxAge: expirationRefreshTokenTime, httpOnly: true });
        return res.json({ ...refreshedTokens })
    } catch (err) {
        next(err);
    }
}

export const activateToken = async (req, res, next) => {
    try {
        const { link: activationLink } = req.params;
        const user = await UserModel.findOne({ activationLink });

        if (!user) {
            throw new ApiError(300, 'Link is expired!');
        }

        await user.update({ activated: true });

        return res.status(200).json({ message: 'User is activated' });
    } catch (err) {
        next(err);
    }
}

export const getUsers = async (req, res, next) => {
    try {
        const users = await UserModel.find();

        return res.status(200).json({ users });
    } catch (err) {
        next(err);
    }
}