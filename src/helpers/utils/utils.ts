import {IJwtDecoded} from "../shared/interfaces/interfaces";
import jwt from "jsonwebtoken";
import {randomBytes} from "crypto";
import {IApiResponse} from "../shared/interfaces/apiInterfaces";
import ms, {StringValue} from "ms";

export const getRandomDefaultAvatarUrl = (): string => {
    const avatarUrls = [
        "/assets/images/users/avatars/default-1.png",
        "/assets/images/users/avatars/default-2.png",
        "/assets/images/users/avatars/default-3.png",
        "/assets/images/users/avatars/default-4.png",
        "/assets/images/users/avatars/default-5.png",
        "/assets/images/users/avatars/default-6.png",
        "/assets/images/users/avatars/default-7.png",
        "/assets/images/users/avatars/default-8.png",
        "/assets/images/users/avatars/default-9.png",
        "/assets/images/users/avatars/default-10.png",
        "/assets/images/users/avatars/default-11.png",
        "/assets/images/users/avatars/default-12.png",
        "/assets/images/users/avatars/default-13.png",
        "/assets/images/users/avatars/default-14.png",
        "/assets/images/users/avatars/default-15.png",
        "/assets/images/users/avatars/default-16.png",
    ];

    const randomIndex = Math.floor(Math.random() * avatarUrls.length);

    return avatarUrls[randomIndex];
};

export const getApiResponse = (status: number, message: string, data: object | null = {}): IApiResponse => {
    const response: IApiResponse = {
        status: 500,
        message: "",
        data: {},
    };

    response.status = status;
    response.message = message;
    response.data = data || {};

    return response;
};

export const generateAccessToken = (payload: object, expiresIn: number | StringValue): string => {
    try {
        return jwt.sign(payload, process.env.JWT_SECRET!, {
            expiresIn: typeof expiresIn === "number" ? expiresIn : ms(expiresIn),
        });
    } catch (err: Error | unknown) {
        console.log("🚀 ~ generateAccessToken ~ err:", err);

        throw err;
    }
};

export const decodeJwt = (token: string): IJwtDecoded | null => {
    try {
        const decoded = jwt.decode(token) as IJwtDecoded;
        return decoded;
    } catch (err) {
        console.log("🚀 ~ verifyJwt ~ err:", err);
        return null;
    }
};

export const generateRandomString = (size: number = 20): string => randomBytes(size).toString("hex").slice(0, size);

export const getRandomValueFromArray = <T>(array: T[]): T => array[Math.floor(Math.random() * array.length)];

export const getRandomIndexFromArray = <T>(array: T[]): number => Math.floor(Math.random() * array.length);

export const getCorsWhitelist = (): string[] => process.env.CORS_WHITELIST?.split(",") || [];
