var Stats = /** @class */ (function () {
    function Stats(finalStanding) {
        this.finalStanding = finalStanding;
        this.wins = 0;
        this.losses = 0;
        this.ties = 0;
        this.powerWins = 0;
        this.powerLosses = 0;
        this.pf = 0;
        this.pa = 0;
        this.pp = 0;
        this.choicesThatCouldHaveWonMatchup = 0;
        this.gameLostDueToSingleChoice = 0;
    }
    Stats.prototype.getWinPct = function () {
        if (this.wins == 0) {
            return 0.00;
        }
        else {
            return roundToHundred(this.wins / (this.wins + this.losses + this.ties));
        }
    };
    Stats.prototype.roundStats = function () {
        this.pf = roundToHundred(this.pf);
        this.pa = roundToHundred(this.pa);
        this.pp = roundToHundred(this.pp);
    };
    Stats.prototype.getEfficiency = function () {
        return this.pf / this.pp;
    };
    return Stats;
}());
//# sourceMappingURL=Stats.js.map