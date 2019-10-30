function createPowerRankTable(league) {
    var tableBody = document.getElementById("power_rank_table_body");
    league.members.forEach(function (member) {
        var row = document.createElement("tr");
        var teamName = document.createElement("td");
        var powerRank = document.createElement("td");
        var powerRecord = document.createElement("td");
        var potentialRecord = document.createElement("td");
        var actualRank = document.createElement("td");
        var image = document.createElement("img");
        var diffRow = document.createElement("td");
        image.src = member.logoURL;
        image.style.width = "25px";
        image.style.height = "25px";
        image.style.borderRadius = "25px";
        image.addEventListener("error", fixNoImage);
        image.style.marginRight = "8px";
        teamName.appendChild(image);
        teamName.appendChild(document.createTextNode(member.nameToString()));
        powerRank.innerText = member.stats.powerRank + "";
        powerRecord.innerText = member.powerRecordToString();
        potentialRecord.innerText = member.potentialPowerRecordToString();
        actualRank.innerText = member.stats.rank + "";
        var diffText = member.stats.rank - member.stats.powerRank;
        if (diffText !== 0) {
            diffRow.style.backgroundColor = getDarkColor(league.getPowerRankDiffFinish(member.teamID) / league.members.length);
        }
        actualRank.style.backgroundColor = getDarkColor(member.stats.rank / league.members.length);
        powerRank.style.backgroundColor = getDarkColor(member.stats.powerRank / league.members.length);
        diffRow.innerText = diffText;
        row.appendChild(teamName);
        row.appendChild(actualRank);
        row.appendChild(powerRank);
        row.appendChild(diffRow);
        row.appendChild(powerRecord);
        tableBody.appendChild(row);
    });
}
function initPowerRankTable() {
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
                sort: sortTableByRecord
            },
        ],
    });
}
//# sourceMappingURL=Power_Rank_Table.js.map