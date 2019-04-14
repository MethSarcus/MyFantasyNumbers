function worstStartDecision(member) {
    var worstStart = null;
    for (i = 0; i < member.pastWeeks; i++) {
        let curWeek = member.pastWeeks[i];

    }
}

function getSmallestMOV(myYear) {
    var closestMatch = myYear.members[0].pastWeeks[0];

    for (i = 0; i < myYear.members; i++) {
        let curMember = myYear.members[i];
        for (x = 0; x < curMember.pastWeeks; x++) {
            let curWeek = curMember.pastWeeks[x];
            if (calcMatchupPointDifference(curWeek) < calcMatchupPointDifference(closestMatch)) {
                closestMatch = curWeek;
            }
        }
    }

    return curWeek;
}

function getLargestMOV(myYear) {
    var largestMatch = myYear.members[0].pastWeeks[0];
    for (i = 0; i < myYear.members; i++) {
        let curMember = myYear.members[i];
        for (x = 0; x < curMember.pastWeeks; x++) {
            let curWeek = curMember.pastWeeks[x];
            if (calcMatchupPointDifference(curWeek) > calcMatchupPointDifference(largestMatch)) {
                largestMatch = curWeek;
            }
        }
    }

    return largestMatch;
}

function calcMatchupPointDifference(week) {
    return Math.abs(week.activeScore - week.opponentActiveScore);
}

//returns a matchup object
function getBiggestUpset(allMatchups) {
    var biggestUpset = allMatchups[0];
    for (i = 0; i < allMatchups.length; i++) {
        let curMatchup = allMatchups[i];
        if (curMatchup.byeWeek != true) {
            if (curMatchup.projectedDifference > biggestUpset.projectedDifference && curMatchup.isUpset) {
                biggestUpset = curMatchup;
            }
        }
    }

    return biggestUpset;

}

function getMemberSmartestStart(member) {
    var bestDecision = null;

    for (i = 0; i < member.pastWeeks; i++) {
        curWeek = member.pastWeeks[i];
        let possiblePlayers = [];
        for (y = 0; y < curWeek.activeRoster.length; y++) {
            curStartingPlayer = curWeek.activeRoster[y];
            for (x = 0; x < curWeek.bench.length; x++) {
                if (curWeek.bench[x].eligibleSlots.includes(parseInt(curWeek.activeLineupSlots[y]))) {
                    possiblePlayers.push(curWeek.bench[x]);
                }
            }
            for (z = 0; z < possiblePlayers.length; z++) {
                if (bestDecision == null) {
                    bestDecision = new StartSit(curStartingPlayer, possiblePlayers[z], curWeek);
                } else {
                    if (curStartingPlayer.actualScore > possiblePlayers[z].actualScore &&
                        curStartingPlayer.projectedScore < possiblePlayers[z].projectedScore) {
                        if (startValueEquation(curStartingPlayer, possiblePlayers[z], curWeek) > startValueEquation(bestDecision.started, bestDecision.sat, bestDecision.week)) {
                            bestDecision = new StartSit(curStartingPlayer, possiblePlayers[z], curWeek);
                        }
                    }
                }
            }
        }
    }
    return bestDecision;
}

//player 1 must have been started in lineup slot
function startValueEquation(player1, player2, week) {
    var multiplier = player1.actualScore / player1.projectedScore;
    var horizontalProjDiff = player1.projectedScore - player2.projectedScore;
    var horizontalActualDiff = player1.actualScore - player2.actualScore;
    return (horizontalActualDiff + horizontalProjDiff) * multiplier;

}

function StartSit(start, sit, week) {
    this.started = start;
    this.sat = sit;
    this.actualDifference = start.actualScore - sit.actualScore;
    this.projectedDifference = start.projectedScore - sit.projectedScore;
    this.week = week;
    if (this.actualDifference > 0) {
        this.goodDecision = true;
    } else if (this.actualDifference < 0) {
        this.goodDecision = false;
    } else {
        this.goodDecision = null;
    }

    if (calcMatchupPointDifference(week) < this.actualDifference) {
        this.changedOutcome = true;
    } else {
        this.changedOutcome = false;
    }


}

function seasonMatchups() {
    this.regularSeasonNumWeeks = 0;
    this.playoffDuration = 0;
    this.totalNumWeeks = 0;
    this.matchups = [];
}

function Matchup(home, away) {
    this.homeTeam = new Team(home);
    this.awayTeam = new Team(away);
    this.projectedWinnerTeamID = "";
    this.projectedMOV = 0;
    this.actualWInnerTeamID = "";
    this.actualMOV = 0;
    this.playoffMatchup = false;
    this.byeWeek = false;
    this.weekNumber = 0;
    this.isUpset = false;
}

function Team() {
    this.teamID = 0;
    this.memberID = "";
    this.location = "";
    this.nickname = "";
    this.fullName = "";
    this.teamAbbrev = "";
    this.finalScore = 0;
    this.projectedScore = 0;
    this.possibleScore = 0;
    this.projectedDifference = 0;
    this.possibleDifference = 0;
    this.activeRoster = [];
    this.bench = [];
    this.IR = [];
}