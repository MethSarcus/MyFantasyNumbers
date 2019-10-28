class SleeperPlayer implements Player {
    public firstName: string;
    public lastName: string;
    public eligibleSlots: number[];
    public score: any;
    public projectedScore: any;
    public position: any;
    public realTeamID: any;
    public playerID: any;
    public weekNumber: any;
    public lineupSlotID: number;
    public espnID: any;

    constructor(playerID: string, weekNumber: number, lineupSlotID: number) {
        this.espnID = playerID;
        this.playerID = playerID;
        this.score = 0;
        this.projectedScore = 0;
        this.weekNumber = weekNumber;
        if (undefined !== lineupSlotID) {
            this.lineupSlotID = lineupSlotID;
        }
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
