//Class for containing a members week data
class League {
    constructor() {
        this.leagueId = "";
        this.pastSeasons = [];
    }
}

class Season {
    constructor() {
        this.leagueID = "";
        this.seasonID = "";
        this.members = [];
        this.lineupSlotCount = [];
        this.matchups = []
    }
}

class Week {
    constructor(activeLineupSlots) {
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
        this.powerRank = 1; //Weekly Rank in non H2H scoring
        this.powerWins = 0; //Number of total wins in non h2h scoring
        this.powerLosses = 0; //Number of total losses in non h2h scoring
    }
}

class LeagueDraft {
    constructor() {
        this.leagueID = "";
        this.seasonID = "";
        this.draftType = "";
        this.auctionBudget = "";
        this.pickOrder = [];
        this.draftPicks = [];
    }
}

class DraftPick {
    constructor() {
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
}



class LeagueMember {
    constructor() {
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
        this.powerRank = 1;
        this.powerWins = 0;
        this.powerLosses = 0;
    }
}

class Player {
    constructor(firstName, lastName, score, projectedScore, position, realTeamID, playerID, lineupSlotID) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.score = score;
        this.projectedScore = projectedScore;
        this.position = position;
        this.realTeamID = realTeamID;
        this.playerID = playerID;
        this.lineupSlotID = lineupSlotID;
    }
}


class EmptySlot {
    constructor() {
        this.firstName = "Empty";
        this.lastName = "Slot";
        this.actualScore = 0;
        this.projectedScore = 0;
        this.position = "";
        this.realTeamID = -1;
        this.jerseyNumber = -1;
        this.playerID = -1;
    }
}

class Matchup {
    constructor(home, away, weekNumber, isPlayoffs) {
        this.home = home;
        this.weekNumber = weekNumber;
        this.playoffMatchup = isPlayoffs;
        if (away == undefined){
            this.byeWeek = true;
            this.isUpset = false;
        } else{
            this.byeWeek = false;
            this.away = away;
            if (home.projectedScore > away.projectedScore) {
                this.projectedWinner = home.teamID;
            } else {
                this.projectedWinner = away.teamID
            }
            this.projectedMOV = (Math.abs(home.projectedScore - away.projectedScore));
            if (home.score > away.score) {
                this.winner = home.teamID;
            } else {
                this.winner = away.teamID
            }
            this.marginOfVictory = (Math.abs(home.score - away.score));
            
            if (this.projectedWinner != this.winner) {
                this.isUpset = true;
            } else {
                this.isUpset = false;
            }
        }
    }
}


class Team {
    constructor(teamID, players) {
        this.lineup = [];
        this.bench = [];
        this.IR = [];
        for (player in players){
            if (player.lineupSlotID == 21) {
                this.IR.push(player);
            } else if (player.lineupSlotID == 20) {
                this.bench.push(player);
            } else {
                week.lineup.push(player);
            }
        }
        this.teamID = teamID;
        this.potentialPoints = getWeekScore(getPotentialPoints(players));
        this.score = getWeekScore(this.lineup);
        this.projectedScore = getProjectedScore(this.lineup);
    }
}
