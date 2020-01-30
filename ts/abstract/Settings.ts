class Settings {
    public seasonDuration: SeasonDurationSettings;
    public leagueInfo: LeagueInfo;
    public positionInfo: PositionInfo;

    constructor(seasonDuration: SeasonDurationSettings, leagueInfo: LeagueInfo, positionInfo: PositionInfo) {
        this.seasonDuration = seasonDuration
        this.leagueInfo = leagueInfo;
        this.positionInfo = positionInfo
    }
}
