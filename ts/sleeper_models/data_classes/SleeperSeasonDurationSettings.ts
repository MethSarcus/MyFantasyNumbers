class SleeperSeasonDurationSettings extends SeasonDurationSettings {
    public lastScoredLeg: number;
    public playoffType: number;
    public numPlayoffTeams: number;
    constructor(startWeek: number, regularSeasonLength: number, playoffLength: number, currentMatchupPeriod: number, last_scored_leg: number, isActive: boolean, yearsActive: number[], playoffType: number, numPlayoffTeams: number) {
        super(startWeek, regularSeasonLength, playoffLength, currentMatchupPeriod, isActive, yearsActive);
        this.playoffType = playoffType;
        this.lastScoredLeg = last_scored_leg;
        this.numPlayoffTeams = numPlayoffTeams;

    }
}