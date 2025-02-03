import {Server} from "socket.io";
import {
    DataWhenTimeOut,
    FifteenPuzzleDetails,
    IFifteenPuzzleGameSetup,
    IMatchInfoPayload,
    TicTacToeDetails,
    ITicTacToeGameSetup,
    IWSResponse,
    MemoryDetails,
    IMemoryGameSetup,
} from "../helpers/shared/interfaces/wsInterfaces";
import {GameName} from "../helpers/shared/types";
import {handleMatchResults} from "../helpers/utils/handleMatchResults";
import WaitingRoom from "../database/models/WaitingRoom";
import {IGame} from "../database/models/Game";
import {IMatchStatistics} from "../helpers/shared/interfaces/interfaces";

interface MatchTime {
    duration: number;
    currentSeconds: number;
    timeInterval: NodeJS.Timeout | null;
}

type MatchTimeState = Record<string, MatchTime>;

export default class MatchTimeHandler {
    private static instance: MatchTimeHandler | null = null;
    private matchTimeState: MatchTimeState;

    constructor(private io: Server) {
        this.matchTimeState = {};
    }

    private emitWithAck = async <D, R = object>(event: string, to: string, data?: D): Promise<IWSResponse<R>[]> => {
        return [...(await this.io.to(to).timeout(10000).emitWithAck(event, data))];
    };

    public static getInstance(io: Server): MatchTimeHandler {
        if (!this.instance) {
            return new MatchTimeHandler(io);
        }

        return this.instance;
    }

    public register(matchInfo: IMatchInfoPayload): string {
        const {roomId, game} = matchInfo;

        switch (game.info.name as GameName) {
            case "Tic Tac Toe": {
                const copy = structuredClone(matchInfo) as IMatchInfoPayload<TicTacToeDetails, ITicTacToeGameSetup>;

                const duration = copy.game.gameSetup.turnTime;

                this.matchTimeState[roomId] = {
                    duration,
                    currentSeconds: duration,
                    timeInterval: null,
                };

                break;
            }
            case "15 Puzzle": {
                const copy = structuredClone(matchInfo) as IMatchInfoPayload<
                    FifteenPuzzleDetails,
                    IFifteenPuzzleGameSetup
                >;

                const duration = copy.game.gameSetup.matchTime;

                this.matchTimeState[roomId] = {
                    duration,
                    currentSeconds: duration,
                    timeInterval: null,
                };
                break;
            }
            case "Memory": {
                const copy = structuredClone(matchInfo) as IMatchInfoPayload<MemoryDetails, IMemoryGameSetup>;

                const duration = copy.game.gameSetup.matchTime;

                this.matchTimeState[roomId] = {
                    duration,
                    currentSeconds: duration,
                    timeInterval: null,
                };
                break;
            }
            default:
                break;
        }

        return roomId;
    }

    public start = (roomId: string): void => {
        const matchTime = this.matchTimeState[roomId];

        matchTime.timeInterval = setInterval(() => {
            if (matchTime.currentSeconds === 0) {
                this.end(roomId);
                this.handleTimeOut(roomId);
            } else {
                this.io.to(roomId).emit("matchTimeUpdated", {seconds: matchTime.currentSeconds});
                matchTime.currentSeconds--;
            }
        }, 1000);
    };

    public reset = (roomId: string): void => {
        const matchTime = this.matchTimeState[roomId];

        if (matchTime.timeInterval) clearInterval(matchTime.timeInterval);

        matchTime.currentSeconds = matchTime.duration;

        return this.start(roomId);
    };

    public end = (roomId: string): void => {
        const matchTime = this.matchTimeState[roomId];

        if (matchTime.timeInterval) clearTimeout(matchTime.timeInterval);

        delete this.matchTimeState[roomId];
    };

    private handleTimeOut = async (roomId: string): Promise<void> => {
        const responses = await this.emitWithAck<undefined, DataWhenTimeOut>("matchTimeOut", roomId);

        if (responses.every((res) => res.status === "ok")) {
            const {data} = responses[0];
            const {data: timeOutData, gameName} = data;

            let matchStatistics: IMatchStatistics | null = null;
            let winnerId: string | undefined = undefined;

            switch (gameName) {
                case "Tic Tac Toe": {
                    const {currentTurnId} = timeOutData;
                    const waitingRoom = await WaitingRoom.findById(roomId).populate<{gameId: IGame}>("gameId");

                    if (waitingRoom) {
                        winnerId = waitingRoom?.hostId.equals(currentTurnId)
                            ? waitingRoom.joinerId.toString()
                            : waitingRoom?.hostId.toString();
                        matchStatistics = await handleMatchResults(roomId, winnerId, waitingRoom);
                    }

                    break;
                }
                case "Memory": {
                    const {numOfMyCards, numOfOpponentCards, playerId} = timeOutData;

                    const waitingRoom = await WaitingRoom.findById(roomId).populate<{gameId: IGame}>("gameId");

                    if (!waitingRoom) throw new Error("Room not found");

                    const opponentId = waitingRoom.hostId.equals(playerId)
                        ? waitingRoom.joinerId.toString()
                        : waitingRoom.hostId.toString();
                    winnerId =
                        numOfMyCards! > numOfOpponentCards!
                            ? playerId
                            : numOfMyCards! < numOfOpponentCards!
                            ? opponentId
                            : undefined;

                    matchStatistics = await handleMatchResults(roomId, winnerId, waitingRoom);

                    break;
                }
                default:
                    matchStatistics = await handleMatchResults(roomId);
            }

            this.io.to(roomId).emit("matchStatistics", {
                matchStatistics,
                winnerId,
            });
        }
    };
}
