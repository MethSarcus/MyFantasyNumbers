declare var createTeamRadarChart: any;
declare var $: any;
declare var ajax: any;

function updateTeamPill(league: League, teamID: number): void {
    var member = league.getMember(teamID);

    updateTeamCard(league, member);
    updateMiniStatCards(league, member);
    updateWeekAverage(league, member);
    updateTeamStandardDeviation(league, member);
    updateBestWeek(league, member);
    updateWorstWeek(league, member);
    updateBestWorstConsistent(league, member);
    createTeamRadarChart(league, member);
    updateMemberWeekTable(league, member);

    unfade(document.getElementById('teamPill'));
}

function updateBestWorstConsistent(league: League, member: Member): void {
    var arr = getBestLeastConsistent(league, member.teamID);
    updateMVP(arr[0]);
    updateLVP(arr[1]);
    if (league.seasonPortion == SEASON_PORTION.POST) {
        updateBiggestBoom(league, league.getBiggestBoom(member.teamID), member.teamID);
    } else {
        updateMostConsistent(arr[2]);
    }
}

function updateWeekAverage(league: League, member: Member): void {
    var weeklyAverage = document.getElementById("team_weekly_average");
    var avgVsLeague = document.getElementById('team_weekly_average_vs_league');
    var weekCard = document.getElementById('team_weekly_average_card');

    weeklyAverage.innerText = member.stats.weeklyAverage + "";
    var avgDiff = roundToHundred(member.stats.weeklyAverage - league.getLeagueWeeklyAverage());
    var avgDiffText = "";
    if (avgDiff > 0) {
        avgDiffText = "+ " + avgDiff;
    } else {
        avgDiffText = avgDiff + "";
    }
    avgVsLeague.innerText = avgDiffText + " Average";
    weekCard.style.backgroundColor = getCardColor(league.getPointsScoredFinish(member.teamID), league.members.length);
}

function updateBestWeek(league: League, member: Member): void {
    var bestWeekScore = document.getElementById("team_best_week_score");
    var bestWeekFinish = document.getElementById('team_best_week_finish');
    var bestWeekNumber = document.getElementById('team_best_finish_week_number');
    var bestWeekCard = document.getElementById('team_best_week_card');

    var bestWeek = league.getMemberBestTeam(member.teamID);
    var finish = league.getBestWeekFinish(member.teamID);
    bestWeekScore.innerText = roundToHundred(bestWeek.score) + " Points";
    bestWeekFinish.innerText = ordinal_suffix_of(finish) + " Highest";
    bestWeekCard.style.backgroundColor = getCardColor(finish, league.members.length);
    bestWeekNumber.innerText = "Week " + league.getBestWeek(member.teamID).weekNumber;
}

function updateWorstWeek(league: League, member: Member): void {
    var worstWeekScore = document.getElementById("team_worst_week_score");
    var worstWeekFinish = document.getElementById('team_worst_week_finish');
    var worstWeekNumber = document.getElementById('team_worst_finish_week_number');
    var worstWeekCard = document.getElementById('team_worst_week_card');

    var worstWeek = league.getMemberWorstTeam(member.teamID);
    var finish = league.getWorstWeekFinish(member.teamID);
    worstWeekScore.innerText = roundToHundred(worstWeek.score) + " Points";
    worstWeekFinish.innerText = ordinal_suffix_of(finish) + " Lowest";
    worstWeekCard.style.backgroundColor = getCardColor(league.members.length - finish, league.members.length);
    worstWeekNumber.innerText = "Week " + league.getWorstWeek(member.teamID).weekNumber;
}

