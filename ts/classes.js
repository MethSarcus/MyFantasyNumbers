//Class for containing a members week data
var League = /** @class */ (function () {
    function League(id, season, weeks, members, settings) {
        this.id = id;
        this.weeks = weeks;
        this.season = season;
        this.members = members;
        this.settings = settings;
    }
    League.prototype.setMemberStats = function () {
        var _this = this;
        this.weeks.forEach(function (week) {
            var weekMatches = [];
            week.matchups.forEach(function (matchup) {
                if (matchup.byeWeek != true) {
                    if (matchup.isTie != true) {
                        _this.getMember(matchup.winner).stats.wins += 1;
                        _this.getMember(matchup.getOpponent(matchup.winner).teamID).stats.losses += 1;
                    }
                    else {
                        _this.getMember(matchup.home.teamID).stats.ties += 1;
                        _this.getMember(matchup.away.teamID).stats.ties += 1;
                    }
                    _this.getMember(matchup.home.teamID).stats.pa += matchup.away.score;
                    _this.getMember(matchup.away.teamID).stats.pa += matchup.home.score;
                    weekMatches.push(matchup.home);
                    weekMatches.push(matchup.away);
                }
                else {
                    weekMatches.push(matchup.home);
                }
            });
            weekMatches.sort(function (x, y) {
                if (x.score < y.score) {
                    return -1;
                }
                if (x.score > y.score) {
                    return 1;
                }
                return 0;
            });
            for (var i = 0; i < weekMatches.length; i++) {
                var curMember = _this.getMember(weekMatches[i].teamID);
                var curMemberTeam = weekMatches[i];
                curMember.stats.pf += curMemberTeam.score;
                curMember.stats.pp += curMemberTeam.potentialPoints;
                curMember.stats.powerWins += i;
                curMember.stats.powerLosses += (weekMatches.length - 1 - i);
            }
        });
        this.setWinStreaks();
    };
    League.prototype.setWinStreaks = function () {
        var _this = this;
        this.members.forEach(function (member) {
            var highest = 0;
            var currentStreak = 0;
            _this.weeks.forEach(function (week) {
                var currentMatchup = week.getTeamMatchup(member.teamID);
                if (currentMatchup.byeWeek == false && currentMatchup.isTie == false) {
                    if (currentMatchup.winner == member.teamID) {
                        currentStreak += 1;
                    }
                    else {
                        if (currentStreak > highest) {
                            highest = currentStreak;
                        }
                    }
                }
            });
            member.stats.longestWinStreak = highest;
        });
    };
    League.prototype.getMember = function (_teamID) {
        var found;
        this.members.forEach(function (member) {
            if (_teamID = member.teamID) {
                found = member;
            }
        });
        return found;
    };
    return League;
}());
var Settings = /** @class */ (function () {
    function Settings(activeLineupSlots, lineupSlots, regularSeasonLength, playoffLength, draftType) {
        this.activeLineupSlots = activeLineupSlots;
        this.lineupSlots = lineupSlots;
        this.regularSeasonLength = regularSeasonLength;
        this.playoffLength = playoffLength;
        this.draftType = draftType;
    }
    return Settings;
}());
var Draft = /** @class */ (function () {
    function Draft(leagueID, year, draftType, pickOrder, draftPicks, auctionBudget) {
        this.leagueID = leagueID;
        this.year = year;
        this.draftType = draftType;
        this.auctionBudget = auctionBudget;
        this.pickOrder = pickOrder;
        this.draftPicks = draftPicks;
    }
    return Draft;
}());
var DraftPick = /** @class */ (function () {
    function DraftPick(teamID, overrallPickNumber, roundID, roundPickNumber, playerID, playerAuctionCost, owningTeamIDs, nominatingTeamID, autoDraftTeamID) {
        this.teamID = teamID;
        this.overallPickNumber = overrallPickNumber;
        this.roundID = roundID;
        this.roundPickNumber = roundID;
        this.playerID = playerID;
        this.playerAuctionCost = playerAuctionCost;
        this.owningTeamIDs = owningTeamIDs; //lists team id's that have owned the pick
        this.nominatingTeamID = nominatingTeamID; //used to see what team id nominated the player
        this.autoDraftTeamID = autoDraftTeamID;
    }
    return DraftPick;
}());
var Member = /** @class */ (function () {
    function Member(memberID, firstName, lastName, teamLocation, teamNickname, teamAbbrev, division, teamID, logoURL, transactions, stats) {
        this.ID = memberID;
        this.firstName = firstName;
        this.lastName = lastName;
        this.teamLocation = teamLocation;
        this.teamNickname = teamNickname;
        this.teamAbbrev = teamAbbrev;
        this.division = division;
        this.teamID = teamID;
        this.logoURL = logoURL;
        this.transactions = transactions;
        this.stats = stats;
    }
    return Member;
}());
var Stats = /** @class */ (function () {
    function Stats(finalStanding) {
        this.finalStanding = finalStanding;
        this.wins = 0;
        this.losses = 0;
        this.ties = 0;
        this.powerWins = 0;
        this.powerLosses = 0;
        this.pf = 0;
        this.pa = 0;
        this.pp = 0;
    }
    Stats.prototype.getWinPct = function () {
        if (this.wins == 0) {
            return 0.00;
        }
        else {
            return this.wins / (this.wins + this.losses);
        }
    };
    return Stats;
}());
var Player = /** @class */ (function () {
    function Player(firstName, lastName, score, projectedScore, position, realTeamID, playerID, lineupSlotID, eligibleSlots, weekNumber) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.eligibleSlots = eligibleSlots;
        this.score = score;
        this.projectedScore = projectedScore;
        this.position = position;
        this.realTeamID = realTeamID;
        this.playerID = playerID;
        this.lineupSlotID = lineupSlotID;
        this.weekNumber = weekNumber;
    }
    Player.prototype.isEligible = function (slot) {
        for (var i = 0; i < this.eligibleSlots.length; i++) {
            if (this.eligibleSlots[i] == slot) {
                return true;
            }
        }
    };
    return Player;
}());
var EmptySlot = /** @class */ (function () {
    function EmptySlot() {
        this.firstName = "Empty";
        this.lastName = "Slot";
        this.actualScore = 0;
        this.projectedScore = 0;
        this.position = "EMPTY";
        this.realTeamID = -1;
        this.jerseyNumber = -1;
        this.playerID = -1;
    }
    return EmptySlot;
}());
var Week = /** @class */ (function () {
    function Week(weekNumber, isPlayoffs, matchups) {
        this.weekNumber = weekNumber;
        this.isPlayoffs = isPlayoffs;
        this.matchups = matchups;
    }
    Week.prototype.getTeam = function (teamID) {
        var team;
        this.matchups.forEach(function (matchup) {
            if (matchup.hasTeam(teamID)) {
                team = matchup.getTeam(teamID);
            }
        });
        return team;
    };
    Week.prototype.getTeamMatchup = function (teamID) {
        var match;
        this.matchups.forEach(function (matchup) {
            if (matchup.hasTeam(teamID)) {
                match = matchup;
            }
        });
        return match;
    };
    return Week;
}());
var Matchup = /** @class */ (function () {
    function Matchup(home, away, weekNumber, isPlayoff) {
        this.home = home;
        this.weekNumber = weekNumber;
        this.isPlayoffs = isPlayoff;
        if (away == undefined) {
            this.byeWeek = true;
            this.isUpset = false;
            this.isTie = false;
        }
        else {
            this.away = away;
            if (home.projectedScore > away.projectedScore) {
                this.projectedWinner = home.teamID;
            }
            else {
                this.projectedWinner = away.teamID;
            }
            this.projectedMOV = (Math.abs(home.projectedScore - away.projectedScore));
            if (home.score > away.score) {
                this.winner = home.teamID;
            }
            else if (home.score < away.score) {
                this.winner = away.teamID;
            }
            else {
                this.isTie = true;
                this.isUpset = false;
            }
            this.marginOfVictory = (Math.abs(home.score - away.score));
            this.byeWeek = false;
            if (this.projectedWinner != this.winner) {
                this.isUpset = true;
            }
            else {
                this.isUpset = false;
            }
        }
    }
    Matchup.prototype.hasTeam = function (teamID) {
        if (this.home.teamID == teamID || this.away.teamID == teamID) {
            return true;
        }
    };
    Matchup.prototype.getTeam = function (teamID) {
        if (this.home.teamID == teamID) {
            return this.home;
        }
        else if (this.away.teamID == teamID) {
            return this.away;
        }
    };
    Matchup.prototype.getOpponent = function (teamID) {
        if (this.home.teamID == teamID && this.byeWeek == false) {
            return this.away;
        }
        else if (this.away.teamID == teamID) {
            return this.home;
        }
        else {
            return null;
        }
    };
    return Matchup;
}());
var Team = /** @class */ (function () {
    function Team(teamID, players, activeLineupSlots, opponentID) {
        this.lineup = [];
        this.bench = [];
        this.IR = [];
        this.opponentID = opponentID;
        for (var i = 0; i < players.length; i++) {
            var player = players[i];
            if (player.lineupSlotID == 21) {
                this.IR.push(player);
            }
            else if (player.lineupSlotID == 20) {
                this.bench.push(player);
            }
            else {
                this.lineup.push(player);
            }
        }
        this.teamID = teamID;
        this.score = this.getTeamScore(this.lineup);
        this.potentialPoints = this.getTeamScore(this.getOptimalLineup(activeLineupSlots));
        this.projectedScore = this.getProjectedScore(this.lineup);
    }
    Team.prototype.getOptimalLineup = function (activeLineupSlots) {
        var rosterSlots = [];
        for (var i in activeLineupSlots) {
            for (var w = 0; w < activeLineupSlots[i][1]; w++) {
                rosterSlots.push(activeLineupSlots[i][0]);
            }
        }
        var optimalLineup = new Array();
        for (var x in rosterSlots) {
            var highScore = 0;
            var bestPlayer = null;
            var eligibleWeekPlayers = [];
            var players = this.lineup.concat(this.bench, this.IR);
            for (var y in players) {
                if (players[y].isEligible(parseInt(rosterSlots[x])) && includesPlayer(players[y], optimalLineup)) {
                    eligibleWeekPlayers.push(players[y]);
                }
            }
            for (var z in eligibleWeekPlayers) {
                if (eligibleWeekPlayers[z].score > highScore) {
                    highScore = eligibleWeekPlayers[z].score;
                    bestPlayer = eligibleWeekPlayers[z];
                }
            }
            if (bestPlayer != null) {
                optimalLineup.push(bestPlayer);
                highScore = 0;
            }
        }
        return optimalLineup;
    };
    Team.prototype.getTeamScore = function (players) {
        var score = 0;
        for (var i in players) {
            if (players[i].score != null || players[i].score != 'undefined') {
                score += players[i].score;
            }
        }
        return score;
    };
    Team.prototype.getProjectedScore = function (players) {
        var projectedScore = 0;
        for (var i in players) {
            if (players[i].projectedScore != null || players[i].projectedScore != 'undefined') {
                this.projectedScore += players[i].projectedScore;
            }
        }
        return projectedScore;
    };
    return Team;
}());
var DRAFT_TYPE;
(function (DRAFT_TYPE) {
    DRAFT_TYPE[DRAFT_TYPE["AUCTION"] = 0] = "AUCTION";
    DRAFT_TYPE[DRAFT_TYPE["SNAKE"] = 1] = "SNAKE";
    DRAFT_TYPE[DRAFT_TYPE["LINEAR"] = 2] = "LINEAR";
})(DRAFT_TYPE || (DRAFT_TYPE = {}));
var LEAGUE_TYPE;
(function (LEAGUE_TYPE) {
    LEAGUE_TYPE[LEAGUE_TYPE["DYNASTY"] = 0] = "DYNASTY";
    LEAGUE_TYPE[LEAGUE_TYPE["REDRAFT"] = 1] = "REDRAFT";
})(LEAGUE_TYPE || (LEAGUE_TYPE = {}));
var SCORING_TYPE;
(function (SCORING_TYPE) {
    SCORING_TYPE[SCORING_TYPE["STANDARD"] = 0] = "STANDARD";
    SCORING_TYPE[SCORING_TYPE["HALF_PPR"] = 1] = "HALF_PPR";
    SCORING_TYPE[SCORING_TYPE["FULL_PPR"] = 2] = "FULL_PPR";
})(SCORING_TYPE || (SCORING_TYPE = {}));
var POSITION;
(function (POSITION) {
    POSITION["QB"] = "QB";
    POSITION["RB"] = "RB";
    POSITION["WR"] = "WR";
    POSITION["TE"] = "TE";
    POSITION["K"] = "K";
    POSITION["D_ST"] = "D/ST";
    POSITION["DL"] = "DL";
    POSITION["LB"] = "LB";
    POSITION["DB"] = "DB";
})(POSITION || (POSITION = {}));
function getPosition(eligibleSlots) {
    if (eligibleSlots[0] == 0) {
        return POSITION.QB;
    }
    else if (eligibleSlots[0] == 2) {
        return POSITION.RB;
    }
    else if (eligibleSlots[0] == 3) {
        return POSITION.WR;
    }
    else if (eligibleSlots[0] == 16) {
        return POSITION.D_ST;
    }
    else if (eligibleSlots[0] == 17) {
        return POSITION.K;
    }
    else if (eligibleSlots[0] == 5) {
        return POSITION.TE;
    }
}
function getLineupSlot(lineupSlotID) {
    if (lineupSlotID == 0) {
        return "QB";
    }
    else if (lineupSlotID == 2) {
        return "RB";
    }
    else if (lineupSlotID == 23) {
        return "FLEX";
    }
    else if (lineupSlotID == 20) {
        return "BENCH";
    }
    else if (lineupSlotID == 21) {
        return "IR";
    }
    else if (lineupSlotID == 4) {
        return "WR";
    }
    else if (lineupSlotID == 16) {
        return "D/ST";
    }
    else if (lineupSlotID == 17) {
        return "K";
    }
    else if (lineupSlotID == 6) {
        return "TE";
    }
}
function includesPlayer(player, lineup) {
    var includes = false;
    lineup.forEach(function (element) {
        if (player.playerID == element.playerID) {
            includes = true;
        }
    });
    return includes;
}
