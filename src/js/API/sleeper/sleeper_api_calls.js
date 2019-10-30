function getSleeperLeagueSettings(leagueID, seasonID) {
    sleeper_request("get", {
        path: "league/" + leagueID.toString()
    }).done(function (json) {
        if (json == null) {
            alert("Something went wrong, make sure the leagueID was input correctly and the season you are looking up exists");
            location.reload();
            return;
        }
        var rosters = convertSleeperRoster(json.roster_positions, json.settings.reserve_slots, json.settings.taxi_slots);
        var lineupOrder = json.roster_positions.filter(function (it) { return it !== "BN"; });
        var leagueName = json.name;
        var leagueAvatar = json.avatar;
        var draftId = json.draft_id;
        var playoffStartWeek = json.settings.playoff_week_start;
        var currentMatchupPeriod = json.settings.last_scored_leg;
        var previousLeagueId = json.previous_league_id;
        var numDivisions = json.settings.divisions;
        var isActive = (json.status === "in_season");
        var scoringSettings = json.scoring_settings;
        var divisions = [];
        for (var i = 0; i < numDivisions; i++) {
            divisions.push((json.metadata["division_" + (i + 1)], json.metadata["division_" + (i + 1) + "_avatar"]));
        }
        var settings = new Settings(rosters[0], rosters[0].concat(rosters[1]), 16, 16 - playoffStartWeek, DRAFT_TYPE.SNAKE, currentMatchupPeriod, isActive, [seasonID]);
        updateLoadingText("Getting Members");
        getSleeperMembers(leagueID, seasonID, settings, scoringSettings, lineupOrder, leagueName);
    });
}
function getSleeperMembers(leagueID, seasonID, settings, scoringSettings, lineupOrder, leagueName) {
    sleeper_request("get", {
        path: "league/" + leagueID.toString() + "/users"
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
        getSleeperRosters(leagueID, seasonID, members, settings, scoringSettings, lineupOrder, leagueName);
    });
}
function getSleeperRosters(leagueID, seasonID, members, settings, scoringSettings, lineupOrder, leagueName) {
    sleeper_request("get", {
        path: "league/" + leagueID.toString() + "/rosters/"
    }).done(function (json) {
        json.forEach(function (roster) {
            var teamID = parseInt(roster.roster_id, 10);
            var wins = roster.settings.wins;
            var totalMoves = roster.settings.total_moves;
            var rosterOwnerID = roster.owner_id.toString();
            var coOwners = roster.co_owners;
            members.forEach(function (member) {
                if (member.memberID === rosterOwnerID) {
                    member.teamID = teamID;
                    member.stats = new Stats(0);
                }
            });
        });
        updateLoadingText("Getting Matchups");
        getSleeperMatchups(leagueID, seasonID, members.filter(function (member) { return member.teamID !== undefined; }), settings, scoringSettings, lineupOrder, leagueName);
    });
}
function getSleeperMatchups(leagueID, seasonID, members, settings, scoringSettings, lineupOrder, leagueName) {
    var promises = [];
    for (var i = 1; i <= settings.currentMatchupPeriod; i++) {
        promises.push(makeRequest("https://api.sleeper.app/v1/league/" + leagueID + "/matchups/" + i));
    }
    updateLoadingText("Getting weekly stats");
    var weekCounter = 1;
    var Weeks = [];
    Promise.all(promises).then(function (weeks) {
        weeks.forEach(function (week) {
            var isPlayoffs = (weekCounter > settings.regularSeasonLength);
            var weekMatches = getSleeperWeekMatchups(week.response, weekCounter, isPlayoffs, lineupOrder);
            Weeks.push(new Week(weekCounter, isPlayoffs, weekMatches));
            weekCounter += 1;
        });
        getSleeperWeekStats(settings.currentMatchupPeriod).then(function (result) {
            var _loop_1 = function (y) {
                Weeks[y].matchups.forEach(function (matchup) {
                    matchup.home.lineup.forEach(function (player) {
                        result[y].calculatePlayerScore(scoringSettings, player);
                        result[y].calculateProjectedPlayerScore(scoringSettings, player);
                    });
                    matchup.home.bench.forEach(function (player) {
                        result[y].calculatePlayerScore(scoringSettings, player);
                        result[y].calculateProjectedPlayerScore(scoringSettings, player);
                    });
                    if (!matchup.byeWeek) {
                        matchup.away.lineup.forEach(function (player) {
                            result[y].calculatePlayerScore(scoringSettings, player);
                            result[y].calculateProjectedPlayerScore(scoringSettings, player);
                        });
                        matchup.away.bench.forEach(function (player) {
                            result[y].calculatePlayerScore(scoringSettings, player);
                            result[y].calculateProjectedPlayerScore(scoringSettings, player);
                        });
                    }
                });
            };
            for (var y = 0; y < result.length; y++) {
                _loop_1(y);
            }
            assignAllPlayerAttributes(Weeks, settings.activeLineupSlots, settings, leagueID, seasonID, members, leagueName);
        });
    });
}
function getSleeperWeekMatchups(teams, weekNumber, isPlayoff, lineupOrder) {
    var allTeams = (teams).map(function (team) {
        return new SleeperTeam(team.starters, team.players, team.points, team.matchup_id, team.roster_id, findOpponent(teams, team.roster_id, team.matchup_id), weekNumber, lineupOrder);
    });
    var matchups = [];
    var _loop_2 = function (i) {
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
        _loop_2(i);
    }
    return matchups;
}
function assignAllPlayerAttributes(weeks, activeLineupSlots, settings, leagueID, seasonID, members, leagueName) {
    updateLoadingText("Getting Player Stats");
    makeRequest("js/typescript/player_library.json").then(function (result) {
        var lib = result.response;
        weeks.forEach(function (week) {
            week.matchups.forEach(function (matchup) {
                matchup.home.lineup.forEach(function (player) {
                    assignSleeperPlayerAttributes(player, lib[player.playerID]);
                });
                matchup.home.bench.forEach(function (player) {
                    assignSleeperPlayerAttributes(player, lib[player.playerID]);
                });
                matchup.home.IR.forEach(function (player) {
                    assignSleeperPlayerAttributes(player, lib[player.playerID]);
                });
                matchup.home.setTeamMetrics(activeLineupSlots);
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
                    matchup.away.setTeamMetrics(activeLineupSlots);
                    matchup.projectedMOV = (Math.abs(matchup.home.projectedScore - matchup.away.projectedScore));
                    matchup.setPoorLineupDecisions();
                }
            });
        });
        var league = new League(leagueID, seasonID, weeks, members, settings, leagueName, PLATFORM.SLEEPER);
        updateLoadingText("Setting Page");
        league.setMemberStats(league.getSeasonPortionWeeks());
        setPage(league);
    });
}
//# sourceMappingURL=sleeper_api_calls.js.map