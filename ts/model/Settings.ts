class Settings {
    public activeLineupSlots: number[];
    public lineupSlots: number[];
    public regularSeasonLength: number;
    public playoffLength: number;
    public draftType: DRAFT_TYPE;
    public leagueType: LEAGUE_TYPE;
    public scoringType: SCORING_TYPE;
    public positions: string[];

    constructor(activeLineupSlots, lineupSlots, regularSeasonLength, playoffLength, draftType) {
        this.activeLineupSlots = activeLineupSlots;
        this.lineupSlots = lineupSlots;
        this.regularSeasonLength = regularSeasonLength;
        this.playoffLength = playoffLength;
        this.draftType = draftType;
        this.positions = this.getPositions();

    }

    public getPositions(): string[] {
        var returnpositions = [];
        var positions = [];
        this.activeLineupSlots.forEach(slot => {
            if (!positions.includes(slot[0]) && slot[0] != "23") {
                positions.push(slot[0]);
                returnpositions.push(getLineupSlot(slot[0]));
            }
        });

        return returnpositions;
    }
}
