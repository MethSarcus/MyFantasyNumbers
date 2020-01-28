class PositionInfo {
    public excludedLineupSlots: number[] = [];
    public excludedPositions: number[] = [];

    constructor(public activeLineupSlots: number[][], public lineupSlots: number[][], public lineupOrder: string[]) {
    }

    public getPositions(): string[] {
        const positions = this.activeLineupSlots.filter((slot) => {
            return slot[0] !== 1 && slot[0] !== 3 && slot[0] !== 5 && slot[0] !== 7 && slot[0] !== 23 && slot[0] !== 25;
        }).map((slot) => {
            return intToPosition.get(slot[0]);
        });
        return positions;
    }
}