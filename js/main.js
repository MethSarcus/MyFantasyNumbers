$(document).ready(function () {
    //leagueID = 340734;
    // document.getElementById("content-wrapper").onscroll = function () {
    //     console.log("triggered");
    //     scrollup()
    //   };


    var input = prompt("Please enter ESPN League ID", "2319896");
    var r = confirm("If you have not visited the league you entered this will take a few seconds to load while the data is gathered\nGood things come to those who wait!");

    if (input != null && r == true) {
        var leagueID = input;
        if (localStorage.getItem(leagueID + "2018")) {
            var year = JSON.parse(localStorage.getItem(leagueID + "2018"));
            var restoredLeague = League.convertFromJson(year);
            console.log(restoredLeague);
            setPage(restoredLeague);
        } else {
            console.log("running");
            localStorage.clear();
            var seasonID = "2018";
            getESPNSettings(leagueID, seasonID);
            //'apis/v3/games/ffl/seasons/2018/segments/0/leagues/340734?view=mMatchupScore&teamId=1&scoringPeriodId=1' for telling if a game is a playoff game
        }
        
    }

});

function getESPNMatchups(settings, members, leagueID, seasonID) {
    var weeks = [];
    console.log("getting matchups");
    var totalMatchupCount = settings.regularSeasonLength + settings.playoffLength;
    for (let q = 1; q <= totalMatchupCount; q++) {
        myXhr('get', {
            path: 'apis/v3/games/ffl/seasons/' + seasonID + '/segments/0/leagues/' + leagueID + '?view=mScoreboard&teamId=1&scoringPeriodId=' + q
        }, '').done(function (json) {
            var matchups = [];
            //console.log(weeks);
            for (i in json.schedule) { //increments through each matchup
                let curWeek = json.schedule[i];
                
                if (curWeek.home.rosterForCurrentScoringPeriod != null || curWeek.home.rosterForCurrentScoringPeriod != undefined) { //checks if the roster data is available for scraping
                    var homeTeamID = curWeek.home.teamId;
                    var homePlayers = [];
                    for (z in curWeek.home.rosterForCurrentScoringPeriod.entries) {
                        //(firstName, lastName, score, projectedScore, position, realTeamID, playerID, lineupSlotID
                        let curPlayer = curWeek.home.rosterForCurrentScoringPeriod.entries[z];

                        let firstName = curPlayer.playerPoolEntry.player.firstName;
                        let lastName = curPlayer.playerPoolEntry.player.lastName;
                        let score = roundToHundred(curPlayer.playerPoolEntry.appliedStatTotal);
                        //console.log(curPlayer);
                        let projectedScore = 0;
                        if (curPlayer.playerPoolEntry.player.stats.length == 0) {
                            projectedScore = 0;
                        } else if (curPlayer.playerPoolEntry.player.stats[1] == undefined) {
                            projectedScore = 0;
                        } else if (curPlayer.playerPoolEntry.player.stats[1].statSourceId == 1) {
                            projectedScore = roundToHundred(curPlayer.playerPoolEntry.player.stats[1].appliedTotal);
                        } else {
                            projectedScore = roundToHundred(curPlayer.playerPoolEntry.player.stats[0].appliedTotal);
                        }

                        let eligibleSlots = curPlayer.playerPoolEntry.player.eligibleSlots;
                        let position = getPosition(curPlayer.playerPoolEntry.player.eligibleSlots);
                        let realTeamID = curPlayer.playerPoolEntry.player.proTeamId;
                        let playerID = curPlayer.playerId;
                        let lineupSlotID = curPlayer.lineupSlotId;
                        homePlayers.push(new Player(firstName, lastName, score, projectedScore, position, realTeamID, playerID, lineupSlotID, eligibleSlots, q));
                    }

                    var awayTeam = undefined;
                    if (curWeek.away != null && curWeek.away != undefined) {
                        var awayTeamID = curWeek.away.teamId;
                        var awayPlayers = [];
                        for (l in curWeek.away.rosterForCurrentScoringPeriod.entries) {
                            let curPlayer = curWeek.away.rosterForCurrentScoringPeriod.entries[l];
                            let firstName = curPlayer.playerPoolEntry.player.firstName;
                            let lastName = curPlayer.playerPoolEntry.player.lastName;
                            let score = roundToHundred(curPlayer.playerPoolEntry.appliedStatTotal);
                            let projectedScore = 0;
                            if (curPlayer.playerPoolEntry.player.stats.length == 0) {
                                projectedScore = 0;
                            } else if (curPlayer.playerPoolEntry.player.stats[1] == undefined) {
                                projectedScore = 0;
                            } else if (curPlayer.playerPoolEntry.player.stats[1].statSourceId == 1) {
                                projectedScore = roundToHundred(curPlayer.playerPoolEntry.player.stats[1].appliedTotal);
                            } else {
                                projectedScore = roundToHundred(curPlayer.playerPoolEntry.player.stats[0].appliedTotal);
                            }
                            let eligibleSlots = curPlayer.playerPoolEntry.player.eligibleSlots;
                            let position = getPosition(curPlayer.playerPoolEntry.player.eligibleSlots);
                            let realTeamID = curPlayer.playerPoolEntry.player.proTeamId;
                            let playerID = curPlayer.playerId;
                            let lineupSlotID = curPlayer.lineupSlotId;
                            awayPlayers.push(new Player(firstName, lastName, score, projectedScore, position, realTeamID, playerID, lineupSlotID, eligibleSlots, q));
                        }
                        awayTeam = new Team(awayTeamID, awayPlayers, settings.activeLineupSlots, homeTeamID);
                    }
                    let isPlayoff = (q > settings.regularSeasonLength);
                    var homeTeam = new Team(homeTeamID, homePlayers, settings.activeLineupSlots, awayTeamID);
                    matchups.push(new Matchup(homeTeam, awayTeam, q, isPlayoff));
                }
            }
            let isPlayoff = (q > settings.regularSeasonLength);
            weeks.push(new Week(q, isPlayoff, matchups));
            if (weeks.length == totalMatchupCount) {
                weeks.sort(function (x, y) {
                    if (x.weekNumber < y.weekNumber) {
                        return -1;
                    }
                    if (x.weekNumber > y.weekNumber) {
                        return 1;
                    }
                    return 0;
                });
                var league = new League(leagueID, seasonID, weeks, members, settings);
                league.setMemberStats(league.getSeasonPortionWeeks());
                localStorage.setItem(leagueID + seasonID, JSON.stringify(league));
                setPage(league);
            }
        });
    }
}