function updateTeamStandardDeviation(league: League, member: Member): void {
    var stdRank = document.getElementById('team_consistency_rank');
    var std = document.getElementById("team_standard_deviation");
    var stdVsLeague = document.getElementById('team_standard_deviation_vs_league');
    var stdCard = document.getElementById('team_std_card');

    stdRank.innerText = ordinal_suffix_of(league.getStandardDeviationFinish(member.teamID)) + " Most Consistent";
    std.innerText = member.stats.standardDeviation + "";
    var stdDiff = roundToHundred(member.stats.standardDeviation - league.getLeagueStandardDeviation());
    var stdDiffText = "";
    if (stdDiff > 0) {
        stdDiffText = "+ " + stdDiff;
    } else {
        stdDiffText = stdDiff + "";
    }
    stdVsLeague.innerText = stdDiffText + " Average";
    stdCard.style.backgroundColor = getCardColor(league.getStandardDeviationFinish(member.teamID), league.members.length);
}

function updateTeamCard(league: League, member: Member): void {
    var picture = document.getElementById("team_image");
    var team = document.getElementById("team_name");
    var owner = document.getElementById("team_owner");
    var finish = document.getElementById("team_finish");
    var record = document.getElementById("team_record");
    picture.setAttribute('src', member.logoURL);
    team.innerHTML = member.nameToString();
    owner.innerHTML = member.ownerToString();
    finish.innerHTML = "Finished " + member.finishToString() + " overall";
    record.innerHTML = "Record: " + member.recordToString();
    
}

function updateMiniStatCards(league: League, member: Member): void {
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
    } else {
        pfLeagueDiff.innerHTML = pfDiff + " League Average";
    }
    pfBackground.style.backgroundColor = getCardColor(
        league.getPointsScoredFinish(member.teamID), league.members.length);
    
    paFinish.innerHTML = ordinal_suffix_of(league.getPointsAgainstFinish(member.teamID));
    paScore.innerHTML = member.stats.pa.toString();
    var paDiff = roundToTen(member.stats.pa - league.getLeaguePA());
    if (paDiff > 0) {
        paLeagueDiff.innerHTML = "+" + paDiff + " League Average";
    } else {
        paLeagueDiff.innerHTML = paDiff + " League Average";
    }
    paBackground.style.backgroundColor = getCardColor(
        league.getPointsAgainstFinish(member.teamID), league.members.length);
    ppFinish.innerHTML = ordinal_suffix_of(league.getPotentialPointsFinish(member.teamID));
    ppScore.innerHTML = member.stats.pp.toString();
    var ppDiff = roundToTen(member.stats.pp - league.getLeaguePP());
    if (ppDiff > 0) {
        ppLeagueDiff.innerHTML = "+" + ppDiff + " League Average";
    } else {
        ppLeagueDiff.innerHTML = ppDiff + " League Average";
    }

    ppBackground.style.backgroundColor = getCardColor(
        league.getPotentialPointsFinish(member.teamID), league.members.length);
}

function updateMVP(teamMVP: SeasonPlayer) {
    var mvpImage = document.getElementById('mvp_image') as HTMLImageElement;
    var mvpName = document.getElementById('team_mvp_name');
    var mvpPoints = document.getElementById('team_mvp_points');
    if (teamMVP.position == "D/ST") {
            mvpImage.src = "http://a.espncdn.com/combiner/i?img=/i/teamlogos/NFL/500/" + getRealTeamInitials(teamMVP.realTeamID) + ".png&h=150&w=150";
        } else {
            mvpImage.src = "http://a.espncdn.com/i/headshots/nfl/players/full/" + teamMVP.playerID + ".png";
    }
    var startsText = " starts";
    if(teamMVP.weeksPlayed == 1) {
        startsText = " start";
    }
    mvpName.innerText = teamMVP.firstName + " " + teamMVP.lastName;
    mvpPoints.innerText = roundToHundred(teamMVP.seasonScore) + " Points earned in lineup\n" + teamMVP.averageScore + " points per game, " + teamMVP.weeksPlayed + startsText;
}

