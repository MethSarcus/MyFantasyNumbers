function updateTeamPill(league, teamID) {
    var member = league.getMember(teamID);
    updateTeamCard(league, member);
    updateMiniStatCards(league, member);
    unfade(document.getElementById('teamPill'));
}
function updateTeamCard(league, member) {
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
    var pfDiff = member.stats.pf - league.getLeaguePF();
    if (pfDiff > 0) {
        pfLeagueDiff.innerHTML = "+" + pfDiff + " League Average";
    }
    else {
        pfLeagueDiff.innerHTML = pfDiff + " League Average";
    }
    pfBackground.style.backgroundColor = getCardColor(league.getPointsScoredFinish(member.teamID), league.members.length);
    paFinish.innerHTML = ordinal_suffix_of(league.getPointsAgainstFinish(member.teamID));
    paScore.innerHTML = member.stats.pa.toString();
    var paDiff = member.stats.pa - league.getLeaguePA();
    if (paDiff > 0) {
        paLeagueDiff.innerHTML = "+" + paDiff + " League Average";
    }
    else {
        paLeagueDiff.innerHTML = paDiff + " League Average";
    }
    paBackground.style.backgroundColor = getCardColor(league.getPointsAgainstFinish(member.teamID), league.members.length);
    ppFinish.innerHTML = ordinal_suffix_of(league.getPotentialPointsFinish(member.teamID));
    ppScore.innerHTML = member.stats.pp.toString();
    var ppDiff = member.stats.pp - league.getLeaguePP();
    if (ppDiff > 0) {
        ppLeagueDiff.innerHTML = "+" + ppDiff + " League Average";
    }
    else {
        ppLeagueDiff.innerHTML = ppDiff + " League Average";
    }
    ppBackground.style.backgroundColor = getCardColor(league.getPotentialPointsFinish(member.teamID), league.members.length);
}
function updateWeeklyStatCards(league, member) {
    var weeklyAverage = document.getElementById("team_weekly_average");
    var weekAverageDiff = document.getElementById("team_weekly_average_vs_league");
}
function fadeTeam(element, league, teamID) {
    var op = 1; // initial opacity
    var timer = setInterval(function () {
        if (op <= 0.1) {
            clearInterval(timer);
            updateTeamPill(league, teamID);
        }
        element.style.opacity = op;
        element.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op -= op * 0.1;
    }, 5);
}
function unfade(element) {
    var op = 0.1; // initial opacity
    element.style.display = 'block';
    var timer = setInterval(function () {
        if (op >= 1) {
            clearInterval(timer);
        }
        element.style.opacity = op;
        element.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op += op * 0.1;
    }, 5);
}
//# sourceMappingURL=Page_Updates.js.map