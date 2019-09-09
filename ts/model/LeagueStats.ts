class LeagueStats {
    public leaguePF: number;
    public leaguePP: number;
    public leaguePositionalStats: PositionalStats;
    public highestScoringMatchup: Matchup;
    public slimmestMarginOfVictory: Matchup;
    public largestMarginOfVictory: Matchup;
    public highestScoringTeam: Matchup;
    public leagueMVP: SeasonPlayer;
    public worstStartedPlayer: Player;

    constructor() {
        this.leaguePF = 0;
        this.leaguePP = 0;
        this.leaguePositionalStats = new PositionalStats();

    }
}