var ESPNPlayer = (function () {
    function ESPNPlayer(firstName, lastName, score, projectedScore, position, realTeamID, playerID, lineupSlotID, eligibleSlots, weekNumber) {
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
        this.espnID = playerID;
    }
    ESPNPlayer.prototype.isEligible = function (slot) {
        var isEligible = false;
        this.eligibleSlots.forEach(function (eligibleSlot) {
            if (eligibleSlot === slot) {
                isEligible = true;
            }
        });
        return isEligible;
    };
    return ESPNPlayer;
}());
//# sourceMappingURL=ESPNPlayer.js.map