import {Document, model, Schema, Types} from "mongoose";
import mongooseHidden from "mongoose-hidden";

export interface IGameStatisticsModel extends Document {
    _id: Types.ObjectId;
    gameId: Types.ObjectId;
    userId: Types.ObjectId;
    totalScore: number;
    numOfWin: number;
    numOfLose: number;
    numOfDraw: number;
}

const schema = new Schema<IGameStatisticsModel>({
    gameId: {
        type: Schema.Types.ObjectId,
        ref: "Game",
        required: true,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    totalScore: {
        type: Number,
        required: true,
        default: 0,
    },
    numOfWin: {
        type: Number,
        required: true,
        default: 0,
    },
    numOfLose: {
        type: Number,
        required: true,
        default: 0,
    },
    numOfDraw: {
        type: Number,
        required: true,
        default: 0,
    },
});

schema.index({gameId: 1, userId: 1});

schema.plugin(mongooseHidden(), {
    hidden: {
        _id: true,
    },
});

const GameStatistics = model<IGameStatisticsModel>("GameStatistics", schema);

export default GameStatistics;
