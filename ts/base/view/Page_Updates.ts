declare var $: any;
declare var ajax: any;

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

function updateBestWorstConsistent(league: League, member: Member): void {
    const arr = getBestLeastConsistent(league, member.teamID);
    updateMVP(arr[0]);
    updateLVP(arr[1]);
    if (league.seasonPortion === SEASON_PORTION.POST) {
        updateBiggestBoom(league, league.getBiggestBoom(member.teamID), member.teamID);
    } else {
        updateMostConsistent(arr[2]);
    }
}

function updateWeekAverage(league: League, member: Member): void {
    const weeklyAverage = document.getElementById("team_weekly_average");
    const avgVsLeague = document.getElementById("team_weekly_average_vs_league");
    const weekCard = document.getElementById("team_weekly_average_card");

    weeklyAverage.innerText = member.stats.weeklyAverage + "";
    const avgDiff = roundToHundred(member.stats.weeklyAverage - league.getLeagueWeeklyAverage());
    let avgDiffText = "";
    if (avgDiff > 0) {
        avgDiffText = "+ " + avgDiff;
    } else {
        avgDiffText = avgDiff + "";
    }
    avgVsLeague.innerText = avgDiffText + " Average";
    weekCard.style.backgroundColor = getDarkCardColor(league.getPointsScoredFinish(member.teamID), league.members.length);
}

function updateBestWeek(league: League, member: Member): void {
    const bestWeekScore = document.getElementById("team_best_week_score");
    const bestWeekFinish = document.getElementById("team_best_week_finish");
    const bestWeekNumber = document.getElementById("team_best_finish_week_number");
    const bestWeekCard = document.getElementById("team_best_week_card");

    const bestWeek = league.getMemberBestTeam(member.teamID);
    const finish = league.getBestWeekFinish(member.teamID);
    bestWeekScore.innerText = roundToHundred(bestWeek.score) + " Points";
    bestWeekFinish.innerText = ordinal_suffix_of(finish) + " Highest";
    bestWeekCard.style.backgroundColor = getDarkCardColor(finish, league.members.length);
    bestWeekNumber.innerText = "Week " + league.getBestWeek(member.teamID).weekNumber;
}

function updateEfficiency(league: League, member: Member): void {
    const efficiencyVsLeague = document.getElementById("team_efficiency_vs_league");
    const efficiencyFinish = document.getElementById("team_efficiency_rank");
    const efficiencyPercentage = document.getElementById("team_efficiency_percentage");
    const efficiencyCard = document.getElementById("team_efficiency_card");

    const efficiency = member.stats.getEfficiency();
    const leagueEfficiency = league.getAverageEfficiency();
    const finish = league.getEfficiencyFinish(member.teamID);
    let diff;
    if (efficiency > leagueEfficiency) {
        diff = "+" + roundToHundred((efficiency - leagueEfficiency) * 100) + "% League Average";
    } else {
        diff = roundToHundred((efficiency - leagueEfficiency) * 100) + "% League Average";
    }

    efficiencyVsLeague.innerText = diff;
    efficiencyFinish.innerText = ordinal_suffix_of(finish) + " Most Efficient";
    efficiencyCard.style.backgroundColor = getDarkCardColor(finish, league.members.length);
    efficiencyPercentage.innerText = roundToHundred(efficiency * 100) + "%";
}

function updateTeamStandardDeviation(league: League, member: Member): void {
    const stdRank = document.getElementById("team_consistency_rank");
    const std = document.getElementById("team_standard_deviation");
    const stdVsLeague = document.getElementById("team_standard_deviation_vs_league");
    const stdCard = document.getElementById("team_std_card");

    stdRank.innerText = ordinal_suffix_of(league.getStandardDeviationFinish(member.teamID)) + " Most Consistent";
    std.innerText = member.stats.standardDeviation + "";
    const stdDiff = roundToHundred(member.stats.standardDeviation - league.getLeagueStandardDeviation());
    let stdDiffText = "";
    if (stdDiff > 0) {
        stdDiffText = "+ " + stdDiff;
    } else {
        stdDiffText = stdDiff + "";
    }
    stdVsLeague.innerText = stdDiffText + " Average";
    stdCard.style.backgroundColor = getDarkCardColor(league.getStandardDeviationFinish(member.teamID), league.members.length);
}

function updateTeamCard(league: League, member: Member): void {
    const picture = document.getElementById("team_image");
    const team = document.getElementById("team_name");
    const owner = document.getElementById("team_owner");
    const finish = document.getElementById("team_finish");
    const record = document.getElementById("team_record");
    picture.setAttribute("src", member.logoURL);
    picture.addEventListener("error", fixNoImage);
    team.innerHTML = member.teamNameToString();
    owner.innerHTML = member.ownerToString();
    if (league.settings.isActive) {
        finish.innerHTML = "Ranked " + member.rankToString() + " overall";
    } else {
        finish.innerHTML = "Finished " + member.finishToString() + " overall";
    }
    record.innerHTML = "Record: " + member.recordToString();

}

