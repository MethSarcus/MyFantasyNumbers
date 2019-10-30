var ESPNMember = (function () {
    function ESPNMember(memberID, firstName, lastName, teamLocation, teamNickname, teamAbbrev, division, teamID, logoURL, transactions, stats) {
        this.memberID = memberID;
        this.firstName = firstName;
        this.lastName = lastName;
        this.teamLocation = teamLocation;
        this.teamNickname = teamNickname;
        this.teamAbbrev = teamAbbrev;
        this.division = division;
        this.teamID = teamID;
        this.logoURL = logoURL;
        this.transactions = transactions;
        this.stats = stats;
    }
    ESPNMember.prototype.setAdvancedStats = function (weeks) {
        var _this = this;
        var scores = [];
        weeks.forEach(function (week) {
            scores.push(week.getTeam(_this.teamID).score);
        });
        this.stats.standardDeviation = calcStandardDeviation(scores);
        this.stats.weeklyAverage = getMean(scores);
    };
    ESPNMember.prototype.nameToString = function () {
        return this.teamLocation + " " + this.teamNickname;
    };
    ESPNMember.prototype.ownerToString = function () {
        return this.firstName + " " + this.lastName;
    };
    ESPNMember.prototype.recordToString = function () {
        if (this.stats.ties !== 0) {
            return this.stats.wins + "-" + this.stats.losses + "-" + this.stats.ties;
        }
        else {
            return this.stats.wins + "-" + this.stats.losses;
        }
    };
    ESPNMember.prototype.rankToString = function () {
        return ordinal_suffix_of(this.stats.rank);
    };
    ESPNMember.prototype.finishToString = function () {
        return ordinal_suffix_of(this.stats.finalStanding);
    };
    ESPNMember.prototype.powerRecordToString = function () {
        return this.stats.powerWins + "-" + this.stats.powerLosses;
    };
    ESPNMember.prototype.potentialPowerRecordToString = function () {
        return this.stats.potentialPowerWins + "-" + this.stats.potentialPowerLosses;
    };
    return ESPNMember;
}());
//# sourceMappingURL=ESPNMember.js.map