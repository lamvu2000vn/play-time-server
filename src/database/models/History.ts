import {Document, model, Schema, Types} from "mongoose";
import mongooseHidden from "mongoose-hidden";

export interface IHistory extends Document {
    _id: Types.ObjectId;
    gameId: Types.ObjectId;
    player1Id: Types.ObjectId;
    player2Id: Types.ObjectId;
    roomId: string;
    player1Score: number;
    player2Score: number;
    drawCount: number;
    createdAt: Date;
    updatedAt: Date;
}

const schema = new Schema<IHistory>(
    {
        gameId: {
            type: Schema.Types.ObjectId,
            ref: "Game",
            index: true,
        },
        player1Id: {
            type: Schema.Types.ObjectId,
            ref: "User",
            index: true,
        },
        player2Id: {
            type: Schema.Types.ObjectId,
            ref: "User",
            index: true,
        },
        roomId: {
            type: String,
            required: true,
            index: true,
        },
        player1Score: {
            type: Number,
            default: 0,
        },
        player2Score: {
            type: Number,
            default: 0,
        },
        drawCount: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

schema.plugin(mongooseHidden(), {
    hidden: {
        _id: false,
        createdAt: false,
        updatedAt: false,
    },
});

const History = model<IHistory>("History", schema);

export default History;
