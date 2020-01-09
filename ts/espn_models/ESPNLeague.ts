class ESPNLeague extends League {
    public id: string;
    public leagueName: string;
    public weeks: Week[];
    public season: number;
    public members: Member[];
    public settings: Settings;
    public seasonPortion: SEASON_PORTION;
    public weeklyPowerRanks: Map<number, WeeklyPowerRanks>;
    public leaguePlatform: PLATFORM;
    constructor(id: string, season: number, weeks: Week[], members: Member[], settings: Settings, leagueName: string, leaguePlatform: PLATFORM) {
        super(id, season, weeks, members, settings, leagueName, leaguePlatform);
    }

    public setPage(): void {
        super.setPage();
        enableSeasonPortionSelector(this, this.settings.currentMatchupPeriod > this.settings.regularSeasonLength);
        transitionToLeaguePage();
    }

    public static convertESPNFromJson(object: any): ESPNLeague {
        const members: Member[] = [];
        const weeks: Week[] = [];
        const jsonSettings = object.settings;
        const settings = new Settings(0,
            jsonSettings.activeLineupSlots,
            jsonSettings.lineupSlots,
            jsonSettings.regularSeasonLength,
            jsonSettings.playoffLength,
            jsonSettings.draftType,
            jsonSettings.currentMatchupPeriod,
            jsonSettings.isActive,
            jsonSettings.yearsActive);
        object.weeks.forEach((week: Week) => {
            const matchups: Matchup[] = [];
            week.matchups.forEach((matchup: Matchup) => {
                const homeRoster: Player[] = [];
                matchup.home.IR.concat(matchup.home.bench, matchup.home.lineup).forEach((player) => {
                    homeRoster.push(new ESPNPlayer(player.firstName, player.lastName,
                        player.score, player.projectedScore, player.position, player.realTeamID, player.playerID,
                        player.lineupSlotID, player.eligibleSlots, player.weekNumber));
                });
                let awayTeamId = -1;
                let away;
                if (!matchup.byeWeek) {
                    const awayRoster: Player[] = [];
                    awayTeamId = matchup.away.teamID;
                    matchup.away.IR.concat(matchup.away.bench, matchup.away.lineup).forEach((player: Player) => {
                        awayRoster.push(new ESPNPlayer(player.firstName, player.lastName,
                            player.score, player.projectedScore, player.position, player.realTeamID, player.playerID,
                            player.lineupSlotID, player.eligibleSlots, player.weekNumber));
                    });
                    away = new ESPNTeam(matchup.away.teamID,
                        awayRoster,
                        object.settings.activeLineupSlots,
                        matchup.home.teamID, settings.excludedLineupSlots, settings.excludedPositions);
                }
                const home = new ESPNTeam(
                    matchup.home.teamID,
                    homeRoster,
                    object.settings.activeLineupSlots,
                    awayTeamId, settings.excludedLineupSlots, settings.excludedPositions);
                const recreatedMatchup = new Matchup(home, away, week.weekNumber, week.isPlayoffs);
                recreatedMatchup.setPoorLineupDecisions();
                matchups.push(recreatedMatchup);
            });
            weeks.push(new Week(week.weekNumber, week.isPlayoffs, matchups));
        });
        object.members.forEach((member: ESPNMember) => {
            members.push(new ESPNMember(
                member.memberID,
                member.firstName,
                member.lastName,
                member.teamLocation,
                member.teamNickname,
                member.teamAbbrev,
                member.division,
                member.teamID,
                member.logoURL,
                member.transactions,
                new Stats(member.stats.finalStanding)
            ));
        });
        const league = new ESPNLeague(object.id, object.season, weeks, members, settings, object.leagueName, object.leaguePlatform);
        league.setMemberStats(league.getSeasonPortionWeeks());
        league.setPowerRanks();
        return league;
    }
}
