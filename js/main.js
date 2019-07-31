var myLeague;
var myYear;

$(document).ready(function () {
    //leagueID = 340734;
    // document.getElementById("content-wrapper").onscroll = function () {
    //     console.log("triggered");
    //     scrollup()
    //   };
  
      
    var input = prompt("Please enter ESPN League ID", "2319896");
    var r = confirm("If you have not visited the league you entered this will take a few seconds to load while the data is gathered\nGood things come to those who wait!");

    if (input != null && r == true) {
        leagueID = input;
        if (localStorage.getItem(leagueID + "2018")) {
            myYear = JSON.parse(localStorage.getItem(leagueID + "2018"));
        } else {
            localStorage.clear();
            var league = new League();
            var season = new Season();
            season.seasonID = "2018";
            season.leagueID = leagueID;
            season.matchups = [];
            myXhr('get', {
                path: 'apis/v3/games/ffl/seasons/2018/segments/0/leagues/' + leagueID + '?view=mTeam'
            }, '').done(function (json) {
                league.id = json.id;
                season.leagueID = json.id;
                var teams = json.teams;
                seasonLength = json.status.finalScoringPeriod;
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
                            season.members.push(leagueMember);
                        }
                    }
                }
            });

            myXhr('get', {
                path: 'apis/v3/games/ffl/seasons/2018/segments/0/leagues/' + leagueID + '?view=mSettings'
            }, '').done(function (json) {
                //console.log(json);
                season.regularSeasonMatchupCount = json.settings.scheduleSettings.matchupPeriodCount;
                season.divisions = json.settings.scheduleSettings.divisions;
                season.draftOrder = json.settings.draftSettings.pickOrder;
                season.totalMatchupCount = json.status.finalScoringPeriod;
                season.lineupSlotCount = Object.entries(json.settings.rosterSettings.lineupSlotCounts);
                season.leagueName = json.settings.name;
                for (g in season.lineupSlotCount) {
                    if (season.lineupSlotCount[g][1] == 0) {
                        season.lineupSlotCount.splice(g, 1);
                    }
                }
                for (k in season.lineupSlotCount) {
                    if (season.lineupSlotCount[k][1] == 0) {
                        season.lineupSlotCount.splice(k, 1);
                    }
                }
                for (k in season.lineupSlotCount) {
                    if (season.lineupSlotCount[k][1] == 0) {
                        season.lineupSlotCount.splice(k, 1);
                    }
                }
                for (k in season.lineupSlotCount) {
                    if (season.lineupSlotCount[k][1] == 0) {
                        season.lineupSlotCount.splice(k, 1);
                    }
                }
            });

            //'apis/v3/games/ffl/seasons/2018/segments/0/leagues/340734?view=mMatchupScore&teamId=1&scoringPeriodId=1' for telling if a game is a playoff game
            
            var activeLineupSlots = [];
            for (a in season.lineupSlotCount) {
                if (season.lineupSlotCount[a][0] != 21 && season.lineupSlotCount[a][0] != 20) {
                    //console.log(year.lineupSlotCount[a][0]);
                    activeLineupSlots.push(season.lineupSlotCount[a]);
                }
            }
            
            myYear = season;

            // for (var j = 0; j < myYear.matchups.length; j++) {
            //     var totalPF = 0;
            //     var totalPA = 0;
            //     let curMember = myYear.members[j];
            //     //console.log(curMember);
            //     for (var y = 0; y < myYear.matchups.length; y++) {
            //         myYear.members[j].pastWeeks[y].memberID = curMember.memberID;
            //         let opID = myYear.members[j].pastWeeks[y].opponentTeamID;
            //         totalPF += calcRosterScore(myYear.members[j].pastWeeks[y].activePlayers);
            //         myYear.members[j].pastWeeks[y].activeScore = calcRosterScore(myYear.members[j].pastWeeks[y].activePlayers);

            //         if (opID == "Bye Week") {
            //             myYear.members[j].pastWeeks[y].opponentProjectedScore = null;
            //             myYear.members[j].pastWeeks[y].opponentActivePlayers = null;
            //             myYear.members[j].pastWeeks[y].opponentBenchPlayers = null;
            //         } else {
                        
            //             let op = getMember(myYear, opID);
            //             opProjScore = getProjectedScore(op.pastWeeks[y].activePlayers);
            //             opActivePlayers = op.pastWeeks[y].activePlayers;
            //             opBenchPlayers = op.pastWeeks[y].benchPlayers;
            //             opIRPlayers = op.pastWeeks[y].irPlayers;
            //             myYear.members[j].pastWeeks[y].opponentProjectedScore = opProjScore;
            //             myYear.members[j].pastWeeks[y].opponentActivePlayers = opActivePlayers;
            //             myYear.members[j].pastWeeks[y].opponentBenchPlayers = opBenchPlayers;
            //             myYear.members[j].pastWeeks[y].opponentIRPlayers = opIRPlayers;
            //             myYear.members[j].pastWeeks[y].opponentActiveScore =  calcRosterScore(myYear.members[j].pastWeeks[y].opponentActivePlayers);
            //             totalPA += calcRosterScore(myYear.members[j].pastWeeks[y].opponentActivePlayers);
            //         }

            //         for (var n = 0; n < myYear.regularSeasonMatchupCount; n++) {
            //             myYear.members[j].pastWeeks[n].regularSeason = true;
            //         }

            //     }
            //     myYear.members[j].completeSeasonPoints = totalPF;
            //     myYear.members[j].completeSeasonPointsAgainst = totalPA;
            //     myYear.members[j].postSeasonPF = roundToHundred(myYear.members[j].completeSeasonPoints - myYear.members[j].record.overall.pointsFor);


            //}

            // for (s in myYear.members) {

            //     for (e in myYear.members[s].pastWeeks) {
            //         myYear.members[s].pastWeeks[e].optimalLineup = getOptimalLineup(myYear.members[s].pastWeeks[e]);
            //         if (getOptimalLineup(myYear.members[s].pastWeeks[e]).length == 0) {

            //         }
            //         myYear.members[s].pastWeeks[e].potentialPoints = getPPoints(myYear.members[s].pastWeeks[e].optimalLineup);

            //         myYear.members[s].pastWeeks[e].potentialPointsDifference = myYear.members[s].pastWeeks[e].potentialPoints - myYear.members[s].pastWeeks[e].activeScore;
            //     }
            // }
            
            localStorage.setItem(myYear.leagueID + "" + myYear.seasonID, JSON.stringify(myYear));

        }
        console.log(myYear);
        document.getElementById("my-navbar-brand").innerHTML = myYear.leagueName;
        document.getElementById("my-navbar-brand").onclick = function () {
            $(".nav-link").removeClass('active');
        };
        myYear.members = setPowerRankings(myYear.members);
        setPage(myYear);
    }

});

function getMatchups(league){

    for (q = 1; q <= 16; q++) {
        myXhr('get', {
            path: 'apis/v3/games/ffl/seasons/2018/segments/0/leagues/' + league.leagueID + '?view=mScoreboard&teamId=1&scoringPeriodId=' + q
        }, '').done(function (json) {

            for (i in json.schedule) { //increments through each matchup
                let curWeek = json.schedule[i];
                if (curWeek.home.rosterForCurrentScoringPeriod != null || curWeek.home.rosterForCurrentScoringPeriod != undefined) { //checks if the roster data is available for scraping
                    var homeTeamID = curWeek.home.teamId;
                    var homePlayers = [];
                    for (z in curWeek.home.rosterForCurrentScoringPeriod.entries) {
                        //(firstName, lastName, score, projectedScore, position, realTeamID, playerID, lineupSlotID
                        let curPlayer = curWeek.home.rosterForCurrentScoringPeriod.entries[z];
                        
                        let firstName = curPlayer.playerPoolEntry.player.firstName;
                        let lastName = curPlayer.playerPoolEntry.player.lastName;
                        let score = roundToHundred(curPlayer.playerPoolEntry.appliedStatTotal);
                        //console.log(curPlayer);
                        let projectedScore = 0;
                        if (curPlayer.playerPoolEntry.player.stats.length == 0) {
                            projectedScore = 0;
                        } else if (curPlayer.playerPoolEntry.player.stats[1] == undefined) {
                            projectedScore = 0;
                        } else if (curPlayer.playerPoolEntry.player.stats[1].statSourceId == 1) {
                            projectedScore = roundToHundred(curPlayer.playerPoolEntry.player.stats[1].appliedTotal);
                        } else {
                            projectedScore = roundToHundred(curPlayer.playerPoolEntry.player.stats[0].appliedTotal);
                        }

                        let eligibleSlots = curPlayer.playerPoolEntry.player.eligibleSlots;
                        let position = getPosition(curPlayer.playerPoolEntry.player.eligibleSlots);
                        let realTeamID = curPlayer.playerPoolEntry.player.proTeamId;
                        let playerID = curPlayer.playerId;
                        let lineupSlotID = curPlayer.lineupSlotId;
                        homePlayers.push(new Player(firstName, lastName, score, projectedScore, position, realTeamID, playerID, lineupSlotID, eligibleSlots, q));
                    }

                    var homeTeam = new Team(homeTeamID, homePlayers, activeLineupSlots);
                    var awayTeam = undefined;
                    if (curWeek.away != null && curWeek.away != undefined) {
                        var awayTeamID = curWeek.away.teamId;
                        var awayPlayers = [];
                        for (l in curWeek.away.rosterForCurrentScoringPeriod.entries) {
                            let curPlayer = curWeek.away.rosterForCurrentScoringPeriod.entries[l];
                            let firstName = curPlayer.playerPoolEntry.player.firstName;
                            let lastName = curPlayer.playerPoolEntry.player.lastName;
                            let score = roundToHundred(curPlayer.playerPoolEntry.appliedStatTotal);
                            //console.log(curPlayer);
                            let projectedScore = 0;
                            if (curPlayer.playerPoolEntry.player.stats.length == 0) {
                                projectedScore = 0;
                            } else if (curPlayer.playerPoolEntry.player.stats[1] == undefined) {
                                projectedScore = 0;
                            } else if (curPlayer.playerPoolEntry.player.stats[1].statSourceId == 1) {
                                projectedScore = roundToHundred(curPlayer.playerPoolEntry.player.stats[1].appliedTotal);
                            } else {
                                projectedScore = roundToHundred(curPlayer.playerPoolEntry.player.stats[0].appliedTotal);
                            }

                            let eligibleSlots = curPlayer.playerPoolEntry.player.eligibleSlots;
                            let position = getPosition(curPlayer.playerPoolEntry.player.eligibleSlots);
                            let realTeamID = curPlayer.playerPoolEntry.player.proTeamId;
                            let playerID = curPlayer.playerId;
                            let lineupSlotID = curPlayer.lineupSlotId;
                            awayPlayers.push(new Player(firstName, lastName, score, projectedScore, position, realTeamID, playerID, lineupSlotID, eligibleSlots, q));
                        }
                        awayTeam = new Team(awayTeamID, awayPlayers, activeLineupSlots);
                    }
                    let isPlayoff = (q > league.regularSeasonMatchupCount);
                    league.matchups.push(new Matchup(homeTeam, awayTeam, q, isPlayoff));
                }
            }
            
        });
    }
}

function getMembers(){

}

function getLeague(){

}

function getDraft(){

}

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

