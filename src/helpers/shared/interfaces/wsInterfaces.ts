import {IGameInfoResponse, IPlayerInfo, IUserInfo} from "./interfaces";
import {
    ChatType,
    FifteenPuzzleBoardMatrix,
    GameName,
    PlayerTurn,
    TicTacToeBoardMatrix,
    Position,
    WaitingRoomType,
    MemoryTheme,
} from "../types";
import {MemoryCard} from "./games/memoryInterfaces";

export interface IWSResponse<D> {
    status: "ok" | "not ok";
    message: string;
    data: D;
}

export interface IJoinRoomPayload {
    roomId: string;
    userId: string;
    availWidth: number;
}

export interface ILeaveRoomPayload {
    roomId: string;
    leaverId: string;
}

export interface ICancelLookingForQuickMatch {
    roomId: string;
    userId: string;
}

export interface IRequestPlayAgainPayload {
    requesterId: string;
    roomId: string;
}

export interface IAcceptPlayAgainRequestPayload {
    requesterId: string;
    requesteeId: string;
    roomId: string;
}

export interface IRejectPlayAgainRequestPayload {
    rejecterId: string;
    requesterId: string;
    roomId: string;
}

export interface IMatchDrawnPayload {
    roomId: string;
    gameId: string;
}

export interface IChatContent {
    sender: IUserInfo;
    type: ChatType;
    content: string;
}

export interface ISendMessageInGamePayload {
    roomId: string;
    message: IChatContent;
}

export interface TicTacToeDetails {
    xPlayerId: string;
    oPlayerId: string;
    firstTurnId: string;
}

export interface FifteenPuzzleDetails {
    hostBoardMatrix: FifteenPuzzleBoardMatrix;
    joinerBoardMatrix: FifteenPuzzleBoardMatrix;
}

export interface MemoryDetails {
    cards: MemoryCard[];
    firstTurnId: string;
}

export interface IMatchInfoPayload<Details = object, GameSetup = object> {
    game: {
        info: IGameInfoResponse;
        details: Details;
        gameSetup: GameSetup;
    };
    roomId: string;
    hostInfo: IPlayerInfo;
    joinerInfo: IPlayerInfo;
}

export interface TicTacToeMatchResults {
    results: "win" | "draw" | null;
    moves: Position[];
}

export interface ITicTacToePlayerMovePayload {
    roomId: string;
    playerId: string;
    position: Position;
    playerMoves: Position[];
    newBoardMatrix: TicTacToeBoardMatrix;
}

export interface ITicTacToeTimeoutData {
    currentTurnId: string;
}

export interface ITimeoutPayload {
    roomId: string;
    data: object;
}

export interface ITicTacToeGameSetup {
    boardSize: "3x3" | "5x5";
    turnTime: number;
    firstTurn: PlayerTurn;
}

export interface IMemoryGameSetup {
    theme: MemoryTheme;
    numOfCards: number;
    matchTime: number;
}

export interface IFifteenPuzzleGameSetup {
    matchTime: number;
}

export interface ICreateNewRoomPayload {
    hostId: string;
    gameId: string;
    gameSetup: ITicTacToeGameSetup | IMemoryGameSetup | IFifteenPuzzleGameSetup;
    type: WaitingRoomType;
}

export interface FifteenPuzzlePlayerMovePayload {
    roomId: string;
    playerId: string;
    boardMatrix: FifteenPuzzleBoardMatrix;
}

export interface DataWhenTimeOut {
    gameName: GameName;
    data: {
        currentTurnId?: string;
        playerId?: string;
        numOfMyCards?: number;
        numOfOpponentCards?: number;
    };
}
