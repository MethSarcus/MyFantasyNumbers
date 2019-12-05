function createLeagueStatsTable(league: League): void {
    const tableBody = document.getElementById("league_stats_table_body");
    league.members.forEach((member) => {
        tableBody.appendChild(createLeagueStatsTableRow(league, member));
    });
}

function createLeagueStatsTableRow(league: League, member: Member): HTMLTableRowElement {
    const row = document.createElement("tr");
    const rankCell = document.createElement("td");
    const teamNameCell = document.createElement("td");
    const recordCell = document.createElement("td");
    const pfCell = document.createElement("td");
    const paCell = document.createElement("td");
    const ppCell = document.createElement("td");
    const opslapCell = document.createElement("td");
    const pctCell = document.createElement("td");
    const image = document.createElement("img");
    let pctText = "%";
    image.src = member.logoURL;
    image.style.width = "25px";
    image.style.height = "25px";
    image.style.borderRadius = "25px";
    image.addEventListener("error", fixNoImage);
    image.style.marginRight = "8px";

    teamNameCell.appendChild(image);
    teamNameCell.appendChild(document.createTextNode(member.teamNameToString()));
    rankCell.appendChild(document.createTextNode(member.stats.rank.toString()));
    pfCell.appendChild(document.createTextNode(roundToHundred(member.stats.pf).toString()));
    paCell.appendChild(document.createTextNode(roundToHundred(member.stats.pa).toString()));
    ppCell.appendChild(document.createTextNode(roundToHundred(member.stats.pp).toString()));
    opslapCell.appendChild(document.createTextNode(roundToHundred(member.stats.OPSLAP).toString()));
    recordCell.appendChild(document.createTextNode(member.recordToString()));
    if (member.stats.getWinPct() === 0 || member.stats.getWinPct() === 1) {
        pctText = ".00" + pctText;
    }
    pctCell.appendChild(document.createTextNode(member.stats.getWinPct() + pctText));
    rankCell.style.backgroundColor = getDarkColor(member.stats.rank / league.members.length);
    pfCell.style.backgroundColor = getDarkColor(league.getPointsScoredFinish(member.teamID) / league.members.length);
    paCell.style.backgroundColor = getDarkColor(league.getPointsAgainstFinish(member.teamID) / league.members.length);
    ppCell.style.backgroundColor = getDarkColor(league.getPotentialPointsFinish(member.teamID) / league.members.length);
    opslapCell.style.backgroundColor = getDarkColor(league.getOPSLAPFinish(member.teamID) / league.members.length);
    row.appendChild(teamNameCell);
    row.appendChild(rankCell);
    row.appendChild(recordCell);
    row.appendChild(pctCell);
    row.appendChild(pfCell);
    row.appendChild(opslapCell);
    row.appendChild(ppCell);
    row.appendChild(paCell);

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
                data: "OPSLAP"
            },
            {
                data: "PP"
            },
            {
                data: "PA"
            },
        ],
    });
}
