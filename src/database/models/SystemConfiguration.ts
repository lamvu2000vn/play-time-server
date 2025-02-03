import {model, Schema, Types} from "mongoose";

interface ISystemConfiguration {
    _id: Types.ObjectId;
    option: string;
    value: string;
}

const schema = new Schema<ISystemConfiguration>({
    option: {
        type: String,
        required: true,
        index: true,
    },
    value: {
        type: String,
        required: true,
    },
});

const SystemConfiguration = model<ISystemConfiguration>("SystemConfiguration", schema);

export default SystemConfiguration;