function getESPNSettings(leagueID, seasonID) {
    myXhr('get', {
        path: 'apis/v3/games/ffl/seasons/2018/segments/0/leagues/' + leagueID + '?view=mSettings'
    }, '').done(function (json) {
        console.log("getting settings");
        var regularSeasonMatchupCount = json.settings.scheduleSettings.matchupPeriodCount;
        var divisions = json.settings.scheduleSettings.divisions;
        var draftOrder = json.settings.draftSettings.pickOrder;
        var scoringType = json.settings.scoringSettings.playerRankType;
        var totalMatchupCount = json.status.finalScoringPeriod;
        var playoffLength = totalMatchupCount - regularSeasonMatchupCount;
        var DRAFT_TYPE = json.settings.draftSettings.type;
        var lineupSlots = Object.entries(json.settings.rosterSettings.lineupSlotCounts);
        var leagueName = json.settings.name;
        for (g in lineupSlots) {
            if (lineupSlots[g][1] == 0) {
                lineupSlots.splice(g, 1);
            }
        }
        for (k in lineupSlots) {
            if (lineupSlots[k][1] == 0) {
                lineupSlots.splice(k, 1);
            }
        }
        for (k in lineupSlots) {
            if (lineupSlots[k][1] == 0) {
                lineupSlots.splice(k, 1);
            }
        }
        for (k in lineupSlots) {
            if (lineupSlots[k][1] == 0) {
                lineupSlots.splice(k, 1);
            }
        }

        var activeLineupSlots = [];
        for (a in lineupSlots) {
            if (lineupSlots[a][0] != 21 && lineupSlots[a][0] != 20) {
                activeLineupSlots.push(lineupSlots[a]);
            }
        }
        var settings = new Settings(activeLineupSlots, lineupSlots, regularSeasonMatchupCount, playoffLength, DRAFT_TYPE);
        getESPNMembers(settings, leagueID, seasonID, leagueName);
    });
}

function getESPNMembers(settings, leagueID, seasonID, leagueName) {
    console.log("getting members");
    myXhr('get', {
        path: 'apis/v3/games/ffl/seasons/2018/segments/0/leagues/' + leagueID + '?view=mTeam'
    }, '').done(function (json) {
        var members = [];
        var teams = json.teams;
        seasonLength = settings.regularSeasonMatchupCount + settings.playoffLength;
        for (i in json.members) {
            let member = json.members[i];

            var firstName = member.firstName;
            var lastName = member.lastName;
            var memberID = member.id;

            for (x in teams) {
                if (teams[x].primaryOwner == memberID) {
                    let curTeam = teams[x];
                    var location = curTeam.location;
                    var nickname = curTeam.nickname;
                    var teamAbbrev = curTeam.abbrev;
                    var divisionID = curTeam.divisionId;
                    var transactions = curTeam.transactionCounter;
                    var teamID = curTeam.id;
                    var logo = curTeam.logo;
                    var finalStanding = curTeam.rankCalculatedFinal;
                    members.push(new Member(memberID, firstName, lastName, location, nickname, teamAbbrev, divisionID, teamID, logo, transactions, new Stats(finalStanding)));
                }
            }
        }
        getESPNMatchups(settings, members, leagueID, seasonID)
    });
}

function myXhr(t, d, id) {
    return $.ajax({
        type: t,
        url: 'js/proxy.php',
        dataType: 'json',
        data: d,
        cache: false,
        async: true,
    })
}