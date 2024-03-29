class SleeperSettings extends Settings {
    public scoringSettings: SleeperScoringSettings;
    public draft: SleeperDraftInfo;
    public seasonDuration: SleeperSeasonDurationSettings;

    constructor(
        sleeperScoringSettings: SleeperScoringSettings,
        sleeperSeasonDurationSettings: SleeperSeasonDurationSettings,
        leagueInfo: SleeperLeagueInfo,
        draft: SleeperDraftInfo,
        positionInfo: PositionInfo) {

        super(sleeperSeasonDurationSettings, leagueInfo, positionInfo);
        this.scoringSettings = sleeperScoringSettings;
        this.draft = draft;
    }
}