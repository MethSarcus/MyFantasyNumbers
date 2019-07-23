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

class StartSit {
    constructor(start, sit, week) {
        this.started = start;
        this.sat = sit;
        this.actualDifference = start.actualScore - sit.actualScore;
        this.projectedDifference = start.projectedScore - sit.projectedScore;
        this.week = week;
        if (this.actualDifference > 0) {
            this.goodDecision = true;
        }
        else if (this.actualDifference < 0) {
            this.goodDecision = false;
        }
        else {
            this.goodDecision = null;
        }
        if (calcMatchupPointDifference(week) < this.actualDifference) {
            this.changedOutcome = true;
        }
        else {
            this.changedOutcome = false;
        }
    }
}

class Matchup {
    constructor(home, away, weekNumber, isPlayoff) {
        this.home = home;
        this.weekNumber = weekNumber;
        this.isPlayoffs = isPlayoff;
        if (away == undefined){
            this.byeWeek = true;
            this.isUpset = false;
        } else{
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
            this.byeWeek = false;
            if (this.projectedWinner != this.winner) {
                this.isUpset = true;
            } else {
                this.isUpset = false;
            }
        }
    }
}


class Team {
    constructor(teamID, players, activeLineupSlots) {
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
        this.potentialPoints = getWeekScore(getPotentialPoints(players, activeLineupSlots));
        this.score = getWeekScore(this.lineup);
        this.projectedScore = getProjectedScore(this.lineup);
    }
}
