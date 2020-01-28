class LeagueInfo {
    constructor(public leagueName: string, 
        public leagueId: string, 
        public seasonId: number, 
        public activeSeasons: number[]) {
            this.leagueId = leagueId.toString()
    }
}