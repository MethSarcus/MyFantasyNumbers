var PowerRanks = /** @class */ (function () {
    function PowerRanks(weeks) {
        this.weeks = new Map();
        this.addWeeks(weeks);
    }
    PowerRanks.prototype.addWeek = function (week) {
        var weeklyPowerRanks = new WeekPowerRanks();
        week.matchups.forEach(function (matchup) {
            weeklyPowerRanks.addMatchup(matchup);
        });
        weeklyPowerRanks.setRanks();
        this.weeks.set(week.weekNumber, weeklyPowerRanks);
    };
    PowerRanks.prototype.addWeeks = function (allWeeks) {
        var _this = this;
        allWeeks.forEach(function (week) {
            _this.addWeek(week);
        });
    };
    return PowerRanks;
}());
//# sourceMappingURL=PowerRanks.js.map