var SleeperPlayer = (function () {
    function SleeperPlayer(playerID, weekNumber, lineupSlotID) {
        this.playerID = playerID;
        this.score = 0;
        this.projectedScore = 0;
        this.weekNumber = weekNumber;
        if (undefined !== lineupSlotID) {
            this.lineupSlotID = lineupSlotID;
        }
    }
    SleeperPlayer.prototype.isEligible = function (slot) {
        var isEligible = false;
        this.eligibleSlots.forEach(function (eligibleSlot) {
            if (eligibleSlot === slot) {
                isEligible = true;
            }
        });
        return isEligible;
    };
    return SleeperPlayer;
}());
//# sourceMappingURL=SleeperPlayer.js.map