function updateTeamPill(league, teamID) {
    var member = league.getMember(teamID);
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
    unfadeTeam();
}
function updateBestWorstConsistent(league, member) {
    var arr = getBestLeastConsistent(league, member.teamID);
    updateMVP(arr[0]);
    updateLVP(arr[1]);
    if (league.seasonPortion === SEASON_PORTION.POST) {
        updateBiggestBoom(league, league.getBiggestBoom(member.teamID), member.teamID);
    }
    else {
        updateMostConsistent(arr[2]);
    }
}
function updateWeekAverage(league, member) {
    var weeklyAverage = document.getElementById("team_weekly_average");
    var avgVsLeague = document.getElementById("team_weekly_average_vs_league");
    var weekCard = document.getElementById("team_weekly_average_card");
    weeklyAverage.innerText = member.stats.weeklyAverage + "";
    var avgDiff = roundToHundred(member.stats.weeklyAverage - league.getLeagueWeeklyAverage());
    var avgDiffText = "";
    if (avgDiff > 0) {
        avgDiffText = "+ " + avgDiff;
    }
    else {
        avgDiffText = avgDiff + "";
    }
    avgVsLeague.innerText = avgDiffText + " Average";
    weekCard.style.backgroundColor = getDarkCardColor(league.getPointsScoredFinish(member.teamID), league.members.length);
}
function updateBestWeek(league, member) {
    var bestWeekScore = document.getElementById("team_best_week_score");
    var bestWeekFinish = document.getElementById("team_best_week_finish");
    var bestWeekNumber = document.getElementById("team_best_finish_week_number");
    var bestWeekCard = document.getElementById("team_best_week_card");
    var bestWeek = league.getMemberBestTeam(member.teamID);
    var finish = league.getBestWeekFinish(member.teamID);
    bestWeekScore.innerText = roundToHundred(bestWeek.score) + " Points";
    bestWeekFinish.innerText = ordinal_suffix_of(finish) + " Highest";
    bestWeekCard.style.backgroundColor = getDarkCardColor(finish, league.members.length);
    bestWeekNumber.innerText = "Week " + league.getBestWeek(member.teamID).weekNumber;
}
function updateEfficiency(league, member) {
    var efficiencyVsLeague = document.getElementById("team_efficiency_vs_league");
    var efficiencyFinish = document.getElementById("team_efficiency_rank");
    var efficiencyPercentage = document.getElementById("team_efficiency_percentage");
    var efficiencyCard = document.getElementById("team_efficiency_card");
    var efficiency = member.stats.getEfficiency();
    var leagueEfficiency = league.getAverageEfficiency();
    var finish = league.getEfficiencyFinish(member.teamID);
    var diff;
    if (efficiency > leagueEfficiency) {
        diff = "+" + roundToHundred((efficiency - leagueEfficiency) * 100) + "% League Average";
    }
    else {
        diff = roundToHundred((efficiency - leagueEfficiency) * 100) + "% League Average";
    }
    efficiencyVsLeague.innerText = diff;
    efficiencyFinish.innerText = ordinal_suffix_of(finish) + " Most Efficient";
    efficiencyCard.style.backgroundColor = getDarkCardColor(finish, league.members.length);
    efficiencyPercentage.innerText = roundToHundred(efficiency * 100) + "%";
}
function updateTeamStandardDeviation(league, member) {
    var stdRank = document.getElementById("team_consistency_rank");
    var std = document.getElementById("team_standard_deviation");
    var stdVsLeague = document.getElementById("team_standard_deviation_vs_league");
    var stdCard = document.getElementById("team_std_card");
    stdRank.innerText = ordinal_suffix_of(league.getStandardDeviationFinish(member.teamID)) + " Most Consistent";
    std.innerText = member.stats.standardDeviation + "";
    var stdDiff = roundToHundred(member.stats.standardDeviation - league.getLeagueStandardDeviation());
    var stdDiffText = "";
    if (stdDiff > 0) {
        stdDiffText = "+ " + stdDiff;
    }
    else {
        stdDiffText = stdDiff + "";
    }
    stdVsLeague.innerText = stdDiffText + " Average";
    stdCard.style.backgroundColor = getDarkCardColor(league.getStandardDeviationFinish(member.teamID), league.members.length);
}
function updateTeamCard(league, member) {
    var picture = document.getElementById("team_image");
    var team = document.getElementById("team_name");
    var owner = document.getElementById("team_owner");
    var finish = document.getElementById("team_finish");
    var record = document.getElementById("team_record");
    picture.setAttribute("src", member.logoURL);
    picture.addEventListener("error", fixNoImage);
    team.innerHTML = member.nameToString();
    owner.innerHTML = member.ownerToString();
    if (league.settings.isActive) {
        finish.innerHTML = "Ranked " + member.rankToString() + " overall";
    }
    else {
        finish.innerHTML = "Finished " + member.finishToString() + " overall";
    }
    record.innerHTML = "Record: " + member.recordToString();
}
function updateMiniStatCards(league, member) {
    var pfFinish = document.getElementById("team_pf_finish");
    var pfScore = document.getElementById("team_pf_points");
    var pfLeagueDiff = document.getElementById("team_pf_vs_league_average");
    var pfBackground = document.getElementById("team_pf_statcard");
    var paFinish = document.getElementById("team_pa_finish");
    var paScore = document.getElementById("team_pa_points");
    var paLeagueDiff = document.getElementById("team_pa_vs_league_average");
    var paBackground = document.getElementById("team_pa_statcard");
    var ppFinish = document.getElementById("team_pp_finish");
    var ppScore = document.getElementById("team_pp_points");
    var ppLeagueDiff = document.getElementById("team_pp_vs_league_average");
    var ppBackground = document.getElementById("team_pp_statcard");
    pfFinish.innerHTML = ordinal_suffix_of(league.getPointsScoredFinish(member.teamID));
    pfScore.innerHTML = member.stats.pf.toString();
    var pfDiff = roundToTen(member.stats.pf - league.getLeaguePF());
    if (pfDiff > 0) {
        pfLeagueDiff.innerHTML = "+" + pfDiff + " League Average";
    }
    else {
        pfLeagueDiff.innerHTML = pfDiff + " League Average";
    }
    pfBackground.style.backgroundColor = getDarkCardColor(league.getPointsScoredFinish(member.teamID), league.members.length);
    paFinish.innerHTML = ordinal_suffix_of(league.getPointsAgainstFinish(member.teamID));
    paScore.innerHTML = member.stats.pa.toString();
    var paDiff = roundToTen(member.stats.pa - league.getLeaguePA());
    if (paDiff > 0) {
        paLeagueDiff.innerHTML = "+" + paDiff + " League Average";
    }
    else {
        paLeagueDiff.innerHTML = paDiff + " League Average";
    }
    paBackground.style.backgroundColor = getInverseDarkCardColor(league.getPointsAgainstFinish(member.teamID), league.members.length);
    ppFinish.innerHTML = ordinal_suffix_of(league.getPotentialPointsFinish(member.teamID));
    ppScore.innerHTML = member.stats.pp.toString();
    var ppDiff = roundToTen(member.stats.pp - league.getLeaguePP());
    if (ppDiff > 0) {
        ppLeagueDiff.innerHTML = "+" + ppDiff + " League Average";
    }
    else {
        ppLeagueDiff.innerHTML = ppDiff + " League Average";
    }
    ppBackground.style.backgroundColor = getDarkCardColor(league.getPotentialPointsFinish(member.teamID), league.members.length);
}
function updateMVP(teamMVP) {
    var mvpImage = document.getElementById("mvp_image");
    var mvpName = document.getElementById("team_mvp_name");
    var mvpPoints = document.getElementById("team_mvp_points");
    mvpImage.src = teamMVP.pictureURL;
    var startsText = " starts";
    if (teamMVP.weeksPlayed === 1) {
        startsText = " start";
    }
    mvpName.innerText = teamMVP.firstName + " " + teamMVP.lastName;
    mvpPoints.innerText = roundToHundred(teamMVP.seasonScore) + " Points earned in lineup\n" + teamMVP.averageScore + " points per game, " + teamMVP.weeksPlayed + startsText;
}
function updateLVP(teamLVP) {
    var lvpImage = document.getElementById("lvp_image");
    var lvpName = document.getElementById("team_lvp_name");
    var lvpPoints = document.getElementById("team_lvp_points");
    lvpImage.src = teamLVP.pictureURL;
    lvpName.innerText = teamLVP.firstName + " " + teamLVP.lastName;
    var startsText = " starts";
    if (teamLVP.weeksPlayed === 1) {
        startsText = " start";
    }
    lvpPoints.innerText = roundToHundred(teamLVP.seasonScore) + " Points earned in lineup\n" + roundToHundred(teamLVP.averageScore) + " points per game, " + teamLVP.weeksPlayed + startsText;
}
function updateMostConsistent(mostConsistent) {
    var mostConsistentTitle = document.getElementById("consistent_or_boom");
    var mostConsistentImage = document.getElementById("team_most_consistent_image");
    var mostConsistentName = document.getElementById("team_most_consistent_name");
    var mostConsistentPoints = document.getElementById("team_most_consistent_points");
    mostConsistentTitle.innerText = "Most Consistent";
    mostConsistentImage.src = mostConsistent.pictureURL;
    var startsText = " starts";
    if (mostConsistent.weeksPlayed === 1) {
        startsText = " start";
    }
    mostConsistentName.innerText = mostConsistent.firstName + " " + mostConsistent.lastName;
    mostConsistentPoints.innerText = "Standard Deviation: " + calcStandardDeviation(mostConsistent.getScores()) + "\n" + mostConsistent.averageScore + " points per game, " + mostConsistent.weeksPlayed + startsText;
}
function updateWinnableGamesLost(league, member) {
    var teamID = member.teamID;
    var winnableGamesTitle = document.getElementById("winnable_games_lost_number");
    var poorRosterDecisions = document.getElementById("winnable_games_lost_choices");
    var choices = league.getMember(teamID).stats.choicesThatCouldHaveWonMatchup;
    var gamesLost = league.getMember(teamID).stats.gameLostDueToSingleChoice;
    winnableGamesTitle.innerText = gamesLost + " Winnable Games Lost";
    poorRosterDecisions.innerText = choices + " roster decisions could have won those games";
}
function updateGutWinCard(league, member) {
    var teamID = member.teamID;
    var gutPointsTotalNumber = document.getElementById("gut_points");
    var gutPointsNumber = document.getElementById("gut_wins_projected_difference");
    var gutCard = document.getElementById("gut_wins_card");
    var gutWins = roundToHundred(league.getMember(teamID).stats.gutPoints);
    var gutPoints = roundToHundred(league.getMember(teamID).stats.gutPoints / league.getMember(teamID).stats.gutPlayersPlayed);
    gutPointsTotalNumber.innerText = gutWins + " Gut points earned";
    gutPointsNumber.innerText = gutPoints + " average points when starting player with lower projection";
    gutCard.style.backgroundColor = getDarkCardColor(league.getGutAverageFinish(teamID), league.members.length);
}
function updateMargins(league, member) {
    var teamID = member.teamID;
    var mov = document.getElementById("margin_of_victory");
    var mod = document.getElementById("margin_of_defeat");
    mov.innerText = "Average victory margin\n\n" + league.getMember(teamID).stats.averageMOV + " Points";
    mod.innerText = "Average defeat margin\n\n" + league.getMember(teamID).stats.averageMOD + " Points";
}
function updateUpsets(league, member) {
    var teamID = member.teamID;
    var upsetTitle = document.getElementById("upsets_title");
    var underdogCount = document.getElementById("underdog_count");
    var upsets = league.getUpsets(teamID);
    upsetTitle.innerText = "Upset projected winner " + upsets[1] + " times";
    underdogCount.innerText = "Underdog " + upsets[0] + " times";
}
function updateBiggestBoom(league, biggestBoom, teamID) {
    var biggestBoomTitle = document.getElementById("consistent_or_boom");
    var biggestBoomImage = document.getElementById("team_most_consistent_image");
    var biggestBoomName = document.getElementById("team_most_consistent_name");
    var biggestBoomPoints = document.getElementById("team_most_consistent_points");
    biggestBoomTitle.innerText = "Biggest Boom";
    if (biggestBoom.position === "D/ST") {
        biggestBoomImage.src = "http://a.espncdn.com/combiner/i?img=/i/teamlogos/NFL/500/" + getRealTeamInitials(biggestBoom.realTeamID) + ".png&h=150&w=150";
    }
    else {
        biggestBoomImage.src = "http://a.espncdn.com/i/headshots/nfl/players/full/" + biggestBoom.espnID + ".png";
    }
    var outcomeText = "";
    var boomMatchup = league.weeks[biggestBoom.weekNumber - 1].getTeamMatchup(teamID);
    if (boomMatchup.byeWeek) {
        outcomeText = ",\nwhich was a byeweek!";
    }
    else {
        if (boomMatchup.getWinningTeam().teamID === teamID) {
            outcomeText = "\n Won match by ";
        }
        else {
            outcomeText = "\n Lost match by ";
        }
        outcomeText = outcomeText + " " + roundToHundred(boomMatchup.marginOfVictory) + " points";
    }
    biggestBoomName.innerText = biggestBoom.firstName + " " + biggestBoom.lastName;
    biggestBoomPoints.innerText = biggestBoom.score + " Points Week " + biggestBoom.weekNumber + outcomeText;
}
function fadeTeam(league, teamID) {
    $("#teamPill").stop(true, true).fadeOut(200, function () {
        updateTeamPill(league, teamID);
    });
}
function fadeTeamWithLogic(league, teamID) {
    if (document.getElementById(teamID + "_link").classList[1] !== "active") {
        $("#teamPill").stop(true, true).fadeOut(200, function () {
            updateTeamPill(league, teamID);
        });
    }
}
function fadeToLeaguePage() {
    $("#teamPill").stop(true, true).fadeOut(200);
}
function unfadeTeam() {
    $("#teamPill").stop(true, true).fadeIn(200);
}
function unfadeLeaguePage() {
    document.getElementById("page_header").style.display = "flex";
    document.getElementById("page_container").style.display = "inline-block";
}
function fixNoImage() {
    this.src = "assets/user1.png";
    this.style.backgroundColor = "white";
    this.onerror = null;
}
//# sourceMappingURL=Page_Updates.js.map