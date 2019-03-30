//line chart use C3 to be able to use regions
//donut chart use AMCHARTS for nested dougnut



function createWeeklyLineCharts(leagueMembers) {
    //Chart.defaults.global.legend.labels.usePointStyle = true;
    //let colors = ['red', 'green', 'blue', 'orange', 'lime', 'magenta', 'teal', 'yellow'];
    var ctx = document.getElementById("LINECANVAS");
    var myWeekLabels = createWeekLabels(leagueMembers[0].pastWeeks.length);
    var datasets = [];
    for (x in leagueMembers) {
        let curTeam = leagueMembers[x];
        var myColor = getLineColor(x);
        datasets.push({
            label: curTeam.teamLocation + " " + curTeam.teamNickname,
            data: getWeekArray(curTeam.pastWeeks),
            borderColor: myColor,
            backGroundColor: myColor,
            fill: false,
            lineTension: 0,
        });
    }

    datasets.push({
        label: "League Average",
        data: getLeagueAvgWeeksArray(),
        borderColor: 'black',
        backGroundColor: 'black',
        fill: false,
        lineTension: 0,
    });
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: createWeekLabels(leagueMembers[0].pastWeeks.length),
            datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            title: {
                display: true,
                position: "top",
                text: "Points Scored By Week",
                fontSize: 40,
                fontColor: "#111",

            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: false,
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

    myChart.render();
}



function createDonutChart(leagueMember) {
    var ctx = document.getElementById(leagueMember.teamID + "DONUTCANVAS");
    var data = {
        datasets: [{
            data: getDonutData(leagueMember),
            backgroundColor: ["blue", "green", "orange", "purple", "red", "magenta"],
        }],

        // These labels appear in the legend and in the tooltips when hovering different arcs
        labels: getDonutLabels()
    };

    var myDoughnutChart = new Chart(ctx, {
        type: 'doughnut',
        data: data,
        options: {
            title: {
                display: true,
                text: 'Biggest Positional Contributor of Points'
            },
            legend: {
                position: 'bottom'
            }
        }
    });
}

function getDonutData(leagueMember) {
    //console.log(leagueMember);
    var qbScore = 0;
    var rbScore = 0;
    var wrScore = 0;
    var teScore = 0;
    var defenseScore = 0;
    var kScore = 0;
    var qbNum = 0;
    var rbNum = 0;
    var wrNum = 0;
    var teNum = 0;
    var defenseNum = 0;
    var kNum = 0;
    for (x in leagueMember.pastWeeks) {

        for (y in leagueMember.pastWeeks[x].activePlayers) {
            curPlayer = leagueMember.pastWeeks[x].activePlayers[y];
            //console.log(curPlayer);
            if (curPlayer.actualScore) {
                //console.log(curPlayer.actualScore);
                switch (curPlayer.position) {
                    case "QB":
                        qbScore += parseFloat(curPlayer.actualScore);
                        qbNum += 1;
                        break;

                    case "RB":
                        rbScore += parseFloat(curPlayer.actualScore);
                        rbNum += 1;
                        break;

                    case "WR":
                        wrScore += parseFloat(curPlayer.actualScore);
                        wrNum += 1;
                        break;

                    case "TE":
                        teScore += parseFloat(curPlayer.actualScore);
                        teNum += 1;
                        break;

                    case "D/ST":
                        defenseScore += parseFloat(curPlayer.actualScore);
                        defenseNum += 1;
                        break;

                    case "K":
                        kScore += parseFloat(curPlayer.actualScore);
                        kNum += 1;
                        break;
                }
            }

        }
    }
    //console.log(qbNum);
    //console.log([qbScore, rbScore, wrScore, teScore, defenseScore, kScore]);
    return [Math.round((qbScore / qbNum) * 100) / 100, Math.round((rbScore / rbNum) * 100) / 100, Math.round((wrScore / wrNum) * 100) / 100, Math.round((teScore / teNum) * 100) / 100, Math.round((defenseScore / defenseNum) * 100) / 100, Math.round((kScore / kNum) * 100) / 100];
}

function getStackedData(leagueMember) {
    //console.log(leagueMember);
    var qbScore = 0;
    var rbScore = 0;
    var wrScore = 0;
    var teScore = 0;
    var defenseScore = 0;
    var kScore = 0;
    for (x in leagueMember.pastWeeks) {

        for (y in leagueMember.pastWeeks[x].activePlayers) {
            curPlayer = leagueMember.pastWeeks[x].activePlayers[y];
            //console.log(curPlayer);
            if (curPlayer.actualScore) {
                //console.log(curPlayer.actualScore);
                switch (curPlayer.position) {
                    case "QB":
                        qbScore += parseFloat(curPlayer.actualScore);

                        break;

                    case "RB":
                        rbScore += parseFloat(curPlayer.actualScore);

                        break;

                    case "WR":
                        wrScore += parseFloat(curPlayer.actualScore);

                        break;

                    case "TE":
                        teScore += parseFloat(curPlayer.actualScore);

                        break;

                    case "D/ST":
                        defenseScore += parseFloat(curPlayer.actualScore);

                        break;

                    case "K":
                        kScore += parseFloat(curPlayer.actualScore);
                        break;
                }
            }

        }
    }
    //console.log(qbNum);
    //console.log([qbScore, rbScore, wrScore, teScore, defenseScore, kScore]);
    return [Math.round((qbScore) * 100) / 100, Math.round((rbScore) * 100) / 100, Math.round((wrScore) * 100) / 100, Math.round((teScore) * 100) / 100, Math.round((defenseScore) * 100) / 100, Math.round((kScore) * 100) / 100];
}

function getDonutLabels() {
    return ["QB", "RB", "WR", "TE", "D/ST", "K"];
}

function createWeeklyLineChart(leagueMember, league) {
    var weeklyPointsArray = getWeekArray(leagueMember.pastWeeks);
    var ctx = document.getElementById(leagueMember.teamID + "LINECHART");
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: createWeekLabels(leagueMember.pastWeeks.length),
            datasets: [{
                    label: leagueMember.teamLocation + " " + leagueMember.teamNickname + " Weekly Average",
                    data: weeklyPointsArray,
                    backgroundColor: "blue",
                    borderColor: "lightblue",
                    fill: false,
                    lineTension: 0,
                }, {
                    label: 'League Average',
                    fill: false,
                    data: getLeagueAvgWeeksArray(league),
                    lineTension: 0,
                    backgroundColor: "black",
                    borderColor: "grey",

                },
                {
                    label: 'Weekly Opponent',
                    fill: false,
                    data: getOpponentsWeeks(leagueMember.pastWeeks),
                    lineTension: 0,
                    backgroundColor: "orange",
                    borderColor: "red",

                },
            ]
        },

        options: {
            responsive: true,
            title: {
                display: true,
                position: "top",
                text: "Points Scored By Week",
                fontSize: 18,
                fontColor: "#111",

            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        max: 250,
                    }
                }]
            },
            legend: {
                display: true,
                position: "bottom",
                labels: {
                    fontColor: "#333",
                    fontSize: 16
                }
            }
        }
    });

}

