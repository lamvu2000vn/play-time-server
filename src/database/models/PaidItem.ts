import {model, Schema, Types} from "mongoose";
import mongooseHidden from "mongoose-hidden";

export interface IPaidItem {
    _id: Types.ObjectId;
    userId: Types.ObjectId;
    itemId: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const schema = new Schema<IPaidItem>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        itemId: {
            type: Schema.Types.ObjectId,
            ref: "Item",
            required: true,
            index: true,
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
    },
});

const PaidItem = model<IPaidItem>("PaidItem", schema);

export default PaidItem;
