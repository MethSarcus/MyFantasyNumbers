var myLeague;
var myYear;

$(document).ready(function () {
    //console.log("running")
    //leagueID = 340734;
    var input = prompt("Please enter ESPN League ID", "2319896");
    var r = confirm("If you have not visited the league you entered this will take a few seconds to load while the data is gathered\nGood things come to those who wait!");
    if (input != null && r == true) {
        leagueID = input;

        //localStorage.clear();
        if (localStorage.getItem(leagueID + "2018")) {
            //console.log("retrieved json")
            myYear = JSON.parse(localStorage.getItem(leagueID + "2018"));
        } else {
            var league = new League();
            var year = new Year();
            year.seasonID = "2018";
            year.leagueID = leagueID;

            var seasonLength = 16;
            myXhr('get', {
                path: 'apis/v3/games/ffl/seasons/2018/segments/0/leagues/' + leagueID + '?view=mTeam'
            }, '').done(function (json) {
                //console.log("Team Endpoint")
                //console.log(json);
                league.id = json.id;
                year.leagueID = json.id;
                var teams = json.teams;
                seasonLength = json.status.finalScoringPeriod;
                //console.log(seasonLength);
                for (i in json.members) {

                    leagueMember = new LeagueMember();
                    let member = json.members[i];

                    leagueMember.memberFirstName = member.firstName;
                    leagueMember.memberLastName = member.lastName;
                    leagueMember.memberID = member.id;

                    for (x in teams) {
                        if (teams[x].primaryOwner == leagueMember.memberID) {
                            let curTeam = teams[x];
                            leagueMember.teamLocation = curTeam.location;
                            leagueMember.teamNickname = curTeam.nickname;
                            leagueMember.teamAbbrev = curTeam.abbrev;
                            leagueMember.division = curTeam.divisionId;
                            leagueMember.teamID = curTeam.id;
                            leagueMember.transactions = curTeam.transactionCounter;
                            leagueMember.logoURL = curTeam.logo;
                            leagueMember.record = curTeam.record;
                            leagueMember.leagueName = json.id;
                            leagueMember.finalStanding = curTeam.rankCalculatedFinal;
                            year.members.push(leagueMember);
                        }
                    }





                }
            });


            //gets league settings
            myXhr('get', {
                path: 'apis/v3/games/ffl/seasons/2018/segments/0/leagues/' + leagueID + '?view=mSettings'
            }, '').done(function (json) {
                //console.log(json);
                year.regularSeasonMatchupCount = json.settings.scheduleSettings.matchupPeriodCount;
                year.divisions = json.settings.scheduleSettings.divisions;
                year.draftOrder = json.settings.draftSettings.pickOrder;
                year.totalMatchupCount = json.status.finalScoringPeriod;
                year.lineupSlotCount = Object.entries(json.settings.rosterSettings.lineupSlotCounts);
                year.leagueName = json.settings.name;
                //console.log(Object.entries(json.settings.rosterSettings.lineupSlotCounts));
                for (g in year.lineupSlotCount) {
                    if (year.lineupSlotCount[g][1] == 0) {
                        year.lineupSlotCount.splice(g, 1);
                    }
                }
                for (k in year.lineupSlotCount) {
                    if (year.lineupSlotCount[k][1] == 0) {
                        year.lineupSlotCount.splice(k, 1);
                    }
                }
                for (k in year.lineupSlotCount) {
                    if (year.lineupSlotCount[k][1] == 0) {
                        year.lineupSlotCount.splice(k, 1);
                    }
                }
                for (k in year.lineupSlotCount) {
                    if (year.lineupSlotCount[k][1] == 0) {
                        year.lineupSlotCount.splice(k, 1);
                    }
                }
            });


            //console.log(seasonLength);
            //'apis/v3/games/ffl/seasons/2018/segments/0/leagues/340734?view=mMatchupScore&teamId=1&scoringPeriodId=1' for telling if a game is a playoff game
            var activeLineupSlots = [];
            for (a in year.lineupSlotCount) {
                if (year.lineupSlotCount[a][0] != 21 && year.lineupSlotCount[a][0] != 20) {
                    //console.log(year.lineupSlotCount[a][0]);
                    activeLineupSlots.push(year.lineupSlotCount[a]);
                }
            }

            function Week() {
                this.leagueID = "";
                this.memberID = "";
                this.teamID = "";
                this.opponentTeamID = "";
                this.activePlayers = [];
                this.benchPlayers = [];
                this.irPlayers = [];
                this.activeScore = 0;
                this.benchScore = 0;
                this.projectedScore = 0;
                this.weekNumber = "";
                this.regularSeason = false;
                this.opponentActiveScore = 0;
                this.opponentProjectedScore = 0;
                this.opponentActivePlayers = [];
                this.opponentBenchPlayers = [];
                this.optimalLineup = [];
                this.potentialPoints = 0;
                this.potentialPointsDifference;
                this.activeLineupSlots = activeLineupSlots;
            }

            //console.log(activeLineupSlots);
            for (q = 1; q <= 16; q++) {
                //console.log("getting players");
                //console.log(year.leagueID);
                myXhr('get', {
                    path: 'apis/v3/games/ffl/seasons/2018/segments/0/leagues/' + leagueID + '?view=mScoreboard&teamId=1&scoringPeriodId=' + q
                }, '').done(function (json) {
                    //console.log('apis/v3/games/ffl/seasons/' + year.seasonID + '/segments/0/leagues/' + year.leagueID + '?view=mScoreboard&teamId=1&scoringPeriodId=' + q);
                    // console.log("ScoringPeriodID: " + q);
                    // console.log(json);

                    for (i in json.schedule) { //increments through each matchup
                        let curWeek = json.schedule[i];
                        //console.log(curWeek);
                        if (curWeek.home.rosterForCurrentScoringPeriod != null || curWeek.home.rosterForCurrentScoringPeriod != undefined) { //checks if the roster data is available for scraping
                            let week = new Week(); //creates a new week object to store stats
                            week.leagueID = 340734;
                            week.teamID = curWeek.home.teamId;
                            week.weekNumber = q;
                            week.teamSlots = year.lineupSlotCount;
                            let weekTotalScore = 0;
                            //week.activeLineupSlots = activeLineupSlots;
                            //week.activeScore = curWeek.home.totalPoints;
                            for (z in curWeek.home.rosterForCurrentScoringPeriod.entries) {

                                let curPlayer = curWeek.home.rosterForCurrentScoringPeriod.entries[z];
                                let player = new Player();
                                
                                player.firstName = curPlayer.playerPoolEntry.player.firstName;
                                player.lastName = curPlayer.playerPoolEntry.player.lastName;
                                player.fullName = curPlayer.playerPoolEntry.player.fullName;
                                player.actualScore = Math.round((curPlayer.playerPoolEntry.appliedStatTotal) * 100) / 100;
                                weekTotalScore += player.actualScore;
                                //console.log(curPlayer);
                                if (curPlayer.playerPoolEntry.player.stats.length == 0) {
                                    player.projectedScore = 0;
                                } else if (curPlayer.playerPoolEntry.player.stats[1] == undefined) {
                                    player.projectedScore = 0;
                                } else if (curPlayer.playerPoolEntry.player.stats[1].statSourceId == 1) {
                                    player.projectedScore = Math.round((curPlayer.playerPoolEntry.player.stats[1].appliedTotal) * 100) / 100;
                                } else {
                                    player.projectedScore = Math.round((curPlayer.playerPoolEntry.player.stats[0].appliedTotal) * 100) / 100;
                                }

                                player.eligibleSlots = curPlayer.playerPoolEntry.player.eligibleSlots;
                                player.position = getPosition(curPlayer.playerPoolEntry.player.eligibleSlots);
                                player.realTeamID = curPlayer.playerPoolEntry.player.proTeamId;
                                player.jerseyNumber = curPlayer.playerPoolEntry.player.jersey;
                                player.playerID = curPlayer.playerId;
                                player.lineupSlotID = curPlayer.lineupSlotId;
                                //player.gameStats = curPlayer.playerPoolEntry.player.stats;
                                player.lineupSlot = getLineupSlot(player.lineupSlotID);
                                //console.log(player);
                                if (player.lineupSlotID == 21) {
                                    week.irPlayers.push(player);
                                } else if (player.lineupSlotID == 20) {
                                    week.benchPlayers.push(player);
                                } else {
                                    week.activePlayers.push(player);
                                }
                            }
                            week.activeScore = weekTotalScore;
                            week.projectedScore = getProjectedScore(week.activePlayers);


                            if (curWeek.away != null || curWeek.away != undefined) { //sets opponent stats if there is an opponent
                                week.opponentTeamID = curWeek.away.teamId;
                                week.opponentActiveScore = curWeek.away.totalPoints;

                            } else {
                                week.opponentTeamID = "Bye Week";
                                week.opponentActiveScore = null;
                            }

                            for (h in year.members) {
                                if (year.members[h].teamID == week.teamID) {
                                    year.members[h].pastWeeks.push(week);
                                }
                            }

                            if (curWeek.away != null && curWeek.away != undefined) {
                                let weekTotalScore = 0
                                week = new Week(); //resets the week to do add the away team
                                week.leagueID = 340734;
                                week.weekNumber = q;
                                week.teamID = curWeek.away.teamId;
                                //week.activeScore = curWeek.away.totalPoints;
                                for (l in curWeek.away.rosterForCurrentScoringPeriod.entries) {
                                    let curPlayer = curWeek.away.rosterForCurrentScoringPeriod.entries[l];
                                    let player = new Player();
                                    player.firstName = curPlayer.playerPoolEntry.player.firstName;
                                    player.lastName = curPlayer.playerPoolEntry.player.lastName;
                                    player.fullName = curPlayer.playerPoolEntry.player.fullName;
                                    
                                    player.actualScore = Math.round((curPlayer.playerPoolEntry.appliedStatTotal) * 100) / 100;
                                    weekTotalScore += player.actualScore;
                                    if (curPlayer.playerPoolEntry.player.stats.length == 0) {
                                        player.projectedScore = 0;
                                    } else if (curPlayer.playerPoolEntry.player.stats[1] == undefined) {
                                        player.projectedScore = 0;
                                    } else if (curPlayer.playerPoolEntry.player.stats[1].statSourceId == 1) {
                                        player.projectedScore = Math.round((curPlayer.playerPoolEntry.player.stats[1].appliedTotal) * 100) / 100;
                                    } else {
                                        player.projectedScore = Math.round((curPlayer.playerPoolEntry.player.stats[0].appliedTotal) * 100) / 100;
                                    }

                                    player.eligibleSlots = curPlayer.playerPoolEntry.player.eligibleSlots;
                                    player.position = getPosition(curPlayer.playerPoolEntry.player.eligibleSlots);
                                    player.realTeamID = curPlayer.playerPoolEntry.player.proTeamId;
                                    player.jerseyNumber = curPlayer.playerPoolEntry.player.jersey;
                                    player.playerID = curPlayer.playerId;
                                    player.lineupSlotID = curPlayer.lineupSlotId;
                                    //player.gameStats = curPlayer.playerPoolEntry.player.stats;
                                    player.lineupSlot = getLineupSlot(player.lineupSlotID);
                                    //console.log(player);
                                    if (player.lineupSlotID == 21) {
                                        week.irPlayers.push(player);
                                    } else if (player.lineupSlotID == 20) {
                                        week.benchPlayers.push(player);
                                    } else {
                                        week.activePlayers.push(player);
                                    }
                                }
                                week.activeScore = weekTotalScore;
                                week.projectedScore = getProjectedScore(week.activePlayers);
                                week.opponentTeamID = curWeek.home.teamId;
                                week.opponentActiveScore = curWeek.home.totalPoints;

                                for (h in year.members) {
                                    if (year.members[h].teamID == week.teamID) {
                                        year.members[h].pastWeeks.push(week);
                                    }
                                }
                            }


                        } else {
                            //console.log("incremented week");
                        }

                    }

                    myYear = year;
                });
                myYear = year;
            }
            myYear = year;


            for (j in myYear.members) {
                var totalPF = 0;
                var totalPA = 0;
                let curMember = myYear.members[j];
                //console.log(curMember);
                for (y in curMember.pastWeeks) {
                    myYear.members[j].pastWeeks[y].memberID = curMember.memberID;
                    let opID = myYear.members[j].pastWeeks[y].opponentTeamID;
                    totalPF += calcRosterScore(myYear.members[j].pastWeeks[y].activePlayers);
                    myYear.members[j].pastWeeks[y].activeScore = calcRosterScore(myYear.members[j].pastWeeks[y].activePlayers);

                    if (opID == "Bye Week") {
                        myYear.members[j].pastWeeks[y].opponentProjectedScore = null;
                        myYear.members[j].pastWeeks[y].opponentActivePlayers = null;
                        myYear.members[j].pastWeeks[y].opponentBenchPlayers = null;
                    } else {
                        
                        let op = getMember(myYear, opID);
                        opProjScore = getProjectedScore(op.pastWeeks[y].activePlayers);
                        opActivePlayers = op.pastWeeks[y].activePlayers;
                        opBenchPlayers = op.pastWeeks[y].benchPlayers;
                        opIRPlayers = op.pastWeeks[y].irPlayers;
                        myYear.members[j].pastWeeks[y].opponentProjectedScore = opProjScore;
                        myYear.members[j].pastWeeks[y].opponentActivePlayers = opActivePlayers;
                        myYear.members[j].pastWeeks[y].opponentBenchPlayers = opBenchPlayers;
                        myYear.members[j].pastWeeks[y].opponentIRPlayers = opIRPlayers;
                        myYear.members[j].pastWeeks[y].opponentActiveScore =  calcRosterScore(myYear.members[j].pastWeeks[y].opponentActivePlayers);
                        totalPA += calcRosterScore(myYear.members[j].pastWeeks[y].opponentActivePlayers);
                    }

                    for (var n = 0; n < myYear.regularSeasonMatchupCount; n++) {
                        myYear.members[j].pastWeeks[n].regularSeason = true;
                    }





                }
                myYear.members[j].completeSeasonPoints = totalPF;
                myYear.members[j].completeSeasonPointsAgainst = totalPA;
                myYear.members[j].postSeasonPF = Math.round((myYear.members[j].completeSeasonPoints - myYear.members[j].record.overall.pointsFor) * 100) / 100;


            }

            for (s in myYear.members) {
                // myYear.members[s].completeSeasonPoints = 0;
                // myYear.members[s].postSeasonPF = 0;
                // myYear.members.completeSeasonPointsAgainst
                for (e in myYear.members[s].pastWeeks) {
                    myYear.members[s].pastWeeks[e].optimalLineup = getOptimalLineup(myYear.members[s].pastWeeks[e]);
                    if (getOptimalLineup(myYear.members[s].pastWeeks[e]).length == 0) {
                        // console.log("ERROR");
                        // console.log("Problem with " + myYear.members[s].firstName + " at week " + myYear.members[s].pastWeeks[e].weekNumber);
                    }
                    myYear.members[s].pastWeeks[e].potentialPoints = getPPoints(myYear.members[s].pastWeeks[e].optimalLineup);
                    // console.log(getPPoints(myYear.members[s].pastWeeks[e].optimalLineup));
                    // console.log(myYear.members[s].pastWeeks[e].optimalLineup);
                    myYear.members[s].pastWeeks[e].potentialPointsDifference = myYear.members[s].pastWeeks[e].potentialPoints - myYear.members[s].pastWeeks[e].activeScore;
                }
            }
            //console.log("myYear");
            //console.log(JSON.stringify(myYear));
            localStorage.setItem(myYear.leagueID + "" + myYear.seasonID, JSON.stringify(myYear));

        }


        //myYear = year;
        document.getElementById("my-navbar-brand").innerHTML = myYear.leagueName;
        //console.log(myYear);
        //$.post( "js/data.php", { leagueID: myYear.leagueID, season: myYear.seasonID, leagueObject: myYear } );
        setPage(myYear);
    }



});

function myXhr(t, d, id) {
    return $.ajax({
        type: t,
        url: 'js/proxy.php',
        dataType: 'json',
        data: d,
        cache: false,
        async: false,
    })
}

function calcRosterScore(activePlayers){
    var points = 0;
    for (i = 0; i < activePlayers.length; i++){
        points += activePlayers[i].actualScore;
    }

    return points;
}