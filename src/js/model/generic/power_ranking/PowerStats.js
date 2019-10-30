var PowerStats = (function () {
    function PowerStats(teamID, weekNumber, pf, pp, projected) {
        this.teamID = teamID;
        this.weekNumber = weekNumber;
        this.wins = 0;
        this.losses = 0;
        this.ties = 0;
        this.pf = pf;
        this.projected = projected;
        this.pp = pp;
    }
    return PowerStats;
}());
//# sourceMappingURL=PowerStats.js.map