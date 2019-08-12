class Stats {
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
    getWinPct() {
        if (this.wins === 0) {
            return 0.00;
        }
        else {
            return this.wins / (this.wins + this.losses);
        }
    }
}
//# sourceMappingURL=Stats.js.map