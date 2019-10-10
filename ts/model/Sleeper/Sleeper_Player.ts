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

    constructor(playerID: number) {
        this.playerID = playerID;
    }

    isEligible: (slot: number) => boolean;
}