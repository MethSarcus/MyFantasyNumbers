function updateLeagueStandardDeviation(league: League) {
    const leagueStandardDeviation = document.getElementById("league_standard_deviation");
    leagueStandardDeviation.innerText = roundToHundred(league.getLeagueStandardDeviation()).toString();
}

function updateLeagueEfficiency(league: League) {
    const leagueEfficiency = document.getElementById("league_efficiency_percentage");
    leagueEfficiency.innerText = (roundToHundred(league.getAverageEfficiency()) * 100).toString() + "%";
}

function updateLeagueWeeklyAverage(league: League) {
    const leagueWeeklyAverage = document.getElementById("league_weekly_average");
    leagueWeeklyAverage.innerText = roundToHundred(league.getLeagueWeeklyAverage()).toString();
}

function updateLeagueWeeklyPP(league: League) {
    const leagueWeeklyAverage = document.getElementById("league_weekly_average_pp");
    leagueWeeklyAverage.innerText = roundToHundred(league.getLeaguePP() / league.getSeasonPortionWeeks().length).toString();
}

function updateLeagueSmallestMOVCard(league: League) {
    const closestMatchup = league.getSmallestMarginOfVictory();
    const team1 = closestMatchup.home;
    const team2 = closestMatchup.away;

    const margin = document.getElementById("league_closest_match_margin");
    const weekNumber = document.getElementById("league_closest_match_week");

    const firstTeamName = document.getElementById("league_closest_match_team_1");
    const firstTeamScore = document.getElementById("league_closest_match_team_1_score");
    const firstTeamImage = document.getElementById("league_closest_match_team_1_image") as HTMLImageElement;

    const secondTeamName = document.getElementById("league_closest_match_team_2");
    const secondTeamScore = document.getElementById("league_closest_match_team_2_score");
    const secondTeamImage = document.getElementById("league_closest_match_team_2_image") as HTMLImageElement;

    margin.innerText = roundToMil(closestMatchup.marginOfVictory) + " Points";
    weekNumber.innerText = "Week " + closestMatchup.weekNumber.toString();

    firstTeamName.innerText = league.getMember(team1.teamID).teamNameToString();
    firstTeamScore.innerText = roundToThousand(team1.score) + " Points";
    firstTeamImage.src = league.getMember(team1.teamID).logoURL;

    secondTeamName.innerText = league.getMember(team2.teamID).teamNameToString();
    secondTeamScore.innerText = roundToThousand(team2.score) + " Points";
    secondTeamImage.src = league.getMember(team2.teamID).logoURL;
}

function updateLeagueLargestMOVCard(league: League) {
    const closestMatchup = league.getLargestMarginOfVictory();
    const team1 = closestMatchup.home;
    const team2 = closestMatchup.away;

    const margin = document.getElementById("league_largest_match_margin");
    const weekNumber = document.getElementById("league_largest_match_week");

    const firstTeamName = document.getElementById("league_largest_match_team_1");
    const firstTeamScore = document.getElementById("league_largest_match_team_1_score");
    const firstTeamImage = document.getElementById("league_largest_match_team_1_image") as HTMLImageElement;

    const secondTeamName = document.getElementById("league_largest_match_team_2");
    const secondTeamScore = document.getElementById("league_largest_match_team_2_score");
    const secondTeamImage = document.getElementById("league_largest_match_team_2_image") as HTMLImageElement;

    margin.innerText = roundToThousand(closestMatchup.marginOfVictory) + " Points";
    weekNumber.innerText = "Week " + closestMatchup.weekNumber.toString();

    firstTeamName.innerText = league.getMember(team1.teamID).teamNameToString();
    firstTeamScore.innerText = roundToThousand(team1.score) + " Points";
    firstTeamImage.src = league.getMember(team1.teamID).logoURL;

    secondTeamName.innerText = league.getMember(team2.teamID).teamNameToString();
    secondTeamScore.innerText = roundToThousand(team2.score) + " Points";
    secondTeamImage.src = league.getMember(team2.teamID).logoURL;

}

function updateBestWorstLeagueWeeks(league: League) {
    const leagueBestWeekScore = document.getElementById("league_best_week_score");
    const leagueBestWeekTeamName = document.getElementById("league_best_week_team_name");
    const leagueWorstWeekTeamName = document.getElementById("league_worst_week_team_name");
    const leagueBestWeekImage = document.getElementById("team_best_week_image") as HTMLImageElement;
    const leagueWorstWeekImage = document.getElementById("team_worst_week_image") as HTMLImageElement;
    const leagueWorstWeekScore = document.getElementById("league_worst_week_score");
    const leagueBestWeekNumber = document.getElementById("league_best_week_number");
    const leagueWorstWeekNumber = document.getElementById("league_worst_week_number");
    const bestWeek = league.getOverallBestWeek();
    const worstWeek = league.getOverallWorstWeek();

    leagueBestWeekScore.innerText = roundToHundred(bestWeek.getHighestScoringTeam().score).toString() + " Points";
    leagueBestWeekTeamName.innerText = league.getMember(bestWeek.getHighestScoringTeam().teamID).teamNameToString();
    leagueBestWeekNumber.innerText = "Week " + bestWeek.weekNumber.toString();
    leagueBestWeekImage.src = league.getMember(bestWeek.getHighestScoringTeam().teamID).logoURL;

    leagueWorstWeekScore.innerText = roundToHundred(worstWeek.getLowestScoringTeam().score).toString() + " Points";
    leagueWorstWeekTeamName.innerText = league.getMember(worstWeek.getLowestScoringTeam().teamID).teamNameToString();
    leagueWorstWeekNumber.innerText = "Week " + worstWeek.weekNumber.toString();
    leagueWorstWeekImage.src = league.getMember(worstWeek.getLowestScoringTeam().teamID).logoURL;
}
