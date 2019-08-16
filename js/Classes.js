// import { std, mean } from 'mathjs';
// class League {
//     constructor(id, season, weeks, members, settings) {
//         this.id = id;
//         this.weeks = weeks;
//         this.season = season;
//         this.members = members;
//         this.settings = settings;
//         this.seasonPortion = SEASON_PORTION.REGULAR;
//     }
//     setMemberStats(weeks) {
//         weeks.forEach(week => {
//             let weekMatches = [];
//             week.matchups.forEach(matchup => {
//                 if (matchup.byeWeek != true) {
//                     if (matchup.isTie != true) {
//                         this.getMember(matchup.winner).stats.wins += 1;
//                         this.getMember(matchup.getOpponent(matchup.winner).teamID).stats.losses += 1;
//                     }
//                     else {
//                         this.getMember(matchup.home.teamID).stats.ties += 1;
//                         this.getMember(matchup.away.teamID).stats.ties += 1;
//                     }
//                     this.getMember(matchup.home.teamID).stats.pa += matchup.away.score;
//                     this.getMember(matchup.away.teamID).stats.pa += matchup.home.score;
//                     weekMatches.push(matchup.home);
//                     weekMatches.push(matchup.away);
//                 }
//                 else {
//                     weekMatches.push(matchup.home);
//                 }
//             });
//             weekMatches.sort(function (x, y) {
//                 if (x.score < y.score) {
//                     return -1;
//                 }
//                 if (x.score > y.score) {
//                     return 1;
//                 }
//                 return 0;
//             });
//             for (var i = 0; i < weekMatches.length; i++) {
//                 let curMember = this.getMember(weekMatches[i].teamID);
//                 let curMemberTeam = weekMatches[i];
//                 curMember.stats.pf += curMemberTeam.score;
//                 curMember.stats.pp += curMemberTeam.potentialPoints;
//                 curMember.stats.powerWins += i;
//                 curMember.stats.powerLosses += (weekMatches.length - 1 - i);
//             }
//         });
//         this.members.forEach(member => {
//             member.setAdvancedStats(weeks);
//         });
//     }
//     resetStats() {
//         this.members.forEach(function (member) {
//             member.stats = new Stats(member.stats.finalStanding);
//         });
//     }
//     getSeasonPortionWeeks() {
//         var weekPortion = this.weeks;
//         if (this.seasonPortion == SEASON_PORTION.REGULAR) {
//             weekPortion = this.weeks.filter(function (it) {
//                 return it.isPlayoffs == false;
//             });
//         }
//         else if (this.seasonPortion == SEASON_PORTION.POST) {
//             weekPortion = this.weeks.filter(function (it) {
//                 return it.isPlayoffs == true;
//             });
//         }
//         return weekPortion;
//     }
//     getMember(teamID) {
//         var found;
//         this.members.forEach(member => {
//             if (teamID == member.teamID) {
//                 found = member;
//             }
//         });
//         return found;
//     }
//     getMemberBestWeek(teamID) {
//         var highScore = 0;
//         var highTeam;
//         this.weeks.forEach(function (week) {
//             if (week.getTeam(teamID).score > highScore) {
//                 highScore = week.getTeam(teamID).score;
//                 highTeam = week.getTeam(teamID);
//             }
//         });
//         return highTeam;
//     }
//     getLeagueWeeklyAverage() {
//         var totalPoints = 0;
//         this.weeks.forEach(week => {
//             totalPoints += week.getWeekAverage();
//         });
//         return totalPoints / this.weeks.length;
//     }
//     getStandardDeviation(weeks) {
//         var scores = [];
//         this.weeks.forEach(week => {
//             week.matchups.forEach(matchup => {
//                 if (matchup.byeWeek != true) {
//                     scores.push(matchup.home.score);
//                     scores.push(matchup.away.score);
//                 }
//                 else {
//                     scores.push(matchup.home.score);
//                 }
//             });
//         });
//         var dev = std(scores);
//         dev = roundToHundred(dev);
//         return dev;
//     }
//     getPointsAgainstFinish(teamID) {
//         var finish = 1;
//         var pa = this.getMember(teamID).stats.pa;
//         this.members.forEach(member => {
//             if (pa > member.stats.pa && member.teamID != teamID) {
//                 finish += 1;
//             }
//         });
//         return finish;
//     }
//     getPointsScoredFinish(teamID) {
//         var finish = 1;
//         var pf = this.getMember(teamID).stats.pf;
//         this.members.forEach(member => {
//             if (pf < member.stats.pf && member.teamID != teamID) {
//                 finish += 1;
//             }
//         });
//         return finish;
//     }
//     getPotentialPointsFinish(teamID) {
//         var finish = 1;
//         var pp = this.getMember(teamID).stats.pp;
//         this.members.forEach(member => {
//             if (pp < member.stats.pp && member.teamID != teamID) {
//                 finish += 1;
//             }
//         });
//         return finish;
//     }
//     getBestWeek(teamID) {
//         var bestWeekMatchup = this.weeks[0].getTeamMatchup(teamID);
//         var highestScore = this.weeks[0].getTeam(teamID).score;
//         this.weeks.forEach(week => {
//             if (week.getTeam(teamID).score > highestScore) {
//                 highestScore = week.getTeam(teamID).score;
//                 bestWeekMatchup = week.getTeamMatchup(teamID);
//             }
//         });
//         return bestWeekMatchup;
//     }
//     getLargestMarginOfVictory() {
//         var highestMOV = 0;
//         var highestMOVMatchup;
//         this.weeks.forEach(week => {
//             week.matchups.forEach(matchup => {
//                 if (matchup.marginOfVictory > highestMOV && !matchup.byeWeek) {
//                     highestMOV = matchup.marginOfVictory;
//                     highestMOVMatchup = matchup;
//                 }
//             });
//         });
//         return highestMOVMatchup;
//     }
//     getSmallestMarginOfVictory() {
//         var smallestMOV = this.weeks[0].matchups[0].marginOfVictory;
//         var smallestMOVMatchup;
//         this.weeks.forEach(week => {
//             week.matchups.forEach(matchup => {
//                 if (matchup.marginOfVictory < smallestMOV && !matchup.byeWeek) {
//                     smallestMOV = matchup.marginOfVictory;
//                     smallestMOVMatchup = matchup;
//                 }
//             });
//         });
//         return smallestMOVMatchup;
//     }
// }
// class Settings {
//     constructor(activeLineupSlots, lineupSlots, regularSeasonLength, playoffLength, draftType) {
//         this.activeLineupSlots = activeLineupSlots;
//         this.lineupSlots = lineupSlots;
//         this.regularSeasonLength = regularSeasonLength;
//         this.playoffLength = playoffLength;
//         this.draftType = draftType;
//     }
// }
// class Draft {
//     constructor(leagueID, year, draftType, pickOrder, draftPicks, auctionBudget) {
//         this.leagueID = leagueID;
//         this.year = year;
//         this.draftType = draftType;
//         this.auctionBudget = auctionBudget;
//         this.pickOrder = pickOrder;
//         this.draftPicks = draftPicks;
//     }
// }
// class DraftPick {
//     constructor(teamID, overrallPickNumber, roundID, roundPickNumber, playerID, playerAuctionCost, owningTeamIDs, nominatingTeamID, autoDraftTeamID) {
//         this.teamID = teamID;
//         this.overallPickNumber = overrallPickNumber;
//         this.roundID = roundID;
//         this.roundPickNumber = roundID;
//         this.playerID = playerID;
//         this.playerAuctionCost = playerAuctionCost;
//         this.owningTeamIDs = owningTeamIDs; //lists team id's that have owned the pick
//         this.nominatingTeamID = nominatingTeamID; //used to see what team id nominated the player
//         this.autoDraftTeamID = autoDraftTeamID;
//     }
// }
// class Member {
//     constructor(memberID, firstName, lastName, teamLocation, teamNickname, teamAbbrev, division, teamID, logoURL, transactions, stats) {
//         this.ID = memberID;
//         this.firstName = firstName;
//         this.lastName = lastName;
//         this.teamLocation = teamLocation;
//         this.teamNickname = teamNickname;
//         this.teamAbbrev = teamAbbrev;
//         this.division = division;
//         this.teamID = teamID;
//         this.logoURL = logoURL;
//         this.transactions = transactions;
//         this.stats = stats;
//     }
//     setAdvancedStats(weeks) {
//         var scores = [];
//         weeks.forEach(week => {
//             scores.push(week.getTeam(this.ID).score);
//         });
//         this.stats.standardDeviation = std(scores);
//         this.stats.weeklyAverage = mean(scores);
//     }
// }
// class Stats {
//     constructor(finalStanding) {
//         this.finalStanding = finalStanding;
//         this.wins = 0;
//         this.losses = 0;
//         this.ties = 0;
//         this.powerWins = 0;
//         this.powerLosses = 0;
//         this.pf = 0;
//         this.pa = 0;
//         this.pp = 0;
//     }
//     getWinPct() {
//         if (this.wins == 0) {
//             return 0.00;
//         }
//         else {
//             return this.wins / (this.wins + this.losses);
//         }
//     }
// }
// class Player {
//     constructor(firstName, lastName, score, projectedScore, position, realTeamID, playerID, lineupSlotID, eligibleSlots, weekNumber) {
//         this.firstName = firstName;
//         this.lastName = lastName;
//         this.eligibleSlots = eligibleSlots;
//         this.score = score;
//         this.projectedScore = projectedScore;
//         this.position = position;
//         this.realTeamID = realTeamID;
//         this.playerID = playerID;
//         this.lineupSlotID = lineupSlotID;
//         this.weekNumber = weekNumber;
//     }
//     isEligible(slot) {
//         for (var i = 0; i < this.eligibleSlots.length; i++) {
//             if (this.eligibleSlots[i] == slot) {
//                 return true;
//             }
//         }
//     }
// }
// class EmptySlot {
//     constructor() {
//         this.firstName = "Empty";
//         this.lastName = "Slot";
//         this.actualScore = 0;
//         this.projectedScore = 0;
//         this.position = "EMPTY";
//         this.realTeamID = -1;
//         this.jerseyNumber = -1;
//         this.playerID = -1;
//     }
// }
// class Week {
//     constructor(weekNumber, isPlayoffs, matchups) {
//         this.weekNumber = weekNumber;
//         this.isPlayoffs = isPlayoffs;
//         this.matchups = matchups;
//     }
//     getTeam(teamID) {
//         var team;
//         this.matchups.forEach(matchup => {
//             if (matchup.hasTeam(teamID)) {
//                 team = matchup.getTeam(teamID);
//             }
//         });
//         return team;
//     }
//     getTeamMatchup(teamID) {
//         var match;
//         this.matchups.forEach(matchup => {
//             if (matchup.hasTeam(teamID)) {
//                 match = matchup;
//             }
//         });
//         return match;
//     }
//     getWeekAverage() {
//         var weekScore = 0;
//         var numMatches = 0;
//         this.matchups.forEach(matchup => {
//             if (matchup.byeWeek) {
//                 weekScore += matchup.home.score;
//                 numMatches += 1;
//             }
//             else {
//                 weekScore += matchup.home.score + matchup.away.score;
//                 numMatches += 2;
//             }
//         });
//         return weekScore / numMatches;
//     }
// }
// class Matchup {
//     constructor(home, away, weekNumber, isPlayoff) {
//         this.home = home;
//         this.weekNumber = weekNumber;
//         this.isPlayoffs = isPlayoff;
//         if (away == undefined) {
//             this.byeWeek = true;
//             this.isUpset = false;
//             this.isTie = false;
//         }
//         else {
//             this.away = away;
//             if (home.projectedScore > away.projectedScore) {
//                 this.projectedWinner = home.teamID;
//             }
//             else {
//                 this.projectedWinner = away.teamID;
//             }
//             this.projectedMOV = (Math.abs(home.projectedScore - away.projectedScore));
//             if (home.score > away.score) {
//                 this.winner = home.teamID;
//             }
//             else if (home.score < away.score) {
//                 this.winner = away.teamID;
//             }
//             else {
//                 this.isTie = true;
//                 this.isUpset = false;
//             }
//             this.marginOfVictory = (Math.abs(home.score - away.score));
//             this.byeWeek = false;
//             if (this.projectedWinner != this.winner) {
//                 this.isUpset = true;
//             }
//             else {
//                 this.isUpset = false;
//             }
//         }
//     }
//     hasTeam(teamID) {
//         if (this.byeWeek != true) {
//             if (this.home.teamID == teamID || this.away.teamID == teamID) {
//                 return true;
//             }
//             else {
//                 if (this.home.teamID == teamID) {
//                     return true;
//                 }
//             }
//         }
//     }
//     getTeam(teamID) {
//         if (this.home.teamID == teamID) {
//             return this.home;
//         }
//         else if (this.away.teamID == teamID) {
//             return this.away;
//         }
//     }
//     getOpponent(teamID) {
//         if (this.home.teamID == teamID && this.byeWeek == false) {
//             return this.away;
//         }
//         else if (this.away.teamID == teamID) {
//             return this.home;
//         }
//         else {
//             return null;
//         }
//     }
// }
// class Team {
//     constructor(teamID, players, activeLineupSlots, opponentID) {
//         this.lineup = [];
//         this.bench = [];
//         this.IR = [];
//         this.opponentID = opponentID;
//         for (var i = 0; i < players.length; i++) {
//             let player = players[i];
//             if (player.lineupSlotID == 21) {
//                 this.IR.push(player);
//             }
//             else if (player.lineupSlotID == 20) {
//                 this.bench.push(player);
//             }
//             else {
//                 this.lineup.push(player);
//             }
//         }
//         this.teamID = teamID;
//         this.score = this.getTeamScore(this.lineup);
//         this.potentialPoints = this.getTeamScore(this.getOptimalLineup(activeLineupSlots));
//         this.projectedScore = this.getProjectedScore(this.lineup);
//     }
//     getOptimalLineup(activeLineupSlots) {
//         var rosterSlots = [];
//         for (let i in activeLineupSlots) {
//             for (let w = 0; w < activeLineupSlots[i][1]; w++) {
//                 rosterSlots.push(activeLineupSlots[i][0]);
//             }
//         }
//         var optimalLineup = new Array();
//         for (let x in rosterSlots) {
//             let highScore = 0;
//             let bestPlayer = null;
//             let eligibleWeekPlayers = [];
//             let players = this.lineup.concat(this.bench, this.IR);
//             for (let y in players) {
//                 if (players[y].isEligible(parseInt(rosterSlots[x])) && !includesPlayer(players[y], optimalLineup)) {
//                     eligibleWeekPlayers.push(players[y]);
//                 }
//             }
//             for (let z in eligibleWeekPlayers) {
//                 if (eligibleWeekPlayers[z].score > highScore) {
//                     highScore = eligibleWeekPlayers[z].score;
//                     bestPlayer = eligibleWeekPlayers[z];
//                 }
//             }
//             if (bestPlayer != null) {
//                 optimalLineup.push(bestPlayer);
//                 highScore = 0;
//             }
//         }
//         return optimalLineup;
//     }
//     getTeamScore(players) {
//         var score = 0;
//         for (let i in players) {
//             if (players[i].score != null && players[i].score != 'undefined') {
//                 score += players[i].score;
//             }
//         }
//         return score;
//     }
//     getProjectedScore(players) {
//         var projectedScore = 0;
//         for (let i in players) {
//             if (players[i].projectedScore != null && players[i].projectedScore != 'undefined') {
//                 this.projectedScore += players[i].projectedScore;
//             }
//         }
//         return projectedScore;
//     }
// }
// var SEASON_PORTION;
// (function (SEASON_PORTION) {
//     SEASON_PORTION["REGULAR"] = "Regular Season";
//     SEASON_PORTION["POST"] = "Post-Season";
//     SEASON_PORTION["ALL"] = "Complete Season";
// })(SEASON_PORTION || (SEASON_PORTION = {}));
// var DRAFT_TYPE;
// (function (DRAFT_TYPE) {
//     DRAFT_TYPE[DRAFT_TYPE["AUCTION"] = 0] = "AUCTION";
//     DRAFT_TYPE[DRAFT_TYPE["SNAKE"] = 1] = "SNAKE";
//     DRAFT_TYPE[DRAFT_TYPE["LINEAR"] = 2] = "LINEAR";
// })(DRAFT_TYPE || (DRAFT_TYPE = {}));
// var LEAGUE_TYPE;
// (function (LEAGUE_TYPE) {
//     LEAGUE_TYPE[LEAGUE_TYPE["DYNASTY"] = 0] = "DYNASTY";
//     LEAGUE_TYPE[LEAGUE_TYPE["REDRAFT"] = 1] = "REDRAFT";
// })(LEAGUE_TYPE || (LEAGUE_TYPE = {}));
// var SCORING_TYPE;
// (function (SCORING_TYPE) {
//     SCORING_TYPE[SCORING_TYPE["STANDARD"] = 0] = "STANDARD";
//     SCORING_TYPE[SCORING_TYPE["HALF_PPR"] = 1] = "HALF_PPR";
//     SCORING_TYPE[SCORING_TYPE["FULL_PPR"] = 2] = "FULL_PPR";
// })(SCORING_TYPE || (SCORING_TYPE = {}));
// var POSITION;
// (function (POSITION) {
//     POSITION["QB"] = "QB";
//     POSITION["RB"] = "RB";
//     POSITION["WR"] = "WR";
//     POSITION["TE"] = "TE";
//     POSITION["K"] = "K";
//     POSITION["D_ST"] = "D/ST";
//     POSITION["DL"] = "DL";
//     POSITION["LB"] = "LB";
//     POSITION["DB"] = "DB";
// })(POSITION || (POSITION = {}));
// function getPosition(eligibleSlots) {
//     if (eligibleSlots[0] == 0) {
//         return POSITION.QB;
//     }
//     else if (eligibleSlots[0] == 2) {
//         return POSITION.RB;
//     }
//     else if (eligibleSlots[0] == 3) {
//         return POSITION.WR;
//     }
//     else if (eligibleSlots[0] == 16) {
//         return POSITION.D_ST;
//     }
//     else if (eligibleSlots[0] == 17) {
//         return POSITION.K;
//     }
//     else if (eligibleSlots[0] == 5) {
//         return POSITION.TE;
//     }
// }
// function getLineupSlot(lineupSlotID) {
//     if (lineupSlotID == 0) {
//         return "QB";
//     }
//     else if (lineupSlotID == 2) {
//         return "RB";
//     }
//     else if (lineupSlotID == 23) {
//         return "FLEX";
//     }
//     else if (lineupSlotID == 20) {
//         return "BENCH";
//     }
//     else if (lineupSlotID == 21) {
//         return "IR";
//     }
//     else if (lineupSlotID == 4) {
//         return "WR";
//     }
//     else if (lineupSlotID == 16) {
//         return "D/ST";
//     }
//     else if (lineupSlotID == 17) {
//         return "K";
//     }
//     else if (lineupSlotID == 6) {
//         return "TE";
//     }
// }
// function includesPlayer(player, lineup) {
//     var includes = false;
//     lineup.forEach(element => {
//         if (player.playerID == element.playerID) {
//             includes = true;
//         }
//     });
//     return includes;
// }
