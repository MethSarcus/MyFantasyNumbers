var SEASON_PORTION;
(function (SEASON_PORTION) {
    SEASON_PORTION["REGULAR"] = "Regular Season";
    SEASON_PORTION["POST"] = "Post-Season";
    SEASON_PORTION["ALL"] = "Complete Season";
})(SEASON_PORTION || (SEASON_PORTION = {}));
var DRAFT_TYPE;
(function (DRAFT_TYPE) {
    DRAFT_TYPE[DRAFT_TYPE["AUCTION"] = 0] = "AUCTION";
    DRAFT_TYPE[DRAFT_TYPE["SNAKE"] = 1] = "SNAKE";
    DRAFT_TYPE[DRAFT_TYPE["LINEAR"] = 2] = "LINEAR";
})(DRAFT_TYPE || (DRAFT_TYPE = {}));
var LEAGUE_TYPE;
(function (LEAGUE_TYPE) {
    LEAGUE_TYPE[LEAGUE_TYPE["DYNASTY"] = 0] = "DYNASTY";
    LEAGUE_TYPE[LEAGUE_TYPE["REDRAFT"] = 1] = "REDRAFT";
})(LEAGUE_TYPE || (LEAGUE_TYPE = {}));
var SCORING_TYPE;
(function (SCORING_TYPE) {
    SCORING_TYPE[SCORING_TYPE["STANDARD"] = 0] = "STANDARD";
    SCORING_TYPE[SCORING_TYPE["HALF_PPR"] = 1] = "HALF_PPR";
    SCORING_TYPE[SCORING_TYPE["FULL_PPR"] = 2] = "FULL_PPR";
})(SCORING_TYPE || (SCORING_TYPE = {}));
var POSITION;
(function (POSITION) {
    POSITION["QB"] = "QB";
    POSITION["RB"] = "RB";
    POSITION["WR"] = "WR";
    POSITION["TE"] = "TE";
    POSITION["K"] = "K";
    POSITION["D_ST"] = "D/ST";
    POSITION["DL"] = "DL";
    POSITION["DT"] = "DT";
    POSITION["LB"] = "LB";
    POSITION["DB"] = "DB";
    POSITION["DE"] = "DE";
    POSITION["DP"] = "DP";
    POSITION["LT"] = "LT";
    POSITION["CB"] = "CB";
    POSITION["S"] = "S";
    POSITION["P"] = "P";
    POSITION["HC"] = "HC";
})(POSITION || (POSITION = {}));
function getPosition(eligibleSlots) {
    if (eligibleSlots[0] === 0) {
        return POSITION.QB;
    }
    else if (eligibleSlots[0] === 2) {
        return POSITION.RB;
    }
    else if (eligibleSlots[0] === 3) {
        return POSITION.WR;
    }
    else if (eligibleSlots[0] === 16) {
        return POSITION.D_ST;
    }
    else if (eligibleSlots[0] === 17) {
        return POSITION.K;
    }
    else if (eligibleSlots[0] === 5) {
        return POSITION.TE;
    }
    else if (eligibleSlots[0] === 8) {
        return POSITION.DT;
    }
    else if (eligibleSlots[0] === 9) {
        return POSITION.DE;
    }
    else if (eligibleSlots[0] === 10) {
        return POSITION.LB;
    }
    else if (eligibleSlots[0] === 11) {
        return POSITION.DL;
    }
    else if (eligibleSlots[0] === 12) {
        return POSITION.CB;
    }
    else if (eligibleSlots[0] === 13) {
        return POSITION.S;
    }
    else if (eligibleSlots[0] === 14) {
        return POSITION.DB;
    }
    else if (eligibleSlots[0] === 15) {
        return POSITION.DP;
    }
    else if (eligibleSlots[0] === 18) {
        return POSITION.P;
    }
    else if (eligibleSlots[0] === 19) {
        return POSITION.HC;
    }
}
function getLineupSlot(lineupSlotID) {
    switch (lineupSlotID) {
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
            return "D/ST";
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
            return "RB/WR/TE";
        }
    }
}
function includesPlayer(player, lineup) {
    var includes = false;
    lineup.forEach(function (element) {
        if (player.playerID == element.playerID) {
            includes = true;
        }
    });
    return includes;
}
function calcStandardDeviation(scores) {
    var modified = [];
    var mean = getMean(scores);
    scores.forEach(function (score) {
        modified.push(Math.pow(score - mean, 2));
    });
    return roundToHundred(Math.sqrt(getMean(modified)));
}
function getMean(numbers) {
    var sum = 0;
    numbers.forEach(function (num) {
        sum += num;
    });
    return roundToHundred(sum / numbers.length);
}
function getBestLeastConsistent(league, teamID) {
    var players = getSeasonPlayers(league, teamID);
    var minSampleSize = 5;
    if (league.settings.isActive) {
        if (league.settings.currentMatchupPeriod < 5) {
            minSampleSize = league.settings.currentMatchupPeriod - 1;
        }
    }
    var mostConsistentPlayers = players.filter(function (player) {
        return (player.weeksPlayed >= minSampleSize);
    });
    var mvp = players[0];
    var lvp = players[0];
    var mostConsistent = mostConsistentPlayers[0];
    players.forEach(function (seasonPlayer) {
        if (seasonPlayer.seasonScore > mvp.seasonScore) {
            mvp = seasonPlayer;
        }
        if (seasonPlayer.seasonScore < lvp.seasonScore) {
            lvp = seasonPlayer;
        }
    });
    mostConsistentPlayers.forEach(function (seasonPlayer) {
        if (calcStandardDeviation(seasonPlayer.getScores()) < calcStandardDeviation(mostConsistent.getScores()) &&
            seasonPlayer.weeksPlayed >= minSampleSize && seasonPlayer.seasonScore != 0) {
            mostConsistent = seasonPlayer;
        }
    });
    return [mvp, lvp, mostConsistent];
}
function getMVP(league, teamID) {
    var players = getSeasonPlayers(league, teamID);
    var mvp = players[0];
    players.forEach(function (seasonPlayer) {
        if (seasonPlayer.seasonScore > mvp.seasonScore) {
            mvp = seasonPlayer;
        }
    });
    return mvp;
}
function getLVP(league, teamID) {
    var players = getSeasonPlayers(league, teamID);
    var lvp = players[0];
    players.forEach(function (seasonPlayer) {
        if (seasonPlayer.seasonScore == lvp.seasonScore) {
            if (seasonPlayer.weeksPlayed > lvp.weeksPlayed) {
                lvp = seasonPlayer;
            }
        }
        else if (seasonPlayer.seasonScore < lvp.seasonScore) {
            lvp = seasonPlayer;
        }
    });
    return lvp;
}
function getSeasonPlayers(league, teamID) {
    var players = [];
    league.getSeasonPortionWeeks().forEach(function (week) {
        week.getTeam(teamID).lineup.forEach(function (player) {
            var index = players.findIndex(function (existingPlayer) {
                return existingPlayer.playerID == player.playerID;
            });
            if (index > -1) {
                players[index].addPerformance(player);
            }
            else {
                players.push(new SeasonPlayer(player));
            }
        });
    });
    return players;
}
function getSeasonOpponentPlayers(league, teamID) {
    var players = [];
    league.getSeasonPortionWeeks().forEach(function (week) {
        if (!week.getTeamMatchup(teamID).byeWeek) {
            week.getTeamMatchup(teamID).getOpponent(teamID).lineup.forEach(function (player) {
                var index = players.findIndex(function (existingPlayer) {
                    return existingPlayer.playerID == player.playerID;
                });
                if (index > -1) {
                    players[index].addPerformance(player);
                }
                else {
                    players.push(new SeasonPlayer(player));
                }
            });
        }
    });
    return players;
}
function getAllSeasonPlayers(league) {
    var players = [];
    league.getSeasonPortionWeeks().forEach(function (week) {
        week.matchups.forEach(function (matchup) {
            matchup.home.lineup.forEach(function (player) {
                var index = players.findIndex(function (existingPlayer) {
                    return existingPlayer.playerID == player.playerID;
                });
                if (index > -1) {
                    players[index].addPerformance(player);
                }
                else {
                    players.push(new SeasonPlayer(player));
                }
            });
            if (!matchup.byeWeek) {
                matchup.away.lineup.forEach(function (player) {
                    var index = players.findIndex(function (existingPlayer) {
                        return existingPlayer.playerID == player.playerID;
                    });
                    if (index > -1) {
                        players[index].addPerformance(player);
                    }
                    else {
                        players.push(new SeasonPlayer(player));
                    }
                });
            }
        });
    });
    return players;
}
function getBestPositionPlayerAverageScore(league, position) {
    var players = [];
    league.getSeasonPortionWeeks().forEach(function (week) {
        players.push(week.getBestPositionPlayer(position));
    });
    var totalScore = 0;
    players.forEach(function (player) {
        if (player != undefined) {
            totalScore += player.score;
        }
    });
    return roundToTen(totalScore / players.length);
}
function getMemberColor(memberID) {
    var colorCode = ["#3366cc", "#dc3912", "#ff9900", "#109618", "#990099", "#0099c6", "#dd4477", "#66aa00", "#b82e2e", "#316395",
        "#3366cc", "#994499", "#22aa99", "#aaaa11", "#6633cc", "#e67300", "#8b0707", "#651067", "#329262", "#5574a6", "#3b3eac",
        "#b77322", "#16d620", "#b91383", "#f4359e", "#9c5935", "#a9c413", "#2a778d", "#668d1c", "#bea413", "#0c5922", "#743411"];
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
//# sourceMappingURL=Utils.js.map