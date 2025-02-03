import {IGameInfoResponse, IScoreStatistics} from "./interfaces";

export interface IApiResponse {
    status: number;
    message: string;
    data: object;
}

export interface IGameStatisticsResponse {
    gameInfo: IGameInfoResponse;
    totalScore: number;
    numOfWin: number;
    numOfLose: number;
    numOfDraw: number;
    scoreStatistics: IScoreStatistics;
}

export interface ICreateUserPayload {
    name: string;
    password: string;
    socketId: string;
}

export interface ILoginPayload {
    username: string;
    password: string;
    rememberMe: boolean;
}

export interface IRegisterUserPayload {
    username: string;
    password: string;
    name: string;
}

export interface IUserIdentifyPayload {
    userId: string;
    refreshToken: string;
}