function updateLVP(teamLVP: SeasonPlayer) {
    var lvpImage = document.getElementById('lvp_image') as HTMLImageElement;
    var lvpName = document.getElementById('team_lvp_name');
    var lvpPoints = document.getElementById('team_lvp_points');
    if (teamLVP.position == "D/ST") {
            lvpImage.src = "http://a.espncdn.com/combiner/i?img=/i/teamlogos/NFL/500/" + getRealTeamInitials(teamLVP.realTeamID) + ".png&h=150&w=150";
        } else {
            lvpImage.src = "http://a.espncdn.com/i/headshots/nfl/players/full/" + teamLVP.playerID + ".png";
        }
    lvpName.innerText = teamLVP.firstName + " " + teamLVP.lastName;
    var startsText = " starts";
    if(teamLVP.weeksPlayed == 1) {
        startsText = " start";
    }
    lvpPoints.innerText = roundToHundred(teamLVP.seasonScore) + " Points earned in lineup\n" + teamLVP.averageScore + " points per game, " + teamLVP.weeksPlayed + startsText;
}

function updateMostConsistent(mostConsistent: SeasonPlayer) {
    var mostConsistentTitle = document.getElementById('consistent_or_boom');
    var mostConsistentImage = document.getElementById('team_most_consistent_image') as HTMLImageElement;
    var mostConsistentName = document.getElementById('team_most_consistent_name');
    var mostConsistentPoints = document.getElementById('team_most_consistent_points');
    mostConsistentTitle.innerText = "Most Consistent";
    if (mostConsistent.position == "D/ST") {
            mostConsistentImage.src = "http://a.espncdn.com/combiner/i?img=/i/teamlogos/NFL/500/" + getRealTeamInitials(mostConsistent.realTeamID) + ".png&h=150&w=150";
        } else {
            mostConsistentImage.src = "http://a.espncdn.com/i/headshots/nfl/players/full/" + mostConsistent.playerID + ".png";
    }
    var startsText = " starts";
    if(mostConsistent.weeksPlayed == 1) {
        startsText = " start";
    }
    mostConsistentName.innerText = mostConsistent.firstName + " " + mostConsistent.lastName;
    mostConsistentPoints.innerText = "Standard Deviation: " + calcStandardDeviation(mostConsistent.getScores()) + "\n" + mostConsistent.averageScore + " points per game, " + mostConsistent.weeksPlayed + startsText;
}

function updateBiggestBoom(league: League, biggestBoom: Player, teamID: number) {
    var biggestBoomTitle = document.getElementById('consistent_or_boom');
    var biggestBoomImage = document.getElementById('team_most_consistent_image') as HTMLImageElement;
    var biggestBoomName = document.getElementById('team_most_consistent_name');
    var biggestBoomPoints = document.getElementById('team_most_consistent_points');
    biggestBoomTitle.innerText = "Biggest Boom";
    if (biggestBoom.position == "D/ST") {
        biggestBoomImage.src = "http://a.espncdn.com/combiner/i?img=/i/teamlogos/NFL/500/" + getRealTeamInitials(biggestBoom.realTeamID) + ".png&h=150&w=150";
        } else {
            biggestBoomImage.src = "http://a.espncdn.com/i/headshots/nfl/players/full/" + biggestBoom.playerID + ".png";
    }
    var outcomeText = "";
    var boomMatchup = league.weeks[biggestBoom.weekNumber - 1].getTeamMatchup(teamID);
    if (boomMatchup.byeWeek) {
        outcomeText = ",\nwhich was a byeweek!";
    } else {
        if (boomMatchup.getWinningTeam().teamID == teamID) {
            outcomeText = "\n Won match by ";
         } else {
             outcomeText = "\n Lost match by ";
         }
         outcomeText = outcomeText + " " + roundToHundred(boomMatchup.marginOfVictory) + " points";
    }
    biggestBoomName.innerText = biggestBoom.firstName + " " + biggestBoom.lastName;
    biggestBoomPoints.innerText = biggestBoom.score + " Points Week " + biggestBoom.weekNumber + outcomeText;
}

function fadeTeam(element, league, teamID) {
    var op = 1;  // initial opacity
    var timer = setInterval(function () {
        if (op <= 0.1){
            clearInterval(timer);
            updateTeamPill(league, teamID);
        }
        element.style.opacity = op;
        element.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op -= op * 0.1;
    }, 5);
}

