import {Game, History, User} from "../../database/models";
import {IWaitingRoom} from "../../database/models/WaitingRoom";
import {
    FifteenPuzzleDetails,
    IMatchInfoPayload,
    TicTacToeDetails,
    ITicTacToeGameSetup,
    MemoryDetails,
    IMemoryGameSetup,
} from "../shared/interfaces/wsInterfaces";
import {generateBoardMatrix} from "./games/fifteenPuzzleUtils";
import {generateCards} from "./games/memoryUtils";
import {getRandomValueFromArray} from "./utils";

export const getMatchInfo = async (waitingRoom: IWaitingRoom): Promise<IMatchInfoPayload> => {
    const {hostId, joinerId, _id: roomId, gameId, gameSetup} = waitingRoom;

    const [gameInfo, history, hostInfo, joinerInfo] = await Promise.all([
        await Game.findById(gameId),
        await History.findOne({roomId: roomId}),
        await User.findById(hostId),
        await User.findById(joinerId),
    ]);

    if (!gameInfo) throw new Error("getMatchInfo(): Game not found");

    const gameSetupObj = JSON.parse(gameSetup);
    const playerIds = [hostId, joinerId];

    const matchInfoPayload: IMatchInfoPayload = {
        roomId: roomId.toString(),
        game: {
            info: {
                _id: gameInfo.id,
                name: gameInfo.name,
                alternativeName: gameInfo.alternativeName,
                imageUrl: gameInfo.imageUrl,
            },
            gameSetup: gameSetupObj,
            details: {},
        },
        hostInfo: {
            _id: hostInfo!._id.toString(),
            name: hostInfo!.name,
            avatarUrl: hostInfo!.avatarUrl,
            score: history ? history.player1Score : 0,
        },
        joinerInfo: {
            _id: joinerInfo!._id.toString(),
            name: joinerInfo!.name,
            avatarUrl: joinerInfo!.avatarUrl,
            score: history ? history.player2Score : 0,
        },
    };

    switch (gameInfo.name) {
        case "Tic Tac Toe": {
            const ticTacToeGameSetup = {...gameSetupObj} as ITicTacToeGameSetup;
            const {firstTurn} = ticTacToeGameSetup;

            const firstTurnId =
                firstTurn === "random"
                    ? getRandomValueFromArray([hostId, joinerId])
                    : firstTurn === "me"
                    ? hostId
                    : joinerId;

            const xPlayerId = getRandomValueFromArray(playerIds);
            const oPlayerId = playerIds.find((id) => id !== xPlayerId)!;

            const details = {
                xPlayerId: xPlayerId.toString(),
                oPlayerId: oPlayerId.toString(),
                firstTurnId: firstTurnId.toString(),
            } as TicTacToeDetails;

            matchInfoPayload.game.details = details;

            break;
        }
        case "15 Puzzle": {
            const details = {
                hostBoardMatrix: generateBoardMatrix(),
                joinerBoardMatrix: generateBoardMatrix(),
            } as FifteenPuzzleDetails;

            matchInfoPayload.game.details = details;

            break;
        }
        case "Memory": {
            const {theme, numOfCards} = {...gameSetupObj} as IMemoryGameSetup;

            const details = {
                cards: generateCards(numOfCards, theme),
                firstTurnId: getRandomValueFromArray([hostId, joinerId]).toString(),
            } as MemoryDetails;

            matchInfoPayload.game.details = details;

            break;
        }
        default:
            throw new Error("getMatchInfo(): Invalid game name");
    }

    return matchInfoPayload;
};
