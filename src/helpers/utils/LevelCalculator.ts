export default class LevelCalculator {
    private static baseScore = 50;

    /**
     * Tính tổng điểm cần thiết để đạt một cấp độ cụ thể
     * @param level Cấp độ
     * @returns Tổng điểm cần để đạt cấp độ đó
     */
    static scoreForLevel(level: number): number {
        return (this.baseScore * (level - 1) * level) / 2;
    }

    /**
     * Tính cấp độ hiện tại dựa trên tổng điểm
     * @param score Tổng điểm hiện tại
     * @returns Cấp độ hiện tại
     */
    static currentLevel(score: number): number {
        let level = 1;

        while (this.scoreForLevel(level + 1) <= score) {
            level++;
        }

        return level;
    }

    /**
     * Tính số điểm cần thêm để lên cấp tiếp theo
     * @param score Tổng điểm hiện tại
     * @returns Số điểm cần thêm để đạt cấp độ tiếp theo
     */
    static scoreNeededToNextLevel(score: number): number {
        const level = this.currentLevel(score);
        const scoreForNextLevel = this.scoreForLevel(level + 1);
        return scoreForNextLevel - score;
    }
}
