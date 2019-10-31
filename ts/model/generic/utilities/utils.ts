function getOptimalLineupDepreciated(activeLineupSlots: [number[]]): Player[] {
    const rosterSlots = [];
    // tslint:disable-next-line: forin
    for (const i in activeLineupSlots) {
        for (let w = 0; w < activeLineupSlots[i][1]; w++) {
            rosterSlots.push(activeLineupSlots[i][0]);
        }
    }
    const optimalLineup = new Array<SleeperPlayer>();
    // tslint:disable-next-line: forin
    for (const x in rosterSlots) {
        let highScore = 0;
        let bestPlayer = new EmptySlot(rosterSlots[x]);
        const eligibleWeekPlayers = [];
        const players = this.lineup.concat(this.bench, this.IR);
        for (const y in players) {
            if (!includesPlayer(players[y], optimalLineup)) {
                if (players[y].isEligible(rosterSlots[x])) {
                    eligibleWeekPlayers.push(players[y]);
                }
            }
        }
        for (const z in eligibleWeekPlayers) {
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

function includesPlayer(player: Player, lineup: Player[]): boolean {
    let includes = false;
    lineup.forEach((element) => {
        if (player.playerID === element.playerID) {
            includes = true;
        }
    });
    return includes;
}

function calcStandardDeviation(scores: number[]): number {
    const modified: number[] = [];
    const mean = getMean(scores);
    scores.forEach((score) => {
        modified.push(Math.pow(score - mean, 2));
    });

    return roundToHundred(Math.sqrt(getMean(modified)));
}

function getMean(numbers: number[]): number {
    let sum = 0;
    numbers.forEach((num) => {
        sum += num;
    });

    return roundToHundred(sum / numbers.length);
}

function getBestLeastConsistent(league: League, teamID: number): SeasonPlayer[] {
    const players = getSeasonPlayers(league, teamID);
    let minSampleSize = 5;
    if (league.settings.isActive) {
        if (league.settings.currentMatchupPeriod <= 5) {
            minSampleSize = league.settings.currentMatchupPeriod - 1;
        }
    }
    let mostConsistentPlayers = players.filter((player: SeasonPlayer) => {
        return (player.weeksPlayed >= minSampleSize);
    });
    while (mostConsistentPlayers.length === 0) {
        minSampleSize -= 1;
        mostConsistentPlayers = players.filter((player: SeasonPlayer) => {
            return (player.weeksPlayed >= minSampleSize);
        });
    }
    let mvp = players[0];
    let lvp = players[0];
    let mostConsistent = mostConsistentPlayers[0];
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
        seasonPlayer.weeksPlayed >= minSampleSize && seasonPlayer.seasonScore !== 0) {
            mostConsistent = seasonPlayer;
        }
    });

    return [mvp, lvp, mostConsistent];
}

function getMVP(league: League, teamID: number): SeasonPlayer {
    const players = getSeasonPlayers(league, teamID);
    let mvp = players[0];
    players.forEach((seasonPlayer) => {
        if (seasonPlayer.seasonScore > mvp.seasonScore) {
            mvp = seasonPlayer;
        }
    });

    return mvp;
}

function getLVP(league: League, teamID: number): SeasonPlayer {
    const players = getSeasonPlayers(league, teamID);
    let lvp = players[0];
    players.forEach((seasonPlayer) => {
        if (seasonPlayer.seasonScore === lvp.seasonScore) {
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
    const players: SeasonPlayer[] = [];
    league.getSeasonPortionWeeks().forEach((week) => {
        week.getTeam(teamID).lineup.forEach((player) => {
            const index = players.findIndex((existingPlayer) =>
                existingPlayer.playerID === player.playerID
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
    const players: SeasonPlayer[] = [];
    league.getSeasonPortionWeeks().forEach((week) => {
        if (!week.getTeamMatchup(teamID).byeWeek) {
            week.getTeamMatchup(teamID).getOpponent(teamID).lineup.forEach((player) => {
                const index = players.findIndex((existingPlayer) =>
                    existingPlayer.playerID === player.playerID
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
    const players: SeasonPlayer[] = [];
    league.getSeasonPortionWeeks().forEach((week) => {
        week.matchups.forEach((matchup) => {
            matchup.home.lineup.forEach((player) => {
                const index = players.findIndex((existingPlayer) =>
                    existingPlayer.playerID === player.playerID
                );
                if (index > -1) {
                    players[index].addPerformance(player);
                    } else {
                        players.push(new SeasonPlayer(player, league.leaguePlatform));
                }
            });
            if (!matchup.byeWeek) {
                matchup.away.lineup.forEach((player: Player) => {
                    const index = players.findIndex((existingPlayer) =>
                        existingPlayer.playerID === player.playerID
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
    const players: Player[]  = [];
    league.getSeasonPortionWeeks().forEach((week) => {
        players.push(week.getBestPositionPlayer(position));
    });
    let totalScore = 0;
    players.forEach((player) => {
        if (player !== undefined) {
            totalScore += player.score;
        }
    });

    return roundToTen(totalScore / players.length);
}

function getMemberColor(memberID: number): string {
    const colorCode = ["#3366cc", "#dc3912", "#ff9900", "#109618", "#990099", "#0099c6", "#dd4477", "#66aa00", "#b82e2e", "#316395",
    "#3366cc", "#994499", "#22aa99", "#aaaa11", "#6633cc", "#e67300", "#8b0707", "#651067", "#329262", "#5574a6", "#3b3eac",
    "#b77322", "#16d620", "#b91383", "#f4359e", "#9c5935", "#a9c413", "#2a778d", "#668d1c", "#bea413", "#0c5922", "#743411"];

    return colorCode[memberID];
}
