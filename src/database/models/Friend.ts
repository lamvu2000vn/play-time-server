import {model, Schema, Types} from "mongoose";

interface IFriend {
    _id: Types.ObjectId;
    requesterId: Types.ObjectId;
    requesteeId: Types.ObjectId;
    requestStatus: string;
    acceptDate: Date;
    createdAt: Date;
    updatedAt: Date;
}

const schema = new Schema<IFriend>(
    {
        requesterId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        requesteeId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        requestStatus: {
            type: String,
            required: true,
            enum: ["waiting", "accepted"],
        },
        acceptDate: {
            type: Date,
            required: false,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

const Friend = model<IFriend>("Friend", schema);

export default Friend;
