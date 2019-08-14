var Player = /** @class */ (function () {
    function Player(firstName, lastName, score, projectedScore, position, realTeamID, playerID, lineupSlotID, eligibleSlots, weekNumber) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.eligibleSlots = eligibleSlots;
        this.score = score;
        this.projectedScore = projectedScore;
        this.position = position;
        this.realTeamID = realTeamID;
        this.playerID = playerID;
        this.lineupSlotID = lineupSlotID;
        this.weekNumber = weekNumber;
    }
    Player.prototype.isEligible = function (slot) {
        this.eligibleSlots.forEach(function (eligibleSlot) {
            if (eligibleSlot === slot) {
                return true;
            }
        });
        return false;
    };
    return Player;
}());
//# sourceMappingURL=Player.js.map