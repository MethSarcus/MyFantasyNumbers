var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var League = (function () {
    function League(weeks, members, settings, leaguePlatform) {
        this.id = settings.leagueInfo.leagueId;
        this.weeks = weeks;
        this.season = settings.leagueInfo.seasonId;
        this.members = members;
        this.settings = settings;
        this.seasonPortion = SEASON_PORTION.ALL;
        this.leagueName = settings.leagueInfo.leagueName;
        this.leaguePlatform = leaguePlatform;
    }
    League.prototype.setPowerRanks = function () {
        var _this = this;
        this.weeklyPowerRanks = new Map();
        this.getSeasonPortionWeeks().forEach(function (week) {
            _this.addPowerWeek(week);
        });
    };
    League.prototype.addPowerWeek = function (week) {
        var weeklyPowerRanks = new WeeklyPowerRanks(week.weekNumber, week.isPlayoffs);
        week.matchups.forEach(function (matchup) {
            weeklyPowerRanks.addMatchup(matchup);
        });
        weeklyPowerRanks.setRanks();
        this.weeklyPowerRanks.set(week.weekNumber, weeklyPowerRanks);
    };
    League.prototype.setMemberStats = function (weeks) {
        var _this = this;
        weeks.forEach(function (week) {
            var weekMatches = [];
            week.matchups.forEach(function (matchup) {
                if (matchup.byeWeek !== true) {
                    if (matchup.isTie !== true) {
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
                curMember.stats.gutPlayersPlayed += curMemberTeam.gutPlayers;
                curMember.stats.gutPoints += curMemberTeam.gutDifference;
                curMember.stats.pf += curMemberTeam.score;
                curMember.stats.pp += curMemberTeam.potentialPoints;
                curMember.stats.OPSLAP += curMemberTeam.projectedBestLineupPoints;
                curMember.stats.powerWins += i;
                curMember.stats.powerLosses += (weekMatches.length - 1 - i);
            }
            weekMatches.sort(function (x, y) {
                if (x.potentialPoints < y.potentialPoints) {
                    return -1;
                }
                if (x.potentialPoints > y.potentialPoints) {
                    return 1;
                }
                return 0;
            });
            for (var i = 0; i < weekMatches.length; i++) {
                var curMember = _this.getMember(weekMatches[i].teamID);
                curMember.stats.potentialPowerWins += i;
                curMember.stats.potentialPowerLosses += (weekMatches.length - 1 - i);
            }
        });
        this.members.forEach(function (member) {
            member.setAdvancedStats(weeks);
            member.stats.rank = _this.getRank(member.teamID);
            member.stats.roundStats();
            member.stats.choicesThatCouldHaveWonMatchup = _this.getLosingDecisionAmount(member.teamID);
            member.stats.gameLostDueToSingleChoice = _this.getGamesLostDueToSingleChoice(member.teamID);
            member.stats.powerRank = _this.getPowerRankFinish(member.teamID);
            _this.setAverageMargins(member.teamID);
        });
    };
    League.prototype.resetStats = function () {
        this.members.forEach(function (member) {
            member.stats = new Stats(member.stats.finalStanding);
        });
    };
    League.prototype.getLeaguePF = function () {
        var pf = 0;
        this.members.forEach(function (member) {
            pf += member.stats.pf;
        });
        return roundToHundred(pf / this.members.length);
    };
    League.prototype.getLeaguePA = function () {
        var pa = 0;
        this.members.forEach(function (member) {
            pa += member.stats.pa;
        });
        return roundToHundred(pa / this.members.length);
    };
    League.prototype.getLeaguePP = function () {
        var pp = 0;
        this.members.forEach(function (member) {
            pp += member.stats.pp;
        });
        return roundToHundred(pp / this.members.length);
    };
    League.prototype.getSeasonPortionWeeks = function () {
        var weekPortion = this.weeks;
        if (this.seasonPortion === SEASON_PORTION.REGULAR) {
            weekPortion = this.weeks.filter(function (it) {
                return it.isPlayoffs === false;
            });
        }
        else if (this.seasonPortion === SEASON_PORTION.POST) {
            weekPortion = this.weeks.filter(function (it) {
                return it.isPlayoffs === true;
            });
        }
        else if (weekPortion === []) {
            this.seasonPortion = SEASON_PORTION.POST;
            weekPortion = this.weeks.filter(function (it) {
                return it.isPlayoffs === true;
            });
        }
        return weekPortion;
    };
    League.prototype.getMember = function (teamID) {
        var found;
        this.members.forEach(function (member) {
            if (teamID === member.teamID) {
                found = member;
            }
        });
        return found;
    };
    League.prototype.getMemberWorstTeam = function (teamID) {
        var lowestScore = this.getSeasonPortionWeeks()[0].getTeam(teamID).score;
        var worstTeam = this.getSeasonPortionWeeks()[0].getTeam(teamID);
        this.getSeasonPortionWeeks().forEach(function (week) {
            if (week.getTeam(teamID).score < lowestScore) {
                lowestScore = week.getTeam(teamID).score;
                worstTeam = week.getTeam(teamID);
            }
        });
        return worstTeam;
    };
    League.prototype.getBiggestBoom = function (teamID) {
        var boomPlayer = this.getSeasonPortionWeeks()[0].getTeam(teamID).lineup[0];
        this.getSeasonPortionWeeks().forEach(function (week) {
            week.getTeam(teamID).lineup.forEach(function (player) {
                if (player.score > boomPlayer.score) {
                    boomPlayer = player;
                }
            });
        });
        return boomPlayer;
    };
    League.prototype.getMemberBestTeam = function (teamID) {
        var highestScore = this.getSeasonPortionWeeks()[0].getTeam(teamID).score;
        var bestTeam = this.getSeasonPortionWeeks()[0].getTeam(teamID);
        this.getSeasonPortionWeeks().forEach(function (week) {
            if (week.getTeam(teamID).score > highestScore) {
                highestScore = week.getTeam(teamID).score;
                bestTeam = week.getTeam(teamID);
            }
        });
        return bestTeam;
    };
    League.prototype.getBestWeekFinish = function (teamID) {
        var _this = this;
        var finish = 1;
        var bestWeekScore = this.getMemberBestTeam(teamID).score;
        this.members.forEach(function (member) {
            if (bestWeekScore < _this.getMemberBestTeam(member.teamID).score && member.teamID !== teamID) {
                finish += 1;
            }
        });
        return finish;
    };
    League.prototype.getWeek = function (weekNum) {
        var myWeek;
        this.weeks.forEach(function (week) {
            if (weekNum === week.weekNumber) {
                myWeek = week;
            }
        });
        return myWeek;
    };
    League.prototype.getWorstWeekFinish = function (teamID) {
        var _this = this;
        var finish = 1;
        var worstWeekScore = this.getMemberWorstTeam(teamID).score;
        this.members.forEach(function (member) {
            if (worstWeekScore > _this.getMemberWorstTeam(member.teamID).score && member.teamID !== teamID) {
                finish += 1;
            }
        });
        return finish;
    };
    League.prototype.getPointsAgainstFinish = function (teamID) {
        var finish = 1;
        var pa = this.getMember(teamID).stats.pa;
        this.members.forEach(function (member) {
            if (pa > member.stats.pa && member.teamID !== teamID) {
                finish += 1;
            }
        });
        return finish;
    };
    League.prototype.getPointsScoredFinish = function (teamID) {
        var finish = 1;
        var pf = this.getMember(teamID).stats.pf;
        this.members.forEach(function (member) {
            if (pf < member.stats.pf && member.teamID !== teamID) {
                finish += 1;
            }
        });
        return finish;
    };
    League.prototype.getPotentialPointsFinish = function (teamID) {
        var finish = 1;
        var pp = this.getMember(teamID).stats.pp;
        this.members.forEach(function (member) {
            if (pp < member.stats.pp && member.teamID !== teamID) {
                finish += 1;
            }
        });
        return finish;
    };
    League.prototype.getOPSLAPFinish = function (teamID) {
        var finish = 1;
        var opslap = this.getMember(teamID).stats.OPSLAP;
        this.members.forEach(function (member) {
            if (opslap < member.stats.OPSLAP && member.teamID !== teamID) {
                finish += 1;
            }
        });
        return finish;
    };
    League.prototype.getBestWeek = function (teamID) {
        var bestWeekMatchup = this.getSeasonPortionWeeks()[0].getTeamMatchup(teamID);
        var highestScore = this.getSeasonPortionWeeks()[0].getTeam(teamID).score;
        this.getSeasonPortionWeeks().forEach(function (week) {
            if (week.getTeam(teamID).score > highestScore) {
                highestScore = week.getTeam(teamID).score;
                bestWeekMatchup = week.getTeamMatchup(teamID);
            }
        });
        return bestWeekMatchup;
    };
    League.prototype.getWorstWeek = function (teamID) {
        var worstWeekMatchup = this.getSeasonPortionWeeks()[0].getTeamMatchup(teamID);
        var lowestScore = this.getSeasonPortionWeeks()[0].getTeam(teamID).score;
        this.getSeasonPortionWeeks().forEach(function (week) {
            if (week.getTeam(teamID).score < lowestScore) {
                lowestScore = week.getTeam(teamID).score;
                worstWeekMatchup = week.getTeamMatchup(teamID);
            }
        });
        return worstWeekMatchup;
    };
    League.prototype.getLargestMarginOfVictory = function () {
        var highestMOV = 0;
        var highestMOVMatchup;
        this.getSeasonPortionWeeks().forEach(function (week) {
            week.matchups.forEach(function (matchup) {
                if (matchup.marginOfVictory > highestMOV && !matchup.byeWeek) {
                    highestMOV = matchup.marginOfVictory;
                    highestMOVMatchup = matchup;
                }
            });
        });
        return highestMOVMatchup;
    };
    League.prototype.getSmallestMarginOfVictory = function () {
        var smallestMOV = null;
        var i = 0;
        while (smallestMOV === null) {
            if (this.getSeasonPortionWeeks()[i] && this.getSeasonPortionWeeks()[i].matchups) {
                smallestMOV = this.getSeasonPortionWeeks()[i].matchups[0].home.score;
            }
            else if (!this.getSeasonPortionWeeks()[i].matchups[0].byeWeek) {
                smallestMOV = this.getSeasonPortionWeeks()[i].matchups[0].away.score;
            }
            i++;
        }
        var smallestMOVMatchup;
        this.getSeasonPortionWeeks().forEach(function (week) {
            week.matchups.forEach(function (matchup) {
                if (matchup.marginOfVictory < smallestMOV && !matchup.byeWeek) {
                    smallestMOV = matchup.marginOfVictory;
                    smallestMOVMatchup = matchup;
                }
            });
        });
        return smallestMOVMatchup;
    };
    League.prototype.getLeagueWeeklyAverage = function () {
        var scores = [];
        this.getSeasonPortionWeeks().forEach(function (week) {
            week.matchups.forEach(function (matchup) {
                scores.push(matchup.home.score);
                if (!matchup.byeWeek) {
                    scores.push(matchup.away.score);
                }
            });
        });
        return getMean(scores);
    };
    League.prototype.getLeagueStandardDeviation = function () {
        var scores = [];
        this.getSeasonPortionWeeks().forEach(function (week) {
            week.matchups.forEach(function (matchup) {
                scores.push(matchup.home.score);
                if (!matchup.byeWeek) {
                    scores.push(matchup.away.score);
                }
            });
        });
        return calcStandardDeviation(scores);
    };
    League.prototype.getStandardDeviationFinish = function (teamID) {
        var finish = 1;
        var std = this.getMember(teamID).stats.standardDeviation;
        this.members.forEach(function (member) {
            if (std > member.stats.standardDeviation && member.teamID !== teamID) {
                finish += 1;
            }
        });
        return finish;
    };
    League.prototype.getOverallBestWeek = function () {
        var bestWeekMatchup;
        var highestScore = 0;
        this.getSeasonPortionWeeks().forEach(function (week) {
            week.matchups.forEach(function (matchup) {
                if (matchup.home.score > highestScore) {
                    bestWeekMatchup = matchup;
                    highestScore = matchup.home.score;
                }
                else if (!matchup.byeWeek && matchup.away) {
                    if (matchup.away.score > highestScore) {
                        bestWeekMatchup = matchup;
                        highestScore = matchup.away.score;
                    }
                }
            });
        });
        return bestWeekMatchup;
    };
    League.prototype.getOverallWorstWeek = function () {
        var worstWeekMatchup;
        var lowestScore = null;
        var i = 0;
        while (lowestScore === null) {
            if (this.getSeasonPortionWeeks()[i] && this.getSeasonPortionWeeks()[i].matchups) {
                lowestScore = this.getSeasonPortionWeeks()[i].matchups[0].home.score;
            }
            else if (!this.getSeasonPortionWeeks()[i].matchups[0].byeWeek) {
                lowestScore = this.getSeasonPortionWeeks()[i].matchups[0].away.score;
            }
            i++;
        }
        this.getSeasonPortionWeeks().forEach(function (week) {
            week.matchups.forEach(function (matchup) {
                if (matchup.home.score < lowestScore) {
                    worstWeekMatchup = matchup;
                    lowestScore = matchup.home.score;
                }
                else if (!matchup.byeWeek && matchup.away) {
                    if (matchup.away.score < lowestScore) {
                        worstWeekMatchup = matchup;
                        lowestScore = matchup.away.score;
                    }
                }
            });
        });
        return worstWeekMatchup;
    };
    League.prototype.getTeamAveragePointsPerPosition = function (teamID) {
        var _this = this;
        var allPlayers = getSeasonPlayers(this, teamID);
        var positions = this.settings.positionInfo.getPositions();
        var scoreDict = new Map();
        var timesPlayedDict = new Map();
        var scores = [];
        positions.forEach(function (position) {
            scoreDict.set(position, 0);
            timesPlayedDict.set(position, 0);
        });
        allPlayers.forEach(function (player) {
            scoreDict.set(player.position, player.seasonScore + scoreDict.get(player.position));
            timesPlayedDict.set(player.position, player.weeksPlayed + timesPlayedDict.get(player.position));
        });
        positions.forEach(function (position) {
            scores.push(roundToHundred(scoreDict.get(position) / timesPlayedDict.get(position) / getBestPositionPlayerAverageScore(_this, position)));
        });
        return scores;
    };
    League.prototype.getLeaguePointsPerPosition = function () {
        var _this = this;
        var allPlayers = getAllSeasonPlayers(this);
        var positions = this.settings.positionInfo.getPositions();
        var scoreDict = new Map();
        var scores = [];
        positions.forEach(function (position) {
            scoreDict.set(position, 0);
        });
        allPlayers.forEach(function (player) {
            scoreDict.set(player.position, player.seasonScore + scoreDict.get(player.position));
        });
        positions.forEach(function (position) {
            scores.push(roundToHundred(scoreDict.get(position) / _this.members.length));
        });
        return scores;
    };
    League.prototype.getMemberTotalPointsPerPosition = function (teamID) {
        var allPlayers = getSeasonPlayers(this, teamID);
        var positions = this.settings.positionInfo.getPositions();
        var scoreDict = new Map();
        var scores = [];
        positions.forEach(function (position) {
            scoreDict.set(position, 0);
        });
        allPlayers.forEach(function (player) {
            scoreDict.set(player.position, player.seasonScore + scoreDict.get(player.position));
        });
        positions.forEach(function (position) {
            scores.push(roundToHundred(scoreDict.get(position)));
        });
        return scores;
    };
    League.prototype.getAverageEfficiency = function () {
        var totalEfficiency = 0.00;
        this.members.forEach(function (member) {
            totalEfficiency += member.stats.getEfficiency();
        });
        return totalEfficiency / this.members.length;
    };
    League.prototype.getEfficiencyFinish = function (teamID) {
        var finish = 1;
        var efficiency = this.getMember(teamID).stats.getEfficiency();
        this.members.forEach(function (member) {
            if (efficiency < member.stats.getEfficiency() && member.teamID !== teamID) {
                finish += 1;
            }
        });
        return finish;
    };
    League.prototype.getMemberOpponentTotalPointsPerPosition = function (teamID) {
        var allPlayers = getSeasonOpponentPlayers(this, teamID);
        var positions = this.settings.positionInfo.getPositions();
        var scoreDict = new Map();
        var scores = [];
        positions.forEach(function (position) {
            scoreDict.set(position, 0);
        });
        allPlayers.forEach(function (player) {
            scoreDict.set(player.position, player.seasonScore + scoreDict.get(player.position));
        });
        positions.forEach(function (position) {
            scores.push(roundToHundred(scoreDict.get(position)));
        });
        return scores;
    };
    League.prototype.getLeagueAveragePointsPerPosition = function () {
        var _this = this;
        var allPlayers = getAllSeasonPlayers(this);
        var positions = this.settings.positionInfo.getPositions();
        var scoreDict = new Map();
        var timesPlayedDict = new Map();
        var scores = [];
        positions.forEach(function (position) {
            scoreDict.set(position, 0);
            timesPlayedDict.set(position, 0);
        });
        allPlayers.forEach(function (player) {
            scoreDict.set(player.position, player.seasonScore + scoreDict.get(player.position));
            timesPlayedDict.set(player.position, player.weeksPlayed + timesPlayedDict.get(player.position));
        });
        positions.forEach(function (position) {
            scores.push(roundToHundred(scoreDict.get(position) / timesPlayedDict.get(position) / getBestPositionPlayerAverageScore(_this, position)));
        });
        return scores;
    };
    League.prototype.getLosingDecisionAmount = function (teamID) {
        var totalLosingDecisions = 0;
        this.getSeasonPortionWeeks().forEach(function (week) {
            var matchup = week.getTeamMatchup(teamID);
            if (matchup.winner !== teamID && !matchup.byeWeek) {
                totalLosingDecisions += matchup.loserPotentialWinningSingleMoves;
            }
        });
        return totalLosingDecisions;
    };
    League.prototype.getGamesLostDueToSingleChoice = function (teamID) {
        var winnableLosses = 0;
        this.getSeasonPortionWeeks().forEach(function (week) {
            var matchup = week.getTeamMatchup(teamID);
            if (matchup.winner !== teamID && !matchup.byeWeek && matchup.withinSingleMoveOfWinning) {
                winnableLosses += 1;
            }
        });
        return winnableLosses;
    };
    League.prototype.getPowerRankFinish = function (teamID) {
        var finish = 1;
        var wins = this.getMember(teamID).stats.powerWins;
        this.members.forEach(function (member) {
            if (wins < member.stats.powerWins && member.teamID !== teamID) {
                finish += 1;
            }
        });
        return finish;
    };
    League.prototype.getRank = function (teamID) {
        var finish = 1;
        var winPct = this.getMember(teamID).stats.getWinPct();
        var pf = this.getMember(teamID).stats.pf;
        this.members.forEach(function (member) {
            if (winPct === member.stats.getWinPct() && member.teamID !== teamID) {
                if (pf < member.stats.pf) {
                    finish += 1;
                }
            }
            else if (winPct < member.stats.getWinPct() && member.teamID !== teamID) {
                finish += 1;
            }
        });
        return finish;
    };
    League.prototype.getGutAverageFinish = function (teamID) {
        var _this = this;
        var finish = 1;
        var gutAvg = this.getMember(teamID).stats.gutPoints / this.getMember(teamID).stats.gutPlayersPlayed;
        this.members.forEach(function (member) {
            if (gutAvg < (member.stats.gutPoints / _this.getMember(teamID).stats.gutPlayersPlayed) && member.teamID !== teamID) {
                finish += 1;
            }
        });
        return finish;
    };
    League.prototype.getPowerRankDiffFinish = function (teamID) {
        var finish = 1;
        var pwrRankDiff = this.getMember(teamID).stats.powerRank - this.getMember(teamID).stats.rank;
        this.members.forEach(function (member) {
            if (pwrRankDiff < (member.stats.rank - member.stats.powerRank) && member.teamID !== teamID) {
                finish += 1;
            }
        });
        return finish;
    };
    League.prototype.setAverageMargins = function (teamID) {
        var member = this.getMember(teamID);
        this.getSeasonPortionWeeks().forEach(function (week) {
            var matchup = week.getTeamMatchup(teamID);
            if (!matchup.byeWeek) {
                if (matchup.getWinningTeam().teamID === teamID) {
                    member.stats.averageMOV += matchup.marginOfVictory;
                }
                else if (matchup.getWinningTeam().teamID !== teamID) {
                    member.stats.averageMOD += matchup.marginOfVictory;
                }
            }
        });
        if (member.stats.wins !== 0) {
            member.stats.averageMOV = roundToHundred(member.stats.averageMOV / member.stats.wins);
        }
        if (member.stats.losses !== 0) {
            member.stats.averageMOD = roundToHundred(member.stats.averageMOD / member.stats.losses);
        }
    };
    League.prototype.getMarginFinish = function (teamID, weekNumber) {
        var finish = 1;
        var week = this.getWeek(weekNumber);
        var teamMatchup = week.getTeamMatchup(teamID);
        if (!teamMatchup.byeWeek) {
            var margin_1 = teamMatchup.getTeam(teamID).score - teamMatchup.getOpponent(teamID).score;
            if (margin_1 < 0) {
                finish += 1;
            }
            week.matchups.filter(function (it) { return !it.byeWeek; }).forEach(function (matchup) {
                if (matchup.home.teamID !== teamID && matchup.away.teamID !== teamID) {
                    var homeMargin = matchup.home.score - matchup.away.score;
                    var awayMargin = matchup.away.score - matchup.home.score;
                    if (awayMargin > margin_1 && homeMargin > margin_1) {
                        finish += 2;
                    }
                    else if (awayMargin > margin_1 || homeMargin > margin_1) {
                        finish += 1;
                    }
                }
            });
        }
        else {
            finish = 0;
        }
        return finish;
    };
    League.prototype.getUpsets = function (teamID) {
        var upsetCount = 0;
        var underdogCount = 0;
        this.getSeasonPortionWeeks().forEach(function (week) {
            var match = week.getTeamMatchup(teamID);
            if (!match.byeWeek) {
                if (match.getWinningTeam().teamID === teamID && match.isUpset) {
                    upsetCount += 1;
                    underdogCount += 1;
                }
                else if (match.getWinningTeam().teamID !== teamID && !match.isUpset) {
                    underdogCount += 1;
                }
            }
        });
        return [underdogCount, upsetCount];
    };
    League.prototype.getLeagueGutPointAverage = function () {
        var sum = 0;
        this.members.forEach(function (member) {
            sum += member.stats.getAverageGutPoints();
        });
        return roundToHundred(sum / this.members.length);
    };
    League.prototype.getHighestPPMember = function () {
        var highMember = this.members[0];
        this.members.forEach(function (member) {
            if (member.stats.pp > highMember.stats.pp) {
                highMember = member;
            }
        });
        return highMember;
    };
    League.prototype.getLowestPPMember = function () {
        var lowMember = this.members[0];
        this.members.forEach(function (member) {
            if (member.stats.pp < lowMember.stats.pp) {
                lowMember = member;
            }
        });
        return lowMember;
    };
    League.prototype.getHighestGutPointMember = function () {
        var highMember = this.members[0];
        this.members.forEach(function (member) {
            if (member.stats.getAverageGutPoints() > highMember.stats.getAverageGutPoints()) {
                highMember = member;
            }
        });
        return highMember;
    };
    League.prototype.getLowestGutPointMember = function () {
        var lowMember = this.members[0];
        this.members.forEach(function (member) {
            if (member.stats.getAverageGutPoints() < lowMember.stats.getAverageGutPoints()) {
                lowMember = member;
            }
        });
        return lowMember;
    };
    League.prototype.getMemberByStats = function (pf, pa, pp, OPSLAP, record) {
        var mem;
        this.members.forEach(function (member) {
            if (roundToHundred(member.stats.pf) === parseFloat(pf) &&
                roundToHundred(member.stats.pp) === parseFloat(pp) &&
                roundToHundred(member.stats.pa) === parseFloat(pa) &&
                roundToHundred(member.stats.OPSLAP) === parseFloat(OPSLAP) &&
                member.recordToString() === record) {
                mem = member;
            }
        });
        return mem;
    };
    League.prototype.getMemberByPowerStats = function (teamName, rank, powerRank, powerRecord) {
        var mem;
        this.members.forEach(function (member) {
            if (member.teamNameToString() === teamName &&
                member.stats.rank === parseInt(rank) &&
                member.stats.powerRank === parseInt(powerRank) &&
                member.powerRecordToString() === powerRecord) {
                mem = member;
            }
        });
        return mem;
    };
    League.prototype.setPage = function () {
        document.getElementById("league_name_header").innerHTML = this.leagueName;
        enableButtons();
        createTeamMenu(this);
        createLeagueStackedGraph(this);
        createMemberStrengthScatterChart(this);
        updateLeagueStatsCards(this);
        enablePlugins();
        createPowerRankTable(this);
        createLeagueWeeklyLineChart(this, true);
        createLeagueStatsTable(this);
        initMemberWeekTable(this);
    };
    League.prototype.updateMainPage = function () {
        updatePowerRankTable(this);
        updateLeagueStatsTable(this);
        updateMainPageLeagueStatCards(this);
    };
    return League;
}());
var Settings = (function () {
    function Settings(seasonDuration, leagueInfo, positionInfo) {
        this.seasonDuration = seasonDuration;
        this.leagueInfo = leagueInfo;
        this.positionInfo = positionInfo;
    }
    return Settings;
}());
function getESPNMatchups(settings, members) {
    var weeks = [];
    var weeksToGet;
    if (settings.seasonDuration.currentMatchupPeriod < settings.seasonDuration.regularSeasonLength + settings.seasonDuration.playoffLength) {
        weeksToGet = settings.seasonDuration.currentMatchupPeriod - 1;
    }
    else {
        weeksToGet = settings.seasonDuration.regularSeasonLength + settings.seasonDuration.playoffLength;
    }
    var _loop_1 = function (q) {
        espn_request("get", {
            path: "apis/v3/games/ffl/seasons/" + settings.leagueInfo.seasonId + "/segments/0/leagues/" + settings.leagueInfo.leagueId + "?view=mScoreboard&teamId=1&scoringPeriodId=" + q
        }).done(function (json) {
            updateLoadingText("Getting week " + q + " matchups");
            var matchups = [];
            for (var i in Object.keys(json.schedule)) {
                var curWeek = json.schedule[i];
                if (curWeek.home.rosterForCurrentScoringPeriod != null || curWeek.home.rosterForCurrentScoringPeriod !== undefined) {
                    var homeTeamID = curWeek.home.teamId;
                    var homePlayers = [];
                    for (var z in curWeek.home.rosterForCurrentScoringPeriod.entries) {
                        var curPlayer = curWeek.home.rosterForCurrentScoringPeriod.entries[z];
                        var firstName = curPlayer.playerPoolEntry.player.firstName;
                        var lastName = curPlayer.playerPoolEntry.player.lastName;
                        var score = roundToHundred(curPlayer.playerPoolEntry.appliedStatTotal);
                        var projectedScore = 0;
                        if (curPlayer.playerPoolEntry.player.stats.length === 0) {
                            projectedScore = 0;
                        }
                        else if (curPlayer.playerPoolEntry.player.stats[1] === undefined) {
                            projectedScore = 0;
                        }
                        else if (curPlayer.playerPoolEntry.player.stats[1].statSourceId === 1) {
                            projectedScore = roundToHundred(curPlayer.playerPoolEntry.player.stats[1].appliedTotal);
                        }
                        else {
                            projectedScore = roundToHundred(curPlayer.playerPoolEntry.player.stats[0].appliedTotal);
                        }
                        var eligibleSlots = curPlayer.playerPoolEntry.player.eligibleSlots;
                        var position = getPosition(eligibleSlots);
                        var realTeamID = curPlayer.playerPoolEntry.player.proTeamId;
                        var playerID = curPlayer.playerId;
                        var lineupSlotID = curPlayer.lineupSlotId;
                        homePlayers.push(new ESPNPlayer(firstName, lastName, score, projectedScore, position, realTeamID, playerID, lineupSlotID, eligibleSlots, q));
                    }
                    var awayTeam = void 0;
                    var awayteamID = -1;
                    if (curWeek.away !== null && curWeek.away !== undefined) {
                        var awayTeamID = curWeek.away.teamId;
                        var awayPlayers = [];
                        for (var l in curWeek.away.rosterForCurrentScoringPeriod.entries) {
                            var curPlayer = curWeek.away.rosterForCurrentScoringPeriod.entries[l];
                            var firstName = curPlayer.playerPoolEntry.player.firstName;
                            var lastName = curPlayer.playerPoolEntry.player.lastName;
                            var score = roundToHundred(curPlayer.playerPoolEntry.appliedStatTotal);
                            var projectedScore = 0;
                            if (curPlayer.playerPoolEntry.player.stats.length === 0) {
                                projectedScore = 0;
                            }
                            else if (curPlayer.playerPoolEntry.player.stats[1] === undefined) {
                                projectedScore = 0;
                            }
                            else if (curPlayer.playerPoolEntry.player.stats[1].statSourceId === 1) {
                                projectedScore = roundToHundred(curPlayer.playerPoolEntry.player.stats[1].appliedTotal);
                            }
                            else {
                                projectedScore = roundToHundred(curPlayer.playerPoolEntry.player.stats[0].appliedTotal);
                            }
                            var eligibleSlots = curPlayer.playerPoolEntry.player.eligibleSlots;
                            var position = getPosition(curPlayer.playerPoolEntry.player.eligibleSlots);
                            var realTeamID = curPlayer.playerPoolEntry.player.proTeamId;
                            var playerID = curPlayer.playerId;
                            var lineupSlotID = curPlayer.lineupSlotId;
                            awayPlayers.push(new ESPNPlayer(firstName, lastName, score, projectedScore, position, realTeamID, playerID, lineupSlotID, eligibleSlots, q));
                        }
                        awayTeam = new ESPNTeam(awayTeamID, awayPlayers, settings.positionInfo.activeLineupSlots, homeTeamID, settings.positionInfo.excludedLineupSlots, settings.positionInfo.excludedPositions);
                        awayteamID = awayTeam.teamID;
                    }
                    var isPlayoff = (q > settings.seasonDuration.regularSeasonLength);
                    var homeTeam = new ESPNTeam(homeTeamID, homePlayers, settings.positionInfo.activeLineupSlots, awayteamID, settings.positionInfo.excludedLineupSlots, settings.positionInfo.excludedPositions);
                    var matchup = new Matchup(homeTeam, awayTeam, q, isPlayoff);
                    matchup.setPoorLineupDecisions();
                    matchups.push(matchup);
                }
            }
            var isPlayoffs = (q > settings.seasonDuration.regularSeasonLength);
            weeks.push(new Week(q, isPlayoffs, matchups));
            if (weeks.length === weeksToGet) {
                weeks.sort(function (x, y) {
                    if (x.weekNumber < y.weekNumber) {
                        return -1;
                    }
                    if (x.weekNumber > y.weekNumber) {
                        return 1;
                    }
                    return 0;
                });
                var league = new ESPNLeague(weeks, members, settings, settings.leagueInfo.leagueName, PLATFORM.ESPN);
                league.setMemberStats(league.getSeasonPortionWeeks());
                localStorage.setItem(settings.leagueInfo.leagueId + settings.leagueInfo.seasonId, JSON.stringify(league));
                league.setPage();
            }
        });
    };
    for (var q = 1; q <= weeksToGet; q++) {
        _loop_1(q);
    }
}
function getESPNSettings(leagueID, seasonID) {
    updateLoadingText("Getting Settings");
    espn_request("get", {
        path: "apis/v3/games/ffl/seasons/" + seasonID + "/segments/0/leagues/" + leagueID + "?view=mSettings"
    }).done(function (json) {
        if (json.hasOwnProperty("messages") && json.messages[0] === "You are not authorized to view this League.") {
            alert("Error: League not accessable, make sure your league is set to public for the season you are trying to view");
        }
        if (json.hasOwnProperty("details") && json.details[0].message === "You are not authorized to view this League.") {
            alert("Error: League not accessable, make sure your league is set to public for the season you are trying to view");
        }
        var regularSeasonMatchupCount = json.settings.scheduleSettings.matchupPeriodCount;
        var divisions = json.settings.scheduleSettings.divisions;
        var draftOrder = json.settings.draftSettings.pickOrder;
        var scoringType = json.settings.scoringSettings.playerRankType;
        var totalMatchupCount = json.status.finalScoringPeriod;
        var currentMatchupPeriod = json.status.currentMatchupPeriod;
        var leagueSeasons = json.status.previousSeasons;
        var isActive = json.status.isActive;
        var playoffLength = totalMatchupCount - regularSeasonMatchupCount;
        var DRAFT_TYPE = json.settings.draftSettings.type;
        var lineupSlots = Object.entries(json.settings.rosterSettings.lineupSlotCounts);
        var lineup = lineupSlots.map(function (slot) {
            return [parseInt(slot[0].toString(), 10), parseInt(slot[1].toString(), 10)];
        }).filter(function (slot) {
            return slot[1] !== 0;
        });
        leagueSeasons.push(seasonID);
        var leagueName = json.settings.name;
        var activeLineupSlots = lineup.filter(function (slot) {
            return slot[0] !== 21 && slot[0] !== 20;
        });
        var seasonDur = new SeasonDurationSettings(0, regularSeasonMatchupCount, playoffLength, currentMatchupPeriod, isActive, [leagueSeasons]);
        var leagueInfo = new LeagueInfo(leagueName, leagueID, seasonID, [seasonID]);
        var posInfo = new ESPNPositionInfo(activeLineupSlots, lineupSlots);
        var settings = new Settings(seasonDur, leagueInfo, posInfo);
        getESPNMembers(settings);
    });
}
function getESPNMembers(settings) {
    updateLoadingText("Getting Members");
    espn_request("get", {
        path: "apis/v3/games/ffl/seasons/" + settings.leagueInfo.seasonId + "/segments/0/leagues/" + settings.leagueInfo.leagueId + "?view=mTeam"
    }).done(function (json) {
        var members = [];
        var teams = json.teams;
        var seasonLength = settings.seasonDuration.regularSeasonLength + settings.seasonDuration.playoffLength;
        for (var i in Object.keys(json.members)) {
            var member = json.members[i];
            var firstName = member.firstName;
            var lastName = member.lastName;
            var memberID = member.id.toString();
            var notificationSettings = member.notificationSettings;
            for (var x in Object.keys(teams)) {
                if (teams[x].primaryOwner === memberID) {
                    var curTeam = teams[x];
                    var location_1 = curTeam.location;
                    var nickname = curTeam.nickname;
                    var teamAbbrev = curTeam.abbrev;
                    var curProjectedRank = curTeam.currentProjectedRank;
                    var draftDayProjectedRank = curTeam.draftDayProjectedRank;
                    var divisionID = curTeam.divisionId;
                    var transactions = curTeam.transactionCounter;
                    var teamID = parseInt(curTeam.id, 10);
                    var logo = curTeam.logo;
                    var finalStanding = curTeam.rankCalculatedFinal;
                    members.push(new ESPNMember(memberID, firstName, lastName, location_1, nickname, teamAbbrev, divisionID, teamID, logo, transactions, new Stats(finalStanding)));
                }
            }
        }
        getESPNMatchups(settings, members);
    });
}
function espn_request(t, d) {
    return $.ajax({
        type: t,
        url: "./proxies/espn_proxy.php",
        dataType: "json",
        data: d,
        cache: false,
        async: true,
    });
}
function getSleeperLeagueSettings(leagueID, seasonID) {
    sleeper_request("get", {
        path: "league/" + leagueID.toString()
    }).done(function (json) {
        if (json.season === "2020") {
            getSleeperLeagueSettings(json.previous_league_id, seasonID);
        }
        else {
            if (json == null) {
                alert("Something went wrong, make sure the leagueID was input correctly and the season you are looking up exists");
                location.reload();
                return;
            }
            console.log(json);
            var rosters = convertSleeperRoster(json.roster_positions, json.settings.reserve_slots, json.settings.taxi_slots);
            var lineupOrder = json.roster_positions.filter(function (it) { return it !== "BN"; });
            var leagueName = json.name;
            var leagueAvatar = json.avatar;
            var draftId = json.draft_id;
            var playoffStartWeek = json.settings.playoff_week_start;
            var currentMatchupPeriod = json.settings.last_scored_leg;
            var previousLeagueId = json.previous_league_id;
            var numDivisions = json.settings.divisions;
            var draft = new SleeperDraftInfo(draftId, DRAFT_TYPE.SNAKE);
            var activeLineupSlots = rosters[0];
            var lineupSlots = rosters[0].concat(rosters[1]);
            var playoffType = json.settings.playoff_type;
            var numPlayoffTeams = json.settings.playoff_teams;
            var startWeek = 1;
            var isActive = (json.status === "in_season" || json.status === "post_season");
            var scoringSettings = json.scoring_settings;
            var divisions = [];
            if (json.metadata) {
                for (var i = 0; i < numDivisions; i++) {
                    divisions.push((json.metadata["division_" + (i + 1)], json.metadata["division_" + (i + 1) + "_avatar"]));
                }
            }
            var durationSettings = new SleeperSeasonDurationSettings(startWeek, 16 - (16 - playoffStartWeek), 16 - playoffStartWeek, currentMatchupPeriod, json.settings.last_scored_leg, isActive, [2019], playoffType, numPlayoffTeams);
            var leagueInfo = new SleeperLeagueInfo(leagueName, leagueID, seasonID, [seasonID], leagueAvatar, previousLeagueId);
            var rosterInfo = new PositionInfo(activeLineupSlots, lineupSlots, lineupOrder);
            var settings = new SleeperSettings(scoringSettings, durationSettings, leagueInfo, draft, rosterInfo);
            settings.positionInfo.excludedLineupSlots.push(88);
            updateLoadingText("Getting Members");
            getSleeperMembers(settings);
        }
    });
}
function getSleeperMembers(settings) {
    sleeper_request("get", {
        path: "league/" + settings.leagueInfo.leagueId.toString() + "/users"
    }).done(function (json) {
        var members = [];
        json.forEach(function (member) {
            var memberName = member.display_name;
            var memberID = member.user_id;
            var teamName = member.metadata.team_name;
            var teamAvatar = member.avatar;
            members.push(new SleeperMember(memberID, memberName, teamName, teamAvatar));
        });
        updateLoadingText("Getting Rosters");
        getSleeperRosters(members, settings);
    });
}
function getSleeperRosters(members, settings) {
    sleeper_request("get", {
        path: "league/" + settings.leagueInfo.leagueId.toString() + "/rosters/"
    }).done(function (json) {
        json.forEach(function (roster) {
            var teamID = parseInt(roster.roster_id, 10);
            var metadata = roster.metadata;
            var curRoster = roster.players;
            var reserve = roster.reserve;
            var taxi = roster.taxi;
            var wins = roster.settings.wins;
            var totalMoves = roster.settings.total_moves;
            var rosterOwnerID = roster.owner_id.toString();
            var coOwners = roster.co_owners;
            members.forEach(function (member) {
                var totalRoster = [];
                totalRoster = curRoster;
                if (member.memberID === rosterOwnerID) {
                    member.teamID = teamID;
                    member.stats = new Stats(0);
                    member.currentRosterIDs = totalRoster;
                    if (metadata != null) {
                        for (var _i = 0, _a = Object.entries(metadata); _i < _a.length; _i++) {
                            var _b = _a[_i], key = _b[0], value = _b[1];
                            member.rosterNicknameMap.set(key, value);
                        }
                    }
                }
            });
        });
        updateLoadingText("Getting Matchups");
        getSleeperMatchups(members.filter(function (member) { return member.teamID !== undefined; }), settings);
    });
}
function getSleeperMatchups(members, settings) {
    var promises = [];
    for (var i = settings.seasonDuration.startWeek; i <= settings.seasonDuration.currentMatchupPeriod; i++) {
        promises.push(makeRequest("https://api.sleeper.app/v1/league/" + settings.leagueInfo.leagueId + "/matchups/" + i));
    }
    updateLoadingText("Getting weekly stats");
    var weekCounter = settings.seasonDuration.startWeek;
    var Weeks = [];
    Promise.all(promises).then(function (weeks) {
        weeks.forEach(function (week) {
            var isPlayoffs = (weekCounter > settings.seasonDuration.regularSeasonLength);
            var weekMatches = getSleeperWeekMatchups(week.response, weekCounter, isPlayoffs, settings.positionInfo.lineupOrder);
            Weeks.push(new Week(weekCounter, isPlayoffs, weekMatches));
            weekCounter += 1;
        });
        getSleeperWeekStats(settings.seasonDuration.startWeek, settings.seasonDuration.currentMatchupPeriod).then(function (result) {
            var _loop_2 = function (y) {
                Weeks[y].matchups.forEach(function (matchup) {
                    matchup.home.lineup.forEach(function (player) {
                        result[y].calculatePlayerScore(settings.scoringSettings, player);
                        result[y].calculateProjectedPlayerScore(settings.scoringSettings, player);
                    });
                    if (matchup.home.score === null) {
                        matchup.home.score = matchup.home.getTeamScore(matchup.home.lineup);
                        matchup.setMatchupStats();
                    }
                    matchup.home.bench.forEach(function (player) {
                        result[y].calculatePlayerScore(settings.scoringSettings, player);
                        result[y].calculateProjectedPlayerScore(settings.scoringSettings, player);
                    });
                    if (!matchup.byeWeek) {
                        matchup.away.lineup.forEach(function (player) {
                            result[y].calculatePlayerScore(settings.scoringSettings, player);
                            result[y].calculateProjectedPlayerScore(settings.scoringSettings, player);
                        });
                        if (matchup.away.score === null) {
                            matchup.away.score = matchup.away.getTeamScore(matchup.away.lineup);
                            matchup.setMatchupStats();
                        }
                        matchup.away.bench.forEach(function (player) {
                            result[y].calculatePlayerScore(settings.scoringSettings, player);
                            result[y].calculateProjectedPlayerScore(settings.scoringSettings, player);
                        });
                    }
                });
            };
            for (var y = 0; y < result.length; y++) {
                _loop_2(y);
            }
            assignAllPlayerAttributes(Weeks, settings, members);
        });
    });
}
function getSleeperWeekMatchups(teams, weekNumber, isPlayoff, lineupOrder) {
    var allTeams = (teams).map(function (team) {
        return new SleeperTeam(team.starters, team.players, team.points, team.matchup_id, team.roster_id, findOpponent(teams, team.roster_id, team.matchup_id), weekNumber, lineupOrder);
    });
    var matchups = [];
    var _loop_3 = function (i) {
        var curTeams = allTeams.filter(function (team) {
            return team.matchupID === i;
        });
        if (curTeams.length === 1) {
            matchups.push(new Matchup(curTeams[0], null, weekNumber, isPlayoff));
        }
        if (curTeams.length === 2) {
            matchups.push(new Matchup(curTeams[0], curTeams[1], weekNumber, isPlayoff));
        }
    };
    for (var i = 0; i <= (teams.length / 2); i++) {
        _loop_3(i);
    }
    var byeWeekTeams = allTeams.filter(function (team) {
        return team.matchupID === null;
    });
    byeWeekTeams.forEach(function (team) {
        matchups.push(new Matchup(team, null, weekNumber, isPlayoff));
    });
    return matchups;
}
function assignAllPlayerAttributes(weeks, settings, members) {
    updateLoadingText("Getting Player Stats");
    makeRequest("./assets/player_library.json").then(function (result) {
        var lib = result.response;
        weeks.forEach(function (week) {
            week.matchups.forEach(function (matchup) {
                if (matchup.home.score === null) {
                    matchup.home.score = matchup.home.getTeamScore(matchup.home.lineup);
                    matchup.setMatchupStats();
                }
                if (!matchup.byeWeek) {
                    if (matchup.away.score === null) {
                        matchup.away.score = matchup.home.getTeamScore(matchup.away.lineup);
                        matchup.setMatchupStats();
                    }
                }
                matchup.home.lineup.forEach(function (player) {
                    assignSleeperPlayerAttributes(player, lib[player.playerID]);
                });
                matchup.home.bench.forEach(function (player) {
                    assignSleeperPlayerAttributes(player, lib[player.playerID]);
                });
                matchup.home.IR.forEach(function (player) {
                    assignSleeperPlayerAttributes(player, lib[player.playerID]);
                });
                matchup.home.setTeamMetrics(settings.positionInfo.activeLineupSlots, settings.positionInfo.excludedLineupSlots, settings.positionInfo.excludedPositions);
                if (!matchup.byeWeek) {
                    matchup.away.lineup.forEach(function (player) {
                        assignSleeperPlayerAttributes(player, lib[player.playerID]);
                    });
                    matchup.away.bench.forEach(function (player) {
                        assignSleeperPlayerAttributes(player, lib[player.playerID]);
                    });
                    matchup.away.IR.forEach(function (player) {
                        assignSleeperPlayerAttributes(player, lib[player.playerID]);
                    });
                    matchup.away.setTeamMetrics(settings.positionInfo.activeLineupSlots, settings.positionInfo.excludedLineupSlots, settings.positionInfo.excludedPositions);
                    matchup.projectedMOV = (Math.abs(matchup.home.projectedScore - matchup.away.projectedScore));
                    matchup.setPoorLineupDecisions();
                }
            });
        });
        members.forEach(function (member) {
            member.setRosterAttributes(lib);
        });
        var league = new SleeperLeague(weeks, members, settings);
        updateLoadingText("Setting Page");
        league.setMemberStats(league.getSeasonPortionWeeks());
        getSleeperTrades(league, lib);
    });
}
function getSleeperTrades(league, lib) {
    var promises = [];
    for (var i = 1; i <= league.settings.seasonDuration.currentMatchupPeriod - 1; i++) {
        promises.push(makeRequest("https://api.sleeper.app/v1/league/" + league.id + "/transactions/" + i));
    }
    updateLoadingText("Getting Transactions");
    Promise.all(promises).then(function (transactionArray) {
        transactionArray.map(function (it) { return it.response; }).forEach(function (week) {
            week.filter(function (it) { return it.type === "trade" && it.status === "complete"; }).forEach(function (trade) {
                league.trades.push(new SleeperTrade(trade, lib));
            });
        });
        getPlayoffBrackets(league);
    });
}
function getPlayoffBrackets(league) {
    var promises = [];
    promises.push(makeRequest("https://api.sleeper.app/v1/league/" + league.id + "/winners_bracket"));
    promises.push(makeRequest("https://api.sleeper.app/v1/league/" + league.id + "/losers_bracket"));
    Promise.all(promises).then(function (bracketArray) {
        var winBracket = bracketArray[0].response;
        var loseBracket = bracketArray[1].response;
        setSleeperRanks(league, winBracket, loseBracket);
        league.setPage();
    });
}
function setSleeperRanks(league, winners_bracket, losers_bracket) {
    var playoffTeams = league.settings.seasonDuration.numPlayoffTeams;
    winners_bracket.forEach(function (winBracket) {
        if (winBracket.hasOwnProperty("p")) {
            var winnerId = winBracket.w;
            var loserId = winBracket.l;
            var winRank = winBracket.p;
            var loseRank = winBracket.p + 1;
            league.getMember(winnerId).stats.finalStanding = winRank;
            league.getMember(loserId).stats.finalStanding = loseRank;
        }
    });
    losers_bracket.forEach(function (loseBracket) {
        if (loseBracket.hasOwnProperty("p")) {
            var winnerId = loseBracket.w;
            var loserId = loseBracket.l;
            var winRank = void 0;
            var loseRank = void 0;
            if (league.settings.seasonDuration.playoffType === 1) {
                var loseBracketStartPosition = league.members.length - (league.members.length - playoffTeams);
                winRank = loseBracketStartPosition + loseBracket.p;
                loseRank = loseBracketStartPosition + loseBracket.p + 1;
            }
            else {
                winRank = league.members.length - loseBracket.p + 1;
                loseRank = league.members.length - loseBracket.p;
            }
            league.getMember(winnerId).stats.finalStanding = winRank;
            league.getMember(loserId).stats.finalStanding = loseRank;
        }
    });
}
function makeRequest(url) {
    var request = new XMLHttpRequest();
    request.responseType = "json";
    return new Promise(function (resolve, reject) {
        request.onreadystatechange = function () {
            if (request.readyState !== 4) {
                return;
            }
            if (request.status >= 200 && request.status < 300) {
                resolve(request);
            }
            else {
                reject({
                    status: request.status,
                    statusText: request.statusText,
                });
            }
        };
        request.open("GET", url, true);
        request.send();
    });
}
function sleeper_request(t, d) {
    return $.ajax({
        type: t,
        url: "./proxies/sleeper_proxy.php",
        dataType: "json",
        data: d,
        cache: false,
        async: true,
    });
}
var TransactionMetadata;
(function (TransactionMetadata) {
    TransactionMetadata["SUCCESS_PLAYER_CLAIMED"] = "Your waiver claim was processed successfully!";
    TransactionMetadata["FAILED_CLAIMED_BY_OTHER_OWNER"] = "This player was claimed by another owner.";
    TransactionMetadata["FAILED_TOO_MANY_PLAYERS"] = "Unfortunately, your roster will have too many players after this transaction.";
})(TransactionMetadata || (TransactionMetadata = {}));
var LeagueInfo = (function () {
    function LeagueInfo(leagueName, leagueId, seasonId, activeSeasons) {
        this.leagueName = leagueName;
        this.leagueId = leagueId;
        this.seasonId = seasonId;
        this.activeSeasons = activeSeasons;
        this.leagueId = leagueId.toString();
    }
    return LeagueInfo;
}());
var PositionInfo = (function () {
    function PositionInfo(activeLineupSlots, lineupSlots, lineupOrder) {
        this.activeLineupSlots = activeLineupSlots;
        this.lineupSlots = lineupSlots;
        this.lineupOrder = lineupOrder;
        this.excludedLineupSlots = [];
        this.excludedPositions = [];
    }
    PositionInfo.prototype.getPositions = function () {
        var positions = this.activeLineupSlots.filter(function (slot) {
            return slot[0] !== 1 && slot[0] !== 3 && slot[0] !== 5 && slot[0] !== 7 && slot[0] !== 23 && slot[0] !== 25;
        }).map(function (slot) {
            return intToPosition.get(slot[0]);
        });
        return positions;
    };
    return PositionInfo;
}());
var SeasonDurationSettings = (function () {
    function SeasonDurationSettings(startWeek, regularSeasonLength, playoffLength, currentMatchupPeriod, isActive, yearsActive) {
        this.startWeek = startWeek;
        this.regularSeasonLength = regularSeasonLength;
        this.playoffLength = playoffLength;
        this.currentMatchupPeriod = currentMatchupPeriod;
        this.isActive = isActive;
        this.yearsActive = yearsActive;
        this.yearsActive = this.yearsActive.sort(function (a, b) { return b - a; });
    }
    return SeasonDurationSettings;
}());
var ESPNLeague = (function (_super) {
    __extends(ESPNLeague, _super);
    function ESPNLeague(weeks, members, settings, leagueName, leaguePlatform) {
        return _super.call(this, weeks, members, settings, PLATFORM.ESPN) || this;
    }
    ESPNLeague.prototype.setPage = function () {
        _super.prototype.setPage.call(this);
        enableSeasonPortionSelector(this, this.settings.seasonDuration.currentMatchupPeriod > this.settings.seasonDuration.regularSeasonLength);
        transitionToLeaguePage();
    };
    return ESPNLeague;
}(League));
var ESPNMember = (function () {
    function ESPNMember(memberID, firstName, lastName, teamLocation, teamNickname, teamAbbrev, division, teamID, logoURL, transactions, stats) {
        this.memberID = memberID;
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
    ESPNMember.prototype.setAdvancedStats = function (weeks) {
        var _this = this;
        var scores = [];
        weeks.forEach(function (week) {
            scores.push(week.getTeam(_this.teamID).score);
        });
        this.stats.standardDeviation = calcStandardDeviation(scores);
        this.stats.weeklyAverage = getMean(scores);
    };
    ESPNMember.prototype.teamNameToString = function () {
        return this.teamLocation + " " + this.teamNickname;
    };
    ESPNMember.prototype.ownerToString = function () {
        return this.firstName + " " + this.lastName;
    };
    ESPNMember.prototype.recordToString = function () {
        if (this.stats.ties !== 0) {
            return this.stats.wins + "-" + this.stats.losses + "-" + this.stats.ties;
        }
        else {
            return this.stats.wins + "-" + this.stats.losses;
        }
    };
    ESPNMember.prototype.rankToString = function () {
        return ordinal_suffix_of(this.stats.rank);
    };
    ESPNMember.prototype.finishToString = function () {
        return ordinal_suffix_of(this.stats.finalStanding);
    };
    ESPNMember.prototype.powerRecordToString = function () {
        return this.stats.powerWins + "-" + this.stats.powerLosses;
    };
    ESPNMember.prototype.potentialPowerRecordToString = function () {
        return this.stats.potentialPowerWins + "-" + this.stats.potentialPowerLosses;
    };
    return ESPNMember;
}());
var ESPNPlayer = (function () {
    function ESPNPlayer(firstName, lastName, score, projectedScore, position, realTeamID, playerID, lineupSlotID, eligibleSlots, weekNumber) {
        this.firstName = firstName;
        if (lastName === "D/ST") {
            this.lastName = "DEF";
        }
        else {
            this.lastName = lastName;
        }
        this.eligibleSlots = eligibleSlots;
        this.score = score;
        this.projectedScore = projectedScore;
        this.position = position;
        this.realTeamID = realTeamID;
        this.playerID = playerID;
        this.lineupSlotID = lineupSlotID;
        this.weekNumber = weekNumber;
        this.espnID = playerID;
    }
    ESPNPlayer.prototype.isEligible = function (slot) {
        var isEligible = false;
        this.eligibleSlots.forEach(function (eligibleSlot) {
            if (eligibleSlot === slot) {
                isEligible = true;
            }
        });
        return isEligible;
    };
    return ESPNPlayer;
}());
var ESPNTeam = (function () {
    function ESPNTeam(teamID, players, activeLineupSlots, opponentID, excludedLineupSlots, excludedPositions) {
        var _this = this;
        this.lineup = [];
        this.bench = [];
        this.IR = [];
        this.opponentID = opponentID;
        players.forEach(function (player) {
            if (player.lineupSlotID === 21) {
                _this.IR.push(player);
            }
            else if (player.lineupSlotID === 20) {
                _this.bench.push(player);
            }
            else {
                _this.lineup.push(player);
            }
        });
        this.teamID = teamID;
        this.score = this.getTeamScore(this.lineup);
        this.potentialPoints = this.getTeamScore(getOptimalLineup(activeLineupSlots, this.lineup.concat(this.bench, this.IR), excludedLineupSlots, excludedPositions));
        this.projectedScore = this.getProjectedScore(this.lineup);
        this.projectedBestLineupPoints = this.getTeamScore(getOptimalProjectedLineup(activeLineupSlots, players, excludedLineupSlots, excludedPositions));
        var gutArray = this.getGutPoints(activeLineupSlots, excludedLineupSlots, excludedPositions);
        this.gutDifference = gutArray[0];
        this.gutPlayers = gutArray[1];
    }
    ESPNTeam.prototype.getTeamScore = function (players) {
        var score = 0;
        for (var i in players) {
            if (players[i].score !== null && players[i].score !== undefined) {
                score += players[i].score;
            }
        }
        return score;
    };
    ESPNTeam.prototype.getProjectedScore = function (players) {
        var projectedScore = 0;
        for (var i in players) {
            if (players[i].projectedScore !== null && players[i].projectedScore !== undefined) {
                projectedScore += players[i].projectedScore;
            }
        }
        return projectedScore;
    };
    ESPNTeam.prototype.getMVP = function () {
        var mvp = this.lineup[0];
        var mvpScore = 0;
        this.lineup.forEach(function (player) {
            if (player.score > mvpScore) {
                mvpScore = player.score;
                mvp = player;
            }
        });
        return mvp;
    };
    ESPNTeam.prototype.getLVP = function () {
        var lvp = this.lineup[0];
        var lvpScore = this.lineup[0].score;
        this.lineup.forEach(function (player) {
            if (player.score > lvpScore) {
                lvpScore = player.score;
                lvp = player;
            }
        });
        return lvp;
    };
    ESPNTeam.prototype.getPositionalPlayers = function (position) {
        var players = this.lineup;
        var positionPlayers = [];
        players.forEach(function (player) {
            if (player.position === position) {
                positionPlayers.push(player);
            }
        });
        return positionPlayers;
    };
    ESPNTeam.prototype.getEligibleSlotPlayers = function (slot) {
        var players = this.lineup.concat(this.bench, this.IR);
        var eligiblePlayers = players.filter(function (it) {
            return it.isEligible(slot) === true;
        });
        return eligiblePlayers;
    };
    ESPNTeam.prototype.getEligibleSlotBenchPlayers = function (slot) {
        var players = this.bench.concat(this.IR);
        var eligiblePlayers = players.filter(function (it) {
            return it.isEligible(slot) === true;
        });
        return eligiblePlayers;
    };
    ESPNTeam.prototype.getGutPoints = function (activeLineupSlots, excludedLineupSlots, excludedPositions) {
        var players = this.getProjectedLinupPlayerDifference(activeLineupSlots, excludedLineupSlots, excludedPositions);
        var gutPlayers = players[0];
        var satPlayers = players[1];
        var diff = this.getTeamScore(gutPlayers) - this.getTeamScore(satPlayers);
        var playerNum = gutPlayers.length;
        return [diff, playerNum];
    };
    ESPNTeam.prototype.getProjectedLinupPlayerDifference = function (activeLineupSlots, excludedLineupSlots, excludedPositions) {
        var _this = this;
        var gutPlayers = [];
        var satPlayers = [];
        var projectedLineup = getOptimalProjectedLineup(activeLineupSlots, this.lineup.concat(this.bench, this.IR), excludedLineupSlots, excludedPositions);
        this.lineup.forEach(function (player) {
            if (!includesPlayer(player, projectedLineup)) {
                gutPlayers.push(player);
            }
        });
        projectedLineup.forEach(function (player) {
            if (!includesPlayer(player, _this.lineup)) {
                satPlayers.push(player);
            }
        });
        return [gutPlayers, satPlayers];
    };
    ESPNTeam.prototype.getAllPlayers = function () {
        return (this.lineup.concat(this.bench, this.IR));
    };
    return ESPNTeam;
}());
var ESPNPositionInfo = (function (_super) {
    __extends(ESPNPositionInfo, _super);
    function ESPNPositionInfo(activeLineupSlots, lineupSlots) {
        return _super.call(this, activeLineupSlots, lineupSlots) || this;
    }
    return ESPNPositionInfo;
}(PositionInfo));
function updateLoadingText(labelText) {
    var label = document.getElementById("loading_text");
    label.innerText = labelText;
}
function initCube() {
    var cube = document.getElementById("cube_spinner_container");
    var container = document.getElementById("loading_container");
    var form = document.getElementById("info_form");
    form.style.display = "none";
    container.style.display = "inline";
    var label = document.getElementById("loading_text");
    label.style.display = "inline";
    cube.style.display = "inline-block";
    updateLoadingText("Getting Settings");
}
function transitionToLeaguePage() {
    var particles = document.getElementById("particles-js");
    particles.style.display = "none";
    updateLoadingText("Finished");
    $("#prompt_screen").stop(true, true).fadeOut(200, function () {
        unfadeLeaguePage();
    });
}
function fadeTeam(league, teamID) {
    $("#teamPill").stop(true, true).fadeOut(200, function () {
        updateTeamPill(league, teamID);
    });
}
function fadeTeamWithLogic(league, teamID) {
    if (document.getElementById(teamID + "_link").classList[1] !== "active") {
        $("#teamPill").stop(true, true).fadeOut(200, function () {
            updateTeamPill(league, teamID);
        });
    }
}
function fadeToLeaguePage() {
    $("#teamPill").stop(true, true).fadeOut(200);
}
function unfadeTeam() {
    $("#teamPill").stop(true, true).fadeIn(200);
}
function unfadeLeaguePage() {
    document.getElementById("page_header").style.display = "flex";
    document.getElementById("page_container").style.display = "inline-block";
}
function generatePositionBadge(marginText, slotID) {
    var td = document.createElement("td");
    td.style.textAlign = "center";
    var container = document.createElement("div");
    container.style.backgroundColor = getMemberColor(slotID);
    container.style.color = "white";
    container.classList.add("position_badge");
    var posText = document.createElement("b");
    posText.style.fontSize = "1em";
    posText.innerText = intToPosition.get(slotID);
    var margin = document.createElement("small");
    margin.classList.add("margin_small_text");
    if (marginText > 0) {
        margin.innerText = "+" + roundToHundred(marginText).toString();
        margin.style.color = "#00ff00";
    }
    else {
        margin.innerText = roundToHundred(marginText).toString();
        margin.style.color = "#ff0000";
    }
    container.appendChild(posText);
    td.appendChild(container);
    td.appendChild(margin);
    return td;
}
function generateBenchPositionBadge(slot) {
    var td = document.createElement("td");
    td.style.textAlign = "center";
    var container = document.createElement("div");
    container.style.backgroundColor = getMemberColor(slot);
    container.style.color = "white";
    container.classList.add("bench_position_badge");
    var posText = document.createElement("b");
    posText.style.fontSize = "1em";
    posText.innerText = intToPosition.get(slot);
    container.appendChild(posText);
    td.appendChild(container);
    return td;
}
function enableBadgesPane() {
    document.getElementById("stats_button").style.display = "block";
    document.getElementById("stats_button").onclick = function () {
        $(".nav-link").removeClass("active");
        fadeToLeaguePage();
    };
}
function createTradeCard(league, trade) {
    var tradeContainer = document.createElement("div");
    tradeContainer.id = "trade_container_" + trade.transactionId;
    tradeContainer.classList.add("row", "my-1", "league_trade", "card-deck");
    var template = document.getElementsByTagName("template")[0];
    trade.consentingTeamIds.forEach(function (teamID, index) {
        var teamNode = document.importNode(template.content, true);
        var ownerName = teamNode.querySelector(".trade_owner_name");
        var container = teamNode.querySelector(".league_trade_container");
        var sentAssetsList = teamNode.querySelector(".sent_assets_list");
        var receivedAssetsList = teamNode.querySelector(".received_assets_list");
        var c = document.createElement("img");
        container.style.borderColor = getMemberColor(teamID);
        c.src = league.getMember(teamID).logoURL;
        c.style.width = "25px";
        c.style.height = "25px";
        c.style.borderRadius = "25px";
        c.addEventListener("error", fixNoImage);
        c.style.marginLeft = "8px";
        c.style.marginRight = "auto";
        ownerName.appendChild(c);
        ownerName.appendChild(document.createTextNode(" " + league.getMember(teamID).ownerToString()));
        trade.playersTraded.get(teamID).forEach(function (player) {
            sentAssetsList.innerHTML += "- " + player.firstName + " " + player.lastName;
            sentAssetsList.appendChild(document.createElement("br"));
        });
        trade.playersReceived.get(teamID).forEach(function (player) {
            receivedAssetsList.innerHTML += "+ " + player.firstName + " " + player.lastName;
            receivedAssetsList.appendChild(document.createElement("br"));
        });
        trade.draftPicksInvolved.filter(function (pick) {
            return teamID === pick.currentOwnerId;
        }).forEach(function (pick) {
            receivedAssetsList.innerHTML += "+ " + pick.toString(league);
            receivedAssetsList.appendChild(document.createElement("br"));
        });
        trade.draftPicksInvolved.filter(function (pick) {
            return teamID === pick.sellingOwnerId;
        }).forEach(function (pick) {
            sentAssetsList.innerHTML += "- " + pick.toString(league);
            sentAssetsList.appendChild(document.createElement("br"));
        });
        if (trade.faabTraded.get(teamID) !== undefined && trade.faabTraded.get(teamID) !== 0) {
            if (trade.faabTraded.get(teamID) > 0) {
                receivedAssetsList.appendChild(document.createTextNode("Faab: + $" + trade.faabTraded.get(teamID)));
            }
            else {
                sentAssetsList.appendChild(document.createTextNode("Faab: - $" + (trade.faabTraded.get(teamID) * -1)));
            }
        }
        tradeContainer.appendChild(teamNode);
    });
    return tradeContainer;
}
function constructTrades(league) {
    var container = document.getElementById("league_trades_container");
    league.trades.forEach(function (trade) {
        var tradeRow = document.createElement("div");
        tradeRow.appendChild(createTradeCard(league, trade));
        container.appendChild(tradeRow);
    });
}
function constructTeamPageTrades(league, teamId) {
    var container = document.getElementById("team_page_trades_container");
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
    league.trades.filter(function (trade) {
        return trade.consentingTeamIds.includes(teamId);
    }).forEach(function (trade) {
        var tradeRow = document.createElement("div");
        tradeRow.appendChild(createTradeCard(league, trade));
        container.appendChild(tradeRow);
    });
}
function updateLeagueStatsCards(league) {
    updateLeagueWeeklyAverage(league);
    updateLeagueWeeklyPP(league);
    updateLeagueStandardDeviation(league);
    updateLeagueEfficiency(league);
    updateBestWorstLeagueWeeks(league);
    updateLeagueSmallestMOVCard(league);
    updateLeagueLargestMOVCard(league);
}
function updateLeagueStandardDeviation(league) {
    var leagueStandardDeviation = document.getElementById("league_standard_deviation");
    leagueStandardDeviation.innerText = roundToHundred(league.getLeagueStandardDeviation()).toString();
}
function updateLeagueEfficiency(league) {
    var leagueEfficiency = document.getElementById("league_efficiency_percentage");
    leagueEfficiency.innerText = (roundToHundred(league.getAverageEfficiency()) * 100).toString() + "%";
}
function updateLeagueWeeklyAverage(league) {
    var leagueWeeklyAverage = document.getElementById("league_weekly_average");
    leagueWeeklyAverage.innerText = roundToHundred(league.getLeagueWeeklyAverage()).toString();
}
function updateLeagueWeeklyPP(league) {
    var leagueWeeklyAverage = document.getElementById("league_weekly_average_pp");
    leagueWeeklyAverage.innerText = roundToHundred(league.getLeaguePP() / league.getSeasonPortionWeeks().length).toString();
}
function updateLeagueSmallestMOVCard(league) {
    var closestMatchup = league.getSmallestMarginOfVictory();
    var team1 = closestMatchup.home;
    var team2 = closestMatchup.away;
    var margin = document.getElementById("league_closest_match_margin");
    var weekNumber = document.getElementById("league_closest_match_week");
    var firstTeamName = document.getElementById("league_closest_match_team_1");
    var firstTeamScore = document.getElementById("league_closest_match_team_1_score");
    var firstTeamImage = document.getElementById("league_closest_match_team_1_image");
    var secondTeamName = document.getElementById("league_closest_match_team_2");
    var secondTeamScore = document.getElementById("league_closest_match_team_2_score");
    var secondTeamImage = document.getElementById("league_closest_match_team_2_image");
    margin.innerText = roundToMil(closestMatchup.marginOfVictory) + " Points";
    weekNumber.innerText = "Week " + closestMatchup.weekNumber.toString();
    firstTeamName.innerText = league.getMember(team1.teamID).teamNameToString();
    firstTeamScore.innerText = roundToThousand(team1.score) + " Points";
    firstTeamImage.src = league.getMember(team1.teamID).logoURL;
    secondTeamName.innerText = league.getMember(team2.teamID).teamNameToString();
    secondTeamScore.innerText = roundToThousand(team2.score) + " Points";
    secondTeamImage.src = league.getMember(team2.teamID).logoURL;
}
function updateLeagueLargestMOVCard(league) {
    var closestMatchup = league.getLargestMarginOfVictory();
    var team1 = closestMatchup.home;
    var team2 = closestMatchup.away;
    var margin = document.getElementById("league_largest_match_margin");
    var weekNumber = document.getElementById("league_largest_match_week");
    var firstTeamName = document.getElementById("league_largest_match_team_1");
    var firstTeamScore = document.getElementById("league_largest_match_team_1_score");
    var firstTeamImage = document.getElementById("league_largest_match_team_1_image");
    var secondTeamName = document.getElementById("league_largest_match_team_2");
    var secondTeamScore = document.getElementById("league_largest_match_team_2_score");
    var secondTeamImage = document.getElementById("league_largest_match_team_2_image");
    margin.innerText = roundToThousand(closestMatchup.marginOfVictory) + " Points";
    weekNumber.innerText = "Week " + closestMatchup.weekNumber.toString();
    firstTeamName.innerText = league.getMember(team1.teamID).teamNameToString();
    firstTeamScore.innerText = roundToThousand(team1.score) + " Points";
    firstTeamImage.src = league.getMember(team1.teamID).logoURL;
    secondTeamName.innerText = league.getMember(team2.teamID).teamNameToString();
    secondTeamScore.innerText = roundToThousand(team2.score) + " Points";
    secondTeamImage.src = league.getMember(team2.teamID).logoURL;
}
function updateBestWorstLeagueWeeks(league) {
    var leagueBestWeekScore = document.getElementById("league_best_week_score");
    var leagueBestWeekTeamName = document.getElementById("league_best_week_team_name");
    var leagueWorstWeekTeamName = document.getElementById("league_worst_week_team_name");
    var leagueBestWeekImage = document.getElementById("team_best_week_image");
    var leagueWorstWeekImage = document.getElementById("team_worst_week_image");
    var leagueWorstWeekScore = document.getElementById("league_worst_week_score");
    var leagueBestWeekNumber = document.getElementById("league_best_week_number");
    var leagueWorstWeekNumber = document.getElementById("league_worst_week_number");
    var bestWeek = league.getOverallBestWeek();
    var worstWeek = league.getOverallWorstWeek();
    leagueBestWeekScore.innerText = roundToHundred(bestWeek.getHighestScoringTeam().score).toString() + " Points";
    leagueBestWeekTeamName.innerText = league.getMember(bestWeek.getHighestScoringTeam().teamID).teamNameToString();
    leagueBestWeekNumber.innerText = "Week " + bestWeek.weekNumber.toString();
    leagueBestWeekImage.src = league.getMember(bestWeek.getHighestScoringTeam().teamID).logoURL;
    leagueWorstWeekScore.innerText = roundToHundred(worstWeek.getLowestScoringTeam().score).toString() + " Points";
    leagueWorstWeekTeamName.innerText = league.getMember(worstWeek.getLowestScoringTeam().teamID).teamNameToString();
    leagueWorstWeekNumber.innerText = "Week " + worstWeek.weekNumber.toString();
    leagueWorstWeekImage.src = league.getMember(worstWeek.getLowestScoringTeam().teamID).logoURL;
}
function updateTeamPill(league, teamID) {
    var member = league.getMember(teamID);
    document.getElementById("teamPill").setAttribute("currentTeam", teamID.toString());
    updateTeamCard(league, member);
    updateMiniStatCards(league, member);
    updateWeekAverage(league, member);
    updateTeamStandardDeviation(league, member);
    updateBestWeek(league, member);
    updateEfficiency(league, member);
    updateBestWorstConsistent(league, member);
    createTeamRadarChart(league, member);
    updateMemberWeekTable(league, member);
    createMemberWeeklyLineChart(league, member);
    createTeamBarChart(league, member);
    updateGutWinCard(league, member);
    updateWinnableGamesLost(league, member);
    updateMargins(league, member);
    updateUpsets(league, member);
    updateMemberWeekTable(league, member);
    if (league.leaguePlatform === PLATFORM.SLEEPER) {
        updateTeamTrades(league, member);
    }
    unfadeTeam();
}
function updateBestWorstConsistent(league, member) {
    var arr = getBestLeastConsistent(league, member.teamID);
    updateMVP(arr[0]);
    updateLVP(arr[1]);
    if (league.seasonPortion === SEASON_PORTION.POST) {
        updateBiggestBoom(league, league.getBiggestBoom(member.teamID), member.teamID);
    }
    else {
        updateMostConsistent(arr[2]);
    }
}
function updateWeekAverage(league, member) {
    var weeklyAverage = document.getElementById("team_weekly_average");
    var avgVsLeague = document.getElementById("team_weekly_average_vs_league");
    var weekCard = document.getElementById("team_weekly_average_card");
    weeklyAverage.innerText = member.stats.weeklyAverage + "";
    var avgDiff = roundToHundred(member.stats.weeklyAverage - league.getLeagueWeeklyAverage());
    var avgDiffText = "";
    if (avgDiff > 0) {
        avgDiffText = "+ " + avgDiff;
    }
    else {
        avgDiffText = avgDiff + "";
    }
    avgVsLeague.innerText = avgDiffText + " Average";
    weekCard.style.backgroundColor = getDarkCardColor(league.getPointsScoredFinish(member.teamID), league.members.length);
}
function updateBestWeek(league, member) {
    var bestWeekScore = document.getElementById("team_best_week_score");
    var bestWeekFinish = document.getElementById("team_best_week_finish");
    var bestWeekNumber = document.getElementById("team_best_finish_week_number");
    var bestWeekCard = document.getElementById("team_best_week_card");
    var bestWeek = league.getMemberBestTeam(member.teamID);
    var finish = league.getBestWeekFinish(member.teamID);
    bestWeekScore.innerText = roundToHundred(bestWeek.score) + " Points";
    bestWeekFinish.innerText = ordinal_suffix_of(finish) + " Highest";
    bestWeekCard.style.backgroundColor = getDarkCardColor(finish, league.members.length);
    bestWeekNumber.innerText = "Week " + league.getBestWeek(member.teamID).weekNumber;
}
function updateEfficiency(league, member) {
    var efficiencyVsLeague = document.getElementById("team_efficiency_vs_league");
    var efficiencyFinish = document.getElementById("team_efficiency_rank");
    var efficiencyPercentage = document.getElementById("team_efficiency_percentage");
    var efficiencyCard = document.getElementById("team_efficiency_card");
    var efficiency = member.stats.getEfficiency();
    var leagueEfficiency = league.getAverageEfficiency();
    var finish = league.getEfficiencyFinish(member.teamID);
    var diff;
    if (efficiency > leagueEfficiency) {
        diff = "+" + roundToHundred((efficiency - leagueEfficiency) * 100) + "% League Average";
    }
    else {
        diff = roundToHundred((efficiency - leagueEfficiency) * 100) + "% League Average";
    }
    efficiencyVsLeague.innerText = diff;
    efficiencyFinish.innerText = ordinal_suffix_of(finish) + " Most Efficient";
    efficiencyCard.style.backgroundColor = getDarkCardColor(finish, league.members.length);
    efficiencyPercentage.innerText = roundToHundred(efficiency * 100) + "%";
}
function updateTeamStandardDeviation(league, member) {
    var stdRank = document.getElementById("team_consistency_rank");
    var std = document.getElementById("team_standard_deviation");
    var stdVsLeague = document.getElementById("team_standard_deviation_vs_league");
    var stdCard = document.getElementById("team_std_card");
    stdRank.innerText = ordinal_suffix_of(league.getStandardDeviationFinish(member.teamID)) + " Most Consistent";
    std.innerText = member.stats.standardDeviation + "";
    var stdDiff = roundToHundred(member.stats.standardDeviation - league.getLeagueStandardDeviation());
    var stdDiffText = "";
    if (stdDiff > 0) {
        stdDiffText = "+ " + stdDiff;
    }
    else {
        stdDiffText = stdDiff + "";
    }
    stdVsLeague.innerText = stdDiffText + " Average";
    stdCard.style.backgroundColor = getDarkCardColor(league.getStandardDeviationFinish(member.teamID), league.members.length);
}
function updateTeamCard(league, member) {
    var picture = document.getElementById("team_image");
    var team = document.getElementById("team_name");
    var owner = document.getElementById("team_owner");
    var finish = document.getElementById("team_finish");
    var record = document.getElementById("team_record");
    picture.setAttribute("src", member.logoURL);
    picture.addEventListener("error", fixNoImage);
    team.innerHTML = member.teamNameToString();
    owner.innerHTML = member.ownerToString();
    if (league.settings.seasonDuration.isActive) {
        finish.innerHTML = "Ranked " + member.rankToString() + " overall";
    }
    else {
        finish.innerHTML = "Finished " + member.finishToString() + " overall";
    }
    record.innerHTML = "Record: " + member.recordToString();
}
function updateMiniStatCards(league, member) {
    var pfFinish = document.getElementById("team_pf_finish");
    var pfScore = document.getElementById("team_pf_points");
    var pfLeagueDiff = document.getElementById("team_pf_vs_league_average");
    var pfBackground = document.getElementById("team_pf_statcard");
    var paFinish = document.getElementById("team_pa_finish");
    var paScore = document.getElementById("team_pa_points");
    var paLeagueDiff = document.getElementById("team_pa_vs_league_average");
    var paBackground = document.getElementById("team_pa_statcard");
    var ppFinish = document.getElementById("team_pp_finish");
    var ppScore = document.getElementById("team_pp_points");
    var ppLeagueDiff = document.getElementById("team_pp_vs_league_average");
    var ppBackground = document.getElementById("team_pp_statcard");
    pfFinish.innerHTML = ordinal_suffix_of(league.getPointsScoredFinish(member.teamID));
    pfScore.innerHTML = member.stats.pf.toString();
    var pfDiff = roundToTen(member.stats.pf - league.getLeaguePF());
    if (pfDiff > 0) {
        pfLeagueDiff.innerHTML = "+" + pfDiff + " League Average";
    }
    else {
        pfLeagueDiff.innerHTML = pfDiff + " League Average";
    }
    pfBackground.style.backgroundColor = getDarkCardColor(league.getPointsScoredFinish(member.teamID), league.members.length);
    paFinish.innerHTML = ordinal_suffix_of(league.getPointsAgainstFinish(member.teamID));
    paScore.innerHTML = member.stats.pa.toString();
    var paDiff = roundToTen(member.stats.pa - league.getLeaguePA());
    if (paDiff > 0) {
        paLeagueDiff.innerHTML = "+" + paDiff + " League Average";
    }
    else {
        paLeagueDiff.innerHTML = paDiff + " League Average";
    }
    paBackground.style.backgroundColor = getDarkCardColor(league.getPointsAgainstFinish(member.teamID), league.members.length);
    ppFinish.innerHTML = ordinal_suffix_of(league.getPotentialPointsFinish(member.teamID));
    ppScore.innerHTML = member.stats.pp.toString();
    var ppDiff = roundToTen(member.stats.pp - league.getLeaguePP());
    if (ppDiff > 0) {
        ppLeagueDiff.innerHTML = "+" + ppDiff + " League Average";
    }
    else {
        ppLeagueDiff.innerHTML = ppDiff + " League Average";
    }
    ppBackground.style.backgroundColor = getDarkCardColor(league.getPotentialPointsFinish(member.teamID), league.members.length);
}
function updateMVP(teamMVP) {
    var mvpImage = document.getElementById("mvp_image");
    var mvpName = document.getElementById("team_mvp_name");
    var mvpPoints = document.getElementById("team_mvp_points");
    mvpImage.src = teamMVP.pictureURL;
    var startsText = " starts";
    if (teamMVP.weeksPlayed === 1) {
        startsText = " start";
    }
    mvpName.innerText = teamMVP.firstName + " " + teamMVP.lastName;
    mvpPoints.innerText = roundToHundred(teamMVP.seasonScore) + " Points earned in lineup\n" + teamMVP.averageScore + " points per game, " + teamMVP.weeksPlayed + startsText;
}
function updateLVP(teamLVP) {
    var lvpImage = document.getElementById("lvp_image");
    var lvpName = document.getElementById("team_lvp_name");
    var lvpPoints = document.getElementById("team_lvp_points");
    lvpImage.src = teamLVP.pictureURL;
    lvpName.innerText = teamLVP.firstName + " " + teamLVP.lastName;
    var startsText = " starts";
    if (teamLVP.weeksPlayed === 1) {
        startsText = " start";
    }
    lvpPoints.innerText = roundToHundred(teamLVP.seasonScore) + " Points earned in lineup\n" + roundToHundred(teamLVP.averageScore) + " points per game, " + teamLVP.weeksPlayed + startsText;
}
function updateMostConsistent(mostConsistent) {
    var mostConsistentTitle = document.getElementById("consistent_or_boom");
    var mostConsistentImage = document.getElementById("team_most_consistent_image");
    var mostConsistentName = document.getElementById("team_most_consistent_name");
    var mostConsistentPoints = document.getElementById("team_most_consistent_points");
    mostConsistentTitle.innerText = "Most Consistent";
    mostConsistentImage.src = mostConsistent.pictureURL;
    var startsText = " starts";
    if (mostConsistent.weeksPlayed === 1) {
        startsText = " start";
    }
    mostConsistentName.innerText = mostConsistent.firstName + " " + mostConsistent.lastName;
    mostConsistentPoints.innerText = "Standard Deviation: " + calcStandardDeviation(mostConsistent.getScores()) + "\n" + mostConsistent.averageScore + " points per game, " + mostConsistent.weeksPlayed + startsText;
}
function updateWinnableGamesLost(league, member) {
    var teamID = member.teamID;
    var winnableGamesTitle = document.getElementById("winnable_games_lost_number");
    var poorRosterDecisions = document.getElementById("winnable_games_lost_choices");
    var choices = league.getMember(teamID).stats.choicesThatCouldHaveWonMatchup;
    var gamesLost = league.getMember(teamID).stats.gameLostDueToSingleChoice;
    winnableGamesTitle.innerText = gamesLost + " Winnable Games Lost";
    poorRosterDecisions.innerText = choices + " roster decisions could have won those games";
}
function updateGutWinCard(league, member) {
    var teamID = member.teamID;
    var gutPointsTotalNumber = document.getElementById("gut_points");
    var gutPointsNumber = document.getElementById("gut_wins_projected_difference");
    var gutCard = document.getElementById("gut_wins_card");
    var gutWins = roundToHundred(league.getMember(teamID).stats.gutPoints);
    var gutPoints = roundToHundred(league.getMember(teamID).stats.gutPoints / league.getMember(teamID).stats.gutPlayersPlayed);
    gutPointsTotalNumber.innerText = gutWins + " Gut points earned";
    gutPointsNumber.innerText = gutPoints + " average points when starting player with lower projection";
    gutCard.style.backgroundColor = getDarkCardColor(league.getGutAverageFinish(teamID), league.members.length);
}
function updateMargins(league, member) {
    var teamID = member.teamID;
    var mov = document.getElementById("margin_of_victory");
    var mod = document.getElementById("margin_of_defeat");
    mov.innerText = "Average victory margin\n\n" + league.getMember(teamID).stats.averageMOV + " Points";
    mod.innerText = "Average defeat margin\n\n" + league.getMember(teamID).stats.averageMOD + " Points";
}
function updateUpsets(league, member) {
    var teamID = member.teamID;
    var upsetTitle = document.getElementById("upsets_title");
    var underdogCount = document.getElementById("underdog_count");
    var upsets = league.getUpsets(teamID);
    upsetTitle.innerText = "Upset projected winner " + upsets[1] + " times";
    underdogCount.innerText = "Underdog " + upsets[0] + " times";
}
function updateBiggestBoom(league, biggestBoom, teamID) {
    var biggestBoomTitle = document.getElementById("consistent_or_boom");
    var biggestBoomImage = document.getElementById("team_most_consistent_image");
    var biggestBoomName = document.getElementById("team_most_consistent_name");
    var biggestBoomPoints = document.getElementById("team_most_consistent_points");
    biggestBoomTitle.innerText = "Biggest Boom";
    if (biggestBoom.position === "D/ST" || biggestBoom.position === "DEF") {
        biggestBoomImage.src = "http://a.espncdn.com/combiner/i?img=/i/teamlogos/NFL/500/" + getRealTeamInitials(biggestBoom.realTeamID) + ".png&h=150&w=150";
    }
    else {
        biggestBoomImage.src = "http://a.espncdn.com/i/headshots/nfl/players/full/" + biggestBoom.espnID + ".png";
    }
    var outcomeText = "";
    var boomMatchup = league.getWeek(biggestBoom.weekNumber).getTeamMatchup(teamID);
    if (boomMatchup.byeWeek) {
        outcomeText = ",\nwhich was a byeweek!";
    }
    else {
        if (boomMatchup.getWinningTeam().teamID === teamID) {
            outcomeText = "\n Won match by ";
        }
        else {
            outcomeText = "\n Lost match by ";
        }
        outcomeText = outcomeText + " " + roundToHundred(boomMatchup.marginOfVictory) + " points";
    }
    biggestBoomName.innerText = biggestBoom.firstName + " " + biggestBoom.lastName;
    biggestBoomPoints.innerText = biggestBoom.score + " Points Week " + biggestBoom.weekNumber + outcomeText;
}
function updateTeamTrades(league, member) {
    constructTeamPageTrades(league, member.teamID);
}
function createTeamBarChart(league, member) {
    if (window.memberBarChart !== undefined) {
        window.memberBarChart.data.datasets = [];
        window.memberBarChart.data.datasets.push({
            label: member.teamNameToString(),
            backgroundColor: getMemberColor(member.teamID),
            data: league.getMemberTotalPointsPerPosition(member.teamID)
        });
        window.memberBarChart.data.datasets.push({
            label: "All Opponents",
            backgroundColor: "black",
            data: league.getLeaguePointsPerPosition()
        });
        window.memberBarChart.data.datasets.push({
            label: "League Average",
            backgroundColor: "darkgrey",
            data: league.getMemberOpponentTotalPointsPerPosition(member.teamID)
        });
        window.memberBarChart.update();
    }
    else {
        var ctx = document.getElementById("member_bar_chart_canvas").getContext("2d");
        var chartData = {
            labels: league.settings.positionInfo.getPositions(),
            datasets: [{
                    label: member.teamNameToString(),
                    backgroundColor: getMemberColor(member.teamID),
                    data: league.getMemberTotalPointsPerPosition(member.teamID)
                }, {
                    label: "All Opponents",
                    backgroundColor: "lightgrey",
                    data: league.getLeaguePointsPerPosition()
                }, {
                    label: "League Average",
                    backgroundColor: "darkgrey",
                    data: league.getMemberOpponentTotalPointsPerPosition(member.teamID)
                }]
        };
        window.memberBarChart = new Chart(ctx, {
            type: "bar",
            data: chartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                title: {
                    display: true,
                    position: "top",
                    text: "Total points by position",
                    fontSize: 20,
                    fontColor: "#111",
                },
                scales: {
                    yAxes: [{
                            ticks: {
                                beginAtZero: true,
                            }
                        }]
                },
                plugins: {
                    deferred: {
                        xOffset: 150,
                        yOffset: "50%",
                        delay: 500
                    }
                },
                legend: {
                    display: true,
                    position: "bottom",
                    labels: {
                        fontColor: "#333",
                        fontSize: 12
                    },
                }
            }
        });
        window.memberBarChart.render();
    }
}
function createLeagueStackedGraph(league) {
    if (window.leagueStackedChart !== undefined) {
        window.leagueStackedChart.datasets = [];
        window.leagueStackedChart.datasets = getLeagueStackedDatasets(league);
        window.leagueStackedChart.update();
    }
    else {
        var ctx = document.getElementById("league_stacked_graph_canvas").getContext("2d");
        window.leagueStackedChart = new Chart(ctx, {
            type: "bar",
            data: {
                labels: makeDescendingMemberLabels(league),
                datasets: getLeagueStackedDatasets(league),
            },
            legend: {
                display: true,
                position: "bottom",
                labels: {
                    fontColor: "#333",
                    fontSize: 16
                }
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                title: {
                    display: true,
                    position: "top",
                    text: "Points Scored",
                    fontSize: 24,
                    fontColor: "#111",
                },
                tooltips: {
                    mode: "index",
                    intersect: false
                },
                scales: {
                    xAxes: [{
                            stacked: true
                        }],
                    yAxes: [{
                            stacked: true,
                            beginAtZero: true,
                        }],
                },
                legend: {
                    display: true,
                    position: "bottom",
                    labels: {
                        fontColor: "#333",
                        fontSize: 16
                    }
                }
            },
        });
        window.leagueStackedChart.render();
    }
}
function getLeagueStackedDatasets(league) {
    var datasets = [];
    var positions = league.settings.positionInfo.getPositions();
    var backgroundColors = getPositionColors();
    var labels = [];
    var increment = 0;
    positions.forEach(function (position) {
        var dataset = {
            label: position,
            backgroundColor: backgroundColors[increment],
            data: Array()
        };
        datasets.push(dataset);
        increment += 1;
    });
    league.members.sort(function (a, b) { return (a.stats.pf < b.stats.pf) ? 1 : -1; }).forEach(function (member) {
        labels.push(member.teamNameToString);
        var positionPoints = league.getMemberTotalPointsPerPosition(member.teamID);
        for (var i = 0; i < datasets.length; i++) {
            datasets[i].data.push(positionPoints[i]);
        }
    });
    return datasets;
}
function makeDescendingMemberLabels(league) {
    var labels = [];
    league.members.sort(function (a, b) { return (a.stats.pf < b.stats.pf) ? 1 : -1; }).forEach(function (member) {
        labels.push(member.teamNameToString());
    });
    return labels;
}
function makeMemberLabels(league) {
    var labels = [];
    league.members.forEach(function (member) {
        labels.push(member.teamNameToString());
    });
    return labels;
}
function createLeagueTradeDiagram(league) {
    am4core.useTheme(am4themes_animated);
    var leagueTradeData = createLeagueTradeDiagramData(league);
    initChordChart(leagueTradeData);
}
function createLeagueTradeDiagramData(league) {
    var tradeMap = new Map();
    var tradeList = [];
    league.trades.forEach(function (trade) {
        var initId = trade.initiatingTeamId;
        var consentingTeamIds = trade.consentingTeamIds.slice(1, trade.consentingTeamIds.length);
        consentingTeamIds.forEach(function (partnerId) {
            var tradeMapKey = initId + "," + partnerId;
            var tradeMapAltKey = partnerId + "," + initId;
            if (tradeMap.has(tradeMapKey)) {
                tradeMap.set(tradeMapKey, tradeMap.get(tradeMapKey) + 1);
            }
            else if (tradeMap.has(tradeMapAltKey)) {
                tradeMap.set(tradeMapAltKey, tradeMap.get(tradeMapAltKey) + 1);
            }
            else {
                tradeMap.set(tradeMapKey, 1);
            }
        });
    });
    tradeMap.forEach(function (value, key) {
        tradeList.push(formatTradeValues(league, key, value));
    });
    return tradeList;
}
function formatTradeValues(league, key, numTrades) {
    var names = key.split(",");
    var team1 = parseInt(names[0]);
    var team2 = parseInt(names[1]);
    var formattedData = {
        from: league.getMember(team1).teamNameToString(),
        to: league.getMember(team2).teamNameToString(),
        value: numTrades,
        nodeColor: getMemberColor(team1)
    };
    return formattedData;
}
function initChordChart(chartData) {
    am4core.useTheme(am4themes_animated);
    var chart = am4core.create("league_trade_chart", am4charts.ChordDiagram);
    chart.colors.saturation = 0.45;
    chart.data = chartData;
    chart.dataFields.fromName = "from";
    chart.dataFields.toName = "to";
    chart.dataFields.value = "value";
    chart.dataFields.nodeColor = "nodeColor";
    chart.nodePadding = 0.5;
    chart.minNodeSize = 0.01;
    chart.startAngle = 80;
    chart.endAngle = chart.startAngle + 360;
    chart.sortBy = "value";
    var nodeTemplate = chart.nodes.template;
    nodeTemplate.readerTitle = "Click to show/hide or drag to rearrange";
    nodeTemplate.showSystemTooltip = true;
    nodeTemplate.propertyFields.fill = "color";
    nodeTemplate.tooltipText = "{name}'s trades: {total}";
    nodeTemplate.events.on("over", function (event) {
        var node = event.target;
        node.outgoingDataItems.each(function (dataItem) {
            if (dataItem.toNode) {
                dataItem.link.isHover = true;
                dataItem.toNode.label.isHover = true;
            }
        });
        node.incomingDataItems.each(function (dataItem) {
            if (dataItem.fromNode) {
                dataItem.link.isHover = true;
                dataItem.fromNode.label.isHover = true;
            }
        });
        node.label.isHover = true;
    });
    nodeTemplate.events.on("out", function (event) {
        var node = event.target;
        node.outgoingDataItems.each(function (dataItem) {
            if (dataItem.toNode) {
                dataItem.link.isHover = false;
                dataItem.toNode.label.isHover = false;
            }
        });
        node.incomingDataItems.each(function (dataItem) {
            if (dataItem.fromNode) {
                dataItem.link.isHover = false;
                dataItem.fromNode.label.isHover = false;
            }
        });
        node.label.isHover = false;
    });
    var label = nodeTemplate.label;
    label.relativeRotation = 90;
    label.fillOpacity = 0.25;
    var labelHS = label.states.create("hover");
    labelHS.properties.fillOpacity = 1;
    nodeTemplate.cursorOverStyle = am4core.MouseCursorStyle.pointer;
    var linkTemplate = chart.links.template;
    linkTemplate.strokeOpacity = 0;
    linkTemplate.fillOpacity = 0.1;
    linkTemplate.tooltipText = "{fromName} & {toName}:{value.value}";
    var hoverState = linkTemplate.states.create("hover");
    hoverState.properties.fillOpacity = 0.7;
    hoverState.properties.strokeOpacity = 0.7;
}
function createMainWeeklyLineChart(league) {
    window.myChart.destroy();
    var ctx = document.getElementById("GRAPHCANVAS");
    ctx.classList.toggle("mainChart", true);
    var myWeekLabels = [];
    for (var i = 0; i <= (league.getSeasonPortionWeeks().length); i++) {
        myWeekLabels.push("Week " + i);
    }
    var weeklyScoreMap = new Map();
    weeklyScoreMap.set(-1, [0]);
    league.members.forEach(function (member) {
        weeklyScoreMap.set(member.teamID, [0]);
    });
    league.getSeasonPortionWeeks().forEach(function (week) {
        weeklyScoreMap.get(-1).push(week.getWeekAverage());
        week.matchups.forEach(function (matchup) {
            weeklyScoreMap.get(matchup.home.teamID).push(matchup.home.score);
            if (!matchup.byeWeek) {
                weeklyScoreMap.get(matchup.away.teamID).push(matchup.away.score);
            }
        });
    });
    var datasets = [];
    weeklyScoreMap.forEach(function (value, key) {
        if (key === -1) {
            datasets.push({
                label: "League Average",
                data: value,
                borderColor: "black",
                backGroundColor: "black",
                fill: false,
                lineTension: 0,
            });
        }
        else {
            var curTeam = league.getMember(key);
            var myColor = getMemberColor(key);
            datasets.push({
                label: curTeam.teamNameToString(),
                data: value,
                borderColor: myColor,
                backGroundColor: myColor,
                fill: false,
                lineTension: 0,
            });
        }
    });
    window.myChart = new Chart(ctx, {
        type: "line",
        data: {
            labels: myWeekLabels,
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            title: {
                display: true,
                position: "top",
                text: "Points Scored By Week",
                fontSize: 20,
                fontColor: "#111",
            },
            scales: {
                yAxes: [{
                        ticks: {
                            beginAtZero: true,
                        }
                    }]
            },
            plugins: {
                deferred: {
                    xOffset: 150,
                    yOffset: "50%",
                    delay: 500
                },
                datalabels: {
                    formatter: function () {
                        return "";
                    },
                }
            },
            legend: {
                display: true,
                position: "bottom",
                labels: {
                    fontColor: "#333",
                    fontSize: 12
                },
            }
        }
    });
}
function createMemberWeeklyLineChart(league, member) {
    var weeklyScoreMap = new Map();
    weeklyScoreMap.set(-1, []);
    weeklyScoreMap.set(-2, []);
    weeklyScoreMap.set(member.teamID, []);
    league.weeks.forEach(function (week) {
        if (!week.getTeamMatchup(member.teamID).byeWeek) {
            weeklyScoreMap.get(-2).push(week.getTeamMatchup(member.teamID).getOpponent(member.teamID).score);
        }
        else {
            weeklyScoreMap.get(-2).push(null);
        }
        weeklyScoreMap.get(member.teamID).push(week.getTeam(member.teamID).score);
        weeklyScoreMap.get(-1).push(week.getWeekAverage());
    });
    var datasets = [];
    weeklyScoreMap.forEach(function (value, key) {
        if (key === -1) {
            datasets.push({
                label: "League Average",
                data: value,
                borderColor: "darkgrey",
                backgroundColor: "darkgrey",
                pointBackgroundColor: "darkgrey",
                fill: false,
                lineTension: 0,
            });
        }
        else if (key === -2) {
            datasets.push({
                label: "Opponent",
                data: value,
                borderColor: "black",
                backgroundColor: "black",
                pointBackgroundColor: "black",
                fill: false,
                lineTension: 0,
            });
        }
        else {
            var curTeam = league.getMember(key);
            datasets.push({
                label: curTeam.teamNameToString(),
                data: value,
                borderColor: getMemberColor(key),
                backgroundColor: getMemberColor(key),
                pointBackgroundColor: getMemberColor(key),
                fill: false,
                lineTension: 0,
            });
        }
    });
    if (window.memberLineChart === undefined) {
        var ctx = document.getElementById("TEAM_LINE_CANVAS");
        ctx.classList.toggle("team_weekly_line_chart", true);
        var myWeekLabels = [];
        for (var i = 1; i <= (league.weeks.length); i++) {
            myWeekLabels.push("Week " + i);
        }
        window.memberLineChart = new Chart(ctx, {
            type: "line",
            data: {
                labels: myWeekLabels,
                datasets: datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                title: {
                    display: true,
                    position: "top",
                    text: "Points Scored By Week",
                    fontSize: 20,
                    fontColor: "#111",
                },
                scales: {
                    yAxes: [{
                            ticks: {
                                beginAtZero: true,
                            }
                        }],
                    xAxes: [{
                            ticks: {
                                padding: 40,
                            },
                            gridLines: {
                                display: false
                            }
                        }],
                },
                plugins: {
                    deferred: {
                        xOffset: 150,
                        yOffset: "50%",
                        delay: 500
                    }
                },
                legend: {
                    display: true,
                    position: "bottom",
                    labels: {
                        fontColor: "#333",
                        fontSize: 12
                    },
                }
            }
        });
        window.memberLineChart.render();
    }
    else {
        window.memberLineChart.data.datasets = [];
        window.memberLineChart.data.datasets = datasets;
        window.memberLineChart.update();
    }
}
function createLeagueWeeklyLineChart(league, accumulates) {
    if (window.leagueWeeklyLineChart === undefined) {
        var ctx = document.getElementById("league_weekly_line_canvas").getContext("2d");
        var dataSets = getLeagueLineData(league, accumulates);
        var myWeekLabels = [];
        if (accumulates) {
            myWeekLabels.push();
        }
        for (var i = 1; i <= (league.weeks.length); i++) {
            myWeekLabels.push("Week " + i);
        }
        window.leagueWeeklyLineChart = new Chart(ctx, {
            type: "line",
            data: {
                labels: myWeekLabels,
                datasets: dataSets
            },
            backgroundColor: "#DCDCDC",
            options: {
                tooltips: {
                    mode: "point"
                },
                responsive: true,
                maintainAspectRatio: false,
                showLines: true,
                title: {
                    display: true,
                    position: "top",
                    text: "Points Scored By Week",
                    fontSize: 20,
                    fontColor: "#111",
                },
                scales: {
                    yAxes: [{
                            ticks: {
                                padding: 40,
                            }
                        }],
                    xAxes: [{
                            ticks: {
                                padding: 40,
                            },
                            gridLines: {
                                display: false
                            }
                        }],
                },
                plugins: {
                    deferred: {
                        xOffset: 150,
                        yOffset: "50%",
                        delay: 500
                    }
                },
                legend: {
                    display: true,
                    position: "bottom",
                    labels: {
                        fontColor: "#333",
                        fontSize: 12
                    },
                }
            }
        });
        window.leagueWeeklyLineChart.render();
    }
    else {
        window.leagueWeeklyLineChart.data.datasets = getLeagueLineData(league, accumulates);
        window.leagueWeeklyLineChart.update();
    }
}
function getLeagueLineData(league, accumulates) {
    var weeklyScoreMap = new Map();
    weeklyScoreMap.set(-1, []);
    league.members.forEach(function (member) {
        weeklyScoreMap.set(member.teamID, []);
    });
    league.members.forEach(function (member) {
        weeklyScoreMap.set(member.teamID, []);
    });
    league.getSeasonPortionWeeks().forEach(function (week) {
        weeklyScoreMap.get(-1).push(week.getWeekAverage());
        week.matchups.forEach(function (matchup) {
            weeklyScoreMap.get(matchup.home.teamID).push(roundToHundred(matchup.home.score));
            if (!matchup.byeWeek) {
                weeklyScoreMap.get(matchup.away.teamID).push(roundToHundred(matchup.away.score));
            }
        });
    });
    var datasets = [];
    weeklyScoreMap.forEach(function (value, key) {
        if (key !== -1) {
            var curTeam = league.getMember(key);
            var seasonTotal_1 = 0;
            datasets.push({
                fill: false,
                data: value.map(function (weekScore) {
                    if (accumulates) {
                        seasonTotal_1 += weekScore;
                        return seasonTotal_1;
                    }
                    else {
                        return weekScore;
                    }
                }),
                borderColor: getMemberColor(key),
                backgroundColor: getMemberColor(key),
                pointBackgroundColor: getMemberColor(key),
                lineTension: 0,
                borderWidth: 2,
                label: curTeam.teamNameToString()
            });
        }
    });
    return datasets;
}
function deselectLeagueLineData(labelName) {
    var data = window.leagueWeeklyLineChart.data.datasets;
    if (labelName !== "") {
        data.forEach(function (dataset) {
            if (dataset.label.replace(/^\s+|\s+$/g, "") !== labelName.replace(/^\s+|\s+$/g, "")) {
                var newColor = dataset.backgroundColor + "1A";
                dataset.backgroundColor = newColor;
                dataset.borderColor = newColor;
                dataset.pointBackgroundColor = newColor;
            }
            else {
                dataset.hidden = false;
            }
        });
    }
    window.leagueWeeklyLineChart.data.datasets = data;
    window.leagueWeeklyLineChart.update();
}
function reselectLeagueLineData() {
    var data = window.leagueWeeklyLineChart.data.datasets;
    data.forEach(function (dataset) {
        var color = dataset.backgroundColor;
        if (color.length === 9) {
            dataset.backgroundColor = color.substring(0, color.length - 2);
            dataset.borderColor = color.substring(0, color.length - 2);
            dataset.pointBackgroundColor = color.substring(0, color.length - 2);
        }
    });
    window.leagueWeeklyLineChart.data.datasets = data;
    window.leagueWeeklyLineChart.update();
}
function createMemberStrengthScatterChart(league) {
    var ctx = document.getElementById("quadrant_chart_canvas").getContext("2d");
    var chartDatasets = generateStrengthScatterData(league);
    window.scatterChart = new Chart(ctx, {
        type: "scatter",
        data: {
            datasets: chartDatasets
        },
        options: {
            tooltips: {
                callbacks: {
                    title: function (tooltipItem, data) {
                        var label = data.datasets[tooltipItem[0].datasetIndex].label;
                        var manager = "";
                        var roster = "";
                        if (tooltipItem[0].xLabel > 0) {
                            manager = "Good Manager";
                        }
                        else if (tooltipItem[0].xLabel < 0) {
                            manager = "Bad Manager";
                        }
                        else {
                            manager = "Average Manager";
                        }
                        if (tooltipItem[0].yLabel > 0) {
                            roster = "Good Roster";
                        }
                        else if (tooltipItem[0].yLabel < 0) {
                            roster = "Bad Roster";
                        }
                        else {
                            roster = "Average Roster";
                        }
                        return label + "\n\n" + manager + "\n" + roster;
                    },
                    label: function (tooltipItem) {
                        var aboveBelowGP = "";
                        if (tooltipItem.xLabel > 0) {
                            aboveBelowGP = "GP: +" + tooltipItem.xLabel + " avg";
                        }
                        else {
                            aboveBelowGP = "GP: " + tooltipItem.xLabel + " avg";
                        }
                        return aboveBelowGP;
                    },
                    afterLabel: function (tooltipItem) {
                        var aboveBelowPP = "";
                        if (tooltipItem.yLabel > 0) {
                            aboveBelowPP = "PP: +" + tooltipItem.yLabel + " avg";
                        }
                        else {
                            aboveBelowPP = "PP: " + tooltipItem.yLabel + " avg";
                        }
                        return aboveBelowPP;
                    }
                }
            },
            aspectRatio: 1,
            title: {
                display: true,
                position: "top",
                text: "Management Skill vs Roster Strength",
                fontSize: 20,
                fontColor: "#111",
            },
            intersect: true,
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                yAxes: [{
                        padding: 40,
                        gridLines: {
                            zeroLineWidth: 1,
                            zeroLineColor: "rgba(0,0,0,1)"
                        },
                        ticks: {
                            display: false,
                            suggestedMin: Math.round(0 - getPPMargin(league)),
                            suggestedMax: Math.round(getPPMargin(league)),
                        },
                        scaleLabel: {
                            display: true,
                            labelString: "<---------------- Roster Strength ---------------->"
                        },
                    }],
                xAxes: [{
                        beginAtZero: false,
                        padding: 40,
                        display: true,
                        gridLines: {
                            zeroLineWidth: 1,
                            zeroLineColor: "rgba(0,0,0,1)"
                        },
                        ticks: {
                            display: false,
                            suggestedMin: -1 * getGutPointMargin(league),
                            suggestedMax: getGutPointMargin(league),
                        },
                        scaleLabel: {
                            display: true,
                            labelString: "<---------------- Management Skill ---------------->"
                        },
                    }]
            },
            legend: {
                display: true,
                position: "bottom",
                labels: {
                    fontColor: "#333",
                    fontSize: 12
                }
            },
            plugins: {
                deferred: {
                    xOffset: 150,
                    yOffset: "50%",
                    delay: 500
                }
            },
        }
    });
    window.scatterChart.render();
}
function generateStrengthScatterData(league) {
    var datasets = [];
    league.members.forEach(function (member) {
        var img = new Image();
        img.width = 40;
        img.height = 40;
        img.src = member.logoURL;
        datasets.push({
            label: member.teamNameToString(),
            borderColor: hexToRGB(getMemberColor(member.teamID), 1),
            backgroundColor: hexToRGB(getMemberColor(member.teamID), 1),
            pointStyle: img,
            hitRadius: 15,
            radius: 15,
            data: [{
                    x: member.stats.getAverageGutPoints(),
                    y: roundToHundred(member.stats.pp - league.getLeaguePP()),
                }]
        });
    });
    return datasets;
}
function getPPMargin(league) {
    var avg = league.getLeaguePP();
    var low = league.getLowestPPMember().stats.pp;
    var high = league.getHighestPPMember().stats.pp;
    if (Math.abs(avg - low) > Math.abs(avg - high)) {
        return 1.2 * (avg - low);
    }
    else {
        return 1.2 * (high - avg);
    }
}
function getGutPointMargin(league) {
    var avg = league.getLeagueGutPointAverage();
    var high = league.getHighestGutPointMember().stats.getAverageGutPoints();
    var low = league.getLowestGutPointMember().stats.getAverageGutPoints();
    if (Math.abs(avg - low) > Math.abs(avg - high)) {
        return Math.abs(avg - low);
    }
    else {
        return Math.abs(avg - high);
    }
}
function createTeamRadarChart(league, member) {
    if (window.myRadarChart !== undefined) {
        window.myRadarChart.data.datasets = [];
        window.myRadarChart.data.datasets.push({
            label: "Average",
            fill: true,
            backgroundColor: "rgba(179,181,198,0.2)",
            borderColor: "rgba(179,181,198,1)",
            pointBorderColor: "#fff",
            pointBackgroundColor: "rgba(179,181,198,1)",
            data: league.getLeagueAveragePointsPerPosition()
        });
        window.myRadarChart.data.datasets.push({
            label: member.teamNameToString(),
            fill: true,
            backgroundColor: "rgba(255,99,132,0.2)",
            borderColor: "rgba(255,99,132,1)",
            pointBorderColor: "#fff",
            pointBackgroundColor: "rgba(255,99,132,1)",
            data: league.getTeamAveragePointsPerPosition(member.teamID)
        });
        window.myRadarChart.update();
    }
    else {
        window.myRadarChart = new Chart(document.getElementById("radar_chart_canvas").getContext("2d"), {
            type: "radar",
            data: {
                labels: league.settings.positionInfo.getPositions(),
                datasets: [
                    {
                        label: "Average",
                        fill: true,
                        backgroundColor: "rgba(179,181,198,0.2)",
                        borderColor: "rgba(179,181,198,1)",
                        pointBorderColor: "#fff",
                        pointBackgroundColor: "rgba(179,181,198,1)",
                        data: league.getLeagueAveragePointsPerPosition()
                    }, {
                        label: member.teamNameToString(),
                        fill: true,
                        backgroundColor: "rgba(255,99,132,0.2)",
                        borderColor: "rgba(255,99,132,1)",
                        pointBorderColor: "#fff",
                        pointBackgroundColor: "rgba(255,99,132,1)",
                        data: league.getTeamAveragePointsPerPosition(member.teamID)
                    }
                ]
            },
            options: {
                title: {
                    display: false,
                    text: "Point Per Position",
                    position: "bottom"
                },
                legend: {
                    position: "bottom"
                },
                scale: {
                    ticks: {
                        beginAtZero: true,
                        max: 1,
                        min: 0,
                        stepSize: .25,
                        display: false,
                    }
                }
            }
        });
        window.myRadarChart.render();
    }
}
function fixNoImage() {
    this.src = "./assets/images/user1.png";
    this.style.backgroundColor = "white";
    this.onerror = null;
}
function enableButtons() {
    document.getElementById("league_name_header").onclick = function () {
        $(".nav-link").removeClass("active");
        fadeToLeaguePage();
    };
    document.getElementById("pwrRankButton").onclick = function () {
        $(".nav-link").removeClass("active");
        fadeToLeaguePage();
    };
    document.getElementById("stats_button").onclick = function () {
        $(".nav-link").removeClass("active");
        fadeToLeaguePage();
    };
}
function enableTradePage() {
    document.getElementById("trades_button").style.display = "block";
    document.getElementById("trades_button").onclick = function () {
        $(".nav-link").removeClass("active");
        fadeToLeaguePage();
    };
}
function main() {
    localStorage.clear();
    var sleeperButton = document.getElementById("platform_input_0");
    var espnButton = document.getElementById("platform_input_1");
    var leagueIDInput = document.getElementById("league_id_input");
    var seasonIDSelector = document.getElementById("select_year_input");
    var leagueID = leagueIDInput.value.replace(/\D/g, "");
    var seasonID = parseInt(seasonIDSelector.value.replace(/\D/g, ""), 10);
    if (leagueID !== undefined && seasonID !== undefined) {
        initCube();
        if (sleeperButton.checked) {
            getSleeperLeagueSettings(leagueID, seasonID);
        }
        else if (espnButton.checked) {
            localStorage.clear();
            getESPNSettings(leagueID, seasonID);
        }
    }
}
function selectedPlatform(button) {
    var seasonIDSelector = document.getElementById("select_year_input");
    var children = seasonIDSelector.childNodes;
    if (button.value === "espn") {
        children.forEach(function (option) {
            if (option.value !== "2019") {
                option.disabled = true;
            }
            else {
                option.disabled = false;
                option.setAttribute("checked", "checked");
                option.setAttribute("selected", "true");
            }
        });
    }
    else {
        children.forEach(function (option) {
            option.disabled = false;
        });
    }
}
function enablePlugins() {
    $(function () {
        $('[data-toggle="tooltip"]').tooltip();
    });
    new ScrollHint("#league_trades_container", {
        suggestiveShadow: true
    });
}
function enableSeasonPortionSelector(league, isPlayoffs) {
    if (!isPlayoffs) {
        document.getElementById(SEASON_PORTION.ALL).classList.add("disabled");
        document.getElementById(SEASON_PORTION.POST).classList.add("disabled");
        document.getElementById(SEASON_PORTION.ALL).classList.remove("active");
        document.getElementById(SEASON_PORTION.REGULAR).classList.add("active");
        document.getElementById("post_radio_button").disabled = true;
        document.getElementById("complete_radio_button").disabled = true;
    }
    else if (league.settings.seasonDuration.regularSeasonLength === 0) {
        document.getElementById(SEASON_PORTION.ALL).classList.add("disabled");
        document.getElementById(SEASON_PORTION.REGULAR).classList.add("disabled");
        document.getElementById("regular_radio_button").disabled = true;
        document.getElementById("complete_radio_button").disabled = true;
        document.getElementById(SEASON_PORTION.ALL).classList.remove("active");
    }
    else {
        document.getElementById(SEASON_PORTION.ALL).onclick = function () {
            league.seasonPortion = SEASON_PORTION.ALL;
            league.resetStats();
            league.setMemberStats(league.getSeasonPortionWeeks());
            for (var i = 1; i <= league.members.length; i++) {
                if ($("#" + i).find("a.active").length !== 0) {
                    fadeTeam(league, parseInt(i.toString(), 10));
                }
            }
            league.updateMainPage();
        };
        document.getElementById(SEASON_PORTION.REGULAR).onclick = function () {
            league.seasonPortion = SEASON_PORTION.REGULAR;
            league.resetStats();
            league.setMemberStats(league.getSeasonPortionWeeks());
            for (var i = 1; i <= league.members.length; i++) {
                if ($("#" + i).find("a.active").length !== 0) {
                    fadeTeam(league, parseInt(i.toString(), 10));
                }
            }
            league.updateMainPage();
        };
        document.getElementById(SEASON_PORTION.POST).onclick = function () {
            league.seasonPortion = SEASON_PORTION.POST;
            league.resetStats();
            league.setMemberStats(league.getSeasonPortionWeeks());
            for (var i = 1; i <= league.members.length; i++) {
                if ($("#" + i).find("a.active").length !== 0) {
                    fadeTeam(league, parseInt(i.toString(), 10));
                }
            }
            league.updateMainPage();
        };
    }
}
function createTeamMenu(league) {
    var tabsList = document.getElementById("tabs-content");
    var nav = document.getElementById("team_dropdown");
    var q = document.getElementById("leaguePage");
    tabsList.appendChild(q);
    for (var i in league.members) {
        var a = document.createElement("li");
        a.id = league.members[i].teamID.toString();
        a.classList.add("align-items-left", "side-item", "justify-content-center");
        a.onclick = function () {
            $(".nav-link").removeClass("active");
            fadeTeamWithLogic(league, parseInt(this.id, 10));
        };
        var b = document.createElement("a");
        b.id = league.members[i].teamID + "_link";
        b.setAttribute("data-toggle", "pill");
        b.href = "#teamPill";
        b.classList.add("nav-link", "team-menu-link");
        b.style.paddingLeft = "3px;";
        var c = document.createElement("img");
        c.src = league.members[i].logoURL;
        c.style.width = "25px";
        c.style.height = "25px";
        c.style.borderRadius = "25px";
        c.addEventListener("error", fixNoImage);
        c.style.marginLeft = "8px";
        c.style.marginRight = "auto";
        b.appendChild(c);
        var d = document.createTextNode(" " + league.members[i].teamNameToString());
        b.appendChild(d);
        a.appendChild(b);
        nav.appendChild(a);
    }
}
function enableYearSelector(league) {
    var yearSelector = document.getElementById("available_seasons");
    yearSelector.style.display = null;
    league.settings.seasonDuration.yearsActive.forEach(function (year) {
        var option = document.createElement("option");
        option.text = year.toString();
        option.value = year.toString();
        if (option.value === league.season.toString()) {
            option.selected = true;
        }
        yearSelector.add(option);
    });
}
function createPositionalCheckboxes(league) {
    var checkboxGroupContainer = document.getElementById("position_checkbox_container");
    league.settings.positionInfo.getPositions().forEach(function (position) {
        checkboxGroupContainer.appendChild(createPositionCheckbox(position, league));
    });
}
function createPositionCheckbox(position, league) {
    var container = document.createElement('div');
    container.classList.add("form-check", "form-check-inline");
    var input = document.createElement("input");
    input.classList.add("form-check-input");
    input.type = "checkbox";
    input.id = position + "_toggle_checkbox";
    input.value = position;
    input.checked = true;
    input.onclick = function () {
        if (input.checked) {
            var index = league.settings.positionInfo.excludedPositions.indexOf(positionToInt.get(position));
            if (index > -1) {
                league.settings.positionInfo.excludedPositions.splice(index, 1);
            }
        }
        else {
            league.settings.positionInfo.excludedPositions.push(positionToInt.get(position));
        }
        league.resetStats();
        league.setMemberStats(league.getSeasonPortionWeeks());
        league.updateMainPage();
    };
    var label = document.createElement("label");
    label.classList.add("form-check-label");
    label.htmlFor = position;
    label.innerText = position;
    container.appendChild(input);
    container.appendChild(label);
    return container;
}
function sortTableRecord(data, type, row, settings) {
    if (type === "sort") {
        return parseInt(data.split("-")[0]) / parseInt(data.split("-")[1]);
    }
    return data;
}
function renderTablePercentage(data, type) {
    if (type === "display") {
        if (parseFloat(data) === 0 || parseFloat(data) === 1) {
            return data + ".00%";
        }
        else {
            return data + "%";
        }
    }
    else {
        return data;
    }
}
function renderTableOrdinalNumber(data, type) {
    if (type === "display") {
        data = ordinal_suffix_of(parseInt(data, 10));
    }
    return data;
}
function renderTableDifferenceNumber(data, type) {
    if (type === "display" && parseInt(data, 10) > 0) {
        data = "+" + data;
    }
    return data;
}
function createLeagueStatsTable(league) {
    initLeagueStatsTable(league);
    updateLeagueStatsTable(league);
}
function updateLeagueStatsTable(league) {
    var table = $("#league_stats_table").DataTable();
    table.clear();
    league.members.forEach(function (member) {
        table.row.add(getLeagueStatsTableRowData(member));
    });
    table.draw();
    $("#league_stats_table tr").hover(function () {
        $(this).addClass("hover");
        deselectLeagueLineData($(this).find("td:first-child").text());
    }, function () {
        $(this).removeClass("hover");
        reselectLeagueLineData();
    });
}
function getLeagueStatsTableRowData(member) {
    var image = document.createElement("img");
    image.src = member.logoURL;
    image.style.width = "25px";
    image.style.height = "25px";
    image.style.borderRadius = "25px";
    image.style.marginRight = "8px";
    return {
        Team: image.outerHTML + member.teamNameToString(),
        Rank: member.stats.rank,
        Record: member.recordToString(),
        Pct: member.stats.getWinPct().toString(),
        PF: roundToHundred(member.stats.pf),
        OPSLAP: roundToHundred(member.stats.OPSLAP),
        PP: roundToHundred(member.stats.pp),
        PA: roundToHundred(member.stats.pa)
    };
}
function initLeagueStatsTable(league) {
    $("#league_stats_table").DataTable({
        paging: false,
        searching: false,
        orderClasses: true,
        order: [[1, "asc"]],
        columns: [
            { data: "Team" },
            {
                data: "Rank",
                render: renderTableOrdinalNumber
            },
            {
                data: "Record",
                render: sortTableRecord
            },
            {
                data: "Pct",
                render: renderTablePercentage
            },
            {
                data: "PF"
            },
            {
                data: "OPSLAP"
            },
            {
                data: "PP"
            },
            {
                data: "PA"
            },
        ],
        createdRow: function (row, data, index) {
            var member = league.getMemberByStats(data.PF, data.PA, data.PP, data.OPSLAP, data.Record);
            $("td", row).eq(0);
            $("td", row).eq(1).css("background-color", getDarkColor(member.stats.rank / league.members.length));
            $("td", row).eq(2);
            $("td", row).eq(3);
            $("td", row).eq(4).css("background-color", getDarkColor(league.getPointsScoredFinish(member.teamID) / league.members.length));
            $("td", row).eq(5).css("background-color", getDarkColor(league.getOPSLAPFinish(member.teamID) / league.members.length));
            $("td", row).eq(6).css("background-color", getDarkColor(league.getPotentialPointsFinish(member.teamID) / league.members.length));
            $("td", row).eq(7).css("background-color", getDarkColor(league.getPointsAgainstFinish(member.teamID) / league.members.length));
        },
    });
}
function generateMatchupTable(league, firstTeamId, weekNumber) {
    $("#matchup_modal_lineup_body").empty();
    var matchup = league.getWeek(weekNumber).getTeamMatchup(firstTeamId);
    var tableTitle = document.getElementById("matchup_modal_title");
    if (matchup.isPlayoffs) {
        tableTitle.innerText = "Week " + weekNumber.toString() + ", Playoffs";
    }
    else if (matchup.byeWeek) {
        tableTitle.innerText = "Week " + weekNumber.toString() + ", Bye Week";
    }
    else {
        tableTitle.innerText = "Week " + weekNumber.toString() + ", Regular Season";
    }
    document.getElementById("matchup_modal_first_team_name").innerText = league.getMember(matchup.home.teamID).teamNameToString();
    if (!matchup.byeWeek) {
        document.getElementById("matchup_modal_second_team_name").innerText = league.getMember(matchup.away.teamID).teamNameToString();
    }
    var lineups = getLineups(league, matchup);
    var homeLineup = lineups[0];
    var homeBench = lineups[1];
    var awayLineup = lineups[2];
    var awayBench = lineups[3];
    generateModalScore(homeLineup, awayLineup, matchup.byeWeek);
    generateLineupTable(homeLineup, awayLineup, league, matchup.byeWeek);
    generateBenchTable(homeBench, awayBench);
}
function getLineups(league, matchup) {
    var lineups = [];
    if (document.getElementById("modal-home-lineup").classList.contains("active")) {
        lineups.push(matchup.home.lineup);
        lineups.push(matchup.home.bench);
    }
    else if (document.getElementById("modal-home-optimal-lineup").classList.contains("active")) {
        var optimalLineup_1 = getOptimalLineup(league.settings.positionInfo.activeLineupSlots, matchup.home.getAllPlayers(), league.settings.positionInfo.excludedLineupSlots, league.settings.positionInfo.excludedPositions);
        var optimalLineupBench = matchup.home.getAllPlayers().filter(function (player) {
            return !optimalLineup_1.includes(player);
        });
        lineups.push(optimalLineup_1);
        lineups.push(optimalLineupBench);
    }
    else if (document.getElementById("modal-home-opslap").classList.contains("active")) {
        var projectedOptimalLineup_1 = getOptimalProjectedLineup(league.settings.positionInfo.activeLineupSlots, matchup.home.getAllPlayers(), league.settings.positionInfo.excludedLineupSlots, league.settings.positionInfo.excludedPositions);
        var projectedOptimalLineupBench = matchup.home.getAllPlayers().filter(function (player) {
            return !projectedOptimalLineup_1.includes(player);
        });
        lineups.push(projectedOptimalLineup_1);
        lineups.push(projectedOptimalLineupBench);
    }
    if (document.getElementById("modal-away-lineup").classList.contains("active")) {
        lineups.push(matchup.away.lineup);
        lineups.push(matchup.away.bench);
    }
    else if (document.getElementById("modal-away-optimal-lineup").classList.contains("active")) {
        var optimalAwayLineup_1 = getOptimalLineup(league.settings.positionInfo.activeLineupSlots, matchup.away.getAllPlayers(), league.settings.positionInfo.excludedLineupSlots, league.settings.positionInfo.excludedPositions);
        var optimalAwayLineupBench = matchup.away.getAllPlayers().filter(function (player) {
            return !optimalAwayLineup_1.includes(player);
        });
        lineups.push(optimalAwayLineup_1);
        lineups.push(optimalAwayLineupBench);
    }
    else if (document.getElementById("modal-away-opslap").classList.contains("active")) {
        var projectedOptimalAwayLineup_1 = getOptimalProjectedLineup(league.settings.positionInfo.activeLineupSlots, matchup.away.getAllPlayers(), league.settings.positionInfo.excludedLineupSlots, league.settings.positionInfo.excludedPositions);
        var projectedOptimalAwayLineupBench = matchup.away.getAllPlayers().filter(function (player) {
            return !projectedOptimalAwayLineup_1.includes(player);
        });
        lineups.push(projectedOptimalAwayLineup_1);
        lineups.push(projectedOptimalAwayLineupBench);
    }
    return lineups;
}
function generateModalScore(homeLineup, awayLineup, isBye) {
    var homeScore = 0;
    var awayScore = 0;
    homeLineup.forEach(function (player) {
        homeScore += player.score;
    });
    awayLineup.forEach(function (player) {
        awayScore += player.score;
    });
    homeScore = roundToHundred(homeScore);
    awayScore = roundToHundred(awayScore);
    var tableBody = document.getElementById("matchup_modal_lineup_body");
    var scoreRow = document.createElement("tr");
    var teamScoreCell = document.createElement("td");
    var otherTeamScoreCell = document.createElement("td");
    var marginScoreCell = document.createElement("td");
    var teamScore = document.createElement("h5");
    var otherTeamScore = document.createElement("h5");
    teamScore.style.textAlign = "right;";
    otherTeamScore.style.textAlign = "left;";
    var marginScore = document.createElement("b");
    otherTeamScore.innerText = roundToHundred(awayScore).toString() + " Points";
    teamScore.innerText = roundToHundred(homeScore).toString() + " Points";
    if (!isBye) {
        marginScore.innerText = roundToHundred(homeScore - awayScore).toString();
    }
    else {
        marginScore.innerText = "0.00";
    }
    teamScoreCell.appendChild(teamScore);
    otherTeamScoreCell.appendChild(otherTeamScore);
    marginScoreCell.appendChild(marginScore);
    scoreRow.appendChild(teamScoreCell);
    scoreRow.appendChild(marginScoreCell);
    scoreRow.appendChild(otherTeamScoreCell);
    scoreRow.style.textAlign = "center";
    tableBody.appendChild(scoreRow);
}
function generateLineupTable(homeLineup, awayLineup, league, isBye) {
    var tableBody = document.getElementById("matchup_modal_lineup_body");
    var index = 0;
    league.settings.positionInfo.activeLineupSlots.forEach(function (slot) {
        var slotId = slot[0];
        var slotAmount = slot[1];
        for (var i = 0; i < slotAmount; i++) {
            var firstPlayer = homeLineup[index];
            var secondPlayer = void 0;
            if (!isBye) {
                secondPlayer = awayLineup[index];
            }
            else {
                secondPlayer = new EmptySlot(slotId);
            }
            tableBody.appendChild(generateMatchupPlayerRow(firstPlayer, secondPlayer, slotId));
            index += 1;
        }
    });
}
function generateBenchTable(homeBench, awayBench) {
    var tableBody = document.getElementById("matchup_modal_bench_table_body");
    $("#matchup_modal_bench_table_body").empty();
    var size = Math.max(homeBench.length, awayBench.length);
    for (var i = 0; i < size; i++) {
        var row = document.createElement("tr");
        if (homeBench[i]) {
            row.appendChild(generateBenchPlayerCell(homeBench[i], true, 20));
        }
        else {
            row.appendChild(generateBenchPlayerCell(new EmptySlot(88), true, 20));
        }
        row.appendChild(document.createElement("td"));
        if (awayBench[i]) {
            row.appendChild(generateBenchPlayerCell(awayBench[i], false, 20));
        }
        else {
            row.appendChild(generateBenchPlayerCell(new EmptySlot(88), false, 20));
        }
        tableBody.appendChild(row);
    }
}
function enableModalLineupSwitcher(league, firstTeamId, weekNumber) {
    var homeList = [document.getElementById("modal-home-lineup"),
        document.getElementById("modal-home-optimal-lineup"),
        document.getElementById("modal-home-opslap")];
    homeList.forEach(function (button) {
        button.onclick = function () {
            homeList.forEach(function (innerButton) { innerButton.classList.remove("active"); innerButton.children[0].classList.remove("active"); });
            button.children[0].classList.add("active");
            button.classList.add("active");
            generateMatchupTable(league, firstTeamId, weekNumber);
        };
    });
    var awayList = [document.getElementById("modal-away-lineup"),
        document.getElementById("modal-away-optimal-lineup"),
        document.getElementById("modal-away-opslap")];
    awayList.forEach(function (button) {
        button.onclick = function () {
            awayList.forEach(function (innerButton) { innerButton.classList.remove("active"); innerButton.children[0].classList.remove("active"); });
            button.children[0].classList.add("active");
            button.classList.add("active");
            generateMatchupTable(league, firstTeamId, weekNumber);
        };
    });
}
function generateMatchupPlayerRow(player, otherPlayer, slot) {
    var tr = document.createElement("tr");
    var margin = player.score - otherPlayer.score;
    var playerBadgeCell = generatePositionBadge(margin, slot);
    var firstPlayerCell;
    var otherPlayerCell;
    try {
        firstPlayerCell = generatePlayerRowCell(player, true);
    }
    catch (error) {
        console.log(error);
        console.log(player);
    }
    try {
        otherPlayerCell = generatePlayerRowCell(otherPlayer, false);
    }
    catch (error) {
        console.log(error);
        console.log(otherPlayer);
    }
    if (margin > 0) {
        firstPlayerCell.style.background = "linear-gradient(to left, #00ff00 0%, #ffffff 100%)";
        otherPlayerCell.style.background = "linear-gradient(to right, #ff0000 0%, #ffffff 100%)";
    }
    else if (margin < 0) {
        otherPlayerCell.style.background = "linear-gradient(to right, #00ff00 0%, #ffffff 100%)";
        firstPlayerCell.style.background = "linear-gradient(to left, #ff0000 0%, #ffffff 100%)";
    }
    else {
    }
    tr.appendChild(firstPlayerCell);
    tr.appendChild(playerBadgeCell);
    tr.appendChild(otherPlayerCell);
    return tr;
}
function generateTeamPlayerRow(player) {
    var tr = document.createElement("tr");
    var firstPlayerCell = generateBenchPlayerCell(player, true, 20);
    tr.appendChild(firstPlayerCell);
    return tr;
}
function generatePlayerRowCell(player, homePlayer) {
    var td = document.createElement("td");
    var row = document.createElement("div");
    row.classList.add("row");
    var imageDiv = document.createElement("div");
    imageDiv.classList.add("col-3", "pt-3");
    var image = document.createElement("img");
    var pictureURL = "";
    if (player.position === "D/ST" || player.position === "DEF") {
        pictureURL = "https://a.espncdn.com/combiner/i?img=/i/teamlogos/NFL/500/" + getRealTeamInitials(player.realTeamID) + ".png&h=150&w=150";
    }
    else {
        pictureURL = "https://a.espncdn.com/i/headshots/nfl/players/full/" + player.espnID + ".png";
    }
    image.classList.add("player_badge_image", "my-auto");
    image.src = pictureURL;
    var nameDiv = document.createElement("div");
    nameDiv.classList.add("col-6", "pt-3");
    var boldName = document.createElement("b");
    var teamParagraph = document.createElement("p");
    boldName.innerText = player.firstName + " " + player.lastName;
    teamParagraph.innerText = player.position + " - " + getRealTeamInitials(player.realTeamID);
    var lineBreak = document.createElement("br");
    var scoreDiv = document.createElement("div");
    scoreDiv.classList.add("col-3");
    var scoreTitle = document.createElement("div");
    scoreTitle.innerText = "Score";
    scoreTitle.style.fontSize = ".8em";
    var scoreText = document.createElement("b");
    scoreText.innerText = roundToHundred(player.score).toString();
    var projectedTitle = document.createElement("div");
    projectedTitle.innerText = "Projected";
    projectedTitle.style.fontSize = ".6em";
    var projectedText = document.createElement("small");
    projectedText.innerText = roundToHundred(player.projectedScore).toString();
    if (homePlayer) {
        row.appendChild(imageDiv);
        row.appendChild(nameDiv);
        row.appendChild(scoreDiv);
        scoreDiv.style.textAlign = "right";
        nameDiv.style.textAlign = "left";
    }
    else {
        scoreDiv.style.textAlign = "left";
        nameDiv.style.textAlign = "right";
        row.appendChild(scoreDiv);
        row.appendChild(nameDiv);
        row.appendChild(imageDiv);
    }
    imageDiv.appendChild(image);
    nameDiv.appendChild(boldName);
    nameDiv.appendChild(lineBreak);
    nameDiv.appendChild(teamParagraph);
    nameDiv.classList.add("player_cell_name");
    scoreDiv.classList.add("player_cell_score");
    scoreDiv.appendChild(scoreTitle);
    scoreDiv.appendChild(scoreText);
    scoreDiv.appendChild(document.createElement("br"));
    scoreDiv.appendChild(projectedTitle);
    scoreDiv.appendChild(projectedText);
    td.appendChild(row);
    return td;
}
function generateBenchPlayerCell(player, homePlayer, slot) {
    var td = document.createElement("td");
    var row = document.createElement("div");
    var badge = generateBenchPositionBadge(slot);
    row.classList.add("row");
    var imageDiv = document.createElement("div");
    imageDiv.classList.add("col-2", "pt-3");
    var image = document.createElement("img");
    var pictureURL = "./assets/images/user1.png";
    if (player.position === "D/ST" || player.position === "DEF") {
        pictureURL = "https://a.espncdn.com/combiner/i?img=/i/teamlogos/NFL/500/" + getRealTeamInitials(player.realTeamID) + ".png&h=150&w=150";
    }
    else if (player.espnID !== "-1") {
        pictureURL = "https://a.espncdn.com/i/headshots/nfl/players/full/" + player.espnID + ".png";
    }
    var badgeDiv = document.createElement("div");
    badgeDiv.classList.add("col-3", "pt-3");
    badgeDiv.appendChild(badge);
    image.classList.add("player_badge_image", "my-auto");
    image.src = pictureURL;
    var nameDiv = document.createElement("div");
    nameDiv.classList.add("col-4", "pt-3");
    var boldName = document.createElement("b");
    var teamParagraph = document.createElement("p");
    boldName.innerText = player.firstName + " " + player.lastName;
    teamParagraph.innerText = player.position + " - " + getRealTeamInitials(player.realTeamID);
    var lineBreak = document.createElement("br");
    var scoreDiv = document.createElement("div");
    scoreDiv.classList.add("col-3");
    var scoreTitle = document.createElement("div");
    scoreTitle.innerText = "Score";
    scoreTitle.style.fontSize = ".8em";
    var scoreText = document.createElement("b");
    scoreText.innerText = roundToHundred(player.score).toString();
    var projectedTitle = document.createElement("div");
    projectedTitle.innerText = "Projected";
    projectedTitle.style.fontSize = ".6em";
    var projectedText = document.createElement("small");
    projectedText.innerText = roundToHundred(player.projectedScore).toString();
    if (homePlayer) {
        row.appendChild(badgeDiv);
        row.appendChild(imageDiv);
        row.appendChild(nameDiv);
        row.appendChild(scoreDiv);
        scoreDiv.style.textAlign = "right";
    }
    else {
        scoreDiv.style.textAlign = "left";
        row.appendChild(scoreDiv);
        row.appendChild(nameDiv);
        row.appendChild(imageDiv);
        row.appendChild(badgeDiv);
    }
    imageDiv.appendChild(image);
    nameDiv.appendChild(boldName);
    nameDiv.appendChild(lineBreak);
    nameDiv.appendChild(teamParagraph);
    nameDiv.classList.add("player_cell_name");
    scoreDiv.classList.add("player_cell_score");
    scoreDiv.appendChild(scoreTitle);
    scoreDiv.appendChild(scoreText);
    scoreDiv.appendChild(document.createElement("br"));
    scoreDiv.appendChild(projectedTitle);
    scoreDiv.appendChild(projectedText);
    td.appendChild(row);
    return td;
}
function generateGenericPlayerCell(player) {
    var td = document.createElement("td");
    var row = document.createElement("div");
    row.classList.add("row");
    var imageDiv = document.createElement("div");
    imageDiv.classList.add("col-3", "pt-3");
    var image = document.createElement("img");
    var pictureURL = "";
    if (player.position === "D/ST" || player.position === "DEF") {
        pictureURL = "https://a.espncdn.com/combiner/i?img=/i/teamlogos/NFL/500/" + getRealTeamInitials(player.realTeamID) + ".png&h=150&w=150";
    }
    else {
        pictureURL = "https://a.espncdn.com/i/headshots/nfl/players/full/" + player.espnID + ".png";
    }
    image.classList.add("player_badge_image", "my-auto");
    image.src = pictureURL;
    var nameDiv = document.createElement("div");
    nameDiv.classList.add("col-6", "pt-3");
    var boldName = document.createElement("b");
    var teamParagraph = document.createElement("p");
    boldName.innerText = player.firstName + " " + player.lastName;
    teamParagraph.innerText = player.position + " - " + getRealTeamInitials(player.realTeamID);
    var lineBreak = document.createElement("br");
    row.appendChild(imageDiv);
    row.appendChild(nameDiv);
    nameDiv.style.textAlign = "left";
    imageDiv.appendChild(image);
    nameDiv.appendChild(boldName);
    nameDiv.appendChild(lineBreak);
    nameDiv.appendChild(teamParagraph);
    nameDiv.classList.add("player_cell_name");
    td.appendChild(row);
    return td;
}
function updateMainPageLeagueStatCards(league) {
    document.getElementById("league_weekly_average").innerText = roundToHundred(league.getLeagueWeeklyAverage()).toString();
    document.getElementById("league_standard_deviation").innerText = roundToHundred(league.getLeagueStandardDeviation()).toString();
    document.getElementById("league_weekly_average_pp").innerText = roundToHundred(league.getLeaguePP() / league.getSeasonPortionWeeks().length).toString();
    updateLeagueEfficiency(league);
}
function initMemberWeekTable(league) {
    $("#memberWeekTable").DataTable({
        paging: false,
        searching: false,
        orderClasses: true,
        order: [[0, "asc"]],
        columns: [
            { data: "Week" },
            {
                data: "Score",
            },
            {
                data: "VS",
            },
            {
                data: "Margin",
            },
        ],
        createdRow: function (row, data, index) {
            var curTeamId = document.getElementById("teamPill").getAttribute("currentteam");
            var member = league.getMember(parseInt(curTeamId));
            var week = league.getWeek(data.Week);
            $(row).attr("data-toggle", "modal");
            $(row).attr("data-target", "#matchup_modal");
            $(row).click(function () {
                var teamID = parseInt(document.getElementById("teamPill").getAttribute("currentteam"));
                enableModalLineupSwitcher(league, teamID, data.Week);
                generateMatchupTable(league, teamID, data.Week);
            });
            $("td", row).eq(1).css("background-color", getCardColor(week.getTeamScoreFinish(member.teamID), league.members.length));
            $("td", row).eq(2).css("background-color", getCardColor(league.getMarginFinish(member.teamID, week.weekNumber), week.matchups.filter(function (it) { return !it.byeWeek; }).length * 2));
            $("td", row).eq(3).css("background-color", getCardColor(league.getMarginFinish(member.teamID, week.weekNumber), week.matchups.filter(function (it) { return !it.byeWeek; }).length * 2));
            $(row).mouseenter(function () {
                $("td", row).eq(1).css("background-color", getDarkCardColor(week.getTeamScoreFinish(member.teamID), league.members.length));
                $("td", row).eq(2).css("background-color", getDarkCardColor(league.getMarginFinish(member.teamID, week.weekNumber), week.matchups.filter(function (it) { return !it.byeWeek; }).length * 2));
                $("td", row).eq(3).css("background-color", getDarkCardColor(league.getMarginFinish(member.teamID, week.weekNumber), week.matchups.filter(function (it) { return !it.byeWeek; }).length * 2));
            }).mouseleave(function () {
                $("td", row).eq(1).css("background-color", getCardColor(week.getTeamScoreFinish(member.teamID), league.members.length));
                $("td", row).eq(2).css("background-color", getCardColor(league.getMarginFinish(member.teamID, week.weekNumber), week.matchups.filter(function (it) { return !it.byeWeek; }).length * 2));
                $("td", row).eq(3).css("background-color", getCardColor(league.getMarginFinish(member.teamID, week.weekNumber), week.matchups.filter(function (it) { return !it.byeWeek; }).length * 2));
            });
        },
    });
}
function updateMemberWeekTable(league, member) {
    var table = $("#memberWeekTable").DataTable();
    table.clear();
    league.getSeasonPortionWeeks().forEach(function (week) {
        table.row.add(getMemberWeekTableData(league, week, member.teamID));
    });
    table.draw();
}
function getMemberWeekTableData(league, week, teamID) {
    var curMatchup = week.getTeamMatchup(teamID);
    var team = week.getTeam(teamID);
    if (!curMatchup.byeWeek) {
        return {
            Week: week.weekNumber,
            Score: roundToHundred(team.score),
            VS: league.getMember(curMatchup.getOpponent(teamID).teamID).teamAbbrev,
            Margin: roundToHundred(team.score - curMatchup.getOpponent(teamID).score),
        };
    }
    else {
        return {
            Week: week.weekNumber,
            Score: roundToHundred(team.score),
            VS: "Bye",
            Margin: "N/A",
        };
    }
}
function createMemberWeekTable(league) {
    var weekTable = document.getElementById("memberWeekTable");
    var tableBody = document.getElementById("member_week_table_body");
    for (var i = 1; i <= league.settings.seasonDuration.regularSeasonLength; i++) {
        var row = document.createElement("tr");
        var weekCell = document.createElement("td");
        var scoreCell = document.createElement("td");
        var vsCell = document.createElement("td");
        var marginCell = document.createElement("td");
        marginCell.id = "week_" + i + "_margin";
        weekCell.appendChild(document.createTextNode(i.toString()));
    }
}
function createPowerRankTable(league) {
    initPowerRankTable(league);
    updatePowerRankTable(league);
}
function updatePowerRankTable(league) {
    var table = $("#power_rank_table").DataTable();
    table.clear();
    league.members.forEach(function (member) {
        table.row.add(getPowerRankStatsRowData(member));
    });
    table.draw();
}
function getPowerRankStatsRowData(member) {
    var image = document.createElement("img");
    image.src = member.logoURL;
    image.style.width = "25px";
    image.style.height = "25px";
    image.style.borderRadius = "25px";
    image.style.marginRight = "8px";
    return {
        "Team": image.outerHTML + member.teamNameToString(),
        "Power Rank": member.stats.powerRank,
        "Actual Rank": member.stats.rank,
        "Difference": member.stats.powerRank - member.stats.rank,
        "Power Record": member.powerRecordToString(),
    };
}
function initPowerRankTable(league) {
    $("#power_rank_table").DataTable({
        paging: false,
        searching: false,
        order: [[1, "asc"]],
        columns: [
            { data: "Team" },
            {
                data: "Power Rank",
                render: renderTableOrdinalNumber
            },
            {
                data: "Actual Rank",
                render: renderTableOrdinalNumber
            },
            {
                data: "Difference",
                render: renderTableDifferenceNumber
            },
            {
                data: "Power Record",
                render: sortTableRecord
            },
        ],
        createdRow: function (row, data, index) {
            var member = league.getMemberByPowerStats(data["Team"].split('margin-right: 8px;">')[1], data["Actual Rank"], data["Power Rank"], data["Power Record"]);
            $("td", row).eq(1).css("background-color", getDarkColor(member.stats.powerRank / league.members.length));
            $("td", row).eq(2).css("background-color", getDarkColor(member.stats.rank / league.members.length));
            if (league.getPowerRankDiffFinish(member.teamID) !== 0) {
                $("td", row).eq(3).css("background-color", getDarkColor(league.getPowerRankDiffFinish(member.teamID) / league.members.length));
            }
        },
    });
}
function generateTradeBlock(league) {
    var row = document.getElementById("trade_block_row");
    league.members.forEach(function (member) {
        if (member.tradingBlock.length > 0) {
            row.appendChild(createTradeBlockCardContainer(member));
        }
    });
}
function createTradeBlockCardContainer(member) {
    var card = document.createElement("div");
    card.style.maxHeight = "20em";
    card.style.overflowY = "scroll";
    card.classList.add("card", "trade-block-card", "col-3", "p-3");
    var cardBody = document.createElement("div");
    cardBody.classList.add("card-body");
    var cardHeader = document.createElement("h5");
    cardHeader.classList.add("card-title");
    card.appendChild(cardBody);
    cardBody.appendChild(cardHeader);
    cardHeader.innerText = member.teamNameToString();
    cardBody.appendChild(createTradeBlockTable(member));
    return card;
}
function createTradeBlockTable(member) {
    var table = document.createElement("table");
    table.classList.add("table", "table-hover", "table-sm", "trade-block-table");
    member.tradingBlock.forEach(function (player) {
        var playRow = document.createElement("tr");
        var playerBadge = generateBenchPositionBadge(positionToInt.get(player.position));
        playerBadge.style.verticalAlign = "center";
        playRow.appendChild(playerBadge);
        playRow.appendChild(generateGenericPlayerCell(player));
        table.appendChild(playRow);
    });
    return table;
}
var Draft = (function () {
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
var DraftPick = (function () {
    function DraftPick(teamID, overrallPickNumber, roundID, roundPickNumber, playerID, playerAuctionCost, owningTeamIDs, nominatingTeamID, autoDraftTeamID) {
        this.teamID = teamID;
        this.overallPickNumber = overrallPickNumber;
        this.roundID = roundID;
        this.roundPickNumber = roundID;
        this.playerID = playerID;
        this.playerAuctionCost = playerAuctionCost;
        this.owningTeamIDs = owningTeamIDs;
        this.nominatingTeamID = nominatingTeamID;
        this.autoDraftTeamID = autoDraftTeamID;
    }
    return DraftPick;
}());
var EmptySleeperSlot = (function () {
    function EmptySleeperSlot(positions) {
        this.eligibleSlots = Array.from(Array(100).keys());
        this.score = 0;
        this.firstName = "Empty";
        this.lastName = "Slot";
        this.actualScore = 0;
        this.projectedScore = 0;
        this.position = "EMPTY";
        this.realTeamID = "-1";
        this.jerseyNumber = -1;
        this.espnID = "-1";
        this.playerID = "-1";
        this.currentSlot = positions;
    }
    return EmptySleeperSlot;
}());
var EmptySlot = (function () {
    function EmptySlot(lineupSlotID) {
        this.eligibleSlots = Array.from(Array(100).keys());
        this.score = 0;
        this.firstName = "Empty";
        this.lastName = "Slot";
        this.actualScore = 0;
        this.projectedScore = 0;
        this.position = "EMPTY";
        this.realTeamID = "-1";
        this.jerseyNumber = -1;
        this.espnID = "-1";
        this.playerID = "-1";
        this.lineupSlotID = lineupSlotID;
    }
    return EmptySlot;
}());
var SEASON_PORTION;
(function (SEASON_PORTION) {
    SEASON_PORTION["REGULAR"] = "Regular Season";
    SEASON_PORTION["POST"] = "Post-Season";
    SEASON_PORTION["ALL"] = "Complete Season";
})(SEASON_PORTION || (SEASON_PORTION = {}));
var FLEX_SLOT;
(function (FLEX_SLOT) {
    FLEX_SLOT["FLEX"] = "FLEX";
    FLEX_SLOT["SUPER_FLEX"] = "SUPER_FLEX";
    FLEX_SLOT["REC_FLEX"] = "REC_FLEX";
    FLEX_SLOT["WRRB_FLEX"] = "WRRB_FLEX";
    FLEX_SLOT["IDP_FLEX"] = "IDP_FLEX";
})(FLEX_SLOT || (FLEX_SLOT = {}));
var PLATFORM;
(function (PLATFORM) {
    PLATFORM[PLATFORM["SLEEPER"] = 0] = "SLEEPER";
    PLATFORM[PLATFORM["ESPN"] = 1] = "ESPN";
    PLATFORM[PLATFORM["NFL"] = 2] = "NFL";
    PLATFORM[PLATFORM["YAHOO"] = 3] = "YAHOO";
})(PLATFORM || (PLATFORM = {}));
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
    POSITION["DEF"] = "DEF";
    POSITION["DL"] = "DL";
    POSITION["DT"] = "DT";
    POSITION["LB"] = "LB";
    POSITION["DB"] = "DB";
    POSITION["DE"] = "DE";
    POSITION["DP"] = "DP";
    POSITION["LT"] = "LT";
    POSITION["CB"] = "CB";
    POSITION["S"] = "S";
    POSITION["P"] = "P";
    POSITION["HC"] = "HC";
})(POSITION || (POSITION = {}));
var LeagueStats = (function () {
    function LeagueStats() {
        this.leaguePF = 0;
        this.leaguePP = 0;
        this.leaguePositionalStats = new PositionalStats();
    }
    return LeagueStats;
}());
var Matchup = (function () {
    function Matchup(home, away, weekNumber, isPlayoff) {
        this.home = home;
        this.away = away;
        this.weekNumber = weekNumber;
        this.isPlayoffs = isPlayoff;
        this.setMatchupStats();
    }
    Matchup.prototype.setMatchupStats = function () {
        this.isTie = false;
        if (this.away === undefined || this.away === null) {
            this.byeWeek = true;
            this.isUpset = false;
            this.isTie = false;
        }
        else {
            if (this.home.projectedScore > this.away.projectedScore) {
                this.projectedWinner = this.home.teamID;
            }
            else {
                this.projectedWinner = this.away.teamID;
            }
            this.projectedMOV = (Math.abs(this.home.projectedScore - this.away.projectedScore));
            if (this.home.score > this.away.score) {
                this.winner = this.home.teamID;
            }
            else if (this.home.score < this.away.score) {
                this.winner = this.away.teamID;
            }
            else {
                this.isTie = true;
                this.isUpset = false;
            }
            this.marginOfVictory = (Math.abs(this.home.score - this.away.score));
            this.byeWeek = false;
            if (this.projectedWinner !== this.winner) {
                this.isUpset = true;
            }
            else {
                this.isUpset = false;
            }
        }
    };
    Matchup.prototype.getWinningTeam = function () {
        if (this.byeWeek) {
            return null;
        }
        else if (this.home.score > this.away.score) {
            return this.home;
        }
        else {
            return this.away;
        }
    };
    Matchup.prototype.getHighestScoringTeam = function () {
        if (this.byeWeek) {
            return this.home;
        }
        else if (this.home.score > this.away.score) {
            return this.home;
        }
        else {
            return this.away;
        }
    };
    Matchup.prototype.getLowestScoringTeam = function () {
        if (this.byeWeek) {
            return this.home;
        }
        else if (this.home.score > this.away.score) {
            return this.away;
        }
        else {
            return this.home;
        }
    };
    Matchup.prototype.getLosingTeam = function () {
        if (this.byeWeek) {
            return null;
        }
        else if (this.home.score < this.away.score) {
            return this.home;
        }
        else {
            return this.away;
        }
    };
    Matchup.prototype.hasTeam = function (teamID) {
        if (this.byeWeek !== true) {
            if (this.home.teamID === teamID || this.away.teamID === teamID) {
                return true;
            }
        }
        else {
            if (this.home.teamID === teamID) {
                return true;
            }
        }
    };
    Matchup.prototype.getTeam = function (teamID) {
        if (this.home.teamID === teamID) {
            return this.home;
        }
        else if (this.away.teamID === teamID) {
            return this.away;
        }
    };
    Matchup.prototype.getOpponent = function (teamID) {
        if (this.home.teamID === teamID && this.byeWeek === false) {
            return this.away;
        }
        else if (this.away.teamID === teamID) {
            return this.home;
        }
        else {
            return null;
        }
    };
    Matchup.prototype.gutHadImpact = function (teamID) {
        var team = this.getTeam(teamID);
        if (this.marginOfVictory > Math.abs(team.gutDifference)) {
            return false;
        }
        else {
            return true;
        }
    };
    Matchup.prototype.setPoorLineupDecisions = function () {
        var _this = this;
        var whiffedChoices = 0;
        var team = this.home;
        if (!this.byeWeek) {
            if (this.home.score > this.away.score) {
                team = this.away;
            }
            team.lineup.forEach(function (startingPlayer) {
                team.getEligibleSlotBenchPlayers(startingPlayer.lineupSlotID).forEach(function (benchedPlayer) {
                    var diff = benchedPlayer.score - startingPlayer.score;
                    if (diff > _this.marginOfVictory) {
                        whiffedChoices += 1;
                    }
                });
            });
            this.loserPotentialWinningSingleMoves = whiffedChoices;
            if (this.loserPotentialWinningSingleMoves > 0) {
                this.withinSingleMoveOfWinning = true;
            }
            else {
                this.withinSingleMoveOfWinning = false;
            }
        }
    };
    return Matchup;
}());
var PositionalStats = (function () {
    function PositionalStats() {
        this.qbPoints = 0;
        this.rbPoints = 0;
        this.wrPoints = 0;
        this.tePoints = 0;
        this.kPoints = 0;
        this.defPoints = 0;
        this.qbPotentialPoints = 0;
        this.rbPotentialPoints = 0;
        this.wrPotentialPoints = 0;
        this.tePotentialPoints = 0;
        this.kPotentialPoints = 0;
        this.defPotentialPoints = 0;
    }
    PositionalStats.prototype.getPositionalScores = function () {
        return [this.qbPoints, this.rbPoints, this.wrPoints, this.tePoints, this.kPoints, this.defPoints];
    };
    PositionalStats.prototype.getPositionalPotentialScores = function () {
        return [this.qbPoints, this.rbPoints, this.wrPoints, this.tePoints, this.kPoints, this.defPoints];
    };
    return PositionalStats;
}());
var PowerStats = (function () {
    function PowerStats(teamID, weekNumber, pf, pp, projected) {
        this.teamID = teamID;
        this.weekNumber = weekNumber;
        this.wins = 0;
        this.losses = 0;
        this.ties = 0;
        this.pf = pf;
        this.projected = projected;
        this.pp = pp;
    }
    return PowerStats;
}());
var SeasonPlayer = (function () {
    function SeasonPlayer(player, platform) {
        this.firstName = player.firstName;
        this.lastName = player.lastName;
        this.eligibleSlots = player.eligibleSlots;
        this.seasonScore = player.score;
        this.projectedSeasonScore = player.projectedScore;
        this.position = player.position;
        this.realTeamID = player.realTeamID;
        this.playerID = player.playerID;
        this.espnID = player.espnID;
        this.weeksPlayed = 1;
        this.averageScore = player.score;
        this.scores = [[player.score, player.weekNumber]];
        if (platform === PLATFORM.SLEEPER) {
            this.pictureID = player.espnID;
        }
        else {
            this.pictureID = player.espnID;
        }
        this.setPictureURL();
    }
    SeasonPlayer.prototype.addPerformance = function (player) {
        this.weeksPlayed += 1;
        this.seasonScore += player.score;
        this.projectedSeasonScore += player.projectedScore;
        this.averageScore = roundToHundred(this.seasonScore / this.weeksPlayed);
        this.scores.push([player.score, player.weekNumber]);
    };
    SeasonPlayer.prototype.getScores = function () {
        var points = [];
        this.scores.forEach(function (tup) {
            points.push(tup[0]);
        });
        return points;
    };
    SeasonPlayer.prototype.isEligible = function (slot) {
        return this.eligibleSlots.includes(slot);
    };
    SeasonPlayer.prototype.setPictureURL = function () {
        if (this.position === "D/ST" || this.position === "DEF") {
            this.pictureURL = "https://a.espncdn.com/combiner/i?img=/i/teamlogos/NFL/500/" + getRealTeamInitials(this.realTeamID) + ".png&h=150&w=150";
        }
        else {
            this.pictureURL = "https://a.espncdn.com/i/headshots/nfl/players/full/" + this.pictureID + ".png";
        }
    };
    return SeasonPlayer;
}());
var Stats = (function () {
    function Stats(finalStanding) {
        this.finalStanding = finalStanding;
        this.wins = 0;
        this.losses = 0;
        this.ties = 0;
        this.powerWins = 0;
        this.powerLosses = 0;
        this.powerTies = 0;
        this.potentialPowerWins = 0;
        this.potentialPowerLosses = 0;
        this.potentialPowerTies = 0;
        this.pf = 0;
        this.pa = 0;
        this.pp = 0;
        this.OPSLAP = 0;
        this.choicesThatCouldHaveWonMatchup = 0;
        this.gameLostDueToSingleChoice = 0;
        this.gutPlayersPlayed = 0;
        this.gutPoints = 0;
        this.gutWins = 0;
        this.gutLosses = 0;
        this.rank = 0;
        this.averageMOD = 0;
        this.averageMOV = 0;
    }
    Stats.prototype.getWinPct = function () {
        if (this.wins === 0) {
            return 0.00;
        }
        else {
            return roundToHundred(this.wins / (this.wins + this.losses + this.ties));
        }
    };
    Stats.prototype.getPowerWinPct = function () {
        if (this.powerWins === 0) {
            return 0.00;
        }
        else {
            return roundToHundred(this.powerWins / (this.powerWins + this.powerLosses + this.powerTies));
        }
    };
    Stats.prototype.getPotentialPowerWinPct = function () {
        if (this.potentialPowerWins === 0) {
            return 0.00;
        }
        else {
            return roundToHundred(this.potentialPowerWins / (this.potentialPowerWins + this.potentialPowerLosses + this.potentialPowerTies));
        }
    };
    Stats.prototype.roundStats = function () {
        this.pf = roundToHundred(this.pf);
        this.pa = roundToHundred(this.pa);
        this.pp = roundToHundred(this.pp);
    };
    Stats.prototype.getEfficiency = function () {
        return this.pf / this.pp;
    };
    Stats.prototype.getAverageGutPoints = function () {
        if (this.gutPlayersPlayed === 0 || this.gutPoints === 0) {
            return 0;
        }
        else {
            return roundToHundred(this.gutPoints / this.gutPlayersPlayed);
        }
    };
    return Stats;
}());
var Week = (function () {
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
    Week.prototype.getTeamScoreFinish = function (teamID) {
        var finish = 1;
        var score = this.getTeam(teamID).score;
        this.matchups.forEach(function (matchup) {
            if (matchup.home.teamID !== teamID) {
                if (matchup.home.score > score) {
                    finish += 1;
                }
            }
            if (!matchup.byeWeek) {
                if (matchup.away.score > score && matchup.away.teamID !== teamID) {
                    finish += 1;
                }
            }
        });
        return finish;
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
    Week.prototype.getWeekAverage = function () {
        var weekScore = 0;
        var numMatches = 0;
        this.matchups.forEach(function (matchup) {
            if (matchup.byeWeek) {
                weekScore += matchup.home.score;
                numMatches += 1;
            }
            else {
                weekScore += matchup.home.score + matchup.away.score;
                numMatches += 2;
            }
        });
        return roundToHundred(weekScore / numMatches);
    };
    Week.prototype.getBestPositionPlayer = function (position) {
        var positionPlayers = [];
        this.matchups.forEach(function (matchup) {
            positionPlayers = positionPlayers.concat(matchup.home.getPositionalPlayers(position));
            if (!matchup.byeWeek) {
                positionPlayers = positionPlayers.concat(matchup.away.getPositionalPlayers(position));
            }
        });
        var bestPlayer = positionPlayers[0];
        positionPlayers.forEach(function (player) {
            if (player.score > bestPlayer.score) {
                bestPlayer = player;
            }
        });
        return bestPlayer;
    };
    return Week;
}());
var WeeklyPowerRanks = (function () {
    function WeeklyPowerRanks(weekNumber, isPlayoffs) {
        this.powerStats = new Map();
        this.weekNumber = weekNumber;
        this.isPlayoffs = isPlayoffs;
    }
    WeeklyPowerRanks.prototype.addMatchup = function (matchup) {
        var homeTeam = matchup.home;
        this.powerStats.set(homeTeam.teamID, new PowerStats(homeTeam.teamID, matchup.weekNumber, homeTeam.score, homeTeam.projectedScore, homeTeam.potentialPoints));
        if (!matchup.byeWeek) {
            var awayTeam = matchup.away;
            this.powerStats.set(awayTeam.teamID, new PowerStats(awayTeam.teamID, matchup.weekNumber, awayTeam.score, awayTeam.projectedScore, awayTeam.potentialPoints));
        }
    };
    WeeklyPowerRanks.prototype.setRanks = function () {
        var _this = this;
        this.powerStats.forEach(function (powerStat) {
            _this.powerStats.forEach(function (innerStat) {
                if (powerStat.teamID !== innerStat.teamID) {
                    if (powerStat.pf > innerStat.pf) {
                        powerStat.wins += 1;
                    }
                    else if (powerStat.pf < innerStat.pf) {
                        powerStat.losses += 1;
                    }
                    else {
                        powerStat.ties += 1;
                    }
                }
            });
        });
    };
    return WeeklyPowerRanks;
}());
var SleeperBasePlayer = (function () {
    function SleeperBasePlayer(entry) {
        this.nickName = "";
        this.playerID = entry.player_id;
        this.firstName = entry.first_name;
        this.lastName = entry.last_name;
        this.position = entry.position;
        this.realTeamID = entry.team;
        this.age = entry.age;
        if (entry.espn_id) {
            this.espnID = entry.espn_id.toString();
        }
        else {
            this.espnID = this.playerID;
        }
        this.setPictureURL();
    }
    SleeperBasePlayer.prototype.setPictureURL = function () {
        if (this.position === "D/ST" || this.position === "DEF") {
            this.pictureURL = "http://a.espncdn.com/combiner/i?img=/i/teamlogos/NFL/500/" + getRealTeamInitials(this.realTeamID) + ".png&h=150&w=150";
        }
        else {
            this.pictureURL = "http://a.espncdn.com/i/headshots/nfl/players/full/" + this.espnID + ".png";
        }
    };
    return SleeperBasePlayer;
}());
var SleeperDraftPick = (function () {
    function SleeperDraftPick(season, round, currentOwnerId, sellingOwnerId, associatedRosterId) {
        this.season = season;
        this.round = round;
        this.currentOwnerId = currentOwnerId;
        this.sellingOwnerId = sellingOwnerId;
        this.associatedRosterId = associatedRosterId;
    }
    SleeperDraftPick.prototype.toString = function (league) {
        return this.season + " " + ordinal_suffix_of(this.round) + " (" + league.getMember(this.associatedRosterId).ownerToString() + ")";
    };
    return SleeperDraftPick;
}());
var SleeperLeague = (function (_super) {
    __extends(SleeperLeague, _super);
    function SleeperLeague(weeks, members, settings) {
        var _this = _super.call(this, weeks, members, settings, PLATFORM.SLEEPER) || this;
        _this.trades = [];
        return _this;
    }
    SleeperLeague.prototype.setPage = function () {
        console.log(this);
        _super.prototype.setPage.call(this);
        enableSeasonPortionSelector(this, this.settings.seasonDuration.currentMatchupPeriod >= this.settings.seasonDuration.regularSeasonLength);
        enableTradePage();
        enableYearSelector(this);
        createLeagueTradeDiagram(this);
        constructTrades(this);
        generateTradeBlock(this);
        transitionToLeaguePage();
    };
    return SleeperLeague;
}(League));
var SleeperMember = (function () {
    function SleeperMember(memberID, memberName, teamName, teamAvatar) {
        this.currentRoster = [];
        this.currentRosterIDs = [];
        this.rosterNicknameMap = new Map();
        this.tradingBlock = [];
        this.memberID = memberID;
        this.name = memberName;
        this.teamName = teamName;
        if (teamName) {
            this.teamAbbrev = teamName.substring(0, 4);
        }
        else {
            this.teamAbbrev = memberName.substring(0, 4);
        }
        if (teamAvatar !== undefined && teamAvatar !== null) {
            this.logoURL = "https://sleepercdn.com/avatars/" + teamAvatar.toString();
        }
        else {
            this.logoURL = "./assets/images/user1.png";
        }
    }
    SleeperMember.prototype.getPictureURL = function () {
        return this.logoURL;
    };
    SleeperMember.prototype.setAdvancedStats = function (weeks) {
        var _this = this;
        var scores = [];
        weeks.forEach(function (week) {
            scores.push(week.getTeam(_this.teamID).score);
        });
        this.stats.standardDeviation = calcStandardDeviation(scores);
        this.stats.weeklyAverage = getMean(scores);
    };
    SleeperMember.prototype.setNicknames = function () {
        var _this = this;
        this.rosterNicknameMap.forEach(function (value, key) {
            if (value !== "allow_pn_scoring" && value !== "allow_pn_news") {
                var playerId_1 = key.replace("p_nick_", "");
                _this.currentRoster.forEach(function (player) {
                    if (player.playerID === playerId_1) {
                        player.nickName = value;
                        if (value.toLowerCase().includes("otb") || value.toLowerCase().includes("on the block")) {
                            _this.tradingBlock.push(player);
                        }
                    }
                });
            }
        });
    };
    SleeperMember.prototype.setRosterAttributes = function (lib) {
        var _this = this;
        if (this.currentRosterIDs) {
            this.currentRosterIDs.forEach(function (id) {
                if (id !== null) {
                    _this.currentRoster.push(new SleeperBasePlayer(lib[id]));
                }
            });
            this.setNicknames();
        }
    };
    SleeperMember.prototype.teamNameToString = function () {
        if (this.teamName === "" || this.teamName === undefined) {
            return this.ownerToString();
        }
        else {
            return this.teamName;
        }
    };
    SleeperMember.prototype.ownerToString = function () {
        return this.name;
    };
    SleeperMember.prototype.recordToString = function () {
        if (this.stats.ties !== 0) {
            return this.stats.wins + "-" + this.stats.losses + "-" + this.stats.ties;
        }
        else {
            return this.stats.wins + "-" + this.stats.losses;
        }
    };
    SleeperMember.prototype.rankToString = function () {
        return ordinal_suffix_of(this.stats.rank);
    };
    SleeperMember.prototype.finishToString = function () {
        return ordinal_suffix_of(this.stats.finalStanding);
    };
    SleeperMember.prototype.powerRecordToString = function () {
        return this.stats.powerWins + "-" + this.stats.powerLosses;
    };
    SleeperMember.prototype.potentialPowerRecordToString = function () {
        return this.stats.potentialPowerWins + "-" + this.stats.potentialPowerLosses;
    };
    return SleeperMember;
}());
var SleeperPlayer = (function () {
    function SleeperPlayer(playerID, weekNumber, lineupSlotID) {
        this.playerID = playerID;
        this.score = 0;
        this.projectedScore = 0;
        this.weekNumber = weekNumber;
        if (undefined !== lineupSlotID) {
            this.lineupSlotID = lineupSlotID;
        }
    }
    SleeperPlayer.prototype.isEligible = function (slot) {
        var isEligible = false;
        this.eligibleSlots.forEach(function (eligibleSlot) {
            if (eligibleSlot === slot) {
                isEligible = true;
            }
        });
        return isEligible;
    };
    return SleeperPlayer;
}());
var SleeperSettings = (function (_super) {
    __extends(SleeperSettings, _super);
    function SleeperSettings(sleeperScoringSettings, sleeperSeasonDurationSettings, leagueInfo, draft, positionInfo) {
        var _this = _super.call(this, sleeperSeasonDurationSettings, leagueInfo, positionInfo) || this;
        _this.scoringSettings = sleeperScoringSettings;
        _this.draft = draft;
        return _this;
    }
    return SleeperSettings;
}(Settings));
var SleeperTeam = (function () {
    function SleeperTeam(lineup, totalRoster, score, matchupID, rosterID, opponentID, weekNumber, lineupOrder) {
        this.lineup = lineup.map(function (playerID, index) {
            return new SleeperPlayer(playerID, weekNumber, positionToInt.get(lineupOrder[index]));
        });
        this.bench = totalRoster.filter(function (element) {
            return !lineup.includes(element);
        }).map(function (playerID) {
            return new SleeperPlayer(playerID, weekNumber, positionToInt.get("BN"));
        });
        this.IR = [];
        this.opponentID = opponentID;
        this.teamID = rosterID;
        this.score = score;
        this.matchupID = matchupID;
    }
    SleeperTeam.prototype.getTeamScore = function (players) {
        var score = 0;
        for (var i in players) {
            if (players[i].score != null && players[i].score !== undefined) {
                score += players[i].score;
            }
        }
        return score;
    };
    SleeperTeam.prototype.getProjectedScore = function (players) {
        var projectedScore = 0;
        for (var i in players) {
            if (players[i].projectedScore != null && players[i].projectedScore !== undefined) {
                projectedScore += players[i].projectedScore;
            }
        }
        return projectedScore;
    };
    SleeperTeam.prototype.getMVP = function () {
        var mvp = this.lineup[0];
        var mvpScore = 0;
        this.lineup.forEach(function (player) {
            if (player.score > mvpScore) {
                mvpScore = player.score;
                mvp = player;
            }
        });
        return mvp;
    };
    SleeperTeam.prototype.getLVP = function () {
        var lvp = this.lineup[0];
        var lvpScore = this.lineup[0].score;
        this.lineup.forEach(function (player) {
            if (player.score > lvpScore) {
                lvpScore = player.score;
                lvp = player;
            }
        });
        return lvp;
    };
    SleeperTeam.prototype.getPositionalPlayers = function (position) {
        var players = this.lineup;
        var positionPlayers = [];
        players.forEach(function (player) {
            if (player.position === position) {
                positionPlayers.push(player);
            }
        });
        return positionPlayers;
    };
    SleeperTeam.prototype.getEligibleSlotPlayers = function (slot) {
        var players = this.lineup.concat(this.bench, this.IR);
        var eligiblePlayers = players.filter(function (it) {
            return it.isEligible(slot) === true;
        });
        return eligiblePlayers;
    };
    SleeperTeam.prototype.getEligibleSlotBenchPlayers = function (slot) {
        var players = this.bench.concat(this.IR);
        var eligiblePlayers = players.filter(function (it) {
            return it.isEligible(slot) === true;
        });
        return eligiblePlayers;
    };
    SleeperTeam.prototype.getGutPoints = function (activeLineupSlots, excludedLineupSlots, excludedPositions) {
        var players = this.getProjectedLinupPlayerDifference(activeLineupSlots, excludedLineupSlots, excludedPositions);
        var gutPlayers = players[0];
        var satPlayers = players[1];
        var diff = this.getTeamScore(gutPlayers) - this.getTeamScore(satPlayers);
        var playerNum = gutPlayers.length;
        return [diff, playerNum];
    };
    SleeperTeam.prototype.getProjectedLinupPlayerDifference = function (activeLineupSlots, excludedLineupSlots, excludedPositions) {
        var _this = this;
        var gutPlayers = [];
        var satPlayers = [];
        var projectedLineup = getOptimalProjectedLineup(activeLineupSlots, this.lineup.concat(this.bench, this.IR), excludedLineupSlots, excludedPositions);
        this.lineup.forEach(function (player) {
            if (!includesPlayer(player, projectedLineup)) {
                gutPlayers.push(player);
            }
        });
        projectedLineup.forEach(function (player) {
            if (!includesPlayer(player, _this.lineup)) {
                satPlayers.push(player);
            }
        });
        return [gutPlayers, satPlayers];
    };
    SleeperTeam.prototype.setTeamMetrics = function (activeLineupSlots, excludedLineupSlots, excludedPositions) {
        this.potentialPoints = this.getTeamScore(getOptimalLineup(activeLineupSlots, this.lineup.concat(this.bench, this.IR), excludedLineupSlots, excludedPositions));
        this.projectedScore = this.getProjectedScore(this.lineup);
        this.projectedBestLineupPoints = this.getTeamScore(getOptimalProjectedLineup(activeLineupSlots, this.lineup.concat(this.bench, this.IR), excludedLineupSlots, excludedPositions));
        var gutArray = this.getGutPoints(activeLineupSlots, excludedLineupSlots, excludedPositions);
        this.gutDifference = gutArray[0];
        this.gutPlayers = gutArray[1];
    };
    SleeperTeam.prototype.getAllPlayers = function () {
        return (this.lineup.concat(this.IR, this.bench));
    };
    return SleeperTeam;
}());
var SleeperTrade = (function () {
    function SleeperTrade(trade, lib) {
        this.playersTraded = new Map();
        this.faabTraded = new Map();
        this.draftPicksInvolved = [];
        this.playersReceived = new Map();
        this.initiatingMemberId = trade.creator;
        this.initiatingTeamId = trade.consenter_ids[0];
        this.consentingTeamIds = trade.consenter_ids;
        this.week = trade.leg;
        this.transactionId = trade.transaction_id;
        this.initTradeMaps();
        this.createTradeMaps(trade, lib);
    }
    SleeperTrade.prototype.createTradeMaps = function (trade, lib) {
        var _this = this;
        if (trade.adds) {
            Object.keys(trade.adds).forEach(function (playerId) {
                var teamID = trade.adds[playerId];
                _this.playersReceived.get(teamID).push(new SleeperBasePlayer(lib[playerId]));
            });
        }
        if (trade.drops) {
            Object.keys(trade.drops).forEach(function (playerId) {
                var teamID = trade.drops[playerId];
                _this.playersTraded.get(teamID).push(new SleeperBasePlayer(lib[playerId]));
            });
        }
        if (trade.draft_picks.length > 0) {
            trade.draft_picks.forEach(function (pickResponse) {
                var tradingTeamID = pickResponse.previous_owner_id;
                var receivingTeamID = pickResponse.owner_id;
                var originalOwnerId = pickResponse.roster_id;
                var season = parseInt(pickResponse.season);
                var round = pickResponse.round;
                _this.draftPicksInvolved.push(new SleeperDraftPick(season, round, receivingTeamID, tradingTeamID, originalOwnerId));
            });
        }
        if (trade.waiver_budget.length > 0) {
            trade.waiver_budget.forEach(function (faabTransaction) {
                _this.faabTraded.set(faabTransaction.receiver, _this.faabTraded.get(faabTransaction.receiver) + faabTransaction.amount);
                _this.faabTraded.set(faabTransaction.sender, _this.faabTraded.get(faabTransaction.sender) - faabTransaction.amount);
            });
        }
    };
    SleeperTrade.prototype.initTradeMaps = function () {
        var _this = this;
        this.consentingTeamIds.forEach(function (teamID) {
            _this.playersTraded.set(teamID, []);
            _this.playersReceived.set(teamID, []);
            _this.faabTraded.set(teamID, 0);
        });
    };
    return SleeperTrade;
}());
function convertSleeperRoster(rosterPositions, numIR, numTaxi) {
    var activeCount = new Map();
    var benchCount = new Map();
    var activeLineupSlots = new Array();
    var benchSlots = new Array();
    var active = rosterPositions.filter(function (slot) {
        return slot !== "BN";
    }).map(function (slot) { return positionToInt.get(slot); });
    active.forEach(function (slot) {
        if (activeCount.has(slot)) {
            var newCount = activeCount.get(slot) + 1;
            activeCount.set(slot, newCount);
        }
        else {
            activeCount.set(slot, 1);
        }
    });
    var bench = rosterPositions.filter(function (it) {
        return it === "BN";
    }).map(function (slot) { return positionToInt.get(slot); });
    for (var i = 0; i < numIR; i++) {
        bench.push(positionToInt.get("IR"));
    }
    for (var i = 0; i < numTaxi; i++) {
        bench.push(positionToInt.get("TAXI"));
    }
    bench.forEach(function (slot) {
        if (benchCount.has(slot)) {
            var newCount = benchCount.get(slot) + 1;
            benchCount.set(slot, newCount);
        }
        else {
            benchCount.set(slot, 1);
        }
    });
    activeCount.forEach(function (value, key) {
        activeLineupSlots.push([key, value]);
    });
    benchCount.forEach(function (value, key) {
        benchSlots.push([key, value]);
    });
    return [activeLineupSlots, benchSlots];
}
function makeSleeperPlayers(players) {
    var sleeperPlayers = [];
    players.forEach(function (player) {
        sleeperPlayers.push(player);
    });
    return sleeperPlayers;
}
function getSleeperWeekStats(startWeek, lastScoredLeg) {
    var statPromises = [];
    for (var i = startWeek; i <= lastScoredLeg; i++) {
        statPromises.push(makeRequest("./assets/st/" + i + ".json"));
    }
    var projectionPromises = [];
    for (var i = startWeek; i <= lastScoredLeg; i++) {
        projectionPromises.push(makeRequest("./assets/prj/" + i + ".json"));
    }
    var allPromises = statPromises.concat(projectionPromises);
    return Promise.all(allPromises).then(function (result) {
        var sleeperStats = [];
        var stats = result.slice(0, statPromises.length).map(function (obj) {
            return obj.response;
        });
        var projections = result.slice(statPromises.length, allPromises.length).map(function (obj) {
            return obj.response;
        });
        for (var i = 0; i < stats.length; i++) {
            sleeperStats.push(new SleeperWeekStats(projections[i], stats[i], i + 1));
        }
        return sleeperStats;
    });
}
function findOpponent(teams, rosterId, matchupId) {
    var opponentRosterId = -1;
    teams.forEach(function (team) {
        if (team.matchup_id === matchupId && team.roster_id !== rosterId) {
            opponentRosterId = team.roster_id;
        }
    });
    return opponentRosterId;
}
function assignSleeperPlayerAttributes(player, playerAttributes) {
    player.firstName = playerAttributes.first_name;
    player.lastName = playerAttributes.last_name;
    player.position = playerAttributes.position;
    player.eligibleSlots = eligibleSlotMap.get(positionToInt.get(playerAttributes.position));
    player.realTeamID = playerAttributes.team;
    if (playerAttributes.espn_id) {
        player.espnID = playerAttributes.espn_id.toString();
    }
    else {
        player.espnID = player.playerID;
    }
}
var SleeperWeekStats = (function () {
    function SleeperWeekStats(projectedStats, stats, weekNumber) {
        this.stats = stats;
        this.projectedStats = projectedStats;
        this.weekNumber = weekNumber;
    }
    SleeperWeekStats.prototype.calculatePlayerScore = function (settings, player) {
        var playerStats = this.stats[player.playerID];
        if (playerStats !== undefined) {
            Object.keys(playerStats).forEach(function (statName) {
                if (settings.hasOwnProperty(statName)) {
                    player.score += settings[statName] * playerStats[statName];
                }
            });
        }
    };
    SleeperWeekStats.prototype.calculateProjectedPlayerScore = function (settings, player) {
        var playerProjectedStats = this.projectedStats[player.playerID];
        if (playerProjectedStats !== undefined) {
            Object.keys(playerProjectedStats).forEach(function (statName) {
                if (settings.hasOwnProperty(statName)) {
                    player.projectedScore += settings[statName] * playerProjectedStats[statName];
                }
            });
        }
    };
    return SleeperWeekStats;
}());
var SleeperDraftInfo = (function () {
    function SleeperDraftInfo(draftId, draftType) {
        this.draftId = draftId;
        this.draftType = draftType;
    }
    return SleeperDraftInfo;
}());
var SleeperLeagueInfo = (function (_super) {
    __extends(SleeperLeagueInfo, _super);
    function SleeperLeagueInfo(leagueName, leagueId, seasonId, activeSeasons, leagueAvatar, previousLeagueId) {
        var _this = _super.call(this, leagueName, leagueId, seasonId, activeSeasons) || this;
        _this.leagueAvatar = leagueAvatar;
        _this.previousLeagueId = previousLeagueId;
        return _this;
    }
    return SleeperLeagueInfo;
}(LeagueInfo));
var SleeperPositionInfo = (function () {
    function SleeperPositionInfo() {
    }
    return SleeperPositionInfo;
}());
var SleeperSeasonDurationSettings = (function (_super) {
    __extends(SleeperSeasonDurationSettings, _super);
    function SleeperSeasonDurationSettings(startWeek, regularSeasonLength, playoffLength, currentMatchupPeriod, last_scored_leg, isActive, yearsActive, playoffType, numPlayoffTeams) {
        var _this = _super.call(this, startWeek, regularSeasonLength, playoffLength, currentMatchupPeriod, isActive, yearsActive) || this;
        _this.playoffType = playoffType;
        _this.lastScoredLeg = last_scored_leg;
        _this.numPlayoffTeams = numPlayoffTeams;
        return _this;
    }
    return SleeperSeasonDurationSettings;
}(SeasonDurationSettings));
function roundToHundred(x) {
    return Math.round(x * 100) / 100;
}
function roundToTen(x) {
    return Math.round(x * 10) / 10;
}
function roundToThousand(x) {
    return Math.round(x * 1000) / 1000;
}
function roundToMil(x) {
    return Math.round(x * 1000000) / 1000000;
}
function getColor(value) {
    var hue = ((1 - value) * 120).toString(10);
    return ["hsl(", hue, ",100%,60%)"].join("");
}
function getLightColor(value) {
    var hue = ((1 - value) * 120).toString(10);
    return ["hsl(", hue, ",100%,95%)"].join("");
}
function getDarkColor(value) {
    var hue = ((1 - value) * 120).toString(10);
    return ["hsl(", hue, ",100%,47%)"].join("");
}
function getLightCardColor(rank, outOf) {
    return getLightColor(rank / outOf);
}
function getCardColor(rank, outOf) {
    return getColor(rank / outOf);
}
function getDarkCardColor(rank, outOf) {
    return getDarkColor(rank / outOf);
}
function getInverseCardColor(rank, outOf) {
    return getColor((1 + (outOf - rank)) / outOf);
}
function getInverseDarkCardColor(rank, outOf) {
    return getDarkColor((1 + (outOf - rank)) / outOf);
}
function getTextColor(rank, outOf) {
    var o = rank / outOf;
    if (o < .75) {
        return "black";
    }
    else {
        return "white";
    }
}
function ordinal_suffix_of(i) {
    var j = i % 10;
    var k = i % 100;
    if (j === 1 && k !== 11) {
        return i + "st";
    }
    if (j === 2 && k !== 12) {
        return i + "nd";
    }
    if (j === 3 && k !== 13) {
        return i + "rd";
    }
    return i + "th";
}
function hexToRGB(hex, alpha) {
    var r = parseInt(hex.slice(1, 3), 16);
    var g = parseInt(hex.slice(3, 5), 16);
    var b = parseInt(hex.slice(5, 7), 16);
    if (alpha) {
        return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
    }
    else {
        return "rgb(" + r + ", " + g + ", " + b + ")";
    }
}
function getSleeperOptimalLineup(lineupSlots, players, includeTaxi) {
    var flexSlots = [];
    var positionSlots = [];
    var optimalLineup = [];
    lineupSlots.forEach(function (acceptablePositions) {
        if (acceptablePositions.length > 1) {
            flexSlots.push(acceptablePositions);
        }
        else {
            positionSlots.push(acceptablePositions);
        }
    });
    positionSlots.forEach(function (positionSlot) {
        var validPlayers = getSleeperValidSlotPlayers(positionSlot, players, optimalLineup, includeTaxi);
        validPlayers.sort(function (p1, p2) { return p2.score - p1.score; });
        optimalLineup.push([positionSlot, validPlayers[0]]);
    });
    return optimalLineup;
}
function getSleeperValidSlotPlayers(slotPositions, players, optimalLineup, includesTaxi) {
    var validPlayers = [];
    players.forEach(function (player) {
        if (slotPositions.includes(player.position) && !lineupHasPlayer(player, optimalLineup)) {
            if (includesTaxi) {
                validPlayers.push(player);
            }
            else {
                if (player.lineupSlotID !== 88) {
                    validPlayers.push(player);
                }
            }
        }
    });
    if (validPlayers.length === 0) {
        validPlayers.push(new EmptySleeperSlot(slotPositions));
    }
    return validPlayers;
}
function lineupHasPlayer(player, optimalLineup) {
    var hasPlayer = false;
    optimalLineup.forEach(function (lineupSlot) {
        if (lineupSlot[1].playerID === player.playerID) {
            hasPlayer = true;
        }
    });
    return hasPlayer;
}
function getOptimalLineup(activeLineupSlots, players, excludedLineupSlots, excludedPositionSlots) {
    var optimalLineup = [];
    activeLineupSlots.forEach(function (slot) {
        optimalLineup = optimalLineup.concat(getHighestPlayersForSlot(slot[0], slot[1], players, optimalLineup, excludedLineupSlots, excludedPositionSlots));
    });
    return optimalLineup;
}
function getOptimalLineupBench(players, excludedLineupSlots, excludedPositionSlots, benchSlots) {
    return getHighestPlayersForSlotBench(20, benchSlots, players, [], excludedLineupSlots, excludedPositionSlots);
}
function getHighestPlayersForSlot(slotID, numPlayers, players, takenPlayers, excludedLineupSlots, excludedPositionSlots) {
    var eligibleSortedPlayers = players.filter(function (player) {
        return (player.eligibleSlots.includes(slotID) && !takenPlayers.includes(player) && !excludedLineupSlots.includes(player.lineupSlotID) && !excludedPositionSlots.includes(positionToInt.get(player.position)));
    }).sort(function (a, b) {
        return b.score - a.score;
    });
    if (eligibleSortedPlayers.length >= numPlayers) {
        return eligibleSortedPlayers.slice(0, numPlayers);
    }
    else {
        while (eligibleSortedPlayers.length <= numPlayers) {
            eligibleSortedPlayers.push(new EmptySlot(slotID));
        }
        return eligibleSortedPlayers.slice(0, numPlayers);
    }
}
function getHighestPlayersForSlotBench(slotID, numPlayers, players, takenPlayers, excludedLineupSlots, excludedPositionSlots) {
    var eligibleSortedPlayers = players.filter(function (player) {
        return (player.eligibleSlots.includes(slotID) && !takenPlayers.includes(player) && !excludedLineupSlots.includes(player.lineupSlotID) && !excludedPositionSlots.includes(positionToInt.get(player.position)));
    }).sort(function (a, b) {
        return b.score - a.score;
    });
    if (eligibleSortedPlayers.length >= numPlayers) {
        eligibleSortedPlayers = eligibleSortedPlayers.slice(0, numPlayers);
    }
    else {
        while (eligibleSortedPlayers.length <= numPlayers) {
            eligibleSortedPlayers.push(new EmptySlot(slotID));
        }
        eligibleSortedPlayers = eligibleSortedPlayers.slice(0, numPlayers);
    }
    return players.filter(function (player) {
        return !eligibleSortedPlayers.includes(player);
    });
}
function getOptimalProjectedLineup(activeLineupSlots, players, excludedLineupSlots, excludedPositions) {
    var optimalLineup = [];
    activeLineupSlots.forEach(function (slot) {
        optimalLineup = optimalLineup.concat(getHighestProjectedPlayersForSlot(slot[0], slot[1], players, optimalLineup, excludedLineupSlots, excludedPositions));
    });
    return optimalLineup;
}
function getOptimalProjectedLineupBench(activeLineupSlots, players, excludedLineupSlots, excludedPositions) {
    var optimalLineupBench = [];
    activeLineupSlots.forEach(function (slot) {
        optimalLineupBench = optimalLineupBench.concat(getHighestProjectedPlayersForSlot(slot[0], slot[1], players, optimalLineupBench, excludedLineupSlots, excludedPositions));
    });
    return optimalLineupBench;
}
function getHighestProjectedPlayersForSlot(slotID, numPlayers, players, takenPlayers, excludedLineupSlots, excludedPositions) {
    var eligibleSortedPlayers = players.filter(function (player) {
        return (player.eligibleSlots.includes(slotID) && !takenPlayers.includes(player) && !excludedLineupSlots.includes(player.lineupSlotID) && !excludedPositions.includes(positionToInt.get(player.position)));
    }).sort(function (a, b) {
        return b.projectedScore - a.projectedScore;
    });
    if (eligibleSortedPlayers.length >= numPlayers) {
        return eligibleSortedPlayers.slice(0, numPlayers);
    }
    else {
        while (eligibleSortedPlayers.length <= numPlayers) {
            eligibleSortedPlayers.push(new EmptySlot(slotID));
        }
        return eligibleSortedPlayers.slice(0, numPlayers);
    }
}
function getHighestProjectedPlayersForSlotBench(slotID, numPlayers, players, takenPlayers, excludedLineupSlots, excludedPositionSlots) {
    var eligibleSortedPlayers = players.filter(function (player) {
        return (player.eligibleSlots.includes(slotID) && !takenPlayers.includes(player) && !excludedLineupSlots.includes(player.lineupSlotID) && !excludedPositionSlots.includes(positionToInt.get(player.position)));
    }).sort(function (a, b) {
        return b.projectedScore - a.projectedScore;
    });
    if (eligibleSortedPlayers.length >= numPlayers) {
        eligibleSortedPlayers = eligibleSortedPlayers.slice(0, numPlayers);
    }
    else {
        while (eligibleSortedPlayers.length <= numPlayers) {
            eligibleSortedPlayers.push(new EmptySlot(slotID));
        }
        eligibleSortedPlayers = eligibleSortedPlayers.slice(0, numPlayers);
    }
    return players.filter(function (player) {
        return !eligibleSortedPlayers.includes(player);
    });
}
var eligibleSlotMap = new Map([
    [0, [0, 1, 7, 20, 21, 88]],
    [1, [1, 7, 20, 21, 88]],
    [2, [2, 3, 7, 20, 21, 23, 88]],
    [4, [4, 3, 5, 7, 20, 21, 23, 88]],
    [6, [6, 5, 7, 20, 21, 23, 88]],
    [8, [8, 15, 20, 21, 88]],
    [9, [9, 15, 20, 21, 88]],
    [10, [10, 15, 20, 21, 88]],
    [11, [11, 15, 20, 21, 88]],
    [12, [12, 15, 20, 21, 88]],
    [13, [13, 15, 20, 21, 88]],
    [14, [14, 15, 20, 21, 88]],
    [16, [16, 20]],
    [17, [17, 20, 21, 88]],
    [18, [18, 20, 21, 88]],
    [19, [19, 20]],
    [26, [26, 15, 8, 15, 20, 21, 88]],
    [27, [27, 15, 8, 15, 20, 21, 88]],
    [28, [28, 15, 8, 15, 20, 21, 88]],
    [29, [29, 15, 8, 15, 20, 21, 88]],
    [30, [28, 15, 8, 15, 20, 21, 88]],
]);
var intToPosition = new Map([
    [0, "QB"],
    [1, "TQB"],
    [2, "RB"],
    [3, "RB/WR"],
    [4, "WR"],
    [5, "WR/TE"],
    [6, "TE"],
    [7, "SUPER_FLEX"],
    [8, "DT"],
    [9, "DE"],
    [10, "LB"],
    [11, "DL"],
    [12, "CB"],
    [13, "S"],
    [14, "DB"],
    [15, "DP"],
    [16, "DEF"],
    [17, "K"],
    [18, "P"],
    [19, "HC"],
    [20, "BN"],
    [21, "IR"],
    [23, "FLEX"],
    [25, "???"],
    [26, "SS"],
    [27, "FS"],
    [28, "NT"],
    [29, "OLB"],
    [30, "ILB"],
    [88, "TAXI"],
    [-1, "EMPTY"],
]);
var positionToInt = new Map([
    ["QB", 0],
    ["TQB", 1],
    ["RB", 2],
    ["FB", 2],
    ["RB/WR", 3],
    ["WR", 4],
    ["WR/TE", 5],
    ["REC_FLEX", 5],
    ["TE", 6],
    ["SUPER_FLEX", 7],
    ["OP", 7],
    ["DT", 8],
    ["NT", 28],
    ["DE", 9],
    ["OLB", 29],
    ["ILB", 30],
    ["LB", 10],
    ["DL", 11],
    ["CB", 12],
    ["S", 13],
    ["SS", 26],
    ["FS", 27],
    ["DB", 14],
    ["DP", 15],
    ["DEF", 16],
    ["K", 17],
    ["P", 18],
    ["HC", 19],
    ["BN", 20],
    ["IR", 21],
    ["FLEX", 23],
    ["TAXI", 88],
    ["???", 25],
    ["EMPTY", -1],
]);
var SleeperFlexFillPositions = new Map([
    ["SUPER_FLEX", ["QB", "RB", "WR", "TE"]],
    ["FLEX", ["RB", "WR", "TE"]],
    ["REC_FLEX", ["WR", "TE"]],
    ["WRRB_FLEX", ["WR", "RB"]],
    ["IDP_FLEX", ["DL", "LB", "DB"]],
]);
function getPosition(eligibleSlots) {
    var slotNum = eligibleSlots[0];
    var i = 0;
    while (slotNum.toString() === "25" || slotNum.toString() === "23" || slotNum.toString() === "3" || slotNum.toString() === "5" || slotNum.toString() === "7" || slotNum.toString() === "15") {
        i += 1;
        slotNum = eligibleSlots[i];
    }
    return intToPosition.get(slotNum);
}
function getRealTeamInitials(realteamID) {
    if (realteamID == null) {
        return "FA";
    }
    var team = realteamID.toString();
    switch (team) {
        case "1":
            team = "Atl";
            break;
        case "2":
            team = "Buf";
            break;
        case "3":
            team = "Chi";
            break;
        case "4":
            team = "Cin";
            break;
        case "5":
            team = "Cle";
            break;
        case "6":
            team = "Dal";
            break;
        case "7":
            team = "Den";
            break;
        case "8":
            team = "Det";
            break;
        case "9":
            team = "GB";
            break;
        case "10":
            team = "Ten";
            break;
        case "11":
            team = "Ind";
            break;
        case "12":
            team = "KC";
            break;
        case "13":
            team = "Oak";
            break;
        case "14":
            team = "Lar";
            break;
        case "15":
            team = "Mia";
            break;
        case "16":
            team = "Min";
            break;
        case "17":
            team = "NE";
            break;
        case "18":
            team = "NO";
            break;
        case "19":
            team = "NYG";
            break;
        case "20":
            team = "NYJ";
            break;
        case "21":
            team = "Phi";
            break;
        case "22":
            team = "Ari";
            break;
        case "23":
            team = "Pit";
            break;
        case "24":
            team = "LAC";
            break;
        case "25":
            team = "SF";
            break;
        case "26":
            team = "Sea";
            break;
        case "27":
            team = "TB";
            break;
        case "28":
            team = "Wsh";
            break;
        case "29":
            team = "Car";
            break;
        case "30":
            team = "Jax";
            break;
        case "33":
            team = "Bal";
            break;
        case "34":
            team = "Hou";
            break;
        case "-1":
            team = "None";
            break;
    }
    return team;
}
function includesPlayer(player, lineup) {
    var includes = false;
    lineup.forEach(function (element) {
        if (player.playerID === element.playerID) {
            includes = true;
        }
    });
    return includes;
}
function calcStandardDeviation(scores) {
    var modified = [];
    var mean = getMean(scores);
    scores.forEach(function (score) {
        modified.push(Math.pow(score - mean, 2));
    });
    return roundToHundred(Math.sqrt(getMean(modified)));
}
function getMean(numbers) {
    var sum = 0;
    numbers.forEach(function (num) {
        sum += num;
    });
    return roundToHundred(sum / numbers.length);
}
function getBestLeastConsistent(league, teamID) {
    var players = getSeasonPlayers(league, teamID);
    var minSampleSize = 5;
    if (league.settings.seasonDuration.isActive) {
        if (league.settings.seasonDuration.currentMatchupPeriod <= 5) {
            minSampleSize = league.settings.seasonDuration.currentMatchupPeriod - 1;
        }
    }
    var mostConsistentPlayers = players.filter(function (player) {
        return (player.weeksPlayed >= minSampleSize);
    });
    while (mostConsistentPlayers.length === 0) {
        minSampleSize -= 1;
        mostConsistentPlayers = players.filter(function (player) {
            return (player.weeksPlayed >= minSampleSize);
        });
    }
    var mvp = players[0];
    var lvp = players[0];
    var mostConsistent = mostConsistentPlayers[0];
    players.forEach(function (seasonPlayer) {
        if (seasonPlayer.seasonScore > mvp.seasonScore) {
            mvp = seasonPlayer;
        }
        if (seasonPlayer.seasonScore < lvp.seasonScore) {
            lvp = seasonPlayer;
        }
    });
    mostConsistentPlayers.forEach(function (seasonPlayer) {
        if (calcStandardDeviation(seasonPlayer.getScores()) < calcStandardDeviation(mostConsistent.getScores()) &&
            seasonPlayer.weeksPlayed >= minSampleSize && seasonPlayer.seasonScore !== 0) {
            mostConsistent = seasonPlayer;
        }
    });
    return [mvp, lvp, mostConsistent];
}
function getMVP(league, teamID) {
    var players = getSeasonPlayers(league, teamID);
    var mvp = players[0];
    players.forEach(function (seasonPlayer) {
        if (seasonPlayer.seasonScore > mvp.seasonScore) {
            mvp = seasonPlayer;
        }
    });
    return mvp;
}
function getLVP(league, teamID) {
    var players = getSeasonPlayers(league, teamID);
    var lvp = players[0];
    players.forEach(function (seasonPlayer) {
        if (seasonPlayer.seasonScore === lvp.seasonScore) {
            if (seasonPlayer.weeksPlayed > lvp.weeksPlayed) {
                lvp = seasonPlayer;
            }
        }
        else if (seasonPlayer.seasonScore < lvp.seasonScore) {
            lvp = seasonPlayer;
        }
    });
    return lvp;
}
function getSeasonPlayers(league, teamID) {
    var players = [];
    league.getSeasonPortionWeeks().forEach(function (week) {
        week.getTeam(teamID).lineup.forEach(function (player) {
            var index = players.findIndex(function (existingPlayer) {
                return existingPlayer.playerID === player.playerID;
            });
            if (index > -1) {
                players[index].addPerformance(player);
            }
            else {
                players.push(new SeasonPlayer(player, league.leaguePlatform));
            }
        });
    });
    return players;
}
function getSeasonOpponentPlayers(league, teamID) {
    var players = [];
    league.getSeasonPortionWeeks().forEach(function (week) {
        if (!week.getTeamMatchup(teamID).byeWeek) {
            week.getTeamMatchup(teamID).getOpponent(teamID).lineup.forEach(function (player) {
                var index = players.findIndex(function (existingPlayer) {
                    return existingPlayer.playerID === player.playerID;
                });
                if (index > -1) {
                    players[index].addPerformance(player);
                }
                else {
                    players.push(new SeasonPlayer(player, league.leaguePlatform));
                }
            });
        }
    });
    return players;
}
function getAllSeasonPlayers(league) {
    var players = [];
    league.getSeasonPortionWeeks().forEach(function (week) {
        week.matchups.forEach(function (matchup) {
            matchup.home.lineup.forEach(function (player) {
                var index = players.findIndex(function (existingPlayer) {
                    return existingPlayer.playerID === player.playerID;
                });
                if (index > -1) {
                    players[index].addPerformance(player);
                }
                else {
                    players.push(new SeasonPlayer(player, league.leaguePlatform));
                }
            });
            if (!matchup.byeWeek) {
                matchup.away.lineup.forEach(function (player) {
                    var index = players.findIndex(function (existingPlayer) {
                        return existingPlayer.playerID === player.playerID;
                    });
                    if (index > -1) {
                        players[index].addPerformance(player);
                    }
                    else {
                        players.push(new SeasonPlayer(player, league.leaguePlatform));
                    }
                });
            }
        });
    });
    return players;
}
function getBestPositionPlayerAverageScore(league, position) {
    var players = [];
    league.getSeasonPortionWeeks().forEach(function (week) {
        players.push(week.getBestPositionPlayer(position));
    });
    var totalScore = 0;
    players.forEach(function (player) {
        if (player !== undefined) {
            totalScore += player.score;
        }
    });
    return roundToTen(totalScore / players.length);
}
function getMemberColor(memberID) {
    var colorCode = ["#3366cc", "#ff9900", "#109618", "#0099c6", "#dd4477", "#66aa00", "#b82e2e", "#316395",
        "#3366cc", "#994499", "#22aa99", "#aaaa11", "#6633cc", "#e67300", "#8b0707", "#651067", "#329262", "#5574a6", "#3b3eac",
        "#b77322", "#16d620", "#b91383", "#f4359e", "#9c5935", "#a9c413", "#2a778d", "#668d1c", "#bea413", "#0c5922", "#743411"];
    return colorCode[memberID];
}
function getPositionColors() {
    return ["#e6194b", "#3cb44b", "#ffe119", "#4363d8", "#f58231", "#911eb4", "#46f0f0", "#f032e6", "#bcf60c", "#fabebe", "#008080", "#e6beff", "#9a6324", "#fffac8", "#800000", "#aaffc3", "#808000", "#ffd8b1", "#000075", "#808080"];
}
