//Class for containing a members week data
function Week(activeLineupSlots) {
    this.leagueID = "";
    this.memberID = "";
    this.teamID = "";
    this.opponentTeamID = "";
    this.activePlayers = [];
    this.benchPlayers = [];
    this.irPlayers = [];
    this.activeScore = 0;
    this.benchScore = 0;
    this.projectedScore = 0;
    this.weekNumber = "";
    this.regularSeason = false;
    this.opponentActiveScore = 0;
    this.opponentProjectedScore = 0;
    this.opponentActivePlayers = [];
    this.opponentBenchPlayers = [];
    this.optimalLineup = [];
    this.potentialPoints = 0;
    this.potentialPointsDifference;
    this.activeLineupSlots = activeLineupSlots;
}

function LeagueDraft(){
    this.leagueID = "";
    this.seasonID = "";
    this.draftType = "";
    this.auctionBudget = "";
    this.pickOrder = [];
    this.draftPicks = [];
}

function DraftPick() {
    this.teamID = "";
    this.memberID = "";
    this.overallPickNumber = "";
    this.roundID = "";
    this.roundPickNumber = "";
    this.playerID = "";
    this.playerAuctionCost = "";
    this.owningTeamIDs = []; //lists team id's that have owned the pick
    this.nominatingTeamID = ""; //used to see what team id nominated the player
    this.autoDraftTypeID = "";
}

function League() {
    this.leagueId = "";
    this.pastSeasons = [];
}

function Year() {
    this.leagueID = "";
    this.seasonID = "";
    this.members = [];
    this.lineupSlotCount = [];
}

function LeagueMember() {
    this.memberID = "";
    this.memberFirstName = "";
    this.memberLastName = "";
    this.teamLocation = "";
    this.teamNickname = "";
    this.teamAbbrev = "";
    this.division = "";
    this.teamID = "";
    this.logoURL = "";
    this.pastWeeks = [];
    this.leagueName = "";
    this.finalStanding = 0;
    this.transactions;
    this.record;
}

function Player() {
    this.firstName = "";
    this.lastName = "";
    this.actualScore = 0;
    this.projectedScore = 0;
    this.position = "";
    this.realTeamID = "";
    this.jerseyNumber = "";
    this.playerID = "";
}

function EmptySlot() {
    this.firstName = "No";
    this.lastName = "Player";
    this.actualScore = 0;
    this.projectedScore = 0;
    this.position = "";
    this.realTeamID = -1;
    this.jerseyNumber = -1;
    this.playerID = -1;
}