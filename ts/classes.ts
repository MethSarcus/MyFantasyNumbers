// //Class for containing a members week data
// class League {
//     id: number;
//     weeks: Week[];
//     season: number;
//     members: Member[];
//     settings: Settings;
//     constructor(id, season, weeks, members, settings) {
//         this.id = id;
//         this.weeks = weeks;
//         this.season = season;
//         this.members = members;
//         this.settings = settings;
//     }

//     setMemberStats() : void {
//         this.weeks.forEach( week => {
//             let weekMatches = [];
//             week.matchups.forEach(matchup => {
//                 if (matchup.byeWeek != true) {
//                     if (matchup.isTie != true) {
//                         this.getMember(matchup.winner).stats.wins += 1;
//                         this.getMember(matchup.getOpponent(matchup.winner).teamID).stats.losses += 1;
//                     } else {
//                         this.getMember(matchup.home.teamID).stats.ties += 1;
//                         this.getMember(matchup.away.teamID).stats.ties += 1;
//                     }
//                     this.getMember(matchup.home.teamID).stats.pa += matchup.away.score;
//                     this.getMember(matchup.away.teamID).stats.pa += matchup.home.score;
                    
//                     weekMatches.push(matchup.home);
//                     weekMatches.push(matchup.away);
//                 } else {
//                     weekMatches.push(matchup.home);
//                 }
//             });
//             weekMatches.sort(function(x: Team, y: Team) {
//                 if (x.score < y.score) {
//                   return -1;
//                 }
//                 if (x.score > y.score) {
//                   return 1;
//                 }
//                 return 0;
//               });

//             for (var i = 0; i < weekMatches.length; i++){
//                 let curMember : Member = this.getMember(weekMatches[i].teamID);
//                 let curMemberTeam : Team = weekMatches[i];
//                 curMember.stats.pf += curMemberTeam.score;
//                 curMember.stats.pp += curMemberTeam.potentialPoints;
//                 curMember.stats.powerWins += i;
//                 curMember.stats.powerLosses += (weekMatches.length - 1 - i);

//             }
//        });

//        this.setWinStreaks();
       
//     }

//     setWinStreaks() : void {
//         this.members.forEach(member => {
//             var highest = 0;
//             var currentStreak = 0;
//             this.weeks.forEach(week => {
//                 let currentMatchup = week.getTeamMatchup(member.teamID)
//                 if (currentMatchup.byeWeek == false && currentMatchup.isTie == false){
//                     if (currentMatchup.winner == member.teamID){
//                         currentStreak += 1;
//                     } else {
//                         if (currentStreak > highest){
//                             highest = currentStreak;
//                         }
//                     }
//                 }
//             });
//             member.stats.longestWinStreak = highest;
//         });
//     }

//     getMember(_teamID: number) : Member {
//         var found;
//         this.members.forEach(member => {
//             if (_teamID = member.teamID) {
//                 found = member;
//             }
//         });
//         return found;
//     }
// }

// class Settings {
//     activeLineupSlots: number[];
//     lineupSlots: number[];
//     regularSeasonLength: number;
//     playoffLength: number;
//     draftType: DRAFT_TYPE;
//     leagueType: LEAGUE_TYPE;
//     scoringType: SCORING_TYPE;

//     constructor(activeLineupSlots, lineupSlots, regularSeasonLength, playoffLength, draftType) {
//         this.activeLineupSlots = activeLineupSlots;
//         this.lineupSlots = lineupSlots;
//         this.regularSeasonLength = regularSeasonLength;
//         this.playoffLength = playoffLength;
//         this.draftType = draftType;

//     }
// }

// class Draft {
//     leagueID: number;
//     year: number;
//     draftType: DRAFT_TYPE;
//     auctionBudget: number;
//     pickOrder: number[];
//     draftPicks: DraftPick[];
//     constructor(leagueID, year, draftType, pickOrder, draftPicks, auctionBudget) {
//         this.leagueID = leagueID;
//         this.year = year;
//         this.draftType = draftType;
//         this.auctionBudget = auctionBudget
//         this.pickOrder = pickOrder;
//         this.draftPicks = draftPicks;
//     }
// }