function fadeToLeaguePage() {
    var element = document.getElementById('teamPill');
    var op = 1;  // initial opacity
    var timer = setInterval(function () {
        if (op <= 0.1){
            clearInterval(timer);
            document.getElementById('teamPill').style.display = 'none';
        }
        element.style.opacity = op + "";
        element.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op -= op * 0.1;
    }, 8);
}

function unfade(element) {
    var op = 0.1;  // initial opacity
    element.style.display = 'block';
    var timer = setInterval(function () {
        if (op >= 1){
            clearInterval(timer);
        }
        element.style.opacity = op;
        element.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op += op * 0.1;
    }, 8);
}

function updateMemberWeekTable(league: League, member: Member): void {
    $('#member_week_table_body').empty();
    var weekTable = document.getElementById('memberWeekTable');
    // weekTable.classList.add("hover");
    // var tableHead = document.createElement('thead');
    // var tableHeader = document.createElement('tr');
    // var weeknumcol = document.createElement('th');
    // weeknumcol.setAttribute('scope', 'col');
    // weeknumcol.appendChild(document.createTextNode('Week'));
    // var scorecol = document.createElement('th');
    // scorecol.setAttribute('scope', 'col');
    // scorecol.appendChild(document.createTextNode('Score'));
    // var vscol = document.createElement('th');
    // vscol.setAttribute('scope', 'col');
    // vscol.appendChild(document.createTextNode('VS'));
    // var margincol = document.createElement('th');
    // margincol.setAttribute('scope', 'col');
    // margincol.appendChild(document.createTextNode('Margin'));
    // var outcomecol = document.createElement('th');
    // outcomecol.setAttribute('scope', 'col');
    // outcomecol.appendChild(document.createTextNode('Outcome'));
    
    // tableHeader.appendChild(weeknumcol);
    // tableHeader.appendChild(scorecol);
    // tableHeader.appendChild(vscol);
    // tableHeader.appendChild(margincol);
    // tableHeader.appendChild(outcomecol);
    // tableHead.appendChild(tableHeader);

    var tableBody = document.getElementById('member_week_table_body');
    league.getSeasonPortionWeeks().forEach((week) => {
        let curMatchup = week.getTeamMatchup(member.teamID);
        let curTeam = week.getTeam(member.teamID);
        let row = document.createElement('tr');
        let weekCell = document.createElement('td');
        let scoreCell = document.createElement('td');
        let vsCell = document.createElement('td');
        let marginCell = document.createElement('td');
        let outcomeCell = document.createElement('td');

        weekCell.appendChild(document.createTextNode(week.weekNumber.toString()));
        scoreCell.appendChild(document.createTextNode(roundToHundred(curTeam.score).toString()));
        if (!curMatchup.byeWeek) {
            vsCell.appendChild(document.createTextNode(league.getMember(curMatchup.getOpponent(member.teamID).teamID).teamAbbrev));
            marginCell.appendChild(document.createTextNode(roundToHundred(curTeam.score - curMatchup.getOpponent(member.teamID).score).toString()));
            if (curMatchup.getWinningTeam().teamID == member.teamID){
                outcomeCell.appendChild(document.createTextNode("Win"));
            } else {
                outcomeCell.appendChild(document.createTextNode("Loss"));
            }
        } else {
            vsCell.appendChild(document.createTextNode("N/A"));
            marginCell.appendChild(document.createTextNode("N/A"));
            outcomeCell.appendChild(document.createTextNode("N/A"));
        }
        
        row.appendChild(weekCell);
        row.appendChild(scoreCell);
        row.appendChild(vsCell);
        row.appendChild(marginCell);
        row.appendChild(outcomeCell);
        //console.log(tableBody);
        tableBody.appendChild(row);
    });
    //weekTable.appendChild(tableHead);
    weekTable.appendChild(tableBody);
}