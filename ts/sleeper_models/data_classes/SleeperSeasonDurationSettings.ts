class SleeperSeasonDurationSettings extends SeasonDurationSettings {
    public lastScoredLeg: number;
    constructor(startWeek: number, regularSeasonLength: number, playoffLength: number, currentMatchupPeriod: number, last_scored_leg: number, isActive: boolean, yearsActive: number[]) {
        super(startWeek, regularSeasonLength, playoffLength, currentMatchupPeriod, isActive, yearsActive);
        this.lastScoredLeg = last_scored_leg;

    }
}