import {Request, Response} from "express";
import {BlacklistToken, Game, Item, PaidItem, Token, User} from "../../database/models";
import bcryptjs from "bcryptjs";
import {decodeJwt, generateAccessToken, getApiResponse} from "../../helpers/utils/utils";
import {matchedData, validationResult} from "express-validator";
import jwt from "jsonwebtoken";
import {randomBytes} from "crypto";
import {IPaidItem} from "../../database/models/PaidItem";
import {Document} from "mongoose";
import GameStatistics from "../../database/models/GameStatistics";
import {ILoginPayload, IRegisterUserPayload, IUserIdentifyPayload} from "../../helpers/shared/interfaces/apiInterfaces";
import ms, {StringValue} from "ms";

export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const validate = validationResult(req);

        if (!validate.isEmpty()) {
            res.status(400).json(getApiResponse(400, "Invalid or missing data", validate.array()));
            return;
        }

        const {username, password, name} = matchedData(req) as IRegisterUserPayload;

        if (await User.findOne({username})) {
            res.json(getApiResponse(409, "Username already exists"));
            return;
        }

        const hashedPassword = await bcryptjs.hash(password, 10);

        const newUser = new User({
            username,
            password: hashedPassword,
            name,
            avatarUrl:
                "https://res.cloudinary.com/dorvt3ync/image/upload/v1739007978/images/items/avatars/default-avatar.png.png",
            coin: 1000,
        });

        await newUser.save();

        await setupDefaultUserInfo(newUser);

        res.status(201).json(getApiResponse(201, "Registration successful"));
    } catch (err: Error | unknown) {
        console.log("🚀 ~ register ~ err:", err);

        res.status(500).json(getApiResponse(500, err instanceof Error ? err.message : "error"));
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const validate = validationResult(req);

        if (!validate.isEmpty()) {
            res.json(getApiResponse(400, "Invalid or missing data", validate.array()));
            return;
        }

        const {username, password, rememberMe} = matchedData<ILoginPayload>(req);

        const user = await User.findOne({username});

        if (!user || !(await bcryptjs.compare(password, user.password))) {
            res.json(getApiResponse(404, "Invalid username or password"));
            return;
        }

        const jwtSecret = (process.env.JWT_SECRET || "") as jwt.Secret;
        const payload = {userId: user._id.toString()};
        const expiresIn = ms((process.env.JWT_EXPIRATION || "1d") as StringValue);

        if (!jwtSecret) throw new Error("Can not authenticate");

        const accessToken = generateAccessToken(payload, expiresIn);
        const refreshToken = rememberMe ? randomBytes(64).toString("hex") : null;

        const newToken = new Token({
            userId: user.id,
            accessToken,
            refreshToken,
        });

        await newToken.save();

        if (refreshToken) {
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: process.env.NODE_ENV === "production" ? false : undefined,
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            });
        }

        res.json(
            getApiResponse(200, "Success", {
                accessToken,
                user: user.toJSON(),
            })
        );
    } catch (err: unknown) {
        console.log("🚀 ~ register ~ err:", err);

        res.status(500).json(getApiResponse(500, err instanceof Error ? err.message : "Internal server error"));
    }
};

export const refreshToken = async (req: Request, res: Response): Promise<void> => {
    try {
        const validate = validationResult(req);

        if (!validate.isEmpty()) {
            res.status(400).json(getApiResponse(400, "Invalid or missing data", validate.array()));
            return;
        }

        const {refreshToken} = matchedData<{refreshToken: string}>(req);

        const userToken = await Token.findOne({
            refreshToken,
        });

        if (!userToken) {
            res.status(401).json(getApiResponse(401, "Unauthenticated", validate.array()));
            return;
        }

        const expiresIn = (process.env.JWT_EXPIRATION || "1d") as StringValue;

        const newAccessToken = generateAccessToken({userId: userToken.userId}, expiresIn);

        userToken.accessToken = newAccessToken;

        await userToken.save();

        res.status(200).json(getApiResponse(200, "success", {accessToken: newAccessToken}));
    } catch (err: Error | unknown) {
        console.log("🚀 ~ reIssueToken ~ err:", err);
        res.status(500).json(getApiResponse(500, err instanceof Error ? err.message : "Internal server error"));
    }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
    try {
        const validate = validationResult(req);

        if (!validate.isEmpty()) {
            res.status(400).json(getApiResponse(400, "Invalid or missing data", validate.array()));
            return;
        }

        const {userId, refreshToken} = matchedData<IUserIdentifyPayload>(req);

        const userToken = await Token.findOne({userId, refreshToken});

        if (userToken) {
            const newBlacklistToken = new BlacklistToken({accessToken: userToken.accessToken});
            await newBlacklistToken.save();
            await userToken.deleteOne();
        }

        res.status(200).clearCookie("refreshToken").json(getApiResponse(200, "Logout success"));
    } catch (err: Error | unknown) {
        console.log("🚀 ~ logout ~ err:", err);
        res.status(500).json(getApiResponse(500, err instanceof Error ? err.message : "Internal server error"));
    }
};

export const getUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const accessToken = req.headers.authorization!.split(" ")[1];

        const decoded = decodeJwt(accessToken);
        const user = decoded ? await User.findById(decoded.userId) : null;

        if (!user) {
            res.json(getApiResponse(404, "User not found"));
            return;
        }

        res.json(getApiResponse(200, "Success", {user}));
    } catch (err: unknown) {
        console.log("🚀 ~ authStatus ~ err:", err);

        res.status(500).json(getApiResponse(500, err instanceof Error ? err.message : "Internal server error"));
    }
};

const setupDefaultUserInfo = async (newUser: Document) => {
    const defaultItems = await Item.find({
        isDefault: true,
        status: 1,
    });

    // default avatar & sticker
    if (defaultItems && defaultItems.length) {
        const newPaidItems = defaultItems.map((item) => {
            return {
                userId: newUser._id,
                itemId: item._id,
            } as IPaidItem;
        });

        await PaidItem.insertMany(newPaidItems);
    }

    // default game score
    const gameList = await Game.find({status: 1});

    await GameStatistics.insertMany(
        gameList.map((game) => ({
            gameId: game._id,
            userId: newUser._id,
        }))
    );
};