function createStackedColumns(myYear) {
    var ctx = document.getElementById("LEAGUESTACKEDCANVAS");
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: createTeamLabels(myYear.members),
            datasets: createStackedDatasets(myYear),
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
            title: {
                display: true,
                position: "top",
                text: "Total Points Scored",
                fontSize: 36,
                fontColor: "#111",

            },
            tooltips: {
                mode: 'index',
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
    myChart.render();
}

function getLeagueAvgWeeksArray(myLeague) {
    //console.log(myLeague);
    var myMembers = myLeague.members;
    var leagueWeeksArray = [];
    for (let i = 0; i < myMembers[0].pastWeeks.length; i++) {
        let weekTotalPoints = 0.00;
        let weekAverage = 0.00
        for (x in myMembers) {
            weekTotalPoints += parseFloat(myMembers[x].pastWeeks[i].activeScore);
        }
        weekAverage = (weekTotalPoints / myMembers.length);
        leagueWeeksArray.push(weekAverage);
    }
    return leagueWeeksArray;

}

function createTeamLabels(members) {
    var teamLabels = [];
    for (i in members) {
        teamLabels.push(members[i].teamLocation + " " + members[i].teamNickname);
    }
    return teamLabels;
}


function getWeekArray(memberPastWeeks) {
    var weeks = [];
    for (x in memberPastWeeks) {
        weeks.push(parseFloat(memberPastWeeks[x].activeScore));
    }
    return weeks;
}

function getOpponentsWeeks(memberPastWeeks) {
    var weeks = [];
    for (x in memberPastWeeks) {
        weeks.push(parseFloat(memberPastWeeks[x].opponentActiveScore));
    }
    return weeks;
}

function createWeekLabels(numWeeks) {
    var weekLabels = [];
    for (let x = 1; x < numWeeks + 1; x++) {
        weekLabels.push("Week " + x);
    }
    return weekLabels;
}

function createStackedDatasets(myYear) {
    var memberData = [];
    var datasets = [];
    var backgroundColors = ["#24115c", "#700566", "#ae0560", "#de364d", "#f96c32", "#ffa600"];
    var positions = getDonutLabels();
    for (i in myYear.members) {
        memberData.push(getStackedData(myYear.members[i]));
    }


    for (x = 0; x < positions.length; x++) {
        let set = {
            type: 'bar',
            label: positions[x],
            backgroundColor: backgroundColors[x],
            data: extractMemberData(memberData, x),
        };
        datasets.push(set);
    }
    return datasets;

}

function extractMemberData(memberData, pos) {
    var data = [];
    for (i = 0; i < memberData.length; i++) {
        data.push(memberData[i][pos]);
    }
    return data;
}


/*
    [{
        label: "QB",
        data: getLeagueQBArrays,
        backgroundColor: "blue",
        borderColor: "lightblue",
        fill: false,
        lineTension: 0,
    }, {
        label: 'League Average',
        fill: false,
        data: getLeagueAvgWeeksArray(league),
        lineTension: 0,
        backgroundColor: "black",
        borderColor: "grey",

    },
    {
        label: 'Weekly Opponent',
        fill: false,
        data: getOpponentsWeeks(leagueMember.pastWeeks),
        lineTension: 0,
        backgroundColor: "orange",
        borderColor: "red",

    },
]
},

options: {
responsive: true,
title: {
    display: true,
    position: "top",
    text: "Points Scored By Week",
    fontSize: 18,
    fontColor: "#111",

},
scales: {
    yAxes: [{
        ticks: {
            beginAtZero: true,
            max: 250,
        }
       }] */