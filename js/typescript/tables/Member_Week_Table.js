function updateMemberWeekTable(league, member) {
    $('#member_week_table_body').empty();
    var weekTable = document.getElementById('memberWeekTable');
    var tableBody = document.getElementById('member_week_table_body');
    league.weeks.forEach(function (week) {
        var curMatchup = week.getTeamMatchup(member.teamID);
        var curTeam = week.getTeam(member.teamID);
        var row = document.createElement('tr');
        var weekCell = document.createElement('td');
        var scoreCell = document.createElement('td');
        var vsCell = document.createElement('td');
        var marginCell = document.createElement('td');
        weekCell.appendChild(document.createTextNode(week.weekNumber.toString()));
        scoreCell.appendChild(document.createTextNode(roundToHundred(curTeam.score).toString()));
        if (!curMatchup.byeWeek) {
            vsCell.appendChild(document.createTextNode(league.getMember(curMatchup.getOpponent(member.teamID).teamID).teamAbbrev));
            marginCell.appendChild(document.createTextNode(roundToHundred(curTeam.score - curMatchup.getOpponent(member.teamID).score).toString()));
        }
        else {
            vsCell.appendChild(document.createTextNode("N/A"));
            marginCell.appendChild(document.createTextNode("N/A"));
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
//# sourceMappingURL=Member_Week_Table.js.map