class SleeperWeekStats {
    public stats: object;
    public projectedStats: object;
    public weekNumber: number;

    constructor(projectedStats: object, stats: object, weekNumber: number) {
        this.stats = stats;
        this.projectedStats = projectedStats;
        this.weekNumber = weekNumber;
    }

    public calculatePlayerScore(settings: object, player: Player): void {
        const playerStats = this.stats[player.espnID];
        if (playerStats !== undefined) {
            Object.keys(playerStats).forEach((statName) => {
                if (settings.hasOwnProperty(statName)) {
                    player.score += settings[statName] * playerStats[statName];
                }
            });
        }
    }

    public calculateProjectedPlayerScore(settings: object, player: Player): void {
        const playerProjectedStats = this.projectedStats[player.espnID];
        if (playerProjectedStats !== undefined) {
            Object.keys(playerProjectedStats).forEach((statName) => {
                if (settings.hasOwnProperty(statName)) {
                    player.projectedScore += settings[statName] * playerProjectedStats[statName];
                }
            });
        }
    }
}
