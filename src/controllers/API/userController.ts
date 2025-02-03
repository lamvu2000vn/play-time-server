import {Request, Response} from "express";
import {History, PaidItem, User} from "../../database/models";
import {getApiResponse} from "../../helpers/utils/utils";
import GameStatistics, {IGameStatisticsModel} from "../../database/models/GameStatistics";
import LevelCalculator from "../../helpers/utils/LevelCalculator";
import {IGame} from "../../database/models/Game";
import {MergeType} from "mongoose";
import {IUser} from "../../database/models/User";
import {IGameStatisticsResponse} from "../../helpers/shared/interfaces/apiInterfaces";

export const getUserById = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = await User.findById(req.params.id);
        res.status(200).json(getApiResponse(200, "Success", user));
    } catch (err: unknown) {
        res.status(500).json(getApiResponse(500, err instanceof Error ? err.message : "Internal Server Error"));
    }
};

export const getPaidItems = async (req: Request, res: Response): Promise<void> => {
    try {
        const itemTypeId = req.query.typeId as string | undefined;
        const userId = req.params.id;

        if (!userId) {
            res.status(400).json(getApiResponse(400, "Invalid User ID"));
            return;
        }

        const user = await User.findById(userId);

        if (!user) {
            res.json(getApiResponse(404, "User not found"));
            return;
        }

        const results = await PaidItem.find({
            userId: user._id,
        }).populate({
            path: "itemId",
            match: itemTypeId ? {typeId: itemTypeId} : undefined,
            populate: {
                path: "typeId",
                model: "ItemType",
            },
        });

        const paidItems = results.filter((item) => item.itemId !== null);

        res.status(200).json(getApiResponse(200, "Success", paidItems));
    } catch (err: unknown) {
        res.status(500).json(getApiResponse(500, err instanceof Error ? err.message : "Internal Server Error"));
    }
};

export const getGameStatistic = async (req: Request, res: Response): Promise<void> => {
    try {
        const {userId, gameId} = req.params;
        const user = await User.findById(userId);

        if (!user) {
            res.json(getApiResponse(404, "User not found"));
            return;
        }

        const results = gameId
            ? await GameStatistics.findOne({
                  userId: user._id,
                  gameId,
              }).populate<{gameId: IGame}>("gameId")
            : await GameStatistics.find({
                  userId: user._id,
              }).populate<{gameId: IGame}>("gameId");

        if (!results || (Array.isArray(results) && !results.length)) {
            res.json(getApiResponse(404, "Game statistics not found"));
            return;
        }

        const getResponse = (
            result: MergeType<
                IGameStatisticsModel,
                {
                    gameId: IGame;
                }
            >
        ): IGameStatisticsResponse => {
            const currentLevel = LevelCalculator.currentLevel(result.totalScore);
            const scoreForNextLevel = LevelCalculator.scoreForLevel(currentLevel + 1);
            const scoreNeededToNextLevel = LevelCalculator.scoreNeededToNextLevel(result.totalScore);

            return {
                gameInfo: {
                    _id: result.gameId._id.toString(),
                    name: result.gameId.name,
                    alternativeName: result.gameId.alternativeName,
                    imageUrl: result.gameId.imageUrl,
                },
                totalScore: result.totalScore,
                numOfWin: result.numOfWin,
                numOfLose: result.numOfLose,
                numOfDraw: result.numOfDraw,
                scoreStatistics: {
                    currentLevel,
                    scoreForNextLevel,
                    scoreNeededToNextLevel,
                },
            };
        };

        const response = Array.isArray(results) ? results.map((result) => getResponse(result)) : getResponse(results);

        res.status(200).json(getApiResponse(200, "Success", response));
    } catch (err) {
        res.status(500).json(getApiResponse(500, err instanceof Error ? err.message : "Internal Server Error"));
    }
};

export const getHistory = async (req: Request, res: Response): Promise<void> => {
    try {
        const {userId, gameId} = req.params;

        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;

        const skip = (page - 1) * limit;

        const totalDocs = await History.countDocuments({gameId, $or: [{player1Id: userId}, {player2Id: userId}]});
        const totalPages = Math.ceil(totalDocs / limit);

        const history = await History.find({gameId, $or: [{player1Id: userId}, {player2Id: userId}]})
            .populate<{player1Id: IUser}>("player1Id")
            .populate<{player2Id: IUser}>("player2Id")
            .skip(skip)
            .limit(limit)
            .sort({createdAt: -1});

        const response = {
            history,
            currentPage: page,
            limit,
            totalPages,
            totalDocs,
        };

        res.status(200).json(getApiResponse(200, "Success", response));
    } catch (err) {
        res.status(500).json(getApiResponse(500, err instanceof Error ? err.message : "Internal Server Error"));
    }
};
