class WeeklyPowerRanks {
    //Key is teamID
    public powerStats: Map<number, PowerStats>;
    public isPlayoffs: Boolean;
    public weekNumber: number;
    
    constructor(weekNumber: number, isPlayoffs: Boolean) {
        this.powerStats = new Map<number, PowerStats>();
        this.weekNumber = weekNumber;
        this.isPlayoffs = isPlayoffs;
    }

    public addMatchup(matchup: Matchup): void {
        const homeTeam = matchup.home;
        this.powerStats.set(homeTeam.teamID, new PowerStats(
            homeTeam.teamID, matchup.weekNumber, homeTeam.score, homeTeam.projectedScore, homeTeam.potentialPoints
            ));
        if (!matchup.byeWeek) {
            const awayTeam = matchup.away;
            this.powerStats.set(awayTeam.teamID, new PowerStats(
                awayTeam.teamID, matchup.weekNumber, awayTeam.score, awayTeam.projectedScore, awayTeam.potentialPoints
                )); 
        }
    }

    public setRanks(): void {
        this.powerStats.forEach(powerStat => {
            this.powerStats.forEach(innerStat => {
            if (powerStat.teamID != innerStat.teamID) {
                if (powerStat.pf > innerStat.pf) {
                    powerStat.wins += 1;
                } else if (powerStat.pf < innerStat.pf) {
                    powerStat.losses += 1;
                } else {
                    powerStat.ties += 1;
                }
            }
            });
        });
    }

}