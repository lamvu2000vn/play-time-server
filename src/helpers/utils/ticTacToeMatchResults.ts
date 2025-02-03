import {TicTacToeMatchResults} from "../shared/interfaces/wsInterfaces";
import {TicTacToeBoardMatrix, Position} from "../shared/types";

export const ticTacToeMatchResults = (
    playerMoves: Position[],
    boardMatrix: TicTacToeBoardMatrix
): TicTacToeMatchResults => {
    const flatBoardMatrix = [...boardMatrix.flat()];
    const boardMatrixLength = flatBoardMatrix.length;
    const numberMovesToWin = boardMatrixLength === 9 ? 3 : boardMatrixLength === 25 ? 4 : 9999;

    if (playerMoves.length < numberMovesToWin) return {results: null, moves: []};

    const playerMoveSet = new Set(playerMoves.map((pos) => `${pos.y}-${pos.x}`));

    const checkLine = (position: Position, dx: number, dy: number): Position[] => {
        const moves: Position[] = [];

        for (let i = 1; i < numberMovesToWin; i++) {
            const newX = position.x + i * dx;
            const newY = position.y + i * dy;
            const move = `${newY}-${newX}`;

            if (!playerMoveSet.has(move)) break;

            moves.push({
                x: newX,
                y: newY,
            });
        }

        return moves;
    };

    for (const position of playerMoves) {
        // Check all directions: left, right, up, down, diagonals
        const directions = [
            {name: "left", line: checkLine(position, -1, 0)},
            {name: "right", line: checkLine(position, 1, 0)},
            {name: "top", line: checkLine(position, 0, -1)},
            {name: "bottom", line: checkLine(position, 0, 1)},
            {name: "top-left", line: checkLine(position, -1, -1)},
            {name: "bottom-left", line: checkLine(position, -1, 1)},
            {name: "top-right", line: checkLine(position, 1, -1)},
            {name: "bottom-right", line: checkLine(position, 1, 1)},
        ];

        for (const {name, line} of directions) {
            if (line.length === numberMovesToWin - 1) {
                return {results: "win", moves: [position, ...line]};
            }
        }
    }

    if (flatBoardMatrix.indexOf(null) === -1) return {results: "draw", moves: []};

    return {results: null, moves: []};
};