function updateMiniStatCards(league: League, member: Member): void {
    const pfFinish = document.getElementById("team_pf_finish");
    const pfScore = document.getElementById("team_pf_points");
    const pfLeagueDiff = document.getElementById("team_pf_vs_league_average");
    const pfBackground = document.getElementById("team_pf_statcard");

    const paFinish = document.getElementById("team_pa_finish");
    const paScore = document.getElementById("team_pa_points");
    const paLeagueDiff = document.getElementById("team_pa_vs_league_average");
    const paBackground = document.getElementById("team_pa_statcard");

    const ppFinish = document.getElementById("team_pp_finish");
    const ppScore = document.getElementById("team_pp_points");
    const ppLeagueDiff = document.getElementById("team_pp_vs_league_average");
    const ppBackground = document.getElementById("team_pp_statcard");

    pfFinish.innerHTML = ordinal_suffix_of(league.getPointsScoredFinish(member.teamID));
    pfScore.innerHTML = member.stats.pf.toString();
    const pfDiff = roundToTen(member.stats.pf - league.getLeaguePF());
    if (pfDiff > 0) {
        pfLeagueDiff.innerHTML = "+" + pfDiff + " League Average";
    } else {
        pfLeagueDiff.innerHTML = pfDiff + " League Average";
    }
    pfBackground.style.backgroundColor = getDarkCardColor(
        league.getPointsScoredFinish(member.teamID), league.members.length);

    paFinish.innerHTML = ordinal_suffix_of(league.getPointsAgainstFinish(member.teamID));
    paScore.innerHTML = member.stats.pa.toString();
    const paDiff = roundToTen(member.stats.pa - league.getLeaguePA());
    if (paDiff > 0) {
        paLeagueDiff.innerHTML = "+" + paDiff + " League Average";
    } else {
        paLeagueDiff.innerHTML = paDiff + " League Average";
    }
    paBackground.style.backgroundColor = getDarkCardColor(
        league.getPointsAgainstFinish(member.teamID), league.members.length);
    ppFinish.innerHTML = ordinal_suffix_of(league.getPotentialPointsFinish(member.teamID));
    ppScore.innerHTML = member.stats.pp.toString();
    const ppDiff = roundToTen(member.stats.pp - league.getLeaguePP());
    if (ppDiff > 0) {
        ppLeagueDiff.innerHTML = "+" + ppDiff + " League Average";
    } else {
        ppLeagueDiff.innerHTML = ppDiff + " League Average";
    }

    ppBackground.style.backgroundColor = getDarkCardColor(
        league.getPotentialPointsFinish(member.teamID), league.members.length);
}

function updateMVP(teamMVP: SeasonPlayer) {
    const mvpImage = document.getElementById("mvp_image") as HTMLImageElement;
    const mvpName = document.getElementById("team_mvp_name");
    const mvpPoints = document.getElementById("team_mvp_points");
    mvpImage.src = teamMVP.pictureURL;
    let startsText = " starts";
    if (teamMVP.weeksPlayed === 1) {
        startsText = " start";
    }
    mvpName.innerText = teamMVP.firstName + " " + teamMVP.lastName;
    mvpPoints.innerText = roundToHundred(teamMVP.seasonScore) + " Points earned in lineup\n" + teamMVP.averageScore + " points per game, " + teamMVP.weeksPlayed + startsText;
}

function updateLVP(teamLVP: SeasonPlayer) {
    const lvpImage = document.getElementById("lvp_image") as HTMLImageElement;
    const lvpName = document.getElementById("team_lvp_name");
    const lvpPoints = document.getElementById("team_lvp_points");
    lvpImage.src = teamLVP.pictureURL;
    lvpName.innerText = teamLVP.firstName + " " + teamLVP.lastName;
    let startsText = " starts";
    if (teamLVP.weeksPlayed === 1) {
        startsText = " start";
    }
    lvpPoints.innerText = roundToHundred(teamLVP.seasonScore) + " Points earned in lineup\n" + roundToHundred(teamLVP.averageScore) + " points per game, " + teamLVP.weeksPlayed + startsText;
}

function updateMostConsistent(mostConsistent: SeasonPlayer) {
    const mostConsistentTitle = document.getElementById("consistent_or_boom");
    const mostConsistentImage = document.getElementById("team_most_consistent_image") as HTMLImageElement;
    const mostConsistentName = document.getElementById("team_most_consistent_name");
    const mostConsistentPoints = document.getElementById("team_most_consistent_points");
    mostConsistentTitle.innerText = "Most Consistent";
    mostConsistentImage.src = mostConsistent.pictureURL;
    let startsText = " starts";
    if (mostConsistent.weeksPlayed === 1) {
        startsText = " start";
    }
    mostConsistentName.innerText = mostConsistent.firstName + " " + mostConsistent.lastName;
    mostConsistentPoints.innerText = "Standard Deviation: " + calcStandardDeviation(mostConsistent.getScores()) + "\n" + mostConsistent.averageScore + " points per game, " + mostConsistent.weeksPlayed + startsText;
}

function updateWinnableGamesLost(league: League, member: Member) {
    const teamID = member.teamID;
    const winnableGamesTitle = document.getElementById("winnable_games_lost_number");
    const poorRosterDecisions = document.getElementById("winnable_games_lost_choices");
    const choices = league.getMember(teamID).stats.choicesThatCouldHaveWonMatchup;
    const gamesLost = league.getMember(teamID).stats.gameLostDueToSingleChoice;
    winnableGamesTitle.innerText = gamesLost + " Winnable Games Lost";
    poorRosterDecisions.innerText = choices + " roster decisions could have won those games";
}

function updateGutWinCard(league: League, member: Member) {
    const teamID = member.teamID;
    const gutPointsTotalNumber = document.getElementById("gut_points");
    const gutPointsNumber = document.getElementById("gut_wins_projected_difference");
    const gutCard = document.getElementById("gut_wins_card");
    const gutWins = roundToHundred(league.getMember(teamID).stats.gutPoints);
    const gutPoints = roundToHundred(league.getMember(teamID).stats.gutPoints / league.getMember(teamID).stats.gutPlayersPlayed);
    gutPointsTotalNumber.innerText = gutWins + " Gut points earned";
    gutPointsNumber.innerText = gutPoints + " average points when starting player with lower projection";
    gutCard.style.backgroundColor = getDarkCardColor(league.getGutAverageFinish(teamID), league.members.length);
}

function updateMargins(league: League, member: Member) {
    const teamID = member.teamID;
    const mov = document.getElementById("margin_of_victory");
    const mod = document.getElementById("margin_of_defeat");
    mov.innerText = "Average victory margin\n\n" + league.getMember(teamID).stats.averageMOV + " Points";
    mod.innerText = "Average defeat margin\n\n" + league.getMember(teamID).stats.averageMOD + " Points";
}

function updateUpsets(league: League, member: Member) {
    const teamID = member.teamID;
    const upsetTitle = document.getElementById("upsets_title");
    const underdogCount = document.getElementById("underdog_count");
    const upsets = league.getUpsets(teamID);
    upsetTitle.innerText = "Upset projected winner " + upsets[1] + " times";
    underdogCount.innerText = "Underdog " + upsets[0] + " times";
}

function updateBiggestBoom(league: League, biggestBoom: Player, teamID: number) {
    const biggestBoomTitle = document.getElementById("consistent_or_boom");
    const biggestBoomImage = document.getElementById("team_most_consistent_image") as HTMLImageElement;
    const biggestBoomName = document.getElementById("team_most_consistent_name");
    const biggestBoomPoints = document.getElementById("team_most_consistent_points");
    biggestBoomTitle.innerText = "Biggest Boom";
    if (biggestBoom.position === "D/ST" || biggestBoom.position === "DEF") {
        biggestBoomImage.src = "http://a.espncdn.com/combiner/i?img=/i/teamlogos/NFL/500/" + getRealTeamInitials(biggestBoom.realTeamID) + ".png&h=150&w=150";
    } else {
        biggestBoomImage.src = "http://a.espncdn.com/i/headshots/nfl/players/full/" + biggestBoom.espnID + ".png";
    }
    let outcomeText = "";
    const boomMatchup = league.getWeek(biggestBoom.weekNumber).getTeamMatchup(teamID);
    if (boomMatchup.byeWeek) {
        outcomeText = ",\nwhich was a byeweek!";
    } else {
        if (boomMatchup.getWinningTeam().teamID === teamID) {
            outcomeText = "\n Won match by ";
        } else {
            outcomeText = "\n Lost match by ";
        }
        outcomeText = outcomeText + " " + roundToHundred(boomMatchup.marginOfVictory) + " points";
    }
    biggestBoomName.innerText = biggestBoom.firstName + " " + biggestBoom.lastName;
    biggestBoomPoints.innerText = biggestBoom.score + " Points Week " + biggestBoom.weekNumber + outcomeText;
}

function updateTeamTrades(league: SleeperLeague, member: Member) {
    constructTeamPageTrades(league, member.teamID);
}

function fadeTeam(league: League, teamID: number) {
    $("#teamPill").stop(true, true).fadeOut(200, () => {
        updateTeamPill(league, teamID);
    });
}

function fadeTeamWithLogic(league: League, teamID: number) {
    if (document.getElementById(teamID + "_link").classList[1] !== "active") {
        $("#teamPill").stop(true, true).fadeOut(200, () => {
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
    this.src = "./assets/images/user1.png";
    this.style.backgroundColor = "white";
    this.onerror = null;
}
