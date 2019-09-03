function createMainWeeklyLineChart(league) {
    //Chart.defaults.global.legend.labels.usePointStyle = true;
    //let colors = ['red', 'green', 'blue', 'orange', 'lime', 'magenta', 'teal', 'yellow'];
    window.myChart.destroy();
    var ctx = document.getElementById("GRAPHCANVAS");
    ctx.classList.toggle('mainDonut', false);
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
                    delay: 500 // delay of 500 ms after the canvas is considered inside the viewport
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
    //myChart.render();
}
function createMemberWeeklyLineChart(league, member) {
    //(window as any).myChart.destroy();
    var ctx = document.getElementById("TEAM_LINE_CANVAS");
    ctx.classList.toggle('team_weekly_line_chart', true);
    var myWeekLabels = [];
    for (var i = 1; i <= (league.getSeasonPortionWeeks().length); i++) {
        myWeekLabels.push("Week " + i);
    }
    var weeklyScoreMap = new Map();
    weeklyScoreMap.set(-1, []);
    weeklyScoreMap.set(member.teamID, []);
    league.getSeasonPortionWeeks().forEach(function (week) {
        weeklyScoreMap.get(-1).push(week.getWeekAverage());
        weeklyScoreMap.get(member.teamID).push(week.getTeam(member.teamID).score);
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
    var memberLineChart = new Chart(ctx, {
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
                    delay: 500 // delay of 500 ms after the canvas is considered inside the viewport
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
    memberLineChart.render();
}
//# sourceMappingURL=Line_Charts.js.map