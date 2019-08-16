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
        });
    };
    League.prototype.resetStats = function () {
        this.members.forEach(function (member) {
            member.stats = new Stats(member.stats.finalStanding);
        });
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
            if (teamID === member.teamID) {
                found = member;
            }
        });
        return found;
    };
    League.prototype.getMemberBestWeek = function (teamID) {
        var highScore = 0;
        var highTeam;
        this.weeks.forEach(function (week) {
            if (week.getTeam(teamID).score > highScore) {
                highScore = week.getTeam(teamID).score;
                highTeam = week.getTeam(teamID);
            }
        });
        return highTeam;
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
        var bestWeekMatchup = this.weeks[0].getTeamMatchup(teamID);
        var highestScore = this.weeks[0].getTeam(teamID).score;
        this.weeks.forEach(function (week) {
            if (week.getTeam(teamID).score > highestScore) {
                highestScore = week.getTeam(teamID).score;
                bestWeekMatchup = week.getTeamMatchup(teamID);
            }
        });
        return bestWeekMatchup;
    };
    League.prototype.getLargestMarginOfVictory = function () {
        var highestMOV = 0;
        var highestMOVMatchup;
        this.weeks.forEach(function (week) {
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
        var smallestMOV = this.weeks[0].matchups[0].marginOfVictory;
        var smallestMOVMatchup;
        this.weeks.forEach(function (week) {
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
    League.prototype.getOverallBestWeek = function () {
        var bestWeekMatchup;
        var highestScore = 0;
        this.weeks.forEach(function (week) {
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
    return League;
}());
//# sourceMappingURL=League.js.map