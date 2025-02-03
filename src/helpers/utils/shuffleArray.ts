export const shuffleArray = <T>(array: T[]): T[] => {
    for (let i = array.length - 1; i > 0; i--) {
        // Generate a random index between 0 and i (inclusive)
        const randomIndex = Math.floor(Math.random() * (i + 1));

        // Swap elements at i and randomIndex
        [array[i], array[randomIndex]] = [array[randomIndex], array[i]];
    }
    return array;
};
