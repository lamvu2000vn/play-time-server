import mongooseHidden from "mongoose-hidden";
import {model, Schema, Types} from "mongoose";

interface IItemType {
    _id: Types.ObjectId;
    name: string;
    alternativeName: string;
    imageUrl: string;
    status: number;
    createdAt: Date;
    updatedAt: Date;
}

const schema = new Schema<IItemType>(
    {
        name: {
            type: String,
            required: true,
        },
        alternativeName: {
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
        },
    },
    {
        timestamps: true,
    }
);

schema.plugin(mongooseHidden(), {
    hidden: {
        _id: false,
        createdAt: true,
        updatedAt: true,
        status: true,
    },
});

const ItemType = model<IItemType>("ItemType", schema);

export default ItemType;
