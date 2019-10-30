var SeasonPlayer = (function () {
    function SeasonPlayer(player, platform) {
        this.firstName = player.firstName;
        this.lastName = player.lastName;
        this.eligibleSlots = player.eligibleSlots;
        this.seasonScore = player.score;
        this.projectedSeasonScore = player.projectedScore;
        this.position = player.position;
        this.realTeamID = player.realTeamID;
        this.playerID = player.playerID;
        this.espnID = player.espnID;
        this.weeksPlayed = 1;
        this.averageScore = player.score;
        this.scores = [[player.score, player.weekNumber]];
        if (platform === PLATFORM.SLEEPER) {
            this.pictureID = player.espnID;
        }
        else {
            this.pictureID = player.espnID;
        }
        this.setPictureURL();
    }
    SeasonPlayer.prototype.addPerformance = function (player) {
        this.weeksPlayed += 1;
        this.seasonScore += player.score;
        this.projectedSeasonScore += player.projectedScore;
        this.averageScore = roundToHundred(this.seasonScore / this.weeksPlayed);
        this.scores.push([player.score, player.weekNumber]);
    };
    SeasonPlayer.prototype.getScores = function () {
        var points = [];
        this.scores.forEach(function (tup) {
            points.push(tup[0]);
        });
        return points;
    };
    SeasonPlayer.prototype.isEligible = function (slot) {
        return this.eligibleSlots.includes(slot);
    };
    SeasonPlayer.prototype.setPictureURL = function () {
        if (this.position === "D/ST" || this.position === "DEF") {
            this.pictureURL = "http://a.espncdn.com/combiner/i?img=/i/teamlogos/NFL/500/" + getRealTeamInitials(this.realTeamID) + ".png&h=150&w=150";
        }
        else {
            this.pictureURL = "http://a.espncdn.com/i/headshots/nfl/players/full/" + this.pictureID + ".png";
        }
    };
    return SeasonPlayer;
}());
//# sourceMappingURL=SeasonPlayer.js.map