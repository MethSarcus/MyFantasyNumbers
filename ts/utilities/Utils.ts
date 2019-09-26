enum SEASON_PORTION {
    REGULAR = "Regular Season",
    POST = "Post-Season",
    ALL = "Complete Season",
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
    D_ST = "D/ST",
    DL = "DL",
    LB = "LB",
    DB = "DB",
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
    }
}

function getLineupSlot(lineupSlotID: number): string {
    if (lineupSlotID == 0) {
        return "QB";
    } else if (lineupSlotID == 2) {
        return "RB";
    } else if (lineupSlotID == 23) {
        return "FLEX";
    } else if (lineupSlotID == 20) {
        return "BENCH";
    } else if (lineupSlotID == 7) {
        return "SUPERFLEX";
    } else if (lineupSlotID == 21) {
        return "IR";
    } else if (lineupSlotID == 4) {
        return "WR";
    } else if (lineupSlotID == 16) {
        return "D/ST";
    } else if (lineupSlotID == 17) {
        return "K";
    } else if (lineupSlotID == 6) {
        return "TE";
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
    var mostConsistentPlayers = players.filter(function (player: SeasonPlayer) {
        return (player.weeksPlayed > 5);
    });
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
        seasonPlayer.weeksPlayed > 5 && seasonPlayer.seasonScore != 0) {
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
                    players.push(new SeasonPlayer(player));
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
                        players.push(new SeasonPlayer(player));
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
                        players.push(new SeasonPlayer(player));
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
                            players.push(new SeasonPlayer(player));
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
    var team;
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