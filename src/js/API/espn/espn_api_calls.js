function getESPNMatchups(settings, members, leagueID, seasonID, leagueName) {
    var weeks = [];
    var weeksToGet;
    if (settings.currentMatchupPeriod < settings.regularSeasonLength + settings.playoffLength) {
        weeksToGet = settings.currentMatchupPeriod - 1;
    }
    else {
        weeksToGet = settings.regularSeasonLength + settings.playoffLength;
    }
    var _loop_1 = function (q) {
        espn_request("get", {
            path: "apis/v3/games/ffl/seasons/" + seasonID + "/segments/0/leagues/" + leagueID + "?view=mScoreboard&teamId=1&scoringPeriodId=" + q
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
                        awayTeam = new ESPNTeam(awayTeamID, awayPlayers, settings.activeLineupSlots, homeTeamID);
                    }
                    var isPlayoff = (q > settings.regularSeasonLength);
                    var homeTeam = new ESPNTeam(homeTeamID, homePlayers, settings.activeLineupSlots, awayTeam.teamID);
                    var matchup = new Matchup(homeTeam, awayTeam, q, isPlayoff);
                    matchup.setPoorLineupDecisions();
                    matchups.push(matchup);
                }
            }
            var isPlayoffs = (q > settings.regularSeasonLength);
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
                var league = new League(leagueID, seasonID, weeks, members, settings, leagueName, PLATFORM.ESPN);
                league.setMemberStats(league.getSeasonPortionWeeks());
                localStorage.setItem(leagueID + seasonID, JSON.stringify(league));
                setPage(league);
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
        var settings = new Settings(activeLineupSlots, lineup, regularSeasonMatchupCount, playoffLength, DRAFT_TYPE, currentMatchupPeriod, isActive, leagueSeasons);
        getESPNMembers(settings, leagueID, seasonID, leagueName);
    });
}
function getESPNMembers(settings, leagueID, seasonID, leagueName) {
    updateLoadingText("Getting Members");
    espn_request("get", {
        path: "apis/v3/games/ffl/seasons/" + seasonID + "/segments/0/leagues/" + leagueID + "?view=mTeam"
    }).done(function (json) {
        var members = [];
        var teams = json.teams;
        var seasonLength = settings.regularSeasonLength + settings.playoffLength;
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
        getESPNMatchups(settings, members, leagueID, seasonID, leagueName);
    });
}
//# sourceMappingURL=espn_api_calls.js.map