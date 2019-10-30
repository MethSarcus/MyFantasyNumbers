function createLeagueStatsTable(league) {
    var tableBody = document.getElementById("league_stats_table_body");
    league.members.forEach(function (member) {
        tableBody.appendChild(createLeagueStatsTableRow(league, member));
    });
}
function createLeagueStatsTableRow(league, member) {
    var row = document.createElement("tr");
    var rankCell = document.createElement("td");
    var teamNameCell = document.createElement("td");
    var recordCell = document.createElement("td");
    var pfCell = document.createElement("td");
    var paCell = document.createElement("td");
    var ppCell = document.createElement("td");
    var pctCell = document.createElement("td");
    var image = document.createElement("img");
    var pctText = "%";
    image.src = member.logoURL;
    image.style.width = "25px";
    image.style.height = "25px";
    image.style.borderRadius = "25px";
    image.addEventListener("error", fixNoImage);
    image.style.marginRight = "8px";
    teamNameCell.appendChild(image);
    teamNameCell.appendChild(document.createTextNode(member.nameToString()));
    rankCell.appendChild(document.createTextNode(member.stats.rank.toString()));
    pfCell.appendChild(document.createTextNode(roundToHundred(member.stats.pf).toString()));
    paCell.appendChild(document.createTextNode(roundToHundred(member.stats.pa).toString()));
    ppCell.appendChild(document.createTextNode(roundToHundred(member.stats.pp).toString()));
    recordCell.appendChild(document.createTextNode(member.recordToString()));
    if (member.stats.getWinPct() === 0 || member.stats.getWinPct() === 1) {
        pctText = ".00" + pctText;
    }
    pctCell.appendChild(document.createTextNode(member.stats.getWinPct() + pctText));
    rankCell.style.backgroundColor = getDarkColor(member.stats.rank / league.members.length);
    pfCell.style.backgroundColor = getDarkColor(league.getPointsScoredFinish(member.teamID) / league.members.length);
    paCell.style.backgroundColor = getInverseCardColor(league.getPointsAgainstFinish(member.teamID), league.members.length);
    ppCell.style.backgroundColor = getDarkColor(league.getPotentialPointsFinish(member.teamID) / league.members.length);
    row.appendChild(teamNameCell);
    row.appendChild(rankCell);
    row.appendChild(recordCell);
    row.appendChild(pctCell);
    row.appendChild(pfCell);
    row.appendChild(paCell);
    row.appendChild(ppCell);
    return row;
}
function initLeagueStatsTable() {
    $("#league_stats_table").DataTable({
        paging: false,
        searching: false,
        order: [[1, "asc"]],
        columns: [
            { data: "Team" },
            {
                data: "Rank",
                render: renderTableOrdinalNumber
            },
            {
                data: "Record",
                sort: sortTableByRecord
            },
            {
                data: "Pct",
            },
            {
                data: "PF"
            },
            {
                data: "PA"
            },
            {
                data: "PP"
            },
        ],
    });
}
//# sourceMappingURL=League_Stats_Table.js.map