class DraftPick {
    constructor(teamID, overrallPickNumber, roundID, roundPickNumber, playerID, playerAuctionCost, owningTeamIDs, nominatingTeamID, autoDraftTeamID) {
        this.teamID = teamID;
        this.overallPickNumber = overrallPickNumber;
        this.roundID = roundID;
        this.roundPickNumber = roundID;
        this.playerID = playerID;
        this.playerAuctionCost = playerAuctionCost;
        this.owningTeamIDs = owningTeamIDs; // lists team id's that have owned the pick
        this.nominatingTeamID = nominatingTeamID; // used to see what team id nominated the player
        this.autoDraftTeamID = autoDraftTeamID;
    }
}
//# sourceMappingURL=DraftPick.js.map