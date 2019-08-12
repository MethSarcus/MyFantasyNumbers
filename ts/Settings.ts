class Settings {
    public activeLineupSlots: number[];
    public lineupSlots: number[];
    public regularSeasonLength: number;
    public playoffLength: number;
    public draftType: DRAFT_TYPE;
    public leagueType: LEAGUE_TYPE;
    public scoringType: SCORING_TYPE;

    constructor(activeLineupSlots, lineupSlots, regularSeasonLength, playoffLength, draftType) {
        this.activeLineupSlots = activeLineupSlots;
        this.lineupSlots = lineupSlots;
        this.regularSeasonLength = regularSeasonLength;
        this.playoffLength = playoffLength;
        this.draftType = draftType;

    }
}
