import {Server, Socket} from "socket.io";
import {Game, History, User} from "../database/models";
import WaitingRoom, {IWaitingRoom} from "../database/models/WaitingRoom";
import {handleMatchResults} from "../helpers/utils/handleMatchResults";
import {IGame} from "../database/models/Game";
import {
    FifteenPuzzlePlayerMovePayload,
    IAcceptPlayAgainRequestPayload,
    ICancelLookingForQuickMatch,
    ICreateNewRoomPayload,
    IJoinRoomPayload,
    ILeaveRoomPayload,
    IMatchDrawnPayload,
    IRejectPlayAgainRequestPayload,
    IRequestPlayAgainPayload,
    ISendMessageInGamePayload,
    ITicTacToePlayerMovePayload,
    IWSResponse,
} from "../helpers/shared/interfaces/wsInterfaces";
import {Types} from "mongoose";
import {GameRequirements, IMatchStatistics} from "../helpers/shared/interfaces/interfaces";
import {getMatchInfo} from "../helpers/utils/getMatchInfo";
import {checkPlayerWin} from "../helpers/utils/games/fifteenPuzzleUtils";
import MatchTimeHandler from "./MatchTimeHandler";
import {ticTacToeMatchResults} from "../helpers/utils/ticTacToeMatchResults";
import {
    MemoryFinishTheMatchPayload,
    MemoryFlipCardUpPayload,
} from "../helpers/shared/interfaces/games/memoryInterfaces";

type CallbackFunc<D> = (response: IWSResponse<D>) => void;

export default class SocketHandler {
    constructor(private io: Server, private socket: Socket, private matchTimeHandler: MatchTimeHandler) {
        this.socket.on("createNewRoom", this.handleCreateNewRoom);
        this.socket.on("cancelLookingForQuickMatch", this.handleCancelLookingForQuickMatch);
        this.socket.on("leaveRoom", this.handleLeaveRoom);
        this.socket.on("joinRoom", this.handleJoinRoom);
        this.socket.on("readyForQuickMatch", this.handleReadyForQuickMatch);
        this.socket.on("matchDrawn", this.handleMatchDrawn);
        this.socket.on("sendMessageInGame", this.handleSendMessageInGame);
        this.socket.on("requestPlayAgain", this.handleRequestPlayAgain);
        this.socket.on("rejectPlayAgainRequest", this.handleRejectPlayAgainRequest);
        this.socket.on("acceptPlayAgainRequest", this.handleAcceptPlayAgainRequest);

        // Tic-tac-toe game methods
        this.socket.on("ticTacToePlayerMove", this.ticTacToeHandlePlayerMove);

        // 15 puzzle game methods
        this.socket.on("fifteenPuzzlePlayerMove", this.fifteenPuzzleHandlePlayerMove);

        // Memory game methods
        this.socket.on("memoryFlipCardUp", this.memoryHandleFlipCardUp);
        this.socket.on("memoryFinishTheMatch", this.memoryHandleFinishTheMatch);
    }

    private get defaultSuccessCallback(): IWSResponse<object> {
        return {
            status: "ok",
            message: "Success",
            data: {},
        };
    }

    private defaultErrorCallback(error: Error | unknown): IWSResponse<object> {
        return {
            status: "not ok",
            message: error instanceof Error ? error.message : "Internal server error",
            data: {},
        };
    }

    private emitWithAck = async <D>(event: string, to: string, data?: D): Promise<IWSResponse<object>[]> => {
        return [...(await this.io.to(to).timeout(10000).emitWithAck(event, data))];
    };

    private handleCreateNewRoom = async (payload: ICreateNewRoomPayload, callback: CallbackFunc<object>) => {
        try {
            const {hostId, gameId, gameSetup, type} = payload;

            const gameExists = await Game.findById(gameId);

            if (!gameExists) {
                return callback({
                    status: "not ok",
                    message: "Game not found",
                    data: {},
                });
            }

            const createNewWaitingRoom = async () => {
                return await WaitingRoom.create({
                    hostId,
                    gameId,
                    gameSetup: JSON.stringify(gameSetup),
                    type,
                });
            };

            let roomId: string, newWaitingRoom: IWaitingRoom;

            if (type === "PlayWithFriend") {
                const newDoc = await createNewWaitingRoom();

                newWaitingRoom = newDoc.toJSON();
                roomId = newWaitingRoom._id.toString();
            } else {
                const waitingRoom = await WaitingRoom.findOne({
                    hostId: {
                        $ne: null,
                    },
                    joinerId: {
                        $eq: null,
                    },
                    gameId,
                    type,
                });

                if (!waitingRoom) {
                    const newDoc = await createNewWaitingRoom();

                    newWaitingRoom = newDoc.toJSON();
                    roomId = newWaitingRoom._id.toString();
                } else {
                    waitingRoom.joinerId = new Types.ObjectId(hostId);
                    waitingRoom.matchStatus = "progressing";
                    await waitingRoom.save();

                    roomId = waitingRoom._id.toString();
                    newWaitingRoom = waitingRoom.toJSON();
                }
            }

            this.socket.join(roomId);

            callback({
                status: "ok",
                message: "Success",
                data: newWaitingRoom,
            });

            if (this.io.sockets.adapter.rooms.get(roomId)?.size === 2) {
                this.emitWithAck("quickMatchFounded", roomId, newWaitingRoom);
            }
        } catch (error) {
            console.log("🚀 ~ SocketHandler ~ handleCreateNewGame ~ error:", error);

            return callback({
                status: "not ok",
                message: error instanceof Error ? error.message : "Internal server error",
                data: {},
            });
        }
    };

