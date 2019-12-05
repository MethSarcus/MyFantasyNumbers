declare var myChart: any;
declare var Chart: any;

function createMemberStrengthScatterChart(league: League) {
    const ctx = (document.getElementById("quadrant_chart_canvas") as HTMLCanvasElement).getContext("2d");
    const chartDatasets = generateStrengthScatterData(league);
    (window as any).scatterChart = new Chart(ctx, {
        type: "scatter",
        data: {
            datasets: chartDatasets
        },
        options: {
            tooltips: {
                callbacks: {
                    title(tooltipItem: any, data: any) {
                        const label = data.datasets[tooltipItem[0].datasetIndex].label;
                        let manager = "";
                        let roster = "";
                        if (tooltipItem[0].xLabel > 0) {
                            manager = "Good Manager";
                        } else if (tooltipItem[0].xLabel < 0) {
                            manager = "Bad Manager";
                        } else {
                            manager = "Average Manager";
                        }

                        if (tooltipItem[0].yLabel > 0) {
                            roster = "Good Roster";
                        } else if (tooltipItem[0].yLabel < 0) {
                            roster = "Bad Roster";
                        } else {
                            roster = "Average Roster";
                        }
                        return label + "\n\n" + manager + "\n" + roster;
                    },
                    label(tooltipItem: any) {
                        let aboveBelowGP = "";
                        if (tooltipItem.xLabel > 0) {
                            aboveBelowGP = "GP: +" + tooltipItem.xLabel + " avg";
                        } else {
                            aboveBelowGP = "GP: " + tooltipItem.xLabel + " avg";
                        }
                        return aboveBelowGP;
                    },
                    afterLabel(tooltipItem: any) {
                        let aboveBelowPP = "";
                        if (tooltipItem.yLabel > 0) {
                            aboveBelowPP = "PP: +" + tooltipItem.yLabel + " avg";
                        } else {
                            aboveBelowPP = "PP: " + tooltipItem.yLabel + " avg";
                        }

                        return aboveBelowPP;
                    }
                }
            },
            aspectRatio: 1,
            title: {
                display: true,
                position: "top",
                text: "Management Skill vs Roster Strength",
                fontSize: 20,
                fontColor: "#111",

            },
            intersect: true,
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                yAxes: [{
                    padding: 40,
                    gridLines: {
                        zeroLineWidth: 1,
                        zeroLineColor: "rgba(0,0,0,1)"
                    },
                    ticks: {
                        display: false,
                        suggestedMin: Math.round(0 - getPPMargin(league)),
                        suggestedMax: Math.round(getPPMargin(league)),
                    },
                    scaleLabel: {
                        display: true,
                        labelString: "<---------------- Roster Strength ---------------->"
                    },
                }],
                xAxes: [{
                    beginAtZero: false,
                    padding: 40,
                    display: true,
                    gridLines: {
                        zeroLineWidth: 1,
                        zeroLineColor: "rgba(0,0,0,1)"
                    },
                    ticks: {
                        display: false,
                        suggestedMin: -1 * getGutPointMargin(league),
                        suggestedMax: getGutPointMargin(league),
                    },
                    scaleLabel: {
                        display: true,
                        labelString: "<---------------- Management Skill ---------------->"
                    },
                }]
            },
            legend: {
                display: true,
                position: "bottom",
                labels: {
                    fontColor: "#333",
                    fontSize: 12
                }
            },
            plugins: {
                deferred: {
                    xOffset: 150, // defer until 150px of the canvas width are inside the viewport
                    yOffset: "50%", // defer until 50% of the canvas height are inside the viewport
                    delay: 500 // delay of 500 ms after the canvas is considered inside the viewport
                }
            },
        }
    });

    (window as any).scatterChart.render();
}

function generateStrengthScatterData(league: League): object[] {
    const datasets: object[] = [];
    league.members.forEach((member) => {
        const img = new Image();
        img.width = 40;
        img.height = 40;
        img.src = member.logoURL;
        datasets.push({
            label: member.teamNameToString(),
            borderColor: hexToRGB(getMemberColor(member.teamID), 1),
            backgroundColor: hexToRGB(getMemberColor(member.teamID), 1),
            pointStyle: img,
            hitRadius: 15,
            radius: 15,
            data: [{
                x: member.stats.getAverageGutPoints(),
                y: roundToHundred(member.stats.pp - league.getLeaguePP()),
            }]
        });
    });
    return datasets;
}

function getPPMargin(league: League): number {
    const avg = league.getLeaguePP();
    const low = league.getLowestPPMember().stats.pp;
    const high = league.getHighestPPMember().stats.pp;
    if (Math.abs(avg - low) > Math.abs(avg - high)) {
        return 1.2 * (avg - low);
    } else {
        return 1.2 * (high - avg);
    }
}

function getGutPointMargin(league: League): number {
    const avg = league.getLeagueGutPointAverage();
    const high = league.getHighestGutPointMember().stats.getAverageGutPoints();
    const low = league.getLowestGutPointMember().stats.getAverageGutPoints();
    if (Math.abs(avg - low) > Math.abs(avg - high)) {
        return Math.abs(avg - low);
    } else {
        return Math.abs(avg - high);
    }
}
