var WeekPowerRanks = /** @class */ (function () {
    function WeekPowerRanks() {
        this.powerStats = new Map();
    }
    WeekPowerRanks.prototype.addMatchup = function (matchup) {
        var homeTeam = matchup.home;
        this.powerStats.set(homeTeam.teamID, new PowerStats(homeTeam.teamID, matchup.weekNumber, homeTeam.score, homeTeam.projectedScore, homeTeam.potentialPoints));
        if (!matchup.byeWeek) {
            var awayTeam = matchup.away;
            this.powerStats.set(awayTeam.teamID, new PowerStats(awayTeam.teamID, matchup.weekNumber, awayTeam.score, awayTeam.projectedScore, awayTeam.potentialPoints));
        }
    };
    WeekPowerRanks.prototype.setRanks = function () {
        var _this = this;
        this.powerStats.forEach(function (powerStat) {
            _this.powerStats.forEach(function (innerStat) {
                if (powerStat.teamID != innerStat.teamID) {
                    if (powerStat.pf > innerStat.pf) {
                        powerStat.wins += 1;
                    }
                    else if (powerStat.pf < innerStat.pf) {
                        powerStat.losses += 1;
                    }
                    else {
                        powerStat.ties += 1;
                    }
                }
            });
        });
    };
    return WeekPowerRanks;
}());
//# sourceMappingURL=WeekPowerRanks.js.map