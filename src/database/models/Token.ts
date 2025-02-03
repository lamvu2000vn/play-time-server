import {model, Schema, Types} from "mongoose";

interface IToken {
    _id: Types.ObjectId;
    userId: Types.ObjectId;
    accessToken: string;
    refreshToken: string;
    lastLoginAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

const tokenSchema = new Schema<IToken>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            index: true,
        },
        accessToken: {
            type: String,
            required: false,
            default: null,
        },
        refreshToken: {
            type: String,
            required: false,
            default: null,
            index: true,
        },
        lastLoginAt: {
            type: Date,
            required: true,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

const Token = model<IToken>("Token", tokenSchema);

export default Token;
