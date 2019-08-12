class Player {
    constructor(firstName, lastName, score, projectedScore, position, realTeamID, playerID, lineupSlotID, eligibleSlots, weekNumber) {
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
    isEligible(slot) {
        this.eligibleSlots.forEach((eligibleSlot) => {
            if (eligibleSlot === slot) {
                return true;
            }
        });
        return false;
    }
}
//# sourceMappingURL=Player.js.map