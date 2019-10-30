var ESPNTeam = (function () {
    function ESPNTeam(teamID, players, activeLineupSlots, opponentID) {
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
        this.potentialPoints = this.getTeamScore(getOptimalLineup(activeLineupSlots, this.lineup.concat(this.bench, this.IR)));
        this.projectedScore = this.getProjectedScore(this.lineup);
        var gutArray = this.getGutPoints(activeLineupSlots);
        this.gutDifference = gutArray[0];
        this.gutPlayers = gutArray[1];
    }
    ESPNTeam.prototype.getTeamScore = function (players) {
        var score = 0;
        for (var i in players) {
            if (players[i].score !== null && players[i].score !== undefined) {
                score += players[i].score;
            }
        }
        return score;
    };
    ESPNTeam.prototype.getProjectedScore = function (players) {
        var projectedScore = 0;
        for (var i in players) {
            if (players[i].projectedScore !== null && players[i].projectedScore !== undefined) {
                projectedScore += players[i].projectedScore;
            }
        }
        return projectedScore;
    };
    ESPNTeam.prototype.getMVP = function () {
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
    ESPNTeam.prototype.getLVP = function () {
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
    ESPNTeam.prototype.getPositionalPlayers = function (position) {
        var players = this.lineup;
        var positionPlayers = [];
        players.forEach(function (player) {
            if (player.position === position) {
                positionPlayers.push(player);
            }
        });
        return positionPlayers;
    };
    ESPNTeam.prototype.getEligibleSlotPlayers = function (slot) {
        var players = this.lineup.concat(this.bench, this.IR);
        var eligiblePlayers = players.filter(function (it) {
            return it.isEligible(slot) === true;
        });
        return eligiblePlayers;
    };
    ESPNTeam.prototype.getEligibleSlotBenchPlayers = function (slot) {
        var players = this.bench.concat(this.IR);
        var eligiblePlayers = players.filter(function (it) {
            return it.isEligible(slot) === true;
        });
        return eligiblePlayers;
    };
    ESPNTeam.prototype.getGutPoints = function (activeLineupSlots) {
        var players = this.getProjectedLinupPlayerDifference(activeLineupSlots);
        var gutPlayers = players[0];
        var satPlayers = players[1];
        var diff = this.getTeamScore(gutPlayers) - this.getTeamScore(satPlayers);
        var playerNum = gutPlayers.length;
        return [diff, playerNum];
    };
    ESPNTeam.prototype.getProjectedLinupPlayerDifference = function (activeLineupSlots) {
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
    return ESPNTeam;
}());
//# sourceMappingURL=ESPNTeam.js.map