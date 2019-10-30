var EmptySlot = (function () {
    function EmptySlot(lineupSlotID) {
        this.eligibleSlots = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 88];
        this.score = 0;
        this.firstName = "Empty";
        this.lastName = "Slot";
        this.actualScore = 0;
        this.projectedScore = 0;
        this.position = "EMPTY";
        this.realTeamID = "-1";
        this.jerseyNumber = -1;
        this.espnID = "-1";
        this.playerID = "-1";
        this.lineupSlotID = lineupSlotID;
    }
    return EmptySlot;
}());
//# sourceMappingURL=EmptySlot.js.map