// class DraftPick {
//     teamID: number;
//     overallPickNumber: number;
//     roundID: number;
//     roundPickNumber: number;
//     playerID: number;
//     playerAuctionCost: number;
//     owningTeamIDs: number[];
//     nominatingTeamID: number;
//     autoDraftTeamID: number;
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
//     ID: number;
//     firstName: string;
//     lastName: string;
//     teamLocation: string;
//     teamNickname: string;
//     teamAbbrev: string;
//     division: string;
//     teamID: number;
//     logoURL: string;
//     transactions: any;
//     stats: Stats;
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
// }

// class Stats {
//     wins: number;
//     losses: number;
//     ties: number;
//     powerRank: number;
//     powerWins: number;
//     powerLosses: number;
//     finalStanding: number;
//     pf: number;
//     pa: number;
//     pp: number;
//     longestWinStreak: number;
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

//     getWinPct() : number{
//         if (this.wins == 0){
//             return 0.00;
//         } else {
//             return this.wins/(this.wins + this.losses);
//         }
        
//     }
// }

// class Player {
//     firstName: any;
//     lastName: any;
//     eligibleSlots: any;
//     score: any;
//     projectedScore: any;
//     position: any;
//     realTeamID: any;
//     playerID: any;
//     lineupSlotID: any;
//     weekNumber: any;
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

//     isEligible(slot: number) : boolean {
//         for (var i = 0; i < this.eligibleSlots.length; i++){
//             if (this.eligibleSlots[i] == slot) {
//                 return true;
//             }
//         }
//     }
// }

// class EmptySlot {
//     firstName: string;
//     lastName: string;
//     actualScore: number;
//     projectedScore: number;
//     position: string;
//     realTeamID: number;
//     jerseyNumber: number;
//     playerID: number;
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
//     weekNumber: number;
//     isPlayoffs: boolean;
//     matchups: Matchup[];

//     constructor(weekNumber, isPlayoffs, matchups){
//         this.weekNumber = weekNumber;
//         this.isPlayoffs = isPlayoffs;
//         this.matchups = matchups;
//     }

//     getTeam(teamID: number) : Team {
//         var team: Team;
//         this.matchups.forEach( matchup => {
//             if (matchup.hasTeam(teamID)) {
//                 team = matchup.getTeam(teamID);
//             }
//         });
//         return team;
//     }

//     getTeamMatchup(teamID: number) : Matchup {
//         var match: Matchup;
//         this.matchups.forEach(matchup => {
//             if (matchup.hasTeam(teamID)) {
//                 match = matchup;
//             }
//         });
//         return match;
//     }
// }

// class Matchup {
//     home: Team;
//     weekNumber: number;
//     isPlayoffs: boolean;
//     isTie: boolean;
//     byeWeek: boolean;
//     isUpset: boolean;
//     away: any;
//     projectedWinner: number;
//     projectedMOV: number;
//     winner: number;
//     marginOfVictory: number;
//     constructor(home, away, weekNumber, isPlayoff) {
//         this.home = home;
//         this.weekNumber = weekNumber;
//         this.isPlayoffs = isPlayoff;
//         if (away == undefined){
//             this.byeWeek = true;
//             this.isUpset = false;
//             this.isTie = false;
//         } else{
//             this.away = away;
//             if (home.projectedScore > away.projectedScore) {
//                 this.projectedWinner = home.teamID;
//             } else {
//                 this.projectedWinner = away.teamID
//             }
//             this.projectedMOV = (Math.abs(home.projectedScore - away.projectedScore));
//             if (home.score > away.score) {
//                 this.winner = home.teamID;
//             } else if (home.score < away.score) {
//                 this.winner = away.teamID;
//             } else {
//                 this.isTie = true;
//                 this.isUpset = false;
//             }
//             this.marginOfVictory = (Math.abs(home.score - away.score));
//             this.byeWeek = false;
//             if (this.projectedWinner != this.winner) {
//                 this.isUpset = true;
//             } else {
//                 this.isUpset = false;
//             }
//         }
//     }

//     hasTeam(teamID: number): boolean {
//         if (this.home.teamID == teamID || this.away.teamID == teamID) {
//             return true;
//         }
//     }

//     getTeam(teamID: number) : Team {
//         if (this.home.teamID == teamID) {
//             return this.home;
//         } else if (this.away.teamID == teamID) {
//             return this.away;
//         }
//     }

//     getOpponent(teamID: number) : Team {
//         if (this.home.teamID == teamID && this.byeWeek == false) {
//             return this.away;
//         } else if (this.away.teamID == teamID) {
//             return this.home;
//         } else {
//             return null;
//         }
//     }
// }

// class Team {
//     lineup: Player[];
//     bench: Player[];
//     IR: Player[];
//     teamID: number;
//     score: number;
//     potentialPoints: number;
//     projectedScore: number;
//     opponentID: number;
//     constructor(teamID, players, activeLineupSlots, opponentID) {
//         this.lineup = [];
//         this.bench = [];
//         this.IR = [];
//         this.opponentID = opponentID;
//         for (var i = 0; i < players.length; i++){
//             let player = players[i];
//             if (player.lineupSlotID == 21) {
//                 this.IR.push(player);
//             } else if (player.lineupSlotID == 20) {
//                 this.bench.push(player);
//             } else {
//                 this.lineup.push(player);
//             }
//         }
//         this.teamID = teamID;
//         this.score = this.getTeamScore(this.lineup);
//         this.potentialPoints = this.getTeamScore(this.getOptimalLineup(activeLineupSlots));
//         this.projectedScore = this.getProjectedScore(this.lineup);
//     }

//     getOptimalLineup(activeLineupSlots: number[]): Player[] {
//         var rosterSlots = [];
//         for (let i in activeLineupSlots) {
//             for (let w = 0; w < activeLineupSlots[i][1]; w++) {
//                 rosterSlots.push(activeLineupSlots[i][0]);
//             }
//         }
//         var optimalLineup = new Array<Player>();
//         for (let x in rosterSlots) {
//             let highScore = 0;
//             let bestPlayer = null;
//             let eligibleWeekPlayers = [];
//             let players = this.lineup.concat(this.bench, this.IR);
//             for (let y in players) {
//                 if (players[y].isEligible(parseInt(rosterSlots[x])) && includesPlayer(players[y], optimalLineup)) {
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

//     getTeamScore(players: Player[]): number {
//         var score = 0;
//         for (let i in players) {
//             if (players[i].score != null || players[i].score != 'undefined') {
//                 score += players[i].score;
//             }
//         }
//         return score;
//     }

//     getProjectedScore(players: Player[]): number {
//         var projectedScore = 0;
//         for (let i in players) {
//             if (players[i].projectedScore != null || players[i].projectedScore != 'undefined') {
//                 this.projectedScore += players[i].projectedScore;
//             }
//         }
//         return projectedScore;
//     }
// }

// enum DRAFT_TYPE {
//     AUCTION,
//     SNAKE,
//     LINEAR
// }

// enum LEAGUE_TYPE {
//     DYNASTY,
//     REDRAFT
// }

// enum SCORING_TYPE {
//     STANDARD,
//     HALF_PPR,
//     FULL_PPR
// }

// enum POSITION {
//     QB = "QB",
//     RB = "RB",
//     WR = "WR",
//     TE = "TE",
//     K = "K",
//     D_ST = "D/ST",
//     DL = "DL",
//     LB = "LB",
//     DB = "DB"
// }

// function getPosition(eligibleSlots: number[]): POSITION {
//     if (eligibleSlots[0] == 0) {
//         return POSITION.QB;
//     } else if (eligibleSlots[0] == 2) {
//         return POSITION.RB;
//     } else if (eligibleSlots[0] == 3) {
//         return POSITION.WR;
//     } else if (eligibleSlots[0] == 16) {
//         return POSITION.D_ST;
//     } else if (eligibleSlots[0] == 17) {
//         return POSITION.K;
//     } else if (eligibleSlots[0] == 5) {
//         return POSITION.TE;
//     }
// }

// function getLineupSlot(lineupSlotID: number): string {
//     if (lineupSlotID == 0) {
//         return "QB";
//     } else if (lineupSlotID == 2) {
//         return "RB";
//     } else if (lineupSlotID == 23) {
//         return "FLEX";
//     } else if (lineupSlotID == 20) {
//         return "BENCH";
//     } else if (lineupSlotID == 21) {
//         return "IR";
//     } else if (lineupSlotID == 4) {
//         return "WR";
//     } else if (lineupSlotID == 16) {
//         return "D/ST";
//     } else if (lineupSlotID == 17) {
//         return "K";
//     } else if (lineupSlotID == 6) {
//         return "TE";
//     }
// }

// function includesPlayer(player: Player, lineup: Player[]) : boolean {
//     var includes = false;
//     lineup.forEach(element => {
//         if (player.playerID == element.playerID) {
//             includes = true;
//         }
//     });
//     return includes;
// }


