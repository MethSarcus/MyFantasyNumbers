function getOptimalLineupDepreciated(activeLineupSlots) {
    var rosterSlots = [];
    for (var i in activeLineupSlots) {
        for (var w = 0; w < activeLineupSlots[i][1]; w++) {
            rosterSlots.push(activeLineupSlots[i][0]);
        }
    }
    var optimalLineup = new Array();
    for (var x in rosterSlots) {
        var highScore = 0;
        var bestPlayer = new EmptySlot(rosterSlots[x]);
        var eligibleWeekPlayers = [];
        var players = this.lineup.concat(this.bench, this.IR);
        for (var y in players) {
            if (!includesPlayer(players[y], optimalLineup)) {
                if (players[y].isEligible(rosterSlots[x])) {
                    eligibleWeekPlayers.push(players[y]);
                }
            }
        }
        for (var z in eligibleWeekPlayers) {
            if (eligibleWeekPlayers[z].score > highScore) {
                highScore = eligibleWeekPlayers[z].score;
                bestPlayer = eligibleWeekPlayers[z];
            }
        }
        if (bestPlayer != null) {
            optimalLineup.push(bestPlayer);
            highScore = 0;
        }
    }
    return optimalLineup;
}
function includesPlayer(player, lineup) {
    var includes = false;
    lineup.forEach(function (element) {
        if (player.playerID === element.playerID) {
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
        if (league.settings.currentMatchupPeriod <= 5) {
            minSampleSize = league.settings.currentMatchupPeriod - 1;
        }
    }
    var mostConsistentPlayers = players.filter(function (player) {
        return (player.weeksPlayed >= minSampleSize);
    });
    while (mostConsistentPlayers.length === 0) {
        minSampleSize -= 1;
        mostConsistentPlayers = players.filter(function (player) {
            return (player.weeksPlayed >= minSampleSize);
        });
    }
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
            seasonPlayer.weeksPlayed >= minSampleSize && seasonPlayer.seasonScore !== 0) {
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
        if (seasonPlayer.seasonScore === lvp.seasonScore) {
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
                return existingPlayer.playerID === player.playerID;
            });
            if (index > -1) {
                players[index].addPerformance(player);
            }
            else {
                players.push(new SeasonPlayer(player, league.leaguePlatform));
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
                    return existingPlayer.playerID === player.playerID;
                });
                if (index > -1) {
                    players[index].addPerformance(player);
                }
                else {
                    players.push(new SeasonPlayer(player, league.leaguePlatform));
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
                    return existingPlayer.playerID === player.playerID;
                });
                if (index > -1) {
                    players[index].addPerformance(player);
                }
                else {
                    players.push(new SeasonPlayer(player, league.leaguePlatform));
                }
            });
            if (!matchup.byeWeek) {
                matchup.away.lineup.forEach(function (player) {
                    var index = players.findIndex(function (existingPlayer) {
                        return existingPlayer.playerID === player.playerID;
                    });
                    if (index > -1) {
                        players[index].addPerformance(player);
                    }
                    else {
                        players.push(new SeasonPlayer(player, league.leaguePlatform));
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
        if (player !== undefined) {
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
//# sourceMappingURL=utils.js.map