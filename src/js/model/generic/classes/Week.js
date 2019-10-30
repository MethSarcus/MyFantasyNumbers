var Week = (function () {
    function Week(weekNumber, isPlayoffs, matchups) {
        this.weekNumber = weekNumber;
        this.isPlayoffs = isPlayoffs;
        this.matchups = matchups;
    }
    Week.prototype.getTeam = function (teamID) {
        var team;
        this.matchups.forEach(function (matchup) {
            if (matchup.hasTeam(teamID)) {
                team = matchup.getTeam(teamID);
            }
        });
        return team;
    };
    Week.prototype.getTeamScoreFinish = function (teamID) {
        var finish = 1;
        var score = this.getTeam(teamID).score;
        this.matchups.forEach(function (matchup) {
            if (matchup.home.teamID !== teamID) {
                if (matchup.home.score > score) {
                    finish += 1;
                }
            }
            if (!matchup.byeWeek) {
                if (matchup.away.score > score && matchup.away.teamID !== teamID) {
                    finish += 1;
                }
            }
        });
        return finish;
    };
    Week.prototype.getTeamMatchup = function (teamID) {
        var match;
        this.matchups.forEach(function (matchup) {
            if (matchup.hasTeam(teamID)) {
                match = matchup;
            }
        });
        return match;
    };
    Week.prototype.getWeekAverage = function () {
        var weekScore = 0;
        var numMatches = 0;
        this.matchups.forEach(function (matchup) {
            if (matchup.byeWeek) {
                weekScore += matchup.home.score;
                numMatches += 1;
            }
            else {
                weekScore += matchup.home.score + matchup.away.score;
                numMatches += 2;
            }
        });
        return roundToHundred(weekScore / numMatches);
    };
    Week.prototype.getBestPositionPlayer = function (position) {
        var positionPlayers = [];
        this.matchups.forEach(function (matchup) {
            positionPlayers = positionPlayers.concat(matchup.home.getPositionalPlayers(position));
            if (!matchup.byeWeek) {
                positionPlayers = positionPlayers.concat(matchup.away.getPositionalPlayers(position));
            }
        });
        var bestPlayer = positionPlayers[0];
        positionPlayers.forEach(function (player) {
            if (player.score > bestPlayer.score) {
                bestPlayer = player;
            }
        });
        return bestPlayer;
    };
    return Week;
}());
//# sourceMappingURL=Week.js.map