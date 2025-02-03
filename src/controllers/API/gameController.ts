import {Request, Response} from "express";
import {getApiResponse} from "../../helpers/utils/utils";
import {Game} from "../../database/models";
import GameStatistics from "../../database/models/GameStatistics";
import {IUser} from "../../database/models/User";

export const getGameInfo = async (req: Request, res: Response) => {
    try {
        const name = req.query.name || null;
        const id = req.query.id || req.params.id || null;

        if (!name && !id) {
            res.json(getApiResponse(400, "Missing data"));
            return;
        }

        if (id) {
            const gameInfo = await Game.findOne({_id: id, status: 1});
            res.json(getApiResponse(200, "ok", gameInfo));
            return;
        }

        if (name) {
            const gameInfo = await Game.findOne({
                $or: [{alternativeName: name}, {name}],
                status: 1,
            });
            res.json(getApiResponse(200, "ok", gameInfo));
            return;
        }
    } catch (err: unknown) {
        res.status(500).json(getApiResponse(500, err instanceof Error ? err.message : "Internal Server Error"));
    }
};

export const getAllGameInfo = async (req: Request, res: Response) => {
    try {
        const allGame = await Game.find({status: 1});

        res.json(getApiResponse(200, "ok", allGame));
    } catch (err: unknown) {
        res.status(500).json(getApiResponse(500, err instanceof Error ? err.message : "Internal Server Error"));
    }
};

export const getGameRanking = async (req: Request, res: Response) => {
    try {
        const gameId = req.params.id;
        const limit = parseInt(req.query.limit as string) || 50;

        const gameInfo = await Game.findById(gameId);

        if (!gameInfo) {
            res.json(getApiResponse(404, "Game not found"));
            return;
        }

        const ranking = await GameStatistics.find({gameId, numOfWin: {$gt: 0}})
            .sort({numOfWin: -1})
            .limit(limit)
            .populate<{userId: IUser}>("userId");

        const filteredRanking = ranking.map((item) => ({
            user: item.userId,
            totalScore: item.totalScore,
            numOfWin: item.numOfWin,
            numOfLose: item.numOfLose,
            numOfDraw: item.numOfDraw,
        }));

        const response = {
            gameInfo,
            ranking: filteredRanking,
        };

        res.json(getApiResponse(200, "ok", response));
    } catch (err: unknown) {
        res.status(500).json(getApiResponse(500, err instanceof Error ? err.message : "Internal Server Error"));
    }
};
