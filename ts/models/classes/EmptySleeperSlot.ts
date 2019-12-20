class EmptySleeperSlot implements SleeperPlayer {
    public eligibleSlots = Array.from(Array(100).keys());
    public score = 0;
    public weekNumber: number;
    public lineupSlotID: number;
    public currentSlot: string[];
    public firstName = "Empty";
    public lastName = "Slot";
    public actualScore = 0;
    public projectedScore = 0;
    public position = "EMPTY";
    public realTeamID = "-1";
    public jerseyNumber = -1;
    public espnID = "-1";
    public playerID = "-1";
    public isEligible: (slot: number) => true;
    constructor(positions: string[]) {
        this.currentSlot = positions;
    }
}
