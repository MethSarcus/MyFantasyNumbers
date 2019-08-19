class Player {
    public firstName: any;
    public lastName: any;
    public eligibleSlots: any;
    public score: any;
    public projectedScore: any;
    public position: any;
    public realTeamID: any;
    public playerID: any;
    public lineupSlotID: any;
    public weekNumber: any;
    constructor(firstName, lastName, score, projectedScore,
                position, realTeamID, playerID, lineupSlotID, eligibleSlots, weekNumber) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.eligibleSlots = eligibleSlots;
        this.score = score;
        this.projectedScore = projectedScore;
        this.position = position;
        this.realTeamID = realTeamID;
        this.playerID = playerID;
        this.lineupSlotID = lineupSlotID;
        this.weekNumber = weekNumber;
    }

    public isEligible(slot: number): boolean {
        var isEligible = false;
        this.eligibleSlots.forEach((eligibleSlot) => {
            if (eligibleSlot == slot) {
                isEligible = true;
            }
        });
        return isEligible;
    }
}
