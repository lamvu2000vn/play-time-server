export type PlayerTurn = "random" | "me" | "opponent";
export type Position = {
    x: number;
    y: number;
};
export type TicTacToePlayerType = "XPlayer" | "OPlayer";
export type TicTacToeBoardSize = "3x3" | "5x5";
export type MatchStatus = "progressing" | "completed";
export type GameName = "Tic Tac Toe" | "15 Puzzle" | "Memory";
export type ChatType = "message" | "sticker";
export type WaitingRoomType = "PlayWithFriend" | "Random";
export type FifteenPuzzleBoardMatrix = Array<Array<number>>;
export type TicTacToeBoardMatrix = Array<Array<TicTacToePlayerType | null>>;
export type MemoryTheme = "fruit" | "animal";
