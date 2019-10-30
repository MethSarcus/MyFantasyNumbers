var SleeperWeekStats = (function () {
    function SleeperWeekStats(projectedStats, stats, weekNumber) {
        this.stats = stats;
        this.projectedStats = projectedStats;
        this.weekNumber = weekNumber;
    }
    SleeperWeekStats.prototype.calculatePlayerScore = function (settings, player) {
        var playerStats = this.stats[player.playerID];
        if (playerStats !== undefined) {
            Object.keys(playerStats).forEach(function (statName) {
                if (settings.hasOwnProperty(statName)) {
                    player.score += settings[statName] * playerStats[statName];
                }
            });
        }
    };
    SleeperWeekStats.prototype.calculateProjectedPlayerScore = function (settings, player) {
        var playerProjectedStats = this.projectedStats[player.playerID];
        if (playerProjectedStats !== undefined) {
            Object.keys(playerProjectedStats).forEach(function (statName) {
                if (settings.hasOwnProperty(statName)) {
                    player.projectedScore += settings[statName] * playerProjectedStats[statName];
                }
            });
        }
    };
    return SleeperWeekStats;
}());
//# sourceMappingURL=SleeperWeekStats.js.map