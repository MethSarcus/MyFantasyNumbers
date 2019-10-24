function createPowerRankTable(league: League) {
    const tableBody: HTMLTableElement = document.getElementById("power_rank_table_body") as HTMLTableElement;
    league.members.forEach((member) => {
        const row = document.createElement("tr");
        const teamName = document.createElement("td");
        const powerRank = document.createElement("td");
        const powerRecord = document.createElement("td");
        const winPct = document.createElement("td");
        const potentialRecord = document.createElement("td");
        const potentialWinPct = document.createElement("td");
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
        teamName.appendChild(document.createTextNode(member.nameToString()));
        powerRank.innerText = member.stats.powerRank + "";
        powerRecord.innerText =  member.powerRecordToString();
        potentialRecord.innerText = member.potentialPowerRecordToString();
        winPct.innerText = member.stats.getPowerWinPct() + "%";
        potentialWinPct.innerText = member.stats.getPotentialPowerWinPct() + "%";
        actualRank.innerText = member.stats.rank + "";
        const diffText = member.stats.rank - member.stats.powerRank;
        if (diffText !== 0) {
            diffRow.style.backgroundColor = getDarkColor(league.getPowerRankDiffFinish(member.teamID) / league.members.length);
        }
        diffRow.innerText = (diffText as unknown as string);
        row.appendChild(teamName);
        row.appendChild(actualRank);
        row.appendChild(powerRank);
        row.appendChild(diffRow);
        row.appendChild(powerRecord);
        row.appendChild(potentialRecord);
        row.appendChild(winPct);
        row.appendChild(potentialWinPct);
        tableBody.appendChild(row);

    });
}
