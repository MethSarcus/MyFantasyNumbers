declare var myChart: any;
declare var Chart: any;
function createMainWeeklyLineChart(league: League) {
    (window as any).myChart.destroy();
    const ctx = document.getElementById("GRAPHCANVAS");
    ctx.classList.toggle("mainChart", true);
    const myWeekLabels = [];
    for (let i = 0; i <= (league.getSeasonPortionWeeks().length); i++) {
        myWeekLabels.push("Week " + i);
    }
    const weeklyScoreMap = new Map();
    weeklyScoreMap.set(-1, [0]);
    league.members.forEach((member) => {
        weeklyScoreMap.set(member.teamID, [0]);
    });

    league.getSeasonPortionWeeks().forEach((week) => {
        weeklyScoreMap.get(-1).push(week.getWeekAverage());
        week.matchups.forEach((matchup) => {
            weeklyScoreMap.get(matchup.home.teamID).push(matchup.home.score);
            if (!matchup.byeWeek) {
                weeklyScoreMap.get(matchup.away.teamID).push(matchup.away.score);
            }
        });
    });

    const datasets: any[] = [];
    weeklyScoreMap.forEach((value: number[], key: number) => {
        if (key === -1) {
            datasets.push({
                label: "League Average",
                data: value,
                borderColor: "black",
                backGroundColor: "black",
                fill: false,
                lineTension: 0,
            });
        } else {
            const curTeam = league.getMember(key);
            const myColor = getMemberColor(key);
            datasets.push({
                label: curTeam.teamNameToString(),
                data: value,
                borderColor: myColor,
                backGroundColor: myColor,
                fill: false,
                lineTension: 0,
            });
        }

    });

    (window as any).myChart = new Chart(ctx, {
        type: "line",
        data: {
            labels: myWeekLabels,
            datasets
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
                    xOffset: 150, // defer until 150px of the canvas width are inside the viewport
                    yOffset: "50%", // defer until 50% of the canvas height are inside the viewport
                    delay: 500 // delay of 500 ms after the canvas is considered inside the viewport
                },

                datalabels: {
                    formatter: () => {
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

function createMemberWeeklyLineChart(league: League, member: Member) {
    const weeklyScoreMap = new Map();
    weeklyScoreMap.set(-1, []);
    weeklyScoreMap.set(-2, []);
    weeklyScoreMap.set(member.teamID, []);

    league.weeks.forEach((week) => {
        if (!week.getTeamMatchup(member.teamID).byeWeek) {
            weeklyScoreMap.get(-2).push(week.getTeamMatchup(member.teamID).getOpponent(member.teamID).score);
        } else {
            weeklyScoreMap.get(-2).push(null);
        }
        weeklyScoreMap.get(member.teamID).push(week.getTeam(member.teamID).score);
        weeklyScoreMap.get(-1).push(week.getWeekAverage());
    });
    const datasets: any = [];
    weeklyScoreMap.forEach((value: number[], key: number) => {
        if (key === -1) {
            datasets.push({
                label: "League Average",
                data: value,
                borderColor: "darkgrey",
                backgroundColor: "darkgrey",
                pointBackgroundColor: "darkgrey",
                fill: false,
                lineTension: 0,
            });
        } else if (key === -2) {
            datasets.push({
                label: "Opponent",
                data: value,
                borderColor: "black",
                backgroundColor: "black",
                pointBackgroundColor: "black",
                fill: false,
                lineTension: 0,
            });
        } else {
            const curTeam = league.getMember(key);
            datasets.push({
                label: curTeam.teamNameToString(),
                data: value,
                borderColor: getMemberColor(key),
                backgroundColor: getMemberColor(key),
                pointBackgroundColor: getMemberColor(key),
                fill: false,
                lineTension: 0,
            });
        }
    });
    if ((window as any).memberLineChart === undefined) {
        const ctx = (document.getElementById("TEAM_LINE_CANVAS") as HTMLCanvasElement);
        ctx.classList.toggle("team_weekly_line_chart", true);
        const myWeekLabels = [];
        for (let i = 1; i <= (league.weeks.length); i++) {
            myWeekLabels.push("Week " + i);
        }

        (window as any).memberLineChart = new Chart(ctx, {
            type: "line",
            data: {
                labels: myWeekLabels,
                datasets
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
        (window as any).memberLineChart.render();
    } else {
        (window as any).memberLineChart.data.datasets = [];
        (window as any).memberLineChart.data.datasets = datasets;
        (window as any).memberLineChart.update();
    }
}

function createLeagueWeeklyLineChart(league: League, accumulates: boolean) {
    if ((window as any).leagueWeeklyLineChart === undefined) {
        const ctx = (document.getElementById("league_weekly_line_canvas") as HTMLCanvasElement).getContext("2d");
        const dataSets = getLeagueLineData(league, accumulates);
        const myWeekLabels = [];
        if (accumulates) {
            myWeekLabels.push();
        }
        for (let i = 1; i <= (league.weeks.length); i++) {
            myWeekLabels.push("Week " + i);
        }

        (window as any).leagueWeeklyLineChart = new Chart(ctx, {
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
        (window as any).leagueWeeklyLineChart.render();
    } else {
        (window as any).leagueWeeklyLineChart.data.datasets = (window as any).leagueWeeklyLineChart.data.datasets;
        (window as any).leagueWeeklyLineChart.update();
    }
}

function getLeagueLineData(league: League, accumulates: boolean): object[] {
    const weeklyScoreMap = new Map();
    weeklyScoreMap.set(-1, []);
    league.members.forEach((member) => {
        weeklyScoreMap.set(member.teamID, []);
    });
    league.members.forEach((member) => {
        weeklyScoreMap.set(member.teamID, []);
    });

    league.weeks.forEach((week) => {
        weeklyScoreMap.get(-1).push(week.getWeekAverage());
        week.matchups.forEach((matchup) => {
            weeklyScoreMap.get(matchup.home.teamID).push(roundToHundred(matchup.home.score));
            if (!matchup.byeWeek) {
                weeklyScoreMap.get(matchup.away.teamID).push(roundToHundred(matchup.away.score));
            }
        });
    });

    const datasets: any[] = [];
    weeklyScoreMap.forEach((value: number[], key: number) => {
        if (key !== -1) {
            const curTeam = league.getMember(key);
            let seasonTotal = 0;
            datasets.push({
                fill: false,
                data: value.map((weekScore) => {
                    if (accumulates) {
                        seasonTotal += weekScore;
                        return seasonTotal;
                    } else {
                        return weekScore;
                    }
                }),
                borderColor: getMemberColor(key),
                backgroundColor: getMemberColor(key),
                pointBackgroundColor: getMemberColor(key),
                lineTension: 0,
                borderWidth: 2,
                label: curTeam.teamNameToString()
            });
        }
    });
    return datasets;
}

function deselectLeagueLineData(labelName: string) {
    const data: any = (window as any).leagueWeeklyLineChart.data.datasets;
    if (labelName !== "") {
        data.forEach((dataset: any) => {
            if (dataset.label.replace(/^\s+|\s+$/g, "") !== labelName.replace(/^\s+|\s+$/g, "")) {
                const newColor = dataset.backgroundColor + "1A";
                dataset.backgroundColor = newColor;
                dataset.borderColor = newColor;
                dataset.pointBackgroundColor = newColor;
            } else {
                dataset.hidden = false;
            }
        });
    }
    (window as any).leagueWeeklyLineChart.data.datasets = data;
    (window as any).leagueWeeklyLineChart.update();
}

function reselectLeagueLineData() {
    const data = (window as any).leagueWeeklyLineChart.data.datasets;
    data.forEach((dataset: any) => {
        const color = dataset.backgroundColor;
        if (color.length === 9) {
            dataset.backgroundColor = color.substring(0, color.length - 2);
            dataset.borderColor = color.substring(0, color.length - 2);
            dataset.pointBackgroundColor = color.substring(0, color.length - 2);
        }
    });

    (window as any).leagueWeeklyLineChart.data.datasets = data;
    (window as any).leagueWeeklyLineChart.update();
}
