declare var myChart: any;
declare var Chart: any;

function createTeamBarChart(league: League, member: Member) {
    if ((window as any).memberBarChart !== undefined) {
        (window as any).memberBarChart.data.datasets = [];
        (window as any).memberBarChart.data.datasets.push({
            label: member.teamNameToString(),
            backgroundColor: getMemberColor(member.teamID),
            data: league.getMemberTotalPointsPerPosition(member.teamID)
        });
        (window as any).memberBarChart.data.datasets.push({
            label: "All Opponents",
            backgroundColor: "black",
            data: league.getLeaguePointsPerPosition()
        });
        (window as any).memberBarChart.data.datasets.push({
            label: "League Average",
            backgroundColor: "darkgrey",
            data: league.getMemberOpponentTotalPointsPerPosition(member.teamID)
        });
        (window as any).memberBarChart.update();
    } else {
        const ctx = (document.getElementById("member_bar_chart_canvas") as HTMLCanvasElement).getContext("2d");
        const chartData = {
            labels: league.settings.getPositions(),
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

        (window as any).memberBarChart = new Chart(ctx, {
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
                        xOffset: 150, // defer until 150px of the canvas width are inside the viewport
                        yOffset: "50%", // defer until 50% of the canvas height are inside the viewport
                        delay: 500 // delay of 500 ms after the canvas is considered inside the viewport
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
        (window as any).memberBarChart.render();
    }

}

function createLeagueStackedGraph(league: League): void {
    if ((window as any).leagueStackedChart !== undefined) {
        (window as any).leagueStackedChart.datasets = [];
        (window as any).leagueStackedChart.datasets = getLeagueStackedDatasets(league);
        (window as any).leagueStackedChart.update();
    } else {
        const ctx = (document.getElementById("league_stacked_graph_canvas") as HTMLCanvasElement).getContext("2d");
        (window as any).leagueStackedChart = new Chart(ctx, {
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
        (window as any).leagueStackedChart.render();
    }
}

function getLeagueStackedDatasets(league: League): object[] {
    const datasets: any[] = [];
    const positions = league.settings.getPositions();
    const backgroundColors = getPositionColors();
    const labels = [];
    let increment = 0;
    positions.forEach((position) => {
        const dataset = {
            label: position,
            backgroundColor: backgroundColors[increment],
            data: Array<any>()
        };
        datasets.push(dataset);
        increment += 1;
    });
    league.members.sort((a, b) => (a.stats.pf < b.stats.pf) ? 1 : -1).forEach((member) => {
        labels.push(member.teamNameToString);
        const positionPoints = league.getMemberTotalPointsPerPosition(member.teamID);
        for (let i = 0; i < datasets.length; i++) {
            datasets[i].data.push(positionPoints[i]);
        }
    });

    return datasets;
}

function makeDescendingMemberLabels(league: League): string[] {
    const labels: string[] = [];
    league.members.sort((a, b) => (a.stats.pf < b.stats.pf) ? 1 : -1).forEach((member) => {
        labels.push(member.teamNameToString());
    });

    return labels;
}

function makeMemberLabels(league: League): string[] {
    const labels: string[] = [];
    league.members.forEach((member) => {
        labels.push(member.teamNameToString());
    });

    return labels;
}
