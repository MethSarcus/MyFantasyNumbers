function createPowerRankTable(league: League) {
    initPowerRankTable(league);
    updatePowerRankTable(league);
}

function updatePowerRankTable(league: League) {
    const table = $("#power_rank_table").DataTable();
    table.clear();
    league.members.forEach((member) => {
        table.row.add(getPowerRankStatsRowData(member));
    });
    table.draw();
}

function getPowerRankStatsRowData(member: Member): object {
    const image = document.createElement("img");
    image.src = member.logoURL;
    image.style.width = "25px";
    image.style.height = "25px";
    image.style.borderRadius = "25px";
    image.style.marginRight = "8px";

    return {
        "Team": image.outerHTML + member.teamNameToString(),
        "Power Rank": member.stats.powerRank,
        "Actual Rank": member.stats.rank,
        "Difference": member.stats.powerRank - member.stats.rank,
        "Power Record": member.powerRecordToString(),
    };
}

function initPowerRankTable(league: League) {
    $("#power_rank_table").DataTable({
        paging: false,
        searching: false,
        order: [[1, "asc"]],
        columns: [
            { data: "Team" },
            {
                data: "Power Rank",
                render: renderTableOrdinalNumber
            },
            {
                data: "Actual Rank",
                render: renderTableOrdinalNumber
            },
            {
                data: "Difference",
                render: renderTableDifferenceNumber
            },
            {
                data: "Power Record",
                render: sortTableRecord
            },
        ],
        createdRow(row: any, data: any, index: any) {
            // tslint:disable-next-line: no-string-literal
            const member = league.getMemberByPowerStats(data["Team"].split('margin-right: 8px;">')[1], data["Actual Rank"], data["Power Rank"], data["Power Record"]);
            $("td", row).eq(1).css( "background-color",  getDarkColor(member.stats.powerRank / league.members.length));
            $("td", row).eq(2).css( "background-color",  getDarkColor(member.stats.rank / league.members.length));
            if (league.getPowerRankDiffFinish(member.teamID) !== 0) {
                $("td", row).eq(3).css( "background-color",  getDarkColor(league.getPowerRankDiffFinish(member.teamID) / league.members.length));
            }
        },
    });
}