    private handleCancelLookingForQuickMatch = async (
        payload: ICancelLookingForQuickMatch,
        callback: CallbackFunc<object>
    ) => {
        try {
            const {roomId, userId} = payload;

            await WaitingRoom.findOneAndDelete({_id: roomId, hostId: userId});

            callback(this.defaultSuccessCallback);
        } catch (error) {
            console.log("🚀 ~ SocketHandler ~ error:", error);

            return callback({
                status: "not ok",
                message: error instanceof Error ? error.message : "Internal server error",
                data: {},
            });
        }
    };

    private handleLeaveRoom = async (payload: ILeaveRoomPayload, callback: CallbackFunc<object>) => {
        try {
            const {roomId, leaverId} = payload;

            if (!this.socket.rooms.has(roomId)) {
                return callback({
                    status: "not ok",
                    message: "Room not found",
                    data: {},
                });
            }

            const waitingRoom = await WaitingRoom.findById(roomId).populate<{gameId: IGame}>("gameId");

            // The game started and in progressing
            if (waitingRoom && waitingRoom.joinerId && waitingRoom.matchStatus === "progressing") {
                const {hostId, joinerId} = waitingRoom;
                const winnerId = hostId.equals(leaverId) ? joinerId.toString() : hostId.toString();
                const matchStatistics = await handleMatchResults(roomId, winnerId, waitingRoom);

                await this.emitWithAck("opponentLeavedMatch", roomId, {
                    leaverId,
                    matchStatistics,
                });

                this.matchTimeHandler.end(roomId);
            }

            this.socket.leave(roomId);

            await WaitingRoom.findByIdAndDelete(roomId);

            callback(this.defaultSuccessCallback);
        } catch (error) {
            console.log("🚀 ~ SocketHandler ~ handleLeaveRoom= ~ error:", error);
            return callback({
                status: "not ok",
                message: error instanceof Error ? error.message : "Internal server error",
                data: {},
            });
        }
    };

    private handleJoinRoom = async (payload: IJoinRoomPayload, callback: CallbackFunc<object>) => {
        try {
            const {roomId, userId, availWidth} = payload;
            const [user, waitingRoom] = await Promise.all([User.findById(userId), WaitingRoom.findById(roomId)]);

            if (!user) {
                return callback({
                    status: "not ok",
                    message: "User not found",
                    data: {},
                });
            }

            if (
                !waitingRoom ||
                waitingRoom.matchStatus ||
                (waitingRoom.joinerId && !waitingRoom.joinerId._id.equals(user._id))
            ) {
                return callback({
                    status: "not ok",
                    message: "Room not found",
                    data: {},
                });
            }

            const game = await Game.findById(waitingRoom.gameId);

            const gameRequirements = game!.requirement
                ? JSON.parse(game!.requirement)
                : (null as GameRequirements | null);

            if (gameRequirements && availWidth < gameRequirements.screen.minWidth) {
                return callback({
                    status: "not ok",
                    message: "Screen size not supported",
                    data: {},
                });
            }

            this.socket.join(roomId);
            waitingRoom.joinerId = user._id;
            waitingRoom.matchStatus = "progressing";
            await waitingRoom.save();

            callback({
                status: "ok",
                message: "Success",
                data: {},
            });

            const responses = await this.emitWithAck("joinedRoom", roomId);

            if (responses.every((res) => res.status === "ok")) {
                const matchInfo = await getMatchInfo(waitingRoom);

                await this.emitWithAck("startTheGame", roomId, matchInfo);

                const countDownRes = await this.emitWithAck("startCountDown", roomId);

                if (countDownRes.every((res) => res.status === "ok")) {
                    this.matchTimeHandler.register(matchInfo);
                    this.matchTimeHandler.start(matchInfo.roomId);
                }
            }
        } catch (error) {
            console.log("🚀 ~ SocketHandler ~ handleJoinRoom= ~ error:", error);

            return callback({
                status: "not ok",
                message: error instanceof Error ? error.message : "Internal server error",
                data: {},
            });
        }
    };

