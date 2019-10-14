class Sleeper_Week_Stats {
    public stats: object;
    public projected_stats: object;
    public week_number: number;

    constructor(projected_stats: object, stats: object, week_number: number) {
        this.stats = stats;
        this.projected_stats = projected_stats;
        this.week_number = week_number;
    }

    public calculatePlayerScore(settings: object, player: Player): void {
        const player_stats = this.stats[player.playerID];
        if (player_stats != undefined) {
            Object.keys(player_stats).forEach(stat_name => {
                if (settings.hasOwnProperty(stat_name)) {
                    player.score += settings[stat_name] * player_stats[stat_name];
                }
            });
        }
    }

    public calculateProjectedPlayerScore(settings: object, player: Player): void {
        const player_projected_stats = this.projected_stats[player.playerID];
        if (player_projected_stats != undefined) {
            Object.keys(player_projected_stats).forEach(stat_name => {
                if (settings.hasOwnProperty(stat_name)) {
                    player.projectedScore += settings[stat_name] * player_projected_stats[stat_name];
                }
            });
        }
    }
}