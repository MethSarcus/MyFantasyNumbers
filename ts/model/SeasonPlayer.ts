class SeasonPlayer {
    public firstName: string;
    public lastName: string;
    public eligibleSlots: any;
    public seasonScore: number;
    public projectedSeasonScore: number;
    public position: any;
    public realTeamID: number;
    public playerID: number;
    public weeksPlayed: number;
    public averageScore: number;
    public scores: [[number, number]];
    constructor(player: Player) {
        this.firstName = player.firstName;
        this.lastName = player.lastName;
        this.eligibleSlots = player.eligibleSlots;
        this.seasonScore = player.score;
        this.projectedSeasonScore = player.projectedScore;
        this.position = player.position;
        this.realTeamID = player.realTeamID;
        this.playerID = player.playerID;
        this.weeksPlayed = 1;
        this.averageScore = player.score;
        this.scores = [[player.score, player.weekNumber]];
    }

    public addPerformance(player: Player) {
        this.weeksPlayed += 1;
        this.seasonScore += player.score;
        this.projectedSeasonScore += player.projectedScore;
        this.averageScore = roundToHundred(this.seasonScore / this.weeksPlayed);
        this.scores.push([player.score, player.weekNumber]);
    }

    public getScores(): number[] {
        var points = [];
        this.scores.forEach(tup => {
            points.push(tup[0]);
        });

        return points;
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
