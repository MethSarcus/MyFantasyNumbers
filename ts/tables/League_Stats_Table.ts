function createLeagueStatsTable(league: League): void {
    var tableBody = document.getElementById('league_stats_table_body');
    league.members.forEach(member => {
        tableBody.appendChild(createLeagueStatsTableRow(member));
    });
}

function createLeagueStatsTableRow(member: Member): HTMLTableRowElement {
    var row = document.createElement('tr');
    let rankCell = document.createElement('td');
    let teamNameCell = document.createElement('td');
    let recordCell = document.createElement('td');
    let pfCell = document.createElement('td');
    let paCell = document.createElement('td');
    let ppCell = document.createElement('td');
    let pctCell = document.createElement('td');

    rankCell.appendChild(document.createTextNode(member.stats.finalStanding.toString()));
    pfCell.appendChild(document.createTextNode(roundToHundred(member.stats.pf).toString()));
    paCell.appendChild(document.createTextNode(roundToHundred(member.stats.pa).toString()));
    ppCell.appendChild(document.createTextNode(roundToHundred(member.stats.pp).toString()));
    recordCell.appendChild(document.createTextNode(member.finishToString()));
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