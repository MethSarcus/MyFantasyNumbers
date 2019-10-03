function getESPNMatchups(settings, members, leagueID, seasonID, leagueName) {
    var weeks = [];
    console.log("getting matchups");
    var weeksToGet;
    if (settings.currentMatchupPeriod < settings.regularSeasonLength + settings.playoffLength) {
        weeksToGet = settings.currentMatchupPeriod - 1;
    }
    else {
        weeksToGet = settings.regularSeasonLength + settings.playoffLength;
    }
    var _loop_1 = function (q) {
        myXhr('get', {
            path: 'apis/v3/games/ffl/seasons/' + seasonID + '/segments/0/leagues/' + leagueID + '?view=mScoreboard&teamId=1&scoringPeriodId=' + q
        }, '').done(function (json) {
            var matchups = [];
            for (var i in json.schedule) {
                var curWeek = json.schedule[i];
                if (curWeek.home.rosterForCurrentScoringPeriod != null || curWeek.home.rosterForCurrentScoringPeriod != undefined) {
                    var homeTeamID = curWeek.home.teamId;
                    var homePlayers = [];
                    for (var z in curWeek.home.rosterForCurrentScoringPeriod.entries) {
                        var curPlayer = curWeek.home.rosterForCurrentScoringPeriod.entries[z];
                        var firstName = curPlayer.playerPoolEntry.player.firstName;
                        var lastName = curPlayer.playerPoolEntry.player.lastName;
                        var score = roundToHundred(curPlayer.playerPoolEntry.appliedStatTotal);
                        var projectedScore = 0;
                        if (curPlayer.playerPoolEntry.player.stats.length == 0) {
                            projectedScore = 0;
                        }
                        else if (curPlayer.playerPoolEntry.player.stats[1] == undefined) {
                            projectedScore = 0;
                        }
                        else if (curPlayer.playerPoolEntry.player.stats[1].statSourceId == 1) {
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
                        homePlayers.push(new Player(firstName, lastName, score, projectedScore, position, realTeamID, playerID, lineupSlotID, eligibleSlots, q));
                    }
                    var awayTeam = undefined;
                    if (curWeek.away != null && curWeek.away != undefined) {
                        var awayTeamID = curWeek.away.teamId;
                        var awayPlayers = [];
                        for (var l in curWeek.away.rosterForCurrentScoringPeriod.entries) {
                            var curPlayer = curWeek.away.rosterForCurrentScoringPeriod.entries[l];
                            var firstName = curPlayer.playerPoolEntry.player.firstName;
                            var lastName = curPlayer.playerPoolEntry.player.lastName;
                            var score = roundToHundred(curPlayer.playerPoolEntry.appliedStatTotal);
                            var projectedScore = 0;
                            if (curPlayer.playerPoolEntry.player.stats.length == 0) {
                                projectedScore = 0;
                            }
                            else if (curPlayer.playerPoolEntry.player.stats[1] == undefined) {
                                projectedScore = 0;
                            }
                            else if (curPlayer.playerPoolEntry.player.stats[1].statSourceId == 1) {
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
                            awayPlayers.push(new Player(firstName, lastName, score, projectedScore, position, realTeamID, playerID, lineupSlotID, eligibleSlots, q));
                        }
                        awayTeam = new Team(awayTeamID, awayPlayers, settings.activeLineupSlots, homeTeamID);
                    }
                    var isPlayoff_1 = (q > settings.regularSeasonLength);
                    var homeTeam = new Team(homeTeamID, homePlayers, settings.activeLineupSlots, awayTeamID);
                    matchups.push(new Matchup(homeTeam, awayTeam, q, isPlayoff_1));
                }
            }
            var isPlayoff = (q > settings.regularSeasonLength);
            weeks.push(new Week(q, isPlayoff, matchups));
            if (weeks.length == weeksToGet) {
                weeks.sort(function (x, y) {
                    if (x.weekNumber < y.weekNumber) {
                        return -1;
                    }
                    if (x.weekNumber > y.weekNumber) {
                        return 1;
                    }
                    return 0;
                });
                var league = new League(leagueID, seasonID, weeks, members, settings, leagueName);
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
    myXhr('get', {
        path: 'apis/v3/games/ffl/seasons/' + seasonID + '/segments/0/leagues/' + leagueID + '?view=mSettings'
    }, '').done(function (json) {
        console.log(json);
        if (json.hasOwnProperty('messages') && json.messages[0] == "You are not authorized to view this League.") {
            alert("Error: League not accessable, make sure your league is set to public for the season you are trying to view");
        }
        if (json.hasOwnProperty('details') && json.details[0].message == "You are not authorized to view this League.") {
            alert("Error: League not accessable, make sure your league is set to public for the season you are trying to view");
        }
        console.log("getting settings");
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
            return [parseInt(slot[0]), slot[1]];
        }).filter(function (slot) {
            return slot[1] != 0;
        });
        leagueSeasons.push(seasonID);
        var leagueName = json.settings.name;
        var activeLineupSlots = lineup.filter(function (slot) {
            return slot[0] != 21 && slot[0] != 20;
        });
        var settings = new Settings(activeLineupSlots, lineup, regularSeasonMatchupCount, playoffLength, DRAFT_TYPE, currentMatchupPeriod, isActive, leagueSeasons);
        getESPNMembers(settings, leagueID, seasonID, leagueName);
    });
}
function getESPNMembers(settings, leagueID, seasonID, leagueName) {
    console.log("getting members");
    myXhr('get', {
        path: 'apis/v3/games/ffl/seasons/' + seasonID + '/segments/0/leagues/' + leagueID + '?view=mTeam'
    }, '').done(function (json) {
        var members = [];
        var teams = json.teams;
        var seasonLength = settings.regularSeasonMatchupCount + settings.playoffLength;
        for (var i in json.members) {
            var member = json.members[i];
            var firstName = member.firstName;
            var lastName = member.lastName;
            var memberID = member.id;
            var notificationSettings = member.notificationSettings;
            for (var x in teams) {
                if (teams[x].primaryOwner == memberID) {
                    var curTeam = teams[x];
                    var location = curTeam.location;
                    var nickname = curTeam.nickname;
                    var teamAbbrev = curTeam.abbrev;
                    var curProjectedRank = curTeam.currentProjectedRank;
                    var draftDayProjectedRank = curTeam.draftDayProjectedRank;
                    var divisionID = curTeam.divisionId;
                    var transactions = curTeam.transactionCounter;
                    var teamID = curTeam.id;
                    var logo = curTeam.logo;
                    var finalStanding = curTeam.rankCalculatedFinal;
                    members.push(new Member(memberID, firstName, lastName, location, nickname, teamAbbrev, divisionID, teamID, logo, transactions, new Stats(finalStanding)));
                }
            }
        }
        getESPNMatchups(settings, members, leagueID, seasonID, leagueName);
    });
}
function getLeagueSettings(leagueID, seasonID) {
    myXhr('get', {
        path: 'https://api.sleeper.app/v1/league/' + leagueID.toString()
    }, '').done(function (json) {
        console.log(json);
    });
}
function createTeamBarChart(league, member) {
    if (window.memberBarChart != undefined) {
        window.memberBarChart.data.datasets = [];
        window.memberBarChart.data.datasets.push({
            label: member.nameToString(),
            backgroundColor: getMemberColor(member.teamID),
            data: league.getMemberTotalPointsPerPosition(member.teamID)
        });
        window.memberBarChart.data.datasets.push({
            label: "All Opponents",
            backgroundColor: "lightgrey",
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
        var ctx = document.getElementById("member_bar_chart_canvas").getContext('2d');
        var chartData = {
            labels: league.settings.getPositions(),
            datasets: [{
                    label: member.nameToString(),
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
            type: 'bar',
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
                        yOffset: '50%',
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
    if (window.leagueStackedChart != undefined) {
        window.leagueStackedChart.datasets = [];
        window.leagueStackedChart.datasets = getLeagueStackedDatasets(league);
        window.leagueStackedChart.update();
    }
    else {
        var ctx = document.getElementById("league_stacked_graph_canvas").getContext('2d');
        window.leagueStackedChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: makeMemberLabels(league),
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
                    text: "Total Points Scored",
                    fontSize: 36,
                    fontColor: "#111",
                },
                tooltips: {
                    mode: 'index',
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
    var backgroundColors = ["#24115c", "#700566", "#ae0560", "#de364d", "#f96c32", "#ffa600"];
    var positions = league.settings.getPositions();
    var labels = [];
    var increment = 0;
    positions.forEach(function (position) {
        var dataset = {
            label: position,
            backgroundColor: backgroundColors[increment],
            data: []
        };
        datasets.push(dataset);
        increment += 1;
    });
    league.members.forEach(function (member) {
        labels.push(member.nameToString);
        var positionPoints = league.getMemberTotalPointsPerPosition(member.teamID);
        for (var i = 0; i < datasets.length; i++) {
            datasets[i].data.push(positionPoints[i]);
        }
    });
    return datasets;
}
function makeMemberLabels(league) {
    var labels = [];
    league.members.forEach(function (member) {
        labels.push(member.nameToString());
    });
    return labels;
}
function createMainWeeklyLineChart(league) {
    window.myChart.destroy();
    var ctx = document.getElementById("GRAPHCANVAS");
    ctx.classList.toggle('mainChart', true);
    var myWeekLabels = [];
    for (var i = 1; i <= (league.getSeasonPortionWeeks().length); i++) {
        myWeekLabels.push("Week " + i);
    }
    var weeklyScoreMap = new Map();
    weeklyScoreMap.set(-1, []);
    league.members.forEach(function (member) {
        weeklyScoreMap.set(member.teamID, []);
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
        if (key == -1) {
            datasets.push({
                label: "League Average",
                data: value,
                borderColor: 'black',
                backGroundColor: 'black',
                fill: false,
                lineTension: 0,
            });
        }
        else {
            var curTeam = league.getMember(key);
            var myColor = getMemberColor(key);
            datasets.push({
                label: curTeam.nameToString(),
                data: value,
                borderColor: myColor,
                backGroundColor: myColor,
                fill: false,
                lineTension: 0,
            });
        }
    });
    window.myChart = new Chart(ctx, {
        type: 'line',
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
                    yOffset: '50%',
                    delay: 500
                },
                datalabels: {
                    formatter: function (value, ctx) {
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
        if (key == -1) {
            datasets.push({
                label: "League Average",
                data: value,
                borderColor: 'lightgrey',
                backgroundColor: 'lightgrey',
                pointBackgroundColor: 'lightgrey',
                fill: false,
                lineTension: 0,
            });
        }
        else if (key == -2) {
            datasets.push({
                label: "Opponent",
                data: value,
                borderColor: 'darkgrey',
                backgroundColor: 'darkgrey',
                pointBackgroundColor: 'darkgrey',
                fill: false,
                lineTension: 0,
            });
        }
        else {
            var curTeam = league.getMember(key);
            datasets.push({
                label: curTeam.nameToString(),
                data: value,
                borderColor: getMemberColor(key),
                backgroundColor: getMemberColor(key),
                pointBackgroundColor: getMemberColor(key),
                fill: false,
                lineTension: 0,
            });
        }
    });
    if (window.memberLineChart == undefined) {
        var ctx = document.getElementById("TEAM_LINE_CANVAS");
        ctx.classList.toggle('team_weekly_line_chart', true);
        var myWeekLabels = [];
        for (var i = 1; i <= (league.weeks.length); i++) {
            myWeekLabels.push("Week " + i);
        }
        window.memberLineChart = new Chart(ctx, {
            type: 'line',
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
                        }]
                },
                plugins: {
                    deferred: {
                        xOffset: 150,
                        yOffset: '50%',
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
function createLeagueWeeklyLineChart(league) {
    if (window.leagueWeeklyLineChart == undefined) {
        var ctx = document.getElementById("league_weekly_line_canvas").getContext("2d");
        var dataSets = getLeagueLineData(league);
        var myWeekLabels = [];
        for (var i = 1; i <= (league.weeks.length); i++) {
            myWeekLabels.push("Week " + i);
        }
        window.leagueWeeklyLineChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: myWeekLabels,
                datasets: dataSets
            },
            backgroundColor: '#DCDCDC',
            options: {
                tooltips: {
                    mode: 'point'
                },
                responsive: true,
                maintainAspectRatio: false,
                showLines: false,
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
                        yOffset: '50%',
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
        console.log("exists!");
        window.leagueWeeklyLineChart.data.datasets = window.leagueWeeklyLineChart.data.datasets;
        window.leagueWeeklyLineChart.update();
    }
}
function getLeagueLineData(league) {
    var weeklyScoreMap = new Map();
    weeklyScoreMap.set(-1, []);
    league.members.forEach(function (member) {
        weeklyScoreMap.set(member.teamID, []);
    });
    league.weeks.forEach(function (week) {
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
        if (key != -1) {
            var curTeam = league.getMember(key);
            datasets.push({
                fill: false,
                data: value,
                borderColor: getMemberColor(key),
                backgroundColor: getMemberColor(key),
                pointBackgroundColor: getMemberColor(key),
                lineTension: 0,
                label: curTeam.nameToString()
            });
        }
    });
    return datasets;
}
function createTeamRadarChart(league, member) {
    if (window.myRadarChart != undefined) {
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
            label: member.nameToString(),
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
        window.myRadarChart = new Chart(document.getElementById("radar_chart_canvas").getContext('2d'), {
            type: 'radar',
            data: {
                labels: league.settings.positions,
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
                        label: member.nameToString(),
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
                    text: 'Point Per Position',
                    position: 'bottom'
                },
                legend: {
                    position: 'bottom'
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
function setPage(league) {
    document.getElementById("my-navbar-brand").innerHTML = league.leagueName;
    document.getElementById("my-navbar-brand").onclick = function () {
        $(".nav-link").removeClass('active');
        fadeToLeaguePage();
    };
    document.getElementById("pwrRankButton").onclick = function () {
        $(".nav-link").removeClass('active');
        fadeToLeaguePage();
    };
    localStorage.setItem(league.id + "" + league.id, JSON.stringify(league));
    console.log(league);
    var profileImage = document.getElementById('team_image');
    profileImage.addEventListener("error", fixNoImage);
    console.log("Running setpage");
    if (league.settings.currentMatchupPeriod > league.settings.regularSeasonLength) {
        document.getElementById(SEASON_PORTION.REGULAR).onclick = function () {
            league.seasonPortion = SEASON_PORTION.REGULAR;
            league.resetStats();
            league.setMemberStats(league.getSeasonPortionWeeks());
            for (var i = 1; i <= league.members.length; i++) {
                if ($('#' + i).find('a.active').length !== 0) {
                    fadeTeam(document.getElementById('teamPill'), league, i);
                }
            }
        };
        document.getElementById(SEASON_PORTION.POST).onclick = function () {
            league.seasonPortion = SEASON_PORTION.POST;
            league.resetStats();
            league.setMemberStats(league.getSeasonPortionWeeks());
            for (var i = 1; i <= league.members.length; i++) {
                if ($('#' + i).find('a.active').length !== 0) {
                    fadeTeam(document.getElementById('teamPill'), league, i);
                }
            }
        };
        document.getElementById(SEASON_PORTION.ALL).onclick = function () {
            league.seasonPortion = SEASON_PORTION.ALL;
            league.resetStats();
            league.setMemberStats(league.getSeasonPortionWeeks());
            for (var i = 1; i <= league.members.length; i++) {
                if ($('#' + i).find('a.active').length !== 0) {
                    fadeTeam(document.getElementById('teamPill'), league, i);
                }
            }
        };
    }
    else {
        document.getElementById(SEASON_PORTION.ALL).classList.add('disabled');
        document.getElementById(SEASON_PORTION.POST).classList.add('disabled');
        document.getElementById("post_radio_button").disabled = true;
        document.getElementById("complete_radio_button").disabled = true;
    }
    var yearSelector = document.getElementById("available_seasons");
    league.settings.yearsActive.forEach(function (year) {
        var option = document.createElement("option");
        option.text = year.toString();
        option.value = year.toString();
        if (option.value == league.season.toString()) {
            option.selected = true;
        }
        yearSelector.add(option);
    });
    var nav = document.getElementById("sideNav");
    var tabsList = document.getElementById('tabs-content');
    for (var i in league.members) {
        var a = document.createElement("li");
        a.id = league.members[i].teamID.toString();
        a.classList.add("nav-item", 'align-items-left', 'side-item', "justify-content-center");
        a.onclick = function () {
            $(".nav-link").removeClass('active');
            fadeTeam(document.getElementById('teamPill'), league, this.id);
        };
        var b = document.createElement("a");
        b.setAttribute('data-toggle', 'pill');
        b.href = "#teamPill";
        b.classList.add('nav-link');
        b.style.paddingLeft = "3px;";
        var c = document.createElement('img');
        c.src = league.members[i].logoURL;
        c.style.width = "25px";
        c.style.height = "25px";
        c.style.borderRadius = "25px";
        c.addEventListener("error", fixNoImage);
        c.style.marginLeft = "8px";
        c.style.marginRight = "auto";
        b.appendChild(c);
        var d = document.createTextNode(" " + league.members[i].teamLocation + " " + league.members[i].teamNickname);
        b.appendChild(d);
        a.appendChild(b);
        nav.appendChild(a);
    }
    var q = document.getElementById("leaguePage");
    tabsList.appendChild(q);
    createPowerRankTable(league);
    var graphPage = document.getElementById("graphPage");
    var selectRow = document.createElement('div');
    selectRow.classList.add('row', 'mb-4');
    var pieButton = document.createElement('button');
    pieButton.classList.add('col-2', 'btn', 'btn-outline-info', 'mx-auto');
    var barButton = document.createElement('button');
    var lineButton = document.createElement('button');
    var tradeButton = document.createElement('button');
    var graphRow = document.createElement('div');
    graphRow.classList.add('row');
    var graphContainer = document.createElement('div');
    graphContainer.classList.add('col-12', 'col-sm-12', 'col-md-9', 'col-lg-9', 'col-xl-9', 'graphContainer');
    var stackedCanvas = document.createElement('canvas');
    stackedCanvas.id = "GRAPHCANVAS";
    graphContainer.appendChild(stackedCanvas);
    selectRow.appendChild(barButton);
    selectRow.appendChild(pieButton);
    selectRow.appendChild(lineButton);
    selectRow.appendChild(tradeButton);
    graphPage.appendChild(selectRow);
    graphRow.appendChild(graphContainer);
    graphPage.appendChild(graphRow);
    tabsList.appendChild(graphPage);
    createLeagueWeeklyLineChart(league);
    createLeagueStatsTable(league);
    createLeagueStackedGraph(league);
    $('#league_stats_table').DataTable({
        paging: false,
        searching: false,
    });
    $('#power_rank_table').DataTable({
        paging: false,
        searching: false,
    });
    $(function () {
        $('[data-toggle="tooltip"]').tooltip();
    });
}
$(document).ready(function () {
    var input = prompt("Please enter ESPN League ID", "2319896");
    var season = prompt("Please enter year", "2018");
    if (input != null) {
        var leagueID = input;
        if (localStorage.getItem(leagueID + season)) {
            var year = JSON.parse(localStorage.getItem(leagueID + season));
            var restoredLeague = League.convertFromJson(year);
            console.log(restoredLeague);
            setPage(restoredLeague);
        }
        else {
            console.log("running");
            localStorage.clear();
            getESPNSettings(leagueID, season);
        }
    }
});
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
var EmptySlot = (function () {
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
var League = (function () {
    function League(id, season, weeks, members, settings, leagueName) {
        this.id = id;
        this.weeks = weeks;
        this.season = season;
        this.members = members;
        this.settings = settings;
        this.seasonPortion = SEASON_PORTION.REGULAR;
        this.leagueName = leagueName;
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
        var _this = this;
        var weekPortion = this.weeks;
        if (this.seasonPortion === SEASON_PORTION.REGULAR) {
            weekPortion = this.weeks.filter(function (it) {
                return it.isPlayoffs === false && it.weekNumber < _this.settings.currentMatchupPeriod;
            });
        }
        else if (this.seasonPortion === SEASON_PORTION.POST) {
            weekPortion = this.weeks.filter(function (it) {
                return it.isPlayoffs === true && it.weekNumber < _this.settings.currentMatchupPeriod;
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
        var settings = new Settings(jsonSettings.activeLineupSlots, jsonSettings.lineupSlots, jsonSettings.regularSeasonLength, jsonSettings.playoffLength, jsonSettings.draftType, jsonSettings.currentMatchupPeriod, jsonSettings.isActive, jsonSettings.yearsActive);
        object.weeks.forEach(function (week) {
            var matchups = [];
            week.matchups.forEach(function (matchup) {
                var homeRoster = [];
                matchup.home.IR.concat(matchup.home.bench, matchup.home.lineup).forEach(function (player) {
                    homeRoster.push(new Player(player.firstName, player.lastName, player.score, player.projectedScore, player.position, player.realTeamID, player.playerID, player.lineupSlotID, player.eligibleSlots, player.weekNumber));
                });
                var awayTeamId = -1;
                var away;
                if (!matchup.byeWeek) {
                    var awayRoster = [];
                    awayTeamId = matchup.away.teamID;
                    matchup.away.IR.concat(matchup.away.bench, matchup.away.lineup).forEach(function (player) {
                        awayRoster.push(new Player(player.firstName, player.lastName, player.score, player.projectedScore, player.position, player.realTeamID, player.playerID, player.lineupSlotID, player.eligibleSlots, player.weekNumber));
                    });
                    away = new Team(matchup.away.teamID, awayRoster, object.settings.activeLineupSlots, matchup.home.teamID);
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
        league.setPowerRanks();
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
    League.prototype.getLeaguePointsPerPosition = function () {
        var _this = this;
        var allPlayers = getAllSeasonPlayers(this);
        var positions = this.settings.getPositions();
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
        var positions = this.settings.getPositions();
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
        var positions = this.settings.getPositions();
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
    League.prototype.getLosingDecisionAmount = function (teamID) {
        var totalLosingDecisions = 0;
        this.getSeasonPortionWeeks().forEach(function (week) {
            var matchup = week.getTeamMatchup(teamID);
            if (matchup.winner != teamID && !matchup.byeWeek) {
                totalLosingDecisions += matchup.loserPotentialWinningSingleMoves;
            }
        });
        return totalLosingDecisions;
    };
    League.prototype.getGamesLostDueToSingleChoice = function (teamID) {
        var winnableLosses = 0;
        this.getSeasonPortionWeeks().forEach(function (week) {
            var matchup = week.getTeamMatchup(teamID);
            if (matchup.winner != teamID && !matchup.byeWeek && matchup.withinSingleMoveOfWinning) {
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
            if (winPct == member.stats.getWinPct() && member.teamID !== teamID) {
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
    League.prototype.setAverageMargins = function (teamID) {
        var member = this.getMember(teamID);
        this.getSeasonPortionWeeks().forEach(function (week) {
            var matchup = week.getTeamMatchup(teamID);
            if (!matchup.byeWeek) {
                if (matchup.getWinningTeam().teamID == teamID) {
                    member.stats.averageMOV += matchup.marginOfVictory;
                }
                else if (matchup.getWinningTeam().teamID != teamID) {
                    member.stats.averageMOD += matchup.marginOfVictory;
                }
            }
        });
        member.stats.averageMOV = roundToHundred(member.stats.averageMOV / member.stats.wins);
        member.stats.averageMOD = roundToHundred(member.stats.averageMOD / member.stats.losses);
    };
    League.prototype.getUpsets = function (teamID) {
        var upsetCount = 0;
        var underdogCount = 0;
        this.getSeasonPortionWeeks().forEach(function (week) {
            var match = week.getTeamMatchup(teamID);
            if (!match.byeWeek) {
                if (match.getWinningTeam().teamID == teamID && match.isUpset) {
                    upsetCount += 1;
                    underdogCount += 1;
                }
                else if (match.getWinningTeam().teamID != teamID && !match.isUpset) {
                    underdogCount += 1;
                }
            }
        });
        return [underdogCount, upsetCount];
    };
    return League;
}());
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
        this.weekNumber = weekNumber;
        this.isPlayoffs = isPlayoff;
        if (away == undefined || away == null) {
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
            if (this.projectedWinner !== this.winner) {
                this.isUpset = true;
            }
            else {
                this.isUpset = false;
            }
            this.loserPotentialWinningSingleMoves = this.getPoorLineupDecisions();
            if (this.loserPotentialWinningSingleMoves > 0) {
                this.withinSingleMoveOfWinning = true;
            }
            else {
                this.withinSingleMoveOfWinning = false;
            }
        }
    }
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
    Matchup.prototype.getPoorLineupDecisions = function () {
        var _this = this;
        var whiffedChoices = 0;
        var team = this.home;
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
        return whiffedChoices;
    };
    return Matchup;
}());
var Member = (function () {
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
    Member.prototype.setAdvancedStats = function (weeks) {
        var _this = this;
        var scores = [];
        weeks.forEach(function (week) {
            scores.push(week.getTeam(_this.teamID).score);
        });
        this.stats.standardDeviation = calcStandardDeviation(scores);
        this.stats.weeklyAverage = getMean(scores);
    };
    Member.prototype.nameToString = function () {
        return this.teamLocation + " " + this.teamNickname;
    };
    Member.prototype.ownerToString = function () {
        return this.firstName + " " + this.lastName;
    };
    Member.prototype.recordToString = function () {
        if (this.stats.ties != 0) {
            return this.stats.wins + "-" + this.stats.losses + "-" + this.stats.ties;
        }
        else {
            return this.stats.wins + "-" + this.stats.losses;
        }
    };
    Member.prototype.rankToString = function () {
        return ordinal_suffix_of(this.stats.rank);
    };
    Member.prototype.finishToString = function () {
        return ordinal_suffix_of(this.stats.finalStanding);
    };
    Member.prototype.powerRecordToString = function () {
        return this.stats.powerWins + "-" + this.stats.powerLosses;
    };
    Member.prototype.potentialPowerRecordToString = function () {
        return this.stats.potentialPowerWins + "-" + this.stats.potentialPowerLosses;
    };
    return Member;
}());
var Player = (function () {
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
        var isEligible = false;
        this.eligibleSlots.forEach(function (eligibleSlot) {
            if (eligibleSlot == slot) {
                isEligible = true;
            }
        });
        return isEligible;
    };
    return Player;
}());
var PositionalStats = (function () {
    function PositionalStats() {
        this.qb_points = 0;
        this.rb_points = 0;
        this.wr_points = 0;
        this.te_points = 0;
        this.k_points = 0;
        this.d_st_points = 0;
        this.qb_potential_points = 0;
        this.rb_potential_points = 0;
        this.wr_potential_points = 0;
        this.te_potential_points = 0;
        this.k_potential_points = 0;
        this.d_st_potential_points = 0;
    }
    PositionalStats.prototype.getPositionalScores = function () {
        return [this.qb_points, this.rb_points, this.wr_points, this.te_points, this.k_points, this.d_st_points];
    };
    PositionalStats.prototype.getPositionalPotentialScores = function () {
        return [this.qb_points, this.rb_points, this.wr_points, this.te_points, this.k_points, this.d_st_points];
    };
    return PositionalStats;
}());
var SeasonPlayer = (function () {
    function SeasonPlayer(player) {
        this.firstName = player.firstName;
        this.lastName = player.lastName;
        this.eligibleSlots = player.eligibleSlots;
        this.seasonScore = player.score;
        this.projectedSeasonScore = player.projectedScore;
        this.position = player.position;
        this.realTeamID = player.realTeamID;
        this.playerID = player.playerID;
        this.weeksPlayed = 1;
        this.averageScore = player.score;
        this.scores = [[player.score, player.weekNumber]];
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
        var isEligible = false;
        this.eligibleSlots.forEach(function (eligibleSlot) {
            if (eligibleSlot == slot) {
                isEligible = true;
            }
        });
        return isEligible;
    };
    return SeasonPlayer;
}());
var Settings = (function () {
    function Settings(activeLineupSlots, lineupSlots, regularSeasonLength, playoffLength, draftType, currentMatchupPeriod, isActive, yearsActive) {
        this.activeLineupSlots = activeLineupSlots;
        this.lineupSlots = lineupSlots;
        this.regularSeasonLength = regularSeasonLength;
        this.playoffLength = playoffLength;
        this.draftType = draftType;
        this.positions = this.getPositions();
        this.currentMatchupPeriod = currentMatchupPeriod;
        this.isActive = isActive;
        this.yearsActive = yearsActive.sort(function (a, b) { return b - a; });
    }
    Settings.prototype.getPositions = function () {
        var positions = this.activeLineupSlots.filter(function (slot) {
            return slot[0] != 1 && slot[0] != 3 && slot[0] != 5 && slot[0] != 7 && slot[0] != 23;
        }).map(function (slot) {
            return getLineupSlot(slot[0]);
        });
        return positions;
    };
    return Settings;
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
        if (this.wins == 0) {
            return 0.00;
        }
        else {
            return roundToHundred(this.wins / (this.wins + this.losses + this.ties));
        }
    };
    Stats.prototype.getPowerWinPct = function () {
        if (this.powerWins == 0) {
            return 0.00;
        }
        else {
            return roundToHundred(this.powerWins / (this.powerWins + this.powerLosses + this.powerTies));
        }
    };
    Stats.prototype.getPotentialPowerWinPct = function () {
        if (this.potentialPowerWins == 0) {
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
    return Stats;
}());
var Team = (function () {
    function Team(teamID, players, activeLineupSlots, opponentID) {
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
        this.potentialPoints = this.getTeamScore(this.getOptimalLineup(activeLineupSlots));
        this.projectedScore = this.getProjectedScore(this.lineup);
        var gutArray = this.getGutPoints(activeLineupSlots);
        this.gutDifference = gutArray[0];
        this.gutPlayers = gutArray[1];
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
                if (!includesPlayer(players[y], optimalLineup)) {
                    if (players[y].isEligible(rosterSlots[x])) {
                        eligibleWeekPlayers.push(players[y]);
                    }
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
            if (players[i].score != null && players[i].score !== "undefined") {
                score += players[i].score;
            }
        }
        return score;
    };
    Team.prototype.getProjectedScore = function (players) {
        var projectedScore = 0;
        for (var i in players) {
            if (players[i].projectedScore != null && players[i].projectedScore !== "undefined") {
                projectedScore += players[i].projectedScore;
            }
        }
        return projectedScore;
    };
    Team.prototype.getMVP = function () {
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
    Team.prototype.getLVP = function () {
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
    Team.prototype.getPositionalPlayers = function (position) {
        var players = this.lineup;
        var positionPlayers = [];
        players.forEach(function (player) {
            if (player.position == position) {
                positionPlayers.push(player);
            }
        });
        return positionPlayers;
    };
    Team.prototype.getEligibleSlotPlayers = function (slot) {
        var players = this.lineup.concat(this.bench, this.IR);
        var eligiblePlayers = players.filter(function (it) {
            return it.isEligible(slot) === true;
        });
        return eligiblePlayers;
    };
    Team.prototype.getEligibleSlotBenchPlayers = function (slot) {
        var players = this.bench.concat(this.IR);
        var eligiblePlayers = players.filter(function (it) {
            return it.isEligible(slot) === true;
        });
        return eligiblePlayers;
    };
    Team.prototype.getProjectedOptimalLineup = function (activeLineupSlots) {
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
                if (!includesPlayer(players[y], optimalLineup)) {
                    if (players[y].isEligible(rosterSlots[x])) {
                        eligibleWeekPlayers.push(players[y]);
                    }
                }
            }
            for (var z in eligibleWeekPlayers) {
                if (eligibleWeekPlayers[z].projectedScore > highScore) {
                    highScore = eligibleWeekPlayers[z].projectedScore;
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
    Team.prototype.getGutPoints = function (activeLineupSlots) {
        var players = this.getProjectedLinupPlayerDifference(activeLineupSlots);
        var gutPlayers = players[0];
        var satPlayers = players[1];
        var diff = this.getTeamScore(gutPlayers) - this.getTeamScore(satPlayers);
        var playerNum = gutPlayers.length;
        return [diff, playerNum];
    };
    Team.prototype.getProjectedLinupPlayerDifference = function (activeLineupSlots) {
        var _this = this;
        var gutPlayers = [];
        var satPlayers = [];
        var projectedLineup = this.getProjectedOptimalLineup(activeLineupSlots);
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
    return Team;
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
                if (powerStat.teamID != innerStat.teamID) {
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
function createLeagueStatsTable(league) {
    var tableBody = document.getElementById('league_stats_table_body');
    league.members.forEach(function (member) {
        tableBody.appendChild(createLeagueStatsTableRow(member));
    });
}
function createLeagueStatsTableRow(member) {
    var row = document.createElement('tr');
    var rankCell = document.createElement('td');
    var teamNameCell = document.createElement('td');
    var recordCell = document.createElement('td');
    var pfCell = document.createElement('td');
    var paCell = document.createElement('td');
    var ppCell = document.createElement('td');
    var pctCell = document.createElement('td');
    var pctText = "%";
    rankCell.appendChild(document.createTextNode(member.stats.rank.toString()));
    pfCell.appendChild(document.createTextNode(roundToHundred(member.stats.pf).toString()));
    paCell.appendChild(document.createTextNode(roundToHundred(member.stats.pa).toString()));
    ppCell.appendChild(document.createTextNode(roundToHundred(member.stats.pp).toString()));
    recordCell.appendChild(document.createTextNode(member.recordToString()));
    teamNameCell.appendChild(document.createTextNode(member.nameToString()));
    if (member.stats.getWinPct() == 0 || member.stats.getWinPct() == 1) {
        pctText = ".00" + pctText;
    }
    pctCell.appendChild(document.createTextNode(member.stats.getWinPct() + pctText));
    row.appendChild(rankCell);
    row.appendChild(teamNameCell);
    row.appendChild(recordCell);
    row.appendChild(pctCell);
    row.appendChild(pfCell);
    row.appendChild(paCell);
    row.appendChild(ppCell);
    return row;
}
function updateMemberWeekTable(league, member) {
    $('#member_week_table_body').empty();
    var weekTable = document.getElementById('memberWeekTable');
    var tableBody = document.getElementById('member_week_table_body');
    league.weeks.forEach(function (week) {
        var curMatchup = week.getTeamMatchup(member.teamID);
        var curTeam = week.getTeam(member.teamID);
        var row = document.createElement('tr');
        var weekCell = document.createElement('td');
        var scoreCell = document.createElement('td');
        var vsCell = document.createElement('td');
        var marginCell = document.createElement('td');
        weekCell.appendChild(document.createTextNode(week.weekNumber.toString()));
        scoreCell.appendChild(document.createTextNode(roundToHundred(curTeam.score).toString()));
        if (!curMatchup.byeWeek) {
            vsCell.appendChild(document.createTextNode(league.getMember(curMatchup.getOpponent(member.teamID).teamID).teamAbbrev));
            marginCell.appendChild(document.createTextNode(roundToHundred(curTeam.score - curMatchup.getOpponent(member.teamID).score).toString()));
        }
        else {
            vsCell.appendChild(document.createTextNode("N/A"));
            marginCell.appendChild(document.createTextNode("N/A"));
        }
        row.appendChild(weekCell);
        row.appendChild(scoreCell);
        row.appendChild(vsCell);
        row.appendChild(marginCell);
        tableBody.appendChild(row);
    });
    weekTable.appendChild(tableBody);
}
function createPowerRankTable(league) {
    var tableBody = document.getElementById("power_rank_table_body");
    league.members.forEach(function (member) {
        var row = document.createElement('tr');
        var teamName = document.createElement('td');
        var powerRank = document.createElement('td');
        var powerRecord = document.createElement('td');
        var winPct = document.createElement('td');
        var potentialRecord = document.createElement('td');
        var potentialWinPct = document.createElement('td');
        var image = document.createElement('img');
        image.src = member.logoURL;
        image.style.width = "25px";
        image.style.height = "25px";
        image.style.borderRadius = "25px";
        image.addEventListener("error", fixNoImage);
        image.style.marginRight = "8px";
        teamName.appendChild(image);
        teamName.appendChild(document.createTextNode(member.nameToString()));
        powerRank.innerText = member.stats.powerRank.toString();
        powerRecord.innerText = member.powerRecordToString();
        potentialRecord.innerText = member.potentialPowerRecordToString();
        winPct.innerText = member.stats.getPowerWinPct() + "%";
        potentialWinPct.innerText = member.stats.getPotentialPowerWinPct() + "%";
        row.appendChild(powerRank);
        row.appendChild(teamName);
        row.appendChild(powerRecord);
        row.appendChild(winPct);
        row.appendChild(potentialRecord);
        row.appendChild(potentialWinPct);
        tableBody.appendChild(row);
    });
}
var SEASON_PORTION;
(function (SEASON_PORTION) {
    SEASON_PORTION["REGULAR"] = "Regular Season";
    SEASON_PORTION["POST"] = "Post-Season";
    SEASON_PORTION["ALL"] = "Complete Season";
})(SEASON_PORTION || (SEASON_PORTION = {}));
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
function getPosition(eligibleSlots) {
    if (eligibleSlots[0] === 0) {
        return POSITION.QB;
    }
    else if (eligibleSlots[0] === 2) {
        return POSITION.RB;
    }
    else if (eligibleSlots[0] === 3) {
        return POSITION.WR;
    }
    else if (eligibleSlots[0] === 16) {
        return POSITION.D_ST;
    }
    else if (eligibleSlots[0] === 17) {
        return POSITION.K;
    }
    else if (eligibleSlots[0] === 5) {
        return POSITION.TE;
    }
    else if (eligibleSlots[0] === 8) {
        return POSITION.DT;
    }
    else if (eligibleSlots[0] === 9) {
        return POSITION.DE;
    }
    else if (eligibleSlots[0] === 10) {
        return POSITION.LB;
    }
    else if (eligibleSlots[0] === 11) {
        return POSITION.DL;
    }
    else if (eligibleSlots[0] === 12) {
        return POSITION.CB;
    }
    else if (eligibleSlots[0] === 13) {
        return POSITION.S;
    }
    else if (eligibleSlots[0] === 14) {
        return POSITION.DB;
    }
    else if (eligibleSlots[0] === 15) {
        return POSITION.DP;
    }
    else if (eligibleSlots[0] === 18) {
        return POSITION.P;
    }
    else if (eligibleSlots[0] === 19) {
        return POSITION.HC;
    }
}
function getLineupSlot(lineupSlotID) {
    switch (lineupSlotID) {
        case 0: {
            return "QB";
        }
        case 1: {
            return "TQB";
        }
        case 2: {
            return "RB";
        }
        case 3: {
            return "RB/WR";
        }
        case 4: {
            return "WR";
        }
        case 5: {
            return "WR/TE";
        }
        case 6: {
            return "TE";
        }
        case 7: {
            return "OP";
        }
        case 8: {
            return "DT";
        }
        case 9: {
            return "DE";
        }
        case 10: {
            return "LB";
        }
        case 11: {
            return "DL";
        }
        case 12: {
            return "CB";
        }
        case 13: {
            return "S";
        }
        case 14: {
            return "DB";
        }
        case 15: {
            return "DP";
        }
        case 16: {
            return "D/ST";
        }
        case 17: {
            return "K";
        }
        case 18: {
            return "P";
        }
        case 19: {
            return "HC";
        }
        case 20: {
            return "BENCH";
        }
        case 21: {
            return "IR";
        }
        case 23: {
            return "RB/WR/TE";
        }
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
    if (league.settings.isActive) {
        if (league.settings.currentMatchupPeriod <= 5) {
            minSampleSize = league.settings.currentMatchupPeriod - 1;
        }
    }
    var mostConsistentPlayers = players.filter(function (player) {
        return (player.weeksPlayed >= minSampleSize);
    });
    while (mostConsistentPlayers.length == 0) {
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
            seasonPlayer.weeksPlayed >= minSampleSize && seasonPlayer.seasonScore != 0) {
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
        if (seasonPlayer.seasonScore == lvp.seasonScore) {
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
                return existingPlayer.playerID == player.playerID;
            });
            if (index > -1) {
                players[index].addPerformance(player);
            }
            else {
                players.push(new SeasonPlayer(player));
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
                    return existingPlayer.playerID == player.playerID;
                });
                if (index > -1) {
                    players[index].addPerformance(player);
                }
                else {
                    players.push(new SeasonPlayer(player));
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
                    return existingPlayer.playerID == player.playerID;
                });
                if (index > -1) {
                    players[index].addPerformance(player);
                }
                else {
                    players.push(new SeasonPlayer(player));
                }
            });
            if (!matchup.byeWeek) {
                matchup.away.lineup.forEach(function (player) {
                    var index = players.findIndex(function (existingPlayer) {
                        return existingPlayer.playerID == player.playerID;
                    });
                    if (index > -1) {
                        players[index].addPerformance(player);
                    }
                    else {
                        players.push(new SeasonPlayer(player));
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
        if (player != undefined) {
            totalScore += player.score;
        }
    });
    return roundToTen(totalScore / players.length);
}
function getMemberColor(memberID) {
    var colorCode = ["#3366cc", "#dc3912", "#ff9900", "#109618", "#990099", "#0099c6", "#dd4477", "#66aa00", "#b82e2e", "#316395",
        "#3366cc", "#994499", "#22aa99", "#aaaa11", "#6633cc", "#e67300", "#8b0707", "#651067", "#329262", "#5574a6", "#3b3eac",
        "#b77322", "#16d620", "#b91383", "#f4359e", "#9c5935", "#a9c413", "#2a778d", "#668d1c", "#bea413", "#0c5922", "#743411"];
    return colorCode[memberID];
}
function getRealTeamInitials(realteamID) {
    var team;
    switch (realteamID) {
        case 1:
            team = "Atl";
            break;
        case 2:
            team = "Buf";
            break;
        case 3:
            team = "Chi";
            break;
        case 4:
            team = "Cin";
            break;
        case 5:
            team = "Cle";
            break;
        case 6:
            team = "Dal";
            break;
        case 7:
            team = "Den";
            break;
        case 8:
            team = "Det";
            break;
        case 9:
            team = "GB";
            break;
        case 10:
            team = "Ten";
            break;
        case 11:
            team = "Ind";
            break;
        case 12:
            team = "KC";
            break;
        case 13:
            team = "Oak";
            break;
        case 14:
            team = "Lar";
            break;
        case 15:
            team = "Mia";
            break;
        case 16:
            team = "Min";
            break;
        case 17:
            team = "NE";
            break;
        case 18:
            team = "NO";
            break;
        case 19:
            team = "NYG";
            break;
        case 20:
            team = "NYJ";
            break;
        case 21:
            team = "Phi";
            break;
        case 22:
            team = "Ari";
            break;
        case 23:
            team = "Pit";
            break;
        case 24:
            team = "LAC";
            break;
        case 25:
            team = "SF";
            break;
        case 26:
            team = "Sea";
            break;
        case 27:
            team = "TB";
            break;
        case 28:
            team = "Wsh";
            break;
        case 29:
            team = "Car";
            break;
        case 30:
            team = "Jax";
            break;
        case 33:
            team = "Bal";
            break;
        case 34:
            team = "Hou";
            break;
    }
    return team;
}
function myXhr(t, d, id) {
    return $.ajax({
        type: t,
        url: 'js/proxy.php',
        dataType: 'json',
        data: d,
        cache: false,
        async: true,
    });
}
function roundToHundred(x) {
    return Math.round(x * 100) / 100;
}
function roundToTen(x) {
    return Math.round(x * 10) / 10;
}
function getColor(value) {
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
function updateTeamPill(league, teamID) {
    var member = league.getMember(teamID);
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
    unfade(document.getElementById('teamPill'));
}
function updateBestWorstConsistent(league, member) {
    var arr = getBestLeastConsistent(league, member.teamID);
    updateMVP(arr[0]);
    updateLVP(arr[1]);
    if (league.seasonPortion == SEASON_PORTION.POST) {
        updateBiggestBoom(league, league.getBiggestBoom(member.teamID), member.teamID);
    }
    else {
        updateMostConsistent(arr[2]);
    }
}
function updateWeekAverage(league, member) {
    var weeklyAverage = document.getElementById("team_weekly_average");
    var avgVsLeague = document.getElementById('team_weekly_average_vs_league');
    var weekCard = document.getElementById('team_weekly_average_card');
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
    weekCard.style.backgroundColor = getCardColor(league.getPointsScoredFinish(member.teamID), league.members.length);
}
function updateBestWeek(league, member) {
    var bestWeekScore = document.getElementById("team_best_week_score");
    var bestWeekFinish = document.getElementById('team_best_week_finish');
    var bestWeekNumber = document.getElementById('team_best_finish_week_number');
    var bestWeekCard = document.getElementById('team_best_week_card');
    var bestWeek = league.getMemberBestTeam(member.teamID);
    var finish = league.getBestWeekFinish(member.teamID);
    bestWeekScore.innerText = roundToHundred(bestWeek.score) + " Points";
    bestWeekFinish.innerText = ordinal_suffix_of(finish) + " Highest";
    bestWeekCard.style.backgroundColor = getCardColor(finish, league.members.length);
    bestWeekNumber.innerText = "Week " + league.getBestWeek(member.teamID).weekNumber;
}
function updateEfficiency(league, member) {
    var efficiencyVsLeague = document.getElementById("team_efficiency_vs_league");
    var efficiencyFinish = document.getElementById('team_efficiency_rank');
    var efficiencyPercentage = document.getElementById('team_efficiency_percentage');
    var efficiencyCard = document.getElementById('team_efficiency_card');
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
    efficiencyCard.style.backgroundColor = getCardColor(finish, league.members.length);
    efficiencyPercentage.innerText = roundToHundred(efficiency * 100) + "%";
}
function updateTeamStandardDeviation(league, member) {
    var stdRank = document.getElementById('team_consistency_rank');
    var std = document.getElementById("team_standard_deviation");
    var stdVsLeague = document.getElementById('team_standard_deviation_vs_league');
    var stdCard = document.getElementById('team_std_card');
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
    stdCard.style.backgroundColor = getCardColor(league.getStandardDeviationFinish(member.teamID), league.members.length);
}
function updateTeamCard(league, member) {
    var picture = document.getElementById("team_image");
    var team = document.getElementById("team_name");
    var owner = document.getElementById("team_owner");
    var finish = document.getElementById("team_finish");
    var record = document.getElementById("team_record");
    picture.setAttribute('src', member.logoURL);
    team.innerHTML = member.nameToString();
    owner.innerHTML = member.ownerToString();
    if (league.settings.isActive) {
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
    pfBackground.style.backgroundColor = getCardColor(league.getPointsScoredFinish(member.teamID), league.members.length);
    paFinish.innerHTML = ordinal_suffix_of(league.getPointsAgainstFinish(member.teamID));
    paScore.innerHTML = member.stats.pa.toString();
    var paDiff = roundToTen(member.stats.pa - league.getLeaguePA());
    if (paDiff > 0) {
        paLeagueDiff.innerHTML = "+" + paDiff + " League Average";
    }
    else {
        paLeagueDiff.innerHTML = paDiff + " League Average";
    }
    paBackground.style.backgroundColor = getCardColor(league.getPointsAgainstFinish(member.teamID), league.members.length);
    ppFinish.innerHTML = ordinal_suffix_of(league.getPotentialPointsFinish(member.teamID));
    ppScore.innerHTML = member.stats.pp.toString();
    var ppDiff = roundToTen(member.stats.pp - league.getLeaguePP());
    if (ppDiff > 0) {
        ppLeagueDiff.innerHTML = "+" + ppDiff + " League Average";
    }
    else {
        ppLeagueDiff.innerHTML = ppDiff + " League Average";
    }
    ppBackground.style.backgroundColor = getCardColor(league.getPotentialPointsFinish(member.teamID), league.members.length);
}
function updateMVP(teamMVP) {
    var mvpImage = document.getElementById('mvp_image');
    var mvpName = document.getElementById('team_mvp_name');
    var mvpPoints = document.getElementById('team_mvp_points');
    if (teamMVP.position == "D/ST") {
        mvpImage.src = "http://a.espncdn.com/combiner/i?img=/i/teamlogos/NFL/500/" + getRealTeamInitials(teamMVP.realTeamID) + ".png&h=150&w=150";
    }
    else {
        mvpImage.src = "http://a.espncdn.com/i/headshots/nfl/players/full/" + teamMVP.playerID + ".png";
    }
    var startsText = " starts";
    if (teamMVP.weeksPlayed == 1) {
        startsText = " start";
    }
    mvpName.innerText = teamMVP.firstName + " " + teamMVP.lastName;
    mvpPoints.innerText = roundToHundred(teamMVP.seasonScore) + " Points earned in lineup\n" + teamMVP.averageScore + " points per game, " + teamMVP.weeksPlayed + startsText;
}
function updateLVP(teamLVP) {
    var lvpImage = document.getElementById('lvp_image');
    var lvpName = document.getElementById('team_lvp_name');
    var lvpPoints = document.getElementById('team_lvp_points');
    if (teamLVP.position == "D/ST") {
        lvpImage.src = "http://a.espncdn.com/combiner/i?img=/i/teamlogos/NFL/500/" + getRealTeamInitials(teamLVP.realTeamID) + ".png&h=150&w=150";
    }
    else {
        lvpImage.src = "http://a.espncdn.com/i/headshots/nfl/players/full/" + teamLVP.playerID + ".png";
    }
    lvpName.innerText = teamLVP.firstName + " " + teamLVP.lastName;
    var startsText = " starts";
    if (teamLVP.weeksPlayed == 1) {
        startsText = " start";
    }
    lvpPoints.innerText = roundToHundred(teamLVP.seasonScore) + " Points earned in lineup\n" + teamLVP.averageScore + " points per game, " + teamLVP.weeksPlayed + startsText;
}
function updateMostConsistent(mostConsistent) {
    var mostConsistentTitle = document.getElementById('consistent_or_boom');
    var mostConsistentImage = document.getElementById('team_most_consistent_image');
    var mostConsistentName = document.getElementById('team_most_consistent_name');
    var mostConsistentPoints = document.getElementById('team_most_consistent_points');
    mostConsistentTitle.innerText = "Most Consistent";
    if (mostConsistent.position == "D/ST") {
        mostConsistentImage.src = "http://a.espncdn.com/combiner/i?img=/i/teamlogos/NFL/500/" + getRealTeamInitials(mostConsistent.realTeamID) + ".png&h=150&w=150";
    }
    else {
        mostConsistentImage.src = "http://a.espncdn.com/i/headshots/nfl/players/full/" + mostConsistent.playerID + ".png";
    }
    var startsText = " starts";
    if (mostConsistent.weeksPlayed == 1) {
        startsText = " start";
    }
    mostConsistentName.innerText = mostConsistent.firstName + " " + mostConsistent.lastName;
    mostConsistentPoints.innerText = "Standard Deviation: " + calcStandardDeviation(mostConsistent.getScores()) + "\n" + mostConsistent.averageScore + " points per game, " + mostConsistent.weeksPlayed + startsText;
}
function updateWinnableGamesLost(league, member) {
    var teamID = member.teamID;
    var winnableGamesTitle = document.getElementById('winnable_games_lost_number');
    var poorRosterDecisions = document.getElementById('winnable_games_lost_choices');
    var choices = league.getMember(teamID).stats.choicesThatCouldHaveWonMatchup;
    var gamesLost = league.getMember(teamID).stats.gameLostDueToSingleChoice;
    winnableGamesTitle.innerText = gamesLost + " Winnable Games Lost";
    poorRosterDecisions.innerText = choices + " roster decisions could have won those games";
}
function updateGutWinCard(league, member) {
    var teamID = member.teamID;
    var gutPointsTotalNumber = document.getElementById('gut_points');
    var gutPointsNumber = document.getElementById('gut_wins_projected_difference');
    var gutCard = document.getElementById('gut_wins_card');
    var gutWins = roundToHundred(league.getMember(teamID).stats.gutPoints);
    var gutPoints = roundToHundred(league.getMember(teamID).stats.gutPoints / league.getMember(teamID).stats.gutPlayersPlayed);
    gutPointsTotalNumber.innerText = gutWins + " Gut points earned";
    gutPointsNumber.innerText = gutPoints + " average points when starting player with lower projection";
    gutCard.style.backgroundColor = getCardColor(league.getGutAverageFinish(teamID), league.members.length);
}
function updateMargins(league, member) {
    var teamID = member.teamID;
    var mov = document.getElementById('margin_of_victory');
    var mod = document.getElementById('margin_of_defeat');
    mov.innerText = "Average victory margin\n\n" + league.getMember(teamID).stats.averageMOV + " Points";
    mod.innerText = "Average defeat margin\n\n" + league.getMember(teamID).stats.averageMOD + " Points";
}
function updateUpsets(league, member) {
    var teamID = member.teamID;
    var upsetTitle = document.getElementById('upsets_title');
    var underdogCount = document.getElementById('underdog_count');
    var upsets = league.getUpsets(teamID);
    upsetTitle.innerText = "Upset projected winner " + upsets[1] + " times";
    underdogCount.innerText = "Underdog " + upsets[0] + " times";
}
function updateBiggestBoom(league, biggestBoom, teamID) {
    var biggestBoomTitle = document.getElementById('consistent_or_boom');
    var biggestBoomImage = document.getElementById('team_most_consistent_image');
    var biggestBoomName = document.getElementById('team_most_consistent_name');
    var biggestBoomPoints = document.getElementById('team_most_consistent_points');
    biggestBoomTitle.innerText = "Biggest Boom";
    if (biggestBoom.position == "D/ST") {
        biggestBoomImage.src = "http://a.espncdn.com/combiner/i?img=/i/teamlogos/NFL/500/" + getRealTeamInitials(biggestBoom.realTeamID) + ".png&h=150&w=150";
    }
    else {
        biggestBoomImage.src = "http://a.espncdn.com/i/headshots/nfl/players/full/" + biggestBoom.playerID + ".png";
    }
    var outcomeText = "";
    var boomMatchup = league.weeks[biggestBoom.weekNumber - 1].getTeamMatchup(teamID);
    if (boomMatchup.byeWeek) {
        outcomeText = ",\nwhich was a byeweek!";
    }
    else {
        if (boomMatchup.getWinningTeam().teamID == teamID) {
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
function fadeTeam(element, league, teamID) {
    var op = 1;
    var timer = setInterval(function () {
        if (op <= 0.1) {
            clearInterval(timer);
            updateTeamPill(league, teamID);
        }
        element.style.opacity = op;
        element.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op -= op * 0.1;
    }, 5);
}
function fadeToLeaguePage() {
    var element = document.getElementById('teamPill');
    var op = 1;
    var timer = setInterval(function () {
        if (op <= 0.1) {
            clearInterval(timer);
            document.getElementById('teamPill').style.display = 'none';
        }
        element.style.opacity = op + "";
        element.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op -= op * 0.3;
    }, 8);
}
function unfade(element) {
    var op = 0.1;
    element.style.display = 'block';
    var timer = setInterval(function () {
        if (op >= 1) {
            clearInterval(timer);
        }
        element.style.opacity = op;
        element.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op += op * 0.05;
    }, 8);
}
function fixNoImage() {
    this.src = "assets/user1.png";
    this.style.backgroundColor = "white";
    this.onerror = null;
}
//# sourceMappingURL=tsc.js.map