    private handleReadyForQuickMatch = async (payload: {roomId: string}, callback: CallbackFunc<object>) => {
        try {
            const {roomId} = payload;

            const waitingRoom = await WaitingRoom.findById(roomId);

            if (!waitingRoom || !this.io.sockets.adapter.rooms.has(roomId)) {
                return callback({
                    status: "not ok",
                    message: "Room not found",
                    data: {},
                });
            }

            callback(this.defaultSuccessCallback);

            const responses = await this.emitWithAck("joinedRoom", roomId);

            if (responses.every((res) => res.status === "ok")) {
                const matchInfo = await getMatchInfo(waitingRoom);

                await this.emitWithAck("startTheGame", roomId, matchInfo);
            }
        } catch (error) {
            console.log("🚀 ~ SocketHandler ~ handleReadyForQuickMatch= ~ error:", error);

            return callback({
                status: "not ok",
                message: error instanceof Error ? error.message : "Internal server error",
                data: {},
            });
        }
    };

    private handleMatchDrawn = async (payload: IMatchDrawnPayload, callback: CallbackFunc<IMatchStatistics | null>) => {
        try {
            const {roomId} = payload;

            const matchStatistics = await handleMatchResults(roomId);

            this.matchTimeHandler.end(roomId);

            callback({
                status: "ok",
                message: "Success",
                data: matchStatistics,
            });
        } catch (error) {
            console.log("🚀 ~ SocketHandler ~ handleMatchDrawn= ~ error:", error);

            return callback({
                status: "not ok",
                message: error instanceof Error ? error.message : "Internal server error",
                data: {},
            });
        }
    };

    private handleSendMessageInGame = async (payload: ISendMessageInGamePayload, callback: CallbackFunc<object>) => {
        try {
            const {message, roomId} = payload;

            if (!this.io.sockets.adapter.rooms.has(roomId)) throw new Error("Room not found");

            callback(this.defaultSuccessCallback);

            await this.emitWithAck("receiveMessageInGame", roomId, message);
        } catch (error) {
            console.log("🚀 ~ SocketHandler ~ error:", error);
            callback({
                status: "not ok",
                message: error instanceof Error ? error.message : "Internal server error",
                data: {},
            });
        }
    };

    private handleRequestPlayAgain = async (payload: IRequestPlayAgainPayload, callback: CallbackFunc<object>) => {
        try {
            const {requesterId, roomId} = payload;

            const [waitingRoom, history, requester] = await Promise.all([
                WaitingRoom.findById(roomId),
                History.findOne({roomId}),
                User.findById(requesterId),
            ]);

            if (!waitingRoom) throw new Error("Room not found");

            if (!history || !requester) throw new Error("Request error");

            callback(this.defaultSuccessCallback);

            await this.emitWithAck("wantToPlayAgain", roomId, {
                requester,
            });
        } catch (error) {
            console.log("🚀 ~ SocketHandler ~ handleRequestPlayAgain= ~ error:", error);

            return callback({
                status: "not ok",
                message: error instanceof Error ? error.message : "Internal server error",
                data: {},
            });
        }
    };

    private handleAcceptPlayAgainRequest = async (
        payload: IAcceptPlayAgainRequestPayload,
        callback: CallbackFunc<object>
    ) => {
        try {
            const {roomId} = payload;

            const waitingRoom = await WaitingRoom.findById(roomId);

            if (!waitingRoom) throw new Error("Room not found");

            waitingRoom.matchStatus = "progressing";

            const matchInfo = await getMatchInfo(waitingRoom);
            await waitingRoom.save();

            callback(this.defaultSuccessCallback);

            await this.emitWithAck("startTheGame", roomId, matchInfo);

            const countDownRes = await this.emitWithAck("startCountDown", roomId);

            if (countDownRes.every((res) => res.status === "ok")) {
                this.matchTimeHandler.register(matchInfo);
                this.matchTimeHandler.start(matchInfo.roomId);
            }
        } catch (error) {
            console.log("🚀 ~ SocketHandler ~ handleRequestPlayAgain= ~ error:", error);

            return callback({
                status: "not ok",
                message: error instanceof Error ? error.message : "Internal server error",
                data: {},
            });
        }
    };

    private handleRejectPlayAgainRequest = async (
        payload: IRejectPlayAgainRequestPayload,
        callback: CallbackFunc<object>
    ) => {
        try {
            const {roomId} = payload;

            const waitingRoom = await WaitingRoom.findById(roomId);

            if (!waitingRoom) throw new Error("Room not found");

            callback(this.defaultSuccessCallback);

            await this.emitWithAck("rejectedPlayAgainRequest", roomId);
        } catch (error) {
            console.log("🚀 ~ SocketHandler ~ handleRequestPlayAgain= ~ error:", error);

            return callback({
                status: "not ok",
                message: error instanceof Error ? error.message : "Internal server error",
                data: {},
            });
        }
    };

    // ================================== START TIC TAC TOE =================================
    private ticTacToeHandlePlayerMove = async (
        payload: ITicTacToePlayerMovePayload,
        callback: CallbackFunc<object>
    ) => {
        try {
            const {playerId, playerMoves, position, roomId, newBoardMatrix} = payload;

            const matchResults = ticTacToeMatchResults([...playerMoves, position], newBoardMatrix);
            let matchStatistics: IMatchStatistics | null = null;

            if (matchResults.results) {
                matchStatistics = await handleMatchResults(
                    roomId,
                    matchResults.results === "win" ? playerId : undefined
                );
                this.matchTimeHandler.end(roomId);
            } else {
                this.matchTimeHandler.reset(roomId);
            }

            const playerMovedPayload = {
                playerId,
                position,
                matchResults,
                matchStatistics,
                newBoardMatrix,
            };

            callback({
                status: "ok",
                message: "Success",
                data: {},
            });

            await this.emitWithAck("ticTacToePlayerMoved", roomId, playerMovedPayload);
        } catch (error) {
            console.log("🚀 ~ SocketHandler ~ error:", error);

            return callback({
                status: "not ok",
                message: error instanceof Error ? error.message : "Internal server error",
                data: {},
            });
        }
    };
    // ================================== END TIC TAC TOE =================================

    // ================================== START FIFTEEN PUZZLE =================================
    private fifteenPuzzleHandlePlayerMove = async (
        payload: FifteenPuzzlePlayerMovePayload,
        callback: CallbackFunc<object>
    ) => {
        try {
            const {boardMatrix, playerId, roomId} = payload;

            const isPlayerMovedWin = checkPlayerWin(boardMatrix);
            let matchStatistics: IMatchStatistics | null = null;

            if (isPlayerMovedWin) {
                matchStatistics = await handleMatchResults(roomId, playerId);
                this.matchTimeHandler.end(roomId);
            }

            callback({
                status: "ok",
                message: "Success",
                data: {
                    isWin: isPlayerMovedWin,
                    matchStatistics: isPlayerMovedWin ? matchStatistics! : null,
                },
            });

            await this.emitWithAck("fifteenPuzzleOpponentBoardUpdated", roomId, {
                playerMovedId: playerId,
                boardMatrix,
                isOpponentWin: isPlayerMovedWin,
                matchStatistics: isPlayerMovedWin ? matchStatistics! : null,
            });
        } catch (error) {
            console.log("🚀 ~ SocketHandler ~ fifteenPuzzleHandlePlayerMove= ~ error:", error);

            return callback({
                status: "not ok",
                message: error instanceof Error ? error.message : "Internal server error",
                data: {},
            });
        }
    };
    // ================================== END FIFTEEN PUZZLE =================================

    // ================================== START MEMORY =================================
    private memoryHandleFlipCardUp = async (payload: MemoryFlipCardUpPayload, callback: CallbackFunc<object>) => {
        try {
            const {roomId} = payload;

            callback({
                status: "ok",
                message: "Success",
                data: {},
            });

            await this.emitWithAck("memoryFlipCardUp", roomId, payload);
        } catch (error) {
            console.log("🚀 ~ SocketHandler ~ memoryHandleFlipCardUp= ~ error:", error);

            return callback({
                status: "not ok",
                message: error instanceof Error ? error.message : "Internal server error",
                data: {},
            });
        }
    };

    private memoryHandleFinishTheMatch = async (
        payload: MemoryFinishTheMatchPayload,
        callback: CallbackFunc<object>
    ) => {
        try {
            const {roomId, playerId, numOfMyCards, numOfOpponentCards} = payload;

            const waitingRoom = await WaitingRoom.findById(roomId).populate<{gameId: IGame}>("gameId");

            if (!waitingRoom) throw new Error("Room not found");

            const opponentId = waitingRoom.hostId.equals(playerId)
                ? waitingRoom.joinerId.toString()
                : waitingRoom.hostId.toString();
            const winnerId: string | undefined =
                numOfMyCards > numOfOpponentCards
                    ? playerId
                    : numOfMyCards < numOfOpponentCards
                    ? opponentId
                    : undefined;

            const matchStatistics = await handleMatchResults(roomId, winnerId, waitingRoom);
            this.matchTimeHandler.end(roomId);

            callback(this.defaultSuccessCallback);

            await this.emitWithAck("memoryMatchResults", roomId, {
                winnerId,
                matchStatistics,
            });
        } catch (error) {
            console.log("🚀 ~ SocketHandler ~ error:", error);
            return callback(this.defaultErrorCallback(error));
        }
    };
    // ================================== END MEMORY =================================
}
