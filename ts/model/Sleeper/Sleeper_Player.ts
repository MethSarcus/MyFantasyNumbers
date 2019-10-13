class Sleeper_Player implements Player {
    firstName: string;
    lastName: string;
    eligibleSlots: any;
    score: any;
    projectedScore: any;
    position: any;
    realTeamID: any;
    playerID: any;
    weekNumber: any;
    lineupSlotID: any;

    constructor(playerID: string) {
        this.playerID = playerID;
        this.score = 0;
        this.projectedScore = 0;
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

    public assignAttributes(attributes: Sleeper_Player_Library_Entry) {
        
    }
}