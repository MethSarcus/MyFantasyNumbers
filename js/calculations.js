function getTeam(myYear, teamID){
    for (i = 0; i < myYear.members.length; i++) {
        if (myYear.members[i].teamID == teamID){
            return myYear.members[i];
        }
    }
}

//given an array of players it calculates how much they scored that week
function calcRosterScore(players) {
    var points = 0;
    for (i = 0; i < players.length; i++) {
        points += players[i].actualScore;
    }

    return points;
}

//rounds given number to closest hundreth
function roundToHundred(x) {
    return Math.round(x * 100) / 100
}

//rounds given number to closest tenth
function roundToTen(x) {
    return Math.round(x * 10) / 10;
}

//Params: Array containing Member Objects, 
//Returns: Double, league weekly average to the nearest hundredth
function getLeagueWeeklyAverage(members) {
    memberPF = 0;
    for (i = 0; i < members.length; i++) {
        memberPF += members[i].completeSeasonPoints;
    }
    memberPF = memberPF / members.length;
    memberPF = memberPF / members[0].pastWeeks.length;
    return roundToHundred(memberPF);
}

//Params: League Object, Member Object
//Returns: Int, what place their worst week was compared to every other teams worst week
function getWorstWeekFinish(league, member) {
    var worstWeeks = [];
    var memberWorst = getWorstWeek(member);
    var count = 1;
    for (var i = 0; i < league.members.length; i++) {
        worstWeeks.push(getWorstWeek(league.members[i]));
    }
    for (var i = 0; i < worstWeeks.length; i++) {
        if (memberWorst.activeScore > worstWeeks[i].activeScore) {
            count += 1;
        }
    }

    return count;

}

//Params: League Object
//Returns: Int, number of total weeks for everyone in the league combined
function getTotalWeeks(myYear) {
    var totalWeeks = 0;
    for (i = 0; i < myYear.members.length; i++) {
        totalWeeks += myYear.members[i].pastWeeks.length;
    }

    return totalWeeks;
}

//Params: Member Object
//Returns: Week Object, the worst week the member had during the season
function getWorstWeek(member) {
    var curLowWeekScore = member.pastWeeks[0].activeScore;
    var curLowWeek = member.pastWeeks[0];
    for (var i = 0; i < member.pastWeeks.length; i++) {
        if (member.pastWeeks[i].activeScore < curLowWeekScore) {
            curLowWeekScore = member.pastWeeks[i].activeScore;
            curLowWeek = member.pastWeeks[i];
        }
    }
    return curLowWeek;

}

//Params: Double
//Returns: Hex, Color for card
function getColor(value) {
    //value from 0 to 1
    var hue = ((1 - value) * 120).toString(10);
    return ["hsl(", hue, ",100%,50%)"].join("");
}

function getCardColor(rank, outOf) {
    return getColor(rank / outOf);
}

function getInverseCardColor(rank, outOf) {
    return getColor((1 + (outOf - rank)) / outOf);
}

function getTextColor(rank, outOf) {
    var o = rank / outOf;
    if (o < .75) {
        return 'black';
    } else {
        return 'white';
    }
}

//Params: League Object, Member Object
//Returns: Int, what place their best week was compared to every other teams worst week
function getBestWeekFinish(league, member) {
    var bestWeeks = [];
    var memberBest = getBestWeek(member);
    var count = 1;
    for (var i = 0; i < league.members.length; i++) {
        bestWeeks.push(getBestWeek(league.members[i]));
    }
    for (var i = 0; i < bestWeeks.length; i++) {
        if (memberBest.activeScore < bestWeeks[i].activeScore) {
            count += 1;
        }
    }

    return count;

}

//Params: League Object
//Returns: array with best member and best week
function getBestWeekMember(league) {
    var bestMember = league.members[0];
    var bestWeek = getBestWeek(league.members[0]);
    for (var i = 0; i < league.members.length; i++) {
        if (bestWeek.activeScore < getBestWeek(league.members[i]).activeScore) {
            bestMember = league.members[i];
            bestWeek = getBestWeek(league.members[i]);
        }
    }
    return [bestMember, bestWeek];
}

//Params: League Object
//Returns: array with best member and best week
function getWorstWeekMember(league) {
    var bestMember = league.members[0];
    var bestWeek = getWorstWeek(league.members[0]);
    for (var i = 0; i < league.members.length; i++) {
        if (bestWeek.activeScore > getWorstWeek(league.members[i]).activeScore) {
            bestMember = league.members[i];
            bestWeek = getWorstWeek(league.members[i]);
        }
    }
    return [bestMember, bestWeek];
}


//Params: League Object
//Returns: Double, average league total PF
function getLeaguePF(myYear) {
    var totalPoints = 0;
    for (i in myYear.members) {
        totalPoints += myYear.members[i].completeSeasonPoints;
    }

    return roundToHundred(totalPoints / myYear.members.length);
}

//Params: League Object
//Returns: Double, Average total PA
function getLeaguePA(myYear) {
    var totalPoints = 0;
    for (i in myYear.members) {
        totalPoints += myYear.members[i].completeSeasonPointsAgainst;
    }

    return roundToHundred(totalPoints / myYear.members.length);
}

//Params: League Object
//Returns: Double, Average total Potential Points
function getLeaguePP(myYear) {
    var totalPoints = 0;
    for (i in myYear.members) {
        totalPoints += getPotentialPoints(myYear.members[i]);
    }
    return roundToHundred(totalPoints / myYear.members.length);
}


//Params: League Object, Member Object
//Returns: Int, What place the member finished in for PF
function getPFFinish(myYear, person) {
    var greaterCount = 1;
    for (i in myYear.members) {
        if (person.completeSeasonPoints < myYear.members[i].completeSeasonPoints) {
            greaterCount += 1;
        }
    }

    return greaterCount;
}

//Params: League Object, Member Object
//Returns: Int, What place the member finished in for PA
function getPAFinish(myYear, member) {
    var greaterCount = 1;
    for (i in myYear.members) {
        if (member.completeSeasonPointsAgainst < myYear.members[i].completeSeasonPointsAgainst) {
            greaterCount += 1;
        }
    }

    return greaterCount;
}

//Params: Member Object
//Returns: Double, Total potential points for a member
function getPotentialPoints(member) {
    //console.log(member.pastWeeks);
    var myPoints = 0;

    for (j in member.pastWeeks) {
        myPoints += member.pastWeeks[j].potentialPoints;

    }

    return myPoints;
}

//Params: Member Object
//Returns: seasonPlayer, Object representing the teams MVP
function getMVP(member) {
    var totalPlayers = [];
    var highestScoring;
    for (x in member.pastWeeks) {
        for (y in member.pastWeeks[x].activePlayers) {
            let curPlayer = member.pastWeeks[x].activePlayers[y];
            if (inMVPArray(curPlayer.playerID, totalPlayers) == true) {
                for (i in totalPlayers) {
                    if (totalPlayers[i].playerId == curPlayer.playerID) {
                        totalPlayers[i].totalSeasonScore += curPlayer.actualScore;
                    }
                }
            } else {
                let seasonPlayer = {
                    firstName: curPlayer.firstName,
                    lastName: curPlayer.lastName,
                    playerId: curPlayer.playerID,
                    position: curPlayer.position,
                    realteamID: curPlayer.realTeamID,
                    totalSeasonScore: parseFloat(curPlayer.actualScore)
                }
                totalPlayers.push(seasonPlayer);
                highestScoring = seasonPlayer;
            }
        }
    }
    for (q in totalPlayers) {
        if (totalPlayers[q].totalSeasonScore > highestScoring.totalSeasonScore) {
            highestScoring = totalPlayers[q];
        }
    }
    highestScoring.totalSeasonScore = roundToTen(highestScoring.totalSeasonScore);
    return highestScoring;
}

//helper function for getMVP()
function inMVPArray(ID, myArr) {
    for (element in myArr) {
        if (myArr[element].playerId == ID) {

            return true;
        }
    }

    return false;
}

//Params: Member Object
//Returns: seasonPlayer, Object representing the teams worst starting player
// function getWVP(member) {
//     var totalPlayers = [];
//     var lowestScoring;
//     for (x in member.pastWeeks) {
//         for (y in member.pastWeeks[x].activePlayers) {
//             let curPlayer = member.pastWeeks[x].activePlayers[y];
//             if (inMVPArray(curPlayer.playerID, totalPlayers) == true) {
//                 for (i in totalPlayers) {
//                     if (totalPlayers[i].playerId == curPlayer.playerID) {
//                         totalPlayers[i].totalSeasonScore += curPlayer.actualScore;
//                     }
//                 }
//             } else {
//                 let seasonPlayer = {
//                     firstName: curPlayer.firstName,
//                     lastName: curPlayer.lastName,
//                     playerId: curPlayer.playerID,
//                     position: curPlayer.position,
//                     realteamID: curPlayer.realTeamID,
//                     totalSeasonScore: parseFloat(curPlayer.actualScore)
//                 }
//                 totalPlayers.push(seasonPlayer);
//                 lowestScoring = seasonPlayer;
//             }
//         }
//     }
//     for (q in totalPlayers) {
//         if (totalPlayers[q].totalSeasonScore < lowestScoring.totalSeasonScore) {
//             lowestScoring = totalPlayers[q];
//         }
//     }
//     lowestScoring.totalSeasonScore = roundToTen(lowestScoring.totalSeasonScore);
//     return lowestScoring;
// }

//Params: Member Object
//Returns: Player, Object representing the teams worst player including what week they played
function getWVPWeek(leagueMember) {
    var lowestScoring = leagueMember.pastWeeks[0].activePlayers[0];
    lowestScoring.week = 1;
    for (var x in leagueMember.pastWeeks) {
        for (var y in leagueMember.pastWeeks[x].activePlayers) {
            if (leagueMember.pastWeeks[x].activePlayers[y].actualScore < lowestScoring.actualScore) {
                lowestScoring = leagueMember.pastWeeks[x].activePlayers[y];
                lowestScoring.week = parseInt(x) + 1;
            }
        }
    }
    return lowestScoring;
}

//Params: Member Object
//Returns: Double, what the members standard deviation was
function getStandardDeviation(member) {
    var dev = math.std(getWeekArray(member.pastWeeks));
    dev = Math.round(dev * 10) / 10;
    return dev;
}

//Params: League Object
//Returns: Double, standard deviation of the entire league
function getLeagueStandardDeviation(league) {
    var members = league.members;
    var memberSTDTotal = 0;
    for (var i = 0; i < members.length; i++) {
        members[i].stdDev = getStandardDeviation(league.members[i])
        memberSTDTotal += members[i].stdDev;
    }
    dev = roundToTen(memberSTDTotal / members.length);
    return dev;
}

//Params: Array containing Week Objects
//Returns: Array of Doubles, Contains all the week scores for a member
function getWeekArray(memberPastWeeks) {
    var weeks = [];
    for (x in memberPastWeeks) {
        weeks.push(parseFloat(memberPastWeeks[x].activeScore));
    }
    return weeks;
}

//Params: League Object, Member Object
//Returns: Int, What place the member finished in standard deviation
function getStandardDeviationFinish(league, member) {
    var greaterCount = 1;
    member.stdDev = getStandardDeviation(member);
    for (var i = 0; i < league.members.length; i++) {
        if (member.stdDev > getStandardDeviation(league.members[i])) {
            greaterCount += 1;
        }
    }
    return greaterCount;

}

//Params: League Object, Member Object
//Returns: Int, What place the member finished in potential point difference
function getPPDifferenceFinish(league, member) {
    var greaterCount = 1;
    for (var i = 0; i < league.members.length; i++) {
        if ((getPotentialPoints(member) - member.completeSeasonPoints) > (getPotentialPoints(league.members[i]) - league.members[i].completeSeasonPoints)) {
            greaterCount += 1;
        }
    }
    return greaterCount;
}

//Params: League Object, Member Object
//Returns: Int, What place the member finished in total potential points
function getPPFinish(league, member) {
    var greaterCount = 1;
    for (var i = 0; i < league.members.length; i++) {
        if (getPotentialPoints(member) < getPotentialPoints(league.members[i])) {
            greaterCount += 1;
        }
    }
    return greaterCount;
}

//Params: League Object
//Returns: Double, What the average difference between potential points and total points was for the league 
function getPPDifferenceFinishLeague(league) {
    var ppDifTotal = 0;
    for (var i = 0; i < league.members.length; i++) {
        let diff = getPotentialPoints(league.members[i]) - league.members[i].completeSeasonPoints;
        ppDifTotal += diff;
    }
    ppDifTotal = roundToTen(ppDifTotal / league.members.length);
    return ppDifTotal;
}

//Params: Member Object
//Returns: Week, Object of the best week a member had
function getBestWeek(member) {
    var curHighWeekScore = 0;
    var curHighWeek = member.pastWeeks[0];
    for (var i = 0; i < member.pastWeeks.length; i++) {
        if (member.pastWeeks[i].activeScore > curHighWeekScore) {
            curHighWeek = member.pastWeeks[i];
            curHighWeekScore = curHighWeek.activeScore;
        }
    }

    return curHighWeek;

}

//Returns the suffix of whatever number is input
function ordinal_suffix_of(i) {
    var j = i % 10,
        k = i % 100;
    if (j == 1 && k != 11) {
        return i + "st";
    }
    if (j == 2 && k != 12) {
        return i + "nd";
    }
    if (j == 3 && k != 13) {
        return i + "rd";
    }
    return i + "th";
}


function getProjectedScore(active) {
    var projScore = 0;
    for (i in active) {
        projScore += active[i].projectedScore;
    }

    return roundToHundred(projScore);
}

function getWeekScore(players) {
    var score = 0;
    for (i in players) {
        if (players[i].actualScore != null || players[i].actualScore != 'undefined') {
            score += players[i].actualScore;
        }
    }
    return roundToHundred(score);
}

function getMember(season, teamID) {
    for (i in season.members) {
        curMember = season.members[i];
        if (curMember.teamID == teamID) {
            return curMember;
        }
    }
}

function getOptimalLineup(players) {
    var rosterSlots = [];
    for (i in myYear.activeLineupSlots) {
        for (let w = 0; w < myYear.activeLineupSlots[i][1]; w++) {
            rosterSlots.push(myYear.activeLineupSlots[i][0]);
        }
    }
    var optimalLineup = [];
    for (x in rosterSlots) {
        let highScore = 0;
        let bestPlayer = null;
        let eligibleWeekPlayers = [];
        for (y in players) {
            if (players[y].eligibleSlots.includes(parseInt(rosterSlots[x])) && inLineup(optimalLineup, players[y]) == false) {
                eligibleWeekPlayers.push(players[y]);
            }
        }
        for (z in eligibleWeekPlayers) {
            if (eligibleWeekPlayers[z].actualScore > highScore) {
                highScore = eligibleWeekPlayers[z].actualScore;
                bestPlayer = eligibleWeekPlayers[z];
            }
        }

        if (bestPlayer != null) {
            optimalLineup.push(bestPlayer);
            highScore = 0;
        }
    }

    return optimalLineup;
}

function inLineup(lineup, player) {
    for (v in lineup) {
        if (lineup[v].playerID == player.playerID) {
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

    return roundToHundred(score);
}

function getSmallestMOV(myYear) {
    var largestMatch = myYear.members[0].pastWeeks[0];
    for (i in myYear.members) {
        let curMember = myYear.members[i];
        for (b in curMember.pastWeeks) {
            let curWeek = curMember.pastWeeks[b];
            if (calcMatchupPointDifference(curWeek) < calcMatchupPointDifference(largestMatch) && curWeek.opponentTeamID != "Bye Week") {
                largestMatch = curWeek;
            }
        }
    }
    return largestMatch;
}

function getLargestMOV(myYear) {

    var largestMatch = myYear.members[0].pastWeeks[0];
    for (i in myYear.members) {
        let curMember = myYear.members[i];
        for (b in curMember.pastWeeks) {
            let curWeek = curMember.pastWeeks[b];
            if (calcMatchupPointDifference(curWeek) > calcMatchupPointDifference(largestMatch) && curWeek.opponentTeamID != "Bye Week") {
                largestMatch = curWeek;
                
            }
        }
    }
    return largestMatch;
}

function calcMatchupPointDifference(week) {
    return Math.abs(week.activeScore - week.opponentActiveScore);
}