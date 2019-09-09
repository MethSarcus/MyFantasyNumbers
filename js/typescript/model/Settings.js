var Settings = /** @class */ (function () {
    function Settings(activeLineupSlots, lineupSlots, regularSeasonLength, playoffLength, draftType) {
        this.activeLineupSlots = activeLineupSlots;
        this.lineupSlots = lineupSlots;
        this.regularSeasonLength = regularSeasonLength;
        this.playoffLength = playoffLength;
        this.draftType = draftType;
        this.positions = this.getPositions();
    }
    Settings.prototype.getPositions = function () {
        var returnpositions = [];
        var positions = [];
        this.activeLineupSlots.forEach(function (slot) {
            if (!positions.includes(slot[0]) && slot[0] != "23" && slot[0] != "7") {
                positions.push(slot[0]);
                returnpositions.push(getLineupSlot(slot[0]));
            }
        });
        return returnpositions;
    };
    return Settings;
}());
//# sourceMappingURL=Settings.js.map