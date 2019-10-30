var SleeperTeam = (function () {
    function SleeperTeam(lineup, totalRoster, score, matchupID, rosterID, opponentID, weekNumber, lineupOrder) {
        this.lineup = lineup.map(function (playerID, index) {
            return new SleeperPlayer(playerID, weekNumber, positionToInt.get(lineupOrder[index]));
        });
        this.bench = totalRoster.filter(function (element) {
            return !lineup.includes(element);
        }).map(function (playerID) {
            return new SleeperPlayer(playerID, weekNumber, positionToInt.get("BN"));
        });
        this.IR = [];
        this.opponentID = opponentID;
        this.teamID = rosterID;
        this.score = score;
        this.matchupID = matchupID;
    }
    SleeperTeam.prototype.getTeamScore = function (players) {
        var score = 0;
        for (var i in players) {
            if (players[i].score != null && players[i].score !== undefined) {
                score += players[i].score;
            }
        }
        return score;
    };
    SleeperTeam.prototype.getProjectedScore = function (players) {
        var projectedScore = 0;
        for (var i in players) {
            if (players[i].projectedScore != null && players[i].projectedScore !== undefined) {
                projectedScore += players[i].projectedScore;
            }
        }
        return projectedScore;
    };
    SleeperTeam.prototype.getMVP = function () {
        var mvp = this.lineup[0];
        var mvpScore = 0;
        this.lineup.forEach(function (player) {
            if (player.score > mvpScore) {
                mvpScore = player.score;
                mvp = player;
            }
        });
        return mvp;
    };
    SleeperTeam.prototype.getLVP = function () {
        var lvp = this.lineup[0];
        var lvpScore = this.lineup[0].score;
        this.lineup.forEach(function (player) {
            if (player.score > lvpScore) {
                lvpScore = player.score;
                lvp = player;
            }
        });
        return lvp;
    };
    SleeperTeam.prototype.getPositionalPlayers = function (position) {
        var players = this.lineup;
        var positionPlayers = [];
        players.forEach(function (player) {
            if (player.position === position) {
                positionPlayers.push(player);
            }
        });
        return positionPlayers;
    };
    SleeperTeam.prototype.getEligibleSlotPlayers = function (slot) {
        var players = this.lineup.concat(this.bench, this.IR);
        var eligiblePlayers = players.filter(function (it) {
            return it.isEligible(slot) === true;
        });
        return eligiblePlayers;
    };
    SleeperTeam.prototype.getEligibleSlotBenchPlayers = function (slot) {
        var players = this.bench.concat(this.IR);
        var eligiblePlayers = players.filter(function (it) {
            return it.isEligible(slot) === true;
        });
        return eligiblePlayers;
    };
    SleeperTeam.prototype.getGutPoints = function (activeLineupSlots) {
        var players = this.getProjectedLinupPlayerDifference(activeLineupSlots);
        var gutPlayers = players[0];
        var satPlayers = players[1];
        var diff = this.getTeamScore(gutPlayers) - this.getTeamScore(satPlayers);
        var playerNum = gutPlayers.length;
        return [diff, playerNum];
    };
    SleeperTeam.prototype.getProjectedLinupPlayerDifference = function (activeLineupSlots) {
        var _this = this;
        var gutPlayers = [];
        var satPlayers = [];
        var projectedLineup = getOptimalProjectedLineup(activeLineupSlots, this.lineup.concat(this.bench, this.IR));
        this.lineup.forEach(function (player) {
            if (!includesPlayer(player, projectedLineup)) {
                gutPlayers.push(player);
            }
        });
        projectedLineup.forEach(function (player) {
            if (!includesPlayer(player, _this.lineup)) {
                satPlayers.push(player);
            }
        });
        return [gutPlayers, satPlayers];
    };
    SleeperTeam.prototype.setTeamMetrics = function (activeLineupSlots) {
        this.potentialPoints = this.getTeamScore(getOptimalLineup(activeLineupSlots, this.lineup.concat(this.bench, this.IR)));
        this.projectedScore = this.getProjectedScore(this.lineup);
        var gutArray = this.getGutPoints(activeLineupSlots);
        this.gutDifference = gutArray[0];
        this.gutPlayers = gutArray[1];
    };
    return SleeperTeam;
}());
//# sourceMappingURL=SleeperTeam.js.map