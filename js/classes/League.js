var League = /** @class */ (function () {
    function League(id, season, weeks, members, settings, leagueName) {
        this.id = id;
        this.weeks = weeks;
        this.season = season;
        this.members = members;
        this.settings = settings;
        this.seasonPortion = SEASON_PORTION.REGULAR;
        this.leagueName = leagueName;
    }
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
                curMember.stats.pf += curMemberTeam.score;
                curMember.stats.pp += curMemberTeam.potentialPoints;
                curMember.stats.powerWins += i;
                curMember.stats.powerLosses += (weekMatches.length - 1 - i);
            }
        });
        this.members.forEach(function (member) {
            member.setAdvancedStats(weeks);
            member.stats.roundStats();
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
        return weekPortion;
    };
    League.prototype.getMember = function (teamID) {
        var found;
        this.members.forEach(function (member) {
            if (teamID == member.teamID) {
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
        var smallestMOV = this.getSeasonPortionWeeks()[0].matchups[0].marginOfVictory;
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
                else if (!matchup.byeWeek) {
                    if (matchup.away.score > highestScore) {
                        bestWeekMatchup = matchup;
                        highestScore = matchup.away.score;
                    }
                }
            });
        });
        return bestWeekMatchup;
    };
    League.convertFromJson = function (object) {
        var members = [];
        var weeks = [];
        var jsonSettings = object.settings;
        var settings = new Settings(jsonSettings.activeLineupSlots, jsonSettings.lineupSlots, jsonSettings.regularSeasonLength, jsonSettings.playoffLength, jsonSettings.draftType);
        object.weeks.forEach(function (week) {
            var matchups = [];
            week.matchups.forEach(function (matchup) {
                var homeRoster = [];
                matchup.home.IR.concat(matchup.home.bench, matchup.home.lineup).forEach(function (player) {
                    homeRoster.push(new Player(player.firstName, player.lastName, player.score, player.projectedScore, player.position, player.realTeamID, player.playerID, player.lineupSlotID, player.eligibleSlots, player.weekNumber));
                });
                var away;
                if (!matchup.byeWeek) {
                    var awayRoster = [];
                    matchup.away.IR.concat(matchup.away.bench, matchup.away.lineup).forEach(function (player) {
                        awayRoster.push(new Player(player.firstName, player.lastName, player.score, player.projectedScore, player.position, player.realTeamID, player.playerID, player.lineupSlotID, player.eligibleSlots, player.weekNumber));
                    });
                    away = new Team(matchup.away.teamID, awayRoster, object.settings.activeLineupSlots, matchup.away.teamID);
                }
                else {
                    var awayTeamId = -1;
                }
                var home = new Team(matchup.home.teamID, homeRoster, object.settings.activeLineupSlots, awayTeamId);
                matchups.push(new Matchup(home, away, week.weekNumber, week.isPlayoffs));
            });
            weeks.push(new Week(week.weekNumber, week.isPlayoffs, matchups));
        });
        object.members.forEach(function (member) {
            members.push(new Member(member.ID, member.firstName, member.lastName, member.teamLocation, member.teamNickname, member.teamAbbrev, member.division, member.teamID, member.logoURL, member.transactions, new Stats(member.stats.finalStanding)));
        });
        var league = new League(object.id, object.season, weeks, members, settings, object.leagueName);
        league.setMemberStats(league.getSeasonPortionWeeks());
        return league;
    };
    League.prototype.getTeamAveragePointsPerPosition = function (teamID) {
        var _this = this;
        var allPlayers = getSeasonPlayers(this, teamID);
        var positions = this.settings.getPositions();
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
    League.prototype.getLeagueAveragePointsPerPosition = function () {
        var _this = this;
        var allPlayers = getAllSeasonPlayers(this);
        var positions = this.settings.getPositions();
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
    return League;
}());
//# sourceMappingURL=League.js.map