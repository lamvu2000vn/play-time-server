import {MergeType, Types} from "mongoose";
import {History, SystemConfiguration, User} from "../../database/models";
import GameStatistics, {IGameStatisticsModel} from "../../database/models/GameStatistics";
import WaitingRoom, {IWaitingRoom} from "../../database/models/WaitingRoom";
import {IGameScoreConfiguration, IMatchStatistics} from "../shared/interfaces/interfaces";
import {IGame} from "../../database/models/Game";
import LevelCalculator from "./LevelCalculator";
import {MatchStatus} from "../shared/types";
import {IGameStatisticsResponse} from "../shared/interfaces/apiInterfaces";

const updateHistory = async (
    gameId: Types.ObjectId,
    player1Id: Types.ObjectId,
    player2Id: Types.ObjectId,
    roomId: Types.ObjectId,
    winnerId?: string
) => {
    const history = await History.findOne({roomId});

    if (!history) {
        return History.create({
            roomId,
            gameId,
            player1Id,
            player2Id,
            player1Score: player1Id.equals(winnerId) ? 1 : 0,
            player2Score: player2Id.equals(winnerId) ? 1 : 0,
            drawCount: !winnerId ? 1 : 0,
        });
    }

    history.player1Score += player1Id.equals(winnerId) ? 1 : 0;
    history.player2Score += player2Id.equals(winnerId) ? 1 : 0;
    history.drawCount += !winnerId ? 1 : 0;

    return history.save();
};

const updateGameStatistics = async (
    gameStatisticsDoc: IGameStatisticsModel,
    gameScoreConfiguration: IGameScoreConfiguration,
    winnerId?: string
): Promise<IGameStatisticsResponse> => {
    const {winScore, loseScore, drawScore} = gameScoreConfiguration;

    const isWinner = gameStatisticsDoc.userId.equals(winnerId);

    gameStatisticsDoc.totalScore += !winnerId ? drawScore : isWinner ? winScore : loseScore;
    gameStatisticsDoc.numOfWin += isWinner ? 1 : 0;
    gameStatisticsDoc.numOfLose += !isWinner ? 1 : 0;
    gameStatisticsDoc.numOfDraw += !winnerId ? 1 : 0;

    await gameStatisticsDoc.save();

    const result = await gameStatisticsDoc.populate<{gameId: IGame}>("gameId");

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

const updateUserCoin = async (
    userId: Types.ObjectId,
    gameScoreConfiguration: IGameScoreConfiguration,
    winnerId?: string
): Promise<number> => {
    const {winCoin, loseCoin, drawCoin} = gameScoreConfiguration;

    const user = await User.findById(userId);

    if (user) {
        user.coin += !winnerId ? drawCoin : user._id.equals(winnerId) ? winCoin : loseCoin;

        await user.save();

        return user.coin;
    }

    return 0;
};

const updateMatchStatus = async (
    waitingRoomDoc: MergeType<IWaitingRoom, {gameId: IGame}>,
    matchStatus: MatchStatus
) => {
    waitingRoomDoc.matchStatus = matchStatus;
    return waitingRoomDoc.save();
};

export const handleMatchResults = async (
    roomId: string,
    winnerId?: string,
    waitingRoomDoc?: MergeType<IWaitingRoom, {gameId: IGame}>
): Promise<IMatchStatistics> => {
    const waitingRoom = waitingRoomDoc
        ? waitingRoomDoc
        : await WaitingRoom.findById(roomId).populate<{gameId: IGame}>("gameId");

    if (!waitingRoom) throw new Error("Invalid data");

    const {gameId: gameInfo, hostId: player1Id, joinerId: player2Id} = waitingRoom;

    const [systemConfig, player1Statistics, player2Statistics] = await Promise.all([
        SystemConfiguration.findOne({option: "gameScore"}),
        GameStatistics.findOne({gameId: gameInfo._id, userId: player1Id}) as Promise<IGameStatisticsModel | null>,
        GameStatistics.findOne({gameId: gameInfo._id, userId: player2Id}) as Promise<IGameStatisticsModel | null>,
    ]);

    if (!systemConfig || !player1Statistics || !player2Statistics) throw new Error("Invalid data");

    const gameScoreConfiguration = JSON.parse(systemConfig.value) as IGameScoreConfiguration;

    const [newHistory, newPlayer1Statistics, newPlayer2Statistics, newPlayer1Coin, newPlayer2Coin, newWaitingRoom] =
        await Promise.all([
            updateHistory(gameInfo._id, player1Id, player2Id, waitingRoom._id, winnerId),
            updateGameStatistics(player1Statistics, gameScoreConfiguration, winnerId),
            updateGameStatistics(player2Statistics, gameScoreConfiguration, winnerId),
            updateUserCoin(player1Id, gameScoreConfiguration, winnerId),
            updateUserCoin(player2Id, gameScoreConfiguration, winnerId),
            updateMatchStatus(waitingRoom, "completed"),
        ]);

    return {
        [player1Id.toString()]: {
            gameStatistics: newPlayer1Statistics,
            newCoin: newPlayer1Coin,
        },
        [player2Id.toString()]: {
            gameStatistics: newPlayer2Statistics,
            newCoin: newPlayer2Coin,
        },
    };
};
