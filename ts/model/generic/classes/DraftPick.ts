class DraftPick {
    public teamID: number;
    public overallPickNumber: number;
    public roundID: number;
    public roundPickNumber: number;
    public playerID: string;
    public playerAuctionCost: number;
    public owningTeamIDs: number[];
    public nominatingTeamID: number;
    public autoDraftTeamID: number;
    constructor(teamID: number, overrallPickNumber: number, roundID: number,
                roundPickNumber: number, playerID: string, playerAuctionCost: number, owningTeamIDs: number[], nominatingTeamID: number, autoDraftTeamID: number) {
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
