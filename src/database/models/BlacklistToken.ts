import {model, Schema, Types} from "mongoose";

interface IBlacklistToken {
    _id: Types.ObjectId;
    accessToken: string;
}

const BlacklistTokenSchema = new Schema({
    accessToken: {
        type: String,
        required: true,
        index: true,
    },
});

const BlacklistToken = model<IBlacklistToken>("BlacklistToken", BlacklistTokenSchema);

export default BlacklistToken;
