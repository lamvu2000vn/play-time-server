import {model, Schema, Types} from "mongoose";
import mongooseHidden from "mongoose-hidden";

interface IItem {
    _id: Types.ObjectId;
    typeId: Types.ObjectId;
    name: string;
    imageUrl: string;
    price: number;
    isDefault: boolean;
    status: number;
    createdAt: Date;
    updatedAt: Date;
}

const schema = new Schema<IItem>(
    {
        typeId: {
            type: Schema.Types.ObjectId,
            ref: "ItemType",
            required: true,
            index: true,
        },
        name: {
            type: String,
            required: true,
        },
        imageUrl: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        isDefault: {
            type: Boolean,
            required: true,
            default: false,
            index: true,
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
        status: true,
        createdAt: true,
        updatedAt: true,
    },
});

const Item = model<IItem>("Item", schema);

export default Item;
