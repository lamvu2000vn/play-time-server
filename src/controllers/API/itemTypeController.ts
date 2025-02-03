import {Request, Response} from "express";
import {Item, ItemType} from "../../database/models";
import {getApiResponse} from "../../helpers/utils/utils";

export const getAll = async (req: Request, res: Response) => {
    try {
        const data = await ItemType.find({status: 1});

        res.json(getApiResponse(200, "Success", data));
    } catch (err: unknown) {
        res.status(500).json(getApiResponse(500, err instanceof Error ? err.message : "Internal Server Error"));
    }
};

export const findById = async (req: Request, res: Response) => {
    try {
        const data = await ItemType.findById(req.params.id);

        res.json(getApiResponse(200, "Success", data));
    } catch (err: unknown) {
        res.status(500).json(getApiResponse(500, err instanceof Error ? err.message : "Internal Server Error"));
    }
};

export const getAllItems = async (req: Request, res: Response) => {
    try {
        const itemType = await ItemType.findById(req.params.id);

        if (!itemType) {
            res.json(getApiResponse(400, "Item type not found"));
            return;
        }

        const data = await Item.find({typeId: itemType._id});

        res.json(getApiResponse(200, "Success", data));
    } catch (err: unknown) {
        res.status(500).json(getApiResponse(500, err instanceof Error ? err.message : "Internal Server Error"));
    }
};
