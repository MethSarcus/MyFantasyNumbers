function createLeagueStatsTable(league: League): void {
    initLeagueStatsTable(league);
    // league.members.forEach((member) => {
    //     tableBody.appendChild(createLeagueStatsTableRow(league, member));
    // });
    updateLeagueStatsTable(league);

}

function updateLeagueStatsTable(league: League): void {
    const table = $("#league_stats_table").DataTable();
    table.clear();
    league.members.forEach((member) => {
        table.row.add(getLeagueStatsTableRowData(member));
    });
    table.draw();
    $("#league_stats_table tr").hover(function() {
        $(this).addClass("hover");
        deselectLeagueLineData($(this).find("td:first-child").text());
    }, function() {
        $(this).removeClass("hover");
        reselectLeagueLineData();
    });
}

function getLeagueStatsTableRowData(member: Member): object {
    const image = document.createElement("img");
    image.src = member.logoURL;
    image.style.width = "25px";
    image.style.height = "25px";
    image.style.borderRadius = "25px";
    image.style.marginRight = "8px";
    return {
        Team: image.outerHTML + member.teamNameToString(),
        Rank: member.stats.rank,
        Record: member.recordToString(),
        Pct: member.stats.getWinPct().toString(),
        PF: roundToHundred(member.stats.pf),
        OPSLAP: roundToHundred(member.stats.OPSLAP),
        PP: roundToHundred(member.stats.pp),
        PA: roundToHundred(member.stats.pa)
    };
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
    pctCell.appendChild(document.createTextNode(member.stats.getWinPct().toString()));
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

function initLeagueStatsTable(league: League) {
    $("#league_stats_table").DataTable({
        paging: false,
        searching: false,
        orderClasses: true,
        order: [[1, "asc"]],
        columns: [
            { data: "Team"},
            {
                data: "Rank",
                render: renderTableOrdinalNumber
            },
            {
                data: "Record",
                render: sortTableRecord
            },
            {
                data: "Pct",
                render: renderTablePercentage
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
        createdRow( row: any, data: any, index: any ) {
            const member = league.getMemberByStats(data.PF, data.PA, data.PP, data.OPSLAP, data.Record);
            $("td", row).eq(0);
            $("td", row).eq(1).css( "background-color",  getDarkColor(member.stats.rank / league.members.length));
            $("td", row).eq(2);
            $("td", row).eq(3);
            $("td", row).eq(4).css( "background-color",  getDarkColor(league.getPointsScoredFinish(member.teamID) / league.members.length));
            $("td", row).eq(5).css( "background-color",  getDarkColor(league.getOPSLAPFinish(member.teamID) / league.members.length));
            $("td", row).eq(6).css( "background-color",  getDarkColor(league.getPotentialPointsFinish(member.teamID) / league.members.length));
            $("td", row).eq(7).css( "background-color",  getDarkColor(league.getPointsAgainstFinish(member.teamID) / league.members.length));

        },
    });
}
