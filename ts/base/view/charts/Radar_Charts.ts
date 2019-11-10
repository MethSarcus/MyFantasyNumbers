function createTeamRadarChart(league: League, member: Member) {
  if ((window as any).myRadarChart !== undefined) {
    (window as any).myRadarChart.data.datasets = [];
    (window as any).myRadarChart.data.datasets.push({
      label: "Average",
      fill: true,
      backgroundColor: "rgba(179,181,198,0.2)",
      borderColor: "rgba(179,181,198,1)",
      pointBorderColor: "#fff",
      pointBackgroundColor: "rgba(179,181,198,1)",
      data: league.getLeagueAveragePointsPerPosition()
    });
    (window as any).myRadarChart.data.datasets.push({
      label: member.teamNameToString(),
      fill: true,
      backgroundColor: "rgba(255,99,132,0.2)",
      borderColor: "rgba(255,99,132,1)",
      pointBorderColor: "#fff",
      pointBackgroundColor: "rgba(255,99,132,1)",
      data: league.getTeamAveragePointsPerPosition(member.teamID)
    });
    (window as any).myRadarChart.update();

  } else {
    (window as any).myRadarChart = new Chart((document.getElementById("radar_chart_canvas") as HTMLCanvasElement).getContext("2d"), {
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
            label: member.teamNameToString(),
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
    (window as any).myRadarChart.render();
  }
}
