var SleeperMember = (function () {
    function SleeperMember(memberID, memberName, teamName, teamAvatar) {
        this.memberID = memberID;
        this.name = memberName;
        this.teamName = teamName;
        if (teamName) {
            this.teamAbbrev = teamName.substring(0, 4);
        }
        else {
            this.teamAbbrev = memberName.substring(0, 4);
        }
        if (teamAvatar !== undefined && teamAvatar !== null) {
            this.logoURL = "https://sleepercdn.com/avatars/" + teamAvatar.toString();
        }
        else {
            this.logoURL = "../../../assets/user1.png";
        }
    }
    SleeperMember.prototype.getPictureURL = function () {
        return this.logoURL;
    };
    SleeperMember.prototype.setAdvancedStats = function (weeks) {
        var _this = this;
        var scores = [];
        weeks.forEach(function (week) {
            scores.push(week.getTeam(_this.teamID).score);
        });
        this.stats.standardDeviation = calcStandardDeviation(scores);
        this.stats.weeklyAverage = getMean(scores);
    };
    SleeperMember.prototype.nameToString = function () {
        return this.name;
    };
    SleeperMember.prototype.ownerToString = function () {
        return this.teamName;
    };
    SleeperMember.prototype.recordToString = function () {
        if (this.stats.ties !== 0) {
            return this.stats.wins + "-" + this.stats.losses + "-" + this.stats.ties;
        }
        else {
            return this.stats.wins + "-" + this.stats.losses;
        }
    };
    SleeperMember.prototype.rankToString = function () {
        return ordinal_suffix_of(this.stats.rank);
    };
    SleeperMember.prototype.finishToString = function () {
        return ordinal_suffix_of(this.stats.finalStanding);
    };
    SleeperMember.prototype.powerRecordToString = function () {
        return this.stats.powerWins + "-" + this.stats.powerLosses;
    };
    SleeperMember.prototype.potentialPowerRecordToString = function () {
        return this.stats.potentialPowerWins + "-" + this.stats.potentialPowerLosses;
    };
    return SleeperMember;
}());
//# sourceMappingURL=SleeperMember.js.map