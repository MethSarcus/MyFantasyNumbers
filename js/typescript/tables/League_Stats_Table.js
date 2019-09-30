function createLeagueStatsTable(league) {
    var tableBody = document.getElementById('league_stats_table_body');
    league.members.forEach(function (member) {
        tableBody.appendChild(createLeagueStatsTableRow(member));
    });
}
function createLeagueStatsTableRow(member) {
    var row = document.createElement('tr');
    var rankCell = document.createElement('td');
    var teamNameCell = document.createElement('td');
    var recordCell = document.createElement('td');
    var pfCell = document.createElement('td');
    var paCell = document.createElement('td');
    var ppCell = document.createElement('td');
    var pctCell = document.createElement('td');
    rankCell.appendChild(document.createTextNode(member.stats.rank.toString()));
    pfCell.appendChild(document.createTextNode(roundToHundred(member.stats.pf).toString()));
    paCell.appendChild(document.createTextNode(roundToHundred(member.stats.pa).toString()));
    ppCell.appendChild(document.createTextNode(roundToHundred(member.stats.pp).toString()));
    recordCell.appendChild(document.createTextNode(member.recordToString()));
    teamNameCell.appendChild(document.createTextNode(member.nameToString()));
    pctCell.appendChild(document.createTextNode(member.stats.getWinPct() + "%"));
    row.appendChild(rankCell);
    row.appendChild(teamNameCell);
    row.appendChild(recordCell);
    row.appendChild(pctCell);
    row.appendChild(pfCell);
    row.appendChild(paCell);
    row.appendChild(ppCell);
    return row;
}
//# sourceMappingURL=League_Stats_Table.js.map