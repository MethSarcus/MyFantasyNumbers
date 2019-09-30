var Settings = /** @class */ (function () {
    function Settings(activeLineupSlots, lineupSlots, regularSeasonLength, playoffLength, draftType, currentMatchupPeriod, isActive, yearsActive) {
        this.activeLineupSlots = activeLineupSlots;
        this.lineupSlots = lineupSlots;
        this.regularSeasonLength = regularSeasonLength;
        this.playoffLength = playoffLength;
        this.draftType = draftType;
        this.positions = this.getPositions();
        this.currentMatchupPeriod = currentMatchupPeriod;
        this.isActive = isActive;
        this.yearsActive = yearsActive.sort(function (a, b) { return b - a; });
    }
    Settings.prototype.getPositions = function () {
        var positions = this.activeLineupSlots.filter(function (slot) {
            return slot[0] != 1 && slot[0] != 3 && slot[0] != 5 && slot[0] != 7 && slot[0] != 23;
        }).map(function (slot) {
            return getLineupSlot(slot[0]);
        });
        return positions;
    };
    return Settings;
}());
//# sourceMappingURL=Settings.js.map