function updateTeamPill(league: League, teamID: number): void {
    const member = league.getMember(teamID);
    document.getElementById("teamPill").setAttribute("currentTeam", teamID.toString());
    updateTeamCard(league, member);
    updateMiniStatCards(league, member);
    updateWeekAverage(league, member);
    updateTeamStandardDeviation(league, member);
    updateBestWeek(league, member);
    updateEfficiency(league, member);
    updateBestWorstConsistent(league, member);
    createTeamRadarChart(league, member);
    updateMemberWeekTable(league, member);
    createMemberWeeklyLineChart(league, member);
    createTeamBarChart(league, member);
    updateGutWinCard(league, member);
    updateWinnableGamesLost(league, member);
    updateMargins(league, member);
    updateUpsets(league, member);
    updateMemberWeekTable(league, member);
    if (league.leaguePlatform === PLATFORM.SLEEPER) {
        updateTeamTrades(league as SleeperLeague, member);
    }

    unfadeTeam();
}
