var Team = /** @class */ (function () {
    function Team(teamID, players, activeLineupSlots, opponentID) {
        var _this = this;
        this.lineup = [];
        this.bench = [];
        this.IR = [];
        this.opponentID = opponentID;
        players.forEach(function (player) {
            if (player.lineupSlotID === 21) {
                _this.IR.push(player);
            }
            else if (player.lineupSlotID === 20) {
                _this.bench.push(player);
            }
            else {
                _this.lineup.push(player);
            }
        });
        this.teamID = teamID;
        this.score = this.getTeamScore(this.lineup);
        this.potentialPoints = this.getTeamScore(this.getOptimalLineup(activeLineupSlots));
        this.projectedScore = this.getProjectedScore(this.lineup);
    }
    Team.prototype.getOptimalLineup = function (activeLineupSlots) {
        var rosterSlots = [];
        // tslint:disable-next-line: forin
        for (var i in activeLineupSlots) {
            for (var w = 0; w < activeLineupSlots[i][1]; w++) {
                rosterSlots.push(activeLineupSlots[i][0]);
            }
        }
        var optimalLineup = new Array();
        // tslint:disable-next-line: forin
        for (var x in rosterSlots) {
            var highScore = 0;
            var bestPlayer = null;
            var eligibleWeekPlayers = [];
            var players = this.lineup.concat(this.bench, this.IR);
            for (var y in players) {
                if (!includesPlayer(players[y], optimalLineup)) {
                    if (players[y].isEligible(rosterSlots[x])) {
                        eligibleWeekPlayers.push(players[y]);
                    }
                }
            }
            for (var z in eligibleWeekPlayers) {
                if (eligibleWeekPlayers[z].score > highScore) {
                    highScore = eligibleWeekPlayers[z].score;
                    bestPlayer = eligibleWeekPlayers[z];
                }
            }
            if (bestPlayer != null) {
                optimalLineup.push(bestPlayer);
                highScore = 0;
            }
        }
        return optimalLineup;
    };
    Team.prototype.getTeamScore = function (players) {
        var score = 0;
        for (var i in players) {
            if (players[i].score != null && players[i].score !== "undefined") {
                score += players[i].score;
            }
        }
        return score;
    };
    Team.prototype.getProjectedScore = function (players) {
        var projectedScore = 0;
        for (var i in players) {
            if (players[i].projectedScore != null && players[i].projectedScore !== "undefined") {
                this.projectedScore += players[i].projectedScore;
            }
        }
        return projectedScore;
    };
    return Team;
}());
//# sourceMappingURL=Team.js.map