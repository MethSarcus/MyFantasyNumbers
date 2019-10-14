enum SEASON_PORTION {
    REGULAR = "Regular Season",
    POST = "Post-Season",
    ALL = "Complete Season",
}

enum PLATFORM {
    SLEEPER,
    ESPN,
    NFL,
    YAHOO,
}

enum DRAFT_TYPE {
    AUCTION,
    SNAKE,
    LINEAR,
}

enum LEAGUE_TYPE {
    DYNASTY,
    REDRAFT,
}

enum SCORING_TYPE {
    STANDARD,
    HALF_PPR,
    FULL_PPR,
}

enum POSITION {
    QB = "QB",
    RB = "RB",
    WR = "WR",
    TE = "TE",
    K = "K",
    D_ST = "DEF",
    DL = "DL",
    DT = "DT",
    LB = "LB",
    DB = "DB",
    DE = "DE",
    DP = "DP",
    LT = "LT",
    CB = "CB",
    S = "S",
    P = "P",
    HC = "HC"
}

function getPosition(eligibleSlots: number[]): POSITION {
    if (eligibleSlots[0] === 0) {
        return POSITION.QB;
    } else if (eligibleSlots[0] === 2) {
        return POSITION.RB;
    } else if (eligibleSlots[0] === 3) {
        return POSITION.WR;
    } else if (eligibleSlots[0] === 16) {
        return POSITION.D_ST;
    } else if (eligibleSlots[0] === 17) {
        return POSITION.K;
    } else if (eligibleSlots[0] === 5) {
        return POSITION.TE;
    } else if (eligibleSlots[0] === 8) {
        return POSITION.DT;
    } else if (eligibleSlots[0] === 9) {
        return POSITION.DE;
    } else if (eligibleSlots[0] === 10) {
        return POSITION.LB;
    } else if (eligibleSlots[0] === 11) {
        return POSITION.DL;
    } else if (eligibleSlots[0] === 12) {
        return POSITION.CB;
    } else if (eligibleSlots[0] === 13) {
        return POSITION.S;
    } else if (eligibleSlots[0] === 14) {
        return POSITION.DB;
    } else if (eligibleSlots[0] === 15) {
        return POSITION.DP;
    } else if (eligibleSlots[0] === 18) {
        return POSITION.P;
    } else if (eligibleSlots[0] === 19) {
        return POSITION.HC;
    }
}

function getLineupSlot(lineupSlotID: number): string {
    switch(lineupSlotID) {
        case 0: {
            return "QB";
        }
        case 1: {
            return "TQB";
        }
        case 2: {
            return "RB";
        }
        case 3: {
            return "RB/WR";
        }
        case 4: {
            return "WR";
        }
        case 5: {
            return "WR/TE";
        }
        case 6: {
            return "TE";
        }
        case 7: {
            return "OP";
        }
        case 8: {
            return "DT";
        }
        case 9: {
            return "DE";
        }
        case 10: {
            return "LB";
        }
        case 11: {
            return "DL";
        }
        case 12: {
            return "CB";
        }
        case 13: {
            return "S";
        }
        case 14: {
            return "DB";
        }
        case 15: {
            return "DP";
        }
        case 16: {
            return "DEF";
        }
        case 17: {
            return "K";
        }
        case 18: {
            return "P";
        }
        case 19: {
            return "HC";
        }
        case 20: {
            return "BENCH";
        }
        case 21: {
            return "IR";
        }
        case 23: {
            return "FLEX";
        }
    }
}

function includesPlayer(player: Player, lineup: Player[]): boolean {
    var includes = false;
    lineup.forEach((element) => {
        if (player.playerID == element.playerID) {
            includes = true;
        }
    });
    return includes;
}

function calcStandardDeviation (scores: number[]): number {
    var modified = [];
    var mean = getMean(scores);
    scores.forEach((score) =>{
        modified.push(Math.pow(score - mean, 2));
    });

    return roundToHundred(Math.sqrt(getMean(modified)));
}

function getMean(numbers: number[]): number {
    var sum = 0;
    numbers.forEach(num => {
        sum += num;
    });

    return roundToHundred(sum/numbers.length);
}

function getBestLeastConsistent(league: League, teamID: number): SeasonPlayer[] {
    var players = getSeasonPlayers(league, teamID);
    var minSampleSize = 5;
    if (league.settings.isActive) {
        if (league.settings.currentMatchupPeriod <= 5) {
            minSampleSize = league.settings.currentMatchupPeriod - 1;
        }
    }
    var mostConsistentPlayers = players.filter(function (player: SeasonPlayer) {
        return (player.weeksPlayed >= minSampleSize);
    });
    while (mostConsistentPlayers.length == 0) {
        minSampleSize -= 1;
        mostConsistentPlayers = players.filter(function (player: SeasonPlayer) {
            return (player.weeksPlayed >= minSampleSize);
        });
    }
    var mvp = players[0];
    var lvp = players[0];
    var mostConsistent = mostConsistentPlayers[0];
    players.forEach((seasonPlayer) => {
        if (seasonPlayer.seasonScore > mvp.seasonScore) {
            mvp = seasonPlayer;
        }
        if (seasonPlayer.seasonScore < lvp.seasonScore) {
            lvp = seasonPlayer;
        }
    });
    

    mostConsistentPlayers.forEach((seasonPlayer) => {
        if (calcStandardDeviation(seasonPlayer.getScores()) < calcStandardDeviation(mostConsistent.getScores()) &&
        seasonPlayer.weeksPlayed >= minSampleSize && seasonPlayer.seasonScore != 0) {
            mostConsistent = seasonPlayer;
        }
    });

    return [mvp, lvp, mostConsistent];
}

function getMVP(league: League, teamID: number): SeasonPlayer {
    var players = getSeasonPlayers(league, teamID);
    var mvp = players[0];
    players.forEach((seasonPlayer) => {
        if (seasonPlayer.seasonScore > mvp.seasonScore) {
            mvp = seasonPlayer;
        }
    });

    return mvp;
}

function getLVP(league: League, teamID: number): SeasonPlayer {
    var players = getSeasonPlayers(league, teamID);
    var lvp = players[0];
    players.forEach((seasonPlayer) => {
        if (seasonPlayer.seasonScore == lvp.seasonScore) {
            if (seasonPlayer.weeksPlayed > lvp.weeksPlayed) {
                lvp = seasonPlayer;
            }
        } else if (seasonPlayer.seasonScore < lvp.seasonScore) {
            lvp = seasonPlayer;
        }
    });

    return lvp;
}

function getSeasonPlayers(league: League, teamID: number): SeasonPlayer[] {
    var players = [];
    league.getSeasonPortionWeeks().forEach((week) => {
        week.getTeam(teamID).lineup.forEach((player) => {
            var index = players.findIndex((existingPlayer) => 
                existingPlayer.playerID == player.playerID
            );
            if (index > -1) {
                players[index].addPerformance(player);
                } else {
                    players.push(new SeasonPlayer(player, league.leaguePlatform));
            }
        });
    });

    return players;
}

function getSeasonOpponentPlayers(league: League, teamID: number): SeasonPlayer[] {
    var players = [];
    league.getSeasonPortionWeeks().forEach((week) => {
        if (!week.getTeamMatchup(teamID).byeWeek) {
            week.getTeamMatchup(teamID).getOpponent(teamID).lineup.forEach((player) => {
                var index = players.findIndex((existingPlayer) => 
                    existingPlayer.playerID == player.playerID
                );
                if (index > -1) {
                    players[index].addPerformance(player);
                    } else {
                        players.push(new SeasonPlayer(player, league.leaguePlatform));
                }
            });
        }
    });

    return players;
}

function getAllSeasonPlayers(league: League): SeasonPlayer[] {
    var players = [];
    league.getSeasonPortionWeeks().forEach((week) => {
        week.matchups.forEach(matchup => {
            matchup.home.lineup.forEach((player) => {
                var index = players.findIndex((existingPlayer) => 
                    existingPlayer.playerID == player.playerID
                );
                if (index > -1) {
                    players[index].addPerformance(player);
                    } else {
                        players.push(new SeasonPlayer(player, league.leaguePlatform));
                }
            });
            if (!matchup.byeWeek) {
                matchup.away.lineup.forEach((player) => {
                    var index = players.findIndex((existingPlayer) => 
                        existingPlayer.playerID == player.playerID
                    );
                    if (index > -1) {
                        players[index].addPerformance(player);
                        } else {
                            players.push(new SeasonPlayer(player, league.leaguePlatform));
                    }
                });
            }
        });
    });

    return players;
}

function getBestPositionPlayerAverageScore(league: League, position: any): number {
    var players = [];
    league.getSeasonPortionWeeks().forEach((week) => {
        players.push(week.getBestPositionPlayer(position));
    });
    var totalScore = 0;
    players.forEach(player => {
        if (player != undefined) {
            totalScore += player.score;
        }
    });

    return roundToTen(totalScore/players.length);
}

function getMemberColor(memberID: number): string {
    var colorCode = ["#3366cc","#dc3912","#ff9900","#109618","#990099","#0099c6","#dd4477","#66aa00","#b82e2e","#316395",
    "#3366cc","#994499","#22aa99","#aaaa11","#6633cc","#e67300","#8b0707","#651067","#329262","#5574a6","#3b3eac",
    "#b77322","#16d620","#b91383","#f4359e","#9c5935","#a9c413","#2a778d","#668d1c","#bea413","#0c5922","#743411"];

    return colorCode[memberID];
}

//Params: Int, team ID
//Returns: String, Team Abbreviation
function getRealTeamInitials(realteamID) {
    var team = realteamID;
    //console.log(realteamID);
    switch (realteamID) {
        case 1:
            team = "Atl";
            break;
        case 2:
            team = "Buf";
            break;
        case 3:
            team = "Chi";
            break;
        case 4:
            team = "Cin";
            break;
        case 5:
            team = "Cle";
            break;
        case 6:
            team = "Dal";
            break;
        case 7:
            team = "Den";
            break;
        case 8:
            team = "Det";
            break;
        case 9:
            team = "GB";
            break;
        case 10:
            team = "Ten";
            break;
        case 11:
            team = "Ind";
            break;
        case 12:
            team = "KC";
            break;
        case 13:
            team = "Oak";
            break;
        case 14:
            team = "Lar";
            break;
        case 15:
            team = "Mia";
            break;
        case 16:
            team = "Min";
            break;
        case 17:
            team = "NE";
            break;
        case 18:
            team = "NO";
            break;
        case 19:
            team = "NYG";
            break;
        case 20:
            team = "NYJ";
            break;
        case 21:
            team = "Phi";
            break;
        case 22:
            team = "Ari";
            break;
        case 23:
            team = "Pit";
            break;
        case 24:
            team = "LAC";
            break;
        case 25:
            team = "SF";
            break;
        case 26:
            team = "Sea";
            break;
        case 27:
            team = "TB";
            break;
        case 28:
            team = "Wsh";
            break;
        case 29:
            team = "Car";
            break;
        case 30:
            team = "Jax";
            break;
        case 33:
            team = "Bal";
            break;
        case 34:
            team = "Hou";
            break;
    }
    return team;
}

function espn_request(t, d) {
    return $.ajax({
        type: t,
        url: 'js/proxy/espn_proxy.php',
        dataType: 'json',
        data: d,
        cache: false,
        async: true,
    })
}

function sleeper_request(t, d) {
    return $.ajax({
        type: t,
        url: 'js/proxy/sleeper_proxy.php',
        dataType: 'json',
        data: d,
        cache: false,
        async: true,
    })
}