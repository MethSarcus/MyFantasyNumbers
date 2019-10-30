var DraftPick = (function () {
    function DraftPick(teamID, overrallPickNumber, roundID, roundPickNumber, playerID, playerAuctionCost, owningTeamIDs, nominatingTeamID, autoDraftTeamID) {
        this.teamID = teamID;
        this.overallPickNumber = overrallPickNumber;
        this.roundID = roundID;
        this.roundPickNumber = roundID;
        this.playerID = playerID;
        this.playerAuctionCost = playerAuctionCost;
        this.owningTeamIDs = owningTeamIDs;
        this.nominatingTeamID = nominatingTeamID;
        this.autoDraftTeamID = autoDraftTeamID;
    }
    return DraftPick;
}());
//# sourceMappingURL=DraftPick.js.map