function updateMemberWeekTable(league: League, member: Member): void {
    $("#member_week_table_body").empty();
    const weekTable = document.getElementById("memberWeekTable");
    const tableBody = document.getElementById("member_week_table_body");
    league.weeks.forEach((week) => {
        const scoreColor = getLightCardColor(week.getTeamScoreFinish(member.teamID), league.members.length);
        const curMatchup = week.getTeamMatchup(member.teamID);
        const curTeam = week.getTeam(member.teamID);
        const row = document.createElement("tr");
        const weekCell = document.createElement("td");
        const scoreCell = document.createElement("td");
        const vsCell = document.createElement("td");
        const marginCell = document.createElement("td");
        weekCell.appendChild(document.createTextNode(week.weekNumber.toString()));
        scoreCell.appendChild(document.createTextNode(roundToHundred(curTeam.score).toString()));
        scoreCell.style.background = scoreColor;
        weekCell.style.background = scoreColor;
        vsCell.style.background = scoreColor;
        if (!curMatchup.byeWeek) {
            vsCell.appendChild(document.createTextNode(league.getMember(curMatchup.getOpponent(member.teamID).teamID).teamAbbrev));
            marginCell.appendChild(document.createTextNode(roundToHundred(curTeam.score - curMatchup.getOpponent(member.teamID).score).toString()));
        } else {
            vsCell.appendChild(document.createTextNode("N/A"));
            marginCell.appendChild(document.createTextNode("N/A"));
        }
        if (!curMatchup.byeWeek) {
            marginCell.style.background = getLightCardColor(league.getMarginFinish(member.teamID, week.weekNumber), week.matchups.filter((it) => !it.byeWeek).length * 2);
        }
        row.appendChild(weekCell);
        row.appendChild(scoreCell);
        row.appendChild(vsCell);
        row.appendChild(marginCell);
        tableBody.appendChild(row);
    });
    weekTable.appendChild(tableBody);
}

// this function is to create vs populate
function createMemberWeekTable(league: League): void {
    const weekTable = document.getElementById("memberWeekTable");
    const tableBody = document.getElementById("member_week_table_body");
    for (let i = 1; i <= league.settings.regularSeasonLength; i++) {
        const row = document.createElement("tr");
        const weekCell = document.createElement("td");
        const scoreCell = document.createElement("td");
        const vsCell = document.createElement("td");
        const marginCell = document.createElement("td");
        marginCell.id = "week_" + i + "_margin";
        weekCell.appendChild(document.createTextNode(i.toString()));
    }
}
