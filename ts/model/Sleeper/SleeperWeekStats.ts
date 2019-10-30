class SleeperWeekStats {
    public stats: SleeperStatsResponse;
    public projectedStats: SleeperStatsResponse;
    public weekNumber: number;

    constructor(projectedStats: SleeperStatsResponse, stats: SleeperStatsResponse, weekNumber: number) {
        this.stats = stats;
        this.projectedStats = projectedStats;
        this.weekNumber = weekNumber;
    }

    public calculatePlayerScore(settings: SleeperScoringSettings, player: SleeperPlayer): void {
        const playerStats: SleeperStatsEntry = this.stats[player.playerID];
        if (playerStats !== undefined) {
            Object.keys(playerStats).forEach((statName: string) => {
                if (settings.hasOwnProperty(statName)) {
                    player.score += settings[statName] * playerStats[statName];
                }
            });
        }
    }

    public calculateProjectedPlayerScore(settings: SleeperScoringSettings, player: Player): void {
        const playerProjectedStats: SleeperStatsEntry = this.projectedStats[player.playerID];
        if (playerProjectedStats !== undefined) {
            Object.keys(playerProjectedStats).forEach((statName) => {
                if (settings.hasOwnProperty(statName)) {
                    player.projectedScore += settings[statName] * playerProjectedStats[statName];
                }
            });
        }
    }
}
