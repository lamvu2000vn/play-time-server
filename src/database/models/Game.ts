import {model, Schema, Types} from "mongoose";
import mongooseHidden from "mongoose-hidden";

export interface IGame {
    _id: Types.ObjectId;
    name: string;
    alternativeName: string;
    translations: string;
    imageUrl: string;
    status: number;
    requirement: string;
    createdAt: Date;
    updatedAt: Date;
}

const gameSchema = new Schema<IGame>(
    {
        name: {
            type: String,
            required: true,
            index: true,
        },
        alternativeName: {
            type: String,
            required: true,
            index: true,
        },
        translations: {
            type: String,
            required: true,
        },
        imageUrl: {
            type: String,
            required: true,
        },
        status: {
            type: Number,
            required: true,
            default: 1,
            index: true,
        },
        requirement: {
            type: String,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

gameSchema.plugin(mongooseHidden(), {
    hidden: {
        _id: false,
        status: true,
        createdAt: true,
        updatedAt: true,
        requirement: true,
    },
});

const Game = model("Game", gameSchema);

export default Game;
