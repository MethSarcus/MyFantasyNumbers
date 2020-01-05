class Settings {
    public activeLineupSlots: number[][];
    public lineupSlots: number[][];
    public regularSeasonLength: number;
    public playoffLength: number;
    public draftType: DRAFT_TYPE;
    public leagueType: LEAGUE_TYPE;
    public scoringType: SCORING_TYPE;
    public positions: string[];
    public currentMatchupPeriod: number;
    public isActive: boolean;
    public yearsActive: number[];
    public startWeek: number;
    public excludedLineupSlots: number[] = [];
    public excludedPositions: number[] = [];


    constructor(startWeek: number, activeLineupSlots: number[][], lineupSlots: number[][], regularSeasonLength: number, playoffLength: number, draftType: DRAFT_TYPE, currentMatchupPeriod: number, isActive: boolean, yearsActive: number[]) {
        this.activeLineupSlots = activeLineupSlots;
        this.lineupSlots = lineupSlots;
        this.regularSeasonLength = regularSeasonLength;
        this.playoffLength = playoffLength;
        this.draftType = draftType;
        this.positions = this.getPositions();
        this.currentMatchupPeriod = currentMatchupPeriod;
        this.isActive = isActive;
        this.yearsActive = yearsActive.sort((a, b) => b - a);
        this.startWeek = startWeek;
    }

    public getPositions(): string[] {
        const positions = this.activeLineupSlots.filter((slot) => {
            return slot[0] !== 1 && slot[0] !== 3 && slot[0] !== 5 && slot[0] !== 7 && slot[0] !== 23 && slot[0] !== 25;
        }).map((slot) => {
            return intToPosition.get(slot[0]);
        });
        return positions;
    }
}
