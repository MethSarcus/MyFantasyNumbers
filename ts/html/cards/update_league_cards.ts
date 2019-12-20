function updateLeagueStatsCards(league: League): void {
    updateLeagueWeeklyAverage(league);
    updateLeagueWeeklyPP(league);
    updateLeagueStandardDeviation(league);
    updateLeagueEfficiency(league);
    updateBestWorstLeagueWeeks(league);
    updateLeagueSmallestMOVCard(league);
    updateLeagueLargestMOVCard(league);

}
