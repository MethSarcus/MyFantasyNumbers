function createTeamRadarChart(league, member) {
    $('#radar_chart_canvas').remove();
    $('#radar_chart_container').append('<canvas id="radar_chart_canvas"><canvas>');
    new Chart(document.getElementById("radar_chart_canvas"), {
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
                    max: .8,
                    min: 0,
                    stepSize: .2,
                    display: false,
                }
            }
        }
    });
}
//# sourceMappingURL=Radar_Charts.js.map