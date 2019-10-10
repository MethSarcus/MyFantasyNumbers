function updateMemberWeekTable(league: League, member: Member): void {
    $('#member_week_table_body').empty();
    var weekTable = document.getElementById('memberWeekTable');
    var tableBody = document.getElementById('member_week_table_body');
    league.weeks.forEach((week) => {
        let scoreColor = getLightCardColor(week.getTeamScoreFinish(member.teamID), league.members.length);
        let curMatchup = week.getTeamMatchup(member.teamID);
        let curTeam = week.getTeam(member.teamID);
        let row = document.createElement('tr');
        let weekCell = document.createElement('td');
        let scoreCell = document.createElement('td');
        let vsCell = document.createElement('td');
        let marginCell = document.createElement('td');
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
            marginCell.style.background = getLightCardColor(league.getMarginFinish(member.teamID, week.weekNumber), week.matchups.filter(it => {return !it.byeWeek;}).length * 2);
        }
        row.appendChild(weekCell);
        row.appendChild(scoreCell);
        row.appendChild(vsCell);
        row.appendChild(marginCell);
        //console.log(tableBody);
        tableBody.appendChild(row);
    });
    //weekTable.appendChild(tableHead);
    weekTable.appendChild(tableBody);
}

function createMemberWeekTable(league: League): void {
    var weekTable = document.getElementById('memberWeekTable');
    var tableBody = document.getElementById('member_week_table_body');
    for (var i = 1; i <= league.settings.regularSeasonLength; i++) {
        let row = document.createElement('tr');
        let weekCell = document.createElement('td');
        let scoreCell = document.createElement('td');
        let vsCell = document.createElement('td');
        let marginCell = document.createElement('td');
        marginCell.id = "week_" + i + "_margin";
        weekCell.appendChild(document.createTextNode(i.toString()));
    }
}