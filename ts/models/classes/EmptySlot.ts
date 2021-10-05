class EmptySlot implements Player {
    public eligibleSlots = Array.from(Array(100).keys());
    public score = 0;
    public weekNumber: number;
    public lineupSlotID: number;
    public firstName = "Empty";
    public lastName = "Slot";
    public actualScore = 0;
    public projectedScore = 0;
    public position = "EMPTY";
    public positions = ["EMPTY"];
    public realTeamID = "-1";
    public jerseyNumber = -1;
    public espnID = "-1";
    public playerID = "-1";
    public isEligible: (slot: number) => true;
    constructor(lineupSlotID: number) {
        this.lineupSlotID = lineupSlotID;
    }
}
