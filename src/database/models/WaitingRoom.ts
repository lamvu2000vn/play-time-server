import {Document, model, Schema, Types} from "mongoose";
import mongooseHidden from "mongoose-hidden";
import {MatchStatus, WaitingRoomType} from "../../helpers/shared/types";

export interface IWaitingRoom extends Document {
    _id: Types.ObjectId;
    hostId: Types.ObjectId;
    joinerId: Types.ObjectId;
    gameId: Types.ObjectId;
    gameSetup: string;
    type: WaitingRoomType;
    matchStatus: MatchStatus | null;
}

const schema = new Schema<IWaitingRoom>({
    hostId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    joinerId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: false,
        default: null,
        index: true,
    },
    gameId: {
        type: Schema.Types.ObjectId,
        ref: "Game",
        required: true,
        index: true,
    },
    gameSetup: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
        index: true,
    },
    matchStatus: {
        type: String,
        required: false,
        default: null,
    },
});

schema.plugin(mongooseHidden(), {
    hidden: {
        _id: false,
    },
});

const WaitingRoom = model<IWaitingRoom>("WaitingRoom", schema);

export default WaitingRoom;
