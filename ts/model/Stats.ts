class Stats {
    public wins: number;
    public losses: number;
    public ties: number;
    public powerRank: number;
    public powerWins: number;
    public powerLosses: number;
    public finalStanding: number;
    public pf: number;
    public pa: number;
    public pp: number;
    public longestWinStreak: number;
    public standardDeviation: number;
    public weeklyAverage: number;
    constructor(finalStanding) {
        this.finalStanding = finalStanding;
        this.wins = 0;
        this.losses = 0;
        this.ties = 0;
        this.powerWins = 0;
        this.powerLosses = 0;
        this.pf = 0;
        this.pa = 0;
        this.pp = 0;
    }

    public getWinPct(): number {
        if (this.wins == 0) {
            return 0.00;
        } else {
            return roundToHundred(this.wins / (this.wins + this.losses));
        }
    }

    public roundStats(): void {
        this.pf = roundToHundred(this.pf);
        this.pa = roundToHundred(this.pa);
        this.pp = roundToHundred(this.pp);
    }
}
