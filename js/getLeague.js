function getPosition(eligibleSlots) {
    if (eligibleSlots[0] == 0) {
        return "QB";
    } else if (eligibleSlots[0] == 2) {
        return "RB";
    } else if (eligibleSlots[0] == 3) {
        return "WR";
    } else if (eligibleSlots[0] == 16) {
        return "D/ST";
    } else if (eligibleSlots[0] == 17) {
        return "K";
    } else if (eligibleSlots[0] == 5) {
        return "TE";
    }
}

function getLineupSlot(lineupSlotID) {
    if (lineupSlotID == 0) {
        return "QB";
    } else if (lineupSlotID == 2) {
        return "RB";
    } else if (lineupSlotID == 23) {
        return "FLEX";
    } else if (lineupSlotID == 20) {
        return "BENCH";
    } else if (lineupSlotID == 21) {
        return "IR";
    } else if (lineupSlotID == 4) {
        return "WR";
    } else if (lineupSlotID == 16) {
        return "D/ST";
    } else if (lineupSlotID == 17) {
        return "K";
    } else if (lineupSlotID == 6) {
        return "TE";
    }
}

function getProjectedScore(active) {
    var projScore = 0;
    for (i in active) {
        projScore += active[i].projectedScore;
    }

    return Math.round(projScore * 100) / 100;
}

function getWeekScore(active) {
    var score = 0;
    for (i in active) {
        if (active[i].actualScore != null || active[i].actualScore != 'undefined') {
            score += active[i].actualScore;
        }

    }

    return Math.round(score * 100) / 100;
}

function getMember(season, teamID) {
    for (i in season.members) {
        curMember = season.members[i];
        if (curMember.teamID == teamID) {
            return curMember;
        }
    }
}

function getOptimalLineup(week) {
    var allWeekPlayers = week.activePlayers.concat(week.benchPlayers, week.irPlayers);
    var rosterSlots = [];
    for (i in week.activeLineupSlots) {
        for (let w = 0; w < week.activeLineupSlots[i][1]; w++) {
            rosterSlots.push(week.activeLineupSlots[i][0]);
        }
    }
    //console.log(rosterSlots);
    var optimalLineup = [];
    //console.log(allWeekPlayers);
    for (x in rosterSlots) {
        let highScore = 0;
        let bestPlayer = null;
        let eligibleWeekPlayers = [];
        for (y in allWeekPlayers) {
            //console.log(allWeekPlayers[y]);
            if (allWeekPlayers[y].eligibleSlots.includes(parseInt(rosterSlots[x])) && inLineup(optimalLineup, allWeekPlayers[y]) == false) {
                eligibleWeekPlayers.push(allWeekPlayers[y]);
            }
        }
        for (z in eligibleWeekPlayers){
            if (eligibleWeekPlayers[z].actualScore > highScore) {
                highScore = eligibleWeekPlayers[z].actualScore;
                bestPlayer = eligibleWeekPlayers[z];
            }
        }

        if (bestPlayer != null) {
            optimalLineup.push(bestPlayer);
            highScore = 0;
            //bestPlayer = null;
        }
    }
    //console.log(optimalLineup);
    //console.log(getPPoints(optimalLineup));
    return optimalLineup;
}

function inLineup(lineup, player){
    for (v in lineup){
        if (lineup[v].playerID == player.playerID){
            //console.log(lineup[v]);
            //console.log(player);
            return true;
        }
    }

    return false;
}

function getPPoints(optimalLineup) {
    var score = 0;
    for (i in optimalLineup) {
        if (optimalLineup[i] != null || optimalLineup[i] != 'undefined') {
            score += optimalLineup[i].actualScore;
        }
    }
    // console.log("getPPoints and the lineup that got them");
    // console.log(Math.round(score * 100) / 100);
    // console.log(optimalLineup);
    return Math.round(score * 100) / 100;
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






//http://fantasy.espn.com/apis/v3/games/ffl/seasons/2019/segments/0/leagues/1241838?view=mDraftDetail&view=mLiveScoring&view=mMatchupScore&view=mPendingTransactions&view=mPositionalRatings&view=mSettings&view=mTeam&view=modular&view=mNav&scoringPeriodId=1

//