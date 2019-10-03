class Stats {
    public wins: number;
    public losses: number;
    public ties: number;
    public rank: number;
    public powerRank: number;
    public powerWins: number;
    public powerLosses: number;
    public powerTies: number;
    public potentialPowerWins: number;
    public potentialPowerLosses: number;
    public potentialPowerTies: number;
    public potentialPowerRank: number;
    public finalStanding: number;
    public gutPoints: number;
    public gutPlayersPlayed: number;
    public gutWins: number;
    public gutLosses: number;
    public averageMOV: number;
    public averageMOD: number;
    public pf: number;
    public pa: number;
    public pp: number;
    public longestWinStreak: number;
    public standardDeviation: number;
    public weeklyAverage: number;
    public gameLostDueToSingleChoice: number;
    public choicesThatCouldHaveWonMatchup: number;
    public positionalStats: PositionalStats;
    constructor(finalStanding) {
        this.finalStanding = finalStanding;
        this.wins = 0;
        this.losses = 0;
        this.ties = 0;
        this.powerWins = 0;
        this.powerLosses = 0;
        this.powerTies = 0;
        this.potentialPowerWins = 0;
        this.potentialPowerLosses = 0;
        this.potentialPowerTies = 0;
        this.pf = 0;
        this.pa = 0;
        this.pp = 0;
        this.choicesThatCouldHaveWonMatchup = 0;
        this.gameLostDueToSingleChoice = 0;
        this.gutPlayersPlayed = 0;
        this.gutPoints = 0;
        this.gutWins = 0;
        this.gutLosses = 0;
        this.rank = 0;
        this.averageMOD = 0;
        this.averageMOV = 0;
    }

    public getWinPct(): number {
        if (this.wins == 0) {
            return 0.00;
        } else {
            return roundToHundred(this.wins / (this.wins + this.losses + this.ties));
        }
    }
    public getPowerWinPct(): number {
        if (this.powerWins == 0) {
            return 0.00;
        } else {
            return roundToHundred(this.powerWins / (this.powerWins + this.powerLosses + this.powerTies));
        }
    }

    public getPotentialPowerWinPct(): number {
        if (this.potentialPowerWins == 0) {
            return 0.00;
        } else {
            return roundToHundred(this.potentialPowerWins / (this.potentialPowerWins + this.potentialPowerLosses + this.potentialPowerTies));
        }
    }

    public roundStats(): void {
        this.pf = roundToHundred(this.pf);
        this.pa = roundToHundred(this.pa);
        this.pp = roundToHundred(this.pp);
    }

    public getEfficiency(): number {
        return this.pf/this.pp;
    }
}
