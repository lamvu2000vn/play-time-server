import mongoose, {Document, Schema, Types} from "mongoose";
import mongooseHidden from "mongoose-hidden";

export interface IUser extends Document {
    _id: Types.ObjectId;
    username: string;
    password: string;
    name: string;
    avatarUrl: string;
    socketId: string;
    coin: number;
    status: number;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema: Schema = new Schema<IUser>(
    {
        username: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        avatarUrl: {
            type: String,
            required: true,
        },
        socketId: {
            type: String,
            required: false,
            default: null,
            index: true,
        },
        coin: {
            type: Number,
            required: true,
            default: 0,
        },
        status: {
            type: Number,
            required: true,
            default: 1,
            index: true,
        },
    },
    {
        timestamps: true,
    }
);

UserSchema.plugin(mongooseHidden(), {
    hidden: {
        _id: false,
        username: true,
        password: true,
        status: true,
        createdAt: true,
        updatedAt: true,
    },
});

const User = mongoose.model<IUser>("User", UserSchema);

export default User;
