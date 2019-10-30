function createTeamRadarChart(league, member) {
    if (window.myRadarChart !== undefined) {
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
        window.myRadarChart = new Chart(document.getElementById("radar_chart_canvas").getContext("2d"), {
            type: "radar",
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
                    text: "Point Per Position",
                    position: "bottom"
                },
                legend: {
                    position: "bottom"
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
//# sourceMappingURL=Radar_Charts.js.map