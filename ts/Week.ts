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
}
