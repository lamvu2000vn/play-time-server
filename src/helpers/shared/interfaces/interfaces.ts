import {IGameStatisticsResponse} from "./apiInterfaces";

export interface IPlayerInfo {
    _id: string;
    name: string;
    avatarUrl: string;
    score: number;
}

export interface IUserInfo {
    _id: string;
    name: string;
    avatarUrl: string;
    socketId: string | null;
    coin: number;
}

export interface IGameScoreConfiguration {
    winScore: number;
    loseScore: number;
    drawScore: number;
    maxLevel: number;
    winCoin: number;
    loseCoin: number;
    drawCoin: number;
}

export interface IGameInfoResponse {
    _id: string;
    name: string;
    alternativeName: string;
    imageUrl: string;
}

export interface IScoreStatistics {
    currentLevel: number;
    scoreForNextLevel: number;
    scoreNeededToNextLevel: number;
}

export interface IPlayerMatchStatistics {
    gameStatistics: IGameStatisticsResponse;
    newCoin: number;
}

export interface IMatchStatistics {
    [key: string]: IPlayerMatchStatistics;
}

export interface IJwtDecoded {
    userId: string;
    iat: number;
    exp: number;
}

export interface GameRequirements {
    screen: {
        minWidth: number;
    };
}
