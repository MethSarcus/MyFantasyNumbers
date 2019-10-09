class Week {
    public weekNumber: number;
    public isPlayoffs: boolean;
    public matchups: Matchup[];

    constructor(weekNumber, isPlayoffs, matchups) {
        this.weekNumber = weekNumber;
        this.isPlayoffs = isPlayoffs;
        this.matchups = matchups;
    }

    public getTeam(teamID: number): Team {
        var team: Team;
        this.matchups.forEach( (matchup) => {
            if (matchup.hasTeam(teamID)) {
                team = matchup.getTeam(teamID);
            }
        });
        return team;
    }

    public getTeamScoreFinish(teamID: number): number {
        let finish = 1;
        let score = this.getTeam(teamID).score;
        this.matchups.forEach((matchup) => {
            if (matchup.home.teamID != teamID) {
                if (matchup.home.score > score) {
                    finish += 1;
                }
            }
            if (!matchup.byeWeek) {
                if (matchup.away.score > score && matchup.away.teamID != teamID) {
                    finish += 1;
                }
            }
        });

        return finish;
    }

    public getTeamMatchup(teamID: number): Matchup {
        let match: Matchup;
        this.matchups.forEach((matchup) => {
            if (matchup.hasTeam(teamID)) {
                match = matchup;
            }
        });
        return match;
    }

    public getWeekAverage(): number {
        let weekScore = 0;
        let numMatches = 0;
        this.matchups.forEach((matchup) => {
            if (matchup.byeWeek) {
                weekScore += matchup.home.score;
                numMatches += 1;
            } else {
                weekScore += matchup.home.score + matchup.away.score;
                numMatches += 2;
            }
        });
        return roundToHundred(weekScore / numMatches);
    }

    public getBestPositionPlayer(position: string): Player {
        var positionPlayers = [];
        this.matchups.forEach((matchup) => {
            positionPlayers = positionPlayers.concat(matchup.home.getPositionalPlayers(position));
            if (!matchup.byeWeek) {
                positionPlayers = positionPlayers.concat(matchup.away.getPositionalPlayers(position));
            }
        });
        var bestPlayer = positionPlayers[0];
        positionPlayers.forEach((player) => {
            if (player.score > bestPlayer.score) {
                bestPlayer = player;
            }
        });
        return bestPlayer;
    }
}
