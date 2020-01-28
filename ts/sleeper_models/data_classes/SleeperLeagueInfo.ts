class SleeperLeagueInfo extends LeagueInfo {
    public leagueAvatar: string;
    public previousLeagueId?: string;
    constructor(leagueName: string, leagueId: string, seasonId: number, activeSeasons: number[], leagueAvatar: string, previousLeagueId?: string) {
        super(leagueName, leagueId, seasonId, activeSeasons);
        this.leagueAvatar = leagueAvatar;
        this.previousLeagueId = previousLeagueId;
    }
}