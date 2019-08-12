class Week {
    constructor(weekNumber, isPlayoffs, matchups) {
        this.weekNumber = weekNumber;
        this.isPlayoffs = isPlayoffs;
        this.matchups = matchups;
    }
    getTeam(teamID) {
        let team;
        this.matchups.forEach((matchup) => {
            if (matchup.hasTeam(teamID)) {
                team = matchup.getTeam(teamID);
            }
        });
        return team;
    }
    getTeamMatchup(teamID) {
        let match;
        this.matchups.forEach((matchup) => {
            if (matchup.hasTeam(teamID)) {
                match = matchup;
            }
        });
        return match;
    }
    getWeekAverage() {
        let weekScore = 0;
        let numMatches = 0;
        this.matchups.forEach((matchup) => {
            if (matchup.byeWeek) {
                weekScore += matchup.home.score;
                numMatches += 1;
            }
            else {
                weekScore += matchup.home.score + matchup.away.score;
                numMatches += 2;
            }
        });
        return weekScore / numMatches;
    }
}
//# sourceMappingURL=Week.js.map