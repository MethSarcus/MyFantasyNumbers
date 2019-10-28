class ESPNPlayer implements Player {
    public firstName: string;
    public lastName: string;
    public eligibleSlots: any;
    public score: any;
    public projectedScore: any;
    public position: any;
    public realTeamID: any;
    public espnID: string;
    public lineupSlotID: any;
    public weekNumber: number;
    public playerID: string;
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
        this.espnID = playerID;
    }

    public isEligible(slot: number): boolean {
        let isEligible = false;
        this.eligibleSlots.forEach((eligibleSlot) => {
            if (eligibleSlot === slot) {
                isEligible = true;
            }
        });
        return isEligible;
    }
}
