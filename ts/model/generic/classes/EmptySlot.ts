class EmptySlot implements Player {
    public eligibleSlots = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 88];
    public score = 0;
    public weekNumber: number;
    public lineupSlotID: number;
    public firstName = "Empty";
    public lastName = "Slot";
    public actualScore = 0;
    public projectedScore = 0;
    public position = "EMPTY";
    public realTeamID = -1;
    public jerseyNumber = -1;
    public espnID = "-1";
    public playerID = "-1";
    public isEligible: (slot: number) => true;
    constructor(lineupSlotID: number) {
        this.lineupSlotID = lineupSlotID;
    }
}
