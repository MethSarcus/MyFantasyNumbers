function createLeagueStatsTable(league: League): void {
    initLeagueStatsTable(league);
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
        PA: roundToHundred(member.stats.pa),
        GP: roundToHundred(member.stats.gutPoints)
    };
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
            }
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
