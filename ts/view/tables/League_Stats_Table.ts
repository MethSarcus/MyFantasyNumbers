function createLeagueStatsTable(league: League): void {
    const tableBody = document.getElementById("league_stats_table_body");
    league.members.forEach((member) => {
        tableBody.appendChild(createLeagueStatsTableRow(member));
    });
}

function createLeagueStatsTableRow(member: Member): HTMLTableRowElement {
    const row = document.createElement("tr");
    const rankCell = document.createElement("td");
    const teamNameCell = document.createElement("td");
    const recordCell = document.createElement("td");
    const pfCell = document.createElement("td");
    const paCell = document.createElement("td");
    const ppCell = document.createElement("td");
    const pctCell = document.createElement("td");
    let pctText = "%";

    rankCell.appendChild(document.createTextNode(member.stats.rank.toString()));
    pfCell.appendChild(document.createTextNode(roundToHundred(member.stats.pf).toString()));
    paCell.appendChild(document.createTextNode(roundToHundred(member.stats.pa).toString()));
    ppCell.appendChild(document.createTextNode(roundToHundred(member.stats.pp).toString()));
    recordCell.appendChild(document.createTextNode(member.recordToString()));
    teamNameCell.appendChild(document.createTextNode(member.nameToString()));
    if (member.stats.getWinPct() === 0 || member.stats.getWinPct() === 1) {
        pctText = ".00" + pctText;
    }
    pctCell.appendChild(document.createTextNode(member.stats.getWinPct() + pctText));

    row.appendChild(rankCell);
    row.appendChild(teamNameCell);
    row.appendChild(recordCell);
    row.appendChild(pctCell);
    row.appendChild(pfCell);
    row.appendChild(paCell);
    row.appendChild(ppCell);

    return row;
}
