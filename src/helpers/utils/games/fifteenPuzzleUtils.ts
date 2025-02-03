import {FifteenPuzzleBoardMatrix} from "../../shared/types";
import {getRandomIndexFromArray} from "../utils";

export const MAX_X_POSITION: number = 3;
export const MAX_Y_POSITION: number = 3;

export const generateBoardMatrix = (): Array<Array<number>> => {
    const numbersAvailable = Array.from({length: 16}, (_, i) => i);

    const boardMatrix = Array.from({length: 4}, () =>
        Array.from({length: 4}, () => {
            const index = getRandomIndexFromArray<number>(numbersAvailable);
            const number = numbersAvailable[index];
            numbersAvailable.splice(index, 1);
            return number;
        })
    );

    return boardMatrix;
};

export const checkPlayerWin = (boardMatrix: FifteenPuzzleBoardMatrix): boolean => {
    const correctNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0];
    const flat = [...boardMatrix].flat();
    return correctNumbers.every((value, index) => value === flat[index]);
};
