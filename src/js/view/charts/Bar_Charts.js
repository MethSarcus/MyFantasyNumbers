function createTeamBarChart(league, member) {
    if (window.memberBarChart !== undefined) {
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
        var ctx = document.getElementById("member_bar_chart_canvas").getContext("2d");
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
                    text: "Points Scored by Position",
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
    var backgroundColors = ["#24115c", "#700566", "#ae0560", "#de364d", "#f96c32", "#ffa600"];
    var positions = league.settings.getPositions();
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
        labels.push(member.nameToString);
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
        labels.push(member.nameToString());
    });
    return labels;
}
function makeMemberLabels(league) {
    var labels = [];
    league.members.forEach(function (member) {
        labels.push(member.nameToString());
    });
    return labels;
}
//# sourceMappingURL=Bar_Charts.js.map