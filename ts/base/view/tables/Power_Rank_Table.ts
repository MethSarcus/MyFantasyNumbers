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

function createPowerRankTableHtml(league: League) {
    const tableBody: HTMLTableElement = document.getElementById("power_rank_table_body") as HTMLTableElement;
    league.members.forEach((member) => {
        const row = document.createElement("tr");
        const teamName = document.createElement("td");
        const powerRank = document.createElement("td");
        const powerRecord = document.createElement("td");
        const potentialRecord = document.createElement("td");
        const actualRank = document.createElement("td");
        const image = document.createElement("img");
        const diffRow = document.createElement("td");

        image.src = member.logoURL;
        image.style.width = "25px";
        image.style.height = "25px";
        image.style.borderRadius = "25px";
        image.addEventListener("error", fixNoImage);
        image.style.marginRight = "8px";

        teamName.appendChild(image);
        teamName.appendChild(document.createTextNode(member.teamNameToString()));
        powerRank.innerText = member.stats.powerRank + "";
        powerRecord.innerText = member.powerRecordToString();
        potentialRecord.innerText = member.potentialPowerRecordToString();
        actualRank.innerText = member.stats.rank + "";
        const diffText = member.stats.rank - member.stats.powerRank;
        if (diffText !== 0) {
            diffRow.style.backgroundColor = getDarkColor(league.getPowerRankDiffFinish(member.teamID) / league.members.length);
        }
        actualRank.style.backgroundColor = getDarkColor(member.stats.rank / league.members.length);
        powerRank.style.backgroundColor = getDarkColor(member.stats.powerRank / league.members.length);
        diffRow.innerText = (diffText as unknown as string);
        row.appendChild(teamName);
        row.appendChild(powerRank);
        row.appendChild(actualRank);
        row.appendChild(diffRow);
        row.appendChild(powerRecord);
        tableBody.appendChild(row);
    });
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
