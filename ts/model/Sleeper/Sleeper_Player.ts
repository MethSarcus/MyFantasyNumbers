class Sleeper_Player implements Player {
    firstName: string;
    lastName: string;
    eligibleSlots: number[];
    score: any;
    projectedScore: any;
    position: any;
    realTeamID: any;
    playerID: any;
    weekNumber: any;
    lineupSlotID: any;

    constructor(playerID: string, weekNumber: number, lineupSlotID: number) {
        this.playerID = playerID;
        this.score = 0;
        this.projectedScore = 0;
        this.weekNumber = weekNumber;
        this.lineupSlotID = parseInt(lineupSlotID.toString());
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