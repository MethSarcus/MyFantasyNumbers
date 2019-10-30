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
                borderColor: "lightgrey",
                backgroundColor: "lightgrey",
                pointBackgroundColor: "lightgrey",
                fill: false,
                lineTension: 0,
            });
        }
        else if (key === -2) {
            datasets.push({
                label: "Opponent",
                data: value,
                borderColor: "darkgrey",
                backgroundColor: "darkgrey",
                pointBackgroundColor: "darkgrey",
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
        window.leagueWeeklyLineChart.data.datasets = window.leagueWeeklyLineChart.data.datasets;
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
                label: curTeam.nameToString()
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
//# sourceMappingURL=Line_Charts.js.map