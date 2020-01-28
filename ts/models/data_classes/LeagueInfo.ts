class LeagueInfo {
    constructor(public leagueName: string, 
        public leagueId: string = leagueId.toString(), 
        public seasonId: number, 
        public activeSeasons: number[]) {
    }
}