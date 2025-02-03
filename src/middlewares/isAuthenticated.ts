import jwt from "jsonwebtoken";
import {getApiResponse} from "../helpers/utils/utils";
import {NextFunction, Request, Response} from "express";
import {BlacklistToken} from "../database/models";

export default async function isAuthenticated(req: Request, res: Response, next: NextFunction) {
    const accessToken = req.headers.authorization?.split(" ")[1];

    if (!accessToken) {
        res.status(401).json(getApiResponse(401, "Unauthorized"));
        return;
    }

    if (await BlacklistToken.findOne({accessToken})) {
        res.status(401).json(getApiResponse(401, "Unauthorized"));
        return;
    }

    jwt.verify(accessToken, process.env.JWT_SECRET!, (err, _) => {
        if (err) {
            res.status(401).json(getApiResponse(401, "Unauthorized"));
            return;
        }

        next();
    });
}
