class ESPNPlayer implements Player {
    public firstName: string;
    public lastName: string;
    public eligibleSlots: number[];
    public score: number;
    public projectedScore: any;
    public position: string;
    public realTeamID: string;
    public espnID: string;
    public lineupSlotID: number;
    public weekNumber: number;
    public playerID: string;
    constructor(firstName: string, lastName: string, score: number, projectedScore: number,
                position: string, realTeamID: string, playerID: string, lineupSlotID: number, eligibleSlots: number[], weekNumber: number) {
        this.firstName = firstName;
        if (lastName === "D/ST") {
            this.lastName = "DEF";
        } else {
            this.lastName = lastName;
        }
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
