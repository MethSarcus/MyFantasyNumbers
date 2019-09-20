declare var myChart: any;
declare var Chart: any;
function createMainWeeklyLineChart(league: League) {
    (window as any).myChart.destroy();
    var ctx = document.getElementById("GRAPHCANVAS");
    ctx.classList.toggle('mainChart', true);
    var myWeekLabels = [];
    for(var i = 1; i <= (league.getSeasonPortionWeeks().length); i++) {
        myWeekLabels.push("Week " + i);
    }
    var weeklyScoreMap = new Map();
    weeklyScoreMap.set(-1, []);
    league.members.forEach(member => {
        weeklyScoreMap.set(member.teamID, []);
    });

    
    league.getSeasonPortionWeeks().forEach(week => {
        weeklyScoreMap.get(-1).push(week.getWeekAverage());
        week.matchups.forEach(matchup => {
            weeklyScoreMap.get(matchup.home.teamID).push(matchup.home.score);
            if (!matchup.byeWeek) {
                weeklyScoreMap.get(matchup.away.teamID).push(matchup.away.score);
            }
        });
    });

    var datasets = [];
    weeklyScoreMap.forEach((value: number[], key: number) => {
        if (key == -1) {
            datasets.push({
                label: "League Average",
                data: value,
                borderColor: 'black',
                backGroundColor: 'black',
                fill: false,
                lineTension: 0,
            });
        } else {
            let curTeam = league.getMember(key);
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
    
    (window as any).myChart = new Chart(ctx, {
        type: 'line',
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
                    yOffset: '50%', // defer until 50% of the canvas height are inside the viewport
                    delay: 500 // delay of 500 ms after the canvas is considered inside the viewport
                },

                datalabels: {
                    formatter: (value, ctx) => {
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
    var weeklyScoreMap = new Map();
        weeklyScoreMap.set(-1, []);
        weeklyScoreMap.set(-2, []);
        weeklyScoreMap.set(member.teamID, []);
    
        league.weeks.forEach(week => {
            if (!week.getTeamMatchup(member.teamID).byeWeek) {
                weeklyScoreMap.get(-2).push(week.getTeamMatchup(member.teamID).getOpponent(member.teamID).score);
            } else {
                weeklyScoreMap.get(-2).push(null);
            }
            weeklyScoreMap.get(member.teamID).push(week.getTeam(member.teamID).score);
            weeklyScoreMap.get(-1).push(week.getWeekAverage()); 
        });
    var datasets = [];
        weeklyScoreMap.forEach((value: number[], key: number) => {
            if (key == -1) {
                datasets.push({
                    label: "League Average",
                    data: value,
                    borderColor: 'black',
                    backGroundColor: 'black',
                    pointBackgroundColor: 'black',
                    fill: false,
                    lineTension: 0,
                });
            } else if (key == -2) {
                datasets.push({
                    label: "Opponent",
                    data: value,
                    borderColor: 'orange',
                    backGroundColor: 'orange',
                    pointBackgroundColor: 'orange',
                    fill: false,
                    lineTension: 0,
                });
            } else {
                let curTeam = league.getMember(key);
                datasets.push({
                    label: curTeam.nameToString(),
                    data: value,
                    borderColor: 'blue',
                    backGroundColor: 'blue',
                    pointBackgroundColor: 'blue',
                    fill: true,
                    lineTension: 0,
                });
            }
        });
    if ((window as any).memberLineChart == undefined) {
        var ctx = (document.getElementById("TEAM_LINE_CANVAS") as HTMLCanvasElement);
        ctx.classList.toggle('team_weekly_line_chart', true);
        var myWeekLabels = [];
        for(var i = 1; i <= (league.weeks.length); i++) {
            myWeekLabels.push("Week " + i);
        }
        
        (window as any).memberLineChart = new Chart(ctx, {
            type: 'line',
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
                    }]
                },
                plugins: {
                    deferred: {
                        xOffset: 150, // defer until 150px of the canvas width are inside the viewport
                        yOffset: '50%', // defer until 50% of the canvas height are inside the viewport
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