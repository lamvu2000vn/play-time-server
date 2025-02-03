import {checkSchema} from "express-validator";

export const userRegistrationValidate = checkSchema({
    username: {
        notEmpty: true,
        trim: true,
        escape: true,
        isLength: {
            options: {
                max: 20,
            },
        },
    },
    password: {
        notEmpty: true,
        trim: true,
        escape: true,
        isLength: {
            options: {
                min: 6,
                max: 18,
            },
        },
    },
    name: {
        notEmpty: true,
        trim: true,
        escape: true,
        isLength: {
            options: {
                max: 50,
            },
        },
    },
});

export const loginValidate = checkSchema({
    username: {
        notEmpty: true,
        trim: true,
        escape: true,
    },
    password: {
        notEmpty: true,
        trim: true,
        escape: true,
    },
    rememberMe: {
        notEmpty: true,
        trim: true,
        escape: true,
        isBoolean: true,
        toBoolean: true,
    },
});

export const refreshTokenValidate = checkSchema({
    refreshToken: {
        notEmpty: true,
        trim: true,
        escape: true,
    },
});

export const logoutValidate = refreshTokenValidate